#!/usr/bin/env node
/**
 * Graba un reel corto de cada caso a partir del sitio EN VIVO (nada de mockups):
 * scroll suave cuadro a cuadro con Playwright → WebM (AV1) + MP4 (H.264) + póster,
 * más capturas desktop/mobile para la galería del caso. Escribe el manifiesto
 * `src/data/caseMedia.generated.json`, que el sitio lee sin tocar projectCases.
 *
 * Uso:
 *   npx tsx scripts/capture-case-reels.ts            # casos destacados
 *   npx tsx scripts/capture-case-reels.ts --all      # todos los casos con liveUrl
 *   npx tsx scripts/capture-case-reels.ts lb-elite-wash-detail   # uno puntual
 *
 * Requiere ffmpeg en el PATH y el Chromium de Playwright instalado.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium, type Page } from "playwright";
import { PROJECT_CASES } from "../src/data/projectCases";

const ROOT = process.cwd();
const REELS_DIR = path.join(ROOT, "public/portfolio/reels");
const SHOTS_DIR = path.join(ROOT, "public/portfolio/shots");
const MANIFEST = path.join(ROOT, "src/data/caseMedia.generated.json");

const FPS = 30;
const HOLD_FRAMES = 36; // ~1.2 s quieto en el hero para que se lean sus animaciones
const SCROLL_FRAMES = 150; // ~5 s de recorrido
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

type Manifest = Record<
  string,
  {
    reel: { mp4: string; webm: string; poster: string };
    gallery: { src: string; device: "desktop" | "mobile" }[];
    capturedAt: string;
  }
>;

const args = process.argv.slice(2);
const all = args.includes("--all");
const only = args.filter((arg) => !arg.startsWith("--"));
const targets = PROJECT_CASES.filter((project) => {
  if (!project.liveUrl) return false;
  if (only.length) return only.includes(project.slug);
  return all || project.status === "featured";
});

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

async function settle(page: Page) {
  // Dos frames de pintura para que el scroll y las animaciones se asienten.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

// Popups de bienvenida/cookies tapan el sitio y bloquean el scroll del reel.
async function dismissOverlays(page: Page) {
  await page.keyboard.press("Escape").catch(() => {});
  const closer = page
    .locator('button[aria-label*="cerrar" i], button[aria-label*="close" i], [role="dialog"] button:has-text("Cerrar"), [role="dialog"] button:has-text("Close")')
    .filter({ visible: true });
  if (await closer.count()) await closer.first().click({ timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(800);
}

async function open(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => page.waitForLoadState("load"));
  await page.waitForTimeout(2500);
  await dismissOverlays(page);
}

function ffmpeg(argsList: string[]) {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...argsList], { stdio: "inherit" });
}

async function captureReel(page: Page, slug: string) {
  const frames = path.join(tmpdir(), `reel-${slug}`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });

  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const distance = Math.min(maxScroll, DESKTOP.height * 3.2);
  let index = 0;
  const shoot = async () => {
    await settle(page);
    await page.screenshot({ path: path.join(frames, `f${String(index++).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
  };

  for (let i = 0; i < HOLD_FRAMES; i++) await shoot();
  for (let i = 1; i <= SCROLL_FRAMES; i++) {
    const y = Math.round(easeInOut(i / SCROLL_FRAMES) * distance);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" as ScrollBehavior }), y);
    await shoot();
  }

  const input = ["-framerate", String(FPS), "-i", path.join(frames, "f%04d.jpg")];
  const scale = ["-vf", "scale=1280:-2:flags=lanczos"];
  // AV1/WebM (liviano) como fuente principal y H.264/MP4 como respaldo universal.
  ffmpeg([...input, ...scale, "-c:v", "libsvtav1", "-crf", "40", "-preset", "6", "-pix_fmt", "yuv420p", "-an", path.join(REELS_DIR, `${slug}.webm`)]);
  ffmpeg([...input, ...scale, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "27", "-preset", "slow", "-movflags", "+faststart", "-an", path.join(REELS_DIR, `${slug}.mp4`)]);
  ffmpeg(["-i", path.join(frames, "f0000.jpg"), "-vf", "scale=1280:-2:flags=lanczos", "-q:v", "3", path.join(REELS_DIR, `${slug}-poster.jpg`)]);
  rmSync(frames, { recursive: true, force: true });
}

async function captureGallery(page: Page, slug: string, device: "desktop" | "mobile", positions: number[]) {
  const shots: { src: string; device: "desktop" | "mobile" }[] = [];
  const viewportHeight = device === "desktop" ? DESKTOP.height : MOBILE.height;
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  for (const [i, factor] of positions.entries()) {
    const top = Math.min(maxScroll, Math.round(factor * viewportHeight));
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }), top);
    await page.waitForTimeout(900);
    const file = `${slug}-${device}-${i + 1}.jpg`;
    await page.screenshot({ path: path.join(SHOTS_DIR, file), type: "jpeg", quality: 84 });
    shots.push({ src: `/portfolio/shots/${file}`, device });
  }
  return shots;
}

async function main() {
  if (targets.length === 0) {
    console.error("No hay casos que coincidan.");
    process.exit(1);
  }
  mkdirSync(REELS_DIR, { recursive: true });
  mkdirSync(SHOTS_DIR, { recursive: true });
  const manifest: Manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

  const browser = await chromium.launch();
  try {
    for (const project of targets) {
      const url = project.liveUrl!;
      console.log(`▶ ${project.slug}  ${url}`);
      try {
        const desktop = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1, reducedMotion: "no-preference" });
        const page = await desktop.newPage();
        await open(page, url);
        await captureReel(page, project.slug);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
        const desktopShots = await captureGallery(page, project.slug, "desktop", [0, 1.1, 2.2]);
        await desktop.close();

        const mobile = await browser.newContext({ viewport: MOBILE, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        const mobilePage = await mobile.newPage();
        await open(mobilePage, url);
        const mobileShots = await captureGallery(mobilePage, project.slug, "mobile", [0, 1.2]);
        await mobile.close();

        manifest[project.slug] = {
          reel: {
            mp4: `/portfolio/reels/${project.slug}.mp4`,
            webm: `/portfolio/reels/${project.slug}.webm`,
            poster: `/portfolio/reels/${project.slug}-poster.jpg`,
          },
          gallery: [...desktopShots, ...mobileShots],
          capturedAt: new Date().toISOString().slice(0, 10),
        };
        writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
        console.log(`  ✓ reel + ${desktopShots.length + mobileShots.length} capturas`);
      } catch (error) {
        console.error(`  ✗ ${project.slug}:`, error instanceof Error ? error.message : error);
      }
    }
  } finally {
    await browser.close();
  }
}

void main();
