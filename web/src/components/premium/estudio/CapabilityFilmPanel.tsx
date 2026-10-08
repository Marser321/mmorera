"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import { localePath } from "@/config/site";
import type { Language } from "@/context/LanguageContext";
import { CAPABILITY_CASES } from "@/data/capabilityCases";
import { capabilityChapters, capabilityDuration, CAPABILITY_FILM_CASES, splitCaseLine } from "@/data/films/capabilityFilms";
import { SKILL_ORBIT } from "@/data/skillOrbit";
import type { Family } from "@/data/techStack";
import { FilmChapters, useFilmPlayback } from "@/components/films/FilmChapters";
import type { FilmSource } from "@/components/films/FilmCanvas";
import { FilmStage, useFilmFormat } from "@/components/films/FilmStage";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const COPY = {
    es: {
        eyebrow: "Film de la capacidad",
        hint: "Abrí otra familia en la órbita para ver su film.",
        cases: "Casos que lo demuestran",
        open: (name: string) => `Ver ${name} en su film`,
    },
    en: {
        eyebrow: "Capability film",
        hint: "Open another family in the orbit to see its film.",
        cases: "Cases that prove it",
        open: (name: string) => `See ${name} in its film`,
    },
} as const;

const caseHref = (language: Language, slug: string, chapter: string) => localePath(language, `/casos-de-exito/${slug}#film-${chapter}`);

/**
 * Film corto de la familia abierta en la órbita de /estudio (~25 s): qué
 * resuelve, con qué herramientas y los casos que la demuestran, cada uno
 * enlazado al capítulo de su film. Se reproduce al verse, una vez.
 */
export function CapabilityFilmPanel({ family, language }: { family: Family; language: Language }) {
    const c = COPY[language];
    const node = SKILL_ORBIT.find((item) => item.id === family)!;
    const format = useFilmFormat();
    const reducedMotion = useReducedMotionSafe() === true;
    const [player, setPlayer] = useState<PlayerRef | null>(null);
    const [visible, setVisible] = useState(false);
    const userPausedRef = useRef(false);
    const chapters = useMemo(() => capabilityChapters(family), [family]);
    const durationInFrames = capabilityDuration(family);
    const lastFrame = durationInFrames - 1;
    const { chapterIndex, playing, barsRef } = useFilmPlayback(player, chapters);
    const cases = CAPABILITY_CASES[family];
    const source = useMemo<FilmSource>(() => ({ kind: "capability", durationInFrames, props: { family, language } }), [durationInFrames, family, language]);

    // Elegir otra familia es pedir su film: vuelve a reproducirse aunque se haya pausado el anterior.
    useEffect(() => {
        userPausedRef.current = false;
    }, [family]);

    useEffect(() => {
        if (!player) return;
        if (visible && !reducedMotion && !userPausedRef.current && player.getCurrentFrame() < lastFrame) player.play();
        else player.pause();
    }, [lastFrame, player, reducedMotion, visible]);

    const seekChapter = (index: number) => {
        if (!player) return;
        player.seekTo(chapters[index].from);
        if (!reducedMotion && !userPausedRef.current) player.play();
    };

    const togglePlay = () => {
        if (!player) return;
        if (player.isPlaying()) {
            userPausedRef.current = true;
            player.pause();
            return;
        }
        userPausedRef.current = false;
        if (player.getCurrentFrame() >= lastFrame) player.seekTo(0);
        player.play();
    };

    // El capítulo de un caso suma el enlace directo a ese caso, en el mismo momento de su film.
    const activeCase = chapterIndex > 0 ? cases[chapterIndex - 1] : undefined;
    // Póster mientras el Player no se monta: el film es oscuro también en modo claro.
    const posterStill = `/portfolio/films/${cases[0].slug}/${cases[0].still}-${language}.jpg`;

    return (
        <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/55">{c.eyebrow}</p>
            <h3 className="mt-3 flex items-center gap-3 text-2xl font-medium tracking-[-0.04em] text-foreground">
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: node.color }} />
                {node.label[language]}
            </h3>
            <p className="mt-2 text-sm text-foreground/50">{c.hint}</p>

            <FilmStage
                key={family}
                source={source}
                format={format}
                onPlayer={setPlayer}
                onVisibleChange={setVisible}
                initialFrame={reducedMotion ? lastFrame : 0}
                className="mt-6 bg-[#070809] shadow-[0_40px_110px_-50px_rgba(0,0,0,0.85)]"
                poster={<Image src={posterStill} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover opacity-35" />}
            />
            <FilmChapters
                chapters={chapters}
                chapterIndex={chapterIndex}
                playing={playing}
                barsRef={barsRef}
                language={language}
                onSeekChapter={seekChapter}
                onTogglePlay={togglePlay}
                actions={
                    activeCase ? (
                        <Link
                            href={caseHref(language, activeCase.slug, activeCase.chapter)}
                            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/14 px-4 py-2 text-sm text-foreground transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.14)] light:hover:border-[rgb(var(--ink-rgb)/0.3)]"
                        >
                            {c.open(splitCaseLine(activeCase.line[language]).name)}
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    ) : null
                }
            />

            <div className="mt-8 border-t border-white/10 pt-6 light:border-[rgb(var(--ink-rgb)/0.1)]">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/55">{c.cases}</p>
                <ul className="mt-4 grid gap-2">
                    {cases.map((entry, index) => {
                        const { name, text } = splitCaseLine(entry.line[language]);
                        const inFilm = index < CAPABILITY_FILM_CASES;
                        return (
                            <li key={`${entry.slug}-${entry.chapter}`}>
                                <Link
                                    href={caseHref(language, entry.slug, entry.chapter)}
                                    className="group flex items-start justify-between gap-4 rounded-2xl border border-white/10 px-4 py-3.5 transition-colors hover:border-white/25 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal light:border-[rgb(var(--ink-rgb)/0.1)] light:hover:border-[rgb(var(--ink-rgb)/0.24)] light:hover:bg-[rgb(var(--ink-rgb)/0.03)]"
                                    aria-current={inFilm && activeCase === entry ? "true" : undefined}
                                >
                                    <span>
                                        <span className="block text-base font-medium text-foreground">{name}</span>
                                        <span className="mt-1 block text-sm leading-6 text-foreground/55">{text}</span>
                                    </span>
                                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-foreground/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
