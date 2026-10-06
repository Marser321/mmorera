import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines } from "@/lib/filmLayout";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import { chipWidth, countLines, flowBoxes, GLYPH, isGoldTone, layoutProblems, scenePace, textBlock, textWidth } from "./dataText";

/**
 * Anchos reales (en em) de la palabra más ancha entre las tipografías de las
 * marcas, medidos en el navegador (Fraunces, Manrope, Montserrat, Oswald e
 * Inter, pesos 400/600/700). La estimación nunca puede quedar por debajo.
 */
const MEASURED_EM: Record<string, number> = {
  Mecanismo: 6.025,
  Mechanism: 6.053,
  Hook: 2.773,
  HBOT: 3.138,
  Rendimiento: 6.799,
  semaglutide: 6.579,
  "Contenido médico": 9.639,
  Llamado: 4.539,
  "98/98": 3.103,
  "4,33 M": 3.398,
  Accessibility: 6.525,
};

test("dataText: la medida por letra nunca subestima a las tipografías de las marcas", () => {
  for (const [word, em] of Object.entries(MEASURED_EM)) assert.ok(textWidth(word, 100) >= em * 100, `${word}: ${textWidth(word, 100).toFixed(0)} < ${em * 100}`);
  // Regresión: "Mecanismo" a 32 px no entra en 170 px (se recortaba en el segmento del guion).
  assert.equal(countLines("Mecanismo", 32, 170), Infinity);
  assert.ok(fitsLines("Mecanismo", 32, 170, 1, GLYPH.text), "el promedio solo no alcanza para detectarlo");
});

test("dataText: countLines incluye el criterio de fitsLines()", () => {
  const samples = ["Búsqueda por palabras clave (BM25), no vectorial", "GLP-1 with prescription and medical follow-up", "afirmaciones en el registro"];
  for (const text of samples)
    for (const size of [18, 24, 32])
      for (const width of [200, 360, 600]) {
        const lines = countLines(text, size, width);
        if (Number.isFinite(lines)) assert.ok(fitsLines(text, size, width, lines, GLYPH.text), `${text} @${size}/${width}`);
      }
});

test("dataText: una pastilla siempre alcanza para su texto en una línea", () => {
  for (const text of ["Edad biológica 16", "Medical content", "MAYORES", "4,33 M"])
    for (const size of [16, 22, 28]) {
      const pad = 12;
      const inner = chipWidth(text, size, pad) - (pad - 2) * 2;
      assert.ok(countLines(text, size, inner) === 1);
    }
});

test("dataText: flowBoxes reparte en filas o avisa que no entra", () => {
  const area = { x: 0, y: 0, w: 300, h: 100 };
  const boxes = flowBoxes(area, [120, 120, 120], 40, 10);
  assert.ok(boxes);
  assert.equal(boxes?.[2].y, 50);
  assert.equal(flowBoxes(area, [120, 120, 120, 120, 120], 40, 10), null);
  assert.equal(flowBoxes(area, [400], 40, 10), null);
  const right = flowBoxes(area, [100], 40, 10, "end");
  assert.equal(right?.[0].x, 200);
});

test("dataText: el validador detecta solapes, cruces de placa y textos que no entran", () => {
  const area = { x: 0, y: 0, w: 1000, h: 500 };
  const a = textBlock("a", { x: 0, y: 0, w: 300, h: 40 }, "Texto corto", 24, 1);
  const b = textBlock("b", { x: 200, y: 20, w: 300, h: 40 }, "Otro texto", 24, 1);
  const tight = textBlock("c", { x: 0, y: 200, w: 60, h: 40 }, "Mecanismo", 32, 1);
  const media = { kind: "media" as const, id: "m", box: { x: 0, y: 30, w: 50, h: 50 } };
  const frame = { kind: "frame" as const, id: "f", box: { x: 250, y: 0, w: 400, h: 100 } };
  const problems = layoutProblems([a, b, tight, media, frame], area);
  assert.ok(problems.some((problem) => problem.startsWith("a pisa a b")));
  assert.ok(problems.some((problem) => problem.includes("pisa el gráfico m")));
  assert.ok(problems.some((problem) => problem.startsWith("a cruza el borde de f")));
  assert.ok(problems.some((problem) => problem.startsWith("c no entra")));
  assert.deepEqual(layoutProblems([textBlock("x", { x: 990, y: 0, w: 40, h: 20 }, "x", 12, 1)], area), ["x sale de la escena"]);
});

test("dataText: reconoce los acentos dorados de las marcas (no van sobre contenido médico)", () => {
  assert.equal(isGoldTone(CASE_BRANDS["fenix-medical-center"].palette.accent), true);
  assert.equal(isGoldTone(CASE_BRANDS["new-brothers-barberia"].palette.accent), true);
  assert.equal(isGoldTone(CASE_BRANDS["ad-media-solution"].palette.accent), false);
  assert.equal(isGoldTone("#C4645C"), false);
  assert.equal(isGoldTone("#6FA88A"), false);
  assert.equal(isGoldTone("#c9bfb2"), false);
});

test("dataText: el ritmo comprime escenas cortas y sostiene el final en las largas", () => {
  assert.deepEqual(scenePace(150, 150, 300), { frame: 300, span: 300 });
  assert.deepEqual(scenePace(150, 600, 300), { frame: 150, span: 600 });
  assert.deepEqual(scenePace(0, 100, 300), { frame: 0, span: 300 });
});
