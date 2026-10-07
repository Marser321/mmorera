/**
 * Abre la página de un caso en `next dev` y deja el film insignia listo para
 * congelar cuadros: Player en pausa y sin capas fijas del sitio encima
 * (barra, WhatsApp, cursor, indicador de Next).
 */
import type { Locator, Page } from "playwright";

export const DEV_ORIGIN = "http://localhost:3000";

export async function openFlagship(page: Page, slug: string, language: "es" | "en"): Promise<Locator> {
  const base = language === "en" ? `${DEV_ORIGIN}/en` : DEV_ORIGIN;
  await page.goto(`${base}/casos-de-exito/${slug}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const stage = page.locator('[data-film-stage="flagship"]');
  await stage.scrollIntoViewIfNeeded();
  await page.waitForFunction("window.__films && window.__films.flagship", undefined, { timeout: 120_000 });
  await page.evaluate("window.__films.flagship.pause()");
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  // Cadena (no función) para que tsx no inyecte `__name` en el navegador.
  await page.evaluate(`(() => {
    const stage = document.querySelector('[data-film-stage="flagship"]');
    for (const el of document.querySelectorAll("body *")) {
      const position = getComputedStyle(el).position;
      if ((position === "fixed" || position === "sticky") && !el.contains(stage) && !stage.contains(el)) el.style.setProperty("visibility", "hidden", "important");
    }
  })()`);
  await page.waitForTimeout(2500);
  const player = stage.locator(".__remotion-player").first();
  return (await player.count()) ? player : stage;
}

export async function seekFlagship(page: Page, frame: number) {
  await page.evaluate(`window.__films.flagship.seekTo(${frame})`);
  // Deja decodificar los medios del cuadro (videos e imágenes grandes).
  await page.waitForTimeout(1400);
}
