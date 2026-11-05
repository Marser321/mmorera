#!/usr/bin/env node
/**
 * Renderiza el trailer de la fábrica de contenido y las siete muestras, y los
 * deja listos para el sitio.
 *
 * Uso, desde web/:
 *   npx tsx scripts/render-trailer.ts                                (todo: trailer en los dos formatos y muestras)
 *   npx tsx scripts/render-trailer.ts --only trailer --orientations landscape
 *   npx tsx scripts/render-trailer.ts --only muestras --muestras reel,vsl
 *   npx tsx scripts/render-trailer.ts --languages es                 (un idioma)
 *   npx tsx scripts/render-trailer.ts --stills 60,200,300            (cuadros PNG para revisar)
 *   npx tsx scripts/render-trailer.ts --frames 700-760               (un tramo, sin música)
 *
 * Pasos:
 * 1. El film de autor y los clips de las webs se vuelven secuencias de
 *    imágenes en public/render-cache/ (fuera de git): el render no decodifica video.
 * 2. La banda sonora del trailer sale de scripts/trailer-soundtrack.py (numpy),
 *    con los mismos tiempos de src/components/films/trailer/timing.json.
 * 3. Remotion renderiza sin audio en renders/; FFmpeg mezcla la música (redes).
 * 4. Versiones web livianas y pósters en public/portfolio/video-ia/.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { CONTENT_SAMPLES } from "../src/data/contentSamples";
import { CLIPS } from "../src/components/films/muestras/clips";
import { TRAILER_COPY } from "../src/components/films/trailer/copy";
import { FILM_FRAMES } from "../src/components/films/trailer/film";
import { binariesDirectory, browserExecutable as findBrowser, bundleRoot } from "./lib/remotionBundle";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "renders", "content-trailer");
const SAMPLES_OUT = path.join(ROOT, "renders", "muestras");
const WEB = path.join(ROOT, "public", "portfolio", "video-ia");
const CACHE = path.join(ROOT, "public", "render-cache");
/** Cuadro del póster del trailer: el título ya asentado («Una toma. Todas las piezas.»). */
const POSTER_FRAME = 222;
/** Cuadro del póster de cada muestra: el estilo ya reconocible. */
const SAMPLE_POSTER: Record<string, number> = { persona: 88, empresa: 40, vsl: 50, reel: 50, historia: 140, cuadrado: 40, carrusel: 75 };

type Language = "es" | "en";
type Orientation = "portrait" | "landscape";

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

const pad = (n: number) => String(n).padStart(4, "0");

/** El film de autor y los clips de las webs como secuencias JPEG a 30 fps. */
function prepareFrames() {
  const film = path.join(CACHE, "film");
  if (!existsSync(path.join(film, `${pad(FILM_FRAMES - 1)}.jpg`))) {
    mkdirSync(film, { recursive: true });
    console.log("Preparando los cuadros del film de autor…");
    ffmpeg(["-i", path.join(ROOT, "public", "profile", "author-film", "author-film-desktop.mp4"), "-vf", "fps=30", "-q:v", "2", "-start_number", "0", path.join(film, "%04d.jpg")]);
  }
  for (const [id, clip] of Object.entries(CLIPS)) {
    const dir = path.join(CACHE, "clips", id);
    if (existsSync(path.join(dir, `${pad(clip.frames - 1)}.jpg`))) continue;
    mkdirSync(dir, { recursive: true });
    console.log(`Preparando los cuadros de ${id}…`);
    ffmpeg(["-i", path.join(ROOT, "public", clip.src), "-vf", `fps=30,scale=${clip.width}:${clip.height}:flags=lanczos`, "-frames:v", String(clip.frames), "-q:v", "3", "-start_number", "0", path.join(dir, "%04d.jpg")]);
    if (!existsSync(path.join(dir, `${pad(clip.frames - 1)}.jpg`))) throw new Error(`${id}: el clip tiene menos de ${clip.frames} cuadros`);
  }
}

/** Tamaño web: el lado corto a 720 px (múltiplos de 2). */
function webSize(width: number, height: number) {
  const scale = 720 / Math.min(width, height);
  return { width: Math.round((width * scale) / 2) * 2, height: Math.round((height * scale) / 2) * 2 };
}

async function main() {
  const only = option("only") ?? "all";
  const languages = (option("languages") ?? "es,en").split(",") as Language[];
  const orientations = (option("orientations") ?? "portrait,landscape").split(",") as Orientation[];
  const pick = option("muestras")?.split(",");
  const stills = option("stills")?.split(",").map(Number);
  const frames = option("frames")?.split("-").map(Number) as [number, number] | undefined;
  mkdirSync(OUT, { recursive: true });
  mkdirSync(SAMPLES_OUT, { recursive: true });
  prepareFrames();

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  console.log("Empaquetando la raíz del trailer…");
  const serveUrl = await bundleRoot("src/remotion/trailerRoot.tsx");
  const concurrency = Math.max(1, Math.min(4, os.cpus().length - 2));

  async function render(id: string, inputProps: Record<string, unknown>, silent: string) {
    const composition = await selectComposition({ serveUrl, id, inputProps, binariesDirectory: binaries, browserExecutable });
    if (stills) {
      for (const frame of stills) {
        if (frame >= composition.durationInFrames) continue;
        const output = path.join(path.dirname(silent), "stills", `${id}-${pad(frame)}.png`);
        mkdirSync(path.dirname(output), { recursive: true });
        await renderStill({ composition, serveUrl, frame, output, inputProps, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
        console.log(path.relative(ROOT, output));
      }
      return null;
    }
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
      concurrency,
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
    return composition;
  }

  if (only === "all" || only === "trailer") {
    for (const orientation of orientations) {
      for (const language of languages) {
        const suffix = orientation === "landscape" ? "-16x9" : "";
        const id = `content-trailer-${language}${suffix}`;
        const silent = path.join(OUT, `${id}${frames ? `-${frames[0]}-${frames[1]}` : ""}-silent.mp4`);
        const composition = await render(id, { language }, silent);
        if (!composition || frames) continue;

        // La música, con el tecleo del pedido de este idioma (una letra, un clic).
        const soundtrack = path.join(OUT, `soundtrack-${language}.wav`);
        if (orientation === orientations[0]) execFileSync("python", ["-I", path.join(ROOT, "scripts", "trailer-soundtrack.py"), soundtrack, "--chars", String(TRAILER_COPY[language].prompt.length)], { stdio: "inherit" });

        // Para redes: tamaño completo con la música. El cuadro 0 es el póster (como en
        // brag): reemplaza un cuadro, no agrega, así que la duración no cambia.
        const social = path.join(OUT, `${id}.mp4`);
        const posterPng = path.join(OUT, `${id}-poster.png`);
        ffmpeg(["-ss", (POSTER_FRAME / 30).toFixed(3), "-i", silent, "-frames:v", "1", posterPng]);
        ffmpeg([
          "-i", silent, "-i", posterPng, "-i", soundtrack,
          "-filter_complex", "[0:v][1:v]overlay=enable='eq(n,0)'[v]",
          "-map", "[v]", "-map", "2:a", "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-pix_fmt", "yuv420p",
          "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", social,
        ]);
        console.log(path.relative(ROOT, social));

        // Para el sitio: 720 px de lado corto, liviano, con la música (el home lo reproduce mudo).
        mkdirSync(WEB, { recursive: true });
        const size = webSize(composition.width, composition.height);
        const web = path.join(WEB, `fabrica-trailer-${language}${suffix}.mp4`);
        ffmpeg(["-i", silent, "-i", soundtrack, "-map", "0:v", "-map", "1:a", "-vf", `scale=${size.width}:${size.height}:flags=lanczos`, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-profile:v", "high", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", web]);
        const poster = path.join(WEB, `fabrica-trailer-${language}${suffix}-poster.webp`);
        ffmpeg(["-i", posterPng, "-vf", `scale=${size.width}:${size.height}:flags=lanczos`, "-c:v", "libwebp", "-quality", "82", poster]);
        console.log(`${path.relative(ROOT, web)} · ${path.relative(ROOT, poster)}`);
      }
    }
  }

  if (only === "all" || only === "muestras") {
    const samples = CONTENT_SAMPLES.filter((sample) => !pick || pick.includes(sample.id));
    for (const sample of samples) {
      for (const language of languages) {
        const id = `muestra-${sample.id}-${language}`;
        const silent = path.join(SAMPLES_OUT, `${sample.id}-${language}${frames ? `-${frames[0]}-${frames[1]}` : ""}.mp4`);
        const composition = await render(id, { id: sample.id, language }, silent);
        if (!composition || frames) continue;

        // Para el sitio: un bucle mudo, liviano, y su póster.
        const dir = path.join(WEB, "muestras");
        mkdirSync(dir, { recursive: true });
        const size = webSize(composition.width, composition.height);
        const web = path.join(dir, `${sample.id}-${language}.mp4`);
        ffmpeg(["-i", silent, "-an", "-vf", `scale=${size.width}:${size.height}:flags=lanczos`, "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", web]);
        const poster = path.join(dir, `${sample.id}-${language}-poster.webp`);
        ffmpeg(["-ss", ((SAMPLE_POSTER[sample.id] ?? 60) / 30).toFixed(3), "-i", silent, "-frames:v", "1", "-vf", `scale=${size.width}:${size.height}:flags=lanczos`, "-c:v", "libwebp", "-quality", "80", poster]);
        console.log(`${path.relative(ROOT, web)} · ${path.relative(ROOT, poster)}`);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
