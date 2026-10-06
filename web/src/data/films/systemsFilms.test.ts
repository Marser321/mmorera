import test from "node:test";
import assert from "node:assert/strict";
import { PROJECT_CASES } from "../projectCases";
import { CHAPTER_ORDER, resolveChapterIndex } from "./filmTypes";
import { OPENING_BEATS, OPENING_DURATION, SYSTEM_RAIL_STAGES, USE_CASE_FILMS } from "./systemsFilms";

test("films de sistemas", async (t) => {
  await t.test("cada film tiene los cuatro capítulos contiguos que suman su duración", () => {
    for (const film of USE_CASE_FILMS) {
      assert.deepEqual(film.chapters.map((chapter) => chapter.id), CHAPTER_ORDER);
      let expectedFrom = 0;
      for (const chapter of film.chapters) {
        assert.equal(chapter.from, expectedFrom, `${film.id}: capítulo ${chapter.id} no es contiguo`);
        assert.ok(chapter.durationInFrames > 0);
        assert.ok(chapter.caption.es && chapter.caption.en, `${film.id}: falta subtítulo bilingüe`);
        expectedFrom += chapter.durationInFrames;
      }
      assert.equal(expectedFrom, film.durationInFrames, `${film.id}: los capítulos no suman la duración`);
    }
  });

  await t.test("los films reales apuntan a un caso publicado y los de ejemplo no", () => {
    for (const film of USE_CASE_FILMS) {
      if (film.kind === "real") {
        assert.ok(film.caseSlug, `${film.id}: un film real necesita caseSlug`);
        const project = PROJECT_CASES.find((item) => item.slug === film.caseSlug);
        assert.ok(project, `${film.id}: caso inexistente`);
        assert.deepEqual(film.caseTitle, project.title, `${film.id}: el título no coincide con el caso publicado`);
        assert.ok(film.stages.every((stage) => stage.latencyMs === undefined), `${film.id}: un caso real no muestra latencias de muestra`);
      } else {
        assert.equal(film.caseSlug, undefined, `${film.id}: un ejemplo no se atribuye a un cliente`);
      }
    }
  });

  await t.test("ningún film muestra porcentajes de conversión", () => {
    for (const film of USE_CASE_FILMS) {
      const visibleCopy = [
        film.problem.headline,
        film.diagnosis.headline,
        film.diagnosis.breakpoint,
        film.result.headline,
        ...film.result.facts.flatMap((fact) => [fact.value, fact.label]),
        ...film.chapters.map((chapter) => chapter.caption),
      ];
      for (const copy of visibleCopy) {
        assert.ok(!copy.es.includes("%") && !copy.en.includes("%"), `${film.id}: "${copy.es}" incluye un porcentaje`);
      }
    }
  });

  await t.test("los carriles del diagnóstico reparten cada señal una sola vez", () => {
    for (const film of USE_CASE_FILMS) {
      if (!film.diagnosis.lanes) continue;
      const assigned = film.diagnosis.lanes.flatMap((lane) => lane.signals).sort();
      assert.deepEqual(assigned, film.problem.signals.map((_, index) => index), `${film.id}: carriles incompletos`);
    }
  });

  await t.test("ids únicos de films y etapas", () => {
    const ids = USE_CASE_FILMS.map((film) => film.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const film of USE_CASE_FILMS) {
      const stageIds = film.stages.map((stage) => stage.id);
      assert.equal(new Set(stageIds).size, stageIds.length, `${film.id}: etapas duplicadas`);
      assert.ok(film.stages.length >= 3 && film.stages.length <= 5, `${film.id}: entre 3 y 5 etapas`);
    }
  });

  await t.test("el film de apertura recorre cuatro beats contiguos sobre el riel de cinco estados", () => {
    assert.equal(OPENING_BEATS.length, 4);
    OPENING_BEATS.forEach((beat, index) => {
      assert.equal(beat.from, OPENING_BEATS.slice(0, index).reduce((sum, item) => sum + item.durationInFrames, 0));
    });
    assert.equal(OPENING_BEATS.at(-1)!.from + OPENING_BEATS.at(-1)!.durationInFrames, OPENING_DURATION);
    assert.equal(SYSTEM_RAIL_STAGES.length, 5);
  });

  await t.test("resolveChapterIndex elige el último capítulo iniciado", () => {
    const chapters = USE_CASE_FILMS[0].chapters;
    assert.equal(resolveChapterIndex(chapters, 0), 0);
    assert.equal(resolveChapterIndex(chapters, chapters[2].from), 2);
    assert.equal(resolveChapterIndex(chapters, chapters[2].from - 1), 1);
    assert.equal(resolveChapterIndex(chapters, 99_999), 3);
  });
});
