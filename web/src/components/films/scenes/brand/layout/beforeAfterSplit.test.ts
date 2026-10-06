import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { beforeAfterBlocks, beforeAfterLayout, beforeAfterTiming, type BeforeAfterData } from "./beforeAfterSplit";
import { BEFORE_AFTER_KICKERS, CRM_SAMPLE_LABEL, crmTestBoxes, DEMO_BEFORE_AFTER } from "./crmSamples";
import { forcedLines } from "./crmText";
import { layoutProblems, MIN_TEXT } from "./dataText";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

function demo(language: (typeof LANGUAGES)[number], sample = true): BeforeAfterData {
  const kickers = BEFORE_AFTER_KICKERS[language];
  const copy = DEMO_BEFORE_AFTER[language];
  return {
    before: { kicker: kickers.before, ...copy.before },
    after: { kicker: kickers.after, ...copy.after },
    sampleLabel: sample ? CRM_SAMPLE_LABEL[language] : undefined,
  };
}

/** Pasos más largos (dos líneas) y listas más largas, para estresar el layout. */
function long(language: (typeof LANGUAGES)[number]): BeforeAfterData {
  const base = demo(language);
  const es = language === "es";
  return {
    ...base,
    before: { ...base.before, steps: [{ label: es ? "Formulario de contacto del sitio" : "Website contact form" }, { label: es ? "Mail que nadie revisa" : "Email nobody checks" }, { label: es ? "Respuesta días después" : "Reply days later" }, { label: es ? "Se pierde" : "Gets lost", tone: "loss" }] },
    after: { ...base.after, steps: [...base.after.steps.slice(0, 3), { label: es ? "Recordatorio automático" : "Automatic reminder" }, { label: es ? "Seguimiento" : "Follow-up", tone: "win" }] },
  };
}

test("BeforeAfterSplit: layout sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of crmTestBoxes(format))
        for (const [name, data] of [["demo", demo(language)], ["sin badge", demo(language, false)], ["largo", long(language)]] as const) {
          await t.test(`${format} · ${language} · ${box.h}px · ${name}`, () => {
            const layout = beforeAfterLayout(box, data, format);
            const blocks = beforeAfterBlocks(layout);
            assert.deepEqual(layoutProblems(blocks, box), []);
            for (const block of blocks) {
              assert.ok(inside(block.box, box), `${block.id} sale de la caja`);
              if (block.kind !== "text") continue;
              assert.ok(block.size >= MIN_TEXT[format], `${block.id} queda chico (${block.size}px)`);
              assert.ok(fitsLines(block.text, block.size, block.box.w, block.lines, block.glyph), `${block.id} no entra`);
            }
            for (const side of [layout.before, layout.after]) {
              assert.ok(inside(side.title.box, side.column) && inside(side.kicker.box, side.column));
              side.chips.forEach((chip) => {
                assert.ok(inside(chip.frame, side.column), `${chip.text.id} sale de su columna`);
                assert.ok(inside(chip.text.box, chip.frame) && inside(chip.mark, chip.frame));
                assert.ok(!overlaps(chip.mark, chip.text.box));
              });
              // Las rectas corren solo por los huecos entre pastillas.
              side.connectors.forEach((line) => {
                assert.ok(line.h > 0);
                for (const chip of side.chips) assert.ok(!overlaps(line, chip.frame), `${side.title.id}: una recta entra en una pastilla`);
              });
            }
            // Divisor y medallón en la calle entre columnas.
            for (const piece of [layout.divider, layout.medallion]) {
              assert.ok(!overlaps(piece, layout.before.column) && !overlaps(piece, layout.after.column));
            }
            // Las dos listas comparten la grilla: la fila n de un lado queda a la altura de la fila n del otro.
            layout.before.chips.forEach((chip, index) => {
              const other = layout.after.chips[index];
              if (other) assert.equal(chip.frame.y, other.frame.y);
            });
          });
        }
});

test("BeforeAfterSplit: los cortes \"\\n\" del título se respetan al medir", () => {
  assert.equal(forcedLines("Cada lead\nsigue un camino", 40, 600), 2);
  assert.equal(forcedLines("Cada lead sigue un camino", 40, 2000), 1);
  for (const format of FORMATS)
    for (const language of LANGUAGES) {
      const layout = beforeAfterLayout(crmTestBoxes(format)[0], demo(language), format);
      // Los títulos de la demo traen un corte fijo: nunca se reservan menos de dos líneas.
      assert.ok(layout.sizes.titleLines >= 2);
      assert.equal(layout.before.title.lines, layout.after.title.lines);
    }
});

test("BeforeAfterSplit: revelado secuencial que termina dentro de la escena", () => {
  for (const language of LANGUAGES)
    for (const data of [demo(language), long(language)])
      for (const duration of [150, 210, 270, 360]) {
        const timing = beforeAfterTiming(data.before.steps, data.after.steps, duration);
        assert.ok(timing.pace > 0 && timing.pace <= 1);
        assert.ok(timing.end * timing.pace <= duration, `${duration}f: el guion termina en ${timing.end * timing.pace}`);
        // Primero el lado de antes entero, después el divisor y recién ahí el lado de después.
        const lastBefore = timing.beforeAt[timing.beforeAt.length - 1];
        assert.ok(timing.dividerAt > lastBefore);
        assert.ok(timing.afterHead > timing.dividerAt);
        assert.ok(timing.afterAt[0] > timing.afterHead);
        for (const list of [timing.beforeAt, timing.afterAt]) for (let i = 1; i < list.length; i++) assert.ok(list[i] > list[i - 1]);
        assert.ok(timing.settleAt > timing.afterAt[timing.afterAt.length - 1]);
      }
});
