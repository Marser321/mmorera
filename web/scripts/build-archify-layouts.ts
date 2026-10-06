#!/usr/bin/env node
/**
 * Congela la geometría que calcula Archify (rutas ortogonales sin cruces y
 * placas de etiqueta con holgura) para cada diagrama de arquitectura, en sus
 * cuatro variantes: apaisado y vertical, en español e inglés.
 *
 *   <nombre>.json            → <nombre>.layout.json
 *   <nombre>.portrait.json   → <nombre>.portrait.layout.json
 *   <nombre>.json + .en.json → <nombre>.en.layout.json
 *   <nombre>.portrait.json + .en.json → <nombre>.portrait.en.layout.json
 *
 * Cada variante pasa primero la validación "showcase" de Archify; si una falla,
 * no se congela nada. Los films y el diagrama interactivo dibujan exactamente
 * esas rutas, así nada se pisa en ningún idioma ni formato.
 *
 * Archify no vive en el repo (se instala con `npx skills add tt-a1i/archify`).
 * Uso, desde web/:
 *   npx tsx scripts/build-archify-layouts.ts
 *   ARCHIFY_BIN=/ruta/a/archify/bin/archify.mjs npx tsx scripts/build-archify-layouts.ts
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { localizeDiagram, type ArchifyArchitecture, type ArchifyTranslation } from "../src/data/architecture/archify";

const root = process.cwd();
const dir = path.join(root, "src/data/architecture");
const bin = process.env.ARCHIFY_BIN ?? path.join(root, "../.claude/skills/archify/bin/archify.mjs");
if (!existsSync(bin)) {
  console.error(`No encuentro Archify en ${bin}. Instalalo con: npx skills add tt-a1i/archify`);
  process.exit(1);
}
const tmp = mkdtempSync(path.join(os.tmpdir(), "archify-"));
const round = (value: number) => Math.round(value * 100) / 100;
const read = <T>(file: string) => JSON.parse(readFileSync(path.join(dir, file), "utf8")) as T;

interface Variant {
  label: string;
  file: string;
  diagram: ArchifyArchitecture;
  out: string;
}

function variantsOf(base: string): Variant[] {
  const name = base.replace(/\.json$/, "");
  const translation = existsSync(path.join(dir, `${name}.en.json`)) ? read<ArchifyTranslation>(`${name}.en.json`) : null;
  const variants: Variant[] = [];
  for (const orientation of ["", ".portrait"]) {
    const file = `${name}${orientation}.json`;
    if (!existsSync(path.join(dir, file))) continue;
    const diagram = read<ArchifyArchitecture>(file);
    variants.push({ label: `${file} (es)`, file, diagram, out: `${name}${orientation}.layout.json` });
    if (translation) variants.push({ label: `${file} (en)`, file, diagram: localizeDiagram(diagram, translation), out: `${name}${orientation}.en.layout.json` });
  }
  return variants;
}

function archify(args: string[]) {
  return execFileSync("node", [bin, ...args], { encoding: "utf8" });
}

const bases = readdirSync(dir).filter((file) => /^[^.]+\.json$/.test(file) && read<{ diagram_type: string }>(file).diagram_type === "architecture");
for (const base of bases) {
  for (const variant of variantsOf(base)) {
    const candidate = path.join(tmp, variant.out.replace(".layout.json", ".candidate.json"));
    writeFileSync(candidate, JSON.stringify(variant.diagram, null, 2));
    const report = JSON.parse(archify(["validate", "architecture", candidate, "--quality", "showcase", "--json"]));
    const failed = report.checks.filter((check: { ok: boolean }) => !check.ok).map((check: { name: string }) => check.name);
    if (!report.ok || report.composition?.status !== "pass" || failed.length) {
      console.error(`✗ ${variant.label}: Archify no lo aprueba (${failed.join(", ") || report.composition?.status})`);
      console.error(JSON.stringify(report.composition?.findings ?? report.checks.filter((check: { ok: boolean }) => !check.ok), null, 2).slice(0, 4000));
      process.exit(1);
    }
    const layout = JSON.parse(archify(["validate", "architecture", candidate, "--layout-json", "--quality", "showcase"]));
    const frozen = {
      source: variant.label,
      generatedBy: "archify validate architecture --layout-json --quality showcase",
      viewBox: layout.viewBox,
      components: layout.components.map((component: { id: string; x: number; y: number; width: number; height: number }) => ({ id: component.id, x: component.x, y: component.y, w: component.width, h: component.height })),
      boundaries: layout.boundaries.map((boundary: { label: string; kind: string; x: number; y: number; width: number; height: number }) => ({ label: boundary.label, kind: boundary.kind, x: boundary.x, y: boundary.y, w: boundary.width, h: boundary.height })),
      connections: layout.connections.map((connection: { from: string; to: string; label?: string; labelAt?: [number, number]; points: Array<[number, number]> }) => {
        // La placa de la etiqueta es la que Archify ubicó para esta ruta.
        const plate = connection.labelAt
          ? layout.labels.find((label: { text: string; labelAt?: [number, number] }) => label.labelAt?.[0] === connection.labelAt![0] && label.labelAt?.[1] === connection.labelAt![1] && label.text === connection.label)
          : undefined;
        return {
          from: connection.from,
          to: connection.to,
          points: connection.points.map(([x, y]) => [round(x), round(y)]),
          ...(plate ? { label: { text: plate.text, x: plate.x, y: plate.y, w: plate.width, h: plate.height } } : {}),
        };
      }),
    };
    writeFileSync(path.join(dir, variant.out), `${JSON.stringify(frozen, null, 2)}\n`);
    console.log(`✓ ${variant.label} → ${variant.out}`);
  }
}
