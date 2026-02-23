"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    UserPlus, Bot, ShieldAlert, Mail, MessageSquareText,
    Store, ShoppingCart, RefreshCw, Smartphone,
    MapPin, CalendarClock, BellRing, CheckCircle2
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
                <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl mx-auto">
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
                                    layoutId="active-tab"
                                    className="absolute inset-0 bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(47,88,205,0.3)] rounded-xl"
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
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-3xl blur-xl opacity-50 transition duration-700 pointer-events-none"></div>

                    <div className="relative bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 md:p-16 shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center">

                        {/* Ambient inner glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'b2b' && <B2BEngine key="b2b" />}
                            {activeTab === 'ecommerce' && <EcommerceEngine key="ecommerce" />}
                            {activeTab === 'local' && <LocalEngine key="local" />}
                        </AnimatePresence>

                    </div>
                </div>

            </div>
        </section>
    );
}

// -- INDIVIDUAL ENGINES --

function B2BEngine() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full relative"
        >
            <ConversionNode
                icon={UserPlus}
                title="1. Lead entra por campaña"
                subtitle="LinkedIn Ads o Google B2B"
                delay={0.1}
            />

            <VerticalBeam delay={0.2} />

            <ConversionNode
                icon={Bot}
                title="2. IA califica en tiempo real"
                subtitle="Scoring Predictivo de Empresa/Cargo"
                glowColor="from-purple-500/30 to-blue-500/30"
                delay={0.3}
            />

            {/* Bifurcation */}
            <div className="flex flex-col items-center mt-2 w-full">
                <div className="w-[2px] h-6 bg-white/10 relative"></div>
                <div className="flex items-start justify-center w-full max-w-2xl">
                    {/* Left Branch (High Priority) */}
                    <div className="flex flex-col items-center w-1/2 border-t border-white/10 pt-4 relative group">
                        {/* Animated beam taking the left path (corner simplified) */}
                        <div className="absolute -top-[1px] left-1/2 right-0 h-[2px] overflow-hidden flex justify-end">
                            <div className="w-[50%] h-full animate-beam-x bg-green-500 shadow-[0_0_10px_green]" style={{ animationDirection: 'reverse' }}></div>
                        </div>

                        <div className="w-[2px] h-6 bg-white/10 relative overflow-hidden mb-2">
                            <div className="absolute inset-x-0 w-full h-[50%] bg-green-500 shadow-[0_0_10px_green] animate-beam-y delay-300 rounded-full"></div>
                        </div>
                        <ConversionNode
                            icon={ShieldAlert}
                            title="3a. Alta Prioridad"
                            subtitle="Alerta a ejecutivo en Slack"
                            glowColor="from-green-500/30 to-emerald-500/30"
                            delay={0.4}
                        />

                        <VerticalBeam delay={0.5} className="h-8" />
                        <ConversionNode
                            icon={CheckCircle2}
                            title="4. Cierre Personalizado"
                            subtitle="Videollamada 1 a 1"
                            delay={0.6}
                        />
                    </div>

                    {/* Right Branch (Nurturing) */}
                    <div className="flex flex-col items-center w-1/2 border-t border-white/10 pt-4 relative">
                        <div className="absolute -top-[1px] left-0 right-1/2 h-[2px] overflow-hidden justify-start">
                            <div className="w-[50%] h-full animate-beam-x bg-amber-500 shadow-[0_0_10px_orange]"></div>
                        </div>

                        <div className="w-[2px] h-6 bg-white/10 relative overflow-hidden mb-2">
                            <div className="absolute inset-x-0 w-full h-[50%] bg-amber-500 shadow-[0_0_10px_orange] animate-beam-y delay-300 rounded-full"></div>
                        </div>
                        <ConversionNode
                            icon={Mail}
                            title="3b. Nutrición (Nurturing)"
                            subtitle="Email hiper-personalizado"
                            glowColor="from-amber-500/30 to-orange-500/30"
                            delay={0.4}
                        />
                        <VerticalBeam delay={0.5} className="h-8" />
                        <ConversionNode
                            icon={MessageSquareText}
                            title="4. Video Automatizado"
                            subtitle="Clon IA (HeyGen) saluda al prospecto"
                            delay={0.6}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full"
        >
            <ConversionNode
                icon={Store}
                title="1. Tráfico a Tienda"
                subtitle="Meta Ads / TikTok Ads"
                delay={0.1}
            />
            <VerticalBeam delay={0.2} />
            <ConversionNode
                icon={ShoppingCart}
                title="2. Intención de Compra"
                subtitle="Añade al carrito pero no compra"
                glowColor="from-cyan-500/30 to-blue-500/30"
                delay={0.3}
            />
            <VerticalBeam delay={0.4} />
            <ConversionNode
                icon={Smartphone}
                title="3. WhatsApp Recovery"
                subtitle="Mensaje automático con descuento (5min)"
                glowColor="from-green-500/30 to-emerald-500/30"
                delay={0.5}
            />
            <VerticalBeam delay={0.6} />
            <ConversionNode
                icon={RefreshCw}
                title="4. Retargeting Dinámico"
                subtitle="Catálogo IA con el producto exacto"
                delay={0.7}
            />
        </motion.div>
    )
}

function LocalEngine() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full"
        >
            <ConversionNode
                icon={MapPin}
                title="1. Descubrimiento Local"
                subtitle="Google Maps y Anuncios Geo-localizados"
                delay={0.1}
            />
            <VerticalBeam delay={0.2} />
            <ConversionNode
                icon={Bot}
                title="2. Agendamiento Inteligente"
                subtitle="Bot en WhatsApp coordina horarios sin colisión"
                glowColor="from-purple-500/30 to-pink-500/30"
                delay={0.3}
            />
            <VerticalBeam delay={0.4} />
            <ConversionNode
                icon={CalendarClock}
                title="3. Integridad de Datos"
                subtitle="Sincronización en tiempo real con Calendario"
                glowColor="from-cyan-500/30 to-blue-500/30"
                delay={0.5}
            />
            <VerticalBeam delay={0.6} />
            <ConversionNode
                icon={BellRing}
                title="4. Recordatorios Anti-Faltas"
                subtitle="Aviso IA a 24h y 1h antes de la cita"
                delay={0.7}
            />
        </motion.div>
    )
}
