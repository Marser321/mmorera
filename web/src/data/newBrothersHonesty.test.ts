import test from "node:test";
import assert from "node:assert/strict";
import { PROJECT_CASES } from "./projectCases";
import { CASE_TOPOLOGIES } from "./caseTopologyData";
import { TRANSFORMATION_CASES } from "./transformationDiffData";
import { USE_CASE_FILMS } from "./films/systemsFilms";

/**
 * New Brothers (D:\Barberia) no tiene pasarela de pago, seña ni recordatorios
 * automáticos, y no hay métricas de negocio medidas. Ningún dato del sitio
 * sobre este caso puede volver a afirmarlo.
 */
const FORBIDDEN = [/stripe/i, /\bseñas?\b/i, /deposit/i, /no-?shows?/i, /asistencia/i, /\d+\s?%/];

function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

const sources = {
  projectCase: PROJECT_CASES.find((item) => item.slug === "new-brothers-barberia"),
  topology: CASE_TOPOLOGIES["new-brothers-barberia"],
  transformation: TRANSFORMATION_CASES.find((item) => item.id === "new-brothers"),
  systemsFilm: USE_CASE_FILMS.find((film) => film.caseSlug === "new-brothers-barberia"),
};

test("New Brothers solo afirma lo que existe en su código", async (t) => {
  for (const [name, source] of Object.entries(sources)) {
    await t.test(name, () => {
      assert.ok(source, `${name}: falta el dato de New Brothers`);
      for (const text of collectStrings(source)) {
        for (const pattern of FORBIDDEN) {
          assert.ok(!pattern.test(text), `${name}: "${text}" coincide con ${pattern}`);
        }
      }
    });
  }
});
