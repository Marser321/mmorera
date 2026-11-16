#!/usr/bin/env node
/**
 * Renderiza los films de las puertas de servicio del home (escena 02) y los
 * deja listos para el sitio.
 *
 * Uso, desde web/ (con ffmpeg y libsvtav1 en el PATH):
 *   npx tsx scripts/render-doors.ts                       (las cuatro puertas, es y en)
 *   npx tsx scripts/render-doors.ts --only agentes        (una puerta)
 *   npx tsx scripts/render-doors.ts --languages es        (un idioma)
 *   npx tsx scripts/render-doors.ts --stills 30,110,170   (cuadros PNG para revisar)
 *
 * Pasos:
 * 1. Los planos de film-sources/puertas/ se vuelven secuencias JPEG en
 *    public/render-cache/puertas/ (fuera de git): el render no decodifica video.
 * 2. Remotion renderiza en renders/puertas/ con esa carpeta como única carpeta
 *    pública (el paquete pesa poco y se borra al terminar).
 * 3. FFmpeg deja H.264, AV1 y el póster en public/portfolio/puertas/.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { DOORS, DOOR_IDS, WEBS_UI, doorFrames, type DoorId } from "../src/components/films/puertas/timing";
import { binariesDirectory, browserExecutable as findBrowser } from "./lib/remotionBundle";

const ROOT = process.cwd();
const SOURCES = path.join(ROOT, "film-sources", "puertas");
const CACHE = path.join(ROOT, "public", "render-cache", "puertas");
const OUT = path.join(ROOT, "renders", "puertas");
const WEB = path.join(ROOT, "public", "portfolio", "puertas");

type Language = "es" | "en";

/** El agua del lavado cuesta mucho de comprimir: esa puerta va con más compresión. */
const WEB_CRF: Record<DoorId, { h264: number; av1: number }> = {
  webs: { h264: 28, av1: 42 },
  agentes: { h264: 24, av1: 34 },
  sistemas: { h264: 24, av1: 34 },
  contenido: { h264: 24, av1: 34 },
};

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

const pad = (n: number) => String(n).padStart(4, "0");

/** Cada plano como secuencia JPEG, con la cantidad de cuadros que espera timing.ts. */
function prepareFrames(doors: DoorId[]) {
  for (const door of doors) {
    DOORS[door].shots.forEach((shot, index) => {
      const dir = path.join(CACHE, `${door}-${index}`);
      if (!existsSync(path.join(dir, `${pad(shot.frames - 1)}.jpg`))) {
        rmSync(dir, { recursive: true, force: true });
        mkdirSync(dir, { recursive: true });
        console.log(`Preparando los cuadros de ${door}-${index}…`);
        ffmpeg(["-i", path.join(SOURCES, `${door}-${index}.mp4`), "-q:v", "2", "-start_number", "0", path.join(dir, "%04d.jpg")]);
      }
      const count = readdirSync(dir).filter((file) => file.endsWith(".jpg")).length;
      if (count !== shot.frames) throw new Error(`${door}-${index}: el clip tiene ${count} cuadros y timing.ts espera ${shot.frames}`);
    });
  }
  // Las capturas de la web del caso que se ven en la ventana de la puerta de webs.
  mkdirSync(path.join(CACHE, "webs-ui"), { recursive: true });
  for (const file of WEBS_UI) copyFileSync(path.join(SOURCES, file), path.join(CACHE, "webs-ui", file));
}

async function main() {
  const doors = (option("only")?.split(",") ?? [...DOOR_IDS]) as DoorId[];
  const languages = (option("languages") ?? "es,en").split(",") as Language[];
  const stills = option("stills")?.split(",").map(Number);
  mkdirSync(OUT, { recursive: true });
  mkdirSync(WEB, { recursive: true });
  prepareFrames(doors);

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  console.log("Empaquetando la raíz de las puertas…");
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/remotion/doorsRoot.tsx"),
    publicDir: CACHE,
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(ROOT, "src") } } }),
  });
  const concurrency = Math.max(1, Math.min(4, os.cpus().length - 2));

  try {
    for (const door of doors) {
      const spec = DOORS[door];
      for (const language of spec.bilingual ? languages : (["es"] as Language[])) {
        const id = spec.bilingual ? `puerta-${door}-${language}` : `puerta-${door}`;
        const name = spec.bilingual ? `${door}-${language}` : door;
        const inputProps = { door, language };
        const composition = await selectComposition({ serveUrl, id, inputProps, binariesDirectory: binaries, browserExecutable });
        if (composition.durationInFrames !== doorFrames(door)) throw new Error(`${id}: la composición no mide lo que dice timing.ts`);

        if (stills) {
          for (const frame of stills) {
            if (frame >= composition.durationInFrames) continue;
            const output = path.join(OUT, "stills", `${name}-${pad(frame)}.png`);
            mkdirSync(path.dirname(output), { recursive: true });
            await renderStill({ composition, serveUrl, frame, output, inputProps, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
            console.log(path.relative(ROOT, output));
          }
          continue;
        }

        const master = path.join(OUT, `${name}.mp4`);
        const started = Date.now();
        await renderMedia({
          composition,
          serveUrl,
          codec: "h264",
          crf: 12,
          pixelFormat: "yuv420p",
          outputLocation: master,
          inputProps,
          muted: true,
          binariesDirectory: binaries,
          browserExecutable,
          concurrency,
          timeoutInMilliseconds: 120_000,
        });
        console.log(`${id}: ${path.relative(ROOT, master)} (${Math.round((Date.now() - started) / 1000)} s)`);

        // Versiones del sitio: AV1 primero (liviano) y H.264 de respaldo, como los reels de los casos.
        // 1184×888: entra en el nivel 3.1 de AV1, el que declara CaseReel en su <source>.
        const web = ["-vf", "scale=1184:888:flags=lanczos"];
        ffmpeg(["-i", master, ...web, "-c:v", "libx264", "-crf", String(WEB_CRF[door].h264), "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path.join(WEB, `${name}.mp4`)]);
        ffmpeg(["-i", master, ...web, "-c:v", "libsvtav1", "-crf", String(WEB_CRF[door].av1), "-preset", "6", "-pix_fmt", "yuv420p", "-an", path.join(WEB, `${name}.webm`)]);
        // El póster es cine puro (antes de la interfaz): no lleva idioma.
        ffmpeg(["-i", master, "-vf", `select=eq(n\\,${spec.poster})`, "-frames:v", "1", "-q:v", "3", path.join(WEB, `${door}-poster.jpg`)]);
      }
    }
  } finally {
    // bundle() deja el paquete en %TEMP%: sin esto el disco se llena (16/11).
    rmSync(serveUrl, { recursive: true, force: true });
  }
}

void main();
