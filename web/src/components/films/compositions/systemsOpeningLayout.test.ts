import test from "node:test";
import assert from "node:assert/strict";
import { OPENING_DURATION } from "@/data/films/systemsFilms";
import { inside, overlaps, safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { openingFrame } from "./systemsOpeningLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const LANGUAGES = ["es", "en"] as const;
const SEEN = 0.02;

type Item = { id: string; kind: "tile" | "text" | "dot" | "line" | "ring"; box: Box; owner: number };

const circle = (x: number, y: number, r: number): Box => ({ x: x - r, y: y - r, w: r * 2, h: r * 2 });

/** Todo lo visible en un cuadro, con su caja. */
function items(frame: number, format: FilmFormatName, language: "es" | "en"): Item[] {
  const state = openingFrame(frame, format, language);
  const { spec } = state;
  const out: Item[] = [];
  state.tools.forEach((tool, index) => {
    const size = spec.tile * tool.scale;
    if (tool.enter > SEEN) out.push({ id: `mosaico ${index}`, kind: "tile", box: circle(tool.center.x, tool.center.y, size / 2), owner: index });
    if (tool.ping.opacity > SEEN) out.push({ id: `ping ${index}`, kind: "ring", box: circle(tool.center.x, tool.center.y, (size * tool.ping.scale) / 2 + 1), owner: index });
    if (tool.badge.opacity > SEEN) out.push({ id: `contador ${index}`, kind: "text", box: tool.badge.box, owner: index });
    for (const [name, item] of [["herramienta", tool.toolLabel], ["estado", tool.title], ["número", tool.number], ["pastilla", tool.chip]] as const)
      if (item.opacity > SEEN) out.push({ id: `${name} ${index}`, kind: "text", box: item.box, owner: index });
  });
  // El resplandor del lead y del paquete cuenta como parte del punto.
  if (state.lead.opacity > SEEN) out.push({ id: "lead", kind: "dot", box: circle(state.lead.point.x, state.lead.point.y, spec.lead.size / 2 + spec.lead.halo + 4), owner: -1 });
  if (state.packet && state.packet.opacity > SEEN)
    out.push({ id: "paquete", kind: "dot", box: circle(state.packet.point.x, state.packet.point.y, spec.packet.size / 2 + spec.packet.halo + 2), owner: -2 });
  if (state.crack.opacity > SEEN && state.crack.draw > SEEN) {
    const h = (spec.crack.bottom - spec.crack.top) * state.crack.draw;
    out.push({ id: "grieta", kind: "line", box: { x: spec.crack.x - 2, y: spec.crack.top, w: 4, h }, owner: -3 });
  }
  if (state.pill.opacity > SEEN) out.push({ id: "acá se pierde", kind: "text", box: state.pill.box, owner: -4 });
  state.cables.forEach((cable, index) => {
    if (cable.draw <= SEEN) return;
    // Tramo visible: del borde de un mosaico al borde del siguiente (por debajo de ambos).
    const vertical = cable.from.x === cable.to.x;
    const box = vertical
      ? { x: cable.from.x - 1, y: cable.from.y + 1, w: 2, h: cable.to.y - cable.from.y - 2 }
      : { x: cable.from.x + 1, y: cable.from.y - 1, w: cable.to.x - cable.from.x - 2, h: 2 };
    out.push({ id: `cable ${index}`, kind: "line", box, owner: -10 - index });
  });
  return out;
}

/** Pares permitidos: el contador va pegado a su mosaico; el lead cae por la grieta; el paquete corre por su cable. */
function allowed(a: Item, b: Item) {
  if (a.owner === b.owner && a.owner >= 0) {
    const kinds = new Set([a.id.split(" ")[0], b.id.split(" ")[0]]);
    if (kinds.has("contador") && (kinds.has("mosaico") || kinds.has("ping"))) return true;
    if (kinds.has("ping") && kinds.has("mosaico")) return true;
  }
  const ids = new Set([a.id, b.id]);
  if (ids.has("lead") && ids.has("grieta")) return true;
  if (ids.has("paquete") && (a.id.startsWith("cable") || b.id.startsWith("cable"))) return true;
  // Un anillo de ping que asoma bajo el contador de otro mosaico no existe: los mosaicos están lejos.
  if (a.kind === "ring" && b.kind === "ring") return true;
  return false;
}

for (const format of FORMATS)
  for (const language of LANGUAGES)
    test(`SystemsOpening ${format} · ${language}: ningún cuadro tiene solapes`, () => {
      const safe = safeArea(format);
      const problems = new Set<string>();
      for (let frame = 0; frame < OPENING_DURATION; frame++) {
        const list = items(frame, format, language);
        for (const item of list) if (item.kind !== "ring" && !inside(item.box, safe)) problems.add(`${item.id} sale de la zona útil (f${frame})`);
        for (let i = 0; i < list.length; i++)
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];
            if (allowed(a, b)) continue;
            // Los anillos solo importan si tocan texto u otro mosaico.
            if ((a.kind === "ring" || b.kind === "ring") && !(a.kind === "text" || b.kind === "text" || a.kind === "tile" || b.kind === "tile" || a.kind === "dot" || b.kind === "dot")) continue;
            if (overlaps(a.box, b.box, a.kind === "text" && b.kind === "text" ? 6 : 0)) problems.add(`${a.id} × ${b.id} (f${frame})`);
          }
      }
      assert.deepEqual([...problems].slice(0, 20), []);
    });

test("SystemsOpening: los rótulos de herramienta y de estado nunca conviven", () => {
  for (const format of FORMATS)
    for (let frame = 0; frame < OPENING_DURATION; frame++) {
      const state = openingFrame(frame, format, "es");
      for (const tool of state.tools) assert.ok(tool.toolLabel.opacity <= SEEN || tool.title.opacity <= SEEN, `f${frame}: fundido cruzado de rótulos`);
    }
});
