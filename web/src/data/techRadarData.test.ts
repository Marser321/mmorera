import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TECH_ALERTS,
  MODEL_RECOMMENDATIONS,
  CONTENT_BLUEPRINTS,
  generateFormattedBlueprintText,
} from "./techRadarData";

describe("tech radar and backstage content studio data model", () => {
  it("publishes 4 distinct market alerts covering WhatsApp, LLMs, CRMs and Voice", () => {
    assert.equal(TECH_ALERTS.length, 4);
    const categories = TECH_ALERTS.map((a) => a.category);
    assert.ok(categories.includes("whatsapp"));
    assert.ok(categories.includes("llm"));
    assert.ok(categories.includes("crm"));
    assert.ok(categories.includes("voice"));

    for (const alert of TECH_ALERTS) {
      assert.ok(alert.id.length > 0);
      assert.ok(alert.title.es.length > 0);
      assert.ok(alert.title.en.length > 0);
      assert.ok(alert.summary.es.length > 0);
      assert.ok(alert.practicalRecommendation.es.length > 0);
      assert.ok(alert.recommendedStack.length >= 3);
    }
  });

  it("publishes 4 pragmatic model recommendations with concrete latency and cost estimates", () => {
    assert.equal(MODEL_RECOMMENDATIONS.length, 4);
    for (const rec of MODEL_RECOMMENDATIONS) {
      assert.ok(rec.recommendedModel.length > 0);
      assert.ok(rec.latencyTarget.length > 0);
      assert.ok(rec.costEstimate10kOps.length > 0);
      assert.ok(rec.whyThisChoice.es.length > 0);
      assert.ok(rec.whatToAvoid.es.length > 0);
    }
  });

  it("publishes content blueprints with anti-dispersion structure for reels and youtube", () => {
    assert.ok(CONTENT_BLUEPRINTS.length >= 3);
    for (const bp of CONTENT_BLUEPRINTS) {
      assert.ok(bp.hook.es.length > 0);
      assert.ok(bp.trapWarning.es.length > 0);
      assert.ok(bp.coreArchitecture.es.length > 0);
      assert.equal(bp.anchorPoints.es.length, 3);
      assert.equal(bp.anchorPoints.en.length, 3);
      assert.ok(bp.closingCta.es.length > 0);
    }
  });

  it("generates formatted recording blueprints ready for WhatsApp or clipboard in both languages", () => {
    const textEs = generateFormattedBlueprintText(CONTENT_BLUEPRINTS[0], "es");
    assert.ok(textEs.includes("BLUEPRINT DE GRABACIÓN"));
    assert.ok(textEs.includes("EL GANCHO"));
    assert.ok(textEs.includes("TRES PUNTOS DE ANCLAJE"));
    assert.ok(textEs.includes("CIERRE & CALL TO ACTION"));

    const textEn = generateFormattedBlueprintText(CONTENT_BLUEPRINTS[1], "en");
    assert.ok(textEn.includes("RECORDING BLUEPRINT"));
    assert.ok(textEn.includes("THE HOOK"));
    assert.ok(textEn.includes("THREE ANCHOR POINTS"));
  });
});
