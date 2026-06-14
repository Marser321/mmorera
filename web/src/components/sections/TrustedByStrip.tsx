"use client";

import { motion } from "framer-motion";
import { techByFamilies, type Tech } from "@/data/techStack";

const upperRowLogos = techByFamilies(["AI", "Automation", "Backend"]);
const lowerRowLogos = techByFamilies(["Web", "Commerce", "Marketing", "CRM"]);

function LogoMark({ logo }: { logo: Tech }) {
    if (logo.Icon) {
        const Icon = logo.Icon;
        return <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />;
    }

    return (
        <span className="grid h-6 min-w-7 place-items-center rounded-md border border-white/10 px-1.5 font-mono text-[10px] font-black tracking-[0.08em] sm:h-7">
            {logo.fallback}
        </span>
    );
}

function TechPill({ logo, index }: { logo: Tech; index: number }) {
    return (
        <div
            className="group flex shrink-0 cursor-default items-center gap-3 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.06]"
            aria-label={`${logo.name} (${logo.category})`}
        >
            <div className="text-white/25 transition-colors duration-500 group-hover:text-white/80">
                <LogoMark logo={logo} />
            </div>
            <span className="whitespace-nowrap text-xs font-medium text-white/20 transition-colors duration-500 group-hover:text-white/60">
                {logo.name}
            </span>
            {index % 5 === 0 && (
                <span className="hidden rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/20 transition-colors duration-500 group-hover:text-white/40 md:inline">
                    {logo.category}
                </span>
            )}
        </div>
    );
}

function MarqueeRow({
    logos,
    duration,
    reverse = false,
}: {
    logos: Tech[];
    duration: number;
    reverse?: boolean;
}) {
    const duplicatedLogos = [...logos, ...logos];

    return (
        <motion.div
            className="flex w-max items-center gap-4 sm:gap-6"
            animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
            transition={{
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration,
                    ease: "linear",
                },
            }}
        >
            {duplicatedLogos.map((logo, index) => (
                <TechPill key={`${logo.name}-${index}`} logo={logo} index={index} />
            ))}
        </motion.div>
    );
}

export function TrustedByStrip() {
    return (
        <section className="relative overflow-hidden border-y border-white/5 bg-transparent py-10">
            <div className="mb-8 px-6 text-center">
                <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.26em] text-white/25 sm:text-[10px] sm:tracking-[0.4em]">
                    Infraestructura que usan las empresas líderes
                </span>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />

                <div className="space-y-4">
                    <MarqueeRow logos={upperRowLogos} duration={45} />
                    <MarqueeRow logos={lowerRowLogos} duration={55} reverse />
                </div>
            </div>
        </section>
    );
}
