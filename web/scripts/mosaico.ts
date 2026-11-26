#!/usr/bin/env node
/**
 * Renderiza las nueve portadas de un mosaico del feed (contenido/series/<id>.json)
 * y arma la vista de la grilla del perfil, para ver el monograma entero antes
 * de publicar. Deja todo en contenido/series/<id>/salida/:
 *   01-<slug>.png … 09-<slug>.png   las portadas (1080×1350)
 *   feed.png                        la grilla 3 × 3 como la muestra Instagram (recorte 3:4)
 *
 * Uso, desde web/:
 *   npx tsx scripts/mosaico.ts feed-9
 *
 * Las portadas reales de cada carrusel salen de su pieza (una portada con
 * "mosaico": { "celda": N }); esto es la vista previa del conjunto.
 */
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderStill, selectComposition } from "@remotion/renderer";
import sharp from "sharp";
import { layoutProblems } from "../src/components/films/scenes/brand/layout/dataText";
import { slideLayout } from "../src/data/social/layout";
import { esCelda, luzDeCelda, MOSAICO } from "../src/data/social/mosaico";
import { slideComposition, type SlideProps } from "../src/data/social/render";
import { SLIDE_STILL_FRAMES } from "../src/data/social/timing";
import { SOCIAL_FORMATS, type Diapositiva } from "../src/data/social/types";
import { binariesDirectory, browserExecutable as findBrowser, bundleRoot } from "./lib/remotionBundle";
import { CONTENIDO } from "./lib/piezas";

type Serie = { id: string; titulo: string; celdas: Array<{ celda: number; kicker?: string; titulo: string; tema?: string }> };

const slug = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function main() {
  const id = process.argv[2];
  if (!id) throw new Error("Uso: npx tsx scripts/mosaico.ts <serie>   (contenido/series/<serie>.json)");
  const serie = JSON.parse(readFileSync(path.join(CONTENIDO, "series", `${id}.json`), "utf8")) as Serie;
  const celdas = [...serie.celdas].sort((a, b) => a.celda - b.celda);
  if (celdas.length !== 9 || celdas.some((item, index) => !esCelda(item.celda) || item.celda !== index + 1)) throw new Error(`${id}: un mosaico lleva exactamente las celdas 1 a 9`);

  const slides = celdas.map((item): Diapositiva => ({ tipo: "portada", kicker: item.kicker, titulo: item.titulo, mosaico: { celda: item.celda } }));
  for (const [index, slide] of slides.entries()) {
    const layout = slideLayout("feed", slide);
    const problemas = layoutProblems(layout.blocks, layout.safe);
    if (problemas.length) throw new Error(`Celda ${index + 1} ("${celdas[index].titulo}"): ${problemas.join("; ")}. Acortá el título.`);
  }

  const outDir = path.join(CONTENIDO, "series", id, "salida");
  mkdirSync(outDir, { recursive: true });
  console.log("Empaquetando la raíz de las piezas…");
  const serveUrl = await bundleRoot("src/remotion/socialRoot.tsx");
  const binaries = binariesDirectory();
  const browserExecutable = findBrowser();
  const files: string[] = [];
  for (const [index, slide] of slides.entries()) {
    const props: SlideProps = { formato: "feed", slide, tono: "oscuro", imagenes: {}, luz: luzDeCelda(index + 1) };
    const inputProps = props as unknown as Record<string, unknown>;
    const composition = await selectComposition({ serveUrl, id: slideComposition("feed"), inputProps, binariesDirectory: binaries, browserExecutable });
    const output = path.join(outDir, `${String(index + 1).padStart(2, "0")}-${slug(celdas[index].titulo)}.png`);
    await renderStill({ composition, serveUrl, frame: SLIDE_STILL_FRAMES, output, inputProps, binariesDirectory: binaries, browserExecutable, timeoutInMilliseconds: 120_000 });
    files.push(output);
    console.log(`  ${path.basename(output)}  luz ${luzDeCelda(index + 1) ?? "—"}`);
  }

  // La grilla del perfil: cada portada recortada a 3:4 (su centro), con la separación de Instagram.
  const { height } = SOCIAL_FORMATS.feed;
  const tiles = await Promise.all(
    files.map(async (file, index) => ({
      input: await sharp(file).extract({ left: MOSAICO.recorte, top: 0, width: MOSAICO.cellW, height }).toBuffer(),
      left: (index % 3) * (MOSAICO.cellW + MOSAICO.gap),
      top: Math.floor(index / 3) * (height + MOSAICO.gap),
    })),
  );
  const feed = path.join(outDir, "feed.png");
  // sharp aplica el resize antes del composite: primero se arma a tamaño real y después se achica.
  const entero = await sharp({ create: { width: MOSAICO.width, height: MOSAICO.height, channels: 3, background: "#000000" } }).composite(tiles).png().toBuffer();
  await sharp(entero).resize(1530).png().toFile(feed);
  console.log(`✔ ${feed}`);
}

main().catch((error) => {
  console.error(`✖ ${(error as Error).message}`);
  process.exit(1);
});
