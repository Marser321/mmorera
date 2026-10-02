import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  TECH_ALERTS,
  MODEL_RECOMMENDATIONS,
  CONTENT_BLUEPRINTS,
  PARALLEL_CRAWLER_AGENTS,
  calculateMultiModelArbitrage,
  generateCustomBlueprint,
  generateFormattedBlueprintText,
} from "./techRadarData";

describe("tech radar and backstage content studio data model", () => {
  it("publishes at least 5 distinct market alerts covering WhatsApp, LLMs, CRMs, Voice and Open Source models", () => {
    assert.ok(TECH_ALERTS.length >= 5);
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
      assert.ok(alert.sourceName.length > 0);
    }
  });

  it("publishes parallel crawler agents with active endpoints and telemetry", () => {
    assert.equal(PARALLEL_CRAWLER_AGENTS.length, 5);
    for (const agent of PARALLEL_CRAWLER_AGENTS) {
      assert.ok(agent.id.startsWith("crawler-"));
      assert.ok(agent.name.length > 0);
      assert.ok(agent.sourceTarget.length > 0);
      assert.ok(agent.latencyMs > 0);
      assert.ok(agent.payloadSizeKb > 0);
      assert.ok(agent.lastEvent.es.length > 0);
    }
  });

  it("calculates realistic multi-model cost arbitrage and savings", () => {
    // Test with 50,000 ops
    const result50k = calculateMultiModelArbitrage(50000);
    assert.equal(result50k.monthlyOps, 50000);
    assert.ok(result50k.singleModelCost > 1000);
    assert.ok(result50k.orchestratedCost < 250);
    assert.ok(result50k.monthlySavingsUsd > 900);
    assert.ok(result50k.savingsPercentage >= 80);
    assert.ok(result50k.orchestratedLatencyMs < result50k.singleModelLatencyMs);

    // Test breakdown sums
    const { breakdown } = result50k;
    assert.equal(
      breakdown.triageGeminiOps + breakdown.ragDeepSeekOps + breakdown.logicClaudeOps,
      50000
    );
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
    assert.ok(CONTENT_BLUEPRINTS.length >= 4);
    for (const bp of CONTENT_BLUEPRINTS) {
      assert.ok(bp.hook.es.length > 0);
      assert.ok(bp.trapWarning.es.length > 0);
      assert.ok(bp.coreArchitecture.es.length > 0);
      assert.equal(bp.anchorPoints.es.length, 3);
      assert.equal(bp.anchorPoints.en.length, 3);
      assert.ok(bp.closingCta.es.length > 0);
    }
  });

  it("dynamically generates custom blueprints for any topic and format", () => {
    const customReel = generateCustomBlueprint("DeepSeek R1 en local", "reel", "es");
    assert.equal(customReel.format, "reel");
    assert.equal(customReel.anchorPoints.es.length, 3);
    assert.ok(customReel.hook.es.includes("DeepSeek R1 en local"));

    const customYt = generateCustomBlueprint("WhatsApp API Pricing", "youtube", "en");
    assert.equal(customYt.format, "youtube");
    assert.equal(customYt.anchorPoints.en.length, 3);

    const customLi = generateCustomBlueprint("GoHighLevel vs Supabase", "linkedin", "es");
    assert.equal(customLi.format, "linkedin");
    assert.equal(customLi.anchorPoints.es.length, 3);
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
