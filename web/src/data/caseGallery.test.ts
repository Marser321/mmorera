import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { mediaSize } from "@/lib/mediaSize";
import { GALLERY_TARGETS } from "../../scripts/gallery-targets";
import { caseGallerySlugs, getCaseGallery, GALLERY_DEVICES, type GalleryShot } from "./caseGallery";
import { getCaseMedia } from "./caseMedia";
import { PROJECT_CASES } from "./projectCases";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);
const hashDistance = (a: string, b: string) => [...a].filter((bit, index) => bit !== b[index]).length / a.length;

describe("galería de los casos", () => {
  it("cada caso con reel tiene galería, y varias páginas para mostrar", () => {
    for (const project of PROJECT_CASES) {
      if (!getCaseMedia(project.slug)) continue;
      const gallery = getCaseGallery(project.slug);
      assert.ok(gallery, `${project.slug} no tiene galería: correr scripts/capture-case-gallery.ts`);
      assert.ok(gallery.views.length >= 4, `${project.slug} muestra solo ${gallery.views.length} vistas`);
    }
  });

  it("toda vista tiene computadora y al menos otra pantalla, con sus dos idiomas", () => {
    for (const slug of caseGallerySlugs()) {
      for (const view of getCaseGallery(slug)?.views ?? []) {
        assert.ok(view.tablet || view.mobile, `${slug}/${view.id} solo tiene computadora`);
        assert.ok(view.label.es && view.label.en, `${slug}/${view.id} no tiene sus dos idiomas`);
        assert.match(view.url, /^https:\/\//);
      }
    }
  });

  it("los archivos existen y miden lo que dice el manifiesto", () => {
    for (const slug of caseGallerySlugs()) {
      for (const view of getCaseGallery(slug)?.views ?? []) {
        for (const device of GALLERY_DEVICES) {
          const shot = view[device];
          if (!shot) continue;
          assert.ok(existsSync(publicFile(shot.src)), `falta ${shot.src}`);
          const size = mediaSize(readFileSync(publicFile(shot.src)), shot.src);
          assert.deepEqual([size.width, size.height], [shot.width, shot.height], shot.src);
        }
      }
    }
  });

  it("ninguna pantalla repite la misma imagen dentro de un caso", () => {
    for (const slug of caseGallerySlugs()) {
      const views = getCaseGallery(slug)?.views ?? [];
      for (const device of GALLERY_DEVICES) {
        const shots = views.flatMap((view): Array<GalleryShot & { id: string }> => (view[device] ? [{ ...view[device], id: view.id }] : []));
        shots.forEach((shot, index) => {
          for (const other of shots.slice(index + 1)) {
            assert.ok(hashDistance(shot.hash, other.hash) >= 0.1, `${slug} (${device}): ${shot.id} y ${other.id} son casi la misma imagen`);
          }
        });
      }
    }
  });

  it("los objetivos no apuntan a páginas con caras de personas", () => {
    for (const [slug, views] of Object.entries(GALLERY_TARGETS)) {
      for (const view of views) {
        assert.doesNotMatch(view.path, /\/(equipo|team|ceo|lookbook|casos|piercings)(\/|$)/, `${slug}: ${view.path} muestra personas`);
      }
    }
  });
});
