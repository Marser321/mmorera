import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { LNB_ASSETS, LNB_BUILDER_STEPS, LNB_CHAPTERS, LNB_COPY, LNB_DURATION, LNB_FACTS, LNB_SCENES, LNB_STUDIOS, LNB_TIERS } from "./lnbSaas";

const dossier = readDossier("lnb-saas.md");

test("film insignia de La Nueva Brasil (LNB SaaS)", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(LNB_SCENES, LNB_DURATION, "cake-builder");
    assertChapters([...LNB_CHAPTERS], LNB_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(LNB_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(LNB_ASSETS);
  });

  await t.test("los studios, pasos y planes coinciden con las cifras verificadas", () => {
    assert.equal(LNB_STUDIOS.length, LNB_FACTS.studiosCount.value);
    assert.equal(LNB_BUILDER_STEPS.length, LNB_FACTS.builderSteps.value);
    assert.equal(LNB_TIERS.length, 3);
  });

  await t.test("copia honesta: sin garantías inventadas ni país prohibido", () => {
    assertHonestCopy([...strings(LNB_COPY), ...strings(LNB_CHAPTERS)], [
      /\d+\s?%/,
      /ROI/i,
      /garantiz/i,
      /duplic/i,
      /triplic/i,
      new RegExp("Uru" + "guay", "i"),
    ]);
  });
});
