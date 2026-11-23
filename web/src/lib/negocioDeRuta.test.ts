import { test } from "node:test";
import assert from "node:assert/strict";
import { negocioDeRuta } from "./negocioDeRuta";

test("arma el nombre visible desde el slug", () => {
  assert.deepEqual(negocioDeRuta("city-fitness"), { slug: "city-fitness", nombre: "City Fitness" });
  assert.equal(negocioDeRuta("laboratorio-de-pilates")?.nombre, "Laboratorio de Pilates");
  assert.equal(negocioDeRuta("pilates-1880")?.nombre, "Pilates 1880");
});

test("rechaza lo que no es un slug corto", () => {
  assert.equal(negocioDeRuta("Hola Mundo!"), null);
  assert.equal(negocioDeRuta("a".repeat(40)), null);
  assert.equal(negocioDeRuta(""), null);
});
