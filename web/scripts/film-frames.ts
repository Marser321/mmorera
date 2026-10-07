#!/usr/bin/env node
/**
 * Congela cuadros exactos de un film insignia para revisarlos a resolución
 * completa (más nítido que el panel del navegador). Necesita `npm run dev`
 * corriendo: usa el Player expuesto en `window.__films.flagship`.
 *
 * Uso:
 *   npx tsx scripts/film-frames.ts <slug> <landscape|portrait> <cuadro,cuadro,…> [es|en] [carpeta]
 *
 * Los PNG quedan en la carpeta indicada (por defecto, .film-frames/ en web/).
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { openFlagship, seekFlagship } from "./lib/flagshipPage";

async function main() {
  const [slug, format = "landscape", list = "0", language = "es", outDir = path.join(process.cwd(), ".film-frames")] = process.argv.slice(2);
  if (!slug) throw new Error("Uso: npx tsx scripts/film-frames.ts <slug> <landscape|portrait> <cuadros> [es|en] [carpeta]");
  const frames = list.split(",").map(Number);
  const portrait = format === "portrait";
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: portrait ? { width: 430, height: 900 } : { width: 1600, height: 1000 }, deviceScaleFactor: portrait ? 2.6 : 1.05, colorScheme: "dark" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text().slice(0, 300));
  });
  const target = await openFlagship(page, slug, language === "en" ? "en" : "es");
  for (const frame of frames) {
    await seekFlagship(page, frame);
    const file = path.join(outDir, `${slug}-${format}-${language}-${frame}.png`);
    await target.screenshot({ path: file });
    console.log(file);
  }
  if (errors.length) console.log("errores", JSON.stringify(errors.slice(0, 10)));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
