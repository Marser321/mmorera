'use client';

import { 
  LayoutDashboard, Users, Search, Mic, FileText, BarChart, 
  Settings, Bell, HelpCircle, Zap, Shield, CreditCard, 
  Database, Camera, CheckCircle2, MapPin, Building, Globe
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans flex overflow-hidden selection:bg-primary selection:text-white">
      
      {/* Left Navigation Rail (Collapsed/Mini) */}
      <aside className="hidden lg:flex w-20 flex-col items-center py-6 border-r border-white/10 bg-[#161b22]/50 backdrop-blur-md z-50">
        <div className="flex flex-col gap-6 w-full items-center">
          <Link href="/dashboard" className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <LayoutDashboard className="w-6 h-6" />
          </Link>
          <Link href="/seo" className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Search className="w-6 h-6" />
          </Link>
          <Link href="/portal" className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <FileText className="w-6 h-6" />
          </Link>
          <Link href="/settings" className="p-3 rounded-xl bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(37,106,244,0.15)]">
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:flex-row w-full p-4 lg:p-8 gap-8 overflow-y-auto relative">
        {/* Background Decorative Streaks */}
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(37, 106, 244, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(37, 106, 244, 0.1) 0%, transparent 40%)
          `
        }}></div>

        {/* Settings Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex-shrink-0 relative z-10">
          <div className="glass-card rounded-xl p-6 sticky top-8">
            <div className="flex flex-col gap-6">
              {/* User Mini Profile */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="size-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-primary/50 flex items-center justify-center">
                  <span className="text-lg font-bold">AM</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-white text-sm font-bold">Alex Morgan</h1>
                  <p className="text-slate-400 text-xs">alex@identidad.ia</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-2">
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(37,106,244,0.15)] group transition-all">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Perfil</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                  <Shield className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Seguridad</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                  <CreditCard className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Facturación</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                  <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Notificaciones</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                  <Database className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Datos de IA</span>
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Settings Content Area */}
        <main className="flex-1 flex flex-col gap-6 relative z-10 max-w-4xl">
          
          {/* Profile Header */}
          <div className="glass-card rounded-xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              <div className="relative">
                <div className="size-32 rounded-full p-1 neon-border bg-black/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="size-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-400">AM</span>
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white rounded-full p-2 shadow-lg transition-transform hover:scale-105 border border-white/20">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left pt-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                  <h1 className="text-3xl font-bold text-white tracking-tight">Alex Morgan</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Verificado
                  </span>
                </div>
                <p className="text-primary-light font-medium text-lg mb-4">CEO & Fundador</p>
                <p className="text-slate-400 max-w-lg mx-auto md:mx-0 text-sm leading-relaxed">
                  Administrando la identidad digital de la empresa a través de módulos de IA generativa.
                </p>
                <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-light" />
                    <span className="text-sm text-slate-300">San Francisco, CA</span>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary-light" />
                    <span className="text-sm text-slate-300">Morgan Tech Inc.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="glass-card rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Información Personal
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-sm font-medium ml-1">Nombre Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <input type="text" defaultValue="Alex Morgan" className="input-glass w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium placeholder-slate-500" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-sm font-medium ml-1">Empresa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="w-4 h-4 text-slate-500" />
                  </div>
                  <input type="text" defaultValue="Morgan Tech Inc." className="input-glass w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium placeholder-slate-500" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-sm font-medium ml-1">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <input type="email" defaultValue="alex@identidad.ia" className="input-glass w-full rounded-xl py-3 pl-11 pr-4 text-sm font-medium placeholder-slate-500" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 text-sm font-medium ml-1">Zona Horaria</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="w-4 h-4 text-slate-500" />
                  </div>
                  <select className="input-glass w-full rounded-xl py-3 pl-11 pr-10 text-sm font-medium placeholder-slate-500 appearance-none">
                    <option value="PST" className="bg-slate-800">Pacific Time (US & Canada)</option>
                    <option value="EST" className="bg-slate-800">Eastern Time (US & Canada)</option>
                    <option value="UTC" className="bg-slate-800">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* AI Personalization Section */}
          <div className="glass-card rounded-xl p-8 relative overflow-hidden border-primary/20">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                  ADN de Marca para IA
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Configura la identidad central que usarán nuestros modelos de IA para generar contenido alineado con tu marca.
                </p>
                
                <div className="flex flex-col gap-4">
                  <div className="border border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <FileText className="w-8 h-8 text-slate-500 group-hover:text-primary mb-2 transition-colors" />
                    <p className="text-slate-300 font-medium text-sm">Arrastra tu Brand Book aquí</p>
                    <p className="text-slate-500 text-xs mt-1">PDF, DOCX hasta 50MB</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label className="text-slate-400 text-sm font-medium ml-1">Tono de Voz Predeterminado</label>
                    <div className="flex gap-3 flex-wrap">
                      <button className="px-4 py-2 rounded-full border border-primary bg-primary/20 text-white text-xs font-medium hover:bg-primary/30 transition-all shadow-[0_0_10px_rgba(37,106,244,0.3)]">Profesional</button>
                      <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 hover:border-white/30 transition-all">Amigable</button>
                      <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 hover:border-white/30 transition-all">Técnico</button>
                      <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 hover:border-white/30 transition-all">Innovador</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-white/5">
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                  <Database className="w-12 h-12 text-white/90 drop-shadow-[0_0_15px_rgba(37,106,244,0.8)] z-10" />
                </div>
                <h4 className="text-white font-semibold text-center">Core Identity</h4>
                <p className="text-slate-400 text-xs text-center mt-2">
                  Tu identidad digital está optimizada al 85%.
                </p>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[85%] shadow-[0_0_10px_rgba(37,106,244,0.8)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="glass-card rounded-xl p-8 mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              Seguridad de Cuenta
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary mt-1">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Autenticación de Dos Factores (2FA)</h4>
                  <p className="text-slate-400 text-sm mt-1">Añade una capa extra de seguridad a tu cuenta.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] uppercase tracking-wider">Activo</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pb-8">
            <button className="px-6 py-3 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-white/5 transition-all">Cancelar</button>
            <button className="crystal-btn px-8 py-3 rounded-xl text-white font-bold tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Guardar Cambios
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
