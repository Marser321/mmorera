'use client';

import { 
  LayoutDashboard, Users, Search, Mic, FileText, BarChart, 
  Settings, Bell, HelpCircle, Zap, Activity, CheckCircle2, 
  TrendingUp, Globe, Award, Link as LinkIcon, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans flex overflow-hidden selection:bg-primary selection:text-white">
      
      {/* Left Navigation Rail */}
      <aside className="w-64 border-r border-white/10 flex flex-col justify-between bg-[#161b22]/50 backdrop-blur-md h-screen fixed left-0 top-0 z-50">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-white text-lg font-bold leading-none tracking-wide">Control IA</h1>
                <span className="text-xs text-primary-light font-medium tracking-widest uppercase mt-1">Business OS</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(37,106,244,0.15)] group transition-all duration-300">
              <LayoutDashboard className="w-5 h-5 text-primary-light" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <Users className="w-5 h-5 group-hover:text-primary-light transition-colors" />
              <span className="font-medium">CRM</span>
            </a>
            <Link href="/seo" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <Search className="w-5 h-5 group-hover:text-primary-light transition-colors" />
              <span className="font-medium">SEO Panel</span>
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <Mic className="w-5 h-5 group-hover:text-primary-light transition-colors" />
              <span className="font-medium">Voice</span>
            </a>
            <Link href="/portal" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <FileText className="w-5 h-5 group-hover:text-primary-light transition-colors" />
              <span className="font-medium">Content</span>
            </Link>

            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">System</p>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <BarChart className="w-5 h-5 group-hover:text-primary-light transition-colors" />
              <span className="font-medium">Analytics</span>
            </a>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <Settings className="w-5 h-5 group-hover:text-primary-light transition-colors" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="size-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border-2 border-primary/50 flex items-center justify-center">
                <span className="text-sm font-bold">AM</span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">Alex Morgan</span>
                <span className="text-xs text-slate-400 truncate">Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col h-screen relative z-0">
        
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary-light" />
            Dashboard General
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                className="block w-64 pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all" 
                placeholder="Search modules, data..." 
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#0a0e17]"></span>
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="flex flex-col xl:flex-row gap-8 h-full">
            
            {/* Main Workspace (Left) */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Top Section: System Health Visual */}
              <section className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col gap-4 max-w-lg">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">System Status: <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Optimal</span></h3>
                      <p className="text-slate-400 text-lg">Your business ecosystem is operating at peak efficiency. All modules are synced.</p>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-200">Server Uptime: 99.9%</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-slate-200">Efficiency: 98%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Central 3D Crystal Representation */}
                  <div className="relative size-48 flex items-center justify-center hidden md:flex">
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-blue-400/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="relative z-10">
                      <div className="size-24 bg-gradient-to-tr from-primary to-blue-400 rounded-xl rotate-45 shadow-[0_0_30px_rgba(37,106,244,0.4)] flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Zap className="w-10 h-10 text-white -rotate-45 drop-shadow-md" />
                      </div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 bg-[#161b22] border border-primary/50 rounded-full px-3 py-1 text-[10px] font-bold text-primary-light shadow-lg">CRM</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 bg-[#161b22] border border-blue-400/50 rounded-full px-3 py-1 text-[10px] font-bold text-blue-400 shadow-lg">SEO</div>
                    <div className="absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2 bg-[#161b22] border border-purple-500/50 rounded-full px-3 py-1 text-[10px] font-bold text-purple-400 shadow-lg">VOICE</div>
                    <div className="absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 bg-[#161b22] border border-emerald-500/50 rounded-full px-3 py-1 text-[10px] font-bold text-emerald-400 shadow-lg">DATA</div>
                  </div>
                </div>
              </section>

              {/* Active Modules Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Active Modules</h3>
                  <button className="text-sm text-primary-light hover:text-white transition-colors flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Card 1: CRM */}
                  <div className="glass-panel p-5 rounded-xl hover:bg-white/5 transition-all duration-300 border-l-4 border-l-primary group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary-light group-hover:bg-primary group-hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded">+12%</span>
                    </div>
                    <h4 className="text-slate-400 text-sm font-medium mb-1">CRM Leads</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">12</span>
                      <span className="text-sm text-emerald-400 font-medium mb-1">New</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[65%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Card 2: Voice */}
                  <div className="glass-panel p-5 rounded-xl hover:bg-white/5 transition-all duration-300 border-l-4 border-l-purple-500 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs text-slate-400">Live</span>
                      </div>
                    </div>
                    <h4 className="text-slate-400 text-sm font-medium mb-1">Voice Calls</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">3</span>
                      <span className="text-sm text-purple-400 font-medium mb-1">Active</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[30%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Card 3: Content */}
                  <div className="glass-panel p-5 rounded-xl hover:bg-white/5 transition-all duration-300 border-l-4 border-l-orange-500 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2 py-1 rounded">Drafting</span>
                    </div>
                    <h4 className="text-slate-400 text-sm font-medium mb-1">Content Completion</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">85%</span>
                      <span className="text-sm text-slate-400 font-medium mb-1">Done</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[85%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Card 4: SEO */}
                  <div className="glass-panel p-5 rounded-xl hover:bg-white/5 transition-all duration-300 border-l-4 border-l-blue-400 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-400/20 p-2 rounded-lg text-blue-400 group-hover:bg-blue-400 group-hover:text-slate-900 transition-colors">
                        <Search className="w-5 h-5" />
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded">+3%</span>
                    </div>
                    <h4 className="text-slate-400 text-sm font-medium mb-1">SEO Ranking</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">+15%</span>
                      <span className="text-sm text-blue-400 font-medium mb-1">Visibility</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full w-[72%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table Pattern */}
              <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col mt-2">
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-white">Rastreo de Competidores (SEO)</h3>
                  <Link href="/seo" className="text-sm text-primary-light hover:text-white transition-colors">Ver reporte completo</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-[#161b22]/80 text-xs uppercase font-medium text-slate-300">
                      <tr>
                        <th className="px-6 py-4">Competidor</th>
                        <th className="px-6 py-4">Autoridad</th>
                        <th className="px-6 py-4">Visibilidad</th>
                        <th className="px-6 py-4">Brecha de Palabras</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                          <div className="size-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">C1</div>
                          competidor-lider.com
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white">82</span>
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[82%]"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">+15%</td>
                        <td className="px-6 py-4 text-white">2.4k</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                          <div className="size-8 rounded bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">C2</div>
                          market-niche.io
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white">65</span>
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500/60 w-[65%]"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-red-400 font-medium">-5%</td>
                        <td className="px-6 py-4 text-white">850</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Sidebar Assistant & Feed */}
            <aside className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
              {/* AI Assistant Card */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col h-auto border-t-4 border-t-primary">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-white to-slate-300 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-slate-900" />
                  </div>
                  <h3 className="font-bold text-white text-lg">AI Assistant</h3>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5 relative">
                  <div className="absolute -left-2 top-6 w-4 h-4 bg-white/5 border-l border-b border-white/5 rotate-45 transform"></div>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    <span className="text-primary-light font-bold block mb-1">Buenos días, Alex.</span>
                    Tu ecosistema está operando al 98% de eficiencia. He detectado una oportunidad de escalado en el mercado de Logística.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="crystal-btn text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Revisar Plan Estratégico
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors border border-white/10">
                    Ignorar por ahora
                  </button>
                </div>
              </div>

              {/* System Feed / Notifications */}
              <div className="flex-1 glass-panel p-6 rounded-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">System Feed</h3>
                  <span className="bg-white/10 text-xs text-slate-300 px-2 py-0.5 rounded-full">Live</span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 size-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                    <div>
                      <p className="text-slate-300 text-sm">New high-value lead detected in CRM module.</p>
                      <span className="text-xs text-slate-500 block mt-1">2 mins ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 size-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                    <div>
                      <p className="text-slate-300 text-sm">Voice module successfully processed 50 calls.</p>
                      <span className="text-xs text-slate-500 block mt-1">15 mins ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    <div>
                      <p className="text-slate-300 text-sm">Daily backup completed securely.</p>
                      <span className="text-xs text-slate-500 block mt-1">1 hour ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start opacity-60">
                    <div className="mt-1 size-2 rounded-full bg-slate-500"></div>
                    <div>
                      <p className="text-slate-300 text-sm">SEO keywords updated for Q3 campaign.</p>
                      <span className="text-xs text-slate-500 block mt-1">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  )
}
