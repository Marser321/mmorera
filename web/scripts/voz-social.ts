#!/usr/bin/env node
/**
 * Voz en off (y música opcional) para los reels de texto de una pieza, con
 * ElevenLabs por medio de ~/bin/voz (central #26). Solo en la Mac de Mario.
 *
 * Uso, desde web/:
 *   npx tsx scripts/voz-social.ts <id>                         una frase por pulso de cada reel-texto
 *   npx tsx scripts/voz-social.ts <id> --solo reel             una salida
 *   npx tsx scripts/voz-social.ts <id> --musica "descripción"  además, una cama de música
 *   npx tsx scripts/voz-social.ts <id> --rehacer               vuelve a generar aunque el texto no cambió
 *
 * Deja <pieza>/audio/<salida>/<pulso>.mp3 y voz.json ({pulso: {archivo, segundos, texto}}).
 * Si el texto de un pulso no cambió, no lo vuelve a pedir (no gasta). Después:
 *   npx tsx scripts/render-social.ts <id> --solo <salida>
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { plain } from "../src/data/social/layout";
import { reelTextoBeats, videoSeconds } from "../src/data/social/timing";
import { DURACION_MAXIMA } from "../src/data/social/types";
import { carpetaDe, leerPieza } from "./lib/piezas";

type Frase = { archivo: string; segundos: number; texto: string };

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

const VOZ = path.join(os.homedir(), "bin/voz");

/** Duración de un mp3 con afinfo (viene con macOS). */
function segundos(file: string): number {
  const out = execFileSync("afinfo", [file], { encoding: "utf8" });
  const match = out.match(/estimated duration:\s*([\d.]+)/);
  if (!match) throw new Error(`No pude medir ${file}`);
  return Math.round(Number(match[1]) * 100) / 100;
}

function main() {
  const id = process.argv[2];
  if (!id || id.startsWith("--")) throw new Error("Uso: npx tsx scripts/voz-social.ts <id> [--solo <salida>] [--musica \"…\"] [--rehacer]");
  if (!existsSync(VOZ)) throw new Error("Falta ~/bin/voz (central/n8n/voz.sh).");
  const solo = option("solo");
  const musica = option("musica");
  const rehacer = process.argv.includes("--rehacer");
  const pieza = leerPieza(id);
  const reels = pieza.salidas.filter((salida) => salida.plantilla === "reel-texto" && (!solo || salida.id === solo));
  if (!reels.length) throw new Error(`${id}: no tiene reels de texto${solo ? ` con id ${solo}` : ""}.`);

  for (const salida of reels) {
    if (salida.plantilla !== "reel-texto") continue;
    const dir = path.join(carpetaDe(id), "audio", salida.id);
    mkdirSync(dir, { recursive: true });
    const indice = path.join(dir, "voz.json");
    const previo: Record<string, Frase> = existsSync(indice) ? JSON.parse(readFileSync(indice, "utf8")) : {};
    const voz: Record<string, Frase> = {};
    for (const beat of reelTextoBeats(salida)) {
      const texto = plain(beat.texto).trim();
      const archivo = `${beat.id}.mp3`;
      const file = path.join(dir, archivo);
      if (!rehacer && previo[beat.id]?.texto === texto && existsSync(file)) {
        voz[beat.id] = previo[beat.id];
        continue;
      }
      execFileSync(VOZ, [texto, file], { stdio: ["ignore", "ignore", "inherit"] });
      voz[beat.id] = { archivo, segundos: segundos(file), texto };
      console.log(`  ${salida.id}/${archivo}: ${voz[beat.id].segundos} s · ${texto}`);
    }
    writeFileSync(indice, `${JSON.stringify(voz, null, 2)}\n`);
    if (musica) {
      const total = Math.ceil(videoSeconds(salida, "", Object.fromEntries(Object.entries(voz).map(([k, v]) => [k, v.segundos]))));
      execFileSync(VOZ, ["musica", musica, path.join(dir, "musica.mp3"), String(Math.max(3, total))], { stdio: ["ignore", "ignore", "inherit"] });
      console.log(`  ${salida.id}/musica.mp3: ${total} s`);
    }
    const dura = videoSeconds(salida, "", Object.fromEntries(Object.entries(voz).map(([k, v]) => [k, v.segundos])));
    console.log(`${salida.id}: el reel con voz dura ${dura.toFixed(1)} s`);
    for (const p of salida.para ?? []) if (dura > DURACION_MAXIMA[p]) console.log(`  ⚠ ${p} admite ${DURACION_MAXIMA[p]} s: acortá el texto`);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
