import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { STACK_LAYERS, calculateStackFriction } from "./stackMatrixData";

describe("stack matrix data model", () => {
  test("publishes 4 architectural layers with recommended options", () => {
    assert.equal(STACK_LAYERS.length, 4);
    const layerIds = STACK_LAYERS.map((l) => l.id);
    assert.deepEqual(layerIds, ["web", "messaging", "crm", "billing"]);

    for (const layer of STACK_LAYERS) {
      assert.ok(layer.options.length >= 2);
      assert.ok(layer.options.some((opt) => opt.isRecommended));
      for (const opt of layer.options) {
        assert.ok(opt.name.length > 0);
        assert.ok(opt.frictionScore >= 0 && opt.frictionScore <= 10);
        assert.ok(opt.notes.es.length > 0);
        assert.ok(opt.notes.en.length > 0);
      }
    }
  });

  test("calculates optimal friction when recommended stack is chosen", () => {
    const optimalSelection = {
      web: "nextjs",
      messaging: "whatsapp-ai",
      crm: "ghl",
      billing: "stripe-auto",
    };

    const result = calculateStackFriction(optimalSelection);
    assert.equal(result.rating, "optimal");
    assert.ok(result.frictionPercentage <= 20);
  });

  test("calculates critical friction when manual/antiquated tools are chosen", () => {
    const legacySelection = {
      web: "wordpress",
      messaging: "whatsapp-personal",
      crm: "excel",
      billing: "manual-transfer",
    };

    const result = calculateStackFriction(legacySelection);
    assert.equal(result.rating, "critical");
    assert.ok(result.frictionPercentage >= 65);
  });
});
