import test from "node:test";
import assert from "node:assert/strict";
import { containBox, fitsLines, gridBoxes, inside, overlaps, safeArea, splitColumns, stackBands } from "./filmLayout";

test("geometría de escenas", async (t) => {
  await t.test("la zona útil queda dentro de la composición y fuera de las barras", () => {
    const land = safeArea("landscape");
    assert.ok(land.y >= 0.07 * 900 && land.y + land.h <= 900 - 0.07 * 900);
    const port = safeArea("portrait");
    assert.ok(port.y >= 0.045 * 1350 && port.y + port.h <= 1350 - 0.045 * 1350);
  });

  await t.test("las bandas apiladas no se pisan y llenan el área", () => {
    const area = { x: 0, y: 100, w: 800, h: 600 };
    const bands = stackBands(area, [{ id: "title", h: 120 }, { id: "plate", flex: 1 }, { id: "caption", h: 80 }], 20);
    assert.equal(bands.title.y, 100);
    assert.ok(!overlaps(bands.title, bands.plate) && !overlaps(bands.plate, bands.caption));
    assert.equal(Math.round(bands.caption.y + bands.caption.h), 700);
  });

  await t.test("columnas y grillas respetan el área y la separación", () => {
    const area = { x: 10, y: 10, w: 1000, h: 400 };
    const [a, b] = splitColumns(area, [2, 1], 40);
    assert.ok(!overlaps(a, b) && inside(a, area) && inside(b, area));
    const cells = gridBoxes(area, 5, { cols: 3, gap: 10 });
    for (const cell of cells) assert.ok(inside(cell, area));
    for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) assert.ok(!overlaps(cells[i], cells[j]));
  });

  await t.test("encajar un medio nunca lo recorta", () => {
    const box = containBox({ x: 0, y: 0, w: 1000, h: 400 }, 16 / 9);
    assert.ok(Math.abs(box.w / box.h - 16 / 9) < 1e-9 && box.h <= 400);
  });

  await t.test("estimación de líneas", () => {
    assert.ok(fitsLines("La dosis es el claim", 60, 900, 1));
    assert.ok(!fitsLines("Tu médico de cabecera, que también conoce tu plan de longevidad", 60, 600, 2));
  });
});
