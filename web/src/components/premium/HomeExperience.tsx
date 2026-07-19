"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { useTheme } from "@/context/ThemeContext";
import { themedAccent } from "@/data/particleScenes";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { TECH_STACK, type Family } from "@/data/techStack";
import type { TrackId } from "@/types/site";
import { isTrackMode, resolveTrackMode, TRACK_MODE_QUERY } from "@/data/trackModes";
import { AuthorManifestoScene, type AuthorManifestoCopy } from "@/components/premium/AuthorManifestoScene";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { MOTION_ASSETS } from "@/data/motionAssets";
import { MethodTimeline } from "@/components/premium/home/MethodTimeline";
import { DecodeText } from "@/components/motion/DecodeText";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Cascade, CascadeItem } from "@/components/motion/Cascade";
import { DrawRule } from "@/components/motion/DrawRule";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/scroll/Reveal";
import { Parallax } from "@/components/scroll/Parallax";
import { ScrollProgressBar } from "@/components/scroll/ScrollProgressBar";

const familyByTrack: Record<TrackId, Family[]> = {
  create: ["Media", "Marketing"],
  build: ["Web", "Backend", "AI"],
  scale: ["CRM", "Automation", "AI"],
};

const copy = {
  es: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "Convierto ideas con carácter en experiencias, productos y sistemas que crecen sin perder lo que las hace distintas.",
    intro: "Una sola dirección entre criterio visual, tecnología y operación, para llevar una visión donde una disciplina por sí sola no alcanza.",
    work: "Ver archivo",
    contact: "Contame tu proyecto",
    tracksTitle: "Una práctica, tres modos de intervenir.",
    tracksIntro: "El punto de entrada cambia. La intención es la misma: entender el problema, construir algo útil y dejarlo funcionando.",
    method: "Método",
    methodTitle: "Del problema a un sistema que alguien puede usar.",
    archive: "Archivo en evolución",
    archiveTitle: "Los mejores casos todavía están entrando.",
    archiveBody: "El catálogo conserva proyectos y decisiones verificables mientras se incorporan trabajos nuevos. La estructura ya está preparada para que cada caso explique problema, rol, proceso y resultado sin inflar la evidencia.",
    archiveCta: "Explorar el archivo actual",
    final: "¿Tu idea tiene algo que proteger y algo nuevo que demostrar?",
    finalBody: "Si necesita una dirección capaz de unir forma, producto y operación sin volverla genérica, contame el contexto.",
    practice: "Una práctica",
    territory: "Territorio activo",
  },
  en: {
    eyebrow: "Mario Morera · Creative Technologist & Systems Builder",
    title: "I turn ideas with character into experiences, products and systems that grow without losing what makes them distinct.",
    intro: "One direction across visual judgment, technology and operations, taking a vision where no single discipline can reach on its own.",
    work: "View archive",
    contact: "Tell me about your project",
    tracksTitle: "One practice, three ways to intervene.",
    tracksIntro: "The entry point changes. The intention stays the same: understand the problem, build something useful and leave it working.",
    method: "Method",
    methodTitle: "From the problem to a system someone can actually use.",
    archive: "Evolving archive",
    archiveTitle: "The strongest cases are still arriving.",
    archiveBody: "The catalogue keeps verifiable projects and decisions visible while new work is added. Its structure is ready for every case to explain the problem, role, process and outcome without inflating the evidence.",
    archiveCta: "Explore the current archive",
    final: "Does your idea have something worth protecting and something new to prove?",
    finalBody: "If it needs one direction capable of uniting form, product and operations without making it generic, share the context.",
    practice: "One practice",
    territory: "Active territory",
  },
};

const authorManifestoCopy = {
  es: {
    eyebrow: "Una práctica propia",
    convergence: "Una práctica propia",
    headline: "No elegí entre crear, construir y escalar. Aprendí a hacer que convivan.",
    body: "Después de años convirtiendo visiones en realidad, construí una práctica propia: criterio visual, producto digital y sistemas bajo una misma dirección. Elijo ideas con carácter, de esas que necesitan llegar donde una sola disciplina no alcanza, y las convierto en experiencias y sistemas capaces de crecer sin perder lo que las hace distintas.",
    principleLabel: "Principio de selección",
    principle: "Trabajo con ideas que tienen algo que proteger y algo nuevo que demostrar.",
    signature: "Una sola dirección · Del concepto a la operación",
  },
  en: {
    eyebrow: "A practice of my own",
    convergence: "A practice of my own",
    headline: "I didn’t choose between creating, building and scaling. I learned how to make them work together.",
    body: "After years of turning visions into reality, I built a practice of my own: visual judgment, digital product and systems under one direction. I choose ideas with character—the kind that need to go where one discipline alone cannot reach—and turn them into experiences and systems that can grow without losing what makes them distinct.",
    principleLabel: "Selection principle",
    principle: "I work with ideas that have something worth protecting and something new to prove.",
    signature: "One direction · From concept to operations",
  },
} satisfies Record<"es" | "en", AuthorManifestoCopy>;

// Colores de pista en hex neón (dark, valor histórico): ScrollProgressBar les
// concatena sufijos alpha hex (`${accent}88`), así que deben quedar literales.
// El gemelo "print" para uso propio de este componente se resuelve con
// themedAccent() (ver más abajo) en vez de tocar este valor compartido.
const tracks = {
  create: {
    color: "#B68CFF",
    title: { es: "Crear", en: "Create" },
    statement: { es: "Identidad, interfaces y motion que hacen visible una idea.", en: "Identity, interfaces and motion that make an idea visible." },
    tools: ["Creative direction", "UX/UI", "Motion", "WebGL / 3D"],
  },
  build: {
    color: "#55D8FF",
    title: { es: "Construir", en: "Build" },
    statement: { es: "Productos digitales robustos, del prototipo a producción.", en: "Robust digital products, from prototype to production." },
    tools: ["Product design", "Frontend", "Backend", "Multi-model AI"],
  },
  scale: {
    color: "#71F3A2",
    title: { es: "Escalar", en: "Scale" },
    statement: { es: "Sistemas conectados para que ventas y operaciones avancen mejor.", en: "Connected systems that help sales and operations move better." },
    tools: ["CRM", "Automation", "Multi-model AI", "Operations"],
  },
} as const;

const method = [
  { es: ["Entender", "Negocio, usuarios, restricciones y evidencia disponible."], en: ["Understand", "Business, users, constraints and available evidence."] },
  { es: ["Diseñar", "Definir el recorrido, la decisión técnica y el lenguaje visual."], en: ["Design", "Define the journey, technical decision and visual language."] },
  { es: ["Construir", "Producir una versión real, medible y mantenible."], en: ["Build", "Ship something real, measurable and maintainable."] },
  { es: ["Operar", "Observar, mejorar y conectar el sistema con el trabajo diario."], en: ["Operate", "Observe, improve and connect the system to daily work."] },
] as const;

// Direcciones de entrada de las cards de tracks: convergen hacia el centro.
const trackEntrances: Array<"left" | "up" | "right"> = ["left", "up", "right"];

export function HomeExperience({
  initialTrack,
  initialModeSelected = false,
}: {
  initialTrack: TrackId;
  initialModeSelected?: boolean;
}) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { setActiveFamilies, setHeroVisible, activeTechName } = useActiveTech();
  const pathname = usePathname();
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [activeTrack, setActiveTrack] = useState<TrackId>(initialTrack);
  const [modeSelected, setModeSelected] = useState(initialModeSelected);
  const c = copy[language];
  const activeTech = useMemo(
    () => TECH_STACK.find((tech) => tech.name === activeTechName),
    [activeTechName],
  );
  const activeTechLabel = activeTech?.label?.[language] ?? activeTechName ?? "—";
  const activeTerritory = modeSelected
    ? tracks[activeTrack].title[language]
    : activeTech?.descriptor?.[language] ?? "";

  // Scroll-out del hero con profundidad: la columna izquierda sube más rápido
  // que la derecha. Las transforms van en las columnas internas, nunca en el
  // <section>: el IntersectionObserver de las partículas necesita geometría
  // estable. En móvil solo opacidad (el resize de la URL bar produce jank).
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroStatic = reduced || isMobile;
  const heroLeftY = useTransform(heroProgress, [0, 1], heroStatic ? [0, 0] : [0, -80]);
  const heroLeftOpacity = useTransform(heroProgress, [0, 1], reduced ? [1, 1] : [1, 0.25]);
  const heroRightY = useTransform(heroProgress, [0, 1], heroStatic ? [0, 0] : [0, -36]);

  useEffect(() => {
    setActiveFamilies(modeSelected ? familyByTrack[activeTrack] : []);
    return () => setActiveFamilies([]);
  }, [activeTrack, modeSelected, setActiveFamilies]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible]);

  useEffect(() => {
    const syncFromUrl = () => {
      const mode = new URLSearchParams(window.location.search).get("modo");
      if (isTrackMode(mode)) {
        setActiveTrack(resolveTrackMode(mode));
        setModeSelected(true);
      } else {
        setModeSelected(false);
      }
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const selectTrack = (track: TrackId) => {
    setActiveTrack(track);
    setModeSelected(true);
    router.replace(`${pathname}?modo=${TRACK_MODE_QUERY[track]}`, { scroll: false });
  };

  return (
    <main id="contenido-principal">
      <ScrollProgressBar accent={modeSelected ? tracks[activeTrack].color : undefined} />

      <section ref={heroRef} data-home-section="hero" className="relative min-h-[100svh] px-5 pb-10 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:flex lg:items-end lg:px-12">
        <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-8 lg:grid-cols-[minmax(0,1.34fr)_minmax(360px,.66fr)] lg:items-end lg:gap-10">
          <motion.div style={{ y: heroLeftY, opacity: heroLeftOpacity }} className="pb-4 lg:pb-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="mb-6 max-w-xl font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/48 sm:text-[10px]"
            >
              <DecodeText text={c.eyebrow} decodeOnMount duration={900} />
            </motion.p>
            <SplitReveal
              as="h1"
              mode="load"
              delay={0.15}
              text={c.title}
              className="max-w-[900px] text-[clamp(2.75rem,6.25vw,7rem)] font-medium leading-[0.91] tracking-[-0.065em] text-foreground"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.5 }}
              className="mt-6 max-w-2xl text-base leading-7 text-foreground/58 sm:text-xl"
            >
              {c.intro}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.65 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Magnetic>
                <Link href={localePath(language, "/casos-de-exito")} className="pressable inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.work}<ArrowDownRight className="h-4 w-4" /></Link>
              </Magnetic>
              <Magnetic>
                <Link href={localePath(language, "/aplicar")} className="pressable inline-flex items-center gap-3 rounded-full border border-white/16 bg-background/54 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground light:border-[rgb(var(--ink-rgb)/0.16)] light:hover:border-[rgb(var(--ink-rgb)/0.32)]">{c.contact}<ArrowUpRight className="h-4 w-4" /></Link>
              </Magnetic>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.5 }}
            style={{ y: heroRightY }}
            className="relative flex min-h-[38vh] flex-col justify-between pb-2 pt-4 lg:min-h-[68vh] lg:pb-8 lg:pt-10"
          >
            <div
              className="ml-auto w-full max-w-[340px] border-t border-white/12 pt-4 light:border-[rgb(var(--ink-rgb)/0.12)]"
              data-testid="technology-stage-label"
              data-active-tech={activeTechName ?? undefined}
              data-active-territory={activeTerritory || undefined}
            >
              <div className="flex items-center justify-between gap-6 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/34">
                <span>{c.practice}</span>
                <span>{c.territory}</span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-6">
                <DecodeText as="p" text={activeTechLabel} className="text-2xl font-medium tracking-[-0.035em] text-foreground" />
                <DecodeText as="p" text={activeTerritory} className="max-w-32 text-right font-mono text-[9px] uppercase leading-4 tracking-[0.16em] text-foreground/38" />
              </div>
            </div>

            <div className="ml-auto w-full max-w-[340px] rounded-[1.25rem] border border-white/10 bg-card/74 p-2 backdrop-blur-xl light:border-[rgb(var(--ink-rgb)/0.1)] light:shadow-[0_1px_2px_rgb(20_23_26/0.06),0_12px_32px_rgb(20_23_26/0.1)]" aria-label={language === "es" ? "Selector de enfoque" : "Focus selector"}>
              {(Object.keys(tracks) as TrackId[]).map((track, index) => {
                const item = tracks[track];
                const dotColor = themedAccent(item.color, theme);
                const selected = modeSelected && activeTrack === track;
                return (
                  <button key={track} type="button" onClick={() => selectTrack(track)} aria-pressed={selected} aria-label={`${item.title[language]} 0${index + 1}`} className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white light:focus-visible:ring-foreground ${selected ? "bg-white/[0.075] text-foreground light:bg-[rgb(var(--ink-rgb)/0.06)]" : "text-foreground/42 hover:text-foreground"}`}>
                    <span className="flex items-center gap-3"><span className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ background: dotColor, boxShadow: selected && theme !== "light" ? `0 0 18px ${dotColor}` : undefined }} />{item.title[language]}</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest">0{index + 1}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section data-home-section="tracks" className="border-y border-white/10 bg-card px-5 py-24 sm:px-8 lg:px-12 lg:py-32 light:border-[rgb(var(--ink-rgb)/0.1)]">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-8 md:grid-cols-[1fr_.75fr] md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/35">Crear / Construir / Escalar</p>
              <SplitReveal
                as="h2"
                text={c.tracksTitle}
                className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,5.8rem)] font-medium leading-[.98] tracking-[-0.055em] text-foreground"
              />
            </div>
            <Reveal as="p" x={28} y={0} className="max-w-xl text-base leading-7 text-foreground/48 md:justify-self-end">{c.tracksIntro}</Reveal>
          </div>
          <DrawRule className="mt-14 block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
          <Cascade className="grid lg:grid-cols-3">
            {(Object.keys(tracks) as TrackId[]).map((track, index) => {
              const item = tracks[track];
              const accentColor = themedAccent(item.color, theme);
              return (
                <CascadeItem key={track} from={trackEntrances[index]} className="border-b border-white/10 lg:border-b-0 lg:border-r light:border-[rgb(var(--ink-rgb)/0.1)]">
                  <button
                    type="button"
                    onClick={() => selectTrack(track)}
                    style={{ "--track-accent": accentColor } as CSSProperties}
                    className={`group pressable relative min-h-[330px] w-full p-6 text-left transition-colors hover:bg-white/[.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white light:hover:bg-[rgb(var(--ink-rgb)/0.03)] light:focus-visible:ring-foreground ${modeSelected && activeTrack === track ? "bg-white/[.035] light:bg-[rgb(var(--ink-rgb)/0.045)]" : ""}`}
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" style={{ background: accentColor }} />
                    <span className="font-mono text-[10px] tracking-widest text-foreground/30 transition-colors duration-300 group-hover:text-[var(--track-accent)]">0{index + 1}</span>
                    <div className="mt-20 flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full" style={{ background: accentColor }} /><h3 className="text-4xl font-medium tracking-[-0.045em] text-foreground">{item.title[language]}</h3></div>
                    <p className="mt-5 max-w-sm text-base leading-6 text-foreground/52">{item.statement[language]}</p>
                    <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.13em] text-foreground/30">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                  </button>
                </CascadeItem>
              );
            })}
          </Cascade>
        </div>
      </section>

      <AuthorManifestoScene
        language={language}
        copy={authorManifestoCopy[language]}
      />

      <MethodTimeline
        eyebrow={c.method}
        title={c.methodTitle}
        steps={method.map((step) => ({ title: step[language][0], body: step[language][1] }))}
      />

      <section data-home-section="archive" className="bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1480px]">
          {/* El marco se ensambla: regla superior izq→der, inferior der→izq */}
          <DrawRule origin="left" className="block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
          <div className="grid gap-10 py-10 md:grid-cols-[.55fr_1.45fr] md:py-14">
            <Reveal as="p" x={-24} y={0} className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">{c.archive}</Reveal>
            <Reveal x={24} y={0}>
              <Parallax speed={30}>
                <h2 className="max-w-4xl text-[clamp(2.5rem,5vw,5.4rem)] font-medium leading-[.98] tracking-[-0.055em] text-foreground">{c.archiveTitle}</h2>
              </Parallax>
              <p className="mt-7 max-w-2xl text-base leading-7 text-foreground/50">{c.archiveBody}</p>
              <Link href={localePath(language, "/casos-de-exito")} className="link-draw group mt-8 inline-flex items-center gap-2 pb-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.archiveCta}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
            </Reveal>
          </div>
          <DrawRule origin="right" className="block h-px w-full bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)]" />
        </div>
      </section>

      <section data-home-section="cta" className="relative isolate overflow-hidden bg-background px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <MotionBackdrop asset={MOTION_ASSETS.opening} intensity={0.32} scrim="center" />
        <Parallax speed={40} className="relative z-10 mx-auto max-w-[1180px] text-center">
          <SplitReveal
            as="h2"
            text={c.final}
            className="text-[clamp(2.8rem,6vw,6.8rem)] font-medium leading-[.94] tracking-[-0.06em] text-foreground"
          />
          <Reveal as="p" className="mx-auto mt-7 max-w-xl text-lg leading-7 text-foreground/52">{c.finalBody}</Reveal>
          <Reveal delay={0.15} className="mt-10 inline-block">
            <Magnetic>
              <Link href={localePath(language, "/aplicar")} className="pressable inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{c.contact}<ArrowUpRight className="h-4 w-4" /></Link>
            </Magnetic>
          </Reveal>
        </Parallax>
      </section>
    </main>
  );
}
