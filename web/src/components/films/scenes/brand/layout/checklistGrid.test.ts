import test from "node:test";
import assert from "node:assert/strict";
import { inside, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { checklistGridLayout, counterText } from "./checklistGrid";
import { layoutProblems } from "./dataText";
import { DATA_SAMPLE_LABEL, dataTestBoxes, DEMO_CHECKLIST, MIN_TEXT_SIZE } from "./dataSamples";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("ChecklistGrid: layout sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of dataTestBoxes(format))
        for (const total of [24, 98, 140]) {
          await t.test(`${format} · ${language} · ${box.h}px · ${total} chequeos`, () => {
            const data = { ...DEMO_CHECKLIST[language], total, passed: total, language, sampleLabel: DATA_SAMPLE_LABEL[language] };
            const layout = checklistGridLayout(box, data, format);
            assert.deepEqual(layoutProblems(layout.blocks, box), []);
            assert.equal(layout.cells.length, total);
            for (const cell of layout.cells) assert.ok(inside(cell, layout.plate));
            // Celdas vecinas separadas (mismo tamaño, sin tocarse).
            for (let i = 1; i < layout.cells.length; i++) assert.ok(!overlaps(layout.cells[i - 1], layout.cells[i]));
            assert.ok(layout.cells[0].w >= (format === "portrait" ? 30 : 24), "celdas demasiado chicas");
            assert.equal(layout.chips.length, data.groups.length);
            for (const block of layout.blocks) if (block.kind === "text") assert.ok(block.size >= MIN_TEXT_SIZE[format], `${block.id} queda chico (${block.size}px)`);
          });
        }
});

test("ChecklistGrid: el contador final dice passed/total en el formato del idioma", () => {
  assert.equal(counterText(98, 98, "es"), "98/98");
  assert.equal(counterText(1200, 1200, "es"), "1.200/1.200");
  assert.equal(counterText(1200, 1250, "en"), "1,200/1,250");
  const layout = checklistGridLayout(dataTestBoxes("landscape")[0], { ...DEMO_CHECKLIST.es, language: "es" }, "landscape");
  assert.equal(layout.counter.text, "98/98");
});

test("ChecklistGrid: la leyenda no lleva cuentas por área", () => {
  for (const language of LANGUAGES) {
    const layout = checklistGridLayout(dataTestBoxes("portrait")[0], { ...DEMO_CHECKLIST[language], language }, "portrait");
    for (const chip of layout.chips) assert.doesNotMatch(chip.text.text, /\d/);
  }
});
