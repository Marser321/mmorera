import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { DOGE_COPY } from "@/data/films/flagships/dogeSm";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { dogeTierOfferLayout } from "./dogeSmFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("DOGE.S.M · Oferta de Membresías: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `tier-offer ${format}/${language}`;
      const layout = dogeTierOfferLayout(format, DOGE_COPY[language], language);
      const safe = safeArea(format);

      assert.equal(layout.cards.length, 3, `${name}: 3 tarjetas de planes`);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      assertInside(layout.summaryBar, layout.body, `${name}: barra resumen en body`);
      assertInside(layout.summaryBlock.box, layout.summaryBar, `${name}: texto resumen en barra`);

      for (const c of layout.cards) {
        assertInside(c.card, layout.body, `${name}: tarjeta ${c.id}`);
        assertInside(c.badgeBox, c.card, `${name}: badge box ${c.id}`);
        assertInside(c.badgeBlock.box, c.badgeBox, `${name}: badge text ${c.id}`);
        assertInside(c.nameBlock.box, c.card, `${name}: name ${c.id}`);
        assertInside(c.cadenceBlock.box, c.card, `${name}: cadence ${c.id}`);
        assertInside(c.priceBox, c.card, `${name}: price box ${c.id}`);
        assertInside(c.priceBlock.box, c.card, `${name}: price text ${c.id}`);
        assertInside(c.periodBlock.box, c.card, `${name}: period ${c.id}`);
        assertInside(c.ctaBox, c.card, `${name}: cta box ${c.id}`);
        assertInside(c.ctaBlock.box, c.ctaBox, `${name}: cta text ${c.id}`);

        assert.ok(!overlaps(c.badgeBox, c.nameBlock.box), `${name}: badge pisa name en ${c.id}`);
        assert.ok(!overlaps(c.nameBlock.box, c.cadenceBlock.box), `${name}: name pisa cadence en ${c.id}`);
        assert.ok(!overlaps(c.cadenceBlock.box, c.priceBox), `${name}: cadence pisa price en ${c.id}`);
        assert.ok(!overlaps(c.priceBlock.box, c.periodBlock.box), `${name}: price pisa period en ${c.id}`);

        for (const f of c.features) {
          assertInside(f.box, c.card, `${name}: feature en ${c.id}`);
        }
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
