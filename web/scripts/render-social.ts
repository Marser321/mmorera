#!/usr/bin/env node
/**
 * Renderiza las piezas de redes (contenido/piezas/<id>/) con
 * src/remotion/socialRoot.tsx. Deja los archivos en <pieza>/salida/.
 *
 * Uso, desde web/:
 *   npx tsx scripts/render-social.ts 2026-10-12-agente-sin-tests     (una pieza)
 *   npx tsx scripts/render-social.ts --desde 2026-10-12 --hasta 2026-10-18
 *   npx tsx scripts/render-social.ts <id> --stills                   (solo PNG: diapositivas y portadas)
 *   npx tsx scripts/render-social.ts <id> --solo reel                (una salida de la pieza)
 *
 * Antes de renderizar valida la pieza (como check-pieza): si hay errores de
 * texto, geometría u honestidad, la saltea y los muestra.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { PROJECT_CASES } from "../src/data/projectCases";
import { trabajosDe, type ImagenesProp } from "../src/data/social/render";
import { binariesDirectory, browserExecutable as findBrowser, bundleRoot } from "./lib/remotionBundle";
import { carpetaDe, imagenDe, listarPiezas, revisarPieza } from "./lib/piezas";

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

const VALUED = new Set(["--desde", "--hasta", "--solo"]);

async function main() {
  const names = process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !VALUED.has(all[index - 1]));
  const desde = option("desde");
  const hasta = option("hasta");
  const solo = option("solo");
  const stillsOnly = process.argv.includes("--stills");
  const ids = names.length ? names : listarPiezas().filter((id) => (!desde || id.slice(0, 10) >= desde) && (!hasta || id.slice(0, 10) <= hasta));
  if (!ids.length) throw new Error("No hay piezas para renderizar (pasá un id o --desde/--hasta).");

  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  let serveUrl: string | null = null;

  for (const id of ids) {
    const { pieza, problemas } = revisarPieza(id);
    // Faltan renders: es lo que este script resuelve. Lo demás bloquea.
    const bloqueantes = problemas.filter((p) => p.nivel === "error" && p.donde !== "salida");
    if (!pieza || bloqueantes.length) {
      console.log(`\n✖ ${id}: no se renderiza`);
      for (const p of bloqueantes) console.log(`  · ${p.donde}: ${p.mensaje}`);
      continue;
    }
    if (!serveUrl) {
      console.log("Empaquetando la raíz de las piezas…");
      serveUrl = await bundleRoot("src/remotion/socialRoot.tsx");
    }
    // Las imágenes de la pieza viajan al bundle con la misma ruta que usan las props.
    const imagenes: ImagenesProp = {};
    for (const slot of pieza.imagenes ?? []) {
      const found = imagenDe(id, slot.slot);
      if (!found) continue;
      const rel = `contenido/${id}/imagenes/${path.basename(found.file)}`;
      mkdirSync(path.dirname(path.join(serveUrl, rel)), { recursive: true });
      cpSync(found.file, path.join(serveUrl, rel));
      imagenes[slot.slot] = { src: `/${rel}`, w: found.w, h: found.h };
    }
    const trabajos = trabajosDe(pieza, {
      imagenes,
      nombreCaso: (slug) => PROJECT_CASES.find((item) => item.slug === slug)?.title.es ?? slug,
      placa: (slug, kind) => `/portfolio/films/${slug}/${kind}-es.jpg`,
    }).filter((trabajo) => (!solo || trabajo.archivo.startsWith(solo)) && (!stillsOnly || trabajo.tipo === "still"));

    const outDir = path.join(carpetaDe(id), "salida");
    mkdirSync(outDir, { recursive: true });
    console.log(`\n${id}: ${trabajos.length} archivos`);
    for (const trabajo of trabajos) {
      const inputProps = trabajo.props as unknown as Record<string, unknown>;
      const composition = await selectComposition({ serveUrl, id: trabajo.composicion, inputProps, binariesDirectory: binaries, browserExecutable });
      const output = path.join(outDir, trabajo.archivo);
      const started = Date.now();
      if (trabajo.tipo === "still") {
        await renderStill({ composition, serveUrl, frame: Math.min(trabajo.frame ?? composition.durationInFrames - 1, composition.durationInFrames - 1), output, inputProps, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
      } else {
        await renderMedia({
          composition,
          serveUrl,
          codec: "h264",
          crf: 18,
          pixelFormat: "yuv420p",
          outputLocation: output,
          inputProps,
          binariesDirectory: binaries,
          browserExecutable,
          concurrency: Math.max(1, Math.min(4, os.cpus().length - 2)),
          timeoutInMilliseconds: 120_000,
        });
      }
      console.log(`  ${trabajo.archivo} (${((Date.now() - started) / 1000).toFixed(0)} s)`);
    }
    if (existsSync(outDir) && pieza.estado === "borrador") console.log(`  Si la revisión visual está bien: npx tsx scripts/contenido.ts listo ${id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
