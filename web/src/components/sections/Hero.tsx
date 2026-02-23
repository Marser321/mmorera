import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Bot, Zap, TrendingUp, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48 flex items-center justify-center min-h-[90vh]">
            {/* Background Effects - Enhanced Depth and Glow */}
            <div className="absolute inset-0 z-0 bg-background overflow-hidden">
                {/* Core ambient light */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.15),transparent_70%)] opacity-80 pointer-events-none"></div>

                {/* Secondary atmospheric glows */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none animate-pulse duration-10000"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

                {/* Floating Tech Icons (Scrollytelling Background) */}
                <div className="absolute top-[20%] left-[10%] opacity-[0.03] mix-blend-overlay pointer-events-none animate-[bounce_8s_ease-in-out_infinite]">
                    <Bot className="w-48 h-48 rotate-[-15deg]" />
                </div>
                <div className="absolute top-[60%] right-[10%] opacity-[0.03] mix-blend-overlay pointer-events-none animate-[bounce_10s_ease-in-out_infinite_reverse]">
                    <Zap className="w-64 h-64 rotate-[15deg]" />
                </div>
                <div className="absolute bottom-[-10%] left-[30%] opacity-[0.02] mix-blend-overlay pointer-events-none animate-[bounce_12s_ease-in-out_infinite]">
                    <TrendingUp className="w-96 h-96 rotate-[-5deg]" />
                </div>

                {/* Cyber grid / Texture */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 text-center max-w-5xl">

                <div className="flex justify-center mb-8 md:mb-10">
                    <Badge variant="outline" className="px-4 py-2 text-xs md:text-sm border-primary/40 bg-black/40 text-primary backdrop-blur-xl gap-2 uppercase tracking-[0.2em] font-bold flex items-center shadow-[0_0_20px_rgba(var(--primary),0.15)] hover:bg-primary/10 transition-colors">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sistemas B2B de Alta Disponibilidad</span>
                    </Badge>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6 md:mb-8 text-balance text-white leading-[1.05] drop-shadow-2xl">
                    Multiplica tus ventas <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500 pb-2 drop-shadow-xl inline-block relative">
                        sin inflar la nómina
                        {/* Glow under text */}
                        <span className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 to-blue-500 blur-2xl opacity-20 -z-10"></span>
                    </span>
                </h1>

                <p className="text-base sm:text-lg md:text-2xl text-zinc-400 mb-10 md:mb-14 max-w-3xl mx-auto text-balance font-medium leading-relaxed px-2 md:px-0">
                    Construimos Arquitectura Operativa que prospecta, califica y agenda reuniones por ti, <span className="text-zinc-200 font-semibold">24/7 y sin margen de error.</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 md:mb-20 w-full max-w-md sm:max-w-none mx-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-2xl group overflow-hidden relative" asChild>
                        <Link href="#auditoria" className="flex items-center justify-center gap-2 relative z-10 w-full h-full">
                            {/* Animated Shimmer sweep */}
                            <span className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none transform skew-x-12 z-0"></span>

                            <span className="relative z-10 flex items-center gap-2">
                                Auditoría de Sistemas
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </span>
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg font-bold border-white/10 hover:border-white/20 hover:bg-white/5 transition-all rounded-2xl backdrop-blur-md bg-black/20 text-white" asChild>
                        <Link href="#sistemas">
                            Ver Infraestructura
                        </Link>
                    </Button>
                </div>

                {/* Social Proof / Metrics - Premium Glassmorphism */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 md:pt-14 border-t border-white/10 max-w-4xl mx-auto relative px-4 sm:px-0">
                    {/* Glowing separator line */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

                    {[
                        { icon: Zap, value: "2.5s", label: "Respuesta Inmediata", color: "text-yellow-400" },
                        { icon: TrendingUp, value: "+40%", label: "Tasa de Cierre", color: "text-green-400" },
                        { icon: Bot, value: "24/7", label: "Agentes Operativos", color: "text-cyan-400" }
                    ].map((metric, i) => (
                        <div key={i} className="flex flex-col items-center justify-center space-y-3 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group relative overflow-hidden">
                            {/* Hover subtle glow */}
                            <div className="absolute -inset-2 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"></div>

                            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-black/50 border border-white/10 mb-2 group-hover:scale-110 transition-transform duration-500 ${metric.color}`}>
                                <metric.icon className="w-6 h-6" />
                            </div>
                            <span className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-md">{metric.value}</span>
                            <p className="text-xs md:text-sm text-zinc-400 font-bold uppercase tracking-[0.15em]">{metric.label}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
