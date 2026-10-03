import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  VANGUARD_PATTERNS,
  getVanguardPattern,
} from "./vanguardInteractionData";

describe("vanguard interaction patterns data model", () => {
  it("publishes 4 distinct cutting-edge interaction patterns with valid properties", () => {
    assert.equal(VANGUARD_PATTERNS.length, 4);
    const categories = VANGUARD_PATTERNS.map((p) => p.category);
    assert.ok(categories.includes("dock"));
    assert.ok(categories.includes("beam"));
    assert.ok(categories.includes("spotlight"));
    assert.ok(categories.includes("gesture"));

    for (const pattern of VANGUARD_PATTERNS) {
      assert.ok(pattern.id.length > 0);
      assert.ok(pattern.name.es.length > 0);
      assert.ok(pattern.name.en.length > 0);
      assert.ok(pattern.inspiration.length > 0);
      assert.ok(pattern.description.es.length > 0);
      assert.ok(pattern.techStack.length >= 3);
      assert.ok(pattern.snippet.includes("export function"));
    }
  });

  it("retrieves patterns safely by id", () => {
    const dock = getVanguardPattern("morphing-dock");
    assert.ok(dock);
    assert.equal(dock.category, "dock");

    const beam = getVanguardPattern("border-beam");
    assert.ok(beam);
    assert.equal(beam.category, "beam");

    assert.equal(getVanguardPattern("unknown-id"), undefined);
  });
});
