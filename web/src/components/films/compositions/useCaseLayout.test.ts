import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { USE_CASE_FILMS } from "@/data/films/systemsFilms";
import { inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { mediaSize } from "@/lib/mediaSize";
import { FLOW_MONO_TRACKING, logLine, nodeMeta, packetPoint, packetReach } from "../scenes/flowLayout";
import { bodyWidth, lineCount, monoWidth } from "../scenes/siteText";
import { breakpointSize, breakpointWidth, KICKER_TRACKING, layoutUseCaseFilm, PHONE_BEZEL, PORTRAIT_VISUAL_MIN } from "./useCaseLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;

/** El mismo rótulo que arma UseCaseFilmRoom. */
function badgeFor(film: (typeof USE_CASE_FILMS)[number], language: "es" | "en") {
  if (film.kind === "real") return `${language === "es" ? "Caso real" : "Real case"} · ${film.caseTitle?.[language] ?? ""}`;
  return language === "es" ? "Flujo de ejemplo · datos de muestra" : "Example flow · sample data";
}

function noOverlaps(boxes: Array<{ id: string; box: Box }>, gap = 0) {
  const problems: string[] = [];
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) if (overlaps(boxes[i].box, boxes[j].box, gap)) problems.push(`${boxes[i].id} × ${boxes[j].id}`);
  return problems;
}

const circle = (x: number, y: number, r: number): Box => ({ x: x - r, y: y - r, w: r * 2, h: r * 2 });

for (const film of USE_CASE_FILMS)
  for (const format of FORMATS)
    for (const language of LANGUAGES)
      test(`UseCaseFilm ${film.id} · ${format} · ${language}: nada se pisa y todo entra`, () => {
        const layout = layoutUseCaseFilm(film, language, format, badgeFor(film, language));
        const { safe, kicker, badge } = layout;
        const header = [
          { id: "rubro", box: kicker.box },
          { id: "rótulo", box: badge.box },
        ];
        assert.deepEqual(noOverlaps(header, 24), []);
        for (const item of header) assert.ok(inside(item.box, safe), `${item.id} sale de la zona útil`);
        const headerBottom = Math.max(kicker.box.y + kicker.box.h, badge.box.y + badge.box.h);

        // Problema y diagnóstico: cada titular fuera del visual y por debajo de la cabecera.
        for (const spec of [layout.problem, layout.diagnosis]) {
          assert.ok(spec.box.y > headerBottom + 20, `${spec.text}: pisa la cabecera`);
          assert.ok(inside(spec.box, safe), `${spec.text}: sale de la zona útil`);
          assert.ok(!overlaps(spec.box, layout.visual, 24), `${spec.text}: pisa el visual`);
          assert.ok(spec.lines <= (format === "portrait" ? 3 : 4), `${spec.text}: ${spec.lines} líneas`);
        }
        assert.ok(inside(layout.visual, safe), "el visual sale de la zona útil");
        if (format === "portrait") assert.ok(layout.visual.h >= PORTRAIT_VISUAL_MIN, `visual de ${layout.visual.h}px: el rótulo de quiebre pisaría el contenido`);
        // 16:9: el rótulo de quiebre entra en una línea (en dos subiría sobre los carriles del visual).
        if (format === "landscape") {
          const pill = breakpointWidth(film.diagnosis.breakpoint[language], breakpointSize(false));
          assert.ok(pill <= layout.visual.w, `rótulo de quiebre de ${pill}px en un visual de ${layout.visual.w}px`);
        }

        // Sistema: titular, nodos y registro en bandas separadas.
        const { headline, flow, log } = layout.system;
        assert.equal(headline.lines, 1);
        assert.ok(inside(headline.box, safe));
        const nodes = flow.nodes.map((box, index) => ({ id: `nodo ${index + 1}`, box }));
        assert.deepEqual(noOverlaps([{ id: "titular", box: headline.box }, ...nodes, ...(log ? [{ id: "registro", box: log.box }] : [])], 16), []);
        for (const node of nodes) assert.ok(inside(node.box, safe), `${node.id} sale de la zona útil`);
        if (log) {
          assert.ok(inside(log.box, safe), "el registro sale de la zona útil");
          film.stages.forEach((_, index) => {
            const line = logLine(film.stages, index, language);
            assert.ok(monoWidth(`${line.stamp} ${line.rest}`, log.size) <= log.box.w, `línea ${index + 1} del registro no entra`);
          });
        }

        // Textos de cada nodo: enteros, sin elipsis.
        const { text } = flow;
        film.stages.forEach((stage, index) => {
          const inner = flow.nodes[index].w - text.padX * 2;
          assert.ok(lineCount(stage.title[language], inner, (word) => bodyWidth(word, text.title, -0.03)) <= text.titleLines, `título de ${stage.id} no entra`);
          assert.ok(lineCount(stage.technology, inner, (word) => monoWidth(word, text.mono)) <= text.techLines, `tecnología de ${stage.id} no entra`);
          const head = monoWidth(`0${index + 1}`, text.mono, FLOW_MONO_TRACKING) + 8 + monoWidth(nodeMeta(stage) || "✓", text.mono, FLOW_MONO_TRACKING);
          assert.ok(head <= inner, `rótulo de ${stage.id} no entra`);
          const content = text.padY * 2 + text.mono * 1.3 * (1 + text.techLines) + text.title * 1.1 * text.titleLines + text.gap * 2;
          assert.ok(content <= flow.nodes[index].h, `${stage.id}: el contenido no entra en el nodo`);
        });

        // El paquete viaja solo por los cables: nunca toca un nodo ni un punto del riel.
        const reach = packetReach(flow);
        const solids = [...flow.nodes, ...(flow.dot ? flow.anchors.map((anchor) => circle(anchor.x, anchor.y, flow.dot / 2)) : [])];
        flow.cables.forEach((_, index) => {
          for (let step = 0; step <= 50; step++) {
            const point = packetPoint(flow, index, step / 50);
            const packet = circle(point.x, point.y, reach);
            for (const solid of solids) assert.ok(!overlaps(packet, solid), `cable ${index + 1}: el paquete pisa un nodo en u=${step / 50}`);
          }
        });

        // Resultado: titular, hechos y teléfono sin tocarse.
        const result = layout.result;
        const blocks = [
          { id: "titular", box: result.headline.box },
          ...result.facts.map((box, index) => ({ id: `hecho ${index + 1}`, box })),
          ...(result.phone ? [{ id: "teléfono", box: result.phone }] : []),
          ...(result.caption ? [{ id: "pie", box: result.caption }] : []),
        ];
        assert.deepEqual(noOverlaps(blocks, 16), []);
        for (const block of blocks) assert.ok(inside(block.box, safe), `${block.id} sale de la zona útil`);
        assert.ok(result.headline.box.y > headerBottom + 20);
        film.result.facts.forEach((fact, index) => {
          const box = result.facts[index];
          const value = bodyWidth(fact.value[language], result.valueSize, -0.05);
          if (result.row) {
            const labelRoom = box.w - 60 - 28 - value;
            assert.ok(lineCount(fact.label[language], labelRoom, (word) => bodyWidth(word, result.labelSize)) <= 2, `etiqueta ${index + 1} no entra`);
          } else {
            assert.ok(value <= box.w - 48, `cifra ${index + 1} no entra`);
            const lines = lineCount(fact.label[language], box.w - 48, (word) => bodyWidth(word, result.labelSize));
            assert.ok(lines <= 2, `etiqueta ${index + 1} no entra`);
            assert.ok(44 + result.valueSize + lines * result.labelSize * 1.25 <= box.h, `hecho ${index + 1} desborda`);
          }
        });
        if (result.caption) {
          const label = language === "es" ? "Sitio en producción" : "Live in production";
          assert.ok(monoWidth(label.toUpperCase(), 14, 0.14) + 18 <= result.caption.w, "pie del teléfono no entra");
        }
        assert.ok(monoWidth(kicker.text, kicker.size, KICKER_TRACKING) <= kicker.box.w + 0.5);
      });

test("la captura del teléfono nunca se amplía más allá de su resolución nativa", () => {
  for (const film of USE_CASE_FILMS) {
    if (!film.result.screenshot) continue;
    const layout = layoutUseCaseFilm(film, "es", "landscape", badgeFor(film, "es"));
    assert.ok(layout.result.phone, `${film.id}: falta el teléfono`);
    const native = mediaSize(readFileSync(join(process.cwd(), "public", film.result.screenshot)), film.result.screenshot);
    const drawn = layout.result.phone.w - PHONE_BEZEL * 2;
    assert.ok(drawn <= native.width, `${film.id}: ${drawn}px de pantalla para ${native.width}px nativos`);
  }
});
