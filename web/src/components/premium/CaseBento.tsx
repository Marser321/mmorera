"use client";

import { useMemo } from "react";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { themedAccent } from "@/data/particleScenes";
import type { ProjectCase } from "@/types/site";
import { MagicBento, type BentoItem } from "@/components/ui/magic-bento";

/**
 * Puente entre `PROJECT_CASES` y la bento animada: cada caso aporta su portada,
 * su acento y su enlace, y el primero puede ocupar la celda 2×2. Lo usan la
 * home (destacados) y /casos-de-exito (archivo).
 */
export function CaseBento({
    projects,
    featureFirst = false,
    className,
}: {
    projects: ProjectCase[];
    /** El primer caso ocupa la celda grande. */
    featureFirst?: boolean;
    className?: string;
}) {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const isEs = language === "es";

    const items = useMemo<BentoItem[]>(
        () =>
            projects.map((project, index) => ({
                id: project.slug,
                label: project.kind?.[language] ?? project.stack[0],
                title: project.title[language],
                description: project.summary[language],
                href: localePath(language, `/casos-de-exito/${project.slug}`),
                accent: themedAccent(project.accent ?? "#B68CFF", theme),
                media: project.media[0]
                    ? { src: project.media[0].src, alt: project.media[0].alt[language] }
                    : undefined,
                featured: featureFirst && index === 0,
                // Sin destacada, si sobra una sola tarjeta en la última fila
                // se ensancha en vez de quedar huérfana.
                wide: !featureFirst && projects.length % 3 === 1 && index === projects.length - 1,
                // Con destacada (4 celdas en desktop), si la última fila queda
                // con un hueco, la última tarjeta lo cubre solo en desktop.
                wideLg: featureFirst && (projects.length + 3) % 3 === 2 && index === projects.length - 1,
                footer: project.year ?? project.client?.[language],
            })),
        [projects, language, theme, featureFirst],
    );

    return (
        <MagicBento
            items={items}
            className={className}
            textAutoHide
            enableTilt
            ctaLabel={isEs ? "Abrir caso" : "Open case"}
        />
    );
}
