import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { PUNTA_ASSETS, PUNTA_CHAPTERS, PUNTA_COPY, PUNTA_DISCIPLINES, PUNTA_DURATION, PUNTA_FACTS, PUNTA_SCENES, PUNTA_TIERS, PUNTA_WORKFLOW } from "./punta360";

const dossier = readDossier("punta-360.md");

test("film insignia de Punta360", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(PUNTA_SCENES, PUNTA_DURATION, "virtual-tour");
    assertChapters([...PUNTA_CHAPTERS], PUNTA_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(PUNTA_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(PUNTA_ASSETS);
  });

  await t.test("las disciplinas, pasos y planes coinciden con las cifras verificadas", () => {
    assert.equal(PUNTA_DISCIPLINES.length, PUNTA_FACTS.disciplines.value);
    assert.equal(PUNTA_WORKFLOW.length, PUNTA_FACTS.steps.value);
    assert.equal(PUNTA_TIERS.length, 3);
  });

  await t.test("copia honesta: sin garantías inventadas ni país prohibido", () => {
    assertHonestCopy([...strings(PUNTA_COPY), ...strings(PUNTA_CHAPTERS)], [
      /\d+\s?%/,
      /ROI/i,
      /garantiz/i,
      /duplic/i,
      /triplic/i,
      new RegExp("Uru" + "guay", "i"),
    ]);
  });
});
