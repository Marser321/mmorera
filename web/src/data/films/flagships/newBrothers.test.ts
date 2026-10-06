import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { absoluteNotes } from "../../../lib/filmCamera";
import { CASE_BRANDS } from "../../brands/caseBrands";
import { PROJECT_CASES } from "../../projectCases";
import { NB_CHAPTERS, NB_COPY, NB_DURATION, NB_FACTS, NB_PANEL_CAPTURE, NB_PANEL_SHOTS, NB_TIMELINE } from "./newBrothers";

const FORBIDDEN = [/stripe/i, /\bseñas?\b/i, /deposit/i, /no-?shows?/i, /\d+\s?%/];

/** Ancho y alto de un JPEG leyendo su marcador SOF (sin dependencias). */
function jpegSize(file: string) {
  const data = readFileSync(file);
  let offset = 2;
  while (offset < data.length) {
    const marker = data[offset + 1];
    const length = data.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
    offset += 2 + length;
  }
  throw new Error(`${file}: sin marcador SOF`);
}

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

test("film insignia de New Brothers", async (t) => {
  await t.test("capítulos contiguos que cubren todo el film", () => {
    let expected = 0;
    for (const chapter of NB_CHAPTERS) {
      assert.equal(chapter.from, expected, `${chapter.label.es} no es contiguo`);
      expected += chapter.durationInFrames;
    }
    assert.equal(expected, NB_DURATION);
    assert.equal(NB_TIMELINE.signature.from + NB_TIMELINE.signature.duration, NB_DURATION);
  });

  await t.test("los números del resultado son los del código del cliente", () => {
    const expected = [NB_FACTS.bookingSteps, NB_FACTS.tables, NB_FACTS.roles, NB_FACTS.panelSections].map(String);
    for (const language of ["es", "en"] as const) {
      assert.deepEqual(NB_COPY[language].facts.map((fact) => fact.value), expected);
      assert.equal(NB_COPY[language].steps.length, NB_FACTS.bookingSteps);
    }
  });

  await t.test("las capturas del panel miden lo que declara el guion (la cámara no amplía más allá)", () => {
    for (const shot of NB_PANEL_SHOTS) {
      const size = jpegSize(path.join(process.cwd(), `public/portfolio/panels/new-brothers-barberia-${shot.name}.jpg`));
      assert.deepEqual(size, { width: NB_PANEL_CAPTURE.width, height: NB_PANEL_CAPTURE.height }, `${shot.name}: recapturada, actualizar NB_PANEL_CAPTURE`);
    }
  });

  await t.test("las notas de cámara no conviven ni se cruzan con el empuje entre tomas", () => {
    const notes = absoluteNotes(NB_PANEL_SHOTS).sort((a, b) => a.start - b.start);
    notes.forEach((note, index) => {
      const shot = NB_PANEL_SHOTS.find((item) => item.name === note.shot)!;
      assert.ok(note.from >= 20 || shot.from === 0, `${note.key}: arranca durante el empuje de entrada`);
      assert.ok(note.to <= shot.duration, `${note.key}: sigue visible durante el empuje de salida`);
      if (index > 0) assert.ok(note.start >= notes[index - 1].end, `${note.key} se superpone con ${notes[index - 1].key}`);
      for (const value of note.rect) assert.ok(value >= 0 && value <= 1);
      assert.ok(note.rect[0] + note.rect[2] <= 1 && note.rect[1] + note.rect[3] <= 1, `${note.key}: rectángulo fuera de la captura`);
      for (const language of ["es", "en"] as const) assert.ok(NB_COPY[language].notes[note.key as keyof typeof NB_COPY.es.notes], `${note.key}: falta el rótulo en ${language}`);
    });
  });

  await t.test("no afirma pagos, señas ni métricas que el código no tiene", () => {
    for (const text of [...strings(NB_COPY), ...strings(NB_CHAPTERS)]) {
      for (const pattern of FORBIDDEN) assert.ok(!pattern.test(text), `"${text}" coincide con ${pattern}`);
    }
  });
});

test("marcas de los clientes", async (t) => {
  await t.test("paletas válidas y fuente documentada", () => {
    for (const brand of Object.values(CASE_BRANDS)) {
      for (const color of Object.values(brand.palette)) assert.match(color, /^#[0-9a-fA-F]{6}$/, `${brand.slug}: ${color}`);
      assert.ok(brand.source.length > 10, `${brand.slug}: falta la fuente de los tokens`);
      assert.ok(brand.logo.mark.startsWith("/portfolio/brands/"), `${brand.slug}: logo fuera de public/portfolio/brands`);
    }
  });

  await t.test("el acento del caso coincide con el de su marca", () => {
    for (const brand of Object.values(CASE_BRANDS)) {
      const project = PROJECT_CASES.find((item) => item.slug === brand.slug);
      if (project) assert.equal(project.accent, brand.palette.accent, `${brand.slug}: accent distinto al de la marca`);
    }
  });
});
