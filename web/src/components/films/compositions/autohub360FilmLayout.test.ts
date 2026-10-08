import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { AUTOHUB_COPY } from "@/data/films/flagships/autohub360";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { autohubInteriorTourLayout } from "./autohub360FilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("AutoHub 360 · Tour Interior: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `interior-tour ${format}/${language}`;
      const layout = autohubInteriorTourLayout(format, AUTOHUB_COPY[language], language);
      const safe = safeArea(format);

      assert.equal(layout.cards.length, 8, `${name}: 8 tarjetas de puntos de interés`);

      assertInside(layout.window.win, layout.body, `${name}: ventana del visor`);
      assertInside(layout.window.url.box, layout.window.bar, `${name}: url en barra`);

      for (const c of layout.cards) {
        assertInside(c.card, layout.body, `${name}: tarjeta ${c.id}`);
        assertInside(c.badgeBox, c.card, `${name}: badge ${c.id}`);
        assertInside(c.codeBlock.box, c.card, `${name}: code ${c.id}`);
        assertInside(c.catBlock.box, c.card, `${name}: cat ${c.id}`);
        assertInside(c.titleBlock.box, c.card, `${name}: title ${c.id}`);
        assertInside(c.descBlock.box, c.card, `${name}: desc ${c.id}`);

        assert.ok(!overlaps(c.badgeBox, c.codeBlock.box), `${name}: badge pisa code en ${c.id}`);
        assert.ok(!overlaps(c.codeBlock.box, c.catBlock.box), `${name}: code pisa cat en ${c.id}`);
        assert.ok(!overlaps(c.titleBlock.box, c.descBlock.box), `${name}: title pisa desc en ${c.id}`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
