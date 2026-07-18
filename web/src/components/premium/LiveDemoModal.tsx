"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import type { ProjectCase } from "@/types/site";
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const trackLabels = {
  es: { create: "Crear", build: "Construir", scale: "Escalar" },
  en: { create: "Create", build: "Build", scale: "Scale" },
};

const DEVICES = [
  { id: "desktop", icon: Monitor, frame: "h-full w-full" },
  { id: "tablet", icon: Tablet, frame: "h-auto max-h-full w-full max-w-[768px] aspect-[4/3]" },
  { id: "mobile", icon: Smartphone, frame: "h-auto max-h-full w-full max-w-[360px] aspect-[9/16]" },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

/**
 * Visor de demo en vivo, demo-first: el sitio real embebido con selector de
 * dispositivo. La narrativa completa vive en /casos-de-exito/[slug]. Debe ir
 * dentro de un <Dialog> con su <DialogTrigger>; Radix desmonta el contenido al
 * cerrar, así que el iframe solo carga cuando el visor se abre.
 */
export function LiveDemoModal({ project }: { project: ProjectCase }) {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [device, setDevice] = useState<DeviceId>("desktop");
  const [loaded, setLoaded] = useState(false);
  const demoSrc = project.demoUrl ?? project.liveUrl;
  const embeddable = project.embeddable !== false && Boolean(demoSrc);
  const frame = DEVICES.find((entry) => entry.id === device)?.frame ?? DEVICES[0].frame;

  return (
    <DialogContent
      className={cn(
        "flex flex-col gap-0 overflow-hidden border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-background/95 p-0 shadow-2xl light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)] backdrop-blur-xl",
        "h-[100dvh] w-screen max-w-none rounded-none sm:max-w-none",
        "lg:h-[85vh] lg:w-[1200px] lg:max-w-[95vw] lg:rounded-[1.5rem]",
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] px-5 py-4 pr-14 sm:px-6">
        <div className="min-w-0">
          <DialogTitle className="truncate text-lg font-medium tracking-[-.03em] text-foreground sm:text-xl">
            {project.title[language]}
          </DialogTitle>
          <DialogDescription className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/38 light:text-muted-foreground/85">
            {project.tracks.map((track) => trackLabels[language][track]).join(" · ")}
          </DialogDescription>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-4">
          <Link
            href={localePath(language, `/casos-de-exito/${project.slug}`)}
            className="link-draw font-mono text-[10px] uppercase tracking-[.16em] text-[#F3F0E8]/55 light:text-muted-foreground transition-colors hover:text-[#F3F0E8] light:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isEs ? "Caso completo" : "Full case"} →
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[.16em] text-[#F3F0E8]/55 light:text-muted-foreground transition-colors hover:text-[#F3F0E8] light:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isEs ? "Abrir en pestaña nueva" : "Open in new tab"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <div className="flex items-center gap-1 rounded-full border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-white/[0.03] light:bg-[rgb(var(--ink-rgb)/0.03)] p-1">
            {DEVICES.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                aria-label={id}
                aria-pressed={device === id}
                className={cn(
                  "cursor-pointer rounded-full p-1.5 text-[#F3F0E8]/45 light:text-muted-foreground transition-colors hover:text-[#F3F0E8] light:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  device === id && "bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)] text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-background p-3 sm:p-5">
        <div className={cn("relative overflow-hidden rounded-[1rem] border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] bg-card shadow-2xl light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)] transition-all duration-500", frame)}>
          {embeddable ? (
            <>
              {!loaded && (
                <div aria-hidden className="absolute inset-0 z-10 flex items-center justify-center bg-card">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.04] light:from-[rgb(var(--ink-rgb)/0.04)] via-transparent to-white/[0.02] light:to-[rgb(var(--ink-rgb)/0.02)]" />
                  <span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#F3F0E8]/35 light:text-muted-foreground/85">
                    {isEs ? "Cargando demo…" : "Loading demo…"}
                  </span>
                </div>
              )}
              <iframe
                src={demoSrc}
                onLoad={() => setLoaded(true)}
                className="h-full w-full border-0 bg-background"
                title={isEs ? `Demo en vivo de ${project.title.es}` : `Live demo of ${project.title.en}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </>
          ) : (
            <div className="relative h-full min-h-[320px] w-full">
              <Image
                src={project.media[0].src}
                alt={project.media[0].alt[language]}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#070809]/72 light:bg-[rgb(var(--ink-rgb)/0.45)] px-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#F3F0E8]/55">
                  {isEs ? "Este sitio no permite vista embebida" : "This site blocks embedding"}
                </p>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable inline-flex items-center gap-2 rounded-full bg-[#F3F0E8] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[.14em] text-[#070809] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF]"
                  >
                    {isEs ? "Abrir sitio en vivo" : "Open live site"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
}
