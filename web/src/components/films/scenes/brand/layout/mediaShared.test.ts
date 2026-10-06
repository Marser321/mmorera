import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines } from "@/lib/filmLayout";
import { MEDIA_SAMPLES } from "./mediaSamples";
import { connectorBetween, fitFontSize, fitsText, GLYPH_EM, isVideoSrc, lineCount, LINE_HEIGHT, plainText } from "./mediaShared";

test("medidas de texto de las escenas de medios", async (t) => {
  await t.test("los cortes forzados y el énfasis cuentan como en pantalla", () => {
    assert.equal(plainText("La *dosis* es el claim."), "La dosis es el claim.");
    assert.equal(lineCount("Normal es un rango.\nTu salud necesita contexto.", 40, 2000, GLYPH_EM.display), 2);
    assert.equal(lineCount("Una frase corta", 40, 2000, GLYPH_EM.display), 1);
    assert.ok(!Number.isFinite(lineCount("Supercalifragilístico", 80, 200, GLYPH_EM.display)));
    assert.ok(fitsText("Normal es un rango.\nTu salud necesita contexto.", 40, 900, 2, GLYPH_EM.display));
    assert.ok(!fitsText("Normal es un rango.\nTu salud necesita contexto.", 40, 900, 1, GLYPH_EM.display));
  });

  await t.test("el ajuste de tamaño respeta líneas y alto", () => {
    const text = MEDIA_SAMPLES.es.beats[0].text;
    const size = fitFontSize(text, { width: 900, height: 300, maxLines: 3, max: 96, min: 20, lineHeight: LINE_HEIGHT.display, glyphEm: GLYPH_EM.display });
    const lines = lineCount(text, size, 900, GLYPH_EM.display);
    assert.ok(lines <= 3 && lines * size * LINE_HEIGHT.display <= 300);
    assert.ok(fitsLines(plainText(text), size, 900, lines, GLYPH_EM.display));
    // Con más ancho, nunca más chico.
    assert.ok(fitFontSize(text, { width: 1200, maxLines: 3, max: 96, min: 20, lineHeight: 1.1, glyphEm: 0.56 }) >= fitFontSize(text, { width: 900, maxLines: 3, max: 96, min: 20, lineHeight: 1.1, glyphEm: 0.56 }));
  });

  await t.test("las rectas de unión solo ocupan el tramo libre", () => {
    const a = { x: 0, y: 0, w: 40, h: 40 };
    const b = { x: 200, y: 0, w: 40, h: 40 };
    const line = connectorBetween(a, b, "x", 10);
    assert.deepEqual(line, { x: 50, y: 19, w: 140, h: 2 });
    assert.equal(connectorBetween(a, { ...b, x: 50 }, "x", 10), null);
    const down = connectorBetween(a, { x: 0, y: 200, w: 40, h: 40 }, "y", 10);
    assert.deepEqual(down, { x: 19, y: 50, w: 2, h: 140 });
  });

  await t.test("videos e imágenes por extensión", () => {
    assert.ok(isVideoSrc("/a/b.mp4") && isVideoSrc("/a/b.webm?v=2"));
    assert.ok(!isVideoSrc("/a/b.webp") && !isVideoSrc("/a/b.jpg"));
  });
});
