import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { MR_ASSETS, MR_BODY, MR_CHAPTERS, MR_COPY, MR_DURATION, MR_FACTS, MR_FLOW_SHOTS, MR_SCENES, MR_TIMELINE } from "./mrStudio";

const dossier = readDossier("mr-studio.md");

test("film insignia de Mr. Studio Tattoo", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(MR_SCENES, MR_DURATION, "body-selector");
    assertChapters(MR_CHAPTERS, MR_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(MR_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => assertAssets(MR_ASSETS));

  await t.test("copia honesta: sin porcentajes, precios del sitio ni la versión roja", () => {
    // El film no inventa montos: el depósito se nombra, nunca se cifra.
    assertHonestCopy([...strings(MR_COPY), ...strings(MR_CHAPTERS)], [/\$\s?\d/, /Playfair|Studio Red/i]);
    for (const language of ["es", "en"] as const) {
      assert.ok(MR_COPY[language].sampleLabel.length > 0, "el brief necesita su rótulo de ejemplo");
      for (const shot of MR_FLOW_SHOTS) for (const note of shot.notes) assert.ok(MR_COPY[language].flowNotes[note.key as keyof typeof MR_COPY.es.flowNotes], `falta el rótulo de ${note.key}`);
      assert.match(MR_COPY[language].flowNote, /ejemplo|sample/i);
    }
  });

  await t.test("el recorte de la figura cae dentro de las capturas del paso 5", () => {
    for (const asset of [MR_ASSETS.zone, MR_ASSETS.zoneForearm, MR_ASSETS.zoneBack]) {
      assert.ok(MR_BODY.window.x >= 0 && MR_BODY.window.y >= 0 && MR_BODY.window.x + MR_BODY.window.w <= asset.w && MR_BODY.window.y + MR_BODY.window.h <= asset.h);
    }
    const { forearm, window } = MR_BODY;
    assert.ok(forearm.x > window.x && forearm.x < window.x + window.w && forearm.y > window.y && forearm.y < window.y + window.h, "el antebrazo está dentro de la ventana");
  });
});

test("Mr. Studio: las tomas de la reserva cubren la escena y una nota por vez", () => {
  let expected = 0;
  for (const shot of MR_FLOW_SHOTS) {
    assert.equal(shot.from, expected, `${shot.name} no es contigua`);
    expected += shot.duration;
    for (const note of shot.notes) {
      assert.ok(note.from >= 0 && note.to <= shot.duration && note.from < note.to);
      const [x, y, w, h] = note.rect;
      assert.ok(x >= 0 && y >= 0 && x + w <= 1 && y + h <= 1, `${shot.name}: rectángulo fuera de la captura`);
    }
  }
  assert.equal(expected, MR_TIMELINE.flow.duration, "las tomas no cubren la escena del flujo");
  for (const shot of MR_FLOW_SHOTS) assert.ok(shot.name in MR_ASSETS, `${shot.name} no es un asset`);
});
