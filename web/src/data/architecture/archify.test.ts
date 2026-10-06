import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PROJECT_CASES } from "../projectCases";
import { CASE_BRANDS } from "../brands/caseBrands";
import { edgeKey, localizeDiagram, type ArchifyArchitecture, type ArchifyLayout, type ArchifyTranslation, type Box } from "./archify";
import { ARCHITECTURE_LOADERS } from "./registry";

const dir = path.join(process.cwd(), "src/data/architecture");
const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(dir, file), "utf8")) as T;
const bases = readdirSync(dir).filter((file) => /^[^.]+\.json$/.test(file) && read<{ diagram_type: string }>(file).diagram_type === "architecture");

const overlaps = (a: Box, b: Box, gap = 0) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
const inside = (a: Box, b: Box) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;

/** ¿El segmento ortogonal atraviesa la caja? (las placas pueden interrumpir solo su propia ruta) */
function segmentCrosses(a: [number, number], b: [number, number], box: Box) {
  const [minX, maxX] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])];
  const [minY, maxY] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
  return minX < box.x + box.w && maxX > box.x && minY < box.y + box.h && maxY > box.y;
}

interface Variant {
  label: string;
  diagram: ArchifyArchitecture;
  layout: ArchifyLayout;
}

function variantsOf(base: string): Variant[] {
  const name = base.replace(/\.json$/, "");
  const translation = existsSync(path.join(dir, `${name}.en.json`)) ? read<ArchifyTranslation>(`${name}.en.json`) : null;
  const variants: Variant[] = [];
  for (const orientation of ["", ".portrait"]) {
    const file = `${name}${orientation}.json`;
    if (!existsSync(path.join(dir, file))) continue;
    const diagram = read<ArchifyArchitecture>(file);
    variants.push({ label: `${file} (es)`, diagram, layout: read<ArchifyLayout>(`${name}${orientation}.layout.json`) });
    if (translation) variants.push({ label: `${file} (en)`, diagram: localizeDiagram(diagram, translation), layout: read<ArchifyLayout>(`${name}${orientation}.en.layout.json`) });
  }
  return variants;
}

test("diagramas de Archify y su geometría congelada", async (t) => {
  for (const base of bases) {
    for (const { label, diagram, layout } of variantsOf(base)) {
      await t.test(`${label}: la geometría corresponde a esta versión del diagrama`, () => {
        assert.equal(layout.source, label, "correr npx tsx scripts/build-archify-layouts.ts");
        assert.deepEqual(
          layout.components.map((box) => [box.id, box.x, box.y, box.w, box.h]),
          diagram.components.map((component) => [component.id, ...component.pos, ...component.size]),
          `${label}: layout viejo, correr npx tsx scripts/build-archify-layouts.ts`,
        );
        assert.deepEqual(
          layout.connections.map((connection) => [connection.from, connection.to, connection.label?.text ?? null]),
          diagram.connections.map((connection) => [connection.from, connection.to, connection.label ?? null]),
        );
        assert.deepEqual(layout.boundaries.map((boundary) => boundary.label), (diagram.boundaries ?? []).map((boundary) => boundary.label));
      });

      await t.test(`${label}: nada se pisa (cajas, grupos, etiquetas y rutas)`, () => {
        for (const a of layout.boundaries) {
          for (const b of layout.boundaries) {
            if (a !== b) assert.ok(!overlaps(a, b) || inside(a, b) || inside(b, a), `los grupos "${a.label}" y "${b.label}" se pisan`);
          }
        }
        const plates = layout.connections.flatMap((connection) => (connection.label ? [{ ...connection.label, key: edgeKey(connection.from, connection.to) }] : []));
        for (const plate of plates) {
          for (const box of layout.components) assert.ok(!overlaps(plate, box, 2), `"${plate.text}" toca ${box.id}`);
          for (const other of plates) if (other !== plate) assert.ok(!overlaps(plate, other, 2), `"${plate.text}" toca "${other.text}"`);
          // Una placa queda entera dentro o entera fuera de cada grupo: nunca cruza su borde.
          for (const boundary of layout.boundaries) {
            assert.ok(inside(plate, boundary) || !overlaps(plate, boundary), `"${plate.text}" cruza el borde de "${boundary.label}"`);
          }
          // Ninguna otra ruta pasa por debajo de la placa.
          for (const connection of layout.connections) {
            if (edgeKey(connection.from, connection.to) === plate.key) continue;
            connection.points.slice(1).forEach((point, index) => {
              assert.ok(!segmentCrosses(connection.points[index], point, plate), `la ruta ${connection.from}→${connection.to} pasa bajo "${plate.text}"`);
            });
          }
        }
      });

      await t.test(`${label}: vistas y grupos nombran componentes existentes`, () => {
        const ids = new Set(diagram.components.map((component) => component.id));
        for (const connection of diagram.connections) assert.ok(ids.has(connection.from) && ids.has(connection.to), `${connection.from} → ${connection.to}`);
        for (const view of diagram.meta.views ?? []) for (const id of view.focus) assert.ok(ids.has(id), `vista ${view.id}: ${id} inexistente`);
        for (const boundary of diagram.boundaries ?? []) for (const id of boundary.wraps) assert.ok(ids.has(id), `grupo ${boundary.label}: ${id} inexistente`);
      });
    }

    const name = base.replace(/\.json$/, "");
    if (existsSync(path.join(dir, `${name}.portrait.json`))) {
      await t.test(`${name}: la versión vertical dice exactamente lo mismo que la apaisada`, () => {
        const landscape = read<ArchifyArchitecture>(base);
        const portrait = read<ArchifyArchitecture>(`${name}.portrait.json`);
        const content = (diagram: ArchifyArchitecture) => ({
          title: diagram.meta.title,
          views: diagram.meta.views,
          components: diagram.components.map(({ id, type, label, sublabel, tag }) => ({ id, type, label, sublabel, tag })),
          connections: diagram.connections.map(({ from, to, label, variant }) => ({ from, to, label, variant })),
          boundaries: diagram.boundaries,
        });
        assert.deepEqual(content(portrait), content(landscape));
        const [w, h] = read<ArchifyLayout>(`${name}.portrait.layout.json`).viewBox;
        const [lw, lh] = read<ArchifyLayout>(`${name}.layout.json`).viewBox;
        assert.ok(w / h < lw / lh, "la vertical tiene que ser más alta en proporción que la apaisada");
      });
    }

    if (existsSync(path.join(dir, `${name}.en.json`))) {
      await t.test(`${name}: la traducción cubre todos los textos`, () => {
        const diagram = read<ArchifyArchitecture>(base);
        const translation = read<ArchifyTranslation>(`${name}.en.json`);
        assert.deepEqual(Object.keys(translation.components).sort(), diagram.components.map((component) => component.id).sort());
        assert.deepEqual(Object.keys(translation.views).sort(), (diagram.meta.views ?? []).map((view) => view.id).sort());
        assert.deepEqual(Object.keys(translation.boundaries).sort(), (diagram.boundaries ?? []).map((boundary) => boundary.label).sort());
        assert.deepEqual(
          Object.keys(translation.connections).sort(),
          diagram.connections.filter((connection) => connection.label).map((connection) => edgeKey(connection.from, connection.to)).sort(),
        );
        for (const component of diagram.components) {
          assert.equal(Boolean(translation.components[component.id].sublabel), Boolean(component.sublabel), `${component.id}: sublabel sin traducir`);
        }
      });
    }
  }
});

test("registro de arquitecturas por caso", async (t) => {
  for (const [slug, load] of Object.entries(ARCHITECTURE_LOADERS)) {
    await t.test(`${slug}: caso y marca existen, y el bundle trae sus cuatro variantes`, async () => {
      assert.ok(PROJECT_CASES.some((project) => project.slug === slug), `${slug} no está en PROJECT_CASES`);
      assert.ok(CASE_BRANDS[slug], `${slug} no tiene marca`);
      const bundle = await load();
      assert.equal(bundle.slug, slug);
      for (const orientation of ["landscape", "portrait"] as const) {
        for (const language of ["es", "en"] as const) assert.ok(bundle.layouts[orientation][language].viewBox.length === 2);
      }
    });
  }
});
