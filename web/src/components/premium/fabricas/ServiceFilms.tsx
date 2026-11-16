"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { localePath } from "@/config/site";
import { getDoorFilm } from "@/data/doorFilms";
import { SERVICE_SOLUTIONS } from "@/data/solutionsData";
import { CaseReel } from "@/components/shared/CaseReel";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const copy = {
  es: {
    title: "Un film por servicio",
    body: "Cada servicio de este sitio abre con un film de ocho segundos hecho en código: primero el cine y después la interfaz. Cada uno sale de un proyecto distinto y tiene su color.",
    play: "Reproducir el film de",
    pause: "Pausar el film de",
  },
  en: {
    title: "One film per service",
    body: "Each service on this site opens with an eight-second film made in code: the cinema first, then the interface. Each one comes from a different project and has its own color.",
    play: "Play the film for",
    pause: "Pause the film for",
  },
} as const;

/**
 * Los cuatro films de las puertas del home, juntos. Se reproduce uno a la
 * vez: al pasar el mouse o al tocarlo. En reposo cada uno muestra su póster.
 */
export function ServiceFilms({ language }: { language: "es" | "en" }) {
  const c = copy[language];
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  const reducedMotion = useReducedMotionSafe() === true;
  const films = SERVICE_SOLUTIONS.flatMap((service) => {
    const film = getDoorFilm(service.id, language);
    return film ? [{ service, film }] : [];
  });
  if (!films.length) return null;

  return (
    <section data-service-films aria-labelledby={`${id}-title`} className="mx-auto mt-16 max-w-[1480px] px-5 sm:mt-20 sm:px-8 lg:px-12">
      <h2 id={`${id}-title`} className="text-3xl font-medium leading-tight tracking-[-.03em] text-foreground">{c.title}</h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground/75">{c.body}</p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
        {films.map(({ service, film }) => {
          const isActive = active === service.id;
          return (
            <li key={service.id} data-service-film={service.id}>
              <button
                type="button"
                disabled={reducedMotion}
                aria-pressed={reducedMotion ? undefined : isActive}
                aria-label={`${isActive ? c.pause : c.play} ${service.shortTitle[language]}`}
                onClick={() => setActive(isActive ? null : service.id)}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(service.id); }}
                onPointerLeave={(event) => { if (event.pointerType === "mouse") setActive((current) => (current === service.id ? null : current)); }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-foreground/15 bg-[#0B0B0A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CaseReel reel={film} alt="" playing={isActive} restartOnPlay className="absolute inset-0 h-full w-full" sizes="(min-width: 1024px) 24vw, 50vw" />
                {!reducedMotion && (
                  <span aria-hidden="true" className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white">
                    {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </span>
                )}
              </button>
              <p className="mt-3 flex items-center gap-2.5 text-base font-medium text-foreground">
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: film.tone }} />
                <Link href={localePath(language, service.path)} className="inline-flex items-center gap-1.5 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {service.shortTitle[language]}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/65">{film.source[language]}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
