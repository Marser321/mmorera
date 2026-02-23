'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Search, FileText, Settings, Image as ImageIcon, 
  Mic, Zap, ChevronLeft, ChevronRight, Loader2, StopCircle, Play
} from 'lucide-react';
import Link from 'next/link';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: false },
  { icon: Search, label: 'SEO Panel', href: '/seo', active: false },
  { icon: FileText, label: 'Content', href: '/portal', active: false },
  { icon: ImageIcon, label: 'AI Studio', href: '/studio', active: false },
  { icon: Mic, label: 'Voice Assistant', href: '/voice', active: true },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

export default function VoicePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  // Note: A full implementation of the Live API requires complex Web Audio API logic
  // for encoding/decoding PCM audio. This is a simplified frontend structure.
  
  const connectToLiveAPI = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      
      // Initialize Audio Context for playback
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "Eres un asistente de voz experto para la plataforma Nexus.AI. Responde de manera concisa y profesional.",
        },
        callbacks: {
          onopen: async () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            // Request microphone access
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              mediaStreamRef.current = stream;
              
              // In a real implementation, we would set up an AudioWorklet or ScriptProcessor
              // to capture PCM data and send it via session.sendRealtimeInput
              // For this demo, we'll just show the UI state.
              
            } catch (err) {
              console.error("Error accessing microphone:", err);
              setError("No se pudo acceder al micrófono.");
            }
          },
          onmessage: (message: LiveServerMessage) => {
            // Handle incoming audio and transcriptions
            // In a real implementation, we decode base64 PCM and play it
            if (message.serverContent?.modelTurn) {
              // Simulated transcript update
            }
          },
          onclose: () => {
            setIsConnected(false);
            cleanup();
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Error de conexión con el servidor de voz.");
            setIsConnected(false);
            cleanup();
          }
        }
      });
      
      sessionRef.current = sessionPromise;
      
    } catch (err) {
      console.error("Failed to connect:", err);
      setError("Fallo al iniciar la sesión de voz.");
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
    }
    cleanup();
    setIsConnected(false);
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17] flex overflow-hidden selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 bg-[#161b22]/50 backdrop-blur-md border-r border-white/10 transition-all duration-300 flex flex-col relative z-20`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10">
          {isSidebarOpen ? (
            <Link href="/" className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-wide">Control IA</span>
            </Link>
          ) : (
            <Link href="/" className="size-8 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30 mx-auto">
              <Zap className="w-4 h-4 text-white" />
            </Link>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors absolute -right-3 top-6 bg-[#0a0e17] border border-white/10">
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link key={index} href={item.href} className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-xl transition-all ${item.active ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(37,106,244,0.15)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 border-b border-white/10 flex items-center px-8 justify-between flex-shrink-0 z-10 bg-[#0a0e17]/80 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-primary-light" />
            Voice Assistant
          </h1>
        </header>

        <div className="flex-1 overflow-auto p-8 relative z-0 flex items-center justify-center">
          <div className="w-full max-w-2xl glass-card rounded-3xl p-10 border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-1000 ${isConnected ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] transition-all duration-1000 ${isConnected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${isConnected ? 'bg-primary/20 shadow-[0_0_50px_rgba(37,106,244,0.4)] border border-primary/50' : 'bg-white/5 border border-white/10'}`}>
                {isConnected ? (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <div className="absolute inset-0 rounded-full border-2 border-primary-light animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <Mic className="w-12 h-12 text-primary-light animate-pulse" />
                  </div>
                ) : (
                  <Mic className="w-12 h-12 text-slate-500" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                {isConnected ? 'Escuchando...' : 'Inicia una conversación'}
              </h2>
              <p className="text-slate-400 mb-10 max-w-md">
                {isConnected 
                  ? 'Habla con tu asistente de IA en tiempo real. Puede ayudarte a analizar datos, planificar estrategias o redactar contenido.' 
                  : 'Conéctate a la API Live de Gemini para interactuar por voz con tu asistente de negocios.'}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {isConnected ? (
                <button 
                  onClick={disconnect}
                  className="px-8 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-full font-bold flex items-center gap-3 transition-all"
                >
                  <StopCircle className="w-5 h-5" /> Terminar Conversación
                </button>
              ) : (
                <button 
                  onClick={connectToLiveAPI}
                  disabled={isConnecting}
                  className="crystal-btn px-8 py-4 text-white rounded-full font-bold flex items-center gap-3 transition-all disabled:opacity-50"
                >
                  {isConnecting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Conectando...</>
                  ) : (
                    <><Play className="w-5 h-5" /> Iniciar Asistente de Voz</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
