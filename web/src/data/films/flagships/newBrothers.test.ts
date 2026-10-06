import test from "node:test";
import assert from "node:assert/strict";
import architectureJson from "../../architecture/new-brothers-architecture.json";
import type { ArchifyArchitecture } from "../../architecture/archify";
import { CASE_BRANDS } from "../../brands/caseBrands";
import { PROJECT_CASES } from "../../projectCases";
import { NB_CHAPTERS, NB_COPY, NB_DURATION, NB_FACTS, NB_TIMELINE } from "./newBrothers";

const architecture = architectureJson as unknown as ArchifyArchitecture;
const FORBIDDEN = [/stripe/i, /\bseñas?\b/i, /deposit/i, /no-?shows?/i, /\d+\s?%/];

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

  await t.test("no afirma pagos, señas ni métricas que el código no tiene", () => {
    for (const text of [...strings(NB_COPY), ...strings(NB_CHAPTERS)]) {
      for (const pattern of FORBIDDEN) assert.ok(!pattern.test(text), `"${text}" coincide con ${pattern}`);
    }
  });

  await t.test("el diagrama de arquitectura está bien formado", () => {
    const ids = new Set(architecture.components.map((component) => component.id));
    for (const connection of architecture.connections) {
      assert.ok(ids.has(connection.from) && ids.has(connection.to), `${connection.from} → ${connection.to}`);
    }
    for (const view of architecture.meta.views ?? []) {
      for (const id of view.focus) assert.ok(ids.has(id), `vista ${view.id}: ${id} inexistente`);
    }
    for (const boundary of architecture.boundaries ?? []) {
      for (const id of boundary.wraps) assert.ok(ids.has(id), `grupo ${boundary.label}: ${id} inexistente`);
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
