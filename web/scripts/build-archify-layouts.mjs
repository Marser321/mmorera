#!/usr/bin/env node
/**
 * Congela la geometría que calcula Archify (rutas ortogonales sin cruces y
 * placas de etiqueta con holgura) junto a cada diagrama de arquitectura:
 * `<nombre>.json` → `<nombre>.layout.json`. Los films y el diagrama
 * interactivo dibujan exactamente esas rutas, así nada se pisa.
 *
 * Archify no vive en el repo (se instala con `npx skills add tt-a1i/archify`).
 * Uso, desde web/:
 *   node scripts/build-archify-layouts.mjs
 *   ARCHIFY_BIN=/ruta/a/archify/bin/archify.mjs node scripts/build-archify-layouts.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "src/data/architecture");
const bin = process.env.ARCHIFY_BIN ?? path.join(root, "../.claude/skills/archify/bin/archify.mjs");
if (!existsSync(bin)) {
  console.error(`No encuentro Archify en ${bin}. Instalalo con: npx skills add tt-a1i/archify`);
  process.exit(1);
}

const round = (value) => Math.round(value * 100) / 100;

for (const file of readdirSync(dir).filter((name) => name.endsWith(".json") && !name.endsWith(".layout.json"))) {
  const source = path.join(dir, file);
  const diagram = JSON.parse(readFileSync(source, "utf8"));
  if (diagram.diagram_type !== "architecture") continue;

  // Primero la validación completa (calidad "showcase"); si falla, no se congela nada.
  const report = JSON.parse(execFileSync("node", [bin, "validate", "architecture", source, "--quality", "showcase", "--json"], { encoding: "utf8" }));
  const failed = report.checks.filter((check) => !check.ok).map((check) => check.name);
  if (!report.ok || report.composition?.status !== "pass" || failed.length) {
    console.error(`✗ ${file}: Archify no lo aprueba (${failed.join(", ") || report.composition?.status})`);
    process.exit(1);
  }

  const layout = JSON.parse(execFileSync("node", [bin, "validate", "architecture", source, "--layout-json", "--quality", "showcase"], { encoding: "utf8" }));
  const frozen = {
    source: file,
    generatedBy: "archify validate architecture --layout-json --quality showcase",
    viewBox: layout.viewBox,
    components: layout.components.map((component) => ({ id: component.id, x: component.x, y: component.y, w: component.width, h: component.height })),
    boundaries: layout.boundaries.map((boundary) => ({ label: boundary.label, kind: boundary.kind, x: boundary.x, y: boundary.y, w: boundary.width, h: boundary.height })),
    connections: layout.connections.map((connection) => {
      // La placa de la etiqueta es la que Archify ubicó para esta ruta.
      const plate = connection.labelAt
        ? layout.labels.find((label) => label.labelAt?.[0] === connection.labelAt[0] && label.labelAt?.[1] === connection.labelAt[1] && label.text === connection.label)
        : undefined;
      return {
        from: connection.from,
        to: connection.to,
        points: connection.points.map(([x, y]) => [round(x), round(y)]),
        ...(plate ? { label: { text: plate.text, x: plate.x, y: plate.y, w: plate.width, h: plate.height } } : {}),
      };
    }),
  };
  const target = path.join(dir, file.replace(/\.json$/, ".layout.json"));
  writeFileSync(target, `${JSON.stringify(frozen, null, 2)}\n`);
  console.log(`✓ ${file} → ${path.relative(root, target)}`);
}
