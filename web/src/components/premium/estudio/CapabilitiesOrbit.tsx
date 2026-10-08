"use client";

import { useCallback, useMemo, useState } from "react";
import { useActiveTech } from "@/context/ActiveTechContext";
import type { Language } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { themedAccent } from "@/data/particleScenes";
import { SKILL_ORBIT, techsForFamily, type SkillStance } from "@/data/skillOrbit";
import type { Family } from "@/data/techStack";
import { DrawRule } from "@/components/motion/DrawRule";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { RadialOrbitalTimeline, type RadialOrbitalNode } from "@/components/ui/radial-orbital-timeline";
import { CapabilityFilmPanel } from "./CapabilityFilmPanel";

/**
 * "01 · Capacidades" como órbita: cada familia del stack gira alrededor de un
 * núcleo y, al abrirse, muestra sus tecnologías reales. Abrir un nodo también
 * toma el control del campo de partículas global y del label contextual del
 * hero, así que la sección no es decorativa: dirige la escena. Al lado, el
 * film corto de la familia abierta y los casos que la demuestran.
 */

/** Default de /estudio — se restaura al cerrar un nodo. */
const STUDIO_FAMILIES: Family[] = ["Media", "Marketing", "Web"];

/** Film que se ve antes de abrir una familia (el primero de STUDIO_FAMILIES). */
const DEFAULT_FILM: Family = STUDIO_FAMILIES[0];

const STANCE_COPY: Record<SkillStance, { es: string; en: string; variant: "signal" | "accent" | "muted" }> = {
    core: { es: "Práctica diaria", en: "Daily practice", variant: "signal" },
    active: { es: "En producción", en: "In production", variant: "accent" },
    exploring: { es: "En incorporación", en: "Onboarding", variant: "muted" },
};

const COPY = {
    es: {
        eyebrow: "01 · Capacidades",
        title: "Nueve familias que trabajan juntas.",
        intro:
            "No son habilidades sueltas en una lista: cada familia se apoya en las demás. Abrí una para ver qué resuelve y con qué herramientas.",
        level: "Profundidad de práctica",
        related: "Familias conectadas",
        hint: "Tocá un nodo para abrirlo · Esc para cerrar",
        tools: "Herramientas",
        toolsCount: (n: number) => `${n} herramientas`,
    },
    en: {
        eyebrow: "01 · Capabilities",
        title: "Nine families that work together.",
        intro:
            "Not loose skills on a list: each family leans on the others. Open one to see what it solves and with which tools.",
        level: "Depth of practice",
        related: "Connected families",
        hint: "Tap a node to open it · Esc to close",
        tools: "Tools",
        toolsCount: (n: number) => `${n} tools`,
    },
} as const;

export function CapabilitiesOrbit({ language }: { language: Language }) {
    const { theme } = useTheme();
    const { setActiveFamilies } = useActiveTech();
    const c = COPY[language];
    // El film sigue a la familia abierta; al cerrarla queda el último elegido.
    const [filmFamily, setFilmFamily] = useState<Family>(DEFAULT_FILM);

    const nodes = useMemo<RadialOrbitalNode[]>(
        () =>
            SKILL_ORBIT.map((skill) => {
                const stance = STANCE_COPY[skill.stance];
                return {
                    id: skill.id,
                    title: skill.label[language],
                    meta: c.toolsCount(techsForFamily(skill.id).length),
                    body: skill.blurb[language],
                    color: themedAccent(skill.color, theme),
                    Icon: skill.Icon,
                    relatedIds: skill.related,
                    status: { label: stance[language], variant: stance.variant },
                    level: skill.depth,
                };
            }),
        [language, theme, c]
    );

    // Abrir un nodo dirige la escena global: el campo de partículas pasa a
    // recorrer esa familia y, con él, el label "Tecnología contextual" del hero
    // (`activeTechName` lo escribe el propio campo, no esta sección).
    const handleActiveChange = useCallback(
        (id: string | null) => {
            setActiveFamilies(id ? [id as Family] : STUDIO_FAMILIES);
            if (id) setFilmFamily(id as Family);
        },
        [setActiveFamilies]
    );

    return (
        // overflow-x-clip: antes de medirse, la órbita usa un radio de 200 px y en
        // el teléfono los nodos sobresalían 27 px (scroll lateral al cargar).
        <section className="mt-24 overflow-x-clip border-y border-white/10 bg-card px-5 py-20 sm:px-8 lg:px-12 lg:py-28 light:border-[rgb(var(--ink-rgb)/0.1)]">
            <div className="mx-auto max-w-[1480px]">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/55">
                    {c.eyebrow}
                </p>
                <div className="mt-6 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                    <SplitReveal
                        as="h2"
                        text={c.title}
                        className="max-w-3xl text-[clamp(2.2rem,4.4vw,4.6rem)] font-medium leading-[.98] tracking-[-.055em] text-foreground"
                    />
                    <Reveal as="p" x={0} y={18} className="max-w-md text-base leading-7 text-foreground/50 md:justify-self-end">
                        {c.intro}
                    </Reveal>
                </div>
                <DrawRule className="mt-12 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />

                <div className="mt-6 grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-12">
                    <RadialOrbitalTimeline
                        nodes={nodes}
                        labels={{ level: c.level, related: c.related, hint: c.hint }}
                        onActiveChange={handleActiveChange}
                        renderExtra={(node) => {
                            const techs = techsForFamily(node.id as Family);
                            if (techs.length === 0) return null;
                            return (
                                <div className="mt-5 border-t border-white/10 pt-4 light:border-[rgb(var(--ink-rgb)/0.1)]">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55">
                                        {c.tools}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                                        {techs.map((tech) => (
                                            <span key={tech.name} className="text-xs text-foreground/55">
                                                {tech.label?.[language] ?? tech.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <div className="lg:pt-6">
                        <CapabilityFilmPanel family={filmFamily} language={language} />
                    </div>
                </div>
            </div>
        </section>
    );
}
