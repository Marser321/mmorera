import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, overlaps, safeArea, type FilmFormatName } from "@/lib/filmLayout";
import { LB_COPY } from "@/data/films/flagships/lbWash";
import { GLYPH_EM, LINE_HEIGHT, lineCount } from "../scenes/brand/layout/mediaShared";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { LB_TITLE, lbBands, lbCrewLayout, lbHeroLayout, lbQuoterLayout, PHONE } from "./lbWashFilmLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("lbWashFilmLayout: cada escena dentro del área segura y sin solapes", async (t) => {
  for (const format of FORMATS) {
    const safe = safeArea(format);
    for (const language of LANGUAGES) {
      const copy = LB_COPY[language];
      const name = `${format}/${language}`;

      await t.test(`${name}: títulos de escena en su banda`, () => {
        const { title } = lbBands(format);
        const { size, lines } = LB_TITLE[format];
        // BrandTitle: rótulo (0,28 del tamaño) + margen + líneas del título.
        const titleH = size * 0.28 * 1.2 + size * 0.3 + lines * size * 1.1;
        assert.ok(titleH <= title.h, `${name}: el título necesita ${titleH} px y la banda tiene ${title.h}`);
        for (const text of [copy.quoterTitle, copy.archTitle, copy.crewTitle, copy.engineeringTitle]) {
          assert.ok(fitsLines(text, size, title.w, lines, 0.56), `${name}: "${text}" no entra en ${lines} línea(s)`);
        }
      });

      await t.test(`${name}: apertura`, () => {
        const hero = lbHeroLayout(format, copy.heroTagline, copy.heroKicker);
        assertInside(hero.plate, safe, `${name} placa`);
        assertInside(hero.text, safe, `${name} banda de texto`);
        assertInside(hero.kicker, hero.text, `${name} rótulo`);
        assertInside(hero.tagline, hero.text, `${name} tagline`);
        assert.ok(hero.plate.y + hero.plate.h <= hero.text.y, `${name}: la placa pisa el texto`);
        assert.ok(hero.plate.w <= hero.asset.w, `${name}: la placa amplía la foto`);
        assert.ok(lineCount(copy.heroKicker, hero.kickerSize, hero.kicker.w, GLYPH_EM.label(0.24)) <= 1, `${name}: el rótulo no entra en una línea`);
        assert.ok(hero.kickerSize >= (format === "portrait" ? 20 : 15), `${name}: rótulo ilegible`);
        const lines = lineCount(copy.heroTagline, hero.taglineSize, hero.tagline.w, GLYPH_EM.display);
        assert.ok(lines * hero.taglineSize * LINE_HEIGHT.display <= hero.tagline.h + 0.5, `${name}: la tagline no entra`);
        // El monograma queda dentro de la placa.
        assert.ok(hero.logoSize <= hero.plate.h, `${name}: el monograma es más alto que la placa`);
      });

      await t.test(`${name}: cotizador y webhook`, () => {
        const quoter = lbQuoterLayout(format, copy);
        assertInside(quoter.reel, safe, `${name} navegador`);
        assertInside(quoter.panel.frame, quoter.panelArea, `${name} panel`);
        assert.ok(!overlaps(quoter.reel, quoter.panelArea), `${name}: el navegador pisa el panel`);
        assert.ok(!overlaps(quoter.title, quoter.reel), `${name}: el título pisa el navegador`);
        assertBlocks(quoter.panel.blocks, quoter.panel.frame, format, `${name} webhook`);
        assert.equal(quoter.panel.lines.length, copy.payloadLines.length);
        assert.equal(quoter.panel.vans.length, 4);
      });

      await t.test(`${name}: cuadrilla`, () => {
        const crew = lbCrewLayout(format, copy);
        assertInside(crew.phone, crew.phoneCol, `${name} teléfono`);
        // El teléfono flota ±4 px: necesita ese aire dentro de su columna.
        assert.ok(crew.phone.y - 4 >= crew.phoneCol.y && crew.phone.y + crew.phone.h + 4 <= crew.phoneCol.y + crew.phoneCol.h, `${name}: el teléfono no tiene aire para flotar`);
        assert.ok(Math.abs(crew.phone.h - crew.phone.w * PHONE.aspect) < 0.01, `${name}: proporción del teléfono`);
        assertInside(crew.panel.frame, crew.panelArea, `${name} panel`);
        assertInside(crew.panelArea, safe, `${name} columna del panel`);
        assert.ok(!overlaps(crew.phoneCol, crew.panelArea), `${name}: el teléfono pisa el panel`);
        assertBlocks(crew.panel.blocks, crew.panel.frame, format, `${name} acciones`);
        assert.equal(crew.panel.rows.length, copy.crewActions.length);
      });
    }
  }
});
