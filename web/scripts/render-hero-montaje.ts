#!/usr/bin/env node
/**
 * Renderiza el montaje del hero «El equipo» con sus cuadros de partida
 * (docs/films/HERO-EQUIPO.md) y deja los archivos que usa la página de prueba.
 *
 * Uso, desde web/ (con ffmpeg y libsvtav1 en el PATH):
 *   npx tsx scripts/render-hero-montaje.ts                  (ancho y alto)
 *   npx tsx scripts/render-hero-montaje.ts --only alto
 *   npx tsx scripts/render-hero-montaje.ts --stills 0,100   (cuadros JPEG para revisar)
 *
 * 1. Copia los cuadros de film-sources/hero/ a public/render-cache/hero-montaje/
 *    (fuera de git) y pasa cada clip de film-sources/hero/clips/ a secuencia de
 *    cuadros: el paquete de Remotion lleva solo esos archivos.
 * 2. Remotion renderiza un máster por formato en renders/hero/.
 * 3. FFmpeg deja H.264, AV1 y los pósters en public/portfolio/hero/.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { clipFolder, montageClips, montageFiles, montageFrames, MONTAGE, shotStarts, type MontageId } from "../src/components/films/hero/montaje";
import { binariesDirectory, browserExecutable as findBrowser } from "./lib/remotionBundle";

const ROOT = process.cwd();
const SOURCES = path.join(ROOT, "film-sources", "hero");
const CACHE = path.join(ROOT, "public", "render-cache", "hero-montaje");
const OUT = path.join(ROOT, "renders", "hero");
const WEB = path.join(ROOT, "public", "portfolio", "hero");

/** Calidad de los archivos del sitio: son cuadros quietos con poco movimiento, comprimen bien. */
const WEB_CRF = { h264: 27, av1: 38 } as const;
/** El póster de movimiento reducido es el plano que más cuenta: la discusión. */
const STORY_SHOT = "discuten";

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

async function main() {
  const only = option("only") as MontageId | undefined;
  const ids: MontageId[] = only ? [only] : ["ancho", "alto"];
  const stills = option("stills")?.split(",").map(Number);

  const missing = montageFiles().filter((file) => !existsSync(path.join(SOURCES, file)));
  if (missing.length > 0) throw new Error(`Faltan cuadros en film-sources/hero/: ${missing.join(", ")}`);

  rmSync(CACHE, { recursive: true, force: true });
  mkdirSync(CACHE, { recursive: true });
  for (const file of montageFiles()) copyFileSync(path.join(SOURCES, file), path.join(CACHE, file));
  // Los clips animados entran como secuencia de cuadros a 24 por segundo: el render no decodifica video.
  for (const clip of montageClips()) {
    const source = path.join(SOURCES, "clips", clip.file);
    if (!existsSync(source)) throw new Error(`Falta el clip film-sources/hero/clips/${clip.file}`);
    const dir = path.join(CACHE, clipFolder(clip.file));
    mkdirSync(dir, { recursive: true });
    ffmpeg(["-i", source, "-vf", "fps=24,scale=1920:1080:flags=lanczos", "-q:v", "2", "-start_number", "0", path.join(dir, "%04d.jpg")]);
    const count = readdirSync(dir).filter((file) => file.endsWith(".jpg")).length;
    if (count < clip.frames) throw new Error(`${clip.file}: tiene ${count} cuadros y el montaje usa ${clip.frames}`);
  }
  mkdirSync(OUT, { recursive: true });
  mkdirSync(WEB, { recursive: true });

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/remotion/heroRoot.tsx"),
    publicDir: CACHE,
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(ROOT, "src") } } }),
  });

  try {
    for (const id of ids) {
      const composition = await selectComposition({ serveUrl, id: `hero-montaje-${id}`, inputProps: { id }, binariesDirectory: binaries, browserExecutable });
      if (composition.durationInFrames !== montageFrames(id)) throw new Error(`${id}: la composición no mide lo que dice montaje.ts`);

      if (stills) {
        for (const frame of stills) {
          if (frame >= composition.durationInFrames) continue;
          const output = path.join(OUT, "stills", `montaje-${id}-${String(frame).padStart(4, "0")}.jpg`);
          mkdirSync(path.dirname(output), { recursive: true });
          await renderStill({ composition, serveUrl, frame, output, inputProps: { id }, imageFormat: "jpeg", jpegQuality: 88, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
          console.log(path.relative(ROOT, output));
        }
        continue;
      }

      const master = path.join(OUT, `hero-montaje-${id}.mp4`);
      const started = Date.now();
      await renderMedia({ composition, serveUrl, codec: "h264", crf: 16, pixelFormat: "yuv420p", outputLocation: master, inputProps: { id }, muted: true, binariesDirectory: binaries, browserExecutable, concurrency: Math.max(1, Math.min(4, os.cpus().length - 2)), timeoutInMilliseconds: 120_000 });
      console.log(`${path.relative(ROOT, master)} (${Math.round((Date.now() - started) / 1000)} s)`);

      const name = `equipo-${id}`;
      ffmpeg(["-i", master, "-c:v", "libx264", "-crf", String(WEB_CRF.h264), "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path.join(WEB, `${name}.mp4`)]);
      ffmpeg(["-i", master, "-c:v", "libsvtav1", "-crf", String(WEB_CRF.av1), "-preset", "6", "-pix_fmt", "yuv420p", "-an", path.join(WEB, `${name}.webm`)]);
      // Póster de arranque: el primer cuadro, para que el video empiece sin salto.
      ffmpeg(["-i", master, "-vf", "select=eq(n\\,0)", "-frames:v", "1", "-q:v", "3", path.join(WEB, `${name}-poster.jpg`)]);
      // Póster de movimiento reducido: el plano que cuenta la historia.
      const story = shotStarts(id)[MONTAGE[id].findIndex((shot) => shot.id === STORY_SHOT)] ?? 0;
      ffmpeg(["-i", master, "-vf", `select=eq(n\\,${story + 24})`, "-frames:v", "1", "-q:v", "3", path.join(WEB, `${name}-quieto.jpg`)]);
      console.log(`public/portfolio/hero/${name}.{mp4,webm} y sus pósters`);
    }
  } finally {
    // bundle() deja el paquete en %TEMP%: sin esto el disco se llena.
    rmSync(serveUrl, { recursive: true, force: true });
  }
}

void main();
