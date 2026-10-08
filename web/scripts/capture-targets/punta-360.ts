import path from "node:path";
import type { Browser } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "punta-360-site",
  async capture(browser: Browser) {
    const dir = shotsDir("punta-360");
    const files: string[] = [];

    // 1. Home portal selector (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://punta-360.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 2. Propietarios / Owners Hero + Stats (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://punta-360.vercel.app/owners", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "owners.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 3. Disciplinas de marketing visual (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://punta-360.vercel.app/owners", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2")).find((h) => h.textContent?.includes("Primera Impresión"));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 900, behavior: "instant" });
      });
      await page.waitForTimeout(1000);
      const out = path.join(dir, "disciplines.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 4. Proceso en 4 pasos (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://punta-360.vercel.app/owners", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2")).find((h) => h.textContent?.includes("Simple"));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 1800, behavior: "instant" });
      });
      await page.waitForTimeout(1000);
      const out = path.join(dir, "workflow.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 5. Enterprise Hero (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://punta-360.vercel.app/enterprise", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1000);
      const out = path.join(dir, "enterprise.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 6. Planes de suscripción (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://punta-360.vercel.app/enterprise", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("h2")).find((h) => h.textContent?.includes("Elige tu Camino") || h.textContent?.includes("Camino"));
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else window.scrollTo({ top: 2200, behavior: "instant" });
      });
      await page.waitForTimeout(1000);
      const out = path.join(dir, "plans.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    return files;
  },
};
