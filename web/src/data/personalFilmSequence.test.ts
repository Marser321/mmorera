import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  PERSONAL_FILM_SEQUENCE,
  clampFilmProgress,
  resolveFilmStage,
  resolveFilmTime,
  resolvePersonalFilmSource,
  shouldSeekFilm,
} from "./personalFilmSequence";

describe("personal film sequence", () => {
  it("maps scroll progress to the 14.2 second master and holds the closing frame", () => {
    assert.equal(resolveFilmTime(-1), 0);
    assert.equal(resolveFilmTime(Number.NaN), 0);
    assert.equal(resolveFilmTime(0.485), 7.1);
    assert.equal(resolveFilmTime(0.97), 14.2);
    assert.equal(resolveFilmTime(1), 14.2);
    assert.equal(clampFilmProgress(2), 1);
  });

  it("synchronizes the editorial stages to the approved cuts", () => {
    assert.equal(resolveFilmStage(0), "introduction");
    assert.equal(resolveFilmStage(0.124), "create");
    assert.equal(resolveFilmStage(0.364), "build");
    assert.equal(resolveFilmStage(0.561), "scale");
    assert.equal(resolveFilmStage(0.833), "convergence");
    assert.equal(resolveFilmStage(0.94), "closing");
    assert.equal(resolveFilmStage(1), "closing");
    assert.deepEqual(PERSONAL_FILM_SEQUENCE.cuts, [0.57, 1.77, 3.6, 5.17, 6.67, 7.97, 9.67, 11.83]);
  });

  it("selects responsive sources and ignores imperceptible seek noise", () => {
    const desktop = resolvePersonalFilmSource(PERSONAL_FILM_SEQUENCE, true);
    const mobile = resolvePersonalFilmSource(PERSONAL_FILM_SEQUENCE, false);
    assert.equal(desktop.aspectRatio, 16 / 9);
    assert.equal(mobile.aspectRatio, 4 / 5);
    assert.deepEqual(desktop.sources.map(({ type }) => type), ["video/webm; codecs=vp9", "video/mp4"]);
    assert.deepEqual(mobile.sources.map(({ type }) => type), ["video/mp4"]);
    assert.equal(PERSONAL_FILM_SEQUENCE.seekWatchdogMs, 250);
    assert.equal(PERSONAL_FILM_SEQUENCE.activationTimeoutMs, 1_500);
    assert.equal(shouldSeekFilm(1, 1.01), false);
    assert.equal(shouldSeekFilm(1, 1.1), true);
    assert.equal(shouldSeekFilm(Number.NaN, 1), false);
  });

  it("ships ordered sources and final posters within the production budgets", () => {
    const publicRoot = join(process.cwd(), "public");
    for (const [viewport, source] of [
      ["desktop", PERSONAL_FILM_SEQUENCE.desktop],
      ["mobile", PERSONAL_FILM_SEQUENCE.mobile],
    ] as const) {
      const maxVideoBytes = viewport === "desktop" ? 6_000_000 : 4_000_000;
      for (const { src: path } of source.sources) {
        const file = statSync(join(publicRoot, path.replace(/^\//, "")));
        assert.ok(file.isFile());
        assert.ok(file.size <= maxVideoBytes);
      }
      for (const path of [source.posterWebp, source.posterAvif]) {
        assert.ok(statSync(join(publicRoot, path.replace(/^\//, ""))).isFile());
      }
    }
  });
});
