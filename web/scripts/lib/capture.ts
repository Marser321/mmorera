/**
 * Piezas comunes de las capturas de los films: dónde se guardan, el formato,
 * qué se oculta y el modo de solo lectura para sitios en producción. Las usan
 * capture-film-flows.ts y cada objetivo de scripts/capture-targets/.
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Browser, BrowserContext } from "playwright";

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

/**
 * Un objetivo de captura en su propio archivo (scripts/capture-targets/<slug>.ts):
 * `export const target: CaptureTarget = { name, capture }`. capture-film-flows
 * los carga solos, así cada caso suma el suyo sin tocar archivos compartidos.
 */
export type CaptureTarget = { name: string; capture: (browser: Browser) => Promise<string[]> };
