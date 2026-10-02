import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { VOICE_AGENT_PERSONAS } from "./voiceAgentLabData";

describe("voice agent lab data model", () => {
  it("publishes 3 distinct voice agent personas with valid telemetry", () => {
    assert.equal(VOICE_AGENT_PERSONAS.length, 3);

    const ids = VOICE_AGENT_PERSONAS.map((p) => p.id);
    assert.deepEqual(ids, ["clinic", "realestate", "dealership"]);

    for (const persona of VOICE_AGENT_PERSONAS) {
      assert.ok(persona.name.es.length > 0);
      assert.ok(persona.name.en.length > 0);
      assert.ok(persona.role.es.length > 0);
      assert.ok(persona.role.en.length > 0);
      assert.ok(persona.accentColor.startsWith("#"));
      assert.ok(persona.telemetry.latencyMs > 0 && persona.telemetry.latencyMs < 500);
      assert.ok(persona.telemetry.sttEngine.length > 0);
      assert.ok(persona.telemetry.llmEngine.length > 0);
      assert.ok(persona.telemetry.ttsEngine.length > 0);
    }
  });

  it("ensures dialogue turns alternate with valid audio energy and CRM events", () => {
    for (const persona of VOICE_AGENT_PERSONAS) {
      assert.ok(persona.dialogue.length >= 4);

      // Check alternating speaker pattern
      persona.dialogue.forEach((turn, idx) => {
        const expectedSpeaker = idx % 2 === 0 ? "caller" : "agent";
        assert.equal(turn.speaker, expectedSpeaker);
        assert.ok(turn.text.es.length > 0);
        assert.ok(turn.text.en.length > 0);
        assert.ok(turn.audioEnergy > 0 && turn.audioEnergy <= 1.0);
      });

      // Verify at least one CRM event is emitted by the agent
      const crmEvents = persona.dialogue.filter((d) => d.crmEvent !== undefined);
      assert.ok(crmEvents.length >= 1, `Persona ${persona.id} must have at least one CRM event`);
    }
  });
});
