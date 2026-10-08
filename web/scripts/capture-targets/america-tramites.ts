import path from "node:path";
import type { Browser, Page } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "at-site",
  async capture(browser: Browser) {
    const dir = shotsDir("america-tramites");
    const files: string[] = [];

    // 1. Hero principal (1920x1200)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 4 / 3,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://atreact.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1500);
      const out = path.join(dir, "hero.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 2. Clasificador inicial / Quiz (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://atreact.vercel.app/", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector("#quiz");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "quiz.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 3. Catálogo de trámites (1920x1200)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 4 / 3,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://atreact.vercel.app/tramites", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector("#selector");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "services-catalog.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 4. Modal con alcance y documentos requeridos (1920x1080)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://atreact.vercel.app/tramites", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      const firstCard = page.locator("#selector button[aria-haspopup='dialog']").first();
      await firstCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await firstCard.click();
      await page.waitForSelector("[role='dialog']", { state: "visible", timeout: 5000 });
      await page.waitForTimeout(1500);
      const out = path.join(dir, "service-modal.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 5. Formulario de contacto contextual (1920x1080, campos vacíos)
    {
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://atreact.vercel.app/contacto?ruta=tramites", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const form = document.querySelector("form");
        if (form) window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 100, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "contact-form.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    // 6. Roadmap profesional de 6 semanas (1920x1200)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 4 / 3,
        colorScheme: "dark",
      });
      await readOnly(context);
      const page = await context.newPage();
      await page.goto("https://atreact.vercel.app/emprender", { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
      await page.addStyleTag({ content: HIDE_FLOATING });
      await page.waitForTimeout(800);
      await page.evaluate(() => {
        const el = document.querySelector("#programa");
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "instant" });
      });
      await page.waitForTimeout(2000);
      const out = path.join(dir, "roadmap.jpg");
      await page.screenshot({ path: out, ...JPEG });
      files.push(out);
      await context.close();
    }

    return files;
  },
};
