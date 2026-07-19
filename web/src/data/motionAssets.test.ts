import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { isMotionPreviewHost, MOTION_ASSETS, type MotionMediaSource } from "./motionAssets";

describe("motion asset manifest", () => {
  it("maps one deliberate behavior to each public visual family", () => {
    assert.deepEqual(
      Object.values(MOTION_ASSETS).map(({ id, behavior }) => [id, behavior]),
      [
        ["nucleo-decision", "play-once"],
        ["cinta-continuidad", "scroll"],
        ["telar-pulso", "loop"],
        ["archivo-estratos", "scroll"],
        ["apertura-protegida", "play-once"],
      ],
    );
  });

  it("enables marked preview clips only on explicit local hosts", () => {
    assert.equal(isMotionPreviewHost("localhost"), true);
    assert.equal(isMotionPreviewHost("127.0.0.1"), true);
    assert.equal(isMotionPreviewHost("mmorera.agency"), false);
    assert.equal(isMotionPreviewHost("preview.mmorera.agency"), false);
  });

  it("maps the three local clips across the five narrative placements", () => {
    assert.deepEqual(
      Object.values(MOTION_ASSETS).map(({ id, previewOnly, previewVideo }) => [id, previewOnly, previewVideo]),
      [
        ["nucleo-decision", true, { desktop: "/motion/previews/graphite-desktop.mp4", mobile: "/motion/previews/graphite-mobile.mp4" }],
        ["cinta-continuidad", true, { desktop: "/motion/previews/minimalist-desktop.mp4", mobile: "/motion/previews/minimalist-mobile.mp4" }],
        ["telar-pulso", true, { desktop: "/motion/previews/graphite-desktop.mp4", mobile: "/motion/previews/graphite-mobile.mp4" }],
        ["archivo-estratos", true, { desktop: "/motion/previews/minimalist-desktop.mp4", mobile: "/motion/previews/minimalist-mobile.mp4" }],
        ["apertura-protegida", true, { desktop: "/motion/previews/minimalist-desktop.mp4", mobile: "/motion/previews/camera-mobile.mp4" }],
      ],
    );
  });

  it("ships dark/light and desktop/mobile posters in both production formats", () => {
    const publicRoot = join(process.cwd(), "public");
    const sources: MotionMediaSource[] = [];
    for (const asset of Object.values(MOTION_ASSETS)) {
      sources.push(
        asset.variants.dark.desktop,
        asset.variants.dark.mobile,
        asset.variants.light.desktop,
        asset.variants.light.mobile,
      );
    }

    let totalBytes = 0;
    for (const source of sources) {
      assert.ok(source.avif);
      for (const path of [source.webp, source.avif!]) {
        const file = statSync(join(publicRoot, path.replace(/^\//, "")));
        assert.ok(file.isFile());
        totalBytes += file.size;
      }
    }
    assert.ok(totalBytes <= 2 * 1024 * 1024);
  });
});
