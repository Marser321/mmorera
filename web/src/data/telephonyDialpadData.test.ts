import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DTMF_KEYPAD,
  TELEPHONY_PRESETS,
  getDtmfTone,
  formatDialDisplay,
} from "./telephonyDialpadData";

describe("telephony dialpad data model", () => {
  it("publishes 12 authentic DTMF keypad keys with standard ITU frequencies", () => {
    assert.equal(DTMF_KEYPAD.length, 12);
    const keys = DTMF_KEYPAD.map((k) => k.key);
    assert.deepEqual(keys, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"]);

    // Key 1 should be 697Hz and 1209Hz
    const key1 = getDtmfTone("1");
    assert.ok(key1);
    assert.equal(key1.lowFreq, 697);
    assert.equal(key1.highFreq, 1209);

    // Key # should be 941Hz and 1477Hz
    const keyPound = getDtmfTone("#");
    assert.ok(keyPound);
    assert.equal(keyPound.lowFreq, 941);
    assert.equal(keyPound.highFreq, 1477);
  });

  it("publishes 3 distinct telephony presets with complete dialogue turns and CRM actions", () => {
    assert.equal(TELEPHONY_PRESETS.length, 3);
    for (const preset of TELEPHONY_PRESETS) {
      assert.ok(preset.id.startsWith("preset-"));
      assert.ok(preset.phoneNumber.length > 5);
      assert.ok(preset.personaName.length > 0);
      assert.ok(preset.firstMessage.es.length > 0);
      assert.ok(preset.callerIntent.es.length > 0);
      assert.ok(preset.aiFollowup.es.length > 0);
      assert.ok(preset.crmAction.es.length > 0);
      assert.ok(preset.latencyMs < 300); // verify sub-300ms latency requirement
    }
  });

  it("formats dial input safely", () => {
    assert.equal(formatDialDisplay("+1 (800) 336-8251"), "+18003368251");
    assert.equal(formatDialDisplay("*0#"), "*0#");
    assert.equal(formatDialDisplay(""), "");
  });
});
