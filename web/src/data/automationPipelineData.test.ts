import test from "node:test";
import assert from "node:assert/strict";
import {
  PIPELINE_SCENARIOS,
  calculatePipelineEfficiency,
} from "./automationPipelineData";

test("automation pipeline data model", async (t) => {
  await t.test("publishes 3 distinct pipeline scenarios with 5 stages each", () => {
    assert.equal(PIPELINE_SCENARIOS.length, 3);

    for (const scenario of PIPELINE_SCENARIOS) {
      assert.ok(scenario.id, "scenario must have an id");
      assert.ok(scenario.name.es && scenario.name.en, "scenario must have bilingual names");
      assert.ok(
        scenario.triggerDescription.es && scenario.triggerDescription.en,
        "scenario must have bilingual trigger descriptions"
      );
      assert.equal(scenario.stages.length, 5, "each scenario must have exactly 5 stages");
      assert.ok(scenario.totalDurationMs > 0, "totalDurationMs must be positive");
      assert.ok(scenario.manualDurationHours > 0, "manualDurationHours must be positive");
    }
  });

  await t.test("ensures each stage has valid latency, logs and payload", () => {
    for (const scenario of PIPELINE_SCENARIOS) {
      for (const stage of scenario.stages) {
        assert.ok(stage.id, "stage must have an id");
        assert.ok(stage.title.es && stage.title.en, "stage must have bilingual titles");
        assert.ok(stage.technology, "stage must specify technology");
        assert.ok(stage.httpStatus >= 200 && stage.httpStatus < 300, "status must be 2xx");
        assert.ok(stage.latencyMs > 0, "latency must be positive");
        assert.ok(Array.isArray(stage.logs) && stage.logs.length > 0, "logs must not be empty");
        assert.ok(typeof stage.payload === "object" && stage.payload !== null, "payload must be an object");
      }
    }
  });

  await t.test("calculates realistic efficiency multipliers against manual baseline", () => {
    const inbound = calculatePipelineEfficiency("inbound_web_lead");
    assert.ok(inbound.speedMultiplier > 1000, "automated pipeline must be orders of magnitude faster");
    assert.ok(inbound.hoursSavedPerMonth > 0, "monthly hours saved must be positive");
    assert.equal(inbound.lostLeadsPreventedPct, 48);

    const stripe = calculatePipelineEfficiency("stripe_checkout_success");
    assert.ok(stripe.speedMultiplier > 1000);
    assert.equal(stripe.lostLeadsPreventedPct, 65);
  });
});
