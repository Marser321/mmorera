import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Con tailwindcss-animate, `duration-[…]`, `delay-[…]` y `ease-[…]` con valor
 * arbitrario coinciden con dos utilidades (la de transición y la de animación).
 * Tailwind no elige: no genera la clase y la transición queda con el valor por
 * defecto, sin ningún aviso en el build. Los valores a medida van como
 * propiedad (`[transition-duration:1.2s]`) o en `style`.
 */
const AMBIGUOUS = /(?<![\w-])(duration|delay|ease)-\[[0-9.a-z(][^\]]*\]/g;

/**
 * Tres transiciones publicadas que usan `ease-[…]`: hoy se mueven con la curva
 * por defecto. Cambiarlas altera cómo se mueven el encabezado, las puertas de
 * Servicios y los verbos de la película de autor, así que se deciden aparte.
 */
const PENDING = new Set([
  "components/premium/home/AuthorTrailer.tsx",
  "components/premium/home/ServicesStage.tsx",
  "components/sections/navbar.tsx",
]);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx|ts|css)$/.test(entry.name) && !entry.name.endsWith(".test.ts") ? [full] : [];
  });
}

describe("clases de Tailwind que no se generan", () => {
  const root = path.join(process.cwd(), "src");
  const found = sourceFiles(root).flatMap((file) => {
    const relative = path.relative(root, file).split(path.sep).join("/");
    return [...readFileSync(file, "utf8").matchAll(AMBIGUOUS)].map((match) => ({ file: relative, name: match[1], text: match[0] }));
  });

  it("no hay duraciones ni demoras a medida escritas como clase", () => {
    const timing = found.filter((use) => use.name !== "ease");
    assert.deepEqual(timing.map((use) => `${use.file}: ${use.text}`), [], "usar [transition-duration:…] o [transition-delay:…]");
  });

  it("las curvas a medida escritas como clase son solo las tres pendientes", () => {
    const easing = found.filter((use) => use.name === "ease" && !PENDING.has(use.file));
    assert.deepEqual(easing.map((use) => `${use.file}: ${use.text}`), [], "usar [transition-timing-function:…]");
    const stillThere = new Set(found.filter((use) => use.name === "ease").map((use) => use.file));
    assert.deepEqual([...PENDING].filter((file) => !stillThere.has(file)), [], "ya se arregló: sacarlo de la lista de pendientes");
  });
});
