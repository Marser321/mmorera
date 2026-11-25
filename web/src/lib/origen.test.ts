import { test } from "node:test";
import assert from "node:assert/strict";
import { esPaginaDePropuesta, limpiarOrigen, validarVisita } from "./origen";

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

test("validarVisita acepta la página de cada propuesta, con o sin origen", () => {
  assert.deepEqual(validarVisita({ pagina: "/p/nettuno-4384", evento: "vista" }), {
    pagina: "/p/nettuno-4384",
    evento: "vista",
    de: null,
    detalle: null,
  });
  assert.deepEqual(validarVisita({ pagina: "/p/lavadero-sur-1a2b", evento: "contacto", de: "email", detalle: "whatsapp" }), {
    pagina: "/p/lavadero-sur-1a2b",
    evento: "contacto",
    de: "email",
    detalle: "whatsapp",
  });
  assert.equal(validarVisita({ pagina: "/p/", evento: "vista" }), null);
  assert.equal(validarVisita({ pagina: "/p/Con-Mayusculas", evento: "vista" }), null);
  assert.equal(validarVisita({ pagina: "/p/a/b", evento: "vista" }), null);
  assert.equal(validarVisita({ pagina: `/p/${"a".repeat(61)}`, evento: "vista" }), null);
  assert.equal(esPaginaDePropuesta("/p/nettuno-4384"), true);
  assert.equal(esPaginaDePropuesta("/demos/gimnasios"), false);
});
