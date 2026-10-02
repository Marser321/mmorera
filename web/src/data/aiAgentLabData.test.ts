import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { AI_AGENT_PRESETS } from "./aiAgentLabData";

describe("ai agent lab data model", () => {
  test("publishes 3 distinct agent presets with valid scenarios", () => {
    assert.equal(AI_AGENT_PRESETS.length, 3);
    const ids = AI_AGENT_PRESETS.map((a) => a.id);
    assert.deepEqual(ids, ["qualifier", "scheduler", "reactivator"]);

    for (const agent of AI_AGENT_PRESETS) {
      assert.ok(agent.name.es.length > 0);
      assert.ok(agent.name.en.length > 0);
      assert.ok(agent.tagline.es.length > 0);
      assert.ok(agent.tagline.en.length > 0);
      assert.ok(agent.accentColor.startsWith("#"));
      assert.ok(agent.scenarios.length > 0);

      for (const scenario of agent.scenarios) {
        assert.ok(scenario.title.es.length > 0);
        assert.ok(scenario.userMessage.es.length > 0);
        assert.ok(scenario.agentReply.es.length > 0);
        assert.ok(scenario.extractedEntities.intent.length > 0);
        assert.ok(scenario.webhookPayload.event.length > 0);
        assert.ok(scenario.webhookPayload.targetService.length > 0);
        assert.ok(scenario.webhookPayload.contact.tags.length > 0);
        assert.ok(scenario.webhookPayload.contact.leadScore > 0);
      }
    }
  });
});
