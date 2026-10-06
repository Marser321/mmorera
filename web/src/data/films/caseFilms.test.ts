import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { PROJECT_CASES } from "../projectCases";
import { getCaseMedia } from "../caseMedia";
import { getCaseMetrics, isShowcaseWorthy } from "../caseMetrics";
import { buildCaseFilm } from "./caseFilms";

const films = PROJECT_CASES.map((project) => ({
  project,
  film: buildCaseFilm(project, getCaseMedia(project.slug), getCaseMetrics(project.slug)),
}));

test("films de casos de éxito", async (t) => {
  await t.test("cada caso tiene un film con capítulos contiguos que cubren todo el timeline", () => {
    for (const { project, film } of films) {
      let expected = 0;
      for (const chapter of film.chapters) {
        assert.equal(chapter.from, expected, `${project.slug}: ${chapter.id} no es contiguo`);
        assert.ok(chapter.durationInFrames > 0);
        expected += chapter.durationInFrames;
      }
      assert.equal(expected, film.durationInFrames, `${project.slug}: los capítulos no cubren el film`);
      const scenes = Object.values(film.timeline).filter((scene) => scene !== null);
      assert.equal(scenes.reduce((total, scene) => total + scene.duration, 0), film.durationInFrames);
    }
  });

  await t.test("la narrativa sale tal cual de los datos publicados del caso", () => {
    for (const { project, film } of films) {
      const byId = Object.fromEntries(film.chapters.map((chapter) => [chapter.id, chapter]));
      assert.deepEqual(byId.challenge.caption, project.challenge);
      assert.deepEqual(byId.outcome.caption, project.result);
      for (const constraint of project.constraints) assert.ok(byId.constraints.caption.es.includes(constraint.es));
      for (const decision of project.decisions) assert.ok(byId.decisions.caption.es.includes(decision.es));
    }
  });

  await t.test("la prueba solo aparece con métricas medidas y todas en verde", () => {
    for (const { project, film } of films) {
      const metrics = getCaseMetrics(project.slug);
      const worthy = Boolean(metrics && isShowcaseWorthy(metrics));
      assert.equal(film.chapters.some((chapter) => chapter.id === "proof"), worthy, `${project.slug}: capítulo de prueba incorrecto`);
      assert.equal(film.metrics !== null, worthy);
    }
  });

  await t.test("los fondos con texto encima están difuminados y existen", () => {
    for (const { project, film } of films) {
      for (const backdrop of [film.backdrops.landscape, film.backdrops.portrait]) {
        if (!backdrop) continue;
        assert.match(backdrop, /^\/portfolio\/backdrops\/.+-blur\.jpg$/, `${project.slug}: ${backdrop}`);
        assert.ok(existsSync(path.join(process.cwd(), "public", backdrop)), `${project.slug}: falta ${backdrop} (correr build-film-backdrops)`);
      }
      if (film.reel) assert.ok(existsSync(path.join(process.cwd(), "public", film.reel.webm)), `${project.slug}: falta el WebM del reel`);
    }
  });

  await t.test("el producto usa el reel grabado del sitio en vivo cuando existe", () => {
    for (const { project, film } of films) {
      const media = getCaseMedia(project.slug);
      assert.equal(film.reel?.mp4, media?.reel.mp4);
      if (project.liveUrl) assert.ok(film.hostname, `${project.slug}: falta el hostname en vivo`);
    }
  });
});
