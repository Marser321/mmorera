#!/usr/bin/env node
/**
 * Exporta los films insignia a MP4 para portfolios y redes (fuera del sitio).
 *
 * Uso, desde web/:
 *   npx tsx scripts/render-films.ts                          (todos, 16:9 y 4:5, es y en)
 *   npx tsx scripts/render-films.ts truckers-choice          (un film)
 *   npx tsx scripts/render-films.ts truckers-choice --formats landscape --languages es --frames 0-299
 *
 * Salida: renders/<slug>/<slug>-<formato>-<idioma>.mp4 (fuera de git).
 * - 16:9 a 1920×1080 (el film mide 1600×900 y se escala 1,2).
 * - 4:5 a 1080×1350 (Instagram, LinkedIn).
 *
 * Remotion no publica su compositor para Windows ARM64: en esa máquina se usa
 * el binario x64 (corre emulado) desde .remotion-bin/, que este script baja de
 * npm la primera vez (`npm pack @remotion/compositor-win32-x64-msvc`).
 *
 * En el sitio las imágenes viven en /portfolio/…; el bundle de Remotion sirve
 * public/ en otra ruta, así que se copia public/portfolio a la raíz del bundle
 * y las rutas de los films resuelven igual que en el sitio.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { FLAGSHIP_FILMS } from "../src/data/films/flagships";

const ROOT = process.cwd();
const REMOTION_VERSION = "4.0.490";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

/** Compositor x64 para Windows ARM64 (emulado); en las demás plataformas, el de npm. */
function binariesDirectory() {
  if (!(process.platform === "win32" && os.arch() === "arm64")) return null;
  const dir = path.join(ROOT, ".remotion-bin");
  const pkg = path.join(dir, "package");
  if (!existsSync(path.join(pkg, "remotion.exe")) && !existsSync(path.join(pkg, "ffmpeg.exe"))) {
    mkdirSync(dir, { recursive: true });
    execSync(`npm pack @remotion/compositor-win32-x64-msvc@${REMOTION_VERSION}`, { cwd: dir, stdio: "inherit" });
    execSync(`tar -xzf remotion-compositor-win32-x64-msvc-${REMOTION_VERSION}.tgz`, { cwd: dir, stdio: "inherit" });
  }
  return pkg;
}

async function main() {
  const slugs = process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !all[index - 1]?.startsWith("--"));
  const films = slugs.length ? slugs : Object.keys(FLAGSHIP_FILMS);
  const formats = (option("formats") ?? "landscape,portrait").split(",") as Array<"landscape" | "portrait">;
  const languages = (option("languages") ?? "es,en").split(",") as Array<"es" | "en">;
  const frames = option("frames")?.split("-").map(Number) as [number, number] | undefined;
  for (const slug of films) if (!FLAGSHIP_FILMS[slug]) throw new Error(`No hay film insignia para ${slug}`);

  const binaries = binariesDirectory();
  const browserExecutable = process.platform === "win32" && existsSync(CHROME) ? CHROME : null;
  console.log("Empaquetando la raíz de los films…");
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src/remotion/filmsRoot.tsx"),
    publicDir: path.join(ROOT, "public"),
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(ROOT, "src") } } }),
  });
  cpSync(path.join(ROOT, "public/portfolio"), path.join(serveUrl, "portfolio"), { recursive: true });

  for (const slug of films) {
    for (const format of formats) {
      for (const language of languages) {
        const id = `${slug}-${format}-${language}`;
        const outDir = path.join(ROOT, "renders", slug);
        mkdirSync(outDir, { recursive: true });
        const outputLocation = path.join(outDir, `${id}${frames ? `-${frames[0]}-${frames[1]}` : ""}.mp4`);
        const inputProps = { slug, language };
        const composition = await selectComposition({ serveUrl, id, inputProps, binariesDirectory: binaries, browserExecutable });
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
