import test from "node:test";
import assert from "node:assert/strict";
import { CAPABILITY_CASES, capabilitiesOf, relatedCases } from "./capabilityCases";
import { FLAGSHIP_FILMS } from "./films/flagships";
import { FORBIDDEN_CLAIMS } from "./films/flagships/flagshipAssertions";
import { PROJECT_CASES } from "./projectCases";
import { FAMILIES } from "./techStack";

test("cada familia de capacidades apunta a casos y capítulos que existen", () => {
  for (const { id } of FAMILIES) {
    const entries = CAPABILITY_CASES[id];
    assert.ok(entries?.length >= 2, `${id}: necesita al menos dos momentos que la demuestren`);
    for (const entry of entries) {
      assert.ok(PROJECT_CASES.some((project) => project.slug === entry.slug), `${id}: ${entry.slug} no es un caso`);
      const film = FLAGSHIP_FILMS[entry.slug];
      assert.ok(film, `${id}: ${entry.slug} no tiene film insignia`);
      assert.ok(film.chapters.some((chapter) => chapter.id === entry.chapter), `${id}: ${entry.slug} no tiene el capítulo ${entry.chapter}`);
      for (const text of [entry.line.es, entry.line.en]) {
        assert.ok(text.length > 10, `${id}: falta la frase de ${entry.slug}`);
        for (const pattern of FORBIDDEN_CLAIMS) assert.ok(!pattern.test(text), `${id}: "${text}" coincide con ${pattern}`);
      }
    }
  }
});

test("cada caso con film demuestra al menos una capacidad", () => {
  for (const slug of Object.keys(FLAGSHIP_FILMS)) assert.ok(capabilitiesOf(slug).length > 0, `${slug} no aparece en ninguna familia`);
});

test("los casos parecidos son otros casos, sin repetir, primero los que más comparten", () => {
  for (const slug of Object.keys(FLAGSHIP_FILMS)) {
    const related = relatedCases(slug);
    assert.equal(related.length, 3, `${slug}: tres casos parecidos`);
    assert.ok(related.every((item) => item.slug !== slug), `${slug}: se recomienda a sí mismo`);
    assert.equal(new Set(related.map((item) => item.slug)).size, related.length, `${slug}: casos repetidos`);
    for (let index = 1; index < related.length; index++) assert.ok(related[index - 1].shared.length >= related[index].shared.length);
  }
});
