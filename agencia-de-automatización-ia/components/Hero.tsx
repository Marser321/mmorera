import { ArrowRight, ChevronRight, Sparkles, TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0a0e17]">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 text-center lg:text-left pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-8 border-primary/30">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium tracking-wide text-primary-light uppercase">Optimización Inteligente v3.0</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
              Escala tu negocio con <br />
              <span className="text-gradient">IA Modular.</span>
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto lg:mx-0 text-lg text-slate-400 mb-10 font-light leading-relaxed">
              Descubre los módulos más eficientes, obtén recomendaciones personalizadas para tu empresa y automatiza procesos sin esfuerzo con nuestra plataforma impulsada por IA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link href="/dashboard" className="crystal-btn px-8 py-4 rounded-full font-medium text-lg flex items-center gap-2 text-white w-full sm:w-auto justify-center">
                <Sparkles className="w-5 h-5" /> Probar Módulos <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              
              <Link href="/settings" className="px-8 py-4 rounded-full font-medium text-lg glass-panel flex items-center gap-2 hover:bg-white/10 transition-colors w-full sm:w-auto justify-center text-white">
                Configuración <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Floating Cards Visuals */}
          <div className="lg:col-span-5 relative h-[500px] hidden md:block">
            {/* Card 1: Efficiency */}
            <div className="absolute top-10 right-10 glass-card p-5 rounded-2xl w-64 text-white shadow-2xl border-l-4 border-l-primary animate-[float_6s_ease-in-out_infinite] z-20">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <TrendingUp className="w-8 h-8 text-primary-light" />
              </div>
              <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider">Puntos de Eficiencia</p>
              <h3 className="text-3xl font-bold text-white mb-2">13,200</h3>
              <div className="inline-block bg-primary/20 border border-primary/30 text-primary-light text-[10px] px-2 py-0.5 rounded-full">Ready</div>
            </div>

            {/* Card 2: Smart Scan */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 glass-card p-6 rounded-[2rem] w-72 text-white shadow-2xl z-30 animate-[float_6s_ease-in-out_3s_infinite]">
              <div className="flex justify-center mb-4">
                <span className="bg-slate-800 text-slate-300 text-xs px-4 py-1 rounded-full font-medium border border-slate-700">Smart Scan</span>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full border-4 border-t-primary border-r-primary border-b-slate-700 border-l-slate-700 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                  <span className="text-primary-light font-bold text-lg animate-[spin_4s_linear_infinite_reverse]">94%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">Optimización Completa</p>
              </div>
            </div>

            {/* Card 3: ROI */}
            <div className="absolute bottom-10 right-0 glass-card p-6 rounded-2xl w-64 text-white shadow-2xl border border-emerald-500/30 animate-[float_6s_ease-in-out_1.5s_infinite] z-10">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide text-emerald-400">MEJOR OPTIMIZACIÓN</span>
              </div>
              <h3 className="text-xl font-bold mb-1">ROI → 240%</h3>
              <p className="text-2xl font-bold text-primary-light">Solo $179 <span className="text-xs text-slate-400 font-normal">/mes</span></p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
    </div>
  );
}
