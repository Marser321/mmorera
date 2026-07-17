import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  PORTRAIT_FRAME_SEQUENCE,
  resolveFrameBlend,
  resolveFrameCrossfade,
  resolvePreloadWindow,
  resolveRenderablePair,
  shouldPreloadFrame,
  type PortraitFrameStatus,
} from "./portraitFrameSequence";

describe("author portrait frame sequence", () => {
  it("maps and clamps scroll progress safely", () => {
    assert.deepEqual(resolveFrameBlend(-1, 8), { from: 0, to: 1, mix: 0 });
    assert.deepEqual(resolveFrameBlend(Number.NaN, 8), { from: 0, to: 1, mix: 0 });
    // 0.485 / 0.97 = 0.5 exacto tras el remapeo de completado.
    assert.deepEqual(resolveFrameBlend(0.485, 8), { from: 3, to: 4, mix: 0.5 });
    assert.deepEqual(resolveFrameBlend(2, 8), { from: 7, to: 7, mix: 0 });
    assert.deepEqual(resolveFrameBlend(1, 1), { from: 0, to: 0, mix: 0 });
    assert.deepEqual(resolveFrameBlend(1, 0), { from: 0, to: 0, mix: 0 });
  });

  it("locks the final frame before the literal end of the scroll track", () => {
    // El último frame debe alcanzarse al 97% del track, no solo en progress === 1.
    assert.deepEqual(resolveFrameBlend(1, 6), { from: 5, to: 5, mix: 0 });
    assert.deepEqual(resolveFrameBlend(0.97, 6), { from: 5, to: 5, mix: 0 });
    // Caso real medido en móvil: ~7px de recorte → progress 0.9865.
    assert.deepEqual(resolveFrameBlend(0.9865, 6), { from: 5, to: 5, mix: 0 });
    // Justo por debajo del umbral sigue en el blend previo (transición continua).
    const below = resolveFrameBlend(0.94, 6);
    assert.equal(below.from, 4);
    assert.ok(below.mix > 0.8 && below.mix < 1);
  });

  it("preloads only the bounded window around the active pair", () => {
    assert.deepEqual(resolvePreloadWindow({ from: 3, to: 4, mix: 0.5 }, 8, 1), [2, 3, 4, 5]);
    assert.deepEqual(resolvePreloadWindow({ from: 0, to: 1, mix: 0 }, 8, 1), [0, 1, 2]);
    assert.deepEqual(resolvePreloadWindow({ from: 7, to: 7, mix: 0 }, 8, 1), [6, 7]);
    assert.deepEqual(resolvePreloadWindow({ from: 0, to: 0, mix: 0 }, 0, 1), []);
  });

  it("keeps poses crisp and confines the dissolve to the end of each interval", () => {
    assert.equal(resolveFrameCrossfade(-1), 0);
    assert.equal(resolveFrameCrossfade(0.5), 0);
    assert.equal(resolveFrameCrossfade(0.78), 0);
    assert.ok(Math.abs(resolveFrameCrossfade(0.89) - 0.5) < 0.0001);
    assert.equal(resolveFrameCrossfade(1), 1);
    assert.equal(resolveFrameCrossfade(Number.NaN), 0);
  });

  it("does not retry loading or failed frames", () => {
    assert.equal(shouldPreloadFrame(), true);
    assert.equal(shouldPreloadFrame("idle"), true);
    assert.equal(shouldPreloadFrame("loading"), false);
    assert.equal(shouldPreloadFrame("loaded"), false);
    assert.equal(shouldPreloadFrame("failed"), false);
  });

  it("keeps the last valid frame when a target is missing", () => {
    const statuses: PortraitFrameStatus[] = ["loaded", "loaded", "failed", "loading"];
    assert.deepEqual(
      resolveRenderablePair({ from: 2, to: 3, mix: 0.7 }, statuses, 1),
      { from: 1, to: 1, mix: 0 },
    );
    assert.deepEqual(
      resolveRenderablePair({ from: 0, to: 1, mix: 0.4 }, statuses, 0),
      { from: 0, to: 1, mix: 0.4 },
    );
  });

  it("ships unique, existing media within the agreed budgets", () => {
    assert.equal(PORTRAIT_FRAME_SEQUENCE.frames.length, 8);
    assert.equal(PORTRAIT_FRAME_SEQUENCE.mobileFrames.length, 6);
    assert.equal(PORTRAIT_FRAME_SEQUENCE.aspectRatio, 2 / 3);
    assert.equal(new Set(PORTRAIT_FRAME_SEQUENCE.frames).size, 8);
    assert.equal(new Set(PORTRAIT_FRAME_SEQUENCE.mobileFrames).size, 6);
    const publicRoot = join(process.cwd(), "public");
    const desktopBytes = PORTRAIT_FRAME_SEQUENCE.frames.reduce(
      (total, path) => total + statSync(join(publicRoot, path)).size,
      0,
    );
    const mobileBytes = PORTRAIT_FRAME_SEQUENCE.mobileFrames.reduce(
      (total, path) => total + statSync(join(publicRoot, path)).size,
      0,
    );
    assert.ok(desktopBytes <= 4 * 1024 * 1024);
    assert.ok(mobileBytes <= 1.5 * 1024 * 1024);
    assert.ok(statSync(join(publicRoot, PORTRAIT_FRAME_SEQUENCE.poster)).isFile());
    const profileFiles = readdirSync(join(publicRoot, "profile"), { recursive: true });
    assert.deepEqual(
      profileFiles.filter((path) => String(path).split("/").some((part) => part.startsWith("._"))),
      [],
    );
  });
});
