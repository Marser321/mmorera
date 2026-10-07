import test from "node:test";
import assert from "node:assert/strict";
import { safeArea, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import {
  fenixOpeningLayout,
  fenixMechanismLayout,
  fenixDoseStripLayout,
  fenixSiteNoteLayout,
  fenixEngineeringLayout,
} from "./fenixFilmLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const SCREEN_SIZE: Record<FilmFormatName, { w: number; h: number }> = {
  landscape: { w: 1600, h: 900 },
  portrait: { w: 1080, h: 1350 },
};

test("fenixFilmLayout: cajas propias de Fénix sin solapes y dentro de área", async (t) => {
  for (const format of FORMATS) {
    const { w, h } = SCREEN_SIZE[format];
    const safe = safeArea(format);

    await t.test(`${format}: apertura calculada con placa y textos alineados`, () => {
      const layout = fenixOpeningLayout(format, w, h, "Donde tu salud renace");
      assert.ok(layout.placed.w > 0 && layout.placed.h > 0);
      assert.ok(layout.textW > 0);
      assert.ok(layout.kickerY < layout.textY, "el kicker debe estar arriba del título");
      assert.ok(layout.size >= 40, "tamaño mínimo del título");
      assert.ok(layout.logoSize > 0);
      assert.ok(layout.plateBox.y >= 0);
      assert.ok(layout.textY + layout.textH <= h, "el texto entra en la pantalla");
    });

    await t.test(`${format}: mecanismo divide área en texto y tira de sesiones sin solapes`, () => {
      const { doseText, doseStrip } = fenixMechanismLayout(safe, format);
      assert.ok(!overlaps(doseText, doseStrip), "doseText y doseStrip no se solapan");
      assert.ok(doseText.w > 0 && doseText.h > 0);
      assert.ok(doseStrip.w > 0 && doseStrip.h > 0);
    });

    await t.test(`${format}: tira de dosis dimensionada con barras y grupo visible`, () => {
      const { doseStrip } = fenixMechanismLayout(safe, format);
      const layout = fenixDoseStripLayout(doseStrip, format, 60);
      assert.ok(layout.barW >= 3, "ancho de barra mínimo");
      assert.ok(layout.barsY >= layout.top, "las barras van debajo del encabezado");
      assert.ok(layout.pitch > 0);
    });

    await t.test(`${format}: sitio divide cuerpo en contenido y nota sin solapes`, () => {
      const layout = fenixSiteNoteLayout(safe, format);
      assert.ok(!overlaps(layout.main, layout.note), "main y note no se solapan");
      assert.ok(layout.main.h > 0);
      assert.ok(layout.note.h > 0);
    });

    await t.test(`${format}: ingeniería divide cuerpo en facts, grid y agents sin solapes`, () => {
      const layout = fenixEngineeringLayout(safe, format);
      assert.ok(!overlaps(layout.factsBox, layout.gridBox), "facts y grid no se solapan");
      assert.ok(!overlaps(layout.main, layout.agents), "main y agents no se solapan");
      assert.ok(layout.factsBox.h > 0);
      assert.ok(layout.gridBox.h > 0);
      assert.ok(layout.agents.h > 0);
    });
  }
});
