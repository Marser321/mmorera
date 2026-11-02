import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { BRIEF_TO_PIECE } from "./briefToPiece";
import { VIDEO_GALLERY } from "./videoGallery";

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
      assert.ok(existsSync(publicFile(item.src)), `falta ${item.src}`);
      assert.ok(existsSync(publicFile(item.poster)), `falta ${item.poster}`);
      assert.ok(item.label.es && item.label.en, `${item.slug} sin rótulo`);
    }
  });
});
