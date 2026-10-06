import test from "node:test";
import assert from "node:assert/strict";
import { coverSize, maxCameraScale } from "./filmCamera";

test("cámara de los films", async (t) => {
  await t.test("la captura cubre el visor a escala 1", () => {
    assert.deepEqual(coverSize({ w: 1380, h: 580 }, 1.6), { w: 1380, h: 862.5 });
    assert.deepEqual(coverSize({ w: 1000, h: 842 }, 1.6), { w: 1347.2, h: 842 });
  });

  await t.test("el zoom máximo es la resolución nativa sobre el ancho dibujado", () => {
    assert.ok(Math.abs(maxCameraScale(1440, { w: 1380, h: 580 }, 1.6) - 1440 / 1380) < 1e-9);
    // Con capturas a 2× el mismo visor admite el doble de acercamiento.
    assert.ok(Math.abs(maxCameraScale(2880, { w: 1380, h: 580 }, 1.6) - 2880 / 1380) < 1e-9);
  });

  await t.test("nunca exige alejarse más que el encuadre completo", () => {
    assert.equal(maxCameraScale(800, { w: 1380, h: 580 }, 1.6), 1);
  });
});
