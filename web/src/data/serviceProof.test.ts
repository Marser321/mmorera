import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SERVICE_SOLUTIONS } from "./solutionsData";
import { getProjectCase } from "./projectCases";
import { SERVICE_GLYPHS } from "./serviceGlyphs";
import { particleScatter } from "../lib/particleScatter";

describe("servicios con prueba real", () => {
  it("cada servicio demuestra su promesa con un caso existente y en vivo", () => {
    for (const service of SERVICE_SOLUTIONS) {
      const project = getProjectCase(service.proofSlug);
      assert.ok(project, `${service.id} apunta a un caso inexistente: ${service.proofSlug}`);
      assert.ok(project.liveUrl, `${service.id} necesita un caso con liveUrl`);
    }
  });

  it("cada servicio tiene un glifo que las partículas pueden dibujar", () => {
    for (const service of SERVICE_SOLUTIONS) {
      const glyph = SERVICE_GLYPHS[service.id];
      assert.ok(glyph?.Icon, `falta el glifo de ${service.id}`);
      assert.ok(glyph.name.startsWith("service:"));
    }
  });
});

describe("store de dispersión de partículas", () => {
  it("acota el valor a [0, 1] y avisa solo cuando cambia", () => {
    const seen: number[] = [];
    const unsubscribe = particleScatter.subscribe((value) => seen.push(value));
    particleScatter.set(2);
    particleScatter.set(1);
    particleScatter.set(-1);
    unsubscribe();
    particleScatter.set(0.5);
    assert.deepEqual(seen, [1, 0]);
    assert.equal(particleScatter.get(), 0.5);
    particleScatter.set(0);
  });
});
