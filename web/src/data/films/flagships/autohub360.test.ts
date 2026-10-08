import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { AUTOHUB_ASSETS, AUTOHUB_CHAPTERS, AUTOHUB_COPY, AUTOHUB_DURATION, AUTOHUB_FACTS, AUTOHUB_HOTSPOTS, AUTOHUB_SCENES } from "./autohub360";

const dossier = readDossier("autohub-360.md");

test("film insignia de AutoHub 360", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(AUTOHUB_SCENES, AUTOHUB_DURATION, "interior-tour");
    assertChapters([...AUTOHUB_CHAPTERS], AUTOHUB_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(AUTOHUB_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(AUTOHUB_ASSETS);
  });

  await t.test("los puntos de interés del visor coinciden con las cifras verificadas", () => {
    assert.equal(AUTOHUB_HOTSPOTS.length, AUTOHUB_FACTS.tourHotspots.value);
  });

  await t.test("copia honesta: sin garantías inventadas ni métricas ficticias", () => {
    assertHonestCopy([...strings(AUTOHUB_COPY), ...strings(AUTOHUB_CHAPTERS)], [/ROI/i, /garantiz/i, /duplic/i, /triplic/i, /pasarela de compra/i]);
  });
});
