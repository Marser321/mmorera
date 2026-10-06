#!/usr/bin/env node
/**
 * Captura pantallas internas (paneles) de un caso EN VIVO entrando por su
 * acceso demo PÚBLICO: el botón que el propio sitio ofrece a cualquier visita.
 * No escribe credenciales. Las capturas se revisan a mano antes de publicarse:
 * si aparecen datos personales reales, no se usan.
 *
 * Uso:
 *   npx tsx scripts/capture-panel-shots.ts new-brothers-barberia
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

interface PanelTarget {
  entryUrl: string;
  /** Texto del botón público que abre el demo. */
  demoButton: RegExp;
  /** Ruta a la que llega el demo (se espera antes de recorrer). */
  landing: RegExp;
  routes: Array<{ name: string; path: string }>;
  /** Textos de modales de bienvenida que se cierran antes de capturar. */
  dismiss?: RegExp[];
}

const TARGETS: Record<string, PanelTarget> = {
  "new-brothers-barberia": {
    entryUrl: "https://nb-barber.vercel.app/",
    demoButton: /Entrar al panel demo/i,
    landing: /\/admin/,
    routes: [
      { name: "dashboard", path: "/admin/dashboard" },
      { name: "citas", path: "/admin/citas" },
      { name: "clientes", path: "/admin/clientes" },
      { name: "pos", path: "/admin/pos" },
      { name: "caja", path: "/admin/caja" },
      { name: "liquidaciones", path: "/admin/liquidaciones" },
    ],
    dismiss: [/No volver a mostrar/i],
  },
};

const OUT_DIR = path.join(process.cwd(), "public/portfolio/panels");
const DESKTOP = { width: 1440, height: 900 };

async function main() {
  const slug = process.argv[2];
  const target = slug ? TARGETS[slug] : undefined;
  if (!slug || !target) throw new Error(`Caso sin panel configurado: ${slug ?? "(vacío)"}`);
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1, colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto(target.entryUrl, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
    // Popups de bienvenida tapan el sitio: se cierran como lo haría una visita.
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.getByRole("button", { name: target.demoButton }).or(page.getByRole("link", { name: target.demoButton })).first().click();
    await page.waitForURL(target.landing, { timeout: 30_000 });

    const origin = new URL(target.entryUrl).origin;
    for (const route of target.routes) {
      await page.goto(origin + route.path, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.waitForTimeout(1200);
      for (const text of target.dismiss ?? []) {
        const control = page.getByText(text).first();
        if (await control.isVisible().catch(() => false)) {
          await control.click().catch(() => {});
          await page.waitForTimeout(600);
        }
      }
      await page.keyboard.press("Escape").catch(() => {});
      await page.waitForTimeout(600);
      const file = path.join(OUT_DIR, `${slug}-${route.name}.jpg`);
      await page.screenshot({ path: file, type: "jpeg", quality: 86 });
      console.log(`  ✓ ${route.name} → ${path.relative(process.cwd(), file)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
