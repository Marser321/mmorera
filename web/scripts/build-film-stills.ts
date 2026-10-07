#!/usr/bin/env node
/**
 * Congela los cuadros fijos de cada film insignia (`FLAGSHIP_STILLS`) en
 * español e inglés: `og` (1200×630, para compartir el caso) y `hero`
 * (1600×900, para el índice del home). Necesita `npm run dev` corriendo.
 *
 * Uso: npx tsx scripts/build-film-stills.ts [slug…]
 * Volver a correrlo cuando cambie la apertura o la protagonista de un film.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "playwright";
import { FLAGSHIP_SLUGS, FLAGSHIP_STILLS, STILL_SIZE, flagshipStill, type FlagshipSlug, type StillKind } from "../src/data/films/flagships/slugs";
import { openFlagship, seekFlagship } from "./lib/flagshipPage";

async function main() {
  const only = process.argv.slice(2);
  const slugs = only.length ? (only as FlagshipSlug[]) : [...FLAGSHIP_SLUGS];
  const browser = await chromium.launch();
  // 1600 px de ancho × 1,35: el Player queda en ~2000 px y la reducción es limpia.
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.35, colorScheme: "dark" });
  for (const slug of slugs) {
    for (const language of ["es", "en"] as const) {
      const page = await context.newPage();
      const target = await openFlagship(page, slug, language);
      for (const kind of ["og", "hero"] as StillKind[]) {
        await seekFlagship(page, FLAGSHIP_STILLS[slug][kind]);
        const shot = await target.screenshot({ type: "png" });
        const { w, h } = STILL_SIZE[kind];
        // El cuadro es 16:9; el OG (1,91:1) recorta arriba y abajo por igual.
        const file = path.join(process.cwd(), "public", flagshipStill(slug, kind, language)!);
        mkdirSync(path.dirname(file), { recursive: true });
        await sharp(shot).resize(w, h, { fit: "cover", position: "centre" }).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
        console.log(file);
      }
      await page.close();
    }
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
