import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { PARTICLE_SCENES, resolveParticleScene } from "./particleScenes";
import { isTrackMode, resolveTrackMode, TRACK_MODE_QUERY } from "./trackModes";
import { ARCHIVE_CASES, FEATURED_CASES, PROJECT_CASES } from "./projectCases";

describe("premium site experience", () => {
  test("publishes every particle compiler state", () => {
    assert.deepEqual(Object.keys(PARTICLE_SCENES).sort(), ["build", "case", "create", "crm", "identity", "scale"]);
    assert.ok(Object.values(PARTICLE_SCENES).every((scene) => scene.density > 0 && scene.density <= 1));
    assert.ok(Object.values(PARTICLE_SCENES).every((scene) => scene.timing.assembleMs > 0));
  });

  test("falls back to the identity scene for unknown states", () => {
    const scene = resolveParticleScene("unknown");
    assert.equal(scene.id, "identity");
    assert.ok(scene.fallback.length > 0);
  });

  test("resolves and serializes every public track query", () => {
    assert.equal(resolveTrackMode("crear"), "create");
    assert.equal(resolveTrackMode("construir"), "build");
    assert.equal(resolveTrackMode("escalar"), "scale");
    assert.equal(resolveTrackMode("invalid"), "create");
    assert.equal(isTrackMode("invalid"), false);
    assert.deepEqual(Object.values(TRACK_MODE_QUERY), ["crear", "construir", "escalar"]);
  });

  test("curates six featured demos ahead of the archive", () => {
    assert.equal(FEATURED_CASES.length, 6);
    assert.equal(ARCHIVE_CASES.length, 7);
    assert.equal(PROJECT_CASES.length, 13);
    assert.deepEqual(PROJECT_CASES.slice(0, 6).map(({ status }) => status), Array(6).fill("featured"));
  });

  test("keeps case slugs unique and every case evidence-backed", () => {
    assert.equal(new Set(PROJECT_CASES.map(({ slug }) => slug)).size, PROJECT_CASES.length);
    assert.ok(PROJECT_CASES.every((project) => project.evidence.length > 0 && project.media.length > 0));
  });

  test("keeps every featured demo openable in the live viewer", () => {
    assert.ok(FEATURED_CASES.every((project) => Boolean(project.liveUrl)));
    assert.ok(FEATURED_CASES.every((project) => Boolean(project.accent)));
    assert.ok(
      PROJECT_CASES.filter((project) => project.embeddable === false).every((project) => project.media.length > 0),
    );
  });
});
