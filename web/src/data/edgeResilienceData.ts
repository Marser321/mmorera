export interface TrafficPreset {
  id: string;
  name: { es: string; en: string };
  requestsPerSec: number;
  badge: { es: string; en: string };
  description: { es: string; en: string };
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
  errorRatePercent: number;
  status: "healthy" | "degraded" | "critical";
  statusLabel: { es: string; en: string };
  ttfbMs: number;
}

export interface EdgeMetrics extends SystemMetrics {
  cacheHitRatePercent: number;
  activeEdgeNodes: number;
}

export interface ResilienceTelemetry {
  requestsPerSec: number;
  edgeShieldActive: boolean;
  legacy: SystemMetrics;
  edge: EdgeMetrics;
  estimatedLostRevenuePerHour: number;
  savedAdSpendProtection: number;
  summaryText: { es: string; en: string };
}

export const TRAFFIC_PRESETS: TrafficPreset[] = [
  {
    id: "baseline",
    name: { es: "Tráfico Orgánico Base", en: "Organic Baseline Traffic" },
    requestsPerSec: 350,
    badge: { es: "Operación Normal", en: "Normal Operations" },
    description: {
      es: "Navegación promedio diaria sin campañas masivas activas.",
      en: "Standard daily browsing without heavy active ad campaigns.",
    },
  },
  {
    id: "campaign",
    name: { es: "Campaña Pauta Meta / Google", en: "Meta / Google Ad Campaign" },
    requestsPerSec: 2400,
    badge: { es: "Pauta Activa", en: "Active Ads" },
    description: {
      es: "Inyección de tráfico de anuncios pagos con múltiples clics simultáneos.",
      en: "Paid advertising traffic injection with hundreds of simultaneous clicks.",
    },
  },
  {
    id: "viral",
    name: { es: "Lanzamiento / Prensa / Viral", en: "Press / Viral Launch Spike" },
    requestsPerSec: 12000,
    badge: { es: "Pico de Tráfico 10x", en: "10x Traffic Surge" },
    description: {
      es: "Mención en medios, influencer o newsletter de alto alcance.",
      en: "Media feature, influencer shoutout, or high-reach newsletter release.",
    },
  },
  {
    id: "blackfriday",
    name: { es: "Black Friday / Evento Masivo", en: "Black Friday Extreme Burst" },
    requestsPerSec: 45000,
    badge: { es: "Estrés Extremo", en: "Extreme Stress" },
    description: {
      es: "Avalancha masiva de transacciones concurrentes en minutos.",
      en: "Massive rush of concurrent checkout requests within minutes.",
    },
  },
];

export function calculateResilienceTelemetry(
  requestsPerSec: number,
  edgeShieldActive: boolean = true,
  language: "es" | "en" = "es"
): ResilienceTelemetry {
  const isEs = language === "es";
  const clampedRps = Math.max(100, Math.min(60000, requestsPerSec));

  // Legacy calculations
  let legacyCpu: number;
  let legacyMem: number;
  let legacyLatency: number;
  let legacyErrorRate: number;
  let legacyStatus: "healthy" | "degraded" | "critical";

  if (clampedRps <= 1000) {
    legacyCpu = Math.round(18 + (clampedRps / 1000) * 35);
    legacyMem = Math.round(25 + (clampedRps / 1000) * 30);
    legacyLatency = Math.round(120 + (clampedRps / 1000) * 160);
    legacyErrorRate = 0.0;
    legacyStatus = "healthy";
  } else if (clampedRps <= 3800) {
    const factor = (clampedRps - 1000) / 2800;
    legacyCpu = Math.round(53 + factor * 43); // up to 96%
    legacyMem = Math.round(55 + factor * 38); // up to 93%
    legacyLatency = Math.round(280 + factor * 2100); // up to 2380ms
    legacyErrorRate = parseFloat((factor * 28.5).toFixed(1)); // up to 28.5%
    legacyStatus = "degraded";
  } else {
    const factor = Math.min(1, (clampedRps - 3800) / 20000);
    legacyCpu = 100;
    legacyMem = 100;
    legacyLatency = Math.round(2380 + factor * 6800); // up to 9180ms
    legacyErrorRate = parseFloat((30 + factor * 62).toFixed(1)); // up to 92%
    legacyStatus = "critical";
  }

  const legacyTtfb = Math.round(legacyLatency * 0.75);

  // Edge calculations
  const edgeCpu = Math.round(8 + (clampedRps / 60000) * 11); // max 19%
  const edgeMem = Math.round(12 + (clampedRps / 60000) * 8); // max 20%
  const edgeLatency = Math.round(18 + (clampedRps / 60000) * 14); // 18ms - 32ms
  const edgeErrorRate = edgeShieldActive ? 0.0 : parseFloat((clampedRps > 40000 ? 0.8 : 0.0).toFixed(1));
  const edgeTtfb = Math.round(edgeLatency * 0.6);
  const cacheHitRate = parseFloat((97.2 + (clampedRps / 60000) * 2.2).toFixed(1)); // 97.2% - 99.4%
  const activeNodes = Math.min(310, Math.round(120 + (clampedRps / 60000) * 180));

  // Financial impact: calculated by conversions lost per hour
  // At $45 AOV and 1.8% conversion rate:
  const baselineConversionsPerHour = (clampedRps * 3600) * 0.015;
  const lostConversionsPerHour = baselineConversionsPerHour * (legacyErrorRate / 100);
  const estimatedLostRevenuePerHour = Math.round(lostConversionsPerHour * 35);
  const savedAdSpendProtection = Math.round(estimatedLostRevenuePerHour * 1.4);

  const summaryText = {
    es: legacyStatus === "critical"
      ? `A ${clampedRps.toLocaleString("es-AR")} req/s, el servidor tradicional colapsa con ${legacyErrorRate}% de errores 502 Bad Gateway y ${legacyLatency}ms de latencia. La arquitectura Edge de Mario Morera mantiene 100% uptime y ${edgeLatency}ms planos.`
      : legacyStatus === "degraded"
      ? `A ${clampedRps.toLocaleString("es-AR")} req/s, el hosting tradicional sufre estrangulamiento (${legacyLatency}ms) y pierde ${legacyErrorRate}% del tráfico. La red Edge responde en ${edgeLatency}ms sin inmutarse.`
      : `En tráfico base (${clampedRps} req/s), ambos responden, pero el Edge ofrece ${edgeLatency}ms vs ${legacyLatency}ms con 98% de ahorro en cómputo central.`,
    en: legacyStatus === "critical"
      ? `At ${clampedRps.toLocaleString("en-US")} req/s, the legacy server collapses with ${legacyErrorRate}% 502 Bad Gateway errors and ${legacyLatency}ms latency. Mario Morera's Edge architecture maintains 100% uptime and a flat ${edgeLatency}ms.`
      : legacyStatus === "degraded"
      ? `At ${clampedRps.toLocaleString("en-US")} req/s, legacy hosting chokes (${legacyLatency}ms) leaking ${legacyErrorRate}% of incoming leads. The Edge network responds in ${edgeLatency}ms flawlessly.`
      : `Under baseline traffic (${clampedRps} req/s), both respond, but Edge delivers ${edgeLatency}ms vs ${legacyLatency}ms with 98% compute offloaded.`,
  };

  return {
    requestsPerSec: clampedRps,
    edgeShieldActive,
    legacy: {
      cpuUsage: legacyCpu,
      memoryUsage: legacyMem,
      latencyMs: legacyLatency,
      errorRatePercent: legacyErrorRate,
      status: legacyStatus,
      statusLabel: {
        es:
          legacyStatus === "critical"
            ? "COLAPSO CRÍTICO (502 Gateway)"
            : legacyStatus === "degraded"
            ? "ESTRANGULAMIENTO SEVERO"
            : "OPERATIVO ESTÁNDAR",
        en:
          legacyStatus === "critical"
            ? "CRITICAL COLLAPSE (502 Error)"
            : legacyStatus === "degraded"
            ? "SEVERE THROTTLING"
            : "STANDARD OPERATIONAL",
      },
      ttfbMs: legacyTtfb,
    },
    edge: {
      cpuUsage: edgeCpu,
      memoryUsage: edgeMem,
      latencyMs: edgeLatency,
      errorRatePercent: edgeErrorRate,
      status: "healthy",
      statusLabel: {
        es: "ÓPTIMO · EDGE GLOBAL",
        en: "OPTIMAL · GLOBAL EDGE",
      },
      ttfbMs: edgeTtfb,
      cacheHitRatePercent: cacheHitRate,
      activeEdgeNodes: activeNodes,
    },
    estimatedLostRevenuePerHour,
    savedAdSpendProtection,
    summaryText,
  };
}
