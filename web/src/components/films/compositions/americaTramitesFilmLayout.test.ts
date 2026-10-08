import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { AT_COPY } from "@/data/films/flagships/americaTramites";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { atStagedFormLayout } from "./americaTramitesFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("América Trámites · Recorrido por etapas: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `staged-form ${format}/${language}`;
      const layout = atStagedFormLayout(format, AT_COPY[language], language);
      const safe = safeArea(format);

      assert.equal(layout.cards.length, 4, `${name}: 4 tarjetas de etapas`);

      assertInside(layout.window.win, layout.body, `${name}: ventana de captura`);
      assertInside(layout.window.url.box, layout.window.bar, `${name}: url en barra`);

      for (const c of layout.cards) {
        assertInside(c.card, layout.body, `${name}: tarjeta ${c.id}`);
        assertInside(c.badge, c.card, `${name}: insignia ${c.id}`);
        assertInside(c.numBlock.box, c.badge, `${name}: número ${c.id}`);
        assertInside(c.tagBlock.box, c.card, `${name}: tag ${c.id}`);
        assertInside(c.titleBlock.box, c.card, `${name}: title ${c.id}`);
        assertInside(c.detailBlock.box, c.card, `${name}: detail ${c.id}`);

        assert.ok(!overlaps(c.badge, c.tagBlock.box), `${name}: insignia pisa tag en ${c.id}`);
        assert.ok(!overlaps(c.badge, c.titleBlock.box), `${name}: insignia pisa title en ${c.id}`);
        assert.ok(!overlaps(c.tagBlock.box, c.titleBlock.box), `${name}: tag pisa title en ${c.id}`);
        assert.ok(!overlaps(c.titleBlock.box, c.detailBlock.box), `${name}: title pisa detail en ${c.id}`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
