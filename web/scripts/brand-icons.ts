#!/usr/bin/env node
/**
 * Íconos de la marca a partir de los trazos oficiales del monograma: el MM en
 * blanco roto sobre la pared, centrado por el anillo. Fondo oscuro siempre:
 * Google muestra el favicon sobre blanco y un logo blanco transparente no se ve.
 *
 *   src/app/icon.svg        favicon vectorial (esquinas redondeadas)
 *   src/app/favicon.ico     16, 32 y 48 px
 *   src/app/apple-icon.png  180 px, a sangre (iOS redondea solo)
 *   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png (manifest)
 *
 * Uso: npx tsx scripts/brand-icons.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { LOGO_PATHS, LOGO_RING } from "../src/data/brand/logoPaths";

const PARED = "#0B0B0A";
const ROTO = "#ECE7DD";

/** Lado del cuadrado: el anillo ocupa el 72 % (dentro de la zona segura de los íconos "maskable"). */
const LADO = Math.round((LOGO_RING.outerRadius * 2) / 0.72);
const X0 = LOGO_RING.cx - LADO / 2;
const Y0 = LOGO_RING.cy - LADO / 2;

function svg({ redondeado }: { redondeado: boolean }) {
  const radio = redondeado ? Math.round(LADO * 0.22) : 0;
  const trazos = Object.values(LOGO_PATHS).map((d) => `<path d="${d}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${X0} ${Y0} ${LADO} ${LADO}"><rect x="${X0}" y="${Y0}" width="${LADO}" height="${LADO}" rx="${radio}" fill="${PARED}"/><g fill="${ROTO}">${trazos}</g></svg>\n`;
}

/** ICO con PNG adentro (lo leen todos los navegadores actuales). */
function ico(pngs: Array<{ size: number; data: Buffer }>) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entradas = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por píxel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entradas, ...pngs.map((p) => p.data)]);
}

async function main() {
  const root = process.cwd();
  const redondo = svg({ redondeado: true });
  const sangre = svg({ redondeado: false });
  writeFileSync(path.join(root, "src/app/icon.svg"), redondo);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const png = async (fuente: string, size: number) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent"><img style="display:block;width:${size}px;height:${size}px" src="data:image/svg+xml;base64,${Buffer.from(fuente).toString("base64")}"></body></html>`);
    await page.waitForFunction(() => document.images[0]?.complete);
    return page.screenshot({ type: "png", omitBackground: true });
  };

  // En serie: una sola página de Playwright.
  const favicons: Array<{ size: number; data: Buffer }> = [];
  for (const size of [16, 32, 48]) favicons.push({ size, data: await png(redondo, size) });
  writeFileSync(path.join(root, "src/app/favicon.ico"), ico(favicons));
  writeFileSync(path.join(root, "src/app/apple-icon.png"), await png(sangre, 180));
  mkdirSync(path.join(root, "public/icons"), { recursive: true });
  writeFileSync(path.join(root, "public/icons/icon-192.png"), await png(redondo, 192));
  writeFileSync(path.join(root, "public/icons/icon-512.png"), await png(redondo, 512));
  writeFileSync(path.join(root, "public/icons/icon-maskable-512.png"), await png(sangre, 512));
  await browser.close();
  console.log("icon.svg, favicon.ico, apple-icon.png e icons/ listos");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
