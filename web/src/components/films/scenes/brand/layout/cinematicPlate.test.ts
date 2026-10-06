import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { cinematicPlateLayout, PLATE_KICKER_TRACKING } from "./cinematicPlate";
import { MEDIA_ASSETS, MEDIA_SAMPLES, mediaTestBoxes } from "./mediaSamples";
import { fitsText, GLYPH_EM, LINE_HEIGHT } from "./mediaShared";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;
const ASSETS = [MEDIA_ASSETS.corridor, MEDIA_ASSETS.chamber, MEDIA_ASSETS.plasma, { w: 800, h: 450 }];

const covers = (outer: Box, inner: Box) => outer.x <= inner.x + 0.5 && outer.y <= inner.y + 0.5 && outer.x + outer.w >= inner.x + inner.w - 0.5 && outer.y + outer.h >= inner.y + inner.h - 0.5;

test("CinematicPlate: placa, recorte y leyenda sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of mediaTestBoxes(format))
        for (const asset of ASSETS)
          for (const withCaption of [true, false]) {
            await t.test(`${format} · ${language} · ${box.h}px · ${asset.w}×${asset.h} · ${withCaption ? "con" : "sin"} leyenda`, () => {
              const caption = withCaption ? MEDIA_SAMPLES[language].plateCaption : undefined;
              const layout = cinematicPlateLayout(box, { asset, caption }, format);
              const aspect = asset.w / asset.h;

              assert.ok(inside(layout.plate, box), "la placa sale de la caja");
              assert.ok(covers(layout.media, layout.plate), "el medio no cubre la placa");
              // Nunca por encima de la resolución nativa, ni siquiera con el empuje máximo.
              assert.ok(layout.media.w <= asset.w + 0.5, "medio ampliado");
              assert.ok(layout.maxPush >= 1 && layout.media.w * layout.maxPush <= asset.w + 0.5, "el empuje amplía el medio");
              assert.ok(Math.abs(layout.media.w / layout.media.h - aspect) < 1e-6, "medio deformado");
              if (format === "portrait") assert.ok(Math.abs(layout.plate.w / layout.plate.h - aspect) < 1e-6, "en 4:5 la placa es una banda sin recorte");
              else assert.ok(layout.plate.w / layout.plate.h <= 2.39 + 1e-6, "recorte más ancho que anamórfico");

              if (!caption) return assert.equal(layout.caption, null);
              const boxes = layout.caption;
              assert.ok(boxes);
              const texts = [boxes.text, ...(boxes.kicker ? [boxes.kicker] : [])];
              for (const text of texts) {
                assert.ok(inside(text, box), "texto fuera de la caja");
                assert.ok(!overlaps(text, layout.plate), "texto sobre la placa");
              }
              if (boxes.kicker) assert.ok(!overlaps(boxes.kicker, boxes.text), "etiqueta sobre el texto");
              assert.ok(fitsText(caption.text, boxes.size, boxes.text.w, boxes.lines, GLYPH_EM.display), "la leyenda no entra");
              assert.ok(boxes.text.h >= boxes.lines * boxes.size * LINE_HEIGHT.display - 0.5);
              if (boxes.kicker && caption.kicker) assert.ok(fitsLines(caption.kicker, boxes.kickerSize, boxes.kicker.w, 1, GLYPH_EM.label(PLATE_KICKER_TRACKING)));
            });
          }
});

test("CinematicPlate: el punto focal mueve el recorte sin destapar la placa", () => {
  const box = mediaTestBoxes("landscape")[0];
  for (const x of [0, 0.3, 0.5, 1])
    for (const y of [0, 0.5, 1]) {
      const layout = cinematicPlateLayout(box, { asset: MEDIA_ASSETS.corridor, focal: { x, y } }, "landscape");
      assert.ok(covers(layout.media, layout.plate));
    }
});
