import type { CaseProof } from "@/types/site";

const label = "font-mono text-[10px] uppercase tracking-[.16em] text-foreground/55 light:text-muted-foreground";

/** El número de la ficha solo se publica si está verificado. */
export function visibleMetric(proof: CaseProof) {
  return proof.metric.verified ? proof.metric : null;
}

/**
 * Ficha de prueba: lo primero que se lee en un caso. El problema, lo que
 * hace hoy, un número verificado, qué falló o qué falta, y dónde decide una
 * persona. Sin stack ni arquitectura: eso va al final, plegado.
 */
export function CaseProofCard({ proof, language }: { proof: CaseProof; language: "es" | "en" }) {
  const isEs = language === "es";
  const metric = visibleMetric(proof);
  const rows = [
    { key: "problem", title: isEs ? "El problema" : "The problem", text: proof.problem[language] },
    { key: "now", title: isEs ? "Lo que hace hoy" : "What it does today", text: proof.now[language] },
    proof.fixed && { key: "fixed", title: isEs ? "Qué falló y cómo se resolvió" : "What failed and how it was fixed", text: proof.fixed[language] },
    proof.pending && { key: "pending", title: isEs ? "Qué falta" : "What's still missing", text: proof.pending[language] },
    proof.humanStep && { key: "human", title: isEs ? "Dónde decide una persona" : "Where a person decides", text: proof.humanStep[language] },
  ].filter((row): row is { key: string; title: string; text: string } => Boolean(row));

  return (
    <section aria-labelledby="case-proof" data-case-proof className="mx-auto mt-12 max-w-[1480px] px-5 sm:px-8 lg:px-12">
      <h2 id="case-proof" className="sr-only">{isEs ? "El caso en corto" : "The case at a glance"}</h2>
      <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 light:border-[rgb(var(--ink-rgb)/0.1)] light:bg-[rgb(var(--ink-rgb)/0.1)] lg:grid-cols-[.7fr_1.3fr]">
        {metric && (
          <div data-proof-metric className="flex flex-col justify-end gap-3 bg-background p-6 sm:p-8">
            <p className="text-[clamp(4rem,9vw,7.5rem)] font-medium leading-[.85] tracking-[-.06em] text-signal">{metric.value}</p>
            <p className="max-w-xs text-base leading-6 text-foreground/70 light:text-muted-foreground">{metric.label[language]}</p>
          </div>
        )}
        <dl className={`grid gap-px bg-white/10 light:bg-[rgb(var(--ink-rgb)/0.1)] sm:grid-cols-2 ${metric ? "" : "lg:col-span-2"}`}>
          {rows.map((row, index) => (
            <div key={row.key} data-proof-row={row.key} className={`bg-background p-6 sm:p-8 ${rows.length % 2 === 1 && index === rows.length - 1 ? "sm:col-span-2" : ""}`}>
              <dt className={label}>{row.title}</dt>
              <dd className="mt-3 text-lg leading-7 tracking-[-.01em] text-foreground/85 light:text-foreground">{row.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
