import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { TRANSFORMATION_CASES } from "./transformationDiffData";

describe("transformation diff data model", () => {
  test("publishes 3 distinct real transformation cases with verified deltas", () => {
    assert.equal(TRANSFORMATION_CASES.length, 3);
    const ids = TRANSFORMATION_CASES.map((c) => c.id);
    assert.deepEqual(ids, ["new-brothers", "lb-elite", "ad-media"]);

    for (const item of TRANSFORMATION_CASES) {
      assert.ok(item.clientName.length > 0);
      assert.ok(item.industry.es.length > 0);
      assert.ok(item.accentColor.startsWith("#"));
      assert.ok(item.liveUrl.startsWith("https://"));
      assert.ok(item.beforeState.frictionPoints.length >= 3);
      assert.ok(item.afterState.systemHighlights.length >= 3);
      assert.ok(item.metrics.length >= 3);

      for (const m of item.metrics) {
        assert.ok(m.label.es.length > 0);
        assert.ok(m.before.length > 0);
        assert.ok(m.after.length > 0);
        assert.ok(m.improvement.length > 0);
      }
    }
  });
});
