#!/usr/bin/env node
/**
 * Renderiza el trailer de la fábrica de contenido y lo deja listo para el sitio.
 *
 * Uso, desde web/:
 *   npx tsx scripts/render-trailer.ts                      (es y en, con música, y la versión web)
 *   npx tsx scripts/render-trailer.ts --languages es       (un idioma)
 *   npx tsx scripts/render-trailer.ts --stills 60,200,300  (cuadros PNG para revisar)
 *   npx tsx scripts/render-trailer.ts --frames 700-760     (un tramo, sin música)
 *
 * Pasos:
 * 1. La banda sonora sale de scripts/trailer-soundtrack.py (numpy), con los
 *    mismos tiempos de src/components/films/trailer/timing.json.
 * 2. Remotion renderiza 1080×1920 sin audio en renders/content-trailer/.
 * 3. FFmpeg mezcla la música: content-trailer-<idioma>.mp4 (para redes).
 * 4. Versión web 720×1280 y póster en public/portfolio/video-ia/.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { TRAILER_COPY } from "../src/components/films/trailer/copy";
import { FILM_FRAMES } from "../src/components/films/trailer/film";
import { binariesDirectory, browserExecutable as findBrowser, bundleRoot } from "./lib/remotionBundle";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "renders", "content-trailer");
const WEB = path.join(ROOT, "public", "portfolio", "video-ia");
/** Cuadro del póster: el título ya asentado («Una toma. Todas las piezas.»). */
const POSTER_FRAME = 222;

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

async function main() {
  const languages = (option("languages") ?? "es,en").split(",") as Array<"es" | "en">;
  const stills = option("stills")?.split(",").map(Number);
  const frames = option("frames")?.split("-").map(Number) as [number, number] | undefined;
  mkdirSync(OUT, { recursive: true });

  // El film de autor como secuencia de imágenes a 30 fps (un JPEG por cuadro):
  // el trailer muestra cada cuadro como imagen y el render no decodifica video.
  const film = path.join(ROOT, "public", "render-cache", "film");
  if (!existsSync(path.join(film, `${String(FILM_FRAMES - 1).padStart(4, "0")}.jpg`))) {
    mkdirSync(film, { recursive: true });
    console.log("Preparando los cuadros del film de autor…");
    ffmpeg(["-i", path.join(ROOT, "public", "profile", "author-film", "author-film-desktop.mp4"), "-vf", "fps=30", "-q:v", "2", "-start_number", "0", path.join(film, "%04d.jpg")]);
  }

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  console.log("Empaquetando la raíz del trailer…");
  const serveUrl = await bundleRoot("src/remotion/trailerRoot.tsx");

  for (const language of languages) {
    const id = `content-trailer-${language}`;
    const inputProps = { language };
    const composition = await selectComposition({ serveUrl, id, inputProps, binariesDirectory: binaries, browserExecutable });

    if (stills) {
      for (const frame of stills) {
        const output = path.join(OUT, "stills", `${id}-${String(frame).padStart(4, "0")}.png`);
        mkdirSync(path.dirname(output), { recursive: true });
        await renderStill({ composition, serveUrl, frame, output, inputProps, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
        console.log(path.relative(ROOT, output));
      }
      continue;
    }

    const silent = path.join(OUT, `${id}${frames ? `-${frames[0]}-${frames[1]}` : ""}-silent.mp4`);
    const started = Date.now();
    let last = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      crf: 16,
      pixelFormat: "yuv420p",
      outputLocation: silent,
      inputProps,
      frameRange: frames ?? null,
      muted: true,
      binariesDirectory: binaries,
      browserExecutable,
      concurrency: Math.max(1, Math.min(4, os.cpus().length - 2)),
      timeoutInMilliseconds: 120_000,
      onProgress: ({ progress }) => {
        const step = Math.floor(progress * 20);
        if (step !== last) {
          last = step;
          process.stdout.write(`\r${id}: ${Math.round(progress * 100)}%   `);
        }
      },
    });
    console.log(`\n${id}: ${path.relative(ROOT, silent)} (${Math.round((Date.now() - started) / 1000)} s)`);
    if (frames) continue;

    // La música, con el tecleo del pedido de este idioma (una letra, un clic).
    const soundtrack = path.join(OUT, `soundtrack-${language}.wav`);
    execFileSync("python", ["-I", path.join(ROOT, "scripts", "trailer-soundtrack.py"), soundtrack, "--chars", String(TRAILER_COPY[language].prompt.length)], { stdio: "inherit" });

    // Para redes: 1080×1920 con la música.
    const social = path.join(OUT, `${id}.mp4`);
    // El cuadro 0 es el póster (el título asentado), como en brag: así la miniatura
    // de cada red lo muestra. Reemplaza un cuadro, no agrega: la duración no cambia.
    const posterPng = path.join(OUT, `${id}-poster.png`);
    ffmpeg(["-ss", (POSTER_FRAME / 30).toFixed(3), "-i", silent, "-frames:v", "1", posterPng]);
    ffmpeg([
      "-i", silent, "-i", posterPng, "-i", soundtrack,
      "-filter_complex", "[0:v][1:v]overlay=enable='eq(n,0)'[v]",
      "-map", "[v]", "-map", "2:a", "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", social,
    ]);
    console.log(path.relative(ROOT, social));

    // Para el sitio: 720×1280, liviano, con la música (el home lo reproduce mudo).
    if (!existsSync(WEB)) mkdirSync(WEB, { recursive: true });
    const web = path.join(WEB, `fabrica-trailer-${language}.mp4`);
    ffmpeg(["-i", silent, "-i", soundtrack, "-map", "0:v", "-map", "1:a", "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-profile:v", "high", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", web]);
    const poster = path.join(WEB, `fabrica-trailer-${language}-poster.webp`);
    ffmpeg(["-i", posterPng, "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libwebp", "-quality", "82", poster]);
    console.log(`${path.relative(ROOT, web)} · ${path.relative(ROOT, poster)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
