#!/usr/bin/env node
/**
 * Mide cada caso EN VIVO con Lighthouse (el motor de PageSpeed Insights, perfil
 * mobile con throttling simulado) y guarda los puntajes reales en
 * `src/data/caseMetrics.generated.json`. Cada caso se mide 3 veces y se guarda
 * la corrida mediana por rendimiento: nada se escribe a mano y cada número
 * lleva su fecha de medición.
 *
 * Uso:
 *   npx tsx scripts/measure-cases.ts            # casos destacados
 *   npx tsx scripts/measure-cases.ts --all      # todos los casos con liveUrl
 *   npx tsx scripts/measure-cases.ts lb-elite-wash-detail
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";
import { PROJECT_CASES } from "../src/data/projectCases";

const MANIFEST = path.join(process.cwd(), "src/data/caseMetrics.generated.json");
const RUNS = 3;

interface CaseMetrics {
  measuredAt: string;
  strategy: "mobile";
  runs: number;
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  /** Largest Contentful Paint en segundos (mobile, red simulada). */
  lcp: number;
  cls: number;
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const only = args.filter((arg) => !arg.startsWith("--"));
const targets = PROJECT_CASES.filter((project) => {
  if (!project.liveUrl) return false;
  if (only.length) return only.includes(project.slug);
  return all || project.status === "featured";
});

async function runOnce(url: string, port: number): Promise<Omit<CaseMetrics, "measuredAt" | "strategy" | "runs">> {
  // Lighthouse es ESM puro: import dinámico para convivir con el runner CJS de tsx.
  const { default: lighthouse } = await import("lighthouse");
  const result = await lighthouse(url, {
    port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  if (!result) throw new Error("Lighthouse no devolvió resultado");
  const { lhr } = result;
  if (lhr.runtimeError) throw new Error(lhr.runtimeError.message);
  const score = (id: string) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
  return {
    performance: score("performance"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    seo: score("seo"),
    lcp: Math.round((lhr.audits["largest-contentful-paint"]?.numericValue ?? 0) / 100) / 10,
    cls: Math.round((lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0) * 1000) / 1000,
  };
}

async function main() {
  const manifest: Record<string, CaseMetrics> = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });
  try {
    for (const project of targets) {
      console.log(`▶ ${project.slug}`);
      try {
        const runs = [];
        for (let i = 0; i < RUNS; i++) runs.push(await runOnce(project.liveUrl!, chrome.port));
        const median = [...runs].sort((a, b) => a.performance - b.performance)[Math.floor(runs.length / 2)];
        manifest[project.slug] = { measuredAt: new Date().toISOString().slice(0, 10), strategy: "mobile", runs: RUNS, ...median };
        writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
        console.log(`  ✓ perf ${median.performance} · a11y ${median.accessibility} · bp ${median.bestPractices} · seo ${median.seo} · LCP ${median.lcp}s  (perf por corrida: ${runs.map((r) => r.performance).join("/")})`);
      } catch (error) {
        console.error(`  ✗ ${error instanceof Error ? error.message : error}`);
      }
    }
  } finally {
    chrome.kill();
  }
}

void main();
