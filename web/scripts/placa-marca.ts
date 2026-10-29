#!/usr/bin/env node
/**
 * Convierte una placa de ChatGPT a la paleta de la marca: blanco y negro
 * llevado a pared (#0B0B0A) y marfil (#ECE7DD), al tamaño de la lámina.
 * ChatGPT tiende a devolver color aunque se le pida B/N; no se pelea en el
 * prompt, se resuelve acá.
 *
 * Uso, desde web/:
 *   npx tsx scripts/placa-marca.ts <id> [slot]          imagenes/<slot>-v1.png → imagenes/<slot>.png (slot: portada)
 *   npx tsx scripts/placa-marca.ts <entrada.png> <salida.png>
 *   --formato feed|cuadrado|reel   (por defecto feed: 1080×1350)
 *   --contraste 1.25               (alrededor del gris medio de la imagen)
 */
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { carpetaDe } from "./lib/piezas";

const MEDIDAS = { feed: [1080, 1350], cuadrado: [1080, 1080], reel: [1080, 1920] } as const;
const PARED = [11, 11, 10];
const MARFIL = [236, 231, 221];
// Luminancia con poco peso en el rojo: los amarillos de herramienta no se queman.
const PESOS = [0.25, 0.6, 0.15];

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

async function convertir(entrada: string, salida: string, formato: keyof typeof MEDIDAS, contraste: number) {
  const gris = sharp(entrada).removeAlpha().recomb([PESOS, PESOS, PESOS] as never);
  const media = (await gris.clone().stats()).channels[0].mean;
  // Contraste alrededor de la media y coloreado pared → marfil en un solo paso lineal por canal.
  const a = PARED.map((negro, i) => ((MARFIL[i] - negro) / 255) * contraste);
  const b = PARED.map((negro, i) => negro + ((MARFIL[i] - negro) / 255) * media * (1 - contraste));
  const [w, h] = MEDIDAS[formato];
  await gris.linear(a, b).resize(w, h, { fit: "cover", position: "attention" }).png({ compressionLevel: 9 }).toFile(salida);
  console.log(`✔ ${path.relative(process.cwd(), salida)} · ${w}×${h} · media ${media.toFixed(0)} · contraste ${contraste}`);
}

async function main() {
  const [primero, segundo] = process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !["--formato", "--contraste"].includes(all[index - 1] ?? ""));
  if (!primero) throw new Error("Uso: placa-marca.ts <id> [slot]  ·  placa-marca.ts <entrada.png> <salida.png>");
  const formato = (option("formato") ?? "feed") as keyof typeof MEDIDAS;
  if (!(formato in MEDIDAS)) throw new Error(`Formato desconocido: ${formato}`);
  const contraste = Number(option("contraste") ?? 1.25);

  if (/\.(png|jpe?g|webp)$/i.test(primero)) {
    if (!segundo) throw new Error("Falta la ruta de salida.");
    return convertir(path.resolve(primero), path.resolve(segundo), formato, contraste);
  }
  const slot = segundo ?? "portada";
  const carpeta = path.join(carpetaDe(primero), "imagenes");
  const entrada = ["png", "jpg", "jpeg", "webp"].map((ext) => path.join(carpeta, `${slot}-v1.${ext}`)).find(existsSync);
  if (!entrada) throw new Error(`No está ${slot}-v1.png en ${carpeta}: guardá ahí la descarga original de ChatGPT.`);
  await convertir(entrada, path.join(carpeta, `${slot}.png`), formato, contraste);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
