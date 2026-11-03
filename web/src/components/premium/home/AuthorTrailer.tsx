"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import {
  PERSONAL_FILM_SEQUENCE,
  resolveFilmStage,
  resolvePersonalFilmSource,
  type PersonalFilmStage,
} from "@/data/personalFilmSequence";
import { useResolvedMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Escena 4 del home, «Cómo trabajo»: la película de autor vuelve al home como
 * tráiler. Corre sola, muda y en bucle mientras se ve, con CREAR, CONSTRUIR y
 * ESCALAR sincronizados con el metraje; encima, la promesa y los tres pasos.
 * La versión completa, guiada por el scroll, sigue en /sobre-mi. Sin
 * movimiento (o con ahorro de datos) queda el póster quieto.
 */

const copy = {
  es: {
    eyebrow: "04 — Cómo trabajo",
    film: "Película de autor",
    photoAlt: "Mario Morera frente a una interfaz de diseño en su pantalla",
    title: "Hablas conmigo y lo construyo yo.",
    body: "Las cuentas y los accesos quedan a tu nombre. Te entrego el sistema documentado y explicado. Si algo falla, me escribes a mí.",
    filmLink: "Ver la película completa",
    verbs: { create: "Crear", build: "Construir", scale: "Escalar" },
    steps: [
      { title: "Diagnóstico", body: "Entiendo cómo trabajas hoy y acordamos qué conviene construir primero, y qué no." },
      { title: "Construcción", body: "Diseño, programo y conecto las piezas. Ves avances reales durante el trabajo." },
      { title: "Traspaso y mantenimiento", body: "Te dejo el sistema funcionando, a tu nombre. Si quieres, sigo a cargo." },
    ],
  },
  en: {
    eyebrow: "04 — How I work",
    film: "Author film",
    photoAlt: "Mario Morera in front of a design interface on his screen",
    title: "You talk to me, and I build it.",
    body: "Accounts and access stay in your name. You get the system documented and explained. If something breaks, you write to me.",
    filmLink: "Watch the full film",
    verbs: { create: "Create", build: "Build", scale: "Scale" },
    steps: [
      { title: "Diagnosis", body: "I learn how you work today and we agree on what to build first, and what not to." },
      { title: "Build", body: "I design, build and connect the pieces. You see real progress along the way." },
      { title: "Handover and maintenance", body: "I hand over a working system, in your name. If you want, I stay on." },
    ],
  },
};

const VERB_COLORS: Partial<Record<PersonalFilmStage, string>> = {
  create: "#B68CFF",
  build: "#55D8FF",
  scale: "#71F3A2",
};

// Con «ahorro de datos» activado, la película queda en su póster.
const subscribeNothing = () => () => {};
function readSaveData() {
  return Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
}

function formatTime(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `00:${String(whole).padStart(2, "0")}`;
}

export function AuthorTrailer() {
  const { language } = useLanguage();
  const c = copy[language];
  const reduced = useReducedMotionSafe();
  const desktop = useResolvedMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const saveData = useSyncExternalStore(subscribeNothing, readSaveData, () => false);
  const [stage, setStage] = useState<PersonalFilmStage>("introduction");
  const [time, setTime] = useState(0);
  const source = resolvePersonalFilmSource(PERSONAL_FILM_SEQUENCE, desktop === true);
  const sourceKey = source.sources.map(({ src }) => src).join("|");
  const canPlay = desktop !== null && near && !reduced && !saveData;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: "600px 0px" });
    const watch = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    preload.observe(section);
    watch.observe(section);
    return () => {
      preload.disconnect();
      watch.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canPlay) return;
    if (visible && !document.hidden) void video.play().catch(() => {});
    else video.pause();
  }, [canPlay, visible, ready, sourceKey]);

  const onTimeUpdate = (video: HTMLVideoElement) => {
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : PERSONAL_FILM_SEQUENCE.duration;
    const progress = (video.currentTime / duration) * PERSONAL_FILM_SEQUENCE.completion;
    const next = resolveFilmStage(progress);
    setStage((current) => (current === next ? current : next));
    // El contador muestra segundos enteros: no hace falta repintar en cada evento.
    setTime((current) => (Math.floor(current) === Math.floor(video.currentTime) ? current : video.currentTime));
  };

  const verb = stage === "create" || stage === "build" || stage === "scale" ? stage : null;

  return (
    <section
      ref={sectionRef}
      id="perfil"
      data-home-section="perfil"
      aria-labelledby="perfil-titulo"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#0B0B0A] text-[#ECE7DD]"
    >
      <div className="relative flex flex-col lg:min-h-[100svh]">
        {/* La película: póster siempre, video cuando se acerca y se puede */}
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto" data-film-status={canPlay ? (ready ? "playing" : "loading") : "poster"}>
          <picture className="absolute inset-0 block h-full w-full">
            <source srcSet={source.posterAvif} type="image/avif" />
            <img
              src={source.posterWebp}
              alt={c.photoAlt}
              decoding="async"
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover object-[center_top] lg:object-center"
            />
          </picture>
          {canPlay ? (
            <video
              key={sourceKey}
              ref={videoRef}
              muted
              loop
              playsInline
              preload="auto"
              poster={source.posterWebp}
              aria-hidden="true"
              onCanPlay={() => setReady(true)}
              onTimeUpdate={(event) => onTimeUpdate(event.currentTarget)}
              className={`absolute inset-0 h-full w-full object-cover object-[center_top] transition-opacity duration-700 lg:object-center ${ready ? "opacity-100" : "opacity-0"}`}
            >
              {source.sources.map((media) => <source key={media.src} src={media.src} type={media.type} />)}
            </video>
          ) : null}
          {/* Velos: abajo en el teléfono; a la izquierda y abajo en escritorio, para leer encima */}
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,.35)_0%,rgba(11,11,10,0)_30%,rgba(11,11,10,.15)_62%,#0B0B0A_100%)] lg:bg-[linear-gradient(90deg,rgba(11,11,10,.96)_0%,rgba(11,11,10,.78)_32%,rgba(11,11,10,.18)_62%,rgba(11,11,10,.05)_100%)]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-[46%] bg-[linear-gradient(180deg,transparent,rgba(11,11,10,.92))] lg:block" />

          {/* El verbo del tramo, en su color, sincronizado con el metraje */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-6 sm:inset-x-8 lg:inset-x-12 lg:bottom-auto lg:top-[20%]">
            <div className="relative mx-auto h-[clamp(3.6rem,10vw,9.5rem)] max-w-[1480px]">
              {(["create", "build", "scale"] as const).map((key) => (
                <p
                  key={key}
                  className={`absolute left-0 top-0 text-[clamp(3.4rem,10vw,9.5rem)] font-medium uppercase leading-none tracking-[-0.08em] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${verb === key ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
                  style={{ color: VERB_COLORS[key] }}
                >
                  {c.verbs[key]}
                </p>
              ))}
            </div>
          </div>

          {/* Rótulo de la película y su tiempo */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-5 sm:inset-x-8 lg:inset-x-12 lg:top-28">
            <div className="mx-auto flex max-w-[1480px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#ECE7DD]/60">
              <span className="hidden lg:inline">{c.eyebrow}</span>
              <span className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${canPlay && ready ? "animate-pulse bg-[#71F3A2]" : "bg-[#ECE7DD]/40"}`} />
                {c.film}
                {canPlay && ready ? ` · ${formatTime(time)} / ${formatTime(PERSONAL_FILM_SEQUENCE.duration)}` : null}
              </span>
            </div>
          </div>
        </div>

        {/* La promesa y el método */}
        {/* Abajo deja lugar a la barra flotante: la escena ocupa la pantalla entera. */}
        <div className="relative z-10 px-5 pb-16 pt-8 sm:px-8 lg:mt-auto lg:px-12 lg:pb-32 lg:pt-[42svh]">
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71F3A2] lg:hidden">{c.eyebrow}</p>
              <h2 id="perfil-titulo" className="mt-3 text-[clamp(2.2rem,4.4vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#ECE7DD] lg:mt-0">
                {c.title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#ECE7DD]/72 sm:text-lg">{c.body}</p>
              <Link
                href={localePath(language, "/sobre-mi")}
                data-explore-door="sobre-mi"
                className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#71F3A2] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#55D8FF]"
              >
                {c.filmLink}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ol className="grid gap-5 border-t border-white/15 pt-6 sm:grid-cols-3 sm:gap-6 lg:border-t-0 lg:pt-0">
              {c.steps.map((step, index) => (
                <li key={step.title} className="sm:border-l sm:border-white/15 sm:pl-5">
                  <span aria-hidden="true" className="font-mono text-xs text-[#71F3A2]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg font-medium leading-snug text-[#ECE7DD]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#ECE7DD]/68">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
