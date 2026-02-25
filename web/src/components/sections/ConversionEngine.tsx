"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    UserPlus, Bot, ShieldAlert, Mail, MessageSquareText,
    Store, ShoppingCart, RefreshCw, Smartphone,
    MapPin, CalendarClock, BellRing, CheckCircle2, Star, LineChart, TrendingUp
} from "lucide-react";

import { ConversionNode, VerticalBeam } from "@/components/ui/conversion-flow";

type EngineType = 'b2b' | 'ecommerce' | 'local';

interface TabItem {
    id: EngineType;
    label: string;
}

const tabs: TabItem[] = [
    { id: 'b2b', label: 'B2B Avanzado' },
    { id: 'ecommerce', label: 'E-commerce & Scale' },
    { id: 'local', label: 'Negocio Local / PYME' },
];

export function ConversionEngine() {
    const [activeTab, setActiveTab] = useState<EngineType>('b2b');

    return (
        <section id="conversion-engine" className="py-20 md:py-32 bg-background relative overflow-hidden border-y border-white/5">
            {/* Background noise and glow effects (matching website premium style) */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col items-center">

                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
                    <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-xs font-semibold px-4 py-1.5 backdrop-blur-sm">
                        Motores a Medida
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 tracking-tight text-balance leading-tight">
                        Aceleradores de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-blue-500">Conversión</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto px-2 md:px-0">
                        No dejamos leads al azar ni usamos plantillas aburridas. Diseñamos un sistema automatizado inteligente que
                        filtra, nutre y cierra ventas en piloto automático, hiper-personalizado a tu escala y rentabilidad.
                    </p>
                </div>

                {/* Custom Animated Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative px-4 sm:px-6 py-2.5 text-sm sm:text-base font-medium rounded-xl transition-colors outline-none",
                                activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="conversion-active-tab"
                                    className="absolute inset-0 bg-primary/20 border border-primary/50 shadow-[0_0_20px_rgba(47,88,205,0.4)] rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Interactive Engine Window */}
                <div className="w-full max-w-5xl mx-auto relative group">
                    {/* Cyberpunk/Premium glow wrapper */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-transparent to-blue-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition duration-700 pointer-events-none group-hover:duration-200"></div>

                    <div className="relative bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center">

                        {/* Interactive floating orbs (background of the engine window) */}
                        <motion.div
                            className="absolute top-[20%] left-[20%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"
                            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
                            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        />

                        {/* Ambient inner glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent shadow-[0_0_20px_rgba(47,88,205,0.8)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                        {/* This bottom fade ensures beams dying at the bottom look natural */}
                        <div className="absolute bottom-0 inset-x-0 h-[100px] bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>

                        <div className="relative z-10 w-full flex justify-center pb-20 pt-10">
                            <AnimatePresence mode="wait">
                                {activeTab === 'b2b' && <B2BEngine key="b2b" />}
                                {activeTab === 'ecommerce' && <EcommerceEngine key="ecommerce" />}
                                {activeTab === 'local' && <LocalEngine key="local" />}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

// -- INDIVIDUAL ENGINES --

// Custom branch line for B2B bifurcation
function BranchCable({ className, color = "primary", left = false }: { className?: string, color?: string, left?: boolean }) {
    const isGreen = color === "green";
    const isAmber = color === "amber";

    let glowColor = "from-transparent via-primary to-transparent";
    if (isGreen) glowColor = "from-transparent via-green-500 to-transparent";
    if (isAmber) glowColor = "from-transparent via-amber-500 to-transparent";

    return (
        <div className={cn("absolute top-0 w-1/2 h-full border-t-[2px] border-white/10 overflow-hidden", left ? "left-0 border-r-[2px] rounded-tr-3xl" : "right-0 border-l-[2px] rounded-tl-3xl", className)}>
            {/* This represents the pulse moving along the L-shape */}
            {left ? (
                <motion.div
                    className={cn("absolute top-[-2px] right-0 h-[3px] w-full rounded-full", glowColor)}
                    style={{ background: `linear-gradient(to left, transparent, ${isGreen ? '#22c55e' : isAmber ? '#f59e0b' : '#3b82f6'} 50%, transparent)` }}
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: isGreen ? 0 : 0.5 }}
                />
            ) : (
                <motion.div
                    className={cn("absolute top-[-2px] left-0 h-[3px] w-full rounded-full", glowColor)}
                    style={{ background: `linear-gradient(to right, transparent, ${isGreen ? '#22c55e' : isAmber ? '#f59e0b' : '#3b82f6'} 50%, transparent)` }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: isAmber ? 0.3 : 0.8 }}
                />
            )}

            {/* Corner glowing highlight */}
            <div className={cn("absolute top-0 w-8 h-8 opacity-40 blur-md rounded-full", left ? "right-[-16px] -top-4" : "left-[-16px] -top-4",
                isGreen ? "bg-green-500" : isAmber ? "bg-amber-500" : "bg-primary"
            )}></div>
        </div>
    )
}

function B2BEngine() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col items-center w-full relative"
        >
            <ConversionNode
                icon={UserPlus}
                title="1. Captación y Filtrado"
                subtitle="LinkedIn y Ads Segmentados (+80% leads cualificados)"
                delay={0.1}
            />

            <VerticalBeam delay={0.2} height={40} />

            <ConversionNode
                icon={Bot}
                title="2. Scoring Predictivo IA"
                subtitle="Califica al instante (ahorro de ~15h/semana)"
                glowColor="from-purple-500/40 to-blue-500/40"
                delay={0.3}
            />

            {/* Bifurcation */}
            <div className="flex flex-col items-center mt-0 w-full">
                <VerticalBeam delay={0.4} height={32} />

                <div className="relative w-full max-w-2xl flex justify-between pt-8">
                    {/* The physical branching lines */}
                    <div className="absolute top-0 left-0 right-0 h-8">
                        <BranchCable left={true} color="green" />
                        <BranchCable left={false} color="amber" />
                    </div>

                    {/* Left Branch (High Priority) */}
                    <div className="flex flex-col items-center w-[45%] relative pt-4">
                        <ConversionNode
                            icon={ShieldAlert}
                            title="3a. Ruteo Exprés a Ventas"
                            subtitle="Alerta en < 5 min (+21x prob. de venta)"
                            glowColor="from-green-500/40 to-emerald-500/40"
                            delay={0.5}
                        />

                        <VerticalBeam delay={0.6} height={40} />

                        <ConversionNode
                            icon={LineChart}
                            title="4a. Cierre y Medición"
                            subtitle="Dashboard de ROI 10-20% y CAC reducido"
                            glowColor="from-green-500/40 to-emerald-500/40"
                            delay={0.7}
                        />
                    </div>

                    {/* Right Branch (Nurturing) */}
                    <div className="flex flex-col items-center w-[45%] relative pt-4">
                        <ConversionNode
                            icon={Mail}
                            title="3b. Nurturing Automatizado"
                            subtitle="Secuencia de emails (+30% apertura)"
                            glowColor="from-amber-500/40 to-orange-500/40"
                            delay={0.5}
                        />

                        <VerticalBeam delay={0.6} height={40} />

                        <ConversionNode
                            icon={MessageSquareText}
                            title="4b. Re-activación con IA"
                            subtitle="Test A/B continuo en piloto automático"
                            glowColor="from-amber-500/40 to-orange-500/40"
                            delay={0.7}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function EcommerceEngine() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col items-center w-full"
        >
            <ConversionNode
                icon={Store}
                title="1. Tráfico Inteligente"
                subtitle="Meta/TikTok Ads Advantage+ (Smart Bidding)"
                delay={0.1}
            />
            <VerticalBeam delay={0.2} height={40} />
            <ConversionNode
                icon={ShoppingCart}
                title="2. Comportamiento Predictivo"
                subtitle="Detección de abandono de carrito en tiempo real"
                glowColor="from-cyan-500/40 to-blue-500/40"
                delay={0.3}
            />
            <VerticalBeam delay={0.4} height={40} />
            <ConversionNode
                icon={Smartphone}
                title="3. WhatsApp Recovery"
                subtitle="Mensaje instantáneo (Rescata hasta 40% de carritos)"
                glowColor="from-green-500/40 to-emerald-500/40"
                delay={0.5}
            />
            <VerticalBeam delay={0.6} height={40} />
            <ConversionNode
                icon={RefreshCw}
                title="4. Retargeting Dinámico"
                subtitle="Catálogo IA con variante A/B optimizada"
                glowColor="from-purple-500/40 to-pink-500/40"
                delay={0.7}
            />
            <VerticalBeam delay={0.8} height={40} />
            <ConversionNode
                icon={TrendingUp}
                title="5. Análisis y Fidelización"
                subtitle="Dashboard LTV y Automatización Post-compra"
                glowColor="from-yellow-500/40 to-amber-500/40"
                delay={0.9}
            />
        </motion.div>
    )
}

function LocalEngine() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col items-center w-full"
        >
            <ConversionNode
                icon={MapPin}
                title="1. Descubrimiento Local"
                subtitle="Google Maps y Ads Geo-localizados"
                delay={0.1}
            />
            <VerticalBeam delay={0.2} height={40} />
            <ConversionNode
                icon={Bot}
                title="2. Recepción IA 24/7"
                subtitle="Chatbot califica y responde en < 1 minuto"
                glowColor="from-purple-500/40 to-pink-500/40"
                delay={0.3}
            />
            <VerticalBeam delay={0.4} height={40} />
            <ConversionNode
                icon={CalendarClock}
                title="3. Agendamiento Inteligente"
                subtitle="Coordina citas sin riesgo de colisión"
                glowColor="from-cyan-500/40 to-blue-500/40"
                delay={0.5}
            />
            <VerticalBeam delay={0.6} height={40} />
            <ConversionNode
                icon={BellRing}
                title="4. Recordatorios Anti-Faltas"
                subtitle="Avisos WhatsApp (Reducen no-shows un 60%)"
                glowColor="from-green-500/40 to-emerald-500/40"
                delay={0.7}
            />
            <VerticalBeam delay={0.8} height={40} />
            <ConversionNode
                icon={Star}
                title="5. Motor de Reseñas"
                subtitle="Solicitud automática post-servicio (Sube Ranking 🚀)"
                glowColor="from-yellow-400/40 to-orange-500/40"
                delay={0.9}
            />
        </motion.div>
    )
}
