"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "@/components/scroll/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import {
  SCOPE_TIERS,
  calculateSprintRoi,
  type ProjectScopeId,
  type ProjectScopeTier,
} from "@/data/sprintCalculatorData";
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  CheckCircle2,
  Users,
  Sliders,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function SprintRoiCalculator() {
  const { language } = useLanguage();
  const isEs = language === "es";

  // State
  const [selectedScopeId, setSelectedScopeId] = useState<ProjectScopeId>("automation");
  const [teamSize, setTeamSize] = useState<number>(4);
  const [avgTicket, setAvgTicket] = useState<number>(800);
  const [monthlyLeads, setMonthlyLeads] = useState<number>(200);

  const activeScope = useMemo<ProjectScopeTier>(
    () => SCOPE_TIERS.find((s) => s.id === selectedScopeId) ?? SCOPE_TIERS[0],
    [selectedScopeId]
  );

  const roiMetrics = useMemo(
    () =>
      calculateSprintRoi({
        scopeId: selectedScopeId,
        teamSize,
        avgTicket,
        monthlyLeads,
      }),
    [selectedScopeId, teamSize, avgTicket, monthlyLeads]
  );

  const whatsappPrefilledUrl = useMemo(() => {
    const text = isEs
      ? `Hola Mario, calculé un sprint de ${activeScope.name.es} para mi equipo de ${teamSize} personas, ticket ~$${avgTicket} y ~${monthlyLeads} leads/mes. Quiero coordinar los detalles del sprint.`
      : `Hi Mario, I estimated a ${activeScope.name.en} sprint for my ${teamSize}-person team, ~$${avgTicket} avg ticket and ~${monthlyLeads} leads/mo. Let's discuss sprint availability.`;
    return `https://wa.me/59892323675?text=${encodeURIComponent(text)}`;
  }, [activeScope, teamSize, avgTicket, monthlyLeads, isEs]);

  return (
    <section
      id="calculadora-sprint"
      className="relative scroll-mt-24 border-t border-white/10 bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12 light:border-[rgb(var(--ink-rgb)/0.1)] overflow-hidden"
    >
      {/* Resplandor ambiental reactivo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 20%, ${activeScope.accentColor}15 0%, transparent 65%)`,
        }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1480px]">
        {/* Encabezado */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-colors duration-500"
              style={{ backgroundColor: activeScope.accentColor, color: activeScope.accentColor }}
            />
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: activeScope.accentColor }}
            >
              {isEs ? "Calculadora Táctil · Sprints & Retorno B2B" : "Tactile Calculator · Sprints & B2B ROI"}
            </p>
          </div>
          <SplitReveal
            as="h2"
            text={
              isEs
                ? "Elegí el alcance. Proyectá el ahorro y la velocidad de entrega."
                : "Choose the scope. Project time saved and delivery speed."
            }
            className="mt-4 text-[clamp(2.25rem,4.5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground"
          />
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg">
            {isEs
              ? "Cada solución se entrega en un sprint cerrado de 1 a 3 semanas. Regulá los números de tu empresa para ver la recuperación de horas de tu equipo y el retorno estimado en facturación."
              : "Every project is delivered in a fixed 1 to 3 week sprint. Adjust your company figures to inspect saved operational hours and projected revenue recovery."}
          </Reveal>
        </div>

        {/* ─── 1. SELECTOR DE ALCANCE (CARDS CON PRECIOS Y PLAZOS) ─── */}
        <div className="mt-10">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-3">
            {isEs ? "Paso 1: Seleccioná el alcance del proyecto" : "Step 1: Select project scope"}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SCOPE_TIERS.map((tier) => {
              const isSelected = selectedScopeId === tier.id;
              return (
                <motion.button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                      try { navigator.vibrate(10); } catch {}
                    }
                    setSelectedScopeId(tier.id);
                  }}
                  aria-pressed={isSelected}
                  aria-label={tier.name[language]}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-left rounded-3xl border p-5 sm:p-6 transition-all backdrop-blur-md flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    isSelected
                      ? "border-opacity-70 bg-card/90 shadow-2xl"
                      : "border-white/10 bg-card/40 text-foreground/75 hover:border-white/20 hover:text-foreground light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/70"
                  }`}
                  style={{
                    borderColor: isSelected ? tier.accentColor : undefined,
                    boxShadow: isSelected ? `0 0 25px ${tier.accentColor}25` : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-block rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${tier.accentColor}20`,
                          color: tier.accentColor,
                        }}
                      >
                        {tier.badge[language]}
                      </span>
                      {isSelected && (
                        <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: tier.accentColor }} />
                      )}
                    </div>
                    <h4 className="mt-4 text-base sm:text-lg font-semibold text-foreground tracking-tight">
                      {tier.name[language]}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/60">
                      {tier.description[language]}
                    </p>
                  </div>

                  {/* Entregables */}
                  <div className="mt-6 pt-4 border-t border-white/8 light:border-[rgb(var(--ink-rgb)/0.08)]">
                    <ul className="space-y-1.5 text-xs text-foreground/75">
                      {tier.deliverablesSummary.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-signal" />
                          <span>{item[language]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ─── 2. CONTROLES DEL SIMULADOR (SLIDERS INTERACTIVOS) ─── */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-card/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-card/90">
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-6">
            {isEs ? "Paso 2: Configurá las métricas de tu empresa" : "Step 2: Adjust your business parameters"}
          </span>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Slider 1: Tamaño del equipo */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-foreground/70">
                  <Users className="h-3.5 w-3.5 text-signal" />
                  {isEs ? "Equipo Comercial / Operativo" : "Sales / Ops Team Size"}
                </span>
                <span className="text-base font-bold text-foreground font-mono">
                  {teamSize} {teamSize === 1 ? (isEs ? "persona" : "person") : (isEs ? "personas" : "people")}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={teamSize}
                aria-label={isEs ? "Equipo Comercial / Operativo" : "Sales / Ops Team Size"}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/15 accent-signal mt-3"
                style={{ accentColor: activeScope.accentColor }}
              />
              <div className="flex justify-between font-mono text-[10px] text-foreground/40 mt-1.5">
                <span>1 persona</span>
                <span>10 personas</span>
                <span>20+</span>
              </div>
            </div>

            {/* Slider 2: Ticket promedio */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-foreground/70">
                  <DollarSign className="h-3.5 w-3.5 text-signal" />
                  {isEs ? "Ticket Promedio de Venta" : "Average Deal Ticket"}
                </span>
                <span className="text-base font-bold text-signal font-mono">
                  ${avgTicket.toLocaleString()} USD
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={4000}
                step={50}
                value={avgTicket}
                aria-label={isEs ? "Ticket Promedio de Venta" : "Average Deal Ticket"}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/15 accent-signal mt-3"
                style={{ accentColor: activeScope.accentColor }}
              />
              <div className="flex justify-between font-mono text-[10px] text-foreground/40 mt-1.5">
                <span>$100 USD</span>
                <span>$2,000 USD</span>
                <span>$4,000+</span>
              </div>
            </div>

            {/* Slider 3: Leads mensuales */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-foreground/70">
                  <Sliders className="h-3.5 w-3.5 text-accent" />
                  {isEs ? "Consultas / Leads por Mes" : "Inquiries / Leads per Mo"}
                </span>
                <span className="text-base font-bold text-foreground font-mono">
                  {monthlyLeads.toLocaleString()} leads
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={1000}
                step={10}
                value={monthlyLeads}
                aria-label={isEs ? "Consultas / Leads por Mes" : "Inquiries / Leads per Mo"}
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/15 accent-signal mt-3"
                style={{ accentColor: activeScope.accentColor }}
              />
              <div className="flex justify-between font-mono text-[10px] text-foreground/40 mt-1.5">
                <span>30 leads</span>
                <span>500 leads</span>
                <span>1,000+</span>
              </div>
            </div>
          </div>

          {/* ─── 3. RESULTADOS DEL CÁLCULO (TELEMETRÍA EN VIVO) ─── */}
          <div className="mt-8 pt-8 border-t border-white/10 light:border-[rgb(var(--ink-rgb)/0.1)]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 block mb-4">
              {isEs ? "Impacto Estimado en Producción:" : "Estimated Production Impact:"}
            </span>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Plazo del sprint */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Plazo de Entrega" : "Delivery Timeline"}
                </span>
                <span className="mt-2 block text-2xl font-bold text-foreground">
                  {roiMetrics.sprintWeeks} {roiMetrics.sprintWeeks === 1 ? (isEs ? "semana" : "week") : (isEs ? "semanas" : "weeks")}
                </span>
                <span className="text-[10px] text-signal mt-1 block">
                  {isEs ? "Sprint cerrado sin retrasos" : "Locked delivery sprint"}
                </span>
              </div>

              {/* Card 2: Horas ahorradas */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Horas Recuperadas / Mes" : "Hours Saved / Month"}
                </span>
                <span className="mt-2 block text-2xl font-bold text-accent">
                  +{roiMetrics.hoursSavedPerMonth}h
                </span>
                <span className="text-[10px] text-foreground/40 mt-1 block">
                  {isEs ? "En tareas repetitivas" : "From manual chores"}
                </span>
              </div>

              {/* Card 3: Cierres recuperados */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Cierres Recuperados / Mes" : "Recovered Deals / Month"}
                </span>
                <span className="mt-2 block text-2xl font-bold text-signal">
                  +{roiMetrics.recoveredDealsPerMonth} {isEs ? "ventas" : "deals"}
                </span>
                <span className="text-[10px] text-foreground/40 mt-1 block">
                  {isEs ? "Por respuesta inmediata < 30s" : "Via < 30s response time"}
                </span>
              </div>

              {/* Card 4: Facturación incremental */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-xs font-mono">
                <span className="text-foreground/50 block text-[10px] uppercase">
                  {isEs ? "Facturación Proyectada / Mes" : "Projected Gain / Month"}
                </span>
                <span className="mt-2 block text-2xl font-bold text-signal">
                  +${roiMetrics.recoveredRevenuePerMonth.toLocaleString()} USD
                </span>
                <span className="text-[10px] text-signal mt-1 block">
                  {isEs ? `Payback en ~${roiMetrics.paybackDaysEstimated} días` : `Payback in ~${roiMetrics.paybackDaysEstimated} days`}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Directo */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <h4 className="text-sm sm:text-base font-semibold text-foreground">
                {isEs
                  ? `¿Querés ejecutar este sprint de ${activeScope.name.es}?`
                  : `Ready to schedule this ${activeScope.name.en} sprint?`}
              </h4>
              <p className="mt-0.5 text-xs text-foreground/60">
                {isEs
                  ? "Atiendo un número estricto de 4 a 5 proyectos por trimestre para garantizar ejecución directa sin delegar en juniors."
                  : "I take on a strict limit of 4 to 5 projects per quarter to guarantee direct founder execution with zero juniors."}
              </p>
            </div>

            <motion.a
              href={whatsappPrefilledUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs sm:text-sm font-bold text-neutral-950 shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all hover:bg-[#22c35e]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isEs ? "Coordinar este sprint por WhatsApp" : "Schedule this sprint on WhatsApp"}</span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
