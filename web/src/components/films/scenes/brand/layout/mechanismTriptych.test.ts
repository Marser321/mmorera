import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { MECHANISM_KICKER_TRACKING, mechanismTriptychLayout } from "./mechanismTriptych";
import { MEDIA_ASSETS, MEDIA_SAMPLES, mediaTestBoxes } from "./mediaSamples";
import { fitsText, GLYPH_EM, LINE_HEIGHT } from "./mediaShared";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;
const STILLS = [MEDIA_ASSETS.plasma, MEDIA_ASSETS.diffusion, MEDIA_ASSETS.angiogenesis];

function assertApart(boxes: Array<{ id: string; box: Box }>) {
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) assert.ok(!overlaps(boxes[i].box, boxes[j].box), `${boxes[i].id} pisa ${boxes[j].id}`);
}

test("MechanismTriptych: imágenes, números y leyendas sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of mediaTestBoxes(format))
        for (const withFormula of [true, false])
          for (const withBody of [true, false]) {
            await t.test(`${format} · ${language} · ${box.h}px · ${withFormula ? "con" : "sin"} fórmula · ${withBody ? "con" : "sin"} cuerpo`, () => {
              const sample = MEDIA_SAMPLES[language];
              const captions = sample.mechanism.map((caption) => (withBody ? { ...caption } : { title: caption.title }));
              const formula = withFormula ? sample.formula : undefined;
              const layout = mechanismTriptychLayout(box, { stills: STILLS, captions, formula }, format);
              assert.equal(layout.panels.length, 3);

              const all: Array<{ id: string; box: Box }> = [];
              if (formula) {
                assert.ok(layout.formula);
                all.push({ id: "fórmula", box: layout.formula.text });
                if (layout.formula.kicker) all.push({ id: "etiqueta", box: layout.formula.kicker });
                assert.ok(fitsText(formula.text, layout.formula.size, layout.formula.text.w, layout.formula.lines, GLYPH_EM.display), "la fórmula no entra");
                if (formula.kicker && layout.formula.kicker) assert.ok(fitsLines(formula.kicker, layout.formula.kickerSize, layout.formula.kicker.w, 1, GLYPH_EM.label(MECHANISM_KICKER_TRACKING)));
              } else assert.equal(layout.formula, null);

              layout.panels.forEach((panel, index) => {
                const still = STILLS[index];
                const caption = captions[index];
                // Nunca más grande que el original y sin deformar.
                assert.ok(panel.image.w <= still.w + 0.5, `imagen ${index} ampliada`);
                assert.ok(Math.abs(panel.image.w / panel.image.h - still.w / still.h) < 1e-6, `imagen ${index} deformada`);
                all.push({ id: `imagen ${index}`, box: panel.image }, { id: `número ${index}`, box: panel.chip }, { id: `título ${index}`, box: panel.title });
                if (panel.body) all.push({ id: `cuerpo ${index}`, box: panel.body });
                assert.ok(fitsText(caption.title, layout.sizes.title, panel.title.w, layout.sizes.titleLines, GLYPH_EM.display), `título ${index} no entra`);
                assert.ok(panel.title.h >= layout.sizes.titleLines * layout.sizes.title * LINE_HEIGHT.display - 0.5);
                if (caption.body) {
                  assert.ok(panel.body, `falta la caja del cuerpo ${index}`);
                  assert.ok(fitsText(caption.body, layout.sizes.body, panel.body.w, layout.sizes.bodyLines, GLYPH_EM.body), `cuerpo ${index} no entra`);
                } else assert.equal(panel.body, null);
                // La leyenda va debajo (16:9) o al costado (4:5) de su imagen, nunca encima.
                if (format === "landscape") assert.ok(panel.chip.y >= panel.image.y + panel.image.h);
                else assert.ok(panel.chip.x >= panel.image.x + panel.image.w);
              });
              for (const item of all) assert.ok(inside(item.box, box), `${item.id} sale de la caja`);
              assertApart(all);

              // Las rectas corren por su carril: no tocan textos, números ni imágenes.
              assert.equal(layout.connectors.length, 2);
              for (const line of layout.connectors) {
                assert.ok(inside(line, box));
                for (const item of all) assert.ok(!overlaps(line, item.box), `la línea cruza ${item.id}`);
              }
              // Orden de lectura: izquierda→derecha (16:9) o arriba→abajo (4:5).
              const order = layout.panels.map((panel) => (format === "landscape" ? panel.image.x : panel.image.y));
              assert.deepEqual([...order].sort((a, b) => a - b), order);
              assert.ok(layout.sizes.title >= (format === "portrait" ? 26 : 20) && layout.sizes.body >= (format === "portrait" ? 18 : 15));
            });
          }
});
