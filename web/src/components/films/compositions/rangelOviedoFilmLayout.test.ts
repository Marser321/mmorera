import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { ROG_COPY } from "@/data/films/flagships/rangelOviedo";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { rogGoalPathsLayout } from "./rangelOviedoFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("Rangel Oviedo · El Método y perfiles: bloques dentro de margen y sin pisarse", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `goal-paths ${format}/${language}`;
      const layout = rogGoalPathsLayout(format, ROG_COPY[language], language);
      const safe = safeArea(format);

      assert.equal(layout.profileCards.length, 4, `${name}: 4 perfiles`);
      assert.equal(layout.stepCards.length, 5, `${name}: 5 etapas`);

      for (const p of layout.profileCards) {
        assertInside(p.card, layout.body, `${name}: tarjeta perfil ${p.id}`);
        assertInside(p.label.box, p.card, `${name}: label ${p.id}`);
        assertInside(p.detail.box, p.card, `${name}: detail ${p.id}`);
        assert.ok(!overlaps(p.label.box, p.detail.box), `${name}: label pisa detail en ${p.id}`);
      }

      for (const s of layout.stepCards) {
        assertInside(s.card, layout.body, `${name}: tarjeta etapa ${s.num}`);
        assertInside(s.badgeBox, s.card, `${name}: insignia ${s.num}`);
        assertInside(s.numBlock.box, s.badgeBox, `${name}: número ${s.num}`);
        assertInside(s.title.box, s.card, `${name}: title ${s.num}`);
        assertInside(s.desc.box, s.card, `${name}: desc ${s.num}`);
        assert.ok(!overlaps(s.badgeBox, s.title.box), `${name}: insignia pisa title en ${s.num}`);
        assert.ok(!overlaps(s.title.box, s.desc.box), `${name}: title pisa desc en ${s.num}`);
      }

      assertBlocks(layout.blocks, safe, format, name);
    }
  }
});
