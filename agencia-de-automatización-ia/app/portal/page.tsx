'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  BarChart, 
  LifeBuoy, 
  ChevronLeft, 
  ChevronRight,
  Youtube,
  Sparkles,
  Loader2,
  CheckCircle2,
  Lock,
  X,
  Zap,
  Search,
  FileText,
  Settings
} from 'lucide-react';
import Link from 'next/link';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: false },
  { icon: Search, label: 'SEO Panel', href: '/seo', active: false },
  { icon: FileText, label: 'Content', href: '/portal', active: true },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

const generationSteps = [
  'Iniciando conexión con YouTube...',
  'IA analizando transcripción de video...',
  'Extrayendo puntos clave y contexto...',
  'IA redactando contenido optimizado para SEO...',
  'Generando metadatos y etiquetas...',
  'Finalizando documento...'
];

export default function PortalPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = () => {
    if (!url) return;
    setIsGenerating(true);
    setCurrentStep(0);
    setIsFinished(false);
    setShowUpsell(false);
  };

  useEffect(() => {
    if (isGenerating && currentStep < generationSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000); // 2 seconds per step
      return () => clearTimeout(timer);
    } else if (isGenerating && currentStep === generationSteps.length) {
      setIsGenerating(false);
      setIsFinished(true);
      setTimeout(() => setShowUpsell(true), 1000);
    }
  }, [isGenerating, currentStep]);

  return (
    <div className="min-h-screen bg-[#0a0e17] flex overflow-hidden selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } flex-shrink-0 bg-[#161b22]/50 backdrop-blur-md border-r border-white/10 transition-all duration-300 flex flex-col relative z-20`}
      >
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
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors absolute -right-3 top-6 bg-[#0a0e17] border border-white/10"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(37,106,244,0.15)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3 font-medium text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} gap-3`}>
            <div className="size-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">AM</span>
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Alex Morgan</p>
                <p className="text-xs text-slate-400 truncate">Admin Access</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 border-b border-white/10 flex items-center px-8 justify-between flex-shrink-0 z-10 bg-[#0a0e17]/80 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-light" />
            Content Automation
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Créditos Demo: <span className="text-white font-mono">1/3</span></span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 flex flex-col lg:flex-row gap-8 relative z-0">
          
          {/* Main Canvas */}
          <div className="flex-1 flex flex-col max-w-3xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">Prueba el Módulo de <span className="text-primary-light">Automatización de Contenido</span></h2>
              <p className="text-slate-400">Transforma cualquier video de YouTube en un artículo de blog optimizado para SEO en segundos.</p>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-white/10 mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">URL del Video de YouTube</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Youtube className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="input-glass block w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                    disabled={isGenerating}
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!url || isGenerating}
                  className="crystal-btn px-6 py-3 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Generar Blog Post</>
                  )}
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden">
              <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                <FileTextIcon className="w-5 h-5 text-primary-light" /> Resultado Generado
              </h3>
              
              {!isGenerating && !isFinished && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <LayoutTemplateIcon className="w-16 h-16 mb-4" />
                  <p>El contenido generado aparecerá aquí</p>
                </div>
              )}

              {isGenerating && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 bg-white/5 rounded-lg w-3/4 mb-8"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-full mt-6"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-4/5"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-full"></div>
                </div>
              )}

              {isFinished && (
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-2xl font-bold text-white mb-4">El Futuro de la IA en 2026: Tendencias y Predicciones</h1>
                  <p className="text-slate-300 mb-4">
                    La inteligencia artificial ha dejado de ser una promesa para convertirse en el motor principal de la innovación empresarial. En este artículo, desglosamos los puntos clave del último análisis sobre el impacto de los agentes autónomos...
                  </p>
                  <h2 className="text-xl font-semibold text-white mt-6 mb-3">1. Agentes Autónomos Especializados</h2>
                  <p className="text-slate-300 mb-4">
                    A diferencia de los LLMs generalistas, la nueva ola se centra en agentes diseñados para tareas específicas, capaces de interactuar con APIs y tomar decisiones en tiempo real sin supervisión humana constante.
                  </p>
                  <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <p className="text-sm text-primary-light font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Optimizado para SEO (Score: 94/100)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Feed Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 border border-white/10 flex-1">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Actividad de la IA</h3>
              
              <div className="space-y-6">
                {generationSteps.map((step, index) => {
                  const isPast = currentStep > index;
                  const isCurrent = currentStep === index;
                  const isFuture = currentStep < index;
                  
                  if (currentStep === -1) return null;

                  return (
                    <div key={index} className={`flex gap-4 transition-opacity duration-500 ${isFuture ? 'opacity-30' : 'opacity-100'}`}>
                      <div className="relative flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                          isPast ? 'bg-primary border-primary' : 
                          isCurrent ? 'bg-transparent border-primary-light' : 
                          'bg-transparent border-slate-600'
                        }`}>
                          {isPast ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : isCurrent ? (
                            <div className="w-2 h-2 bg-primary-light rounded-full animate-ping" />
                          ) : (
                            <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                          )}
                        </div>
                        {index < generationSteps.length - 1 && (
                          <div className={`w-0.5 h-full absolute top-6 ${isPast ? 'bg-primary/50' : 'bg-slate-700'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                          {step}
                        </p>
                        {isCurrent && (
                          <div className="mt-2 flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {currentStep === -1 && (
                  <div className="text-center text-slate-500 text-sm py-10">
                    Esperando input para iniciar el proceso...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upsell Banner */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 transition-transform duration-700 ease-in-out z-20 ${showUpsell ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="max-w-4xl mx-auto glass-card border border-primary/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(37,106,244,0.3)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-primary-light" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">¡Módulo probado con éxito!</h4>
                <p className="text-sm text-slate-300">Has consumido 1 crédito demo. Desbloquea la potencia total para automatizar sin límites.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="crystal-btn px-6 py-3 text-white rounded-xl font-bold whitespace-nowrap flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Desbloquear Potencia Total
            </button>
          </div>
        </div>
      </main>

      {/* Pricing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0e17]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Escala tu Agencia</h3>
              <p className="text-slate-400 text-sm">Acceso ilimitado a todos los módulos de automatización.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-xs font-bold px-3 py-1 rounded-bl-lg text-white">
                POPULAR
              </div>
              <div className="text-4xl font-bold text-white mb-1">$499<span className="text-lg text-slate-400 font-normal">/mes</span></div>
              <p className="text-sm text-primary-light mb-6">Plan Agencia Pro</p>
              
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-light" /> Generación ilimitada de contenido</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-light" /> Agentes de voz (10,000 min)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-light" /> CRM Inteligente integrado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-light" /> Soporte prioritario 24/7</li>
              </ul>

              <button className="w-full py-3 crystal-btn text-white rounded-xl font-bold">
                Comenzar Prueba de 7 Días
              </button>
            </div>
            
            <p className="text-center text-xs text-slate-500">Cancela en cualquier momento. Sin compromisos a largo plazo.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icons
function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}

function LayoutTemplateIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="9" height="7" x="3" y="14" rx="1" />
      <rect width="5" height="7" x="16" y="14" rx="1" />
    </svg>
  )
}
