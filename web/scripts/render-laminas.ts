#!/usr/bin/env node
/**
 * Renderiza láminas compuestas en HTML con contenido/diseno/kit.css: cada
 * <section class="lamina"> sale como PNG de 1080×1350 y la serie completa como
 * carrusel.pdf, una página por lámina (el documento de LinkedIn).
 *
 * Uso, desde web/:
 *   npx tsx scripts/render-laminas.ts 2026-10-28-cotizar-trabajos-a-medida
 *       piezas/<id>/diseno.html → piezas/<id>/salida/lamina-NN.png y carrusel.pdf
 *   npx tsx scripts/render-laminas.ts ../contenido/diseno/formatos/portada-fotografica.html
 *       otro .html → <carpeta>/salida/<nombre>/
 *   npx tsx scripts/render-laminas.ts <id|ruta.html> --guias
 *       wireframes (sin fotos ni textos; zona de imagen y de texto en gris) → salida/guias/
 *
 * Acepta varios ids o rutas. Antes de escribir borra los lamina-NN.png que
 * dejó el render anterior en esa carpeta, así no quedan láminas de más.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Browser, type Page } from "playwright";
import { archivoLamina, CARRUSEL_PDF } from "../src/data/social/render";
import { CONTENIDO, carpetaDe } from "./lib/piezas";

const ANCHO = 1080;
const ALTO = 1350;

type Destino = { html: string; salida: string };

/** Un id de pieza o una ruta a un .html (desde web/ o desde la raíz del repo). */
function destinoDe(arg: string): Destino {
  if (arg.endsWith(".html")) {
    const html = [path.resolve(arg), path.resolve(CONTENIDO, "..", arg)].find((file) => existsSync(file));
    if (!html) throw new Error(`No existe ${arg}`);
    const carpeta = path.dirname(html);
    const salida = path.basename(html) === "diseno.html" ? path.join(carpeta, "salida") : path.join(carpeta, "salida", path.basename(html, ".html"));
    return { html, salida };
  }
  const html = path.join(carpetaDe(arg), "diseno.html");
  if (!existsSync(html)) throw new Error(`La pieza ${arg} no tiene diseno.html (${path.relative(process.cwd(), html)})`);
  return { html, salida: path.join(carpetaDe(arg), "salida") };
}

/** El Chromium de Playwright; si no está instalado, el Chrome del sistema (como en lib/remotionBundle.ts). */
async function abrirNavegador(): Promise<Browser> {
  try {
    return await chromium.launch();
  } catch {
    return chromium.launch({ channel: "chrome" });
  }
}

/** Ancho y alto de un PNG, leídos de su cabecera. */
function medidaPng(file: string) {
  const buffer = readFileSync(file);
  return { w: buffer.readUInt32BE(16), h: buffer.readUInt32BE(20) };
}

async function prepararPagina(page: Page, html: string, guias: boolean) {
  await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
  // La vista previa separa las láminas; para el render van pegadas.
  await page.addStyleTag({ content: "body{padding:0!important;gap:0!important}" });
  if (guias) await page.evaluate(() => document.body.classList.add("guias"));
  const fuentes = await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
    const familias = ['500 100px "Familjen Grotesk"', '400 20px "Space Mono"'];
    const cargadas = await Promise.all(familias.map(async (font) => (await document.fonts.load(font)).length > 0));
    return familias.filter((_, index) => !cargadas[index]);
  });
  if (fuentes.length) throw new Error(`No cargaron las fuentes del kit (${fuentes.join(", ")}): ¿el HTML importa ../kit.css o la ruta correcta?`);
  const rotas = await page.evaluate(() => [...document.images].filter((img) => !img.naturalWidth).map((img) => img.getAttribute("src")));
  if (rotas.length) throw new Error(`Imágenes que no cargan: ${rotas.join(", ")}`);
}

async function renderizar(browser: Browser, destino: Destino, guias: boolean) {
  const page = await browser.newPage({ viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 1 });
  try {
    await prepararPagina(page, destino.html, guias);
    const laminas = page.locator("section.lamina");
    const total = await laminas.count();
    if (!total) throw new Error(`${path.basename(destino.html)} no tiene ninguna <section class="lamina">`);

    const salida = guias ? path.join(destino.salida, "guias") : destino.salida;
    mkdirSync(salida, { recursive: true });
    for (const file of readdirSync(salida)) if (/^lamina-\d+\.png$/.test(file)) rmSync(path.join(salida, file));

    console.log(`\n${path.relative(process.cwd(), destino.html)}: ${total} lámina(s)${guias ? " · guías" : ""}`);
    for (let index = 0; index < total; index++) {
      const lamina = laminas.nth(index);
      const box = await lamina.boundingBox();
      if (!box || Math.round(box.width) !== ANCHO || Math.round(box.height) !== ALTO) {
        throw new Error(`la lámina ${index + 1} mide ${box ? `${box.width}×${box.height}` : "0×0"}; tiene que medir ${ANCHO}×${ALTO}`);
      }
      const file = path.join(salida, archivoLamina(index + 1));
      await lamina.screenshot({ path: file, animations: "disabled", scale: "css" });
      const { w, h } = medidaPng(file);
      if (w !== ANCHO || h !== ALTO) throw new Error(`${path.basename(file)} salió de ${w}×${h}`);
      console.log(`  ${path.relative(process.cwd(), file)}`);
    }

    if (!guias) {
      const pdf = path.join(salida, CARRUSEL_PDF);
      await page.pdf({ path: pdf, width: `${ANCHO}px`, height: `${ALTO}px`, printBackground: true, preferCSSPageSize: true });
      const paginas = (readFileSync(pdf, "latin1").match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
      if (paginas !== total) throw new Error(`${CARRUSEL_PDF} tiene ${paginas} página(s) y hay ${total} lámina(s)`);
      console.log(`  ${path.relative(process.cwd(), pdf)} (${paginas} página/s)`);
    }
  } finally {
    await page.close();
  }
}

async function main() {
  const guias = process.argv.includes("--guias");
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  if (!args.length) {
    console.error("Uso: npx tsx scripts/render-laminas.ts <id|ruta.html…> [--guias]");
    process.exit(1);
  }
  const destinos = args.map(destinoDe);
  const browser = await abrirNavegador();
  try {
    for (const destino of destinos) await renderizar(browser, destino, guias);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(`✖ ${(error as Error).message}`);
  process.exit(1);
});
