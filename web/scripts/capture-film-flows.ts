#!/usr/bin/env node
/**
 * Capturas de los films insignia que no salen de un recorrido simple:
 *
 * - `lb-quoter`: el cotizador EN VIVO de L&B en el paso 2 (paquetes reales con
 *   sus precios), tema oscuro. Solo se eligen opciones; no se agenda ni se
 *   envía nada.
 * - `lb-crew`: la app real de la cuadrilla (`site/cuadrilla.html` del repo del
 *   cliente) servida en local, con la respuesta de `/api/crew` reemplazada por
 *   datos de ejemplo (el film los rotula así). Dos estados: paradas del día y
 *   la primera ya atendida.
 * - `ad-site`: el sitio EN VIVO de AD Media, de arriba abajo, después de cerrar
 *   el popup de diagnóstico como lo haría una visita.
 *
 * Después de recapturar, actualizar las medidas en LB_ASSETS / AD_ASSETS (el
 * test de cada film las compara con los archivos).
 *
 * Uso:
 *   npx tsx scripts/capture-film-flows.ts            (todas)
 *   npx tsx scripts/capture-film-flows.ts lb-crew    (una)
 */
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const PUBLIC = path.join(process.cwd(), "public/portfolio/brands");
const LB_SITE = path.join(process.cwd(), "../LyB Elite Wash Details/site");
const JPEG = { type: "jpeg", quality: 86 } as const;

/** Burbujas de chat fijas: tapan la captura y no son parte del flujo. */
const HIDE_FLOATING = "a[href*='wa.me'], a[href*='whatsapp'], .whatsapp-float, .wa-float { display: none !important; }";

/** Oculta lo que tiene posición fija o sticky (header, burbujas): en una captura recortada aparecería donde quedó el viewport. */
const HIDE_FIXED = `for (const element of document.querySelectorAll("body *")) {
  const position = getComputedStyle(element).position;
  if (position === "fixed" || position === "sticky") element.style.setProperty("display", "none", "important");
}`;

/** Paradas de ejemplo para la cuadrilla (precios del catálogo real: Basic Wash $55, Basic Wash Premium $85, Premium Detail $185; depósito estándar $30). */
function crewDay(firstStatus: string) {
  return {
    ok: true,
    van: "camioneta_1",
    date: "2026-10-07",
    timezone: "America/New_York",
    stops: [
      { appointmentId: "ejemplo-1", status: firstStatus, startsAt: "2026-10-07T13:00:00.000Z", from: "9:00 AM", to: "11:30 AM", title: "Camry + RAV4", address: "Dirección de ejemplo · Naples", order: "Basic Wash Premium + Basic Wash", total: 140, deposit: 30, balance: 110 },
      { appointmentId: "ejemplo-2", status: "confirmed", startsAt: "2026-10-07T17:00:00.000Z", from: "1:00 PM", to: "2:30 PM", title: "F-150", address: "Dirección de ejemplo · Fort Myers", order: "Premium Detail", total: 185, deposit: 30, balance: 155 },
    ],
  };
}

async function lbQuoter(browser: Browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("https://l-b-five.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
  await page.addStyleTag({ content: HIDE_FLOATING });
  // Paso 1: la ruta de vehículos; paso 2: los paquetes con sus precios.
  await page.locator("#catGrid .cat-card").first().click();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.locator("#optGrid .opt-card").first().waitFor({ state: "visible" });
  // Las fotos de los paquetes cargan perezosamente: se recorre la sección y se esperan todas.
  for (const card of await page.locator("#optGrid .opt-card").all()) await card.scrollIntoViewIfNeeded();
  await page.waitForFunction("Array.from(document.querySelectorAll('#quoter img')).every((img) => img.complete && img.naturalWidth > 0)", undefined, { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const out = path.join(PUBLIC, "lb-elite-wash-detail/shots/quoter-paquetes.jpg");
  // La captura de página completa pintaría el header fijo en medio de la sección.
  await page.evaluate(HIDE_FIXED);
  // Solo la columna de contenido (1200 px de 1440): en el film el texto del sitio se lee más grande.
  const section = await page.locator("#quoter").boundingBox();
  if (!section) throw new Error("#quoter no está en la página");
  const scrollY = Number(await page.evaluate("window.scrollY"));
  await page.screenshot({ path: out, fullPage: true, clip: { x: 120, y: section.y + scrollY, width: 1200, height: section.height }, ...JPEG });
  await context.close();
  return [out];
}

async function crewShot(page: Page, firstStatus: string, out: string) {
  await page.route("http://cuadrilla.local/api/crew**", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(crewDay(firstStatus)) }));
  await page.goto("http://cuadrilla.local/cuadrilla.html?t=ejemplo");
  await page.locator(".stop").first().waitFor({ state: "visible" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, ...JPEG });
  await page.unroute("http://cuadrilla.local/api/crew**");
}

async function lbCrew(browser: Browser) {
  // Teléfono de 390×844 pt a 2× (780×1688, como las demás capturas móviles).
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const html = readFileSync(path.join(LB_SITE, "cuadrilla.html"), "utf8");
  await page.route("http://cuadrilla.local/cuadrilla.html**", (route) => route.fulfill({ contentType: "text/html; charset=utf-8", body: html }));
  const dir = path.join(PUBLIC, "lb-elite-wash-detail/shots");
  const pending = path.join(dir, "cuadrilla-hoy.jpg");
  const attended = path.join(dir, "cuadrilla-atendida.jpg");
  await crewShot(page, "confirmed", pending);
  await crewShot(page, "showed", attended);
  await context.close();
  return [pending, attended];
}

async function adSite(browser: Browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("https://admediasolution.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
  // El popup de diagnóstico entra a los pocos segundos: se espera y se cierra.
  await page.waitForTimeout(4000);
  const dismiss = page.locator(':is(button, a):has-text("No, gracias")');
  if (await dismiss.count()) await dismiss.first().click().catch(() => {});
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);
  // Recorrido lento: las secciones se revelan al entrar en vista.
  const height = await page.evaluate("document.body.scrollHeight");
  for (let y = 0; y < Number(height); y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(250);
  }
  await page.evaluate("window.scrollTo(0, 0)");
  await page.waitForTimeout(1500);
  const out = path.join(PUBLIC, "ad-media-solution/shots/site-recorrido.jpg");
  await page.screenshot({ path: out, fullPage: true, ...JPEG });
  await context.close();
  return [out];
}

const TARGETS: Record<string, (browser: Browser) => Promise<string[]>> = { "lb-quoter": lbQuoter, "lb-crew": lbCrew, "ad-site": adSite };

async function main() {
  const only = process.argv[2];
  if (only && !TARGETS[only]) throw new Error(`Captura desconocida: ${only} (${Object.keys(TARGETS).join(", ")})`);
  mkdirSync(path.join(PUBLIC, "lb-elite-wash-detail/shots"), { recursive: true });
  mkdirSync(path.join(PUBLIC, "ad-media-solution/shots"), { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const [name, capture] of Object.entries(TARGETS)) {
      if (only && name !== only) continue;
      const files = await capture(browser);
      for (const file of files) console.log(`${name}: ${path.relative(process.cwd(), file)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
