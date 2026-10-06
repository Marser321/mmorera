import test from "node:test";
import assert from "node:assert/strict";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import { inside, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { layoutProblems } from "./dataText";
import { DATA_SAMPLE_LABEL, dataTestBoxes, DEMO_LEDGER, MIN_TEXT_SIZE } from "./dataSamples";
import { EVIDENCE_TONES, evidenceLedgerLayout, tierTag } from "./evidenceLedger";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

test("EvidenceLedger: layout sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of dataTestBoxes(format))
        for (const variant of ["completo", "sin desglose ni notas"] as const) {
          await t.test(`${format} · ${language} · ${box.h}px · ${variant}`, () => {
            const demo = DEMO_LEDGER[language];
            const data =
              variant === "completo"
                ? { ...demo, language, sampleLabel: DATA_SAMPLE_LABEL[language] }
                : { ...demo, breakdown: undefined, wording: undefined, tiers: demo.tiers.map((tier) => ({ ...tier, note: undefined })), language };
            const layout = evidenceLedgerLayout(box, data, format);
            assert.deepEqual(layoutProblems(layout.blocks, box), []);
            assert.equal(layout.rows.length, data.tiers.length);
            assert.equal(layout.breakdown.length, data.breakdown?.length ?? 0, "el desglose no se pierde");
            for (let i = 1; i < layout.rows.length; i++) assert.ok(!overlaps(layout.rows[i - 1].card, layout.rows[i].card), "filas pisadas");
            for (const row of layout.rows) {
              assert.ok(inside(row.marker, row.card));
              assert.equal(row.items.length, data.tiers.find((tier) => tier.id === row.id)?.items.length);
            }
            // La cabecera queda por encima de la primera fila.
            const firstTop = layout.rows[0].card.y;
            for (const block of [layout.totalValue, layout.totalLabel, ...layout.breakdown.map((chip) => chip.text)]) assert.ok(block.box.y + block.box.h <= firstTop);
            for (const block of layout.blocks) if (block.kind === "text") assert.ok(block.size >= MIN_TEXT_SIZE[format], `${block.id} queda chico (${block.size}px)`);
          });
        }
});

test("EvidenceLedger: rótulos de redacción solo en aprobado y prohibido", () => {
  const wording = DEMO_LEDGER.es.wording;
  assert.equal(tierTag("approved", wording), "Redacción permitida");
  assert.equal(tierTag("prohibited", wording), "Redacción prohibida");
  assert.equal(tierTag("signal", wording), null);
  assert.equal(tierTag("approved", undefined), null);
});

test("EvidenceLedger: ningún nivel usa el dorado (ni ningún acento) de una marca; prohibido es rojo", () => {
  const accents = Object.values(CASE_BRANDS).flatMap((brand) => [brand.palette.accent, brand.palette.accentSoft, brand.palette.accentDeep].map((color) => color.toLowerCase()));
  for (const tone of Object.values(EVIDENCE_TONES)) if (tone) assert.ok(!accents.includes(tone.toLowerCase()));
  const red = EVIDENCE_TONES.prohibited ?? "";
  const [r, g, b] = [1, 3, 5].map((at) => Number.parseInt(red.slice(at, at + 2), 16));
  assert.ok(r > g + 40 && r > b + 40, "prohibido debe leerse rojo");
});
