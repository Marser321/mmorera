'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Github, Send, Bot, X } from 'lucide-react';

export default function Footer() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8 bg-[#0B0B0F] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8A2BE2]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-bold tracking-wider text-white mb-6 block">
              NEXUS<span className="text-gradient">.AI</span>
            </span>
            <p className="text-gray-400 max-w-sm mb-8">
              Construyendo el futuro de la automatización empresarial con inteligencia artificial modular y escalable.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00F0FF]/50 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00F0FF]/50 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00F0FF]/50 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Plataforma</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Módulos</a></li>
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Casos de Uso</a></li>
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Documentación</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Compañía</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-[#00F0FF] transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Nexus AI Agency. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>

      {/* Simulated NotebookLM Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="w-80 sm:w-96 h-[500px] glass-panel rounded-2xl flex flex-col shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8A2BE2] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Nexus Assistant</h4>
                  <p className="text-xs text-[#00F0FF]">Powered by NotebookLM</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[85%] text-sm text-gray-200">
                ¡Hola! Soy el asistente virtual de Nexus. He analizado toda la documentación de nuestros módulos de IA. ¿En qué te puedo ayudar hoy?
              </div>
              <div className="bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 rounded-2xl rounded-tr-none p-3 max-w-[85%] self-end text-sm text-white">
                Me gustaría saber más sobre el módulo de CRM Inteligente.
              </div>
              <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[85%] text-sm text-gray-200">
                Nuestro CRM Inteligente utiliza modelos predictivos para analizar el comportamiento de tus clientes. Puede automatizar seguimientos, predecir el 'churn rate' y sugerir acciones de upselling. ¿Te gustaría agendar una demo técnica?
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Escribe tu mensaje..." 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00F0FF] hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:scale-110 transition-transform"
          >
            <Bot className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </footer>
  );
}
