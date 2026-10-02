import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CASE_TOPOLOGIES,
  getCaseTopology,
} from "./caseTopologyData";

describe("case topology data model", () => {
  it("publishes tailored topologies for primary featured cases", () => {
    const featuredSlugs = ["lb-elite-wash-detail", "new-brothers-barberia", "ad-media-solution"];

    for (const slug of featuredSlugs) {
      const topo = CASE_TOPOLOGIES[slug];
      assert.ok(topo, `Must have topology for ${slug}`);
      assert.equal(topo.nodes.length, 4);
      assert.ok(topo.accentColor.startsWith("#"));
      assert.ok(topo.headline.es.length > 0);
      assert.ok(topo.headline.en.length > 0);

      topo.nodes.forEach((n) => {
        assert.ok(n.name.es.length > 0);
        assert.ok(n.name.en.length > 0);
        assert.ok(n.statusBadge.es.length > 0);
        assert.ok(n.statusBadge.en.length > 0);
        assert.ok(n.payloadSummary.es.length > 0);
        assert.ok(n.payloadSummary.en.length > 0);
        assert.ok(n.metricHighlight.length > 0);
      });
    }
  });

  it("returns fallback default topology for unmapped case slugs safely", () => {
    const fallback = getCaseTopology("unknown-case-slug", "#FFB86C");
    assert.equal(fallback.projectSlug, "unknown-case-slug");
    assert.equal(fallback.accentColor, "#FFB86C");
    assert.equal(fallback.nodes.length, 4);
  });
});
