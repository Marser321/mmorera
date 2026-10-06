import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { MANIFESTO_KICKER_TRACKING, manifestoBeatsLayout, manifestoSchedule } from "./manifestoBeats";
import { MEDIA_SAMPLES, mediaTestBoxes } from "./mediaSamples";
import { fitsText, GLYPH_EM, LINE_HEIGHT } from "./mediaShared";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("ManifestoBeats: cada frase entra en su banda", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of mediaTestBoxes(format))
        for (const align of ["left", "center"] as const)
          for (const maxLines of [2, 3, 4]) {
            await t.test(`${format} · ${language} · ${box.h}px · ${align} · ${maxLines} líneas`, () => {
              const beats = MEDIA_SAMPLES[language].beats;
              const layout = manifestoBeatsLayout(box, { beats, align, maxLines }, format);
              assert.equal(layout.beats.length, beats.length);
              // Tamaño parejo por defecto (ritmo del manifiesto).
              assert.equal(new Set(layout.beats.map((beat) => beat.size)).size, 1);
              layout.beats.forEach((boxes, index) => {
                const beat = beats[index];
                assert.ok(inside(boxes.text, box), `beat ${index}: texto fuera de la banda`);
                assert.ok(boxes.lines <= maxLines, `beat ${index}: más líneas que el máximo`);
                assert.ok(fitsText(beat.text, boxes.size, boxes.text.w, boxes.lines, GLYPH_EM.display), `beat ${index}: no entra a ${boxes.size}px`);
                assert.ok(boxes.text.h >= boxes.lines * boxes.size * LINE_HEIGHT.display - 0.5);
                assert.ok(boxes.size >= (format === "portrait" ? 42 : 34), `beat ${index}: queda chico`);
                if (beat.kicker) {
                  assert.ok(boxes.kicker, `beat ${index}: falta la caja de la etiqueta`);
                  assert.ok(inside(boxes.kicker, box));
                  assert.ok(!overlaps(boxes.kicker, boxes.text), `beat ${index}: etiqueta sobre el texto`);
                  assert.ok(fitsLines(beat.kicker, boxes.kickerSize, boxes.kicker.w, 1, GLYPH_EM.label(MANIFESTO_KICKER_TRACKING)));
                } else assert.equal(boxes.kicker, null);
              });
            });
          }
});

test("ManifestoBeats: dos beats nunca conviven en el tiempo", () => {
  const duration = 300;
  const cases = [
    [{ from: 0, to: 80 }, { from: 80, to: 160 }, { from: 160, to: 300 }],
    // Tiempos mal cargados: se pisan, empiezan antes de 0 o pasan el final.
    [{ from: -10, to: 120 }, { from: 90, to: 200 }, { from: 150, to: 400 }],
    [{ from: 50, to: 40 }, { from: 30, to: 90 }],
  ];
  for (const beats of cases) {
    const schedule = manifestoSchedule(beats, duration);
    assert.equal(schedule.length, beats.length);
    schedule.forEach((slot, index) => {
      assert.ok(slot.from >= 0 && slot.to <= duration && slot.from <= slot.to);
      if (index > 0) assert.ok(slot.from >= schedule[index - 1].to, "un beat empieza antes de que salga el anterior");
    });
    // En cada frame hay a lo sumo un beat visible.
    for (let frame = 0; frame < duration; frame++) assert.ok(schedule.filter((slot) => frame >= slot.from && frame < slot.to).length <= 1);
  }
});
