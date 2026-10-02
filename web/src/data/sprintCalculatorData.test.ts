import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { SCOPE_TIERS, calculateSprintRoi } from "./sprintCalculatorData";

describe("sprint calculator data model", () => {
  test("publishes 3 distinct scope tiers with defined deliverables", () => {
    assert.equal(SCOPE_TIERS.length, 3);
    const ids = SCOPE_TIERS.map((s) => s.id);
    assert.deepEqual(ids, ["web", "automation", "integral"]);

    for (const tier of SCOPE_TIERS) {
      assert.ok(tier.name.es.length > 0);
      assert.ok(tier.sprintDurationWeeks >= 1 && tier.sprintDurationWeeks <= 3);
      assert.ok(tier.badge.es.length > 0);
      assert.ok(tier.deliverablesSummary.length >= 3);
      assert.ok(tier.accentColor.startsWith("#"));
    }
  });

  test("calculates realistic financial and time savings across inputs", () => {
    const input = {
      scopeId: "automation" as const,
      teamSize: 4,
      avgTicket: 800,
      monthlyLeads: 200,
    };

    const res = calculateSprintRoi(input);
    assert.equal(res.sprintWeeks, 2);
    assert.equal(res.hoursSavedPerMonth, 56); // 4 * 14
    assert.equal(res.recoveredDealsPerMonth, 16); // 200 * 0.08
    assert.equal(res.recoveredRevenuePerMonth, 12800); // 16 * 800
    assert.ok(res.paybackDaysEstimated > 0 && res.paybackDaysEstimated <= 60);
  });
});
