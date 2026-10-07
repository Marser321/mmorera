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
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

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

/**
 * Solo lectura sobre un sitio en producción: ninguna petición que escriba
 * (POST, PUT…) ni llamada a CRM, pagos o funciones sale del navegador, así un
 * recorrido con datos de ejemplo no crea contactos ni cobra nada.
 */
async function readOnly(context: BrowserContext) {
  await context.route("**/*", (route) => {
    const request = route.request();
    if (request.method() !== "GET" || /leadconnector|msgsndr|gohighlevel|functions\/v1|stripe|zapier|make\.com/i.test(request.url())) return route.abort();
    return route.continue();
  });
}

/**
 * Reserva EN VIVO de Mr. Studio Tattoo (versión publicada), con datos de
 * ejemplo y en solo lectura. Se detiene en el paso 7 ("Tus datos"): no se
 * cargan datos de contacto ni se llega al calendario ni al depósito.
 */
async function mrLiveBooking(browser: Browser) {
  // A 2×: la escena del selector se acerca a la figura sin ampliar píxeles.
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2, colorScheme: "dark" });
  await readOnly(context);
  const page = await context.newPage();
  await page.goto("https://www.mrstudiotattoo.com/booking", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
  await page.waitForTimeout(2000);
  const dir = path.join(PUBLIC, "mr-studio-tattoo/shots");
  const clip = { x: 240, y: 0, width: 960, height: 1100 };
  const files: string[] = [];
  const shot = async (name: string) => {
    await page.waitForTimeout(600);
    const out = path.join(dir, `live-${name}.jpg`);
    await page.screenshot({ path: out, clip, ...JPEG });
    files.push(out);
  };
  const advance = async () => {
    await page.locator("button:visible").filter({ hasText: /Continuar|Elegir/i }).last().click();
    await page.waitForTimeout(1300);
  };
  await page.locator("input[type=date]").fill("1995-06-15");
  await shot("1-edad");
  await advance();
  await page.locator("button:visible").filter({ hasText: /^Tatuaje/ }).first().click();
  await shot("2-servicio");
  await advance();
  await page.locator("button:visible").filter({ hasText: /Ramsés/ }).first().click();
  await shot("3-artista");
  await advance();
  await page.locator("button:visible").filter({ hasText: /^Mediano/ }).first().click();
  await shot("4-tamano");
  await advance();
  await shot("5-zona");
  await page.locator('svg path[id="forearm"]').first().click({ force: true });
  await shot("5-zona-antebrazo");
  await page.getByRole("tab", { name: /Espalda/i }).click();
  await shot("5-zona-espalda");
  await page.getByRole("tab", { name: /Frente/i }).click();
  await advance();
  await page.locator("textarea:visible").first().fill("Rosa realista en el antebrazo, en negro y rojo (ejemplo).");
  await shot("6-concepto");
  await context.close();
  return files;
}

/**
 * Truckers Choice EN VIVO, en /en y en /es con el mismo encuadre:
 * - Tres paradas del recorrido bilingüe (hero, "un solo techo" y oficinas) a
 *   1920×1200. Las secciones tienen la misma estructura en los dos idiomas, así
 *   que se ubican por índice.
 * - Los paquetes y los tres pasos del formulario de cotización a 1920×1080: el servicio, la
 *   operación con datos de ejemplo y el paso de contacto vacío (el sitio está
 *   en modo vista previa y no envía nada; igual corre en solo lectura).
 */
async function tcSite(browser: Browser) {
  const dir = path.join(PUBLIC, "truckers-choice/shots");
  const files: string[] = [];
  const stops = [
    { id: "hero", section: 0 },
    { id: "roof", section: 2 },
    { id: "offices", section: 7 },
  ];
  for (const language of ["en", "es"] as const) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 / 3, colorScheme: "dark" });
    await readOnly(context);
    for (const stop of stops) {
      // Una carga por parada: el sitio suaviza el scroll por JS y, después de
      // recorrerlo con la rueda, pisaría cualquier salto con su propio destino.
      const page = await context.newPage();
      await page.goto(`https://truckers-choice-web-site.vercel.app/${language}`, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(`(() => { const s = document.querySelectorAll("section")[${stop.section}]; window.scrollTo({ top: ${stop.section} === 0 ? 0 : s.getBoundingClientRect().top + window.scrollY - 72, behavior: "instant" }); })()`);
      // Las secciones se revelan al entrar en vista.
      await page.waitForTimeout(2500);
      const out = path.join(dir, `${language}-${stop.id}.jpg`);
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await page.close();
    }
    await context.close();
  }
  for (const language of ["en", "es"] as const) {
    // 1280×720 a 1,5× = 1920×1080.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, colorScheme: "dark" });
    await readOnly(context);
    const page = await context.newPage();
    // Los paquetes: la sección se ubica por su título (cada uno lleva a la cotización).
    await page.goto(`https://truckers-choice-web-site.vercel.app/${language}`, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
    await page.addStyleTag({ content: HIDE_FLOATING });
    await page.waitForTimeout(800);
    await page.evaluate(`(() => { const s = [...document.querySelectorAll("section")].find((el) => /pile of filings|comprar trámites/i.test(el.textContent)); window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 40, behavior: "instant" }); })()`);
    await page.waitForTimeout(2500);
    const packages = path.join(dir, `${language}-quote-0.jpg`);
    await page.screenshot({ path: packages, clip: { x: 80, y: 60, width: 1280, height: 720 }, ...JPEG });
    files.push(packages);
    await page.goto(`https://truckers-choice-web-site.vercel.app/${language}/contact?package=prepare-to-operate`, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
    await page.addStyleTag({ content: HIDE_FLOATING });
    const form = page.locator("form").first();
    const quoteShot = async (step: number) => {
      await page.waitForTimeout(700);
      const box = await form.boundingBox();
      if (!box) throw new Error("Truckers: no se encontró el formulario");
      const out = path.join(dir, `${language}-quote-${step}.jpg`);
      await page.screenshot({ path: out, clip: { x: Math.max(0, box.x - 88), y: Math.min(180, Math.max(0, box.y + box.height / 2 - 360)), width: 1280, height: 720 }, ...JPEG });
      files.push(out);
    };
    const advance = () => page.getByRole("button", { name: /^(Continue|Continuar)/ }).click();
    await form.locator("button").filter({ hasText: /^(Truck Insurance|Seguro de Camiones)/ }).first().click();
    await quoteShot(1);
    await advance();
    await page.waitForTimeout(700);
    await form.locator("select").first().selectOption({ index: 1 });
    const inputs = form.locator("input:not([type=hidden]):not([type=checkbox]):not([type=radio])");
    await inputs.nth(0).fill("FL");
    await inputs.nth(1).fill("2");
    await quoteShot(2);
    await advance();
    // Paso 3: datos de contacto. Se captura vacío; no se escribe nada.
    await quoteShot(3);
    await context.close();
  }
  return files;
}

const TARGETS: Record<string, (browser: Browser) => Promise<string[]>> = { "lb-quoter": lbQuoter, "lb-crew": lbCrew, "ad-site": adSite, "mr-live-booking": mrLiveBooking, "tc-site": tcSite };

async function main() {
  const only = process.argv[2];
  if (only && !TARGETS[only]) throw new Error(`Captura desconocida: ${only} (${Object.keys(TARGETS).join(", ")})`);
  mkdirSync(path.join(PUBLIC, "lb-elite-wash-detail/shots"), { recursive: true });
  mkdirSync(path.join(PUBLIC, "ad-media-solution/shots"), { recursive: true });
  mkdirSync(path.join(PUBLIC, "mr-studio-tattoo/shots"), { recursive: true });
  mkdirSync(path.join(PUBLIC, "truckers-choice/shots"), { recursive: true });
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
