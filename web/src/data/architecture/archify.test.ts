import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ArchifyArchitecture, ArchifyLayout, Box } from "./archify";

const dir = path.join(process.cwd(), "src/data/architecture");
const read = <T>(file: string): T => JSON.parse(readFileSync(path.join(dir, file), "utf8")) as T;
const sources = readdirSync(dir).filter((file) => file.endsWith(".json") && !file.endsWith(".layout.json") && read<{ diagram_type: string }>(file).diagram_type === "architecture");

const overlaps = (a: Box, b: Box, gap = 0) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
const inside = (a: Box, b: Box) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;

test("diagramas de Archify y su geometría congelada", async (t) => {
  for (const file of sources) {
    const diagram = read<ArchifyArchitecture>(file);
    const layoutFile = file.replace(/\.json$/, ".layout.json");

    await t.test(`${file}: la geometría corresponde a esta versión del diagrama`, () => {
      const layout = read<ArchifyLayout>(layoutFile);
      assert.equal(layout.source, file);
      assert.deepEqual(
        layout.components.map((box) => [box.id, box.x, box.y, box.w, box.h]),
        diagram.components.map((component) => [component.id, ...component.pos, ...component.size]),
        `${layoutFile} quedó viejo: correr node scripts/build-archify-layouts.mjs`,
      );
      assert.deepEqual(
        layout.connections.map((connection) => [connection.from, connection.to, connection.label?.text ?? null]),
        diagram.connections.map((connection) => [connection.from, connection.to, connection.label ?? null]),
      );
      assert.deepEqual(layout.boundaries.map((boundary) => boundary.label), (diagram.boundaries ?? []).map((boundary) => boundary.label));
    });

    await t.test(`${file}: las etiquetas no se pisan con cajas, grupos ni otras etiquetas`, () => {
      const layout = read<ArchifyLayout>(layoutFile);
      for (const a of layout.boundaries) {
        for (const b of layout.boundaries) {
          if (a !== b) assert.ok(!overlaps(a, b) || inside(a, b) || inside(b, a), `los grupos "${a.label}" y "${b.label}" se pisan`);
        }
      }
      const plates = layout.connections.flatMap((connection) => (connection.label ? [connection.label] : []));
      for (const plate of plates) {
        for (const box of layout.components) assert.ok(!overlaps(plate, box, 2), `"${plate.text}" toca ${box.id}`);
        for (const other of plates) if (other !== plate) assert.ok(!overlaps(plate, other, 2), `"${plate.text}" toca "${other.text}"`);
        // Una placa queda entera dentro o entera fuera de cada grupo: nunca cruza su borde.
        for (const boundary of layout.boundaries) {
          assert.ok(inside(plate, boundary) || !overlaps(plate, boundary), `"${plate.text}" cruza el borde de "${boundary.label}"`);
        }
      }
    });

    await t.test(`${file}: vistas y grupos nombran componentes existentes`, () => {
      const ids = new Set(diagram.components.map((component) => component.id));
      for (const connection of diagram.connections) assert.ok(ids.has(connection.from) && ids.has(connection.to), `${connection.from} → ${connection.to}`);
      for (const view of diagram.meta.views ?? []) for (const id of view.focus) assert.ok(ids.has(id), `vista ${view.id}: ${id} inexistente`);
      for (const boundary of diagram.boundaries ?? []) for (const id of boundary.wraps) assert.ok(ids.has(id), `grupo ${boundary.label}: ${id} inexistente`);
    });
  }
});
