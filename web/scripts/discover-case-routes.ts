#!/usr/bin/env node
/**
 * Lista las páginas internas y los títulos de sección de cada caso EN VIVO, para
 * elegir qué mostrar en su galería (scripts/gallery-targets.ts). Solo lee.
 *
 * Uso: npx tsx scripts/discover-case-routes.ts [slug…] > rutas.json
 */
import { chromium } from "playwright";
import { PROJECT_CASES } from "../src/data/projectCases";
import { dismissOverlays, readOnly } from "./lib/capture";

const only = process.argv.slice(2);
const SKIP = /^\/(api|admin|login|signin|signup|register|auth|dashboard|privacy|privacidad|terms|terminos|cookies|legal)(\/|$)/i;

async function main() {
  const browser = await chromium.launch();
  const report: Record<string, unknown> = {};
  for (const project of PROJECT_CASES) {
    if (!project.liveUrl || (only.length && !only.includes(project.slug))) continue;
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await readOnly(context);
    await context.addInitScript("window.__name = (fn) => fn;");
    const page = await context.newPage();
    try {
      await page.goto(project.liveUrl, { waitUntil: "networkidle", timeout: 45_000 }).catch(() => page.waitForLoadState("load"));
      await page.waitForTimeout(3500);
      await dismissOverlays(page).catch(() => {});
      const origin = new URL(page.url()).origin;
      const data = await page.evaluate((siteOrigin) => {
        const links = new Map<string, string>();
        for (const anchor of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
          const url = new URL(anchor.href, location.href);
          if (url.origin !== siteOrigin) continue;
          const text = (anchor.innerText || anchor.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40);
          const key = url.pathname + url.hash;
          if (!links.has(key) || (text && !links.get(key))) links.set(key, text);
        }
        const headings = Array.from(document.querySelectorAll("h1, h2")).map((heading) => (heading as HTMLElement).innerText.trim().replace(/\s+/g, " ").slice(0, 60)).filter(Boolean);
        return { links: Array.from(links.entries()), headings, height: document.documentElement.scrollHeight };
      }, origin);
      report[project.slug] = {
        url: project.liveUrl,
        height: data.height,
        links: data.links.filter(([href]) => href !== "/" && !SKIP.test(href)).slice(0, 26),
        headings: data.headings.slice(0, 16),
      };
      console.error(`✓ ${project.slug}`);
    } catch (error) {
      report[project.slug] = { error: error instanceof Error ? error.message : String(error) };
      console.error(`✗ ${project.slug}`);
    }
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
}

void main();
