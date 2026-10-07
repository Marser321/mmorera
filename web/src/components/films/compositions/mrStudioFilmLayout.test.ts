import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, safeArea, type FilmFormatName } from "@/lib/filmLayout";
import { MR_BODY, MR_COPY } from "@/data/films/flagships/mrStudio";
import { KIT_TITLE } from "./kit/kitLayout";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { captureCamera, mrBodyLayout, mrConsentLayout } from "./mrStudioFilmLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("mrStudioFilmLayout: zona del cuerpo y consentimiento sin solapes", async (t) => {
  for (const format of FORMATS) {
    const safe = safeArea(format);
    for (const language of LANGUAGES) {
      const copy = MR_COPY[language];
      const name = `${format}/${language}`;

      await t.test(`${name}: títulos`, () => {
        const { size, lines } = KIT_TITLE[format];
        for (const text of [copy.bodyTitle, copy.flowTitle, copy.consentTitle, copy.engineeringTitle]) assert.ok(fitsLines(text, size, safe.w, lines, 0.56), `"${text}" no entra`);
      });

      await t.test(`${name}: zona del cuerpo`, () => {
        const layout = mrBodyLayout(format, copy);
        assertInside(layout.window, layout.plateCol, `${name} ventana`);
        assertInside(layout.frame, layout.panelArea, `${name} brief`);
        assertInside(layout.panelArea, safe, `${name} columna del brief`);
        assert.ok(!overlaps(layout.plateCol, layout.panelArea), `${name}: la figura pisa el brief`);
        assertBlocks(layout.blocks, layout.frame, format, `${name} brief`);
        assert.equal(layout.rows.length, copy.briefBefore.length + 1 + copy.briefAfter.length);
        // La cámara nunca amplía la captura, ni con el zoom al antebrazo.
        for (const zoom of [1, 1.4, 1.9]) assert.ok(captureCamera(layout.window, MR_BODY.window, zoom, MR_BODY.forearm).scale <= 1);
        // Con el zoom máximo, el antebrazo queda dentro de la ventana.
        const cam = captureCamera(layout.window, MR_BODY.window, 1.9, MR_BODY.forearm);
        const x = cam.left + MR_BODY.forearm.x * cam.scale;
        const y = cam.top + MR_BODY.forearm.y * cam.scale;
        assert.ok(x > 0 && x < layout.window.w && y > 0 && y < layout.window.h, `${name}: el antebrazo sale de cuadro (${x}, ${y})`);
      });

      await t.test(`${name}: consentimiento`, () => {
        const layout = mrConsentLayout(format, copy);
        assertInside(layout.root, layout.body, `${name} nodo raíz`);
        for (const card of layout.cards) assertInside(card.frame, layout.body, `${name} ${card.title.text}`);
        assert.ok(!overlaps(layout.cards[0].frame, layout.cards[1].frame), `${name}: las tarjetas se pisan`);
        assertBlocks(layout.blocks, layout.body, format, `${name} consentimiento`);
        for (const card of layout.cards) assert.ok(inside(card.title.box, card.frame), "título fuera de su tarjeta");
      });
    }
  }
});
