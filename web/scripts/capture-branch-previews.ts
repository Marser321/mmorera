#!/usr/bin/env node
/**
 * Imágenes de las tarjetas de /casos-de-uso y /lab. Antes eran solo texto.
 *
 * - Cada caso de uso: un cuadro de su film, la escena «Problema» ya armada
 *   (el problema es la portada de la tarjeta), recortado a lo que se ve y sin
 *   el titular, que la tarjeta ya dice.
 * - Cada demo del Lab: una captura de la demo misma.
 *
 * Todo sale del sitio (publicado o local), en español y en inglés: los films y
 * las demos llevan texto.
 *
 * Uso, desde web/:
 *   npx tsx scripts/capture-branch-previews.ts                              (contra el sitio publicado)
 *   npx tsx scripts/capture-branch-previews.ts --base http://localhost:3100 (contra un build local)
 *   npx tsx scripts/capture-branch-previews.ts --raw                        (sin recortar, para elegir el encuadre)
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import { LAB_SLUGS, USE_CASE_SLUGS } from "../src/data/branchPages";
import { BRANCH_PREVIEW_SIZE, LAB_PREVIEW_SELECTOR, USE_CASE_CROP, branchPreview } from "../src/data/branchPreviews";

const ROOT = process.cwd();
const LANGUAGES = ["es", "en"] as const;
/** La escena «Problema» dura 7 s; a los 6,5 ya está toda armada. */
const PROBLEM_SETTLED_MS = 6500;

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

const base = option("base") ?? "https://mmorera.agency";
const raw = process.argv.includes("--raw");
const route = (language: (typeof LANGUAGES)[number], pathname: string) => `${base}${language === "en" ? "/en" : ""}${pathname}`;
const file = (src: string) => path.join(ROOT, "public", src);

/** Saca de la vista lo que flota sobre la página (la barra y el botón de WhatsApp), que si no se cuela en la captura. */
async function hideFloating(page: Page) {
  await page.evaluate(() => {
    for (const element of document.querySelectorAll<HTMLElement>("body *")) {
      if (getComputedStyle(element).position === "fixed") element.style.visibility = "hidden";
    }
  });
}

async function save(image: Buffer, src: string, kind: "use-case" | "lab", crop?: { x: number; y: number; width: number; height: number }) {
  const size = BRANCH_PREVIEW_SIZE[kind];
  const meta = await sharp(image).metadata();
  const region = crop && !raw
    ? { left: Math.round(crop.x * meta.width), top: Math.round(crop.y * meta.height), width: Math.round(crop.width * meta.width), height: Math.round(crop.height * meta.height) }
    : undefined;
  const target = raw ? file(src).replace(/\.webp$/, "-raw.webp") : file(src);
  mkdirSync(path.dirname(target), { recursive: true });
  let pipeline = sharp(image);
  if (region) pipeline = pipeline.extract(region).resize(size.width, size.height, { fit: "cover" });
  else if (!raw) pipeline = pipeline.resize(size.width, size.height, { fit: "cover", position: "top" });
  await pipeline.webp({ quality: 82, effort: 5 }).toFile(target);
  console.log(path.relative(ROOT, target));
}

/** El film arranca en «Problema»: se espera a que la escena termine de armarse y se pausa. */
async function captureUseCase(page: Page, id: string, language: (typeof LANGUAGES)[number]) {
  await page.goto(route(language, `/casos-de-uso/${USE_CASE_SLUGS[id]}`), { waitUntil: "networkidle", timeout: 90_000 });
  const stage = page.locator("[data-film-stage]").first();
  await stage.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -120));
  // El capítulo 01 reinicia el film desde el principio.
  await page.getByRole("button", { name: /^01/ }).first().click();
  await page.waitForTimeout(PROBLEM_SETTLED_MS);
  await page.getByRole("button", { name: language === "es" ? "Pausar film" : "Pause film" }).click();
  await page.waitForTimeout(300);
  await hideFloating(page);
  await save(await stage.screenshot({ type: "png" }), branchPreview("use-case", id, language), "use-case", USE_CASE_CROP[id]);
}

async function captureLab(page: Page, demo: keyof typeof LAB_SLUGS, language: (typeof LANGUAGES)[number]) {
  await page.goto(route(language, `/lab/${LAB_SLUGS[demo]}`), { waitUntil: "networkidle", timeout: 90_000 });
  const panel = page.locator(LAB_PREVIEW_SELECTOR[demo]).first();
  await panel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  await hideFloating(page);
  await save(await panel.screenshot({ type: "png" }), branchPreview("lab", demo, language), "lab");
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "no-preference", locale: "es-419" });
  const page = await context.newPage();
  for (const language of LANGUAGES) {
    for (const id of Object.keys(USE_CASE_SLUGS)) await captureUseCase(page, id, language);
    for (const demo of Object.keys(LAB_SLUGS) as Array<keyof typeof LAB_SLUGS>) await captureLab(page, demo, language);
  }
  await browser.close();
}

void main();
