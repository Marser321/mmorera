import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ECOSYSTEM_MODULES,
  calculateEcosystemMetrics,
} from "./ecosystemConfiguratorData";

describe("ecosystem configurator data model", () => {
  it("publishes 5 core ecosystem modules with valid metrics", () => {
    assert.equal(ECOSYSTEM_MODULES.length, 5);
    const ids = ECOSYSTEM_MODULES.map((m) => m.id);
    assert.deepEqual(ids, ["web", "whatsapp_ai", "voice_ai", "crm", "payments"]);

    for (const mod of ECOSYSTEM_MODULES) {
      assert.ok(mod.accentColor.startsWith("#"));
      assert.ok(mod.baseDays >= 3 && mod.baseDays <= 10);
      assert.ok(mod.monthlyHoursSaved >= 10);
      assert.ok(mod.conversionLiftPct >= 10);
      assert.ok(mod.name.es.length > 0);
      assert.ok(mod.name.en.length > 0);
      assert.ok(mod.keyFeature.es.length > 0);
      assert.ok(mod.keyFeature.en.length > 0);
    }
  });

  it("calculates realistic sprint and ROI metrics when multiple modules are selected", () => {
    // Select web + whatsapp_ai
    const report2 = calculateEcosystemMetrics(["web", "whatsapp_ai"]);
    assert.equal(report2.selectedCount, 2);
    assert.ok(report2.estimatedSprintDays >= 7 && report2.estimatedSprintDays <= 14);
    assert.equal(report2.totalMonthlyHoursSaved, 50); // 15 + 35
    assert.ok(report2.projectedConversionLiftPct > 20);

    // Select all 5 modules -> should cap at 21 days max
    const reportAll = calculateEcosystemMetrics(["web", "whatsapp_ai", "voice_ai", "crm", "payments"]);
    assert.equal(reportAll.selectedCount, 5);
    assert.equal(reportAll.estimatedSprintDays, 19); // 25 * 0.75 = 18.75 -> 19
    assert.ok(reportAll.totalMonthlyHoursSaved >= 100);
    assert.ok(reportAll.frictionReductionPct >= 80);
    assert.equal(reportAll.recommendedSprintTier.es, "Ecosistema Integral (3 Semanas)");
  });

  it("handles empty selection safely", () => {
    const emptyReport = calculateEcosystemMetrics([]);
    assert.equal(emptyReport.selectedCount, 0);
    assert.equal(emptyReport.estimatedSprintDays, 0);
    assert.equal(emptyReport.totalMonthlyHoursSaved, 0);
  });
});
