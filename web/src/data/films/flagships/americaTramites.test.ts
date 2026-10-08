import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { AT_ASSETS, AT_CHAPTERS, AT_COPY, AT_DURATION, AT_FACTS, AT_SCENES, AT_STAGES } from "./americaTramites";

const dossier = readDossier("america-tramites.md");

test("film insignia de América Trámites", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(AT_SCENES, AT_DURATION, "staged-form");
    assertChapters(AT_CHAPTERS, AT_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(AT_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(AT_ASSETS);
  });

  await t.test("etapas del protagonista coinciden con las cifras verificadas", () => {
    assert.equal(AT_STAGES.length, AT_FACTS.filings.value);
  });

  await t.test("copia honesta: sin asesoría legal, sin portal consular, sin garantías", () => {
    assertHonestCopy([...strings(AT_COPY), ...strings(AT_CHAPTERS)], [/ROI/i, /garantiz/i, /portal consular/i, /abogado/i]);
  });
});
