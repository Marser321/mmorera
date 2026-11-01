#!/usr/bin/env node
/**
 * Exporta los films insignia a MP4 para portfolios y redes (fuera del sitio).
 *
 * Uso, desde web/:
 *   npx tsx scripts/render-films.ts                          (todos, 16:9 y 4:5, es y en)
 *   npx tsx scripts/render-films.ts truckers-choice          (un film)
 *   npx tsx scripts/render-films.ts truckers-choice --formats landscape --languages es --frames 0-299
 *   npx tsx scripts/render-films.ts --capabilities           (los 9 films por capacidad de /estudio)
 *   npx tsx scripts/render-films.ts capability-ai            (uno de ellos)
 *   npx tsx scripts/render-films.ts capability-ai --stills 120,400   (cuadros PNG, para revisar o miniaturas)
 *
 * Salida: renders/<id>/<id>-<formato>-<idioma>.mp4 (fuera de git), con <id> el
 * slug del caso o capability-<familia>.
 * - 16:9 a 1920×1080 (el film mide 1600×900 y se escala 1,2).
 * - 4:5 a 1080×1350 (Instagram, LinkedIn).
 *
 * El bundle, el compositor para Windows ARM64 y la copia de public/portfolio
 * salen de scripts/lib/remotionBundle.ts (los comparte render-social.ts).
 */
import { mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { capabilityFilmId } from "../src/data/films/capabilityFilms";
import { FLAGSHIP_FILMS } from "../src/data/films/flagships";
import { FAMILIES } from "../src/data/techStack";
import { binariesDirectory, browserExecutable as findBrowser, bundleRoot } from "./lib/remotionBundle";

const ROOT = process.cwd();

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

/** Opciones que llevan valor (el resto, como --capabilities, son interruptores). */
const VALUED = new Set(["--formats", "--languages", "--frames", "--stills"]);

/** Films por capacidad: id de exportación → familia. */
const CAPABILITIES = Object.fromEntries(FAMILIES.map((family) => [capabilityFilmId(family.id), family.id]));

async function main() {
  const names = process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !VALUED.has(all[index - 1]));
  const films = names.length ? names : process.argv.includes("--capabilities") ? Object.keys(CAPABILITIES) : Object.keys(FLAGSHIP_FILMS);
  const formats = (option("formats") ?? "landscape,portrait").split(",") as Array<"landscape" | "portrait">;
  const languages = (option("languages") ?? "es,en").split(",") as Array<"es" | "en">;
  const frames = option("frames")?.split("-").map(Number) as [number, number] | undefined;
  const stills = option("stills")?.split(",").map(Number);
  for (const name of films) if (!FLAGSHIP_FILMS[name] && !CAPABILITIES[name]) throw new Error(`No hay film insignia ni film por capacidad con el id ${name}`);

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  console.log("Empaquetando la raíz de los films…");
  const serveUrl = await bundleRoot("src/remotion/filmsRoot.tsx");

  for (const slug of films) {
    for (const format of formats) {
      for (const language of languages) {
        const id = `${slug}-${format}-${language}`;
        const outDir = path.join(ROOT, "renders", slug);
        mkdirSync(outDir, { recursive: true });
        const outputLocation = path.join(outDir, `${id}${frames ? `-${frames[0]}-${frames[1]}` : ""}.mp4`);
        const inputProps = CAPABILITIES[slug] ? { family: CAPABILITIES[slug], language } : { slug, language };
        const composition = await selectComposition({ serveUrl, id, inputProps, binariesDirectory: binaries, browserExecutable });
        if (stills) {
          for (const frame of stills) {
            const output = path.join(outDir, `${id}-${frame}.png`);
            await renderStill({ composition, serveUrl, frame, output, inputProps, scale: format === "landscape" ? 1.2 : 1, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
            console.log(path.relative(ROOT, output));
          }
          continue;
        }
        const started = Date.now();
        let last = -1;
        await renderMedia({
          composition,
          serveUrl,
          codec: "h264",
          crf: 18,
          pixelFormat: "yuv420p",
          scale: format === "landscape" ? 1.2 : 1,
          outputLocation,
          inputProps,
          frameRange: frames ?? null,
          binariesDirectory: binaries,
          browserExecutable,
          concurrency: Math.max(1, Math.min(4, os.cpus().length - 2)),
          timeoutInMilliseconds: 120_000,
          onProgress: ({ progress }) => {
            const step = Math.floor(progress * 10);
            if (step !== last) {
              last = step;
              process.stdout.write(`\r${id}: ${Math.round(progress * 100)}%   `);
            }
          },
        });
        console.log(`\n${id}: ${path.relative(ROOT, outputLocation)} (${Math.round((Date.now() - started) / 1000)} s)`);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
