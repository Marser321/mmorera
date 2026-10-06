import manifest from "./caseMetrics.generated.json";

/**
 * Puntajes reales de Lighthouse (perfil mobile de PageSpeed, mediana de 3
 * corridas) de cada caso en vivo, medidos por `scripts/measure-cases.ts`.
 * Generado: no editar a mano. Cada número viaja con su fecha.
 */
export interface CaseMetrics {
  measuredAt: string;
  strategy: "mobile";
  runs: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  /** Largest Contentful Paint en segundos. */
  lcp: number;
  cls: number;
}

const CASE_METRICS = manifest as Record<string, CaseMetrics>;

export function getCaseMetrics(slug: string): CaseMetrics | undefined {
  return CASE_METRICS[slug];
}

/** Umbral de publicación: la banda se muestra solo si todo está en verde (≥ 90). */
export function isShowcaseWorthy(metrics: CaseMetrics): boolean {
  return [metrics.performance, metrics.accessibility, metrics.bestPractices, metrics.seo].every((score) => score >= 90);
}

/** Informe público de PageSpeed para que cualquiera pueda repetir la medición. */
export function pageSpeedReportUrl(liveUrl: string): string {
  return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(liveUrl)}&form_factor=mobile`;
}
