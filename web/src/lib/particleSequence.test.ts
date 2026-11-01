import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  PARTICLE_IDENTIFIABLE_PROGRESS,
  createParticleSequenceState,
  resolveInteractiveParticleScene,
  reduceParticleSequence,
  type ParticleSequenceTarget,
} from "./particleSequence";
import { resolveParticleScene } from "@/data/particleScenes";

function target(name: string, index: number): ParticleSequenceTarget<string> {
  return { name, index, cacheKey: `${name}:16000`, payload: name };
}

describe("particle sequence controller", () => {
  test("keeps at most the current and incoming targets", () => {
    let state = reduceParticleSequence(createParticleSequenceState<string>(), {
      type: "mount",
      target: target("Figma", 0),
    });
    state = reduceParticleSequence(state, { type: "queue", target: target("Next.js", 1) });
    state = reduceParticleSequence(state, { type: "queue", target: target("Three.js", 2) });

    assert.equal(state.current?.name, "Figma");
    assert.equal(state.incoming?.name, "Three.js");
    assert.equal([state.current, state.incoming].filter(Boolean).length, 2);
  });

  test("keeps the confirmed label until the incoming target is identifiable", () => {
    let state = reduceParticleSequence(createParticleSequenceState<string>(), {
      type: "mount",
      target: target("Figma", 0),
    });
    state = reduceParticleSequence(state, { type: "confirm" });
    state = reduceParticleSequence(state, { type: "queue", target: target("Next.js", 1) });
    state = reduceParticleSequence(state, { type: "begin-dissolve" });
    state = reduceParticleSequence(state, { type: "promote" });

    assert.equal(state.current?.name, "Next.js");
    assert.equal(state.confirmedName, "Figma");
    assert.equal(state.phase, "assemble");

    state = reduceParticleSequence(state, { type: "confirm" });
    assert.equal(state.confirmedName, "Next.js");
    assert.ok(PARTICLE_IDENTIFIABLE_PROGRESS > 0.5);
    assert.ok(PARTICLE_IDENTIFIABLE_PROGRESS < 1);
  });

  test("retains the last valid formation when the next target fails", () => {
    let state = reduceParticleSequence(createParticleSequenceState<string>(), {
      type: "mount",
      target: target("n8n", 0),
    });
    state = reduceParticleSequence(state, { type: "confirm" });
    state = reduceParticleSequence(state, { type: "queue", target: target("Broken", 1) });
    state = reduceParticleSequence(state, { type: "retain-current" });

    assert.equal(state.current?.name, "n8n");
    assert.equal(state.incoming, null);
    assert.equal(state.confirmedName, "n8n");
    assert.equal(state.phase, "hold");
  });

  test("keeps route and family scenes unformed without explicit focus", () => {
    for (const route of ["/", "/en", "/sistemas", "/en/sistemas", "/estudio", "/en/estudio"]) {
      for (const families of [[], ["Automation", "CRM", "AI"]] as const) {
        const scene = resolveInteractiveParticleScene(resolveParticleScene(route, [...families]), null);
        assert.equal(scene.mode, "ambient");
        assert.deepEqual(scene.techNames, []);
      }
    }
  });

  test("locks the requested service until focus is released", () => {
    const route = resolveParticleScene("/");
    const focused = resolveInteractiveParticleScene(route, "service:web-ecommerce");
    assert.equal(focused.mode, "locked");
    assert.deepEqual(focused.techNames, ["service:web-ecommerce"]);
    const idle = resolveInteractiveParticleScene(focused, null);
    assert.equal(idle.mode, "ambient");
    assert.deepEqual(idle.techNames, []);
  });

  test("clears both targets and the label when a formation finishes dissolving", () => {
    let state = reduceParticleSequence(createParticleSequenceState<string>(), { type: "mount", target: target("service:web-ecommerce", 0) });
    state = reduceParticleSequence(state, { type: "confirm" });
    state = reduceParticleSequence(state, { type: "begin-dissolve" });
    state = reduceParticleSequence(state, { type: "clear" });
    assert.deepEqual(state, createParticleSequenceState<string>());
  });

  test("realigns a shared technology to the first slot of a new scene", () => {
    let state = reduceParticleSequence(createParticleSequenceState<string>(), {
      type: "mount",
      target: target("Next.js", 4),
    });
    state = reduceParticleSequence(state, { type: "confirm" });
    state = reduceParticleSequence(state, {
      type: "align-current",
      target: target("Next.js", 0),
    });

    assert.equal(state.current?.index, 0);
    assert.equal(state.current?.name, "Next.js");
    assert.equal(state.confirmedName, "Next.js");
  });
});
