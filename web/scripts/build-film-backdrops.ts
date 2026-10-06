#!/usr/bin/env node
/**
 * Genera las versiones difuminadas que usan los films como fondos en
 * movimiento ("fondos difuminados"). El desenfoque se hace acá, una vez, con
 * sharp: así en la web no hay `filter: blur` en vivo sobre capas grandes
 * (regla 2 de lib/motion.ts) y cada fondo pesa unos pocos KB.
 *
 * Uso: npx tsx scripts/build-film-backdrops.ts
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public/portfolio");
const OUT = path.join(ROOT, "backdrops");

/** Carpetas fuente y qué archivos tomar de cada una. */
const SOURCES: Array<{ dir: string; match: RegExp }> = [
  { dir: "panels", match: /\.jpg$/ },
  { dir: "shots", match: /-(desktop-1|mobile-1)\.jpg$/ },
  { dir: "reels", match: /-poster\.jpg$/ },
  { dir: "brands/fenix-medical-center/scenes", match: /\.(jpg|webp|png)$/ },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  let made = 0;
  for (const source of SOURCES) {
    const dir = path.join(ROOT, source.dir);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((name) => source.match.test(name))) {
      const name = file.replace(/\.(jpg|webp|png)$/, "");
      const out = path.join(OUT, `${name}-blur.jpg`);
      await sharp(path.join(dir, file)).resize({ width: 640 }).blur(18).modulate({ saturation: 1.1 }).jpeg({ quality: 62 }).toFile(out);
      made += 1;
    }
  }
  console.log(`✓ ${made} fondos difuminados en ${path.relative(process.cwd(), OUT)}`);
}

void main();
