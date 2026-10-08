import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { EVO_COPY } from "@/data/films/flagships/evowrap";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { evoFinishSelectorLayout, evoTransformationLayout } from "./evowrapFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("EvoWrap · Configurador 3D: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `finish-selector ${format}/${language}`;
      const layout = evoFinishSelectorLayout(format, EVO_COPY[language], language);
      const safe = safeArea(format);

      assert.equal(layout.cards.length, 8, `${name}: 8 tarjetas de acabados`);

      assertInside(layout.window.win, layout.body, `${name}: ventana de captura`);
      assertInside(layout.window.url.box, layout.window.bar, `${name}: url en barra`);

      for (const c of layout.cards) {
        assertInside(c.card, layout.body, `${name}: tarjeta ${c.id}`);
        assertInside(c.swatch, c.card, `${name}: swatch ${c.id}`);
        assertInside(c.codeBlock.box, c.card, `${name}: code ${c.id}`);
        assertInside(c.nameBlock.box, c.card, `${name}: name ${c.id}`);
        assertInside(c.metaBlock.box, c.card, `${name}: meta ${c.id}`);

        assert.ok(!overlaps(c.swatch, c.codeBlock.box), `${name}: swatch pisa code en ${c.id}`);
        assert.ok(!overlaps(c.codeBlock.box, c.nameBlock.box), `${name}: code pisa name en ${c.id}`);
        assert.ok(!overlaps(c.swatch, c.metaBlock.box), `${name}: swatch pisa meta en ${c.id}`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("EvoWrap · Comparador antes y después: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `transformation ${format}/${language}`;
      const layout = evoTransformationLayout(format, EVO_COPY[language]);
      const safe = safeArea(format);

      assertInside(layout.frame, layout.body, `${name}: marco comparador`);
      assertInside(layout.beforeBadge, layout.frame, `${name}: badge antes`);
      assertInside(layout.afterBadge, layout.frame, `${name}: badge después`);
      assertInside(layout.note.box, layout.body, `${name}: nota explicativa`);

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
