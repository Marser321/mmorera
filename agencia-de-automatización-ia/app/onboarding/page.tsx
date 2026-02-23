'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, Settings as SettingsIcon, Zap, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0e17] font-sans text-slate-100 flex items-center justify-center overflow-hidden selection:bg-primary selection:text-white">
      {/* Blurred Dashboard Background Effect */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#0a0e17]/80 backdrop-blur-xl z-10"></div>
        {/* Abstract Dashboard shapes to simulate background */}
        <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-6 p-8 opacity-20">
          <div className="bg-primary/20 rounded-lg col-span-1 row-span-3"></div>
          <div className="bg-primary/20 rounded-lg col-span-3 row-span-1"></div>
          <div className="bg-primary/10 rounded-lg col-span-2 row-span-2"></div>
          <div className="bg-primary/10 rounded-lg col-span-1 row-span-2"></div>
        </div>
      </div>

      {/* Main Modal Container */}
      <div className="relative z-20 w-full max-w-[1080px] bg-[#161b22]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row min-h-[600px] m-4">
        
        {/* Left Sidebar: AI Copilot */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-primary/10 to-[#0a0e17] p-8 flex flex-col justify-between border-r border-white/5">
          <div className="flex flex-col gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">Control IA</span>
            </div>
            
            {/* AI Message Bubble */}
            <div className="bg-[#161b22] p-6 rounded-xl shadow-sm border border-white/10 relative mt-8">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center border-4 border-[#161b22] shadow-md">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <h3 className="font-semibold text-lg mb-2 pt-2 text-white">¡Hola! Soy tu copiloto.</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Antes de empezar, configuraremos tu ecosistema para que se adapte perfectamente a ti. Estoy aquí para guiarte en este proceso mágico.
              </p>
            </div>
          </div>
          
          <div className="mt-auto pt-8">
            <div className="w-full h-48 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,106,244,0.2)_0%,transparent_70%)]"></div>
               <div className="w-24 h-24 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
               <div className="absolute w-16 h-16 border border-primary-light/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
               <Zap className="absolute text-primary-light w-8 h-8 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Light Streaks */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          {/* Progress Indicator */}
          <div className="flex flex-col gap-4 mb-10 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Paso 1 de 3</span>
              <Link href="/dashboard" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
                Omitir por ahora
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Step 1: Active & Glowing */}
              <div className="relative group">
                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(37,106,244,0.6)] animate-pulse"></div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-primary-light bg-[#161b22] px-2 py-1 rounded shadow-sm border border-white/10">Personalización</div>
              </div>
              <div className="h-0.5 w-12 bg-primary/30"></div>
              {/* Step 2: Inactive */}
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="h-0.5 w-12 bg-slate-700"></div>
              {/* Step 3: Inactive */}
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
          </div>

          {/* Main Question & Content */}
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex flex-col gap-4 max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  ¿Cuál es el objetivo principal de tu negocio?
                </h1>
                <p className="text-slate-400 text-lg">
                  Selecciona una opción para que nuestro núcleo de IA se optimice para tus necesidades.
                </p>
              </div>
            </div>

            {/* Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {/* Option 1 */}
              <label className="cursor-pointer group relative">
                <input 
                  type="radio" 
                  name="goal" 
                  className="peer sr-only" 
                  onChange={() => setSelectedGoal('sales')}
                  checked={selectedGoal === 'sales'}
                />
                <div className="flex flex-col items-center justify-center p-6 h-full rounded-xl bg-[#161b22] border-2 border-white/5 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_20px_rgba(37,106,244,0.15)] transition-all duration-300">
                  <TrendingUp className="w-8 h-8 text-slate-500 group-hover:text-primary peer-checked:text-primary mb-3 transition-colors" />
                  <span className="font-bold text-slate-300 group-hover:text-white peer-checked:text-white transition-colors text-center">Escalar Ventas</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full text-white items-center justify-center hidden peer-checked:flex shadow-lg scale-0 peer-checked:scale-100 transition-transform duration-300">
                  <Check className="w-4 h-4" />
                </div>
              </label>

              {/* Option 2 */}
              <label className="cursor-pointer group relative">
                <input 
                  type="radio" 
                  name="goal" 
                  className="peer sr-only"
                  onChange={() => setSelectedGoal('process')}
                  checked={selectedGoal === 'process'}
                />
                <div className="flex flex-col items-center justify-center p-6 h-full rounded-xl bg-[#161b22] border-2 border-white/5 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_20px_rgba(37,106,244,0.15)] transition-all duration-300">
                  <SettingsIcon className="w-8 h-8 text-slate-500 group-hover:text-primary peer-checked:text-primary mb-3 transition-colors" />
                  <span className="font-bold text-slate-300 group-hover:text-white peer-checked:text-white transition-colors text-center">Optimizar Procesos</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full text-white items-center justify-center hidden peer-checked:flex shadow-lg scale-0 peer-checked:scale-100 transition-transform duration-300">
                  <Check className="w-4 h-4" />
                </div>
              </label>

              {/* Option 3 */}
              <label className="cursor-pointer group relative">
                <input 
                  type="radio" 
                  name="goal" 
                  className="peer sr-only"
                  onChange={() => setSelectedGoal('content')}
                  checked={selectedGoal === 'content'}
                />
                <div className="flex flex-col items-center justify-center p-6 h-full rounded-xl bg-[#161b22] border-2 border-white/5 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-[0_0_20px_rgba(37,106,244,0.15)] transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-slate-500 group-hover:text-primary peer-checked:text-primary mb-3 transition-colors" />
                  <span className="font-bold text-slate-300 group-hover:text-white peer-checked:text-white transition-colors text-center">Crear Contenido</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full text-white items-center justify-center hidden peer-checked:flex shadow-lg scale-0 peer-checked:scale-100 transition-transform duration-300">
                  <Check className="w-4 h-4" />
                </div>
              </label>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-end pt-10 mt-auto relative z-10">
            <Link 
              href="/dashboard"
              className={`crystal-btn text-white font-bold py-3 px-8 rounded-full transition-all duration-200 flex items-center gap-2 ${!selectedGoal ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
