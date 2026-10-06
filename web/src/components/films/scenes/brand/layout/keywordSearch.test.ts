import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { layoutProblems } from "./dataText";
import { DATA_SAMPLE_LABEL, dataTestBoxes, DEMO_SEARCH, MIN_TEXT_SIZE } from "./dataSamples";
import { highlightSegments, keywordSearchLayout } from "./keywordSearch";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("KeywordSearch: layout sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of dataTestBoxes(format))
        for (const count of [2, 3]) {
          await t.test(`${format} · ${language} · ${box.h}px · ${count} resultados`, () => {
            const demo = DEMO_SEARCH[language];
            const data = { ...demo, results: demo.results.slice(0, count), language, sampleLabel: DATA_SAMPLE_LABEL[language] };
            const layout = keywordSearchLayout(box, data, format);
            assert.deepEqual(layoutProblems(layout.blocks, box), []);
            assert.equal(layout.results.length, count);
            for (let i = 1; i < layout.results.length; i++) assert.ok(!overlaps(layout.results[i - 1].card, layout.results[i].card), "resultados pisados");
            // El badge de ejemplo está en la cabecera de resultados, no sobre un resultado.
            for (const result of layout.results) assert.ok(!overlaps(layout.sample.box, result.card));
            // Cada fragmento entra completo (las líneas que pide no superan el máximo).
            for (const result of layout.results) assert.ok(result.fragment.lines <= 3);
            for (const block of layout.blocks) if (block.kind === "text") assert.ok(block.size >= MIN_TEXT_SIZE[format], `${block.id} queda chico (${block.size}px)`);
          });
        }
});

test("KeywordSearch: resalta palabras por término, sin tildes ni mayúsculas", () => {
  const segments = highlightSegments("En adultos mayores la Dosis de semaglutida se sube.", ["dosis", "semaglutida", "adultos", "mayores"]);
  assert.equal(segments.map((segment) => segment.text).join(""), "En adultos mayores la Dosis de semaglutida se sube.");
  assert.deepEqual(segments.filter((segment) => segment.hit).map((segment) => segment.text), ["adultos mayores", "Dosis", "semaglutida"]);
  assert.deepEqual(highlightSegments("Búsqueda rápida", ["busqueda"]).filter((segment) => segment.hit).map((segment) => segment.text), ["Búsqueda"]);
  assert.deepEqual(highlightSegments("Sin coincidencias", ["dosis"]), [{ text: "Sin coincidencias", hit: false }]);
  // No marca dentro de otra palabra ("adosis" no empieza con "dosis").
  assert.equal(highlightSegments("adosis", ["dosis"]).some((segment) => segment.hit), false);
});

test("KeywordSearch: cada resultado de ejemplo contiene al menos un término", () => {
  for (const language of LANGUAGES) {
    const demo = DEMO_SEARCH[language];
    for (const result of demo.results) assert.ok(highlightSegments(result.fragment, demo.tokens).some((segment) => segment.hit), result.fragment);
    // Todos los términos aparecen marcados en la consulta.
    const marked = highlightSegments(demo.query, demo.tokens).filter((segment) => segment.hit).map((segment) => segment.text.toLowerCase()).join(" ");
    for (const token of demo.tokens) assert.ok(marked.includes(token), token);
    assert.match(demo.methodLabel, /BM25/);
  }
});
