import test from "node:test";
import assert from "node:assert/strict";
import { DIAL_TIERS, snapToNearestDialTier } from "./rotaryDialData";

test("rotary dial data model", async (t) => {
  await t.test("publishes 4 progressive operational tiers with required fields", () => {
    assert.equal(DIAL_TIERS.length, 4);

    for (let i = 0; i < DIAL_TIERS.length; i++) {
      const tier = DIAL_TIERS[i];
      assert.equal(tier.level, i + 1);
      assert.ok(tier.id, "tier must have an id");
      assert.ok(tier.name.es && tier.name.en, "tier must have bilingual names");
      assert.ok(tier.subtitle.es && tier.subtitle.en, "tier must have bilingual subtitles");
      assert.ok(tier.speedToLead.es && tier.speedToLead.en, "tier must have speedToLead");
      assert.ok(tier.multiplier >= 1.0, "multiplier must be >= 1");
      assert.ok(tier.frictionPct >= 0 && tier.frictionPct <= 100, "friction must be 0-100");
      assert.ok(Array.isArray(tier.stack) && tier.stack.length > 0, "stack must not be empty");
    }
  });

  await t.test("snaps correctly to the closest tier angle", () => {
    // 0 deg (or close) -> Level 1 (tier_legacy)
    assert.equal(snapToNearestDialTier(0).id, "tier_legacy");
    assert.equal(snapToNearestDialTier(20).id, "tier_legacy");
    assert.equal(snapToNearestDialTier(350).id, "tier_legacy");

    // 90 deg -> Level 2 (tier_web_modern)
    assert.equal(snapToNearestDialTier(90).id, "tier_web_modern");
    assert.equal(snapToNearestDialTier(80).id, "tier_web_modern");
    assert.equal(snapToNearestDialTier(110).id, "tier_web_modern");

    // 180 deg -> Level 3 (tier_automated_crm)
    assert.equal(snapToNearestDialTier(180).id, "tier_automated_crm");
    assert.equal(snapToNearestDialTier(160).id, "tier_automated_crm");
    assert.equal(snapToNearestDialTier(200).id, "tier_automated_crm");

    // 270 deg -> Level 4 (tier_full_ecosystem)
    assert.equal(snapToNearestDialTier(270).id, "tier_full_ecosystem");
    assert.equal(snapToNearestDialTier(250).id, "tier_full_ecosystem");
    assert.equal(snapToNearestDialTier(280).id, "tier_full_ecosystem");
  });

  await t.test("demonstrates dramatic progression in operational leverage", () => {
    const legacy = DIAL_TIERS[0];
    const full = DIAL_TIERS[3];

    assert.ok(full.multiplier > legacy.multiplier * 10);
    assert.ok(full.frictionPct < 5);
    assert.equal(full.monthlyLeakUsd, 0);
  });
});
