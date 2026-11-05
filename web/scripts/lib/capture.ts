/**
 * Piezas comunes de las capturas de los films: dónde se guardan, el formato,
 * qué se oculta y el modo de solo lectura para sitios en producción. Las usan
 * capture-film-flows.ts y cada objetivo de scripts/capture-targets/.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Browser, BrowserContext, Page } from "playwright";

export const PUBLIC_BRANDS = path.join(process.cwd(), "public/portfolio/brands");

export const JPEG = { type: "jpeg", quality: 86 } as const;

/** Carpeta de capturas de un caso (se crea si no existe). */
export function shotsDir(slug: string) {
  const dir = path.join(PUBLIC_BRANDS, slug, "shots");
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Burbujas de chat fijas: tapan la captura y no son parte del flujo. */
export const HIDE_FLOATING = "a[href*='wa.me'], a[href*='whatsapp'], .whatsapp-float, .wa-float { display: none !important; }";

/** Oculta lo que tiene posición fija o sticky (header, burbujas): en una captura recortada aparecería donde quedó el viewport. */
export const HIDE_FIXED = `for (const element of document.querySelectorAll("body *")) {
  const position = getComputedStyle(element).position;
  if (position === "fixed" || position === "sticky") element.style.setProperty("display", "none", "important");
}`;

/**
 * Solo lectura sobre un sitio en producción: ninguna petición que escriba
 * (POST, PUT…) ni llamada a CRM, pagos o funciones sale del navegador, así un
 * recorrido con datos de ejemplo no crea contactos ni cobra nada.
 */
export async function readOnly(context: BrowserContext) {
  await context.route("**/*", (route) => {
    const request = route.request();
    if (request.method() !== "GET" || /leadconnector|msgsndr|gohighlevel|functions\/v1|stripe|zapier|make\.com|formspree|resend|supabase/i.test(request.url())) return route.abort();
    return route.continue();
  });
}

// Popups de bienvenida/cookies tapan el sitio y bloquean el scroll del reel
// (el reel de AD Media quedó entero detrás de "Diagnóstico gratis").
const CLOSERS = [
  'button[aria-label*="cerrar" i]',
  'button[aria-label*="close" i]',
  '[role="dialog"] button:has-text("Cerrar")',
  '[role="dialog"] button:has-text("Close")',
  'button:text-is("×")',
  'button:text-is("✕")',
  ':is(button, a):has-text("No, gracias")',
  ':is(button, a):has-text("Quizás más tarde")',
  ':is(button, a):has-text("Ahora no")',
  ':is(button, a):has-text("No thanks")',
  ':is(button, a):has-text("Maybe later")',
  ':is(button, a):has-text("Not now")',
].join(", ");

/**
 * Capa fija que tapa más de la mitad de la ventana y se puede cliquear (un
 * modal), o null. Los fondos fijos decorativos no cuentan: no reciben clics o
 * están por debajo del contenido.
 */
export async function coveringOverlay(page: Page) {
  return page.evaluate(() => {
    const viewport = window.innerWidth * window.innerHeight;
    for (const element of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      const style = getComputedStyle(element);
      if (style.position !== "fixed" || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.1) continue;
      if (style.pointerEvents === "none" || !(Number(style.zIndex) >= 10)) continue;
      const rect = element.getBoundingClientRect();
      const w = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      const h = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      const modal = element.matches('[role="dialog"], [aria-modal="true"]') || element.querySelector('[role="dialog"], [aria-modal="true"], button, a') !== null;
      if (modal && (w * h) / viewport > 0.5) return `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 60)}`;
    }
    return null;
  });
}

export async function dismissOverlays(page: Page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.keyboard.press("Escape").catch(() => {});
    const closer = page.locator(CLOSERS).filter({ visible: true });
    if (await closer.count()) await closer.first().click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(800);
    if (!(await coveringOverlay(page))) return;
  }
  // Mejor no grabar que publicar un reel tapado: el caso queda con el material anterior.
  throw new Error(`un modal sigue tapando la página (${await coveringOverlay(page)})`);
}

/**
 * Un objetivo de captura en su propio archivo (scripts/capture-targets/<slug>.ts):
 * `export const target: CaptureTarget = { name, capture }`. capture-film-flows
 * los carga solos, así cada caso suma el suyo sin tocar archivos compartidos.
 */
export type CaptureTarget = { name: string; capture: (browser: Browser) => Promise<string[]> };
