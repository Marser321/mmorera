import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SERVICE_PAGES } from "./servicePages";
import { getProjectCase } from "./projectCases";

describe("páginas de servicio", () => {
  it("cada caso de prueba existe y cada texto tiene sus dos idiomas", () => {
    for (const [page, content] of Object.entries(SERVICE_PAGES)) {
      for (const slug of content.proof?.slugs ?? []) {
        assert.ok(getProjectCase(slug), `${page} apunta a un caso inexistente: ${slug}`);
      }
      const texts = JSON.stringify(content);
      assert.doesNotMatch(texts, /"es":""|"en":""/, `${page} tiene un texto vacío`);
      assert.doesNotMatch(texts, /TODO/, `${page} conserva un TODO`);
    }
  });
});
