import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { layoutProblems } from "./dataText";
import { DATA_SAMPLE_LABEL, dataTestBoxes, DEMO_SCRIPT, MIN_TEXT_SIZE } from "./dataSamples";
import { scriptTimelineLayout, type ScriptSegment, type ScriptTimelineData } from "./scriptTimeline";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

const EXTRA = { es: ["Objeción", "Garantía"], en: ["Objection", "Guarantee"] };

test("ScriptTimeline: layout sin solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of dataTestBoxes(format))
        for (const variant of ["completo", "solo segmentos", "8 segmentos", "4 segmentos"] as const) {
          await t.test(`${format} · ${language} · ${box.h}px · ${variant}`, () => {
            const demo = DEMO_SCRIPT[language];
            const segments: ScriptSegment[] =
              variant === "8 segmentos" ? [...demo.segments, ...EXTRA[language].map((label) => ({ label }))] : variant === "4 segmentos" ? demo.segments.slice(0, 4) : demo.segments;
            const data: ScriptTimelineData =
              variant === "solo segmentos" ? { segments, language } : { ...demo, segments, language, sampleLabel: DATA_SAMPLE_LABEL[language] };
            const layout = scriptTimelineLayout(box, data, format);
            assert.deepEqual(layoutProblems(layout.blocks, box), []);
            assert.equal(layout.segments.length, segments.length);
            assert.equal(layout.breakdown.length, data.breakdown?.length ?? 0, "el desglose no se pierde");
            assert.equal(layout.checklist?.items.length ?? 0, data.checklist?.items.length ?? 0);
            if (data.sampleLabel) assert.ok(layout.sample, "falta el badge de ejemplo");
            // Todos los segmentos miden lo mismo: no se insinúan duraciones.
            const size = (frame: { w: number; h: number }) => (format === "portrait" ? frame.h : frame.w);
            for (const segment of layout.segments) assert.ok(Math.abs(size(segment.frame) - size(layout.segments[0].frame)) < 0.01);
            // Solo muestran tiempo los que lo tienen.
            layout.segments.forEach((segment, index) => assert.equal(Boolean(segment.timing), Boolean(segments[index].timing)));
            // El cabezal corre por su riel: el riel no toca ningún segmento.
            for (const segment of layout.segments) assert.ok(!overlaps(layout.rail, segment.frame));
            for (const block of layout.blocks) if (block.kind === "text") assert.ok(block.size >= MIN_TEXT_SIZE[format], `${block.id} queda chico (${block.size}px)`);
          });
        }
});

test("ScriptTimeline: horizontal en apaisado, vertical en retrato", () => {
  const landscape = scriptTimelineLayout(dataTestBoxes("landscape")[0], { ...DEMO_SCRIPT.es, language: "es" }, "landscape");
  const portrait = scriptTimelineLayout(dataTestBoxes("portrait")[0], { ...DEMO_SCRIPT.es, language: "es" }, "portrait");
  assert.equal(landscape.orientation, "horizontal");
  assert.equal(portrait.orientation, "vertical");
  assert.ok(landscape.rail.w > landscape.rail.h && portrait.rail.h > portrait.rail.w);
  assert.equal(landscape.segments[0].timing?.text, "0–4 s");
});
