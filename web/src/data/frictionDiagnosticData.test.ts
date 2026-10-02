import test from "node:test";
import assert from "node:assert/strict";
import {
  FRICTION_SYMPTOMS,
  calculateFrictionDiagnostic,
} from "./frictionDiagnosticData";

test("friction diagnostic data model", async (t) => {
  await t.test("publishes 5 core friction symptoms with complete metrics", () => {
    assert.equal(FRICTION_SYMPTOMS.length, 5);

    for (const symptom of FRICTION_SYMPTOMS) {
      assert.ok(symptom.id, "symptom must have an id");
      assert.ok(symptom.badge.es && symptom.badge.en, "symptom must have bilingual badges");
      assert.ok(symptom.title.es && symptom.title.en, "symptom must have bilingual titles");
      assert.ok(symptom.description.es && symptom.description.en, "symptom must have descriptions");
      assert.ok(symptom.frictionPoints > 0, "friction points must be positive");
      assert.ok(symptom.monthlyHoursImpact > 0, "hours impact must be positive");
      assert.ok(symptom.monthlyDollarsImpact > 0, "dollars impact must be positive");
      assert.ok(
        symptom.solutionComponent.es && symptom.solutionComponent.en,
        "symptom must have bilingual solution components"
      );
    }
  });

  await t.test("calculates healthy baseline when 0 symptoms are checked", () => {
    const report = calculateFrictionDiagnostic([]);
    assert.equal(report.selectedCount, 0);
    assert.equal(report.severity, "healthy");
    assert.ok(report.frictionScorePct <= 5);
    assert.equal(report.totalMonthlyHoursWasted, 0);
    assert.equal(report.totalMonthlyDollarsLost, 0);
    assert.ok(report.prescribedSprint.durationDays > 0);
  });

  await t.test("calculates moderate severity when 1-2 symptoms are checked", () => {
    const report = calculateFrictionDiagnostic(["slow_response", "manual_data_entry"]);
    assert.equal(report.selectedCount, 2);
    assert.ok(report.frictionScorePct >= 25 && report.frictionScorePct < 60);
    assert.equal(report.severity, "moderate");
    assert.ok(report.totalMonthlyHoursWasted > 40);
    assert.ok(report.totalMonthlyDollarsLost > 1000);
    assert.equal(report.prescribedSprint.durationDays, 14);
  });

  await t.test("calculates critical severity when 4-5 symptoms are checked", () => {
    const allIds = FRICTION_SYMPTOMS.map((s) => s.id);
    const report = calculateFrictionDiagnostic(allIds);
    assert.equal(report.selectedCount, 5);
    assert.ok(report.frictionScorePct >= 80);
    assert.equal(report.severity, "critical");
    assert.ok(report.totalMonthlyHoursWasted >= 100);
    assert.ok(report.totalMonthlyDollarsLost >= 3000);
    assert.equal(report.prescribedSprint.durationDays, 21);
    assert.ok(report.prescribedSprint.recommendedStack.length >= 4);
  });
});
