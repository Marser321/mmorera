import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { BRIEF_TO_PIECE } from "./briefToPiece";
import { CONTENT_SAMPLES } from "./contentSamples";
import { VIDEO_GALLERY, galleryMedia } from "./videoGallery";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);
const ORDER = ["brief", "guion", "arte", "revision", "final"];

describe("fábrica de contenido", () => {
  it("cada pieza recorre las 5 etapas en orden y sus imágenes existen", () => {
    for (const piece of BRIEF_TO_PIECE) {
      assert.deepEqual(piece.stages.map((stage) => stage.stage), ORDER, piece.slug);
      for (const stage of piece.stages) assert.ok(existsSync(publicFile(stage.image.src)), `falta ${stage.image.src}`);
    }
  });

  it("cada video de la galería tiene su archivo, su póster y un rótulo", () => {
    for (const item of VIDEO_GALLERY) {
      for (const language of ["es", "en"] as const) {
        const files = [item.src, item.poster, ...(item.landscape ? [item.landscape.src, item.landscape.poster] : [])];
        for (const file of files) assert.ok(existsSync(publicFile(galleryMedia(file, language))), `falta ${galleryMedia(file, language)}`);
      }
      assert.ok(item.label.es && item.label.en, `${item.slug} sin rótulo`);
    }
  });

  it("cada muestra de estilo tiene su video, su póster y su rótulo en los dos idiomas", () => {
    assert.equal(CONTENT_SAMPLES.length, 7);
    for (const sample of CONTENT_SAMPLES) {
      for (const language of ["es", "en"] as const) {
        assert.ok(existsSync(publicFile(sample.src[language])), `falta ${sample.src[language]}`);
        assert.ok(existsSync(publicFile(sample.poster[language])), `falta ${sample.poster[language]}`);
        assert.ok(sample.source[language] && sample.pitch[language] && sample.style[language], `${sample.id} sin textos en ${language}`);
      }
    }
  });
});
