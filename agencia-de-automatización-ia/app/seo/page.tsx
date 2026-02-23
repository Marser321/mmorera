'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, Users, Search, Mic, FileText, BarChart, 
  Settings, Bell, HelpCircle, Zap, TrendingUp, Globe, Award, 
  Link as LinkIcon, Download, RefreshCw, Diamond, MapPin, Loader2, Sparkles, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { GoogleGenAI } from '@google/genai';

export default function SeoPanelPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [localResult, setLocalResult] = useState<string | null>(null);
  const [isLocalSearching, setIsLocalSearching] = useState(false);

  const handleSearchGrounding = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza la tendencia actual de búsqueda para: "${searchQuery}". Proporciona un resumen conciso y oportunidades clave.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setSearchResult(response.text || 'Sin resultados.');
    } catch (error) {
      console.error('Error with search grounding:', error);
      setSearchResult('Error al obtener datos de búsqueda.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocalGrounding = async () => {
    if (!localQuery) return;
    setIsLocalSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Encuentra competidores locales o negocios relacionados con "${localQuery}" cerca de mi ubicación.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: -34.9011, // Montevideo, Uruguay
                longitude: -56.1645
              }
            }
          }
        }
      });
      setLocalResult(response.text || 'Sin resultados locales.');
    } catch (error) {
      console.error('Error with maps grounding:', error);
      setLocalResult('Error al obtener datos locales.');
    } finally {
      setIsLocalSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans flex overflow-hidden selection:bg-primary selection:text-white">
      
      {/* Left Navigation Rail (Collapsed/Mini) */}
      <aside className="hidden lg:flex w-20 flex-col items-center py-6 border-r border-white/10 bg-[#161b22]/50 backdrop-blur-md z-50">
        <div className="flex flex-col gap-6 w-full items-center">
          <Link href="/dashboard" className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <LayoutDashboard className="w-6 h-6" />
          </Link>
          <Link href="/seo" className="p-3 rounded-xl bg-primary/20 text-primary-light border border-primary/30 shadow-[0_0_15px_rgba(37,106,244,0.15)]">
            <Search className="w-6 h-6" />
          </Link>
          <Link href="/portal" className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <FileText className="w-6 h-6" />
          </Link>
          <Link href="/settings" className="p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0e17] p-6 lg:p-10 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-0">
          
          {/* Breadcrumb & Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/dashboard" className="text-slate-400 hover:text-primary-light transition-colors">Dashboard</Link>
              <span className="text-slate-600">/</span>
              <span className="text-primary-light font-medium">SEO con IA</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Panel de SEO con IA</h1>
                <p className="text-slate-400 mt-1">Optimización modular y análisis predictivo de motores de búsqueda.</p>
              </div>
              <div className="hidden md:flex gap-3">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Exportar
                </button>
                <button className="crystal-btn px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Actualizar Análisis
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics (Glassmorphic Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-16 h-16 text-primary" />
              </div>
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm font-medium">Autoridad de Dominio</p>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.5%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">78<span className="text-lg text-slate-500 font-normal">/100</span></h3>
              </div>
              {/* Mini Graph Visualization */}
              <div className="h-8 w-full flex items-end gap-1 mt-auto">
                <div className="w-1/6 bg-primary/20 h-2 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/30 h-3 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/40 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/60 h-3 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/80 h-5 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary h-6 rounded-t-sm shadow-[0_0_10px_rgba(37,106,244,0.5)]"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-16 h-16 text-primary" />
              </div>
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm font-medium">Tráfico Orgánico</p>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">45.2K</h3>
              </div>
              <div className="h-8 w-full flex items-end gap-1 mt-auto">
                <div className="w-1/6 bg-primary/20 h-3 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/30 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/40 h-6 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/60 h-5 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/80 h-7 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary h-8 rounded-t-sm shadow-[0_0_10px_rgba(37,106,244,0.5)]"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-16 h-16 text-primary" />
              </div>
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm font-medium">Palabras Clave (Top 3)</p>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">1,204</h3>
              </div>
              <div className="h-8 w-full flex items-end gap-1 mt-auto">
                <div className="w-1/6 bg-primary/20 h-2 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/30 h-2 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/40 h-3 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/60 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/80 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary h-5 rounded-t-sm shadow-[0_0_10px_rgba(37,106,244,0.5)]"></div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <LinkIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="flex justify-between items-start">
                <p className="text-slate-400 text-sm font-medium">Backlinks de Calidad</p>
                <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 rotate-180" /> -1.2%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-white">850</h3>
              </div>
              <div className="h-8 w-full flex items-end gap-1 mt-auto">
                <div className="w-1/6 bg-primary/20 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/30 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/40 h-3 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/60 h-4 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary/80 h-3 rounded-t-sm"></div>
                <div className="w-1/6 bg-primary h-2 rounded-t-sm shadow-[0_0_10px_rgba(37,106,244,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* Middle Section: AI Suggestions & Central Viz */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:min-h-[500px]">
            
            {/* Left: AI Content Suggestions (Replaced with Grounding Tools) */}
            <div className="lg:col-span-4 glass-panel rounded-xl flex flex-col h-full overflow-hidden">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#161b22]/50">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-light" />
                  Búsqueda en Tiempo Real
                </h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-6">
                
                {/* Global Search Grounding */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" /> Tendencias Globales
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej: automatización con IA 2026"
                      className="input-glass flex-1 rounded-lg px-3 py-2 text-sm"
                    />
                    <button 
                      onClick={handleSearchGrounding}
                      disabled={isSearching || !searchQuery}
                      className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </button>
                  </div>
                  {searchResult && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 max-h-40 overflow-y-auto">
                      {searchResult}
                    </div>
                  )}
                </div>

                <div className="h-px w-full bg-white/10"></div>

                {/* Local Maps Grounding */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" /> Análisis Local (Maps)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={localQuery}
                      onChange={(e) => setLocalQuery(e.target.value)}
                      placeholder="Ej: agencias de marketing"
                      className="input-glass flex-1 rounded-lg px-3 py-2 text-sm"
                    />
                    <button 
                      onClick={handleLocalGrounding}
                      disabled={isLocalSearching || !localQuery}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLocalSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    </button>
                  </div>
                  {localResult && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 max-h-40 overflow-y-auto">
                      {localResult}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Center: Search Engine Simulation (Visual) */}
            <div className="lg:col-span-8 glass-panel rounded-xl flex flex-col overflow-hidden relative min-h-[400px]">
              <div className="absolute top-5 left-5 z-10 bg-[#0a0e17]/80 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                <h3 className="font-bold text-white text-lg">Simulación de Motor de Búsqueda</h3>
                <p className="text-xs text-slate-400">Visualización de red semántica en tiempo real</p>
              </div>
              
              {/* Simulation Container */}
              <div className="flex-1 w-full h-full relative bg-[#0a0e17] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Central Sphere (Main Site) */}
                <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.6)] animate-pulse">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-80 blur-sm"></div>
                  <div className="absolute inset-0 rounded-full border border-blue-200 opacity-50"></div>
                  <span className="relative z-20 text-white font-bold text-xs tracking-wider">TU SITIO</span>
                </div>
                
                {/* Orbiting Nodes */}
                <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 border border-slate-600 shadow-lg z-10">
                  <Globe className="w-6 h-6 text-blue-400" />
                  <div className="absolute top-1/2 left-1/2 w-[200px] h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent origin-left rotate-[25deg] -z-10"></div>
                </div>
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 border border-slate-600 shadow-lg z-10">
                  <Search className="w-5 h-5 text-purple-400" />
                  <div className="absolute top-1/2 right-1/2 w-[180px] h-[1px] bg-gradient-to-l from-purple-500/50 to-transparent origin-right rotate-[150deg] -z-10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Audit Table */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col mt-2">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#161b22]/50">
              <h3 className="font-bold text-lg text-white">Auditoría de Palabras Clave</h3>
              <div className="flex gap-2">
                <button className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1 rounded-lg border border-white/10 bg-white/5">
                  Filtrar
                </button>
                <button className="text-sm text-primary-light hover:text-white transition-colors px-3 py-1 rounded-lg border border-primary/20 bg-primary/10">
                  Ver todas
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-[#161b22]/80 text-xs uppercase font-medium text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Palabra Clave</th>
                    <th className="px-6 py-4">Intención</th>
                    <th className="px-6 py-4">Volumen (Mensual)</th>
                    <th className="px-6 py-4">Dificultad (KD)</th>
                    <th className="px-6 py-4">CPC Est.</th>
                    <th className="px-6 py-4">Tendencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">agencia de automatización ia</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20">Comercial</span></td>
                    <td className="px-6 py-4 text-white">12,500</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 font-medium">68</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 w-[68%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">$4.50</td>
                    <td className="px-6 py-4 text-emerald-400"><TrendingUp className="w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">agentes autónomos para ventas</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/20">Transaccional</span></td>
                    <td className="px-6 py-4 text-white">8,200</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-medium">45</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 w-[45%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">$8.20</td>
                    <td className="px-6 py-4 text-emerald-400"><TrendingUp className="w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">qué es un crm con ia</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Informativa</span></td>
                    <td className="px-6 py-4 text-white">24,000</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-medium">22</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[22%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">$1.10</td>
                    <td className="px-6 py-4 text-slate-500"><TrendingUp className="w-4 h-4 rotate-90" /></td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">software de automatización empresarial</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20">Comercial</span></td>
                    <td className="px-6 py-4 text-white">18,300</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-medium">85</span>
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-red-400 w-[85%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">$12.50</td>
                    <td className="px-6 py-4 text-emerald-400"><TrendingUp className="w-4 h-4" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
