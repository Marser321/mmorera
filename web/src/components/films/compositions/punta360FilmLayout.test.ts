import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { assertBlocks, assertInside } from "./layoutAssertions";
import {
  puntaComparisonLayout,
  puntaPlansLayout,
  puntaVirtualTourLayout,
  puntaWorkflowLayout,
} from "./punta360FilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("Punta360 · Tour Inmersivo: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `virtual-tour ${format}/${language}`;
      const layout = puntaVirtualTourLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.viewportBox, layout.body, `${name}: viewport en body`);
      assertInside(layout.telemetryBar, layout.body, `${name}: telemetria en body`);
      assertInside(layout.telemetryBlock.box, layout.telemetryBar, `${name}: texto telemetria en barra`);

      for (const h of layout.hotspots) {
        assertInside(h.marker, layout.viewportBox, `${name}: marker en viewport`);
        assertInside(h.card, layout.viewportBox, `${name}: hotspot card en viewport`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("Punta360 · Comparativa HDR: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `comparison ${format}/${language}`;
      const layout = puntaComparisonLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      assertInside(layout.leftCard, layout.body, `${name}: leftCard en body`);
      assertInside(layout.rightCard, layout.body, `${name}: rightCard en body`);
      assertInside(layout.leftBadge, layout.leftCard, `${name}: leftBadge en leftCard`);
      assertInside(layout.rightBadge, layout.rightCard, `${name}: rightBadge en rightCard`);

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("Punta360 · Planes de Suscripción: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `plans ${format}/${language}`;
      const layout = puntaPlansLayout(format, language);
      const safe = safeArea(format);

      assert.equal(layout.cards.length, 3, `${name}: 3 tarjetas de planes`);
      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);

      for (const c of layout.cards) {
        assertInside(c.card, layout.body, `${name}: tarjeta ${c.id}`);
        assertInside(c.nameBlock.box, c.card, `${name}: name ${c.id}`);
        assertInside(c.priceBox, c.card, `${name}: price box ${c.id}`);
        assertInside(c.priceBlock.box, c.priceBox, `${name}: price text ${c.id}`);
        assertInside(c.ctaBox, c.card, `${name}: cta box ${c.id}`);
        assertInside(c.ctaBlock.box, c.ctaBox, `${name}: cta text ${c.id}`);

        assert.ok(!overlaps(c.nameBlock.box, c.priceBox), `${name}: name pisa price en ${c.id}`);
        assert.ok(!overlaps(c.priceBox, c.ctaBox), `${name}: price pisa cta en ${c.id}`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("Punta360 · Flujo de Producción: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `workflow ${format}/${language}`;
      const layout = puntaWorkflowLayout(format, language);
      const safe = safeArea(format);

      assert.equal(layout.steps.length, 4, `${name}: 4 pasos de flujo`);
      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);

      for (const s of layout.steps) {
        assertInside(s.card, layout.body, `${name}: card step ${s.step}`);
        assertInside(s.numberBlock.box, s.card, `${name}: number step ${s.step}`);
        assertInside(s.titleBlock.box, s.card, `${name}: title step ${s.step}`);
        assertInside(s.descBlock.box, s.card, `${name}: desc step ${s.step}`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
