import test from "node:test";
import { safeArea } from "@/lib/filmLayout";
import { assertBlocks, assertInside } from "./layoutAssertions";
import {
  hubProfessionSwitcherLayout,
  hubProtocolLayout,
  hubServicesLayout,
} from "./hubProfesionalFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("Hub Profesional · Profession Switcher: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      for (let profIndex = 0; profIndex < 6; profIndex++) {
        const name = `profession-switcher ${format}/${language}/prof-${profIndex}`;
        const layout = hubProfessionSwitcherLayout(format, language, profIndex);
        const safe = safeArea(format);

        assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
        assertInside(layout.tabsRow, layout.body, `${name}: tabsRow en body`);
        assertInside(layout.activeCard, layout.body, `${name}: activeCard en body`);
        assertInside(layout.badgeBox, layout.activeCard, `${name}: badgeBox en activeCard`);
        assertInside(layout.titleBlock.box, layout.activeCard, `${name}: titleBlock en activeCard`);
        assertInside(layout.headlineBlock.box, layout.activeCard, `${name}: headlineBlock en activeCard`);
        assertInside(layout.statsBox, layout.activeCard, `${name}: statsBox en activeCard`);
        assertInside(layout.previewCard, layout.activeCard, `${name}: previewCard en activeCard`);
        assertInside(layout.hintBar, layout.body, `${name}: hintBar en body`);

        for (const tab of layout.tabs) {
          assertInside(tab.box, layout.tabsRow, `${name}: tab ${tab.id} en tabsRow`);
        }

        assertBlocks(layout.blocks, safe, format, name);
      }
    }
  }
});

test("Hub Profesional · Servicios Tácticos: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `tactical-catalog ${format}/${language}`;
      const layout = hubServicesLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      for (const s of layout.services) {
        assertInside(s.card, layout.body, `${name}: serviceCard en body`);
        assertInside(s.codeBox, s.card, `${name}: codeBox en card`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});

test("Hub Profesional · Protocolo en 4 Fases: bloques dentro de margen", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `protocol-stepper ${format}/${language}`;
      const layout = hubProtocolLayout(format, language);
      const safe = safeArea(format);

      assertInside(layout.subtitleBlock.box, layout.body, `${name}: subtitulo en body`);
      for (const p of layout.steps) {
        assertInside(p.card, layout.body, `${name}: protocolCard en body`);
        assertInside(p.stepBox, p.card, `${name}: stepBox en card`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
