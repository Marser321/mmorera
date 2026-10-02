import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  COLOR_THEMES,
  RADIUS_PRESETS,
  GLASS_PRESETS,
  generateTailwindConfigSnippet,
  generateCssVariablesSnippet,
} from "./designTokenData";

describe("design token data model", () => {
  it("publishes 4 distinct color themes with valid hex and glow colors", () => {
    assert.equal(COLOR_THEMES.length, 4);
    for (const theme of COLOR_THEMES) {
      assert.ok(theme.id.length > 0);
      assert.ok(theme.accentColor.startsWith("#"));
      assert.ok(theme.secondaryColor.startsWith("#"));
      assert.ok(theme.surfaceColor.startsWith("#"));
      assert.ok(theme.glowColor.startsWith("rgba"));
    }
  });

  it("publishes 3 distinct radius presets from sharp to squircle", () => {
    assert.equal(RADIUS_PRESETS.length, 3);
    assert.equal(RADIUS_PRESETS[0].px, 0);
    assert.equal(RADIUS_PRESETS[1].px, 12);
    assert.equal(RADIUS_PRESETS[2].px, 24);
  });

  it("publishes 3 distinct glass presets with increasing blur levels", () => {
    assert.equal(GLASS_PRESETS.length, 3);
    assert.equal(GLASS_PRESETS[0].blurPx, 0);
    assert.ok(GLASS_PRESETS[1].blurPx > 0);
    assert.ok(GLASS_PRESETS[2].blurPx > GLASS_PRESETS[1].blurPx);
  });

  it("generates clean and valid Tailwind config code snippets", () => {
    const code = generateTailwindConfigSnippet(
      COLOR_THEMES[0],
      RADIUS_PRESETS[1],
      GLASS_PRESETS[1]
    );
    assert.ok(code.includes("tailwind.config.ts"));
    assert.ok(code.includes(COLOR_THEMES[0].accentColor));
    assert.ok(code.includes("12px"));
    assert.ok(code.includes("16px"));
  });

  it("generates valid CSS variables code snippets", () => {
    const css = generateCssVariablesSnippet(
      COLOR_THEMES[1],
      RADIUS_PRESETS[2],
      GLASS_PRESETS[2]
    );
    assert.ok(css.includes(":root {"));
    assert.ok(css.includes("--brand-accent: #B68CFF;"));
    assert.ok(css.includes("--radius-custom: 24px;"));
  });
});
