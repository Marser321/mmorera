import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { CONTENT_SAMPLES } from "@/data/contentSamples";
import { SAMPLE_COPY } from "../muestras/copy";
import { CLIPS } from "../muestras/clips";
import timing from "./timing.json";
import { TRAILER_CODE } from "./trailerCode";
import { TRAILER_COPY } from "./copy";

const source = readFileSync(path.join(process.cwd(), "src/components/films/trailer/ContentTrailer.tsx"), "utf8").replace(/\r\n/g, "\n");

test("las escenas del trailer cubren el video sin huecos y caen en el pulso", () => {
  let cursor = 0;
  for (const scene of timing.scenes) {
    assert.equal(scene.from, cursor, `${scene.id} empieza donde termina la anterior`);
    assert.equal(scene.from % timing.beat, 0, `${scene.id} empieza en un pulso`);
    cursor += scene.duration;
  }
  assert.equal(cursor, timing.total);
  assert.equal(timing.beat, (timing.fps * 60) / timing.bpm);
  assert.ok(timing.total <= 60 * timing.fps, "el trailer dura un minuto o menos");
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

test("los golpes del trailer caen en el pulso y la caída y el cierre, en un compás", () => {
  const { cues, beat, bar } = timing;
  const onBeat = [cues.enter, ...cues.titleSlams, ...cues.colorLooks, cues.aiReady, ...cues.bridgeLines, cues.drop, ...cues.styleCuts, cues.wall, cues.wallFlip, cues.wallStamp, cues.code, cues.finale];
  for (const frame of onBeat) assert.equal(frame % beat, 0, `el frame ${frame} cae en un pulso`);
  assert.equal(cues.drop % bar, 0);
  assert.equal(cues.finale % bar, 0);
});

test("cada estilo tiene su escena en el trailer, en el orden de las muestras", () => {
  const sampleIds: string[] = CONTENT_SAMPLES.map((sample) => sample.id);
  const styleScenes = timing.scenes.filter((scene) => sampleIds.includes(scene.id));
  assert.deepEqual(styleScenes.map((scene) => scene.id), sampleIds);
  assert.deepEqual(timing.cues.styleCuts, styleScenes.map((scene) => scene.from));
  for (const sample of CONTENT_SAMPLES) assert.equal(sample.frames % timing.bar, 0, `${sample.id} dura compases enteros`);
});

test("los clips de las muestras salen de archivos del sitio", () => {
  for (const [id, clip] of Object.entries(CLIPS)) assert.ok(existsSync(path.join(process.cwd(), "public", clip.src)), `${id}: ${clip.src}`);
});

test("el texto del trailer y de las muestras va en tuteo y sin el nombre del país", () => {
  const text = JSON.stringify([TRAILER_COPY.es, SAMPLE_COPY.es, CONTENT_SAMPLES.map((sample) => [sample.style.es, sample.pitch.es, sample.source.es])]);
  for (const voseo of [/\bconvertila\b/i, /\bdecís\b/i, /\bhablás\b/i, /\btenés\b/i, /\bpodés\b/i, /\bquerés\b/i, /\bimaginás\b/i, /\bcontás\b/i, /\bvos\b/i]) assert.doesNotMatch(text, voseo);
  assert.doesNotMatch(JSON.stringify([TRAILER_COPY, SAMPLE_COPY]), /uruguay/i);
});
