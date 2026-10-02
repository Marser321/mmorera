import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SPRINT_MILESTONES, ASYNC_LEVERAGE_METRICS } from "./asyncDeliveryData";

describe("async delivery data model", () => {
  it("publishes 4 distinct sequential sprint milestones", () => {
    assert.equal(SPRINT_MILESTONES.length, 4);
    assert.equal(SPRINT_MILESTONES[0].phaseNumber, 1);
    assert.equal(SPRINT_MILESTONES[1].phaseNumber, 2);
    assert.equal(SPRINT_MILESTONES[2].phaseNumber, 3);
    assert.equal(SPRINT_MILESTONES[3].phaseNumber, 4);
  });

  it("verifies each phase has deliverables, telemetry, and live feed events", () => {
    for (const milestone of SPRINT_MILESTONES) {
      assert.ok(milestone.id.length > 0);
      assert.ok(milestone.name.es.length > 0);
      assert.ok(milestone.name.en.length > 0);
      assert.ok(milestone.dayRange.es.length > 0);
      assert.ok(milestone.deliverables.es.length >= 3);
      assert.ok(milestone.deliverables.en.length >= 3);
      assert.ok(milestone.telemetry.commitsCount > 0);
      assert.ok(milestone.telemetry.lighthouseScore >= 95);
      assert.ok(milestone.events.length >= 3);
      for (const ev of milestone.events) {
        assert.ok(ev.time.length > 0);
        assert.ok(ev.message.es.length > 0);
        assert.ok(ev.message.en.length > 0);
        assert.ok(ev.tag.length > 0);
      }
    }
  });

  it("publishes valid async leverage metrics", () => {
    assert.ok(ASYNC_LEVERAGE_METRICS.hoursSavedInMeetings >= 20);
    assert.equal(ASYNC_LEVERAGE_METRICS.zeroUnnecessaryCallsGuarantee, true);
    assert.equal(ASYNC_LEVERAGE_METRICS.averageSprintDeliveryDays, 21);
    assert.ok(ASYNC_LEVERAGE_METRICS.stagingAvailabilityHours <= 72);
  });
});
