import path from "node:path";
import type { Browser } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "rog-site",
  async capture(browser: Browser) {
    const dir = shotsDir("rangel-oviedo-group");
    const files: string[] = [];

    // 1. Hero en español (1920x1200)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 4 / 3,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://rangeloviedo-tor8.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1500);
      const out = path.join(dir, "es-hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 2. Hero en inglés (1920x1200)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 4 / 3,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://rangeloviedo-tor8.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const en = btns.find((b) => b.textContent?.trim() === "EN");
        if (en) en.click();
      });
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1500);
      const out = path.join(dir, "en-hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 3. El Método Rangel (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://rangeloviedo-tor8.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector("#metodo");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "es-metodo.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 4. Diagnóstico por perfil (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://rangeloviedo-tor8.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector("#perfiles");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "es-perfiles.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 5. Catálogo Curado de Propiedades (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://rangeloviedo-tor8.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll("section"));
        const catalog = sections.find((s) => s.textContent?.includes("Catálogo Curado"));
        if (catalog) window.scrollTo({ top: catalog.getBoundingClientRect().top + window.scrollY - 30, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "es-propiedades.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 6. Asesoría privada y agenda (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://rangeloviedo-tor8.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector("#contacto");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "es-contacto.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    return files;
  },
};
