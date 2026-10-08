import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { ROG_ASSETS, ROG_CHAPTERS, ROG_COPY, ROG_DURATION, ROG_FACTS, ROG_PROFILES, ROG_SCENES, ROG_STEPS } from "./rangelOviedo";

const dossier = readDossier("rangel-oviedo-group.md");

test("film insignia de Rangel Oviedo Group", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(ROG_SCENES, ROG_DURATION, "goal-paths");
    assertChapters(ROG_CHAPTERS, ROG_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(ROG_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(ROG_ASSETS);
  });

  await t.test("perfiles y etapas coinciden con las cifras verificadas", () => {
    assert.equal(ROG_PROFILES.length, ROG_FACTS.profiles.value);
    assert.equal(ROG_STEPS.length, ROG_FACTS.methodSteps.value);
  });

  await t.test("copia honesta: sin ROI garantizado, sin CRM inventado", () => {
    assertHonestCopy([...strings(ROG_COPY), ...strings(ROG_CHAPTERS)], [/ROI/i, /garantiz/i, /CRM/i]);
  });
});
