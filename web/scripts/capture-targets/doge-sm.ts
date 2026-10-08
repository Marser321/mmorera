import path from "node:path";
import type { Browser } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "doge-site",
  async capture(browser: Browser) {
    const dir = shotsDir("doge-sm");
    const files: string[] = [];

    // 1. Hero principal (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://doge-27dp.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 2. Cómo funciona / Flujo de 4 pasos (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://doge-27dp.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const el = document.querySelector("h2");
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 800, behavior: "instant" });
      });
      await page.waitForTimeout(1000);
      const out = path.join(dir, "workflow.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 3. Catálogo de servicios técnicos (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://doge-27dp.vercel.app/services", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "services.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 4. Detalle de servicio de cristales (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://doge-27dp.vercel.app/services/window-cleaning", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "service-detail.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 5. Membresías / Oferta por niveles (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://doge-27dp.vercel.app/membership", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "memberships.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 6. Tienda profesional de insumos (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://doge-27dp.vercel.app/store", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "store.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    return files;
  },
};
