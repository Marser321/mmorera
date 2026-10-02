import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SPRINT_TIMELINE_TIERS } from "./sprintRoadmapData";

describe("sprint roadmap data model", () => {
  it("publishes 3 distinct sprint timeline tiers with verified duration", () => {
    assert.equal(SPRINT_TIMELINE_TIERS.length, 3);
    const ids = SPRINT_TIMELINE_TIERS.map((t) => t.id);
    assert.deepEqual(ids, ["fast_web", "automation_crm", "integral_system"]);

    for (const tier of SPRINT_TIMELINE_TIERS) {
      assert.ok(tier.durationWeeks >= 1 && tier.durationWeeks <= 3);
      assert.equal(tier.totalDays, tier.durationWeeks * 7);
      assert.ok(tier.accentColor.startsWith("#"));
      assert.ok(tier.name.es.length > 0);
      assert.ok(tier.name.en.length > 0);
      assert.ok(tier.phases.length >= 3);
      assert.ok(tier.guarantees.es.length >= 3);
      assert.ok(tier.guarantees.en.length >= 3);
    }
  });

  it("ensures each phase has valid day range, description and deliverables in both languages", () => {
    for (const tier of SPRINT_TIMELINE_TIERS) {
      for (const phase of tier.phases) {
        assert.ok(phase.dayRange.length > 0);
        assert.ok(phase.title.es.length > 0);
        assert.ok(phase.title.en.length > 0);
        assert.ok(phase.description.es.length > 0);
        assert.ok(phase.description.en.length > 0);
        assert.ok(phase.deliverables.es.length >= 3);
        assert.ok(phase.deliverables.en.length >= 3);
      }
    }
  });
});
