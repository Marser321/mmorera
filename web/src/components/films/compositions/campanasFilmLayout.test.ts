import { test } from "node:test";
import assert from "node:assert/strict";
import { CAMPANAS_CHAPTERS, CAMPANAS_DURATION, CAMPANAS_FILM } from "@/data/films/campanasFilm";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { fitsLines, inside, overlaps, safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { campanasLayout } from "./campanasFilmLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES: FilmLanguage[] = ["es", "en"];

function assertSeparate(boxes: Box[], label: string) {
  boxes.forEach((box, index) => {
    boxes.slice(index + 1).forEach((other) => assert.ok(!overlaps(box, other), `${label}: dos cajas se pisan`));
  });
}

test("la cinemática de campañas se compone sin pisarse en los dos formatos e idiomas", async (t) => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      await t.test(`${format} · ${language}`, () => {
        const layout = campanasLayout(format, language);
        const area = safeArea(format);
        const within = (box: Box, label: string) => assert.ok(inside(box, area), `${label} se sale de la zona útil`);

        // Antes
        [...layout.before.tabs, layout.before.sheet, layout.before.clock].forEach((box) => within(box, "antes"));
        assert.ok(!overlaps(layout.before.sheet, layout.before.clock), "la planilla pisa el reloj");

        // Una pregunta
        within(layout.question.prompt, "barra de la pregunta");
        layout.question.sources.forEach((box) => within(box, "fuente"));
        layout.question.counters.forEach((box) => within(box, "contador"));
        assertSeparate(layout.question.sources, "fuentes");
        assertSeparate(layout.question.counters, "contadores");

        // La máquina
        within(layout.machine.chart, "curva");
        layout.machine.findings.forEach((box) => within(box, "hallazgo"));
        assertSeparate([layout.machine.chart, ...layout.machine.findings], "máquina");

        // La persona
        layout.person.rows.forEach((row) => {
          within(row.proposal, "propuesta");
          within(row.decision, "decisión");
          assert.ok(!overlaps(row.proposal, row.decision), "la propuesta pisa la decisión");
          assert.ok(row.node.x > row.proposal.x + row.proposal.w && row.node.x < row.decision.x, "la compuerta no queda entre las dos columnas");
        });
        assertSeparate(layout.person.rows.map((row) => row.proposal), "propuestas");
        assertSeparate(layout.person.rows.map((row) => row.decision), "decisiones");

        // Toda la cuenta
        layout.account.nodes.forEach((node) => within(node, "frente"));
        assertSeparate(layout.account.nodes, "frentes");
        layout.account.nodes.forEach((node) => {
          const core = layout.account.core;
          const box = { x: layout.account.center.x - core / 2, y: layout.account.center.y - core / 2, w: core, h: core };
          assert.ok(!overlaps(node, box), "un frente pisa a la persona del centro");
        });
      });
    }
  }
});

test("los textos entran en sus cajas", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const layout = campanasLayout(format, language);
      const { sizes, person, machine } = layout;
      for (const headline of [layout.before.headline, layout.question.headline, layout.machine.headline, layout.person.headline, layout.account.headline]) {
        assert.ok(headline.box.h <= headline.size * 1.06 * sizes.maxLines + 1, `${format}/${language}: un titular pide más líneas que las permitidas`);
      }
      const padding = 44;
      CAMPANAS_FILM.person.decisions.forEach((decision, index) => {
        const row = person.rows[index];
        assert.ok(fitsLines(decision.proposal[language], sizes.body, row.proposal.w - padding, 3), `${format}/${language}: «${decision.proposal[language]}» no entra`);
        assert.ok(fitsLines(decision.reason[language], sizes.body, row.decision.w - padding, 3), `${format}/${language}: «${decision.reason[language]}» no entra`);
      });
      CAMPANAS_FILM.machine.findings.forEach((finding, index) => {
        const width = machine.findings[index].w - padding - sizes.mono * 9;
        assert.ok(fitsLines(finding.title[language], sizes.title, width, 2), `${format}/${language}: «${finding.title[language]}» no entra`);
      });
    }
  }
});

test("el guion suma su duración, rotula sus datos y no muestra porcentajes", () => {
  let expected = 0;
  for (const chapter of CAMPANAS_CHAPTERS) {
    assert.equal(chapter.from, expected, `${chapter.id} no es contiguo`);
    assert.ok(chapter.caption.es && chapter.caption.en, `${chapter.id}: falta el subtítulo`);
    expected += chapter.durationInFrames;
  }
  assert.equal(expected, CAMPANAS_DURATION);

  assert.match(CAMPANAS_FILM.badge.es, /ejemplo/i);
  assert.match(CAMPANAS_FILM.badge.en, /sample/i);
  const copy = JSON.stringify({ CAMPANAS_FILM, CAMPANAS_CHAPTERS });
  assert.doesNotMatch(copy, /%/);
});

test("la persona tiene la última palabra: la máquina no acierta siempre", () => {
  const { decisions } = CAMPANAS_FILM.person;
  assert.ok(decisions.some((decision) => decision.approved), "alguna propuesta se aprueba");
  assert.ok(decisions.some((decision) => !decision.approved), "alguna propuesta se frena");
});
