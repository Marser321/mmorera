import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { LAB_PAGE, LAB_SLUGS, USE_CASE_SLUGS } from "./branchPages";
import { LAB_PREVIEW_SELECTOR, USE_CASE_CROP, branchPreview } from "./branchPreviews";
import { getCaseMedia } from "./caseMedia";
import { USE_CASE_FILMS } from "./films/systemsFilms";
import { getProjectCase } from "./projectCases";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("imágenes de las tarjetas de casos de uso y del Lab", () => {
  it("cada caso de uso tiene su cuadro en los dos idiomas, con un encuadre dentro del film", () => {
    assert.deepEqual(USE_CASE_FILMS.map((film) => film.id).sort(), Object.keys(USE_CASE_SLUGS).sort());
    for (const film of USE_CASE_FILMS) {
      for (const language of ["es", "en"] as const) {
        const src = branchPreview("use-case", film.id, language);
        assert.ok(existsSync(publicFile(src)), `falta ${src}: correr scripts/capture-branch-previews.ts`);
      }
      const crop = USE_CASE_CROP[film.id];
      assert.ok(crop, `${film.id} no tiene encuadre`);
      assert.ok(crop.x >= 0 && crop.y >= 0 && crop.x + crop.width <= 1 && crop.y + crop.height <= 1, `${film.id}: el encuadre se sale del film`);
    }
  });

  it("cada demo del Lab tiene su captura en los dos idiomas", () => {
    for (const demo of Object.keys(LAB_SLUGS) as Array<keyof typeof LAB_SLUGS>) {
      assert.ok(LAB_PREVIEW_SELECTOR[demo], `${demo} no dice qué panel se captura`);
      for (const language of ["es", "en"] as const) {
        const src = branchPreview("lab", demo, language);
        assert.ok(existsSync(publicFile(src)), `falta ${src}: correr scripts/capture-branch-previews.ts`);
      }
    }
  });

  it("las demos completas del Lab son casos con una demo para abrir y su reel", () => {
    assert.ok(LAB_PAGE.full.slugs.length >= 3);
    for (const slug of LAB_PAGE.full.slugs) {
      const project = getProjectCase(slug);
      assert.ok(project, `${slug} no es un caso`);
      const demos = project.tryIt?.filter((link) => link.kind === "demo") ?? [];
      assert.ok(demos.length > 0, `${slug} no tiene un enlace de demo`);
      // Una demo dice qué datos usa o qué se puede tocar: nadie entra a ciegas.
      assert.ok(demos.some((link) => link.note), `${slug}: ninguna demo aclara qué datos usa`);
      assert.ok(getCaseMedia(slug)?.reel, `${slug} no tiene reel`);
    }
  });
});
