import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { EVO_ASSETS, EVO_CHAPTERS, EVO_COPY, EVO_DURATION, EVO_FACTS, EVO_FINISHES, EVO_SCENES } from "./evowrap";

const dossier = readDossier("evowrap.md");

test("film insignia de EvoWrap", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(EVO_SCENES, EVO_DURATION, "finish-selector");
    assertChapters(EVO_CHAPTERS, EVO_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(EVO_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(EVO_ASSETS);
  });

  await t.test("acabados del configurador coinciden con las cifras verificadas", () => {
    assert.equal(EVO_FINISHES.length, EVO_FACTS.finishes.value);
  });

  await t.test("copia honesta: sin garantías inventadas ni métricas ficticias", () => {
    assertHonestCopy([...strings(EVO_COPY), ...strings(EVO_CHAPTERS)], [/ROI/i, /garantiz/i, /duplic/i, /triplic/i, /pasarela de compra/i]);
  });
});
