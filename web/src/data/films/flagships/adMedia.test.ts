import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { mediaSize } from "@/lib/mediaSize";
import { FILM_FPS } from "../filmTypes";
import { AD_ASSETS, AD_CHAPTERS, AD_COPY, AD_DURATION, AD_FACTS, AD_SCENES, AD_SITE_STOPS, AD_TIMELINE } from "./adMedia";
import { heroScene } from "./types";

const dossier = readFileSync(path.join(process.cwd(), "docs/films/dossiers/ad-media.md"), "utf8");

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

/** Lo que el film de AD Media nunca puede decir (dossier § 3 y § 5). */
const FORBIDDEN = [
  /\d+\s?%/, // porcentajes de conversión o de cierre
  /\$\s?\d/, // facturación o precios
  /\bROI\b/i,
  /garantiz|guarante/i,
  /duplic|double your/i,
  /\bCPA\b/,
];

test("film insignia de AD Media", async (t) => {
  await t.test("estructura: 70–80 s, escena protagonista pipeline-board y firma al final", () => {
    const seconds = AD_DURATION / FILM_FPS;
    assert.ok(seconds >= 70 && seconds <= 80, `dura ${seconds} s`);
    assert.equal(heroScene([...AD_SCENES]).kind, "pipeline-board");
    assert.equal(AD_SCENES[AD_SCENES.length - 1].kind, "signature");
    const last = AD_SCENES[AD_SCENES.length - 1];
    assert.equal(AD_TIMELINE[last.id].from + AD_TIMELINE[last.id].duration, AD_DURATION);
  });

  await t.test("capítulos contiguos que cubren todo el film", () => {
    let expected = 0;
    for (const chapter of AD_CHAPTERS) {
      assert.equal(chapter.from, expected, `${chapter.label.es} no es contiguo`);
      expected += chapter.durationInFrames;
    }
    assert.equal(expected, AD_DURATION);
  });

  await t.test("cada cifra existe en el dossier del cliente", () => {
    for (const [key, fact] of Object.entries(AD_FACTS)) {
      assert.ok(new RegExp(`\\b${fact.value}\\b`).test(dossier), `${key}=${fact.value} no aparece en el dossier`);
      assert.ok(fact.source.startsWith("Dossier"), `${key}: fuente sin documentar`);
    }
  });

  await t.test("el tablero recorre las 5 etapas del dossier", () => {
    for (const language of ["es", "en"] as const) {
      const copy = AD_COPY[language];
      assert.equal(copy.stages.length, AD_FACTS.stages.value);
      assert.equal(copy.heroTags.length, copy.stages.length, "una etiqueta de la protagonista por etapa");
      assert.equal(copy.automations.length, copy.stages.length, "una automatización por etapa");
      assert.equal(copy.boardCards.length, copy.stages.length, "oportunidades de fondo por etapa");
      // El reloj de la muestra responde dentro de la ventana declarada.
      for (const event of copy.leadEvents) assert.ok(event.at >= 0 && event.at < 10, `evento fuera de la muestra: ${event.at} s`);
      assert.ok(copy.sampleLabel.length > 0, "el tablero necesita su rótulo de datos de ejemplo");
    }
    assert.ok(/Lead nuevo/.test(dossier) && /Ganado/.test(dossier), "las etapas salen del dossier");
    assert.deepEqual(AD_COPY.es.stages, ["Lead nuevo", "Calificado", "Llamada agendada", "Propuesta enviada", "Ganado"]);
  });

  await t.test("copia honesta: sin porcentajes, montos ni promesas", () => {
    for (const text of [...strings(AD_COPY), ...strings(AD_CHAPTERS)]) {
      for (const pattern of FORBIDDEN) assert.ok(!pattern.test(text), `"${text}" coincide con ${pattern}`);
    }
    for (const language of ["es", "en"] as const) {
      for (const fact of AD_COPY[language].engineeringFacts) assert.ok(/repositorio|project repository/.test(fact.source), `fuente opaca: ${fact.source}`);
    }
  });

  await t.test("la alianza da crédito a la agencia y al socio técnico", () => {
    for (const language of ["es", "en"] as const) {
      const copy = AD_COPY[language];
      const text = strings(copy).join(" ");
      assert.match(text, /AD Media/);
      assert.match(text, /Mario Morera/);
      assert.match(copy.creditLine, /AD Media Solution/);
    }
  });

  await t.test("los assets declarados miden lo que dicen (la cámara nunca los amplía)", () => {
    for (const asset of Object.values(AD_ASSETS)) {
      const size = mediaSize(readFileSync(path.join(process.cwd(), "public", asset.src)), asset.src);
      assert.equal(size.width, asset.w, `${asset.src}: ancho`);
      assert.equal(size.height, asset.h, `${asset.src}: alto`);
    }
    // ceo.jpg es la foto del CEO, no otra copia del manual de marca.
    const ceo = readFileSync(path.join(process.cwd(), "public", AD_ASSETS.ceo.src));
    const banner = readFileSync(path.join(process.cwd(), "public/portfolio/brands/ad-media-solution/banner.jpg"));
    assert.ok(!ceo.equals(banner), "ceo.jpg volvió a ser una copia de banner.jpg");
  });

  await t.test("las paradas del recorrido avanzan de arriba abajo", () => {
    for (let index = 1; index < AD_SITE_STOPS.length; index++) assert.ok(AD_SITE_STOPS[index] > AD_SITE_STOPS[index - 1]);
    assert.equal(AD_SITE_STOPS[0], 0);
    assert.equal(AD_SITE_STOPS[AD_SITE_STOPS.length - 1], 1);
    assert.equal(AD_SITE_STOPS.length, AD_COPY.es.siteStops.length, "una línea de la lista por parada");
  });
});
