import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  RESPONSE_TIME_TIERS,
  calculateLeadDecay,
  getDecayCurveSvgPath,
} from "./leadVelocityData";

describe("lead velocity decay data model", () => {
  it("publishes 6 progressive response tiers from 18s to 24h+", () => {
    assert.equal(RESPONSE_TIME_TIERS.length, 6);
    assert.equal(RESPONSE_TIME_TIERS[0].id, "tier-18s");
    assert.equal(RESPONSE_TIME_TIERS[0].contactRatePct, 94);
    assert.equal(RESPONSE_TIME_TIERS[5].id, "tier-24h");
    assert.ok(RESPONSE_TIME_TIERS[5].contactRatePct <= 5);

    for (const tier of RESPONSE_TIME_TIERS) {
      assert.ok(tier.label.es.length > 0);
      assert.ok(tier.label.en.length > 0);
      assert.ok(tier.description.es.length > 0);
      assert.ok(tier.humanReality.es.length > 0);
    }
  });

  it("calculates realistic financial losses under a 2-hour delay", () => {
    // $3,000 ad spend, $1,500 ticket, 2-hour response tier
    const result = calculateLeadDecay(3000, 1500, "tier-2h");
    assert.equal(result.monthlyAdSpend, 3000);
    assert.equal(result.ticketValue, 1500);
    assert.ok(result.leadsGenerated >= 100);
    assert.ok(result.adSpendBurnedPct >= 70); // at least 70% of ad spend burned
    assert.ok(result.adSpendBurnedMonthly >= 2000);
    assert.ok(result.dealsLostMonthly > 0);
    assert.ok(result.annualRecoverableRevenue > 50000);
  });

  it("proves 0 ad spend burned and zero deals lost at the 18-second tier", () => {
    const result = calculateLeadDecay(5000, 2000, "tier-18s");
    assert.equal(result.adSpendBurnedMonthly, 0);
    assert.equal(result.adSpendBurnedPct, 0);
    assert.equal(result.dealsLostMonthly, 0);
    assert.equal(result.annualRecoverableRevenue, 0);
    assert.equal(result.contactRatePct, 94);
  });

  it("demonstrates catastrophic ad waste at the 24-hour tier", () => {
    const result = calculateLeadDecay(4000, 1000, "tier-24h");
    assert.ok(result.adSpendBurnedPct >= 95);
    assert.ok(result.adSpendBurnedMonthly >= 3800);
  });

  it("generates a valid SVG bezier path string for the decay curve", () => {
    const svgPath = getDecayCurveSvgPath(600, 220);
    assert.ok(svgPath.startsWith("M 0"));
    assert.ok(svgPath.includes("C "));
  });
});
