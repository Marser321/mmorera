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

  it("no hay curvas a medida escritas como clase", () => {
    const easing = found.filter((use) => use.name === "ease");
    assert.deepEqual(easing.map((use) => `${use.file}: ${use.text}`), [], "usar [transition-timing-function:…]");
  });
});
