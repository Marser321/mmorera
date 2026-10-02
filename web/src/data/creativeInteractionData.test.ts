import test from "node:test";
import assert from "node:assert/strict";
import {
  INTERACTION_PRESETS,
  calculateTilt,
  scrambleStep,
  generateInteractionCodeSnippet,
} from "./creativeInteractionData";

test("creative interaction data model", async (t) => {
  await t.test("publishes 4 distinct interaction presets with required fields", () => {
    assert.equal(INTERACTION_PRESETS.length, 4);

    for (const preset of INTERACTION_PRESETS) {
      assert.ok(preset.id, "preset must have an id");
      assert.ok(preset.tag, "preset must have a tag");
      assert.ok(preset.name.es && preset.name.en, "preset must have bilingual names");
      assert.ok(preset.subtitle.es && preset.subtitle.en, "preset must have bilingual subtitles");
      assert.ok(preset.impactMetric.es && preset.impactMetric.en, "preset must have bilingual metrics");
      assert.ok(Array.isArray(preset.techStack) && preset.techStack.length > 0, "preset must have tech stack");
    }
  });

  await t.test("calculates realistic 3D tilt and specular sheen coordinates", () => {
    const params = { maxAngle: 20, perspective: 1000, sheenOpacity: 0.5 };

    // Dead center: no tilt, sheen at 50%
    const center = calculateTilt(200, 150, 400, 300, params);
    assert.equal(center.rotateX, 0);
    assert.equal(center.rotateY, 0);
    assert.equal(center.sheenX, 50);
    assert.equal(center.sheenY, 50);

    // Top-left: pointer is at (0, 0)
    // normX = -1 -> rotateY = -20
    // normY = -1 -> rotateX = +20 (top tilts towards user)
    const topLeft = calculateTilt(0, 0, 400, 300, params);
    assert.equal(topLeft.rotateX, 20);
    assert.equal(topLeft.rotateY, -20);
    assert.equal(topLeft.sheenX, 0);
    assert.equal(topLeft.sheenY, 0);

    // Bottom-right: pointer is at (400, 300)
    const bottomRight = calculateTilt(400, 300, 400, 300, params);
    assert.equal(bottomRight.rotateX, -20);
    assert.equal(bottomRight.rotateY, 20);
    assert.equal(bottomRight.sheenX, 100);
    assert.equal(bottomRight.sheenY, 100);
  });

  await t.test("scrambleStep progressively resolves text up to 100%", () => {
    const original = "MARIO MORERA";

    // 0% progress: first chars scrambled, spaces preserved
    const atZero = scrambleStep(original, 0);
    assert.equal(atZero.length, original.length);
    assert.equal(atZero[5], " "); // space at index 5 preserved

    // 50% progress: first 6 chars resolved
    const atHalf = scrambleStep(original, 0.5);
    assert.equal(atHalf.slice(0, 6), "MARIO ");

    // 100% progress: completely resolved
    const atFull = scrambleStep(original, 1);
    assert.equal(atFull, original);
  });

  await t.test("generates valid Framer Motion code snippets for all presets", () => {
    for (const preset of INTERACTION_PRESETS) {
      const snippet = generateInteractionCodeSnippet(preset.id);
      assert.ok(snippet.length > 50, "snippet must not be empty");
      assert.ok(
        snippet.includes("Framer Motion") ||
        snippet.includes("requestAnimationFrame") ||
        snippet.includes("motion") ||
        snippet.includes("radial-gradient"),
        "snippet must contain animation/graphics keywords"
      );
    }
  });
});
