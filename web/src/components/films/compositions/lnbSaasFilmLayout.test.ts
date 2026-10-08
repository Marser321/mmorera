import test from "node:test";
import { safeArea } from "@/lib/filmLayout";
import { assertBlocks, assertInside } from "./layoutAssertions";
import {
  lnbCakeBuilderLayout,
  lnbExpressLayout,
  lnbLoyaltyLayout,
  lnbStudiosLayout,
} from "./lnbSaasFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("LNB SaaS · The Cake Studio: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `cake-builder ${format}/${language}`;
      const layout = lnbCakeBuilderLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      assertInside(layout.previewCard, layout.body, `${name}: previewCard en body`);
      assertInside(layout.previewBadge, layout.previewCard, `${name}: previewBadge en previewCard`);
      assertInside(layout.hintBar, layout.body, `${name}: hintBar en body`);
      assertInside(layout.hintBlock.box, layout.hintBar, `${name}: hintBlock en hintBar`);

      for (const step of layout.steps) {
        assertInside(step.card, layout.body, `${name}: stepCard en body`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("LNB SaaS · Craving Studios: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `card-mosaic ${format}/${language}`;
      const layout = lnbStudiosLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      for (const s of layout.studios) {
        assertInside(s.card, layout.body, `${name}: studioCard en body`);
        assertInside(s.tagBox, s.card, `${name}: tagBox en card`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("LNB SaaS · LNB Express: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `catalog-flow ${format}/${language}`;
      const layout = lnbExpressLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      assertInside(layout.catalogCard, layout.body, `${name}: catalogCard en body`);
      assertInside(layout.kdsCard, layout.body, `${name}: kdsCard en body`);
      assertInside(layout.pickupBadge, layout.catalogCard, `${name}: pickupBadge en catalogCard`);
      assertInside(layout.zeroWaitBadge, layout.kdsCard, `${name}: zeroWaitBadge en kdsCard`);

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("LNB SaaS · Fidelización & Pass: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `loyalty-card ${format}/${language}`;
      const layout = lnbLoyaltyLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      assertInside(layout.cardBox, layout.body, `${name}: cardBox en body`);
      assertInside(layout.pointsBox, layout.cardBox, `${name}: pointsBox en cardBox`);
      assertInside(layout.savedBox, layout.cardBox, `${name}: savedBox en cardBox`);

      for (const t of layout.tiers) {
        assertInside(t.card, layout.body, `${name}: tierCard en body`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
