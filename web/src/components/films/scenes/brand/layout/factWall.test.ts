import test from "node:test";
import assert from "node:assert/strict";
import { inside, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { countUpText, layoutProblems } from "./dataText";
import { DATA_SAMPLE_LABEL, dataTestBoxes, DEMO_FACTS, MIN_TEXT_SIZE } from "./dataSamples";
import { factWallLayout } from "./factWall";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("FactWall: layout sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of dataTestBoxes(format))
        for (const count of [4, 5, 6, 7, 8]) {
          await t.test(`${format} · ${language} · ${box.h}px · ${count} cifras`, () => {
            const base = DEMO_FACTS[language];
            const facts = Array.from({ length: count }, (_, index) => base[index % base.length]);
            const layout = factWallLayout(box, { facts, language, sampleLabel: DATA_SAMPLE_LABEL[language] }, format);
            assert.deepEqual(layoutProblems(layout.blocks, box), []);
            assert.equal(layout.tiles.length, count);
            for (let i = 0; i < layout.tiles.length; i++) for (let j = i + 1; j < layout.tiles.length; j++) assert.ok(!overlaps(layout.tiles[i].tile, layout.tiles[j].tile), "baldosas pisadas");
            for (const tile of layout.tiles) {
              // La línea del pie va entre el rótulo y la fuente, dentro de la baldosa.
              assert.ok(inside(tile.rule, tile.tile));
              assert.ok(tile.rule.y >= tile.label.box.y + tile.label.box.h && tile.rule.y + tile.rule.h <= tile.source.box.y);
            }
            for (const block of layout.blocks) if (block.kind === "text") assert.ok(block.size >= MIN_TEXT_SIZE[format], `${block.id} queda chico (${block.size}px)`);
          });
        }
});

test("FactWall: cada baldosa cita su fuente", () => {
  for (const language of LANGUAGES) {
    const layout = factWallLayout(dataTestBoxes("landscape")[0], { facts: DEMO_FACTS[language], language }, "landscape");
    layout.tiles.forEach((tile, index) => {
      assert.match(tile.source.text, language === "es" ? /^Fuente: / : /^Source: /);
      assert.ok(tile.source.text.endsWith(DEMO_FACTS[language][index].source));
    });
  }
});

test("FactWall: el conteo termina en la cifra exacta y respeta el formato", () => {
  for (const language of LANGUAGES)
    for (const fact of DEMO_FACTS[language]) {
      assert.equal(countUpText(fact.value, 1, language), fact.value);
      for (const t of [0, 0.2, 0.5, 0.9, 0.999]) assert.ok(countUpText(fact.value, t, language).length <= fact.value.length);
    }
  assert.equal(countUpText("1.096", 0.5, "es"), "548");
  assert.equal(countUpText("1.096", 0.95, "es"), "1.041");
  assert.equal(countUpText("1,096", 0.95, "en"), "1,041");
  assert.equal(countUpText("4,33 M", 0.5, "es"), "2,16 M");
  assert.equal(countUpText("4.33 M", 0, "en"), "0.00 M");
  assert.equal(countUpText("98/98", 0.5, "es"), "49/98");
});
