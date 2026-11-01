"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { flagshipRuntime, flagshipStill, hasFlagshipFilm, type FlagshipSlug } from "@/data/films/flagships/slugs";
import { PROJECT_CASES } from "@/data/projectCases";

const COPY = {
  es: { eyebrow: "Films de los casos", title: "Cada caso, contado como un film.", body: "Un minuto y poco por caso, armado con el sitio real de cada cliente.", watch: "Ver el film" },
  en: { eyebrow: "Case films", title: "Each case, told as a film.", body: "Just over a minute per case, built from each client's real site.", watch: "Watch the film" },
} as const;

/** En el orden del archivo de casos (Fénix primero). */
const FILM_CASES = PROJECT_CASES.filter((project) => hasFlagshipFilm(project.slug));


/**
 * Riel de films del home: cada tarjeta muestra la apertura del film (marca y
 * frase) y, al pasar el mouse o enfocarla, su escena protagonista. Lleva
 * directo al film dentro del caso (#film), que arranca al verse.
 */
export function FilmRail() {
  const { language } = useLanguage();
  const c = COPY[language];
  return (
    <section aria-labelledby="film-rail-title" className="pb-10 sm:pb-14">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-signal">{c.eyebrow}</p>
          <h3 id="film-rail-title" className="mt-2 text-[clamp(1.4rem,2.4vw,2.1rem)] font-medium leading-tight tracking-[-0.04em] text-foreground">
            {c.title}
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/55 md:text-right">{c.body}</p>
      </div>
      <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:thin] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0">
        {FILM_CASES.map((project) => {
          const slug = project.slug as FlagshipSlug;
          return (
            <li key={slug} className="w-[80vw] max-w-[440px] shrink-0 snap-start sm:w-[400px] xl:w-[calc((100%-4rem)/3.3)] xl:max-w-none">
              <Link
                href={localePath(language, `/casos-de-exito/${slug}#film`)}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-card light:border-[rgb(var(--ink-rgb)/0.1)]">
                  <Image
                    src={flagshipStill(slug, "og", language)!}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 400px, 80vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <Image
                    src={flagshipStill(slug, "hero", language)!}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 400px, 80vw"
                    className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                  {/* La apertura lleva la frase abajo a la izquierda: nada se le superpone. */}
                  <span aria-hidden="true" className="absolute right-3 top-3 grid h-10 w-10 scale-90 place-items-center rounded-full bg-signal text-background opacity-0 shadow-[0_0_30px_rgba(113,243,162,0.4)] transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <Play className="h-4 w-4 translate-x-px fill-current" />
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="truncate text-base font-medium tracking-[-0.02em] text-foreground">{project.title[language]}</span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-[.08em] text-signal">
                    <Play className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                    {c.watch} · {flagshipRuntime(slug)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
