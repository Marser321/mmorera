import test from "node:test";
import assert from "node:assert/strict";
import {
  INDUSTRY_FILTERS,
  SOLUTION_FILTERS,
  MATCHED_PROJECTS,
  filterProjects,
} from "./caseSolutionMatcherData";

test("case solution matcher data model", async (t) => {
  await t.test("publishes valid industry and solution filters with bilingual labels", () => {
    assert.ok(INDUSTRY_FILTERS.length >= 4);
    assert.ok(SOLUTION_FILTERS.length >= 3);

    for (const ind of INDUSTRY_FILTERS) {
      assert.ok(ind.id, "industry must have an id");
      assert.ok(ind.name.es && ind.name.en, "industry must have bilingual names");
    }

    for (const sol of SOLUTION_FILTERS) {
      assert.ok(sol.id, "solution must have an id");
      assert.ok(sol.name.es && sol.name.en, "solution must have bilingual names");
    }
  });

  await t.test("publishes curated matched projects with verified metrics", () => {
    assert.ok(MATCHED_PROJECTS.length >= 5);

    for (const proj of MATCHED_PROJECTS) {
      assert.ok(proj.slug, "project must have a slug");
      assert.ok(proj.title.es && proj.title.en, "project must have bilingual titles");
      assert.ok(proj.summary.es && proj.summary.en, "project must have bilingual summaries");
      assert.ok(proj.metricBadge.es && proj.metricBadge.en, "project must have metric badge");
      // Puntaje real medido (no un objetivo): solo se valida que sea un score válido.
      assert.ok(proj.pageSpeedScore >= 0 && proj.pageSpeedScore <= 100, "PageSpeed must be a valid score");
      assert.ok(proj.sprintWeeks >= 1 && proj.sprintWeeks <= 3, "sprint must be 1 to 3 weeks");
      assert.ok(proj.liveUrl.startsWith("https://"), "liveUrl must be valid https URL");
    }
  });

  await t.test("filters projects correctly by industry and solution", () => {
    // All filters
    const all = filterProjects("all", "all");
    assert.equal(all.projects.length, MATCHED_PROJECTS.length);
    assert.ok(all.averagePageSpeed > 0 && all.averagePageSpeed <= 100);

    // Automotive only
    const automotive = filterProjects("automotive", "all");
    assert.ok(automotive.projects.length >= 1);
    for (const p of automotive.projects) {
      assert.equal(p.industry, "automotive");
    }

    // AI & CRM only
    const aiCrm = filterProjects("all", "ai_crm");
    assert.ok(aiCrm.projects.length >= 1);
    for (const p of aiCrm.projects) {
      assert.equal(p.solutionType, "ai_crm");
    }

    // Specific intersection
    const localBooking = filterProjects("local_services", "booking_payments");
    assert.ok(localBooking.projects.length >= 1);
    assert.equal(localBooking.projects[0].slug, "new-brothers-barberia");
  });
});
