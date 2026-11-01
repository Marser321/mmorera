#!/usr/bin/env node
/**
 * Valida piezas de redes (contenido/piezas/<id>/): esquema, que los textos
 * entren en su zona segura, honestidad, duraciones por plataforma, copy por
 * plataforma, imágenes y, si la pieza está "lista", sus renders.
 *
 * Uso, desde web/:
 *   npx tsx scripts/check-pieza.ts 2026-10-12-agente-sin-tests
 *   npx tsx scripts/check-pieza.ts --todas
 *
 * Sale con código 1 si hay errores. Los avisos (imágenes pendientes,
 * opiniones a revisar) no bloquean.
 */
import { listarPiezas, revisarPieza } from "./lib/piezas";

const ids = process.argv.includes("--todas") ? listarPiezas() : process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (!ids.length) {
  console.error("Uso: npx tsx scripts/check-pieza.ts <id…> | --todas");
  process.exit(1);
}

let errores = 0;
for (const id of ids) {
  const { pieza, problemas } = revisarPieza(id);
  const errs = problemas.filter((p) => p.nivel === "error");
  const avisos = problemas.filter((p) => p.nivel === "aviso");
  errores += errs.length;
  console.log(`${errs.length ? "✖" : "✔"} ${id}${pieza ? ` · ${pieza.estado}` : ""}${avisos.length ? ` · ${avisos.length} aviso(s)` : ""}`);
  for (const p of errs) console.log(`    error  ${p.donde}: ${p.mensaje}`);
  for (const p of avisos) console.log(`    aviso  ${p.donde}: ${p.mensaje}`);
}
process.exit(errores ? 1 : 0);
