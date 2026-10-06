import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { MEDIA_ASSETS, MEDIA_SAMPLES, mediaTestBoxes } from "./mediaSamples";
import { GLYPH_EM, LINE_HEIGHT } from "./mediaShared";
import { shotStackLayout, type ShotFrameKind } from "./shotStack";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;
const FRAMES: ShotFrameKind[] = ["card", "phone"];
const SHOTS = [MEDIA_ASSETS.bookingDay, MEDIA_ASSETS.bookingTime, MEDIA_ASSETS.bookingDetails];
const shift = (box: Box, dx: number): Box => ({ ...box, x: box.x + dx });

test("ShotStack: pasos y capturas sin solapes, a escala ≤ 1:1", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of mediaTestBoxes(format))
        for (const frame of FRAMES)
          for (const labels of [MEDIA_SAMPLES[language].steps, MEDIA_SAMPLES[language].phoneSteps]) {
            await t.test(`${format} · ${language} · ${box.h}px · ${frame} · ${labels[0]}`, () => {
              const shots = SHOTS.map((shot, index) => ({ ...shot, label: labels[index] }));
              const layout = shotStackLayout(box, { shots, frame }, format);
              assert.ok(inside(layout.stepper, box) && inside(layout.viewport, box));
              assert.ok(!overlaps(layout.stepper, layout.viewport), "la banda de pasos pisa las capturas");

              // Banda de pasos: fichas separadas, rótulos que entran, líneas entre fichas.
              layout.chips.forEach((chip, index) => {
                assert.ok(inside(chip.chip, layout.stepper), `ficha ${index} fuera de la banda`);
                assert.ok(inside(chip.dot, chip.chip));
                assert.ok(chip.label, `falta el rótulo ${index}`);
                assert.ok(inside(chip.label, chip.chip) && !overlaps(chip.label, chip.dot));
                assert.ok(fitsLines(labels[index], layout.labelSize, chip.label.w, layout.labelLines, GLYPH_EM.body), `rótulo ${index} no entra`);
                assert.ok(chip.label.h >= layout.labelLines * layout.labelSize * LINE_HEIGHT.label - 0.5);
              });
              for (let i = 0; i < layout.chips.length; i++)
                for (let j = i + 1; j < layout.chips.length; j++) assert.ok(!overlaps(layout.chips[i].chip, layout.chips[j].chip), `fichas ${i} y ${j} pisadas`);
              assert.equal(layout.connectors.length, shots.length - 1);
              // Las líneas pasan entre números y rótulos, nunca por encima.
              for (const line of layout.connectors)
                for (const chip of layout.chips) {
                  assert.ok(!overlaps(line, chip.dot), "la línea cruza un número");
                  if (chip.label) assert.ok(!overlaps(line, chip.label), "la línea cruza un rótulo");
                }

              // Capturas: nunca ampliadas; la pantalla dentro del marco; el sobrante se recorre.
              layout.cards.forEach((card, index) => {
                const shot = shots[index];
                assert.ok(card.scale <= 1 + 1e-9, `captura ${index} ampliada`);
                assert.ok(Math.abs(card.screen.w - shot.w * card.scale) < 0.5);
                assert.ok(inside(card.screen, card.frame));
                assert.ok(card.screen.y >= layout.viewport.y - 0.5 && card.frame.y + card.frame.h <= layout.viewport.y + layout.viewport.h + 0.5, `marco ${index} fuera de la fila`);
                assert.ok(Math.abs(card.pan - (card.shotH - card.screen.h)) < 0.5 && card.pan >= 0);
              });
              for (let i = 0; i < layout.cards.length; i++)
                for (let j = i + 1; j < layout.cards.length; j++) assert.ok(!overlaps(layout.cards[i].frame, layout.cards[j].frame), `marcos ${i} y ${j} pisados`);

              if (!layout.carousel) for (const card of layout.cards) assert.ok(inside(card.frame, box), "en 16:9 todas las capturas entran");
              // En carrusel, el paso activo queda entero y centrado.
              else layout.trackOffset.forEach((offset, index) => assert.ok(inside(shift(layout.cards[index].frame, offset), box), `paso ${index} cortado`));
            });
          }
});

test("ShotStack: un rótulo largo se apila debajo del número antes que pisar a su vecino", () => {
  const label = "Confirmación por correo electrónico del turno";
  const shots = SHOTS.map((shot) => ({ ...shot, label }));
  for (const format of FORMATS)
    for (const box of mediaTestBoxes(format)) {
      const layout = shotStackLayout(box, { shots }, format);
      assert.equal(layout.chipStyle, "stacked");
      assert.ok(layout.labelLines <= 2);
      for (let i = 1; i < layout.chips.length; i++) assert.ok(!overlaps(layout.chips[i - 1].chip, layout.chips[i].chip));
      for (const chip of layout.chips) {
        assert.ok(chip.label && inside(chip.label, box) && !overlaps(chip.label, chip.dot));
        assert.ok(fitsLines(label, layout.labelSize, chip.label.w, layout.labelLines, GLYPH_EM.body));
        for (const line of layout.connectors) assert.ok(!overlaps(line, chip.label) && !overlaps(line, chip.dot));
      }
      assert.ok(!overlaps(layout.stepper, layout.viewport));
    }
});
