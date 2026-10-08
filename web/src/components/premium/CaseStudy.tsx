"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localePath, SITE_IDENTITY } from "@/config/site";
import type { ProjectCase } from "@/types/site";
import { PROJECT_CASES } from "@/data/projectCases";
import { getCaseMedia } from "@/data/caseMedia";
import { getCaseMetrics, isShowcaseWorthy, pageSpeedReportUrl, type CaseMetrics } from "@/data/caseMetrics";
import { CaseFilmSection } from "@/components/films/CaseFilmSection";
import { buildCaseFilm } from "@/data/films/caseFilms";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE_OUT } from "@/lib/motion";

const label = "font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/55 light:text-muted-foreground";

function hostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/** Mismo umbral que Lighthouse: verde ≥ 90, ámbar ≥ 50, rojo debajo. */
function scoreColor(score: number) {
  if (score >= 90) return "#71F3A2";
  if (score >= 50) return "#FBBF24";
  return "#F87171";
}

function ScoreGauge({ score, name }: { score: number; name: string }) {
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" className="text-foreground/10" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: score / 100 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.3, ease: EASE_OUT }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-3xl font-medium tracking-[-0.04em]" style={{ color }}>
          {score}
        </span>
      </div>
      <span className="text-center text-xs text-foreground/60">{name}</span>
    </div>
  );
}

function MetricsBand({ metrics, liveUrl, isEs }: { metrics: CaseMetrics; liveUrl: string; isEs: boolean }) {
  const scores = [
    { name: isEs ? "Rendimiento" : "Performance", value: metrics.performance },
    { name: isEs ? "Accesibilidad" : "Accessibility", value: metrics.accessibility },
    { name: isEs ? "Buenas prácticas" : "Best practices", value: metrics.bestPractices },
    { name: "SEO", value: metrics.seo },
  ];
  return (
    <section className="mx-auto mt-16 max-w-[1480px] px-5 sm:px-8 lg:px-12" aria-labelledby="case-metrics">
      <div className="grid gap-10 rounded-[1.5rem] border border-white/10 bg-card/60 p-6 backdrop-blur-md light:border-[rgb(var(--ink-rgb)/0.1)] sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <p className={label}>{isEs ? "Medición real · Lighthouse mobile" : "Real measurement · Lighthouse mobile"}</p>
          <h2 id="case-metrics" className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
            {isEs ? "Así rinde hoy, en un celular." : "How it performs today, on a phone."}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/55">
            {isEs
              ? `Perfil mobile de PageSpeed, mediana de ${metrics.runs} corridas el ${metrics.measuredAt}. LCP ${metrics.lcp}s · CLS ${metrics.cls}.`
              : `PageSpeed mobile profile, median of ${metrics.runs} runs on ${metrics.measuredAt}. LCP ${metrics.lcp}s · CLS ${metrics.cls}.`}
          </p>
          <a
            href={pageSpeedReportUrl(liveUrl)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-signal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isEs ? "Verificalo vos mismo" : "Verify it yourself"}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {scores.map((score) => (
            <ScoreGauge key={score.name} score={score.value} name={score.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * `underTheHood`: sección "Bajo el capó" (server component con el diagrama de
 * arquitectura del caso), si el caso la tiene. Va después del film.
 */
export function CaseStudy({ project, underTheHood }: { project: ProjectCase; underTheHood?: ReactNode }) {
  const { language } = useLanguage();
  const isEs = language === "es";
  const media = getCaseMedia(project.slug);
  const metrics = getCaseMetrics(project.slug);
  const film = useMemo(() => buildCaseFilm(project, media, metrics), [project, media, metrics]);
  const index = PROJECT_CASES.findIndex((item) => item.slug === project.slug);
  const next = PROJECT_CASES[(index + 1) % PROJECT_CASES.length];
  const nextMedia = getCaseMedia(next.slug);
  const nextCover = nextMedia?.reel.poster ?? next.media[0]?.src;
  const desktopShots = media?.gallery.filter((shot) => shot.device === "desktop") ?? [];
  const mobileShots = media?.gallery.filter((shot) => shot.device === "mobile") ?? [];
  const whatsappText = encodeURIComponent(
    isEs
      ? `Hola Mario, vi el caso ${project.title.es} en tu web y quiero algo así para mi negocio.`
      : `Hi Mario, I saw the ${project.title.en} case on your site and want something like it.`,
  );

  return (
    <main id="contenido-principal" className="bg-transparent pt-32 sm:pt-36">
      <article>
        {/* Encabezado */}
        <header className="px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <Link href={localePath(language, "/casos-de-exito")} className="inline-flex items-center gap-2 rounded-md text-sm text-[#F3F0E8]/48 light:text-muted-foreground hover:text-[#F3F0E8] light:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white light:ring-ring"><ArrowLeft className="h-4 w-4" />{isEs ? "Volver al archivo" : "Back to archive"}</Link>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
              <div>
                <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-accent">{project.kind && <span>{project.kind[language]}</span>}{project.year && <span>{project.year}</span>}{project.stack.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
                <SplitReveal as="h1" mode="load" text={project.title[language]} className="mt-5 text-[clamp(3.2rem,8.5vw,9rem)] font-medium leading-[.87] tracking-[-.075em] text-foreground" />
              </div>
              <div className="lg:pb-3">
                <p className="text-xl leading-8 tracking-[-.015em] text-[#F3F0E8]/62 light:text-muted-foreground">{project.summary[language]}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {isEs ? "Ver en vivo" : "View live"}<ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  <Link href={`${localePath(language, "/aplicar")}?caso=${project.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-foreground/80 transition-colors hover:border-white/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring light:border-[rgb(var(--ink-rgb)/0.15)]">
                    {isEs ? "Quiero algo así" : "I want something like this"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Film "Cómo lo resolví": el tráiler del caso con el sitio real */}
        {!project.cinematicPending && <CaseFilmSection script={film} language={language} />}

        {/* Bajo el capó: la arquitectura real del sistema, interactiva */}
        {underTheHood}

        {metrics && project.liveUrl && isShowcaseWorthy(metrics) && <MetricsBand metrics={metrics} liveUrl={project.liveUrl} isEs={isEs} />}

        {project.cinematicPending && project.media.length > 1 && (
          <section className="mx-auto mt-20 max-w-[1480px] px-5 sm:px-8 lg:px-12" aria-labelledby="case-static-gallery">
            <p className={label}>{isEs ? "Implementación local · capturas estáticas" : "Local implementation · static captures"}</p>
            <h2 id="case-static-gallery" className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">
              {isEs ? "La experiencia en escritorio y móvil." : "The experience on desktop and mobile."}
            </h2>
            <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.6fr_.55fr]">
              {project.media.slice(1).map((shot, index) => (
                <Reveal key={shot.src} y={30} className={`relative overflow-hidden rounded-2xl border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] ${index === 1 ? "mx-auto w-full max-w-[300px]" : "w-full"}`}>
                  <div className={`relative ${index === 1 ? "aspect-[390/844]" : "aspect-[16/10]"}`}>
                    <Image
                      src={shot.src}
                      alt={shot.alt[language]}
                      fill
                      sizes={index === 1 ? "300px" : "(max-width: 1024px) 100vw, 65vw"}
                      className={index === 1 ? "object-contain" : "object-cover object-top"}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-[#F3F0E8]/50 light:text-muted-foreground">
              {isEs
                ? "Estas capturas muestran una implementación local. No se verificó que coincida con la versión activa de canavacations.com ni una conexión real de reservas o pagos."
                : "These captures show a local implementation. It has not been verified against the current canavacations.com site or a live booking or payment connection."}
            </p>
          </section>
        )}

        {/* Ficha del caso: datos y el relato completo en texto */}
        <div className="mx-auto mt-20 grid max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:px-12">
          <aside className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:self-start">
            {project.client && <div><p className={label}>{isEs ? "Cliente" : "Client"}</p><p className="mt-3 text-sm leading-6 text-[#F3F0E8]/65 light:text-muted-foreground">{project.client[language]}</p></div>}
            <div><p className={label}>{isEs ? "Rol" : "Role"}</p><p className="mt-3 text-sm leading-6 text-[#F3F0E8]/65 light:text-muted-foreground">{project.role[language]}</p></div>
            <div><p className={label}>Stack</p><div className="mt-3 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-full border border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] px-3 py-1.5 text-xs text-[#F3F0E8]/55 light:text-muted-foreground">{item}</span>)}</div></div>
            {project.liveUrl && <div><p className={label}>{isEs ? "En producción" : "In production"}</p><a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-signal hover:underline">{hostname(project.liveUrl)}<ArrowUpRight className="h-3.5 w-3.5" /></a></div>}
          </aside>
          <details className="group border-y border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="text-2xl font-medium tracking-[-.035em] text-foreground sm:text-3xl">{isEs ? "Leer el caso en texto" : "Read the case as text"}</span>
              <span className="font-mono text-[10px] uppercase tracking-[.16em] text-signal transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <div className="pb-6">
              <section className="border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-track-create">01 · {isEs ? "El desafío" : "The challenge"}</p><h3 className="mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-[-.04em] text-foreground sm:text-4xl">{project.challenge[language]}</h3></section>
              <section className="border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-accent">02 · {isEs ? "Restricciones" : "Constraints"}</p><ul className="mt-6 space-y-3">{project.constraints.map((item) => <li key={item[language]} className="flex gap-4 text-lg leading-7 text-[#F3F0E8]/55 light:text-muted-foreground"><span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-accent" />{item[language]}</li>)}</ul></section>
              <section className="border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] py-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-signal">03 · {isEs ? "Decisiones" : "Decisions"}</p><ol className="mt-6 space-y-5">{project.decisions.map((item, i) => <li key={item[language]} className="grid grid-cols-[38px_1fr] gap-3 text-lg leading-7 text-[#F3F0E8]/65 light:text-muted-foreground"><span className="font-mono text-[10px] text-[#F3F0E8]/50 light:text-muted-foreground">0{i + 1}</span>{item[language]}</li>)}</ol></section>
              <section className="border-t border-white/12 light:border-[rgb(var(--ink-rgb)/0.12)] pt-8"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#F3F0E8]/55 light:text-muted-foreground">04 · {isEs ? "Resultado" : "Outcome"}</p><p className="mt-5 max-w-3xl text-3xl font-medium leading-tight tracking-[-.04em] text-foreground sm:text-4xl">{project.result[language]}</p></section>
            </div>
          </details>
        </div>

        {/* Galería desktop + mobile (capturas del sitio en vivo) */}
        {(desktopShots.length > 0 || mobileShots.length > 0) && (
          <section className="mx-auto mt-24 max-w-[1480px] px-5 sm:px-8 lg:px-12" aria-labelledby="case-gallery">
            <p className={label}>{isEs ? "Galería · capturas del sitio en vivo" : "Gallery · live site captures"}</p>
            <h2 id="case-gallery" className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">{isEs ? "En pantalla grande y en el bolsillo." : "On a big screen and in a pocket."}</h2>
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <div className="grid gap-5 sm:grid-cols-2">
                {desktopShots.map((shot, i) => (
                  <Reveal key={shot.src} y={30} delay={i * 0.06} className={`relative overflow-hidden rounded-2xl border border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] ${i === 0 ? "sm:col-span-2" : ""}`}>
                    <div className="relative aspect-[16/10]"><Image src={shot.src} alt={`${project.title[language]} · desktop ${i + 1}`} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-top" /></div>
                  </Reveal>
                ))}
              </div>
              <div className="flex items-start justify-center gap-5">
                {mobileShots.map((shot, i) => (
                  <Reveal key={shot.src} y={40} delay={0.1 + i * 0.08} className={`w-1/2 max-w-[240px] ${i === 1 ? "mt-16" : ""}`}>
                    <div className="overflow-hidden rounded-[2rem] border-[6px] border-foreground/10 bg-card">
                      <div className="relative aspect-[390/844]"><Image src={shot.src} alt={`${project.title[language]} · mobile ${i + 1}`} fill sizes="240px" className="object-cover object-top" /></div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Cierre: CTA */}
      <section className="mx-auto mt-28 max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 border-y border-white/10 py-14 light:border-[rgb(var(--ink-rgb)/0.1)] md:grid-cols-[1.3fr_auto] md:items-center">
          <h2 className="text-[clamp(2.2rem,4.5vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.055em] text-foreground">
            {isEs ? "¿Querés algo así para tu negocio?" : "Want something like this for your business?"}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link href={`${localePath(language, "/aplicar")}?caso=${project.slug}`} className="pressable inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {isEs ? "Contame tu proyecto" : "Tell me about your project"}<ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={`${SITE_IDENTITY.contact.whatsapp}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="pressable inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 px-6 py-3.5 text-sm font-semibold text-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]">
                <MessageCircle className="h-4 w-4" />WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Siguiente proyecto */}
      <Link
        href={localePath(language, `/casos-de-exito/${next.slug}`)}
        data-cursor-label={isEs ? "Siguiente" : "Next"}
        className="group relative mt-24 block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {nextCover && (
          <Image src={nextCover} alt="" fill sizes="100vw" className="object-cover object-top opacity-30 transition-[transform,opacity] duration-[1.2s] ease-out group-hover:scale-105 group-hover:opacity-45" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[60vh] max-w-[1480px] flex-col justify-end px-5 pb-16 pt-24 sm:px-8 lg:px-12">
          <p className={label}>{isEs ? "Siguiente proyecto" : "Next project"}</p>
          <p className="mt-4 flex items-end justify-between gap-6 text-[clamp(3rem,9vw,10rem)] font-medium leading-[.85] tracking-[-.075em] text-foreground">
            <span>{next.title[language]}</span>
            <ArrowUpRight className="mb-[0.08em] h-[0.5em] w-[0.5em] shrink-0 transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" aria-hidden="true" />
          </p>
          <p className="mt-6 max-w-xl text-base text-foreground/55">{next.summary[language]}</p>
        </div>
      </Link>
    </main>
  );
}
