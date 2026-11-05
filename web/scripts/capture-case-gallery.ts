#!/usr/bin/env node
/**
 * Galería de cada caso: páginas reales del sitio EN VIVO, vistas en computadora,
 * tablet y teléfono. Reemplaza a la galería de tres alturas de la portada, que
 * dejaba pasar pop-ups, errores y capturas repetidas.
 *
 * Una captura mala no se publica: se rechaza si queda un modal tapando la
 * página, si el sitio responde con error, si la imagen sale casi en blanco o si
 * repite otra vista del mismo caso. Una vista entra si salió bien en computadora
 * y en al menos otra pantalla. Solo lee: ninguna petición que escriba sale del
 * navegador.
 *
 * Uso:
 *   npx tsx scripts/capture-case-gallery.ts              # todos los casos de gallery-targets
 *   npx tsx scripts/capture-case-gallery.ts doge-sm      # uno puntual
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright";
import sharp from "sharp";
import { PROJECT_CASES } from "../src/data/projectCases";
import { GALLERY_DEVICES, type CaseGalleryManifest, type GalleryDevice, type GalleryShot } from "../src/data/caseGallery";
import { GALLERY_TARGETS, type GalleryView } from "./gallery-targets";
import { coveringOverlay, dismissOverlays, HIDE_FLOATING, readOnly } from "./lib/capture";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public/portfolio/gallery");
const MANIFEST = path.join(ROOT, "src/data/caseGallery.generated.json");
const WORKERS = 3;

/** Medida en la que se navega y ancho con el que se guarda (retina sin pesar de más). */
const CONTEXTS: Record<GalleryDevice, BrowserContextOptions & { outWidth: number }> = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, outWidth: 1440 },
  tablet: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true, outWidth: 900 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, outWidth: 600 },
};

const BROKEN_PAGE = /this page couldn.?t load|application error|page not found|página no encontrada|something went wrong|404/i;
/** Desvío de brillo por debajo del cual la captura es un panel vacío. */
const MIN_CONTRAST = 7;
/** Bits distintos (de 256) por debajo de los cuales dos capturas son la misma. */
const MIN_HASH_DISTANCE = 0.1;

async function perceptualHash(image: Buffer) {
  const { data } = await sharp(image).greyscale().resize(17, 16, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  const bits: number[] = [];
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) bits.push(data[y * 17 + x] < data[y * 17 + x + 1] ? 1 : 0);
  return bits.join("");
}

const hashDistance = (a: string, b: string) => [...a].filter((bit, index) => bit !== b[index]).length / a.length;

/** Baja por toda la página para disparar los fundidos y las imágenes diferidas. */
async function revealPage(page: Page, height: number) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.min(36, Math.ceil(total / (height * 0.7)));
  for (let step = 1; step <= steps; step++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }), step * height * 0.7);
    await page.waitForTimeout(160);
  }
  await page.waitForLoadState("networkidle", { timeout: 4000 }).catch(() => {});
}

async function goToView(page: Page, view: GalleryView) {
  if (!view.section) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
    return;
  }
  const target = view.section.startsWith("#") ? page.locator(view.section).first() : page.getByText(view.section).first();
  await target.waitFor({ state: "attached", timeout: 6000 });
  await target.evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 96, behavior: "instant" as ScrollBehavior }));
}

async function captureView(page: Page, baseUrl: string, view: GalleryView, device: GalleryDevice) {
  const url = new URL(view.path, baseUrl).href;
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 }).catch(() => null);
  if (response && response.status() >= 400) throw new Error(`HTTP ${response.status()}`);
  await page.addStyleTag({ content: HIDE_FLOATING }).catch(() => {});
  // Algunos pop-ups aparecen a los pocos segundos: se espera antes de cerrarlos.
  await page.waitForTimeout(3200);
  await dismissOverlays(page);
  await revealPage(page, CONTEXTS[device].viewport!.height);
  await goToView(page, view);
  await page.waitForTimeout(1500);
  if (await coveringOverlay(page)) await dismissOverlays(page);

  const text = await page.evaluate(() => document.body.innerText);
  if (text.length < 500 && BROKEN_PAGE.test(text)) throw new Error("la página muestra un error");

  const raw = await page.screenshot({ type: "png" });
  const stats = await sharp(raw).greyscale().stats();
  if (stats.channels[0].stdev < MIN_CONTRAST) throw new Error(`salió casi en blanco (contraste ${stats.channels[0].stdev.toFixed(1)})`);
  return raw;
}

async function captureCase(browser: Browser, slug: string, manifest: CaseGalleryManifest) {
  const project = PROJECT_CASES.find((item) => item.slug === slug);
  const views = GALLERY_TARGETS[slug];
  if (!project?.liveUrl || !views) throw new Error("no tiene sitio en vivo u objetivos");
  const baseUrl = project.liveUrl;
  const dir = path.join(OUT_DIR, slug);
  mkdirSync(dir, { recursive: true });

  const shots = new Map<string, Partial<Record<GalleryDevice, GalleryShot & { hash: string }>>>();
  for (const device of GALLERY_DEVICES) {
    const { outWidth, ...options } = CONTEXTS[device];
    const context = await browser.newContext({ ...options, reducedMotion: "no-preference", locale: "es-419" });
    await readOnly(context);
    // tsx agrega __name() a las funciones con nombre; dentro del navegador no existe.
    await context.addInitScript("window.__name = (fn) => fn;");
    const page = await context.newPage();
    for (const view of views) {
      try {
        const raw = await captureView(page, baseUrl, view, device);
        const hash = await perceptualHash(raw);
        const repeated = [...shots.entries()].find(([, entry]) => entry[device] && hashDistance(entry[device].hash, hash) < MIN_HASH_DISTANCE);
        if (repeated) throw new Error(`repite la vista ${repeated[0]}`);
        const file = `${view.id}-${device}.webp`;
        const output = await sharp(raw).resize({ width: outWidth }).webp({ quality: 78, effort: 5 }).toBuffer({ resolveWithObject: true });
        writeFileSync(path.join(dir, file), output.data);
        shots.set(view.id, { ...shots.get(view.id), [device]: { src: `/portfolio/gallery/${slug}/${file}`, width: output.info.width, height: output.info.height, hash } });
      } catch (error) {
        console.error(`  ✗ ${slug}/${view.id} (${device}): ${error instanceof Error ? error.message.split("\n")[0] : error}`);
      }
    }
    await context.close();
  }

  const complete = views.flatMap((view) => {
    const entry = shots.get(view.id);
    if (!entry?.desktop || !(entry.tablet || entry.mobile)) return [];
    return [{ id: view.id, label: view.label, url: new URL(view.path, baseUrl).href, desktop: entry.desktop, tablet: entry.tablet, mobile: entry.mobile }];
  });
  manifest[slug] = { capturedAt: new Date().toISOString().slice(0, 10), views: complete };
  console.log(`✓ ${slug}: ${complete.length}/${views.length} vistas, ${complete.filter((view) => view.tablet && view.mobile).length} con las tres pantallas`);
}

async function main() {
  const only = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const queue = (only.length ? only : Object.keys(GALLERY_TARGETS)).slice();
  const manifest: CaseGalleryManifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
  // Chrome real si está instalado: el Chromium de Playwright no reproduce H.264.
  const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
  const worker = async () => {
    for (let slug = queue.shift(); slug; slug = queue.shift()) {
      console.log(`▶ ${slug}`);
      try {
        await captureCase(browser, slug, manifest);
        writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
      } catch (error) {
        console.error(`✗ ${slug}: ${error instanceof Error ? error.message : error}`);
      }
    }
  };
  await Promise.all(Array.from({ length: WORKERS }, worker));
  await browser.close();
}

void main();
