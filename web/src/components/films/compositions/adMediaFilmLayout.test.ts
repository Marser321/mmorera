import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, safeArea, type FilmFormatName } from "@/lib/filmLayout";
import { AD_ASSETS, AD_COPY, AD_TIMELINE } from "@/data/films/flagships/adMedia";
import { GLYPH_EM, LINE_HEIGHT, lineCount } from "../scenes/brand/layout/mediaShared";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { AD_HERO_SLOT, AD_TITLE, adAllianceLayout, adBands, adBoardBlocks, adEngineeringLayout, adOpeningLayout, adPipelineLayout, adPipelineTiming, adSiteLayout } from "./adMediaFilmLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("adMediaFilmLayout: cada escena dentro del área segura y sin solapes", async (t) => {
  for (const format of FORMATS) {
    const safe = safeArea(format);
    for (const language of LANGUAGES) {
      const copy = AD_COPY[language];
      const name = `${format}/${language}`;

      await t.test(`${name}: títulos de escena en su banda`, () => {
        const { title } = adBands(format);
        const { size, lines } = AD_TITLE[format];
        assert.ok(size * 0.28 * 1.2 + size * 0.3 + lines * size * 1.1 <= title.h, `${name}: el título no entra en su banda`);
        for (const text of [copy.siteTitle, copy.pipelineTitle, copy.archTitle, copy.engineeringTitle]) {
          assert.ok(fitsLines(text, size, title.w, lines, 0.56), `${name}: "${text}" no entra en ${lines} línea(s)`);
        }
      });

      await t.test(`${name}: apertura sobre la grilla del isotipo`, () => {
        const opening = adOpeningLayout(format, copy.openingTagline, copy.openingKicker);
        for (const [label, box] of Object.entries({ plate: opening.plate, wordmark: opening.wordmark, kicker: opening.kicker, tagline: opening.tagline })) assertInside(box, safe, `${name} ${label}`);
        assert.ok(opening.plate.y + opening.plate.h <= opening.wordmark.y, `${name}: la placa pisa el logotipo`);
        assert.ok(opening.wordmark.y + opening.wordmark.h <= opening.kicker.y, `${name}: el logotipo pisa el rótulo`);
        assert.ok(opening.kicker.y + opening.kicker.h <= opening.tagline.y, `${name}: el rótulo pisa la tagline`);
        assert.ok(lineCount(copy.openingKicker, opening.kickerSize, opening.kicker.w, GLYPH_EM.label(0.24)) <= 1, `${name}: el rótulo no entra en una línea`);
        const taglineLines = lineCount(copy.openingTagline, opening.taglineSize, opening.tagline.w, GLYPH_EM.display);
        assert.ok(taglineLines * opening.taglineSize * LINE_HEIGHT.display <= opening.tagline.h + 0.5, `${name}: la tagline no entra`);
        assert.ok(opening.plate.w <= AD_ASSETS.brandGrid.w, `${name}: la placa amplía la grilla`);
        // El isotipo en partículas (proporción ~1,86:1) cae dentro de la placa.
        const w = opening.logoSize * 0.96;
        const h = w / 1.86;
        assert.ok(inside({ x: opening.logoCenter.x - w / 2, y: opening.logoCenter.y - h / 2, w, h }, opening.plate), `${name}: el isotipo sale de la placa`);
      });

      await t.test(`${name}: la alianza`, () => {
        const alliance = adAllianceLayout(format, copy);
        assertInside(alliance.plate.plate, safe, `${name} placa del CEO`);
        assert.ok(alliance.plate.caption, `${name}: la placa del CEO lleva su nombre`);
        assertInside(alliance.plate.caption!.text, alliance.plateBox, `${name} nombre del CEO`);
        assertInside(alliance.text, safe, `${name} beats`);
        assert.ok(!overlaps(alliance.plateBox, alliance.text), `${name}: la placa pisa los beats`);
        assert.ok(alliance.plate.plate.w <= AD_ASSETS.ceo.w, `${name}: la placa amplía la foto`);
      });

      await t.test(`${name}: el sitio`, () => {
        const site = adSiteLayout(format, copy);
        assertInside(site.reel, safe, `${name} navegador`);
        assertInside(site.listArea, safe, `${name} lista`);
        assert.ok(!overlaps(site.reel, site.listArea), `${name}: el navegador pisa la lista`);
        assertBlocks(site.blocks, site.listArea, format, `${name} lista`);
      });

      await t.test(`${name}: Speed-to-Lead y pipeline`, () => {
        const pipeline = adPipelineLayout(format, copy);
        const { body } = adBands(format);
        for (const [label, box] of Object.entries({ speed: pipeline.speed.frame, board: pipeline.board.frame, caption: pipeline.caption.frame })) assertInside(box, body, `${name} ${label}`);
        assert.ok(!overlaps(pipeline.speed.frame, pipeline.board.frame), `${name}: el panel de Speed-to-Lead pisa el tablero`);
        assert.ok(!overlaps(pipeline.board.frame, pipeline.caption.frame), `${name}: el tablero pisa la leyenda`);
        assertBlocks(pipeline.speed.blocks, pipeline.speed.frame, format, `${name} speed-to-lead`);
        assert.equal(pipeline.board.columns.length, 5, "5 etapas");
        // Cada estado del tablero (la protagonista en cada etapa) sin solapes.
        for (let stage = 0; stage < 5; stage++) assertBlocks(adBoardBlocks(pipeline.board, stage), pipeline.board.frame, format, `${name} tablero (etapa ${stage + 1})`);
        // La protagonista viaja por su propio carril: ninguna tarjeta de fondo en su camino.
        const lane = pipeline.board.columns.map((column) => column.slots[AD_HERO_SLOT].frame);
        const path =
          pipeline.board.orientation === "columns"
            ? { x: lane[0].x, y: lane[0].y, w: lane[4].x + lane[4].w - lane[0].x, h: lane[0].h }
            : { x: lane[0].x, y: lane[0].y, w: lane[0].w, h: lane[4].y + lane[4].h - lane[0].y };
        for (const column of pipeline.board.columns) {
          for (const [slot, card] of column.slots.entries()) if (slot !== AD_HERO_SLOT) assert.ok(!overlaps(card.frame, path), `${name}: ${card.name.id} está en el carril de la protagonista`);
        }
        // Cada automatización entra en la leyenda.
        for (const text of copy.automations) assert.ok(lineCount(text, pipeline.caption.size, pipeline.caption.text.w, 0.6) <= pipeline.caption.lines, `${name}: "${text}" no entra en la leyenda`);
      });

      await t.test(`${name}: ingeniería`, () => {
        const engineering = adEngineeringLayout(format, copy.creditLine);
        assertInside(engineering.facts, safe, `${name} cifras`);
        assertInside(engineering.creditBand, safe, `${name} créditos`);
        assert.ok(!overlaps(engineering.facts, engineering.creditBand), `${name}: las cifras pisan los créditos`);
        assertBlocks([{ kind: "media", id: "logo", box: engineering.logo }, engineering.credit], engineering.creditBand, format, `${name} créditos`);
      });
    }
  }
});

test("adMediaFilmLayout: el guion del tablero es monótono y entra en la escena", () => {
  const duration = AD_TIMELINE.pipeline.duration;
  const lastSecond = Math.max(...AD_COPY.es.leadEvents.map((event) => event.at));
  const timing = adPipelineTiming(duration, 5, lastSecond);
  const marks = [timing.toastIn, timing.clockFrom, timing.clockStop, timing.entry, timing.entry + timing.entryFrames, ...timing.moves.flatMap((move) => [move, move + timing.moveFrames])];
  for (let index = 1; index < marks.length; index++) assert.ok(marks[index] > marks[index - 1], `marca ${index} no avanza (${marks.join(", ")})`);
  assert.equal(timing.moves.length, 4, "4 movimientos para recorrer 5 etapas");
  assert.ok(marks[marks.length - 1] <= duration - 60, "el final necesita aire antes del fundido");
});
