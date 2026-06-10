"use client";

import { useEffect, useState } from "react";
import { motion, LazyMotion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Eye, Gauge, Route, Sparkles, Wrench } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
    SiAnthropic,
    SiAstro,
    SiGooglegemini,
    SiHubspot,
    SiMeta,
    SiN8N,
    SiNextdotjs,
    SiOpenai,
    SiReact,
    SiSalesforce,
    SiSupabase,
    SiVercel,
    SiVite,
    SiWhatsapp,
    SiWordpress,
} from "react-icons/si";

const loadFeatures = () =>
    import("framer-motion").then((res) => res.domAnimation);

const ROTATING_ROLES = [
    { label: "Creative Technologist", color: "text-blue-400", dot: "bg-blue-400", shadow: "shadow-[0_0_8px_rgba(96,165,250,0.5)]" },
    { label: "Motion Designer", color: "text-violet-400", dot: "bg-violet-400", shadow: "shadow-[0_0_8px_rgba(167,139,250,0.5)]" },
    { label: "Vibe Coder / AI Integrator", color: "text-emerald-400", dot: "bg-emerald-400", shadow: "shadow-[0_0_8px_rgba(52,211,153,0.5)]" },
    { label: "Operations Optimizer", color: "text-amber-400", dot: "bg-amber-400", shadow: "shadow-[0_0_8px_rgba(251,191,36,0.5)]" },
];

const TECH_NODES = [
    { name: "OpenAI", group: "AI", Icon: SiOpenai, x: 14, y: 22, delay: 0.1 },
    { name: "Anthropic", group: "AI", Icon: SiAnthropic, x: 28, y: 13, delay: 0.2 },
    { name: "Gemini", group: "AI", Icon: SiGooglegemini, x: 72, y: 14, delay: 0.3 },
    { name: "Meta", group: "Signals", Icon: SiMeta, x: 85, y: 28, delay: 0.4 },
    { name: "Next.js", group: "Product", Icon: SiNextdotjs, x: 9, y: 49, delay: 0.5 },
    { name: "React", group: "Interface", Icon: SiReact, x: 91, y: 50, delay: 0.6 },
    { name: "Supabase", group: "Data", Icon: SiSupabase, x: 20, y: 76, delay: 0.7 },
    { name: "n8n", group: "Flows", Icon: SiN8N, x: 80, y: 77, delay: 0.8 },
    { name: "WhatsApp", group: "Comms", Icon: SiWhatsapp, x: 64, y: 87, delay: 0.9 },
    { name: "Vercel", group: "Deploy", Icon: SiVercel, x: 39, y: 86, delay: 1 },
    { name: "HubSpot", group: "CRM", Icon: SiHubspot, x: 6, y: 68, delay: 1.1 },
    { name: "Salesforce", group: "CRM", Icon: SiSalesforce, x: 94, y: 67, delay: 1.2 },
    { name: "WordPress", group: "CMS", Icon: SiWordpress, x: 41, y: 8, delay: 1.3 },
    { name: "Astro", group: "Web", Icon: SiAstro, x: 58, y: 8, delay: 1.4 },
    { name: "Vite", group: "Build", Icon: SiVite, x: 50, y: 91, delay: 1.5 },
] as const;

const IMPLEMENTATION_PLANS = [
    {
        title: "Diagnosticar",
        detail: "Detectar el cuello de botella real.",
        Icon: Route,
        x: 28,
        y: 69,
        tone: "text-cyan-300",
    },
    {
        title: "Implementar",
        detail: "Unir stack, contenido y operación.",
        Icon: Wrench,
        x: 50,
        y: 77,
        tone: "text-emerald-300",
    },
    {
        title: "Refinar / Escalar",
        detail: "Pulir detalles y preparar crecimiento.",
        Icon: Gauge,
        x: 72,
        y: 69,
        tone: "text-amber-300",
    },
] as const;

function TechChip({
    name,
    Icon,
    x,
    y,
    scale,
    opacity,
    index,
}: {
    name: string;
    Icon: React.ComponentType<{ className?: string }>;
    x: number;
    y: number;
    scale: number;
    opacity: number;
    index: number;
}) {
    return (
        <div
            className="absolute z-10 hidden md:block"
            style={{
                // Redondeo determinista: Math.cos/sin no son bit-idénticos entre
                // Node (SSR) y el navegador, lo que causa mismatch de hidratación.
                left: `${x.toFixed(3)}%`,
                top: `${y.toFixed(3)}%`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <motion.div
                className="transform-gpu"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                    opacity: opacity,
                    scale: scale,
                }}
                transition={{
                    opacity: { duration: 0.6, delay: index * 0.04 },
                    scale: { duration: 0.6, delay: index * 0.04 },
                }}
            >
                <div className="group flex items-center gap-1.5 rounded-full border border-white/5 bg-black/45 px-2.5 py-1.5 text-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/25 hover:bg-emerald-950/15 hover:text-white hover:shadow-[0_0_15px_rgba(16,245,178,0.12)]">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-white/50 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[10.5px] font-bold text-white/70 group-hover:text-white transition-colors">{name}</span>
                </div>
            </motion.div>
        </div>
    );
}

function PlanNode({
    plan,
    index,
    reduceMotion,
}: {
    plan: (typeof IMPLEMENTATION_PLANS)[number];
    index: number;
    reduceMotion: boolean;
}) {
    const { t } = useLanguage();
    const Icon = plan.Icon;

    const getPlanTranslation = (idx: number) => {
        if (idx === 0) return { title: t('hero', 'plan01_title'), detail: t('hero', 'plan01_detail') };
        if (idx === 1) return { title: t('hero', 'plan02_title'), detail: t('hero', 'plan02_detail') };
        if (idx === 2) return { title: t('hero', 'plan03_title'), detail: t('hero', 'plan03_detail') };
        return { title: '', detail: '' };
    };

    const { title, detail } = getPlanTranslation(index);

    return (
        <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left shadow-[0_10px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
            <motion.div
                className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent"
                animate={{ opacity: reduceMotion ? 0.35 : [0.15, 0.55, 0.15] }}
                transition={{ duration: 2.8, delay: index * 0.5, repeat: reduceMotion ? 0 : Infinity }}
            />
            <div className="flex items-start gap-3">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/40 ${plan.tone}`}>
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                        Plan {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-sm font-black uppercase tracking-[0.1em] text-white">
                        {title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/45">
                        {detail}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export function SpiralTechHeroScene() {
    const { t } = useLanguage();
    const prefersReducedMotion = useReducedMotion();
    const reduceMotion = Boolean(prefersReducedMotion);

    // Movimiento del mouse para efecto interactivo
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Resortes suavizados para paralaje 3D fluido
    const springX = useSpring(mouseX, { stiffness: 45, damping: 18 });
    const springY = useSpring(mouseY, { stiffness: 45, damping: 18 });

    // Transformaciones para efecto tilt / paralaje
    const rotateX = useTransform(springY, [-1, 1], [8, -8]);
    const rotateY = useTransform(springX, [-1, 1], [-8, 8]);
    const translateX = useTransform(springX, [-1, 1], [-20, 20]);
    const translateY = useTransform(springY, [-1, 1], [-20, 20]);

    useEffect(() => {
        if (reduceMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY, reduceMotion]);

    // Parámetros de la espiral
    const turns = 1.6;
    const maxR = 36; // radio exterior máximo %
    const minR = 13; // radio interior mínimo %
    const centerX = 50;
    const centerY = 44; // centrado con respecto al fondo mesh

    const spiralNodes = TECH_NODES.map((node, index) => {
        const t = index / (TECH_NODES.length - 1); // 0 (exterior) a 1 (interior)
        const angle = t * turns * Math.PI * 2 + 0.8; // desfase inicial
        const r = maxR - t * (maxR - minR);

        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        // Escala decreciente hacia el centro
        const scale = 0.82 + (1 - t) * 0.22; // de 0.82 a 1.04
        const opacity = 0.35 + (1 - t) * 0.55; // de 0.35 en el centro a 0.9 en el exterior

        return {
            ...node,
            x,
            y,
            scale,
            opacity,
        };
    });

    // Generador de la curva SVG de la espiral (del centro al exterior)
    const generateSpiralSVGPath = () => {
        const points = [];
        const steps = 100;
        const maxSVG_R = maxR * 10;
        const minSVG_R = minR * 10;
        const cx = centerX * 10;
        const cy = centerY * 10;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = t * turns * Math.PI * 2 + 0.8;
            const r = minSVG_R + t * (maxSVG_R - minSVG_R);
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        return points.join(' ');
    };

    const spiralPathD = generateSpiralSVGPath();

    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Fondos radiales y grilla sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(16,245,178,0.11),transparent_26%),radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.07),transparent_22%),radial-gradient(circle_at_85%_80%,rgba(251,191,36,0.06),transparent_22%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:88px_88px] opacity-20 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_42%,#000_30%,transparent_100%)]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Contenedor con perspectiva 3D y paralaje */}
            <motion.div
                className="absolute inset-0 z-0 flex items-center justify-center transform-gpu"
                style={{
                    x: translateX,
                    y: translateY,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    perspective: 1000,
                    transformStyle: "preserve-3d",
                }}
            >
                {/* SVG para dibujar las líneas de la espiral y los pulsos de luz */}
                <svg
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <linearGradient id="spiral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.01" />
                            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.14" />
                            <stop offset="100%" stopColor="#10f5b2" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="pulse-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10f5b2" stopOpacity="0" />
                            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#10f5b2" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="pulse-gradient-2" x1="100%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Línea base de la espiral */}
                    <path
                        d={spiralPathD}
                        stroke="url(#spiral-gradient)"
                        strokeWidth="1.5"
                        fill="none"
                        className="opacity-30"
                    />

                    {/* Pulso de luz 1 (rápido, cian/verde) */}
                    {!reduceMotion && (
                        <motion.path
                            d={spiralPathD}
                            stroke="url(#pulse-gradient-1)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray="25 220"
                            animate={{ strokeDashoffset: [0, -245] }}
                            transition={{
                                duration: 5.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="opacity-70"
                        />
                    )}

                    {/* Pulso de luz 2 (lento, azul/verde) */}
                    {!reduceMotion && (
                        <motion.path
                            d={spiralPathD}
                            stroke="url(#pulse-gradient-2)"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="40 300"
                            animate={{ strokeDashoffset: [200, -140] }}
                            transition={{
                                duration: 8.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="opacity-50"
                        />
                    )}
                </svg>

                {/* Núcleo central - Resultados */}
                <div
                    className="absolute z-20"
                    style={{
                        left: `${centerX}%`,
                        top: `${centerY}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <motion.div
                        className="flex flex-col items-center justify-center rounded-full border border-emerald-500/25 bg-black/80 shadow-[0_0_60px_rgba(16,245,178,0.22)] backdrop-blur-2xl w-28 h-28 sm:w-36 sm:h-36"
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                        animate={{
                            scale: [1, 1.04, 1],
                            boxShadow: [
                                "0 0 50px rgba(16,245,178,0.18)",
                                "0 0 75px rgba(16,245,178,0.35)",
                                "0 0 50px rgba(16,245,178,0.18)"
                            ]
                        }}
                        transition={{
                            duration: 5.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <div className="absolute inset-1.5 rounded-full border border-dashed border-emerald-500/15 animate-spin [animation-duration:24s]" />
                        <span className="relative z-10 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-emerald-400 sm:text-[10px]">
                            {t('hero', 'results')}
                        </span>
                        <Sparkles className="mt-1.5 h-4.5 w-4.5 text-emerald-300 animate-pulse sm:h-5 sm:w-5" />
                        <span className="mt-1 font-mono text-[7px] text-white/30 uppercase tracking-[0.16em]">
                            {t('hero', 'active_systems')}
                        </span>
                    </motion.div>
                </div>

                {/* Renderizar los chips de tecnología distribuidos en la espiral */}
                {spiralNodes.map((node, index) => (
                    <TechChip
                        key={node.name}
                        name={node.name}
                        Icon={node.Icon}
                        x={node.x}
                        y={node.y}
                        scale={node.scale}
                        opacity={node.opacity}
                        index={index}
                    />
                ))}
            </motion.div>

            {/* Planes de implementación abajo */}
            <div className="absolute inset-x-4 bottom-24 z-10 hidden grid-cols-3 gap-3 md:grid xl:bottom-20 xl:left-1/2 xl:w-[780px] xl:-translate-x-1/2">
                {IMPLEMENTATION_PLANS.map((plan, index) => (
                    <PlanNode key={plan.title} plan={plan} index={index} reduceMotion={reduceMotion} />
                ))}
            </div>
        </div>
    );
}

function MobileTechRail() {
    const prefersReducedMotion = useReducedMotion();
    const reduceMotion = Boolean(prefersReducedMotion);
    const mobileNodes = [TECH_NODES[0], TECH_NODES[2], TECH_NODES[4], TECH_NODES[7], TECH_NODES[6]];

    return (
        <motion.div
            className="mx-auto mb-4 grid max-w-[22rem] grid-cols-5 gap-2 md:hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
        >
            {mobileNodes.map((node, index) => {
                const Icon = node.Icon;
                return (
                    <motion.div
                        key={node.name}
                        className="grid h-10 place-items-center rounded-2xl border border-white/10 bg-black/35 text-white/45 backdrop-blur-xl"
                        animate={{ y: reduceMotion ? 0 : [0, index % 2 === 0 ? -3 : 3, 0] }}
                        transition={{ duration: 4 + index * 0.25, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                    >
                        <Icon className="h-5 w-5" />
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

function MobilePlanRail() {
    const { t } = useLanguage();
    return (
        <motion.div
            className="mx-auto mb-5 grid max-w-[24rem] gap-1.5 sm:grid-cols-3 md:hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
            {IMPLEMENTATION_PLANS.map((plan, index) => {
                const Icon = plan.Icon;
                const getPlanTranslation = (idx: number) => {
                    if (idx === 0) return t('hero', 'plan01_title');
                    if (idx === 1) return t('hero', 'plan02_title');
                    if (idx === 2) return t('hero', 'plan03_title');
                    return '';
                };
                return (
                    <div
                        key={plan.title}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-left backdrop-blur-xl"
                    >
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/35 ${plan.tone}`}>
                            <Icon className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-white/30">
                                Plan {String(index + 1).padStart(2, "0")}
                            </p>
                            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-white">
                                {getPlanTranslation(index)}
                            </p>
                        </div>
                    </div>
                );
            })}
        </motion.div>
    );
}

export function HeroSection() {
    const { t } = useLanguage();
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROTATING_ROLES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const activeRole = ROTATING_ROLES[roleIndex];

    return (
        <LazyMotion features={loadFeatures}>
            <section
                className="relative flex min-h-[100svh] flex-col items-center justify-start overflow-hidden bg-black pt-20 pb-40 sm:justify-center sm:pt-24 md:pb-48"
                aria-labelledby="hero-heading"
            >
                <SpiralTechHeroScene />

                <div className="container relative z-20 flex flex-col items-center px-4 md:px-6">
                    <motion.div className="max-w-5xl text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="mx-auto mb-5 inline-flex max-w-[calc(100vw-2rem)] items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/35 px-4 py-2.5 shadow-[0_0_50px_rgba(16,245,178,0.08)] backdrop-blur-xl sm:mb-7 sm:px-5">
                                <span className={`mr-3 flex h-1.5 w-1.5 shrink-0 rounded-full ${activeRole.dot} ${activeRole.shadow}`} />
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={roleIndex}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em] ${activeRole.color}`}
                                    >
                                        {t('hero', 'role_' + roleIndex)}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <motion.h1
                            id="hero-heading"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto mb-4 max-w-5xl text-balance text-4xl font-black uppercase leading-[0.94] tracking-normal text-white sm:mb-5 sm:text-6xl sm:leading-[0.92] md:text-7xl xl:text-8xl"
                        >
                            {t('hero', 'title1')}
                            <br />
                            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-white/45 bg-clip-text text-transparent">
                                {t('hero', 'title2')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto mb-3 hidden max-w-2xl text-sm font-medium uppercase tracking-wide text-white/40 sm:block sm:text-base"
                        >
                            {t('hero', 'tagline')}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto mb-5 max-w-[22rem] text-pretty text-sm font-light leading-relaxed text-white/60 sm:mb-9 sm:max-w-[720px] sm:text-lg md:text-xl"
                        >
                            {t('hero', 'subtitle')}
                        </motion.p>

                        <MobileTechRail />
                        <MobilePlanRail />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="mx-auto flex w-full max-w-[22rem] flex-col justify-center gap-2.5 sm:w-auto sm:max-w-none sm:flex-row sm:gap-5"
                        >
                            <motion.a
                                href="/aplicar"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-600/20 to-cyan-600/10 px-7 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all duration-500 active:scale-95 sm:min-h-14 sm:px-9 sm:py-4 sm:text-sm"
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/25 to-cyan-500/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <Sparkles className="h-4 w-4 text-emerald-300" />
                                    {t('hero', 'cta_build')}
                                    <ArrowRight className="h-4 w-4 text-emerald-400 transition-transform duration-500 group-hover:translate-x-2" />
                                </span>
                            </motion.a>

                            <motion.a
                                href="/casos-de-exito"
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-7 py-3 text-xs font-black uppercase text-white/55 transition-all duration-500 hover:border-white/20 hover:bg-white/5 hover:text-white/85 sm:min-h-14 sm:px-8 sm:py-4 sm:text-sm"
                            >
                                <Eye className="mr-2 inline h-4 w-4" /> {t('hero', 'cta_cases')} →
                            </motion.a>
                        </motion.div>

                    </motion.div>
                </div>
            </section>
        </LazyMotion>
    );
}
