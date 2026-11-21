import { test } from "node:test";
import assert from "node:assert/strict";
import { limpiarOrigen, validarVisita } from "./origen";

test("limpiarOrigen acepta slugs cortos y los normaliza", () => {
  assert.equal(limpiarOrigen(" Indigo "), "indigo");
  assert.equal(limpiarOrigen("campana-ig-2"), "campana-ig-2");
});

test("limpiarOrigen descarta texto libre, vacíos y largos", () => {
  assert.equal(limpiarOrigen(""), null);
  assert.equal(limpiarOrigen("<script>"), null);
  assert.equal(limpiarOrigen("con espacios"), null);
  assert.equal(limpiarOrigen("-empieza-con-guion"), null);
  assert.equal(limpiarOrigen("a".repeat(33)), null);
  assert.equal(limpiarOrigen(42), null);
});

test("validarVisita solo deja pasar páginas de /demos y eventos conocidos", () => {
  assert.deepEqual(validarVisita({ pagina: "/demos/gimnasios", evento: "escena", de: "Indigo", detalle: "panel" }), {
    pagina: "/demos/gimnasios",
    evento: "escena",
    de: "indigo",
    detalle: "panel",
  });
  assert.deepEqual(validarVisita({ pagina: "/demos", evento: "vista", de: "mal valor" }), {
    pagina: "/demos",
    evento: "vista",
    de: null,
    detalle: null,
  });
  assert.equal(validarVisita({ pagina: "/otra", evento: "vista" }), null);
  assert.equal(validarVisita({ pagina: "/demos", evento: "borrar" }), null);
  assert.equal(validarVisita(null), null);
});
