'use client';

import { useState, useRef } from 'react';
import { 
  LayoutDashboard, Search, FileText, Settings, Image as ImageIcon, 
  Video, Sparkles, Wand2, Upload, Loader2, Download, Zap, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { GoogleGenAI } from '@google/genai';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: false },
  { icon: Search, label: 'SEO Panel', href: '/seo', active: false },
  { icon: FileText, label: 'Content', href: '/portal', active: false },
  { icon: ImageIcon, label: 'AI Studio', href: '/studio', active: true },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

export default function StudioPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'video'>('generate');
  
  // Generation State
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Editing State
  const [editPrompt, setEditPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoSourceImage, setVideoSourceImage] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      // Check for API key selection for Pro Image
      if (window.aistudio && await window.aistudio.hasSelectedApiKey() === false) {
        await window.aistudio.openSelectKey();
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: size
          }
        }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setSource: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = async () => {
    if (!editPrompt || !sourceImage) return;
    setIsEditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      const base64Data = sourceImage.split(',')[1];
      const mimeType = sourceImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: editPrompt }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setEditedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Error editing image:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoSourceImage) return;
    setIsGeneratingVideo(true);
    try {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey() === false) {
        await window.aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      const base64Data = videoSourceImage.split(',')[1];
      const mimeType = videoSourceImage.split(';')[0].split(':')[1];

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt || undefined,
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(downloadLink, {
          headers: { 'x-goog-api-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY as string }
        });
        const blob = await videoResponse.blob();
        setGeneratedVideo(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

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
            <Wand2 className="w-6 h-6 text-primary-light" />
            AI Studio
          </h1>
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button onClick={() => setActiveTab('generate')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'generate' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Generar</button>
            <button onClick={() => setActiveTab('edit')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'edit' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Editar</button>
            <button onClick={() => setActiveTab('video')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'video' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Animar</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative z-0">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            
            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Generador de Imágenes Pro</h2>
                    <p className="text-slate-400 text-sm">Crea imágenes fotorrealistas con Nano Banana Pro.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Prompt</label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Un robot futurista trabajando en un escritorio con monitores holográficos..."
                      className="input-glass w-full rounded-xl p-4 text-sm min-h-[120px] resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Resolución</label>
                    <div className="flex gap-2">
                      {['1K', '2K', '4K'].map((s) => (
                        <button 
                          key={s} 
                          onClick={() => setSize(s as any)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${size === s ? 'bg-primary/20 border-primary text-primary-light' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateImage}
                    disabled={!prompt || isGenerating}
                    className="crystal-btn w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 mt-auto disabled:opacity-50"
                  >
                    {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generando...</> : <><Sparkles className="w-5 h-5" /> Generar Imagen</>}
                  </button>
                </div>
                <div className="glass-panel rounded-2xl border border-white/10 flex items-center justify-center min-h-[400px] overflow-hidden relative">
                  {generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center gap-3">
                      <ImageIcon className="w-12 h-12 opacity-50" />
                      <p>La imagen generada aparecerá aquí</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Edit Tab */}
            {activeTab === 'edit' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Editor Mágico</h2>
                    <p className="text-slate-400 text-sm">Edita imágenes usando instrucciones de texto con Gemini Flash.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Imagen Original</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-300">Subir imagen</span>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setSourceImage)} />
                    </div>
                    {sourceImage && <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Imagen cargada</div>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Instrucción de Edición</label>
                    <input 
                      type="text"
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="Ej: Añade un filtro retro, elimina el fondo..."
                      className="input-glass w-full rounded-xl p-3 text-sm"
                    />
                  </div>

                  <button 
                    onClick={handleEditImage}
                    disabled={!editPrompt || !sourceImage || isEditing}
                    className="crystal-btn w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 mt-auto disabled:opacity-50"
                  >
                    {isEditing ? <><Loader2 className="w-5 h-5 animate-spin" /> Editando...</> : <><Wand2 className="w-5 h-5" /> Aplicar Edición</>}
                  </button>
                </div>
                <div className="glass-panel rounded-2xl border border-white/10 flex items-center justify-center min-h-[400px] overflow-hidden relative">
                  {editedImage ? (
                    <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                  ) : sourceImage ? (
                    <img src={sourceImage} alt="Source" className="w-full h-full object-contain opacity-50" />
                  ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center gap-3">
                      <ImageIcon className="w-12 h-12 opacity-50" />
                      <p>Sube una imagen para comenzar</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Tab */}
            {activeTab === 'video' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Animación con Veo</h2>
                    <p className="text-slate-400 text-sm">Da vida a tus imágenes generando videos de alta calidad.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Imagen Base</label>
                    <div 
                      onClick={() => videoFileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-300">Subir imagen (16:9 recomendado)</span>
                      <input type="file" ref={videoFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setVideoSourceImage)} />
                    </div>
                    {videoSourceImage && <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Imagen cargada</div>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Prompt (Opcional)</label>
                    <input 
                      type="text"
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Ej: La cámara hace un paneo lento..."
                      className="input-glass w-full rounded-xl p-3 text-sm"
                    />
                  </div>

                  <button 
                    onClick={handleGenerateVideo}
                    disabled={!videoSourceImage || isGeneratingVideo}
                    className="crystal-btn w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 mt-auto disabled:opacity-50"
                  >
                    {isGeneratingVideo ? <><Loader2 className="w-5 h-5 animate-spin" /> Generando Video (puede tardar)...</> : <><Video className="w-5 h-5" /> Animar Imagen</>}
                  </button>
                </div>
                <div className="glass-panel rounded-2xl border border-white/10 flex items-center justify-center min-h-[400px] overflow-hidden relative bg-black">
                  {generatedVideo ? (
                    <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-contain" />
                  ) : videoSourceImage ? (
                    <img src={videoSourceImage} alt="Source" className="w-full h-full object-contain opacity-50" />
                  ) : (
                    <div className="text-center text-slate-500 flex flex-col items-center gap-3">
                      <Video className="w-12 h-12 opacity-50" />
                      <p>Sube una imagen para animar</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
