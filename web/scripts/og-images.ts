#!/usr/bin/env node
/**
 * Portadas para compartir (OG/WhatsApp, 1200×630) de las páginas fijas, en la
 * estética "pared": negro mate con grano, la palabra en contorno, el monograma
 * fundido con piedra y el titular de la página. Los textos salen de
 * `src/data/seo/paginas.ts`; las piezas de marca, de `public/marca`.
 *
 * Sale en JPG liviano (WhatsApp no muestra vistas previas pesadas) a
 * `public/og/<portada>-<idioma>.jpg`. También recorta la portada de los casos
 * sin film (`public/og/casos/<slug>.jpg`).
 *
 * Uso: npx tsx scripts/og-images.ts
 * Volver a correrlo cuando cambie un titular o la marca. No necesita servidor.
 */
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "playwright";
import { PORTADAS_OG, portadaPath, type Language, type PortadaOg } from "../src/data/seo/paginas";

const PUBLIC = path.join(process.cwd(), "public");
const W = 1200;
const H = 630;
const MAX_KB = 200;

const dataUri = (file: string, mime: string) => `data:${mime};base64,${readFileSync(path.join(PUBLIC, file)).toString("base64")}`;
const MONOGRAMA = dataUri("marca/monograma.svg", "image/svg+xml");
const PIEDRA = dataUri("marca/textura-piedra.webp", "image/webp");
const GRANO = dataUri("social/grano.png", "image/png");

const escapar = (texto: string) => texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Los mismos valores que la marca en globals.css (pared, blanco roto, pesos del blanco). */
function html(portada: PortadaOg, language: Language) {
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500&family=Space+Mono&display=block" rel="stylesheet">
<style>
  :root { --pared: #0B0B0A; --roto: #ECE7DD; --ink: 236 231 221; }
  * { margin: 0; box-sizing: border-box; }
  body { width: ${W}px; height: ${H}px; overflow: hidden; position: relative; background: var(--pared); color: var(--roto); font-family: "Familjen Grotesk", sans-serif; }
  .grano { position: absolute; inset: 0; background: url("${GRANO}") 0 0 / 384px 384px; opacity: .06; }
  .eco { position: absolute; left: -12px; top: 104px; font-size: 230px; line-height: .8; font-weight: 500; letter-spacing: -.05em; text-transform: uppercase; white-space: nowrap; color: transparent; -webkit-text-stroke: 2px rgb(var(--ink) / .14); }
  .monograma { position: absolute; right: -64px; top: 40px; width: 520px; aspect-ratio: 2239.69 / 1885.03; opacity: .85;
    background: var(--roto) url("${PIEDRA}") 0 0 / 420px 420px; background-blend-mode: multiply;
    -webkit-mask-image: url("${MONOGRAMA}"), linear-gradient(to bottom, #000 30%, transparent 92%); -webkit-mask-size: 100% 100%, 100% 100%; -webkit-mask-repeat: no-repeat; -webkit-mask-composite: source-in; }
  .mono { font-family: "Space Mono", monospace; text-transform: uppercase; }
  .rotulo { position: absolute; left: 64px; top: 54px; font-size: 16px; letter-spacing: .2em; color: rgb(var(--ink) / .62); }
  .rotulo::after { content: ""; display: block; width: 44px; height: 1px; margin-top: 14px; background: rgb(var(--ink) / .35); }
  .titular { position: absolute; left: 64px; bottom: 148px; width: 660px; font-size: 66px; line-height: .97; letter-spacing: -.045em; font-weight: 500; }
  .servicios { position: absolute; left: 64px; bottom: 104px; font-size: 16px; letter-spacing: .18em; color: rgb(var(--ink) / .58); }
  .pie { position: absolute; left: 64px; right: 64px; bottom: 50px; display: flex; align-items: center; gap: 20px; font-size: 14px; letter-spacing: .2em; color: rgb(var(--ink) / .5); }
  .hilo { position: relative; flex: 1; height: 1px; background: rgb(var(--ink) / .2); }
  .hilo::before { content: ""; position: absolute; left: 0; top: -3px; width: 7px; height: 7px; border-radius: 50%; background: var(--roto); }
</style></head><body>
  <div class="grano"></div>
  <div class="eco">${escapar(portada.eco[language])}</div>
  <div class="monograma"></div>
  <p class="mono rotulo">${escapar(portada.rotulo[language])}</p>
  <h1 class="titular">${escapar(portada.titular[language])}</h1>
  <p class="mono servicios">${escapar(portada.servicios[language])}</p>
  <div class="mono pie"><span class="hilo"></span><span>mmorera.agency</span></div>
</body></html>`;
}

async function guardar(png: Buffer, destino: string) {
  const file = path.join(PUBLIC, destino);
  mkdirSync(path.dirname(file), { recursive: true });
  const info = await sharp(png).resize(W, H, { fit: "cover" }).jpeg({ quality: 84, mozjpeg: true }).toFile(file);
  const kb = Math.round(info.size / 1024);
  if (kb > MAX_KB) throw new Error(`${destino} pesa ${kb} KB (máximo ${MAX_KB}): WhatsApp podría no mostrarla`);
  console.log(`${destino}  ${kb} KB`);
}

async function main() {
  const browser = await chromium.launch();
  // Doble densidad y reducción: el texto queda nítido en 1200×630.
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  for (const [clave, portada] of Object.entries(PORTADAS_OG) as Array<[keyof typeof PORTADAS_OG, PortadaOg]>) {
    for (const language of ["es", "en"] as const) {
      await page.setContent(html(portada, language), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const fuentes = await page.evaluate(() => [document.fonts.check('500 66px "Familjen Grotesk"'), document.fonts.check('16px "Space Mono"')]);
      if (fuentes.includes(false)) throw new Error(`No cargaron las fuentes para ${clave}-${language}`);
      await guardar(await page.screenshot({ type: "png" }), portadaPath(clave, language));
    }
  }
  await browser.close();

  // Casos sin film: la portada 4:3 recortada a 1,91:1 desde arriba (titular y pantallas).
  const cana = await sharp(path.join(PUBLIC, "portfolio/brands/cana-vacations/atlas-litoral-cana-cover.png"))
    .extract({ left: 0, top: 40, width: 1600, height: 838 })
    .png()
    .toBuffer();
  await guardar(cana, "og/casos/cana-vacations.jpg");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
