export interface LegacyStackPreset {
  id: "wordpress" | "wix" | "agency_legacy";
  name: {
    es: string;
    en: string;
  };
  subtitle: {
    es: string;
    en: string;
  };
  lighthouseScore: number; // 0 - 100
  fcpSeconds: number;
  lcpSeconds: number;
  clsScore: number;
  trafficLossPct: number; // e.g. 0.54 = 54%
  vulnerabilities: {
    es: string;
    en: string;
  };
  hostingCostMonthly: number;
}

export interface ModernStackBenchmark {
  name: {
    es: string;
    en: string;
  };
  lighthouseScore: number;
  fcpSeconds: number;
  lcpSeconds: number;
  clsScore: number;
  trafficLossPct: number;
  securityRating: {
    es: string;
    en: string;
  };
  edgeRegions: number;
}

export const MODERN_BENCHMARK: ModernStackBenchmark = {
  name: {
    es: "Arquitectura Mario Morera (Next.js 16 + Turbopack + Edge CDN)",
    en: "Mario Morera Architecture (Next.js 16 + Turbopack + Edge CDN)",
  },
  lighthouseScore: 98,
  fcpSeconds: 0.4,
  lcpSeconds: 0.8,
  clsScore: 0.0,
  trafficLossPct: 0.04,
  securityRating: {
    es: "Empresarial · Zero Server Exploits (Estático & Serverless)",
    en: "Enterprise · Zero Server Exploits (Static & Serverless)",
  },
  edgeRegions: 300,
};

export const LEGACY_STACKS: LegacyStackPreset[] = [
  {
    id: "wordpress",
    name: {
      es: "WordPress + Elementor (32 Plugins)",
      en: "WordPress + Elementor (32 Plugins)",
    },
    subtitle: {
      es: "El estándar lento de la mayoría de agencias",
      en: "The slow standard of most web agencies",
    },
    lighthouseScore: 36,
    fcpSeconds: 3.6,
    lcpSeconds: 6.4,
    clsScore: 0.28,
    trafficLossPct: 0.53,
    vulnerabilities: {
      es: "Alta · Brechas en plugins desactualizados y base SQL vulnerable",
      en: "High · Exploits in outdated plugins & exposed SQL",
    },
    hostingCostMonthly: 35,
  },
  {
    id: "wix",
    name: {
      es: "Wix / Squarespace (Constructor Básico)",
      en: "Wix / Squarespace (Basic Builder)",
    },
    subtitle: {
      es: "Código cerrado con sobrecarga de scripts pesados",
      en: "Closed-source with heavy proprietary script bloat",
    },
    lighthouseScore: 48,
    fcpSeconds: 2.8,
    lcpSeconds: 5.1,
    clsScore: 0.16,
    trafficLossPct: 0.42,
    vulnerabilities: {
      es: "Media · Sin acceso al servidor ni posibilidad de optimización profunda",
      en: "Medium · No server access or deep optimization possible",
    },
    hostingCostMonthly: 29,
  },
  {
    id: "agency_legacy",
    name: {
      es: "Plantilla Comprada / ThemeForest PHP",
      en: "Purchased Theme / ThemeForest PHP",
    },
    subtitle: {
      es: "Código inflado de terceros sin arquitectura a medida",
      en: "Bloated 3rd party code without custom architecture",
    },
    lighthouseScore: 56,
    fcpSeconds: 2.3,
    lcpSeconds: 4.2,
    clsScore: 0.11,
    trafficLossPct: 0.31,
    vulnerabilities: {
      es: "Moderada · Deuda técnica acumulada e incompatibilidades",
      en: "Moderate · Accumulated technical debt & deprecations",
    },
    hostingCostMonthly: 20,
  },
];

export interface BenchmarkAdLossReport {
  monthlyAdSpend: number;
  wastedSpendMonthly: number;
  wastedSpendAnnual: number;
  recoveredTrafficVisitors: number;
  speedDeltaMultiplier: number;
}

export function calculateAdLossImpact(
  stack: LegacyStackPreset,
  monthlyAdSpend: number,
  cpcAvgUsd: number = 0.8
): BenchmarkAdLossReport {
  const safeSpend = Math.max(0, monthlyAdSpend);
  const safeCpc = Math.max(0.1, cpcAvgUsd);

  const totalClicks = safeSpend / safeCpc;
  const legacyLostClicks = totalClicks * stack.trafficLossPct;
  const modernLostClicks = totalClicks * MODERN_BENCHMARK.trafficLossPct;

  const netRecoveredClicks = Math.round(Math.max(0, legacyLostClicks - modernLostClicks));
  const wastedSpendMonthly = Math.round(safeSpend * (stack.trafficLossPct - MODERN_BENCHMARK.trafficLossPct));
  const wastedSpendAnnual = wastedSpendMonthly * 12;

  const speedDeltaMultiplier = Number((stack.lcpSeconds / MODERN_BENCHMARK.lcpSeconds).toFixed(1));

  return {
    monthlyAdSpend: safeSpend,
    wastedSpendMonthly: Math.max(0, wastedSpendMonthly),
    wastedSpendAnnual: Math.max(0, wastedSpendAnnual),
    recoveredTrafficVisitors: netRecoveredClicks,
    speedDeltaMultiplier,
  };
}
