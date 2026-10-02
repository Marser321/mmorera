import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SPRING_PRESETS,
  clampKineticParams,
  generateMotionCodeSnippet,
} from "./kineticMotionData";

describe("kinetic motion data model", () => {
  it("publishes 3 distinct spring presets with valid physics bounds", () => {
    assert.equal(SPRING_PRESETS.length, 3);
    const ids = SPRING_PRESETS.map((p) => p.id);
    assert.deepEqual(ids, ["magnetic", "fluid", "hyper"]);

    for (const preset of SPRING_PRESETS) {
      assert.ok(preset.stiffness >= 100 && preset.stiffness <= 800);
      assert.ok(preset.damping >= 10 && preset.damping <= 50);
      assert.ok(preset.mass >= 0.5 && preset.mass <= 2.5);
      assert.ok(preset.glowColor.startsWith("#"));
      assert.ok(preset.name.es.length > 0);
      assert.ok(preset.name.en.length > 0);
    }
  });

  it("clamps out-of-bounds parameters safely", () => {
    const clampedUnder = clampKineticParams({ stiffness: 20, damping: 2, mass: 0.1, glowIntensity: -1 });
    assert.equal(clampedUnder.stiffness, 80);
    assert.equal(clampedUnder.damping, 8);
    assert.equal(clampedUnder.mass, 0.3);
    assert.equal(clampedUnder.glowIntensity, 0);

    const clampedOver = clampKineticParams({ stiffness: 2000, damping: 200, mass: 10, glowIntensity: 5 });
    assert.equal(clampedOver.stiffness, 800);
    assert.equal(clampedOver.damping, 60);
    assert.equal(clampedOver.mass, 3.0);
    assert.equal(clampedOver.glowIntensity, 1);
  });

  it("generates clean Framer Motion code snippet", () => {
    const snippet = generateMotionCodeSnippet(
      { stiffness: 400, damping: 25, mass: 1.0, glowIntensity: 0.8 },
      "#71F3A2"
    );
    assert.ok(snippet.includes("stiffness: 400"));
    assert.ok(snippet.includes("damping: 25"));
    assert.ok(snippet.includes("mass: 1.0"));
    assert.ok(snippet.includes("#71F3A2"));
  });
});
