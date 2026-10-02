import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  LEGACY_STACKS,
  MODERN_BENCHMARK,
  calculateAdLossImpact,
} from "./benchmarkArenaData";

describe("benchmark arena data model", () => {
  it("publishes 3 legacy stack presets with realistic metric penalties", () => {
    assert.equal(LEGACY_STACKS.length, 3);
    const ids = LEGACY_STACKS.map((s) => s.id);
    assert.deepEqual(ids, ["wordpress", "wix", "agency_legacy"]);

    for (const stack of LEGACY_STACKS) {
      assert.ok(stack.lighthouseScore < 70);
      assert.ok(stack.lcpSeconds > 3.0);
      assert.ok(stack.trafficLossPct >= 0.25);
      assert.ok(stack.name.es.length > 0);
      assert.ok(stack.name.en.length > 0);
      assert.ok(stack.vulnerabilities.es.length > 0);
    }
  });

  it("publishes modern benchmark with elite PageSpeed metrics", () => {
    assert.ok(MODERN_BENCHMARK.lighthouseScore >= 95);
    assert.ok(MODERN_BENCHMARK.lcpSeconds < 1.0);
    assert.ok(MODERN_BENCHMARK.trafficLossPct < 0.1);
    assert.equal(MODERN_BENCHMARK.clsScore, 0.0);
    assert.ok(MODERN_BENCHMARK.edgeRegions >= 100);
  });

  it("calculates realistic financial loss from slow loading on ad budgets", () => {
    const wpStack = LEGACY_STACKS[0]; // WordPress with 53% drop-off
    const spend = 1500; // $1,500/mo ad spend
    const report = calculateAdLossImpact(wpStack, spend, 0.75);

    assert.equal(report.monthlyAdSpend, 1500);
    // 53% - 4% = 49% wasted -> ~$735/mo
    assert.ok(report.wastedSpendMonthly >= 700 && report.wastedSpendMonthly <= 800);
    assert.equal(report.wastedSpendAnnual, report.wastedSpendMonthly * 12);
    assert.ok(report.recoveredTrafficVisitors > 500);
    assert.ok(report.speedDeltaMultiplier >= 7.0); // 6.4s vs 0.8s = 8x
  });
});
