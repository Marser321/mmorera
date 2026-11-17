import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { LOOP_FADE, MONTAGE, MONTAGE_SIZE, montageFiles, montageFrames, shotStarts, type MontageId } from "@/components/films/hero/montaje";
import { BEATS, HERO_FRAMES } from "@/components/films/hero/timing";
import { HERO_FILM, HERO_FILM_ALT } from "./heroFilm";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);
const source = (file: string) => path.join(process.cwd(), "film-sources", "hero", file);
const IDS: MontageId[] = ["ancho", "alto"];

describe("montaje del hero «El equipo»", () => {
  it("los dos cortes duran lo mismo que el guion", () => {
    for (const id of IDS) assert.equal(montageFrames(id), HERO_FRAMES, `el corte ${id} no mide ${HERO_FRAMES} cuadros`);
    assert.equal(BEATS.reduce((total, beat) => total + beat.frames, 0), HERO_FRAMES);
  });

  it("el corte ancho cambia de escena donde lo marca el guion", () => {
    const starts = new Set(shotStarts("ancho"));
    for (const beat of BEATS.slice(0, 5)) assert.ok(starts.has(beat.from), `ningún plano arranca en el cuadro ${beat.from} (${beat.id})`);
  });

  it("cada plano tiene su cuadro de partida en el repo y un encuadre posible", () => {
    for (const file of montageFiles()) assert.ok(existsSync(source(file)), `falta film-sources/hero/${file}`);
    for (const id of IDS) {
      for (const shot of MONTAGE[id]) {
        assert.ok(shot.frames > LOOP_FADE, `${id}/${shot.id}: plano más corto que el fundido del bucle`);
        for (const framing of [shot.from, shot.to]) {
          assert.ok(framing.scale >= 1, `${id}/${shot.id}: con escala menor a 1 se ve el borde del cuadro`);
          assert.ok(framing.x >= 0 && framing.x <= 1 && framing.y >= 0 && framing.y <= 1, `${id}/${shot.id}: encuadre fuera del cuadro`);
        }
      }
    }
  });

  it("los archivos del sitio existen, con sus dos pósters, y coinciden con el tamaño del render", () => {
    for (const [cut, id] of [[HERO_FILM.wide, "ancho"], [HERO_FILM.tall, "alto"]] as const) {
      for (const src of [cut.mp4, cut.webm, cut.poster, cut.still]) assert.ok(existsSync(publicFile(src)), `falta ${src}: correr scripts/render-hero-montaje.ts`);
      assert.deepEqual({ width: cut.width, height: cut.height }, { ...MONTAGE_SIZE[id] });
    }
    assert.ok(HERO_FILM_ALT.es && HERO_FILM_ALT.en);
  });
});
