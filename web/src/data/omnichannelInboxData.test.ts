import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OMNICHANNEL_LEADS } from "./omnichannelInboxData";

describe("omnichannel inbox data model", () => {
  it("publishes 3 distinct omnichannel leads with valid response speed and values", () => {
    assert.equal(OMNICHANNEL_LEADS.length, 3);
    const ids = OMNICHANNEL_LEADS.map((l) => l.id);
    assert.deepEqual(ids, ["lead-1", "lead-2", "lead-3"]);

    for (const lead of OMNICHANNEL_LEADS) {
      assert.ok(lead.dealValueUsd > 500);
      assert.ok(lead.intentScore >= 90 && lead.intentScore <= 100);
      assert.ok(lead.responseSpeedSec > 0 && lead.responseSpeedSec <= 35);
      assert.ok(lead.customerName.length > 0);
      assert.ok(lead.companyName.length > 0);
      assert.ok(lead.channelColor.startsWith("#"));
      assert.ok(lead.messages.length >= 3);
      assert.ok(lead.availableActions.length >= 2);
    }
  });

  it("verifies alternating message senders and action feedback in both languages", () => {
    for (const lead of OMNICHANNEL_LEADS) {
      for (const msg of lead.messages) {
        assert.ok(msg.text.es.length > 0);
        assert.ok(msg.text.en.length > 0);
        assert.ok(["customer", "ai_agent", "system"].includes(msg.sender));
      }

      for (const action of lead.availableActions) {
        assert.ok(action.label.es.length > 0);
        assert.ok(action.label.en.length > 0);
        assert.ok(action.actionFeedback.es.length > 0);
        assert.ok(action.actionFeedback.en.length > 0);
      }
    }
  });
});
