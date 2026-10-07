import test from "node:test";
import assert from "node:assert/strict";
import { assertAssets, assertChapters, assertFactsInDossier, assertHonestCopy, assertStructure, readDossier, strings } from "./flagshipAssertions";
import { TC_ASSETS, TC_BILINGUAL, TC_CHAPTERS, TC_COPY, TC_DURATION, TC_FACTS, TC_LINES, TC_QUOTE_ASSETS, TC_SCENES, TC_TIMELINE, tcQuoteShots } from "./truckersChoice";

const dossier = readDossier("truckers-choice.md");

test("film insignia de Truckers Choice", async (t) => {
  await t.test("estructura, protagonista y capítulos", () => {
    assertStructure(TC_SCENES, TC_DURATION, "bilingual-split");
    assertChapters(TC_CHAPTERS, TC_DURATION);
  });

  await t.test("cada cifra está en el dossier", () => assertFactsInDossier(TC_FACTS, dossier));

  await t.test("los medios miden lo que declaran", () => {
    assertAssets(TC_ASSETS);
    for (const stop of TC_BILINGUAL) assertAssets({ en: stop.en, es: stop.es });
    for (const language of ["es", "en"] as const) assertAssets(TC_QUOTE_ASSETS[language]);
  });

  await t.test("las líneas suman los 30 trámites del catálogo y caen en los 4 pasos", () => {
    assert.equal(TC_LINES.length, TC_FACTS.lines.value);
    assert.equal(TC_LINES.reduce((sum, line) => sum + line.filings, 0), TC_FACTS.filings.value);
    for (const line of TC_LINES) assert.ok(line.step >= 0 && line.step < TC_FACTS.steps.value, `${line.id}: paso fuera de la hoja de ruta`);
    for (const language of ["es", "en"] as const) assert.equal(TC_COPY[language].roofSteps.length, TC_FACTS.steps.value);
  });

  await t.test("copia honesta: sin montos, sin envíos que el sitio no hace", () => {
    assertHonestCopy([...strings(TC_COPY), ...strings(TC_CHAPTERS)], [/\$\s?\d/, /CRM|GoHighLevel|lead/i]);
    // El formulario está en vista previa: el film lo dice en las dos lenguas.
    assert.match(TC_COPY.es.quoteNote, /vista previa/);
    assert.match(TC_COPY.en.quoteNote, /preview mode/);
  });
});

test("Truckers: las tomas de la cotización cubren la escena, una nota por vez", () => {
  for (const language of ["es", "en"] as const) {
    let expected = 0;
    for (const shot of tcQuoteShots(language)) {
      assert.equal(shot.from, expected, `${shot.name} no es contigua`);
      expected += shot.duration;
      assert.ok(shot.name in TC_QUOTE_ASSETS[language], `${shot.name} no es un asset`);
      assert.ok(shot.path.startsWith(`/${language}`), `${shot.name}: la ruta no es la del idioma`);
      for (const note of shot.notes) {
        assert.ok(TC_COPY[language].quoteNotes[note.key as keyof typeof TC_COPY.es.quoteNotes], `falta el rótulo de ${note.key}`);
        const [x, y, w, h] = note.rect;
        assert.ok(x >= 0 && y >= 0 && x + w <= 1 && y + h <= 1, `${shot.name}: rectángulo fuera de la captura`);
      }
    }
    assert.equal(expected, TC_TIMELINE.quote.duration, "las tomas no cubren la escena");
  }
});
