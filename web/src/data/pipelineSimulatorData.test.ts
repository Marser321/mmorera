import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  NICHES,
  PIPELINE_STEPS,
  calculateSimulatorMetrics,
} from "./pipelineSimulatorData";

describe("pipeline simulator data model", () => {
  test("publishes exactly 4 production niches with valid parameters", () => {
    assert.equal(NICHES.length, 4);
    const ids = NICHES.map((n) => n.id);
    assert.deepEqual(ids, ["clinicas", "inmobiliarias", "b2b", "ecommerce"]);

    for (const niche of NICHES) {
      assert.ok(niche.name.es.length > 0);
      assert.ok(niche.name.en.length > 0);
      assert.ok(niche.avgTicket > 0);
      assert.ok(niche.typicalPain.es.length > 0);
      assert.ok(niche.typicalPain.en.length > 0);
      assert.ok(niche.simulatedClientQuery.es.length > 0);
      assert.ok(niche.simulatedAgentResponse.es.length > 0);
      assert.ok(niche.accentColor.startsWith("#"));
    }
  });

  test("publishes exactly 4 pipeline steps with defined transitions", () => {
    assert.equal(PIPELINE_STEPS.length, 4);
    const stepIds = PIPELINE_STEPS.map((s) => s.id);
    assert.deepEqual(stepIds, ["ingesta", "respuesta", "crm", "cierre"]);

    for (const step of PIPELINE_STEPS) {
      assert.ok(step.label.es.length > 0);
      assert.ok(step.label.en.length > 0);
      assert.ok(step.sub.es.length > 0);
      assert.ok(step.traditionalStatus.time.length > 0);
      assert.ok(step.automatedStatus.time.length > 0);
      assert.equal(step.automatedStatus.bad, false);
    }
  });

  test("calculates automated vs manual metrics with realistic financial impact", () => {
    const volume = 200;

    const automated = calculateSimulatorMetrics(true, volume);
    assert.equal(automated.responseTime, "28 seg");
    assert.equal(automated.leadsConverted, 48); // 24% of 200
    assert.equal(automated.hoursSavedPerMonth, 50); // 25% of 200
    assert.equal(automated.dropOffRate, "11%");

    const manual = calculateSimulatorMetrics(false, volume);
    assert.equal(manual.responseTime, "4.5 horas");
    assert.equal(manual.leadsConverted, 16); // 8% of 200
    assert.equal(manual.hoursSavedPerMonth, 0);
    assert.equal(manual.dropOffRate, "62%");
  });
});
