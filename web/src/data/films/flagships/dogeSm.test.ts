import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { DOGE_ASSETS, DOGE_CHAPTERS, DOGE_COPY, DOGE_DURATION, DOGE_FACTS, DOGE_SCENES, DOGE_TIERS } from "./dogeSm";

const dossier = readDossier("doge-sm.md");

test("film insignia de DOGE.S.M", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(DOGE_SCENES, DOGE_DURATION, "tier-offer");
    assertChapters([...DOGE_CHAPTERS], DOGE_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(DOGE_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(DOGE_ASSETS);
  });

  await t.test("los niveles del plan coinciden con las cifras verificadas", () => {
    assert.equal(DOGE_TIERS.length, DOGE_FACTS.tiers.value);
  });

  await t.test("copia honesta: sin garantías inventadas ni métricas ficticias", () => {
    assertHonestCopy([...strings(DOGE_COPY), ...strings(DOGE_CHAPTERS)], [/ROI/i, /garantiz/i, /duplic/i, /triplic/i, /pasarela/i, /automatiz.*tarjeta/i]);
  });
});
