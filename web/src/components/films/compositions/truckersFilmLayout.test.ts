import test from "node:test";
import assert from "node:assert/strict";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { TC_COPY, TC_HOST, TC_LINES } from "@/data/films/flagships/truckersChoice";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { TC_CAPTURE_ASPECT, tcBilingualLayout, tcRoofLayout } from "./truckersFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

test("Truckers · dos idiomas: la ventana conserva la proporción y nada se pisa", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `bilingüe ${format}/${language}`;
      const layout = tcBilingualLayout(format, TC_COPY[language], TC_HOST);
      const safe = safeArea(format);
      assertInside(layout.win, layout.body, name);
      assert.ok(Math.abs(layout.screen.w / layout.screen.h - TC_CAPTURE_ASPECT) < 0.01, `${name}: proporción de la pantalla`);
      // La pantalla nunca muestra la captura más grande que su resolución nativa.
      assert.ok(layout.screen.w <= 1920, `${name}: pantalla más ancha que la captura`);
      assertInside(layout.url.box, layout.bar, `${name}: url`);
      for (const pill of [layout.langEn, layout.langEs]) assertInside(pill.box, layout.screen, `${name}: ${pill.id}`);
      assert.ok(!overlaps(layout.langEn.box, layout.langEs.box), `${name}: las pastillas de idioma se tocan`);
      assertInside(layout.routesBox, layout.side, `${name}: rutas`);
      for (const row of layout.routeRows) {
        assertInside(row.lang.box, layout.routesBox, `${name}: ${row.lang.id}`);
        assertInside(row.path.box, layout.routesBox, `${name}: ${row.path.id}`);
      }
      assertBlocks(layout.blocks, safe, format, name);
      assert.ok(!overlaps(layout.side, layout.win), `${name}: la leyenda pisa la ventana`);
      // Cada parada y cada ruta entra en la caja medida para la más larga.
      for (const stop of Object.values(TC_COPY[language].bilingualStops)) {
        assertBlocks([{ ...layout.stopText, text: stop.text }, { ...layout.kicker, text: stop.kicker }], safe, format, `${name}: ${stop.kicker}`);
      }
    }
  }
});

test("Truckers · un solo techo: cuatro pasos con sus líneas, sin desbordes", () => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      const name = `techo ${format}/${language}`;
      const layout = tcRoofLayout(format, TC_COPY[language], language);
      assert.equal(layout.columns.length, 4);
      assert.deepEqual(layout.columns.flatMap((column) => column.chips.map((chip) => chip.id)), TC_LINES.map((line) => line.id), `${name}: cada línea en su paso`);
      assertInside(layout.roof, layout.body, `${name}: techo`);
      for (const column of layout.columns) {
        assertInside(column.panel, layout.body, `${name}: panel ${column.step}`);
        assert.ok(column.panel.y >= layout.roof.y + layout.roof.h, `${name}: el panel ${column.step} sube al techo`);
        for (const chip of column.chips) {
          assertInside(chip.box, column.panel, `${name}: ${chip.id}`);
          assertInside(chip.badge, chip.box, `${name}: insignia ${chip.id}`);
          assert.ok(!overlaps(chip.label.box, chip.badge), `${name}: el rótulo de ${chip.id} pisa su cifra`);
        }
        for (const other of layout.columns) if (other !== column) assert.ok(!overlaps(column.panel, other.panel), `${name}: paneles ${column.step}/${other.step}`);
      }
      assertInside(layout.totalBand, layout.body, `${name}: total`);
      assertBlocks(layout.blocks, safeArea(format), format, name);
    }
  }
  // La suma que muestra el total es la del catálogo.
  assert.equal(TC_LINES.reduce((sum, line) => sum + line.filings, 0), 30);
});
