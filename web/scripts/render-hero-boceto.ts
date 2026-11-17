#!/usr/bin/env node
/**
 * Renderiza el boceto animado del hero «El equipo» (docs/films/HERO-EQUIPO.md).
 * Es material de revisión: queda en renders/hero/, fuera de git y del sitio.
 *
 * Uso, desde web/ (con ffmpeg en el PATH):
 *   npx tsx scripts/render-hero-boceto.ts                    (el boceto con rótulos)
 *   npx tsx scripts/render-hero-boceto.ts --limpio           (sin rótulos)
 *   npx tsx scripts/render-hero-boceto.ts --stills 20,150    (cuadros JPEG para revisar)
 */
import { mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { HERO_FRAMES } from "../src/components/films/hero/timing";
import { binariesDirectory, browserExecutable as findBrowser } from "./lib/remotionBundle";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "renders", "hero");
/** El boceto no usa archivos: una carpeta pública vacía deja el paquete liviano. */
const EMPTY_PUBLIC = path.join(ROOT, "public", "render-cache", "hero-vacio");

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const id = process.argv.includes("--limpio") ? "hero-boceto-limpio" : "hero-boceto";
  const stills = option("stills")?.split(",").map(Number);
  mkdirSync(OUT, { recursive: true });
  mkdirSync(EMPTY_PUBLIC, { recursive: true });

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/remotion/heroRoot.tsx"),
    publicDir: EMPTY_PUBLIC,
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(ROOT, "src") } } }),
  });

  try {
    const composition = await selectComposition({ serveUrl, id, binariesDirectory: binaries, browserExecutable });
    if (composition.durationInFrames !== HERO_FRAMES) throw new Error(`${id}: la composición no mide lo que dice timing.ts`);
    if (stills) {
      for (const frame of stills) {
        if (frame >= composition.durationInFrames) continue;
        const output = path.join(OUT, "stills", `${id}-${String(frame).padStart(4, "0")}.jpg`);
        mkdirSync(path.dirname(output), { recursive: true });
        await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 86, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
        console.log(path.relative(ROOT, output));
      }
      return;
    }
    const output = path.join(OUT, `${id}.mp4`);
    const started = Date.now();
    await renderMedia({ composition, serveUrl, codec: "h264", crf: 20, pixelFormat: "yuv420p", outputLocation: output, muted: true, binariesDirectory: binaries, browserExecutable, concurrency: Math.max(1, Math.min(4, os.cpus().length - 2)), timeoutInMilliseconds: 120_000 });
    console.log(`${path.relative(ROOT, output)} (${Math.round((Date.now() - started) / 1000)} s)`);
  } finally {
    // bundle() deja el paquete en %TEMP%: sin esto el disco se llena.
    rmSync(serveUrl, { recursive: true, force: true });
  }
}

void main();
