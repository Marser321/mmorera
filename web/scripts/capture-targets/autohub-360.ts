import path from "node:path";
import type { Browser } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "autohub-site",
  async capture(browser: Browser) {
    const dir = shotsDir("autohub-360");
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
      await page.goto("https://auto-indol-five.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 2. Catálogo de vehículos (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://auto-indol-five.vercel.app/catalogo", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "catalog.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 3. Ficha de vehículo / Detalle con simulador (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://auto-indol-five.vercel.app/catalogo/demo-1", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "detail.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 4. Modal Tour Interior 360° con Three.js y Hotspots (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://auto-indol-five.vercel.app/catalogo/demo-1", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1200);

      // Click the 360 tour button
      const tourBtn = page.locator("button:has-text('Tour Interior 360°')");
      if (await tourBtn.count() > 0) {
        await tourBtn.first().click();
        await page.waitForTimeout(2500); // Wait for Three.js canvas & texture load
      }
      const out = path.join(dir, "tour-360.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 5. Servicios VIP de digitalización (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://auto-indol-five.vercel.app/servicios", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "services.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 6. Central de Operaciones / Admin (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://auto-indol-five.vercel.app/admin", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "admin.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    return files;
  },
};
