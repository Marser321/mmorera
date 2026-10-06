import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inset, inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { CRM_SAMPLE_LABEL, crmTestBoxes, DEMO_PIPELINE } from "./crmSamples";
import { layoutProblems, MIN_TEXT } from "./dataText";
import { cardStateAt, PIPELINE_MAX_STAGES, pipelineBlocks, pipelineBoardLayout, pipelineTiming, stagesAfter, type PipelineBoardData } from "./pipelineBoard";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

/** Variantes de la demo: sin workflow, sin cabecera, con menos tarjetas y con cinco etapas (donde entran). */
function variants(language: (typeof LANGUAGES)[number], format: FilmFormatName): Array<{ name: string; data: PipelineBoardData }> {
  const base: PipelineBoardData = { ...DEMO_PIPELINE[language], sampleLabel: CRM_SAMPLE_LABEL[language] };
  const fiveStages: PipelineBoardData = {
    ...base,
    stages: [...base.stages.slice(0, 3), { id: "proposal", label: language === "es" ? "Propuesta" : "Proposal" }, base.stages[3]],
  };
  return [
    { name: "demo", data: base },
    { name: "sin workflow", data: { ...base, workflow: undefined } },
    { name: "sin rótulo", data: { ...base, boardTitle: undefined } },
    { name: "tres tarjetas", data: { ...base, cards: base.cards.slice(0, 3) } },
    { name: "cinco etapas", data: fiveStages },
  ].filter(({ data }) => data.stages.length <= PIPELINE_MAX_STAGES[format]);
}

test("PipelineBoard: ningún estado del tablero tiene solapes", async (t) => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of crmTestBoxes(format))
        for (const { name, data } of variants(language, format)) {
          await t.test(`${format} · ${language} · ${box.h}px · ${name}`, () => {
            const layout = pipelineBoardLayout(box, data, format);
            const timing = pipelineTiming(data, 360);
            // Cada estado estable (antes del primer movimiento y después de cada uno).
            for (let count = 0; count <= timing.moves.length; count++) {
              const blocks = pipelineBlocks(layout, stagesAfter(timing, data, count));
              assert.deepEqual(layoutProblems(blocks, box), [], `estado ${count}`);
              for (const block of blocks) {
                assert.ok(inside(block.box, box), `${block.id} sale de la caja`);
                if (block.kind !== "text") continue;
                assert.ok(block.size >= MIN_TEXT[format], `${block.id} queda chico (${block.size}px)`);
                assert.ok(fitsLines(block.text, block.size, block.box.w, block.lines, block.glyph), `${block.id} no entra`);
              }
            }
            // Las tarjetas quedan dentro de su columna y en su carril.
            layout.cells.forEach((row, cardIndex) =>
              row.forEach((cell, stage) => {
                assert.ok(inside(cell.frame, layout.columns[stage].frame), `tarjeta ${cardIndex} sale de la columna ${stage}`);
                assert.ok(inside(cell.frame, layout.lanes[cardIndex]), `tarjeta ${cardIndex} sale de su carril`);
                assert.ok(inside(cell.title.box, cell.frame));
                if (cell.meta) assert.ok(inside(cell.meta.box, cell.frame));
                for (const tag of cell.tags) assert.ok(inside(tag.frame, inset(cell.frame, 1)));
              }),
            );
            // Carriles separados: ninguna tarjeta comparte fila con otra.
            for (let i = 1; i < layout.lanes.length; i++) assert.ok(!overlaps(layout.lanes[i - 1], layout.lanes[i]));
          });
        }
});

test("PipelineBoard: la tarjeta que viaja nunca pasa por encima de otro texto", () => {
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      for (const box of crmTestBoxes(format))
        for (const { data } of variants(language, format)) {
          const layout = pipelineBoardLayout(box, data, format);
          const timing = pipelineTiming(data, 360);
          timing.moves.forEach((move, index) => {
            const before = stagesAfter(timing, data, index);
            const from = layout.cells[move.card][move.from].frame;
            const to = layout.cells[move.card][move.to].frame;
            // Recorrido completo, con el margen de la tarjeta levantada (escala 1,04).
            const lift = from.w * 0.02 + 1;
            const sweep: Box = { x: Math.min(from.x, to.x) - lift, y: from.y - lift, w: Math.abs(to.x - from.x) + from.w + lift * 2, h: from.h + lift * 2 };
            const others = pipelineBlocks(layout, before).filter((block) => !block.id.startsWith(`card.${move.card}`) && !block.id.startsWith(`card.${data.cards[move.card].id}`));
            for (const block of others) {
              if (block.kind === "frame" && (block.id === "board" || block.id.endsWith(".frame"))) continue;
              assert.ok(!overlaps(sweep, block.box), `${format} · ${language}: el movimiento ${index} pasa sobre ${block.id}`);
            }
          });
        }
});

test("PipelineBoard: un movimiento por vez y el riel se enciende en orden", () => {
  for (const language of LANGUAGES) {
    const data = { ...DEMO_PIPELINE[language], sampleLabel: CRM_SAMPLE_LABEL[language] };
    for (const duration of [240, 360, 480]) {
      const timing = pipelineTiming(data, duration);
      assert.equal(timing.moves.length, data.cards.reduce((total, card) => total + card.path.length - 1, 0));
      for (let i = 1; i < timing.moves.length; i++) assert.ok(timing.moves[i].start >= timing.moves[i - 1].end, "dos tarjetas se mueven a la vez");
      const last = timing.moves[timing.moves.length - 1];
      assert.ok(last.end <= duration, "el último movimiento termina después de la escena");
      for (let i = 1; i < timing.stepAt.length; i++) assert.ok(timing.stepAt[i] > timing.stepAt[i - 1]);
      assert.ok(timing.stepAt.every((at) => Number.isFinite(at) && at <= duration));
      // La ruta de cada tarjeta se recorre completa y en orden.
      data.cards.forEach((card, cardIndex) => {
        const finalStage = cardStateAt(timing, data, cardIndex, duration).stage;
        assert.equal(data.stages[finalStage].id, card.path[card.path.length - 1]);
      });
    }
  }
});

test("PipelineBoard: una etapa desconocida en una ruta falla con un mensaje claro", () => {
  const data = { ...DEMO_PIPELINE.es, sampleLabel: CRM_SAMPLE_LABEL.es };
  assert.throws(() => pipelineTiming({ ...data, cards: [{ id: "x", title: "X", path: ["new", "nope"] }] }, 300), /nope/);
});
