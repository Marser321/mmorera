"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { themedAccent } from "@/data/particleScenes";
import { SKILL_ORBIT, techsForFamily, type SkillStance } from "@/data/skillOrbit";
import type { Family } from "@/data/techStack";
import { RadialOrbitalTimeline, type RadialOrbitalNode } from "@/components/ui/radial-orbital-timeline";
import { BackgroundVideo } from "@/components/shared/BackgroundVideo";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/scroll/Reveal";
import { GhlMark } from "@/components/icons/GhlMark";
import { PipedriveMark } from "@/components/icons/PipedriveMark";
import {
  SiHubspot,
  SiNextdotjs,
  SiOpenai,
  SiN8N,
  SiSupabase,
  SiStripe,
  SiWhatsapp,
  SiPostgresql,
  SiFigma,
} from "react-icons/si";

const STANCE_COPY: Record<SkillStance, { es: string; en: string; variant: "signal" | "accent" | "muted" }> = {
  core: { es: "Práctica diaria", en: "Daily practice", variant: "signal" },
  active: { es: "En producción", en: "In production", variant: "accent" },
  exploring: { es: "En incorporación", en: "Onboarding", variant: "muted" },
};

const FLOATING_TECH_BADGES = [
  { name: "GoHighLevel", Icon: GhlMark, category: "CRM" as Family, accent: "#FFBA08" },
  { name: "HubSpot", Icon: SiHubspot, category: "CRM" as Family, accent: "#FF7A59" },
  { name: "Pipedrive", Icon: PipedriveMark, category: "CRM" as Family, accent: "#06AC38" },
  { name: "Next.js 16", Icon: SiNextdotjs, category: "Web" as Family, accent: "#55D8FF" },
  { name: "OpenAI & Claude", Icon: SiOpenai, category: "AI" as Family, accent: "#B68CFF" },
  { name: "n8n Workflows", Icon: SiN8N, category: "Automation" as Family, accent: "#EA4B71" },
  { name: "Supabase & SQL", Icon: SiSupabase, category: "Backend" as Family, accent: "#3ECF8E" },
  { name: "PostgreSQL", Icon: SiPostgresql, category: "Backend" as Family, accent: "#336791" },
  { name: "Stripe", Icon: SiStripe, category: "Commerce" as Family, accent: "#635BFF" },
  { name: "WhatsApp API", Icon: SiWhatsapp, category: "CRM" as Family, accent: "#25D366" },
  { name: "Figma UI", Icon: SiFigma, category: "Media" as Family, accent: "#F24E1E" },
];

export function OrchestrationWheelSection() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isEs = language === "es";

  const [activeFamily, setActiveFamily] = useState<Family | null>("CRM");

  const activeColor = useMemo(() => {
    if (!activeFamily) return "#71F3A2";
    const found = SKILL_ORBIT.find((s) => s.id === activeFamily);
    return found ? themedAccent(found.color, theme) : "#71F3A2";
  }, [activeFamily, theme]);

  const nodes = useMemo<RadialOrbitalNode[]>(
    () =>
      SKILL_ORBIT.map((skill) => {
        const stance = STANCE_COPY[skill.stance];
        return {
          id: skill.id,
          title: skill.label[language],
          meta: isEs ? `${techsForFamily(skill.id).length} herramientas` : `${techsForFamily(skill.id).length} tools`,
          body: skill.blurb[language],
          color: themedAccent(skill.color, theme),
          Icon: skill.Icon,
          relatedIds: skill.related,
          status: { label: stance[language], variant: stance.variant },
          level: skill.depth,
        };
      }),
    [language, theme, isEs]
  );

  const handleActiveChange = useCallback((id: string | null) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
    setActiveFamily(id ? (id as Family) : null);
  }, []);

  return (
    <section id="orquestacion" className="relative scroll-mt-20 isolate overflow-hidden border-t border-white/10 bg-background px-5 py-24 sm:px-8 lg:px-12 lg:py-32 light:border-[rgb(var(--ink-rgb)/0.1)]">
      {/* Background Video Cinemático Suave (Zero lag de scroll) */}
      <BackgroundVideo
        src="/videos/ai-circuits.mp4"
        poster="/videos/posters/ai-circuits.jpg"
        intensity="subtle"
        scrim="radial"
        tint="cyan"
      />

      {/* Atmósfera Reactiva que cambia dinámicamente con el nodo activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFamily ?? "default"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeColor}22 0%, ${activeColor}08 45%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full transition-colors duration-500 shadow-[0_0_12px_currentColor]"
              style={{ backgroundColor: activeColor, color: activeColor }}
            />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: activeColor }}>
              {isEs ? "Orquestación del Ecosistema" : "Ecosystem Orchestration"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={isEs ? "Un menú de capacidades conectadas en vivo." : "A live orbital map of connected capabilities."}
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Cada nodo no es una habilidad aislada: gira y se conecta con el resto del sistema. Tocá cualquier punto de la órbita para ver qué problema resuelve y cómo transforma el flujo operativo."
              : "Each node is not a siloed skill: it orbits and connects with the rest of the stack. Tap any node to inspect its problem space and how it transforms operations."}
          </Reveal>
        </div>

        {/* Floating Tech Badges / Periferia con logotipos auténticos */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/45 mr-2">
            {isEs ? "Ecosistema Central:" : "Core Ecosystem:"}
          </span>
          {FLOATING_TECH_BADGES.map((b, idx) => {
            const isCategoryActive = activeFamily === b.category;
            const Icon = b.Icon;
            return (
              <motion.button
                key={b.name}
                type="button"
                onClick={() => setActiveFamily(b.category)}
                whileHover={{ scale: 1.06, y: -2 }}
                animate={{
                  y: [0, (idx % 2 === 0 ? -3 : 3), 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4 + (idx % 3),
                  ease: "easeInOut",
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] backdrop-blur-md transition-all ${
                  isCategoryActive
                    ? "border-opacity-60 bg-white/[0.09] text-foreground shadow-lg"
                    : "border-white/10 bg-card/70 text-foreground/75 hover:border-white/25 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90"
                }`}
                style={{
                  borderColor: isCategoryActive ? b.accent : undefined,
                  boxShadow: isCategoryActive ? `0 0 15px ${b.accent}33` : undefined,
                }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: b.accent }} />
                <span>{b.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* La Rueda Radial Orbital Interactiva con Contenedor Reactivo */}
        <div
          className="mt-12 rounded-3xl border p-4 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 light:bg-card/85"
          style={{
            borderColor: `${activeColor}35`,
            background: `radial-gradient(circle at 50% 25%, ${activeColor}12 0%, rgba(13, 17, 20, 0.78) 60%)`,
            boxShadow: `0 0 90px ${activeColor}15, 0 25px 50px -12px rgba(0, 0, 0, 0.7)`,
          }}
        >
          <RadialOrbitalTimeline
            nodes={nodes}
            labels={{
              level: isEs ? "Nivel de Dominio en Producción" : "Production Mastery Level",
              related: isEs ? "Familias Conectadas en el Flujo" : "Connected Workflow Families",
              hint: isEs ? "Tocá un nodo para explorar la conexión · Esc para cerrar" : "Tap a node to explore connections · Esc to close",
            }}
            onActiveChange={handleActiveChange}
            renderExtra={(node) => {
              const familyTechs = techsForFamily(node.id as Family);
              return (
                <div className="mt-4 pt-3.5 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 mb-2.5">
                    {isEs ? "Herramientas en Producción:" : "Tools in Production:"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {familyTechs.map((tech) => (
                      <span
                        key={tech.name}
                        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-foreground/85 transition-colors hover:border-white/20 hover:bg-white/10"
                      >
                        {tech.Icon ? (
                          <tech.Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                        ) : (
                          <span className="font-mono text-[9px] font-semibold opacity-60">{tech.fallback}</span>
                        )}
                        <span>{tech.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
}
