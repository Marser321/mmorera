#!/usr/bin/env node
/**
 * Renderiza el tráiler y el reel de Vespera (la demo de agencia de viajes) y
 * los deja listos para el sitio.
 *
 * Uso, desde web/ (con ffmpeg y libsvtav1 en el PATH):
 *   npx tsx scripts/render-vespera.ts                      (tráiler y reel)
 *   npx tsx scripts/render-vespera.ts --only reel          (uno solo)
 *   npx tsx scripts/render-vespera.ts --stills 40,120,300  (cuadros JPEG para revisar)
 *
 * Pasos:
 * 1. Los clips de film-sources/vespera/ se vuelven secuencias JPEG en
 *    public/render-cache/vespera/ (fuera de git): el render no decodifica video.
 * 2. Remotion renderiza en renders/vespera/ con esa carpeta como única carpeta
 *    pública (el paquete pesa poco y se borra al terminar).
 * 3. FFmpeg deja H.264, AV1 y el póster: el tráiler en public/portfolio/trailers/
 *    y el reel en public/portfolio/reels/, como los demás casos.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { CLIP_FRAMES, CLIP_IDS, REEL_FRAMES, REEL_POSTER, TRAILER_FRAMES, TRAILER_POSTER } from "../src/components/films/vespera/timing";
import { binariesDirectory, browserExecutable as findBrowser } from "./lib/remotionBundle";

const ROOT = process.cwd();
const SOURCES = path.join(ROOT, "film-sources", "vespera");
const CACHE = path.join(ROOT, "public", "render-cache", "vespera");
const OUT = path.join(ROOT, "renders", "vespera");

const PIECES = {
  trailer: { id: "vespera-trailer", frames: TRAILER_FRAMES, poster: TRAILER_POSTER, web: path.join(ROOT, "public", "portfolio", "trailers"), crf: { h264: 28, av1: 38 } },
  reel: { id: "vespera-reel", frames: REEL_FRAMES, poster: REEL_POSTER, web: path.join(ROOT, "public", "portfolio", "reels"), crf: { h264: 28, av1: 40 } },
} as const;
type PieceId = keyof typeof PIECES;

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

const pad = (n: number) => String(n).padStart(4, "0");

/** Cada clip como secuencia JPEG, más el avión cenital y las fuentes. */
function prepareFrames() {
  for (const clip of CLIP_IDS) {
    const dir = path.join(CACHE, clip);
    if (!existsSync(path.join(dir, `${pad(CLIP_FRAMES - 1)}.jpg`))) {
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });
      console.log(`Preparando los cuadros de ${clip}…`);
      ffmpeg(["-i", path.join(SOURCES, `${clip}.mp4`), "-q:v", "2", "-start_number", "0", path.join(dir, "%04d.jpg")]);
    }
    const count = readdirSync(dir).filter((file) => file.endsWith(".jpg")).length;
    if (count !== CLIP_FRAMES) throw new Error(`${clip}: el clip tiene ${count} cuadros y timing.ts espera ${CLIP_FRAMES}`);
  }
  copyFileSync(path.join(SOURCES, "plane-top.webp"), path.join(CACHE, "plane-top.webp"));
  cpSync(path.join(SOURCES, "fonts"), path.join(CACHE, "fonts"), { recursive: true });
}

async function main() {
  const pieces = (option("only")?.split(",") ?? Object.keys(PIECES)) as PieceId[];
  const stills = option("stills")?.split(",").map(Number);
  mkdirSync(OUT, { recursive: true });
  prepareFrames();

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  console.log("Empaquetando la raíz de Vespera…");
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/remotion/vesperaRoot.tsx"),
    publicDir: CACHE,
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(ROOT, "src") } } }),
  });
  const concurrency = Math.max(1, Math.min(4, os.cpus().length - 2));

  try {
    for (const name of pieces) {
      const piece = PIECES[name];
      const composition = await selectComposition({ serveUrl, id: piece.id, binariesDirectory: binaries, browserExecutable });
      if (composition.durationInFrames !== piece.frames) throw new Error(`${piece.id}: la composición no mide lo que dice timing.ts`);

      if (stills) {
        for (const frame of stills) {
          if (frame >= composition.durationInFrames) continue;
          const output = path.join(OUT, "stills", `${name}-${pad(frame)}.jpg`);
          mkdirSync(path.dirname(output), { recursive: true });
          await renderStill({ composition, serveUrl, frame, output, imageFormat: "jpeg", jpegQuality: 88, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
          console.log(path.relative(ROOT, output));
        }
        continue;
      }

      const master = path.join(OUT, `${name}.mp4`);
      const started = Date.now();
      await renderMedia({ composition, serveUrl, codec: "h264", crf: 12, pixelFormat: "yuv420p", outputLocation: master, muted: true, binariesDirectory: binaries, browserExecutable, concurrency, timeoutInMilliseconds: 120_000 });
      console.log(`${piece.id}: ${path.relative(ROOT, master)} (${Math.round((Date.now() - started) / 1000)} s)`);

      // Versiones del sitio: AV1 primero (liviano) y H.264 de respaldo, a los 24 cuadros de origen.
      mkdirSync(piece.web, { recursive: true });
      const web = path.join(piece.web, "vespera");
      ffmpeg(["-i", master, "-c:v", "libx264", "-crf", String(piece.crf.h264), "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", `${web}.mp4`]);
      ffmpeg(["-i", master, "-c:v", "libsvtav1", "-crf", String(piece.crf.av1), "-preset", "6", "-pix_fmt", "yuv420p", "-an", `${web}.webm`]);
      ffmpeg(["-i", master, "-vf", `select=eq(n\\,${piece.poster})`, "-frames:v", "1", "-q:v", "3", `${web}-poster.jpg`]);
    }
  } finally {
    // bundle() deja el paquete en %TEMP%: sin esto el disco se llena.
    rmSync(serveUrl, { recursive: true, force: true });
  }
}

void main();
