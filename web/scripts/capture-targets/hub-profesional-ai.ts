import path from "node:path";
import type { Browser } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "hub-profesional-ai-site",
  async capture(browser: Browser) {
    const dir = shotsDir("hub-profesional-ai");
    const files: string[] = [];

    // 1. Home portal con Mecánica Premium (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://profecionalcv.vercel.app/", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 2. Showcase Live: El Estándar Profesional (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://profecionalcv.vercel.app/showcase", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1500);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "showcase.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 3. Grid de las 6 plantillas profesionales en /showcase (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://profecionalcv.vercel.app/showcase", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2, h3, div")).find(
          (node) => node.textContent?.includes("ELEGÍ TU") || node.textContent?.includes("ESPECIALIDAD"),
        );
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 900, behavior: "instant" });
      });
      await page.waitForTimeout(1200);
      const out = path.join(dir, "templates.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 4. Servicios Tácticos Elite en / (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://profecionalcv.vercel.app/", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2, h3")).find((node) => node.textContent?.includes("Servicios Elite"));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 1800, behavior: "instant" });
      });
      await page.waitForTimeout(1200);
      const out = path.join(dir, "services.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 5. Portafolio de 8 activos verificados en / (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://profecionalcv.vercel.app/", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2, h3")).find((node) => node.textContent?.includes("Casos de Éxito Real"));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 2700, behavior: "instant" });
      });
      await page.waitForTimeout(1200);
      const out = path.join(dir, "gallery.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 6. Protocolo de servicio en 4 pasos en / (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://profecionalcv.vercel.app/", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2, h3")).find((node) => node.textContent?.includes("EL CAMINO A LA"));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 3600, behavior: "instant" });
      });
      await page.waitForTimeout(1200);
      const out = path.join(dir, "protocol.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    return files;
  },
};
