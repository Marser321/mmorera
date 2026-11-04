import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import timing from "./timing.json";
import { TRAILER_CODE } from "./trailerCode";
import { PIECE_TITLE, TRAILER_COPY } from "./copy";

const source = readFileSync(path.join(process.cwd(), "src/components/films/trailer/ContentTrailer.tsx"), "utf8").replace(/\r\n/g, "\n");

test("las escenas del trailer cubren el video sin huecos y caen en compases", () => {
  let cursor = 0;
  for (const scene of timing.scenes) {
    assert.equal(scene.from, cursor, `${scene.id} empieza donde termina la anterior`);
    assert.equal(scene.from % timing.bar, 0, `${scene.id} empieza en un compás`);
    cursor += scene.duration;
  }
  assert.equal(cursor, timing.total);
  assert.equal(timing.beat, (timing.fps * 60) / timing.bpm);
});

test("ContentTrailer.tsx usa los mismos tiempos que la banda sonora", () => {
  const sequences = [...source.matchAll(/from=\{(\d+)\}\s*\n\s*durationInFrames=\{(\d+)\}/g)].map((m) => [Number(m[1]), Number(m[2])]);
  assert.deepEqual(sequences, timing.scenes.map((scene) => [scene.from, scene.duration]));
});

test("el código que muestra el video es el código real del video", () => {
  const dedented = source.split("\n").map((line) => line.replace(/^ {6}/, ""));
  const block = TRAILER_CODE.join("\n");
  assert.ok(dedented.join("\n").includes(block), "el bloque de secuencias aparece tal cual en ContentTrailer.tsx");
});

test("los golpes del trailer caen en el pulso", () => {
  const { cues, beat } = timing;
  const onBeat = [cues.enter, ...cues.titleSlams, cues.drop, cues.formatsFlip, ...cues.reviewChecks, cues.reviewStamp, cues.finale, ...cues.colorLooks];
  for (const frame of onBeat) assert.equal(frame % beat, 0, `el frame ${frame} cae en un pulso`);
});

test("el texto del trailer va en tuteo y sin el nombre del país", () => {
  const text = JSON.stringify([TRAILER_COPY.es, PIECE_TITLE.es]);
  for (const voseo of [/\bconvertila\b/i, /\bdecís\b/i, /\bhablás\b/i, /\btenés\b/i, /\bpodés\b/i, /\bquerés\b/i]) assert.doesNotMatch(text, voseo);
  assert.doesNotMatch(JSON.stringify(TRAILER_COPY), /uruguay/i);
});
