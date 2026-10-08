import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import {
  HUB_PROFESIONAL_ASSETS,
  HUB_PROFESIONAL_CHAPTERS,
  HUB_PROFESIONAL_COPY,
  HUB_PROFESIONAL_DURATION,
  HUB_PROFESIONAL_FACTS,
  HUB_PROFESIONAL_PROFESSIONS,
  HUB_PROFESIONAL_PROTOCOL,
  HUB_PROFESIONAL_SCENES,
  HUB_PROFESIONAL_SERVICES,
} from "./hubProfesional";

const dossier = readDossier("hub-profesional-ai.md");

test("film insignia de Hub Profesional", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(HUB_PROFESIONAL_SCENES, HUB_PROFESIONAL_DURATION, "profession-switcher");
    assertChapters([...HUB_PROFESIONAL_CHAPTERS], HUB_PROFESIONAL_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(HUB_PROFESIONAL_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(HUB_PROFESIONAL_ASSETS);
  });

  await t.test("las profesiones, servicios y protocolo coinciden con las cifras verificadas", () => {
    assert.equal(HUB_PROFESIONAL_PROFESSIONS.length, HUB_PROFESIONAL_FACTS.professionsCount.value);
    assert.equal(HUB_PROFESIONAL_PROTOCOL.length, HUB_PROFESIONAL_FACTS.protocolSteps.value);
    assert.equal(HUB_PROFESIONAL_SERVICES.length, 4);
  });

  await t.test("copia honesta: sin garantías inventadas ni país prohibido", () => {
    assertHonestCopy([...strings(HUB_PROFESIONAL_COPY), ...strings(HUB_PROFESIONAL_CHAPTERS)], [
      /\d+\s?%/,
      /ROI/i,
      /garantiz/i,
      /duplic/i,
      /triplic/i,
      new RegExp("Uru" + "guay", "i"),
    ]);
  });
});
