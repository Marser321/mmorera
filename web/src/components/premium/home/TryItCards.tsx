"use client";

import Image from "next/image";
import Link from "next/link";
import { TryItButtons } from "@/components/shared/TryItButtons";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { flagshipRuntime } from "@/data/films/flagships/slugs";
import type { ProjectCase } from "@/types/site";

const ORDER = ["fenix-medical-center", "lb-elite-wash-detail", "new-brothers-barberia"];

export function TryItCards({ projects }: { projects: ProjectCase[] }) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <div className="grid gap-6 lg:grid-cols-3" data-try-it-cards>
      {ORDER.map((slug) => projects.find((project) => project.slug === slug)).filter((project): project is ProjectCase => Boolean(project)).map((project) => {
        const runtime = flagshipRuntime(project.slug);
        const casePath = localePath(language, `/casos-de-exito/${project.slug}`);
        return (
          <article key={project.slug} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card" aria-labelledby={`try-${project.slug}`}>
            {project.media[0] && <div className="relative aspect-video border-b border-foreground/10">
              <Image src={project.media[0].src} alt={project.media[0].alt[language]} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover object-top" />
            </div>}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 id={`try-${project.slug}`} className="text-2xl font-medium leading-tight tracking-[-.03em] text-foreground">{project.title[language]}</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75">{project.summary[language]}</p>
              <div className="mt-6"><TryItButtons links={project.tryIt} language={language} idPrefix={`try-${project.slug}`} /></div>
              <div className="mt-auto flex flex-col items-start gap-1 pt-6">
                {runtime && <Link href={`${casePath}#film`} className="inline-flex min-h-11 items-center text-sm font-semibold text-foreground hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{isEs ? "Ver el film" : "Watch the film"} · {runtime}</Link>}
                <Link href={casePath} className="inline-flex min-h-11 items-center text-sm text-foreground/75 underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{isEs ? "Ver caso" : "View case"}</Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
