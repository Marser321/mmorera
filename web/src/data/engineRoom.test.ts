import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasArchitecture } from "./architecture/registry";
import { ENGINE_AGENTS, ENGINE_ARCHITECTURES, ENGINE_COPY, ENGINE_FAILS, ENGINE_RUNS, ENGINE_STACK, ENGINE_TEAM, engineHref } from "./engineRoom";
import { SERVICE_PAGES } from "./servicePages";

const allText = JSON.stringify({ ENGINE_COPY, ENGINE_TEAM, ENGINE_AGENTS, ENGINE_FAILS, ENGINE_RUNS });

describe("«Cómo lo construyo» en /sistemas", () => {
  it("el ancla vive en /sistemas, en los dos idiomas", () => {
    assert.equal(engineHref("es"), "/sistemas#como-lo-construyo");
    assert.equal(engineHref("en"), "/en/sistemas#como-lo-construyo");
  });

  it("cada arquitectura enlazada existe, y AD Media no se usa como prueba", () => {
    assert.ok(ENGINE_ARCHITECTURES.length >= 3);
    for (const item of ENGINE_ARCHITECTURES) assert.ok(hasArchitecture(item.slug), `${item.slug} no tiene diagrama`);
    assert.doesNotMatch(allText + JSON.stringify(ENGINE_ARCHITECTURES), /AD\s*Media/i);
  });

  it("sin cifras sin fuente ni nombres que faltan confirmar", () => {
    // El 20 % y el 80 % de la auditoría cruzada no tienen fuente todavía (plan, pregunta 16).
    assert.doesNotMatch(allText, /%/);
    // «Sol» y «Astra» llegaron por dictado y falta confirmarlos (pregunta 15).
    assert.doesNotMatch(allText, /\b(Sol|Astra)\b/);
  });

  it("para agentes solo se nombra el Vercel AI SDK", () => {
    assert.doesNotMatch(allText, /LangChain|LangGraph|CrewAI|Mastra/i);
    assert.match(allText, /Vercel AI SDK/);
  });

  it("todo está en los dos idiomas", () => {
    for (const item of [...ENGINE_AGENTS, ...ENGINE_FAILS, ...ENGINE_RUNS, ...ENGINE_TEAM.flatMap((row) => [row.part, row.why])]) {
      assert.ok(item.es.trim() && item.en.trim(), `falta un idioma: ${item.es || item.en}`);
    }
    assert.ok(ENGINE_STACK.length >= 6 && ENGINE_STACK.every((row) => row.tools.length > 0));
  });

  it("la parte de servicio de /sistemas ya no lista herramientas: van abajo", () => {
    assert.ok(!("tools" in SERVICE_PAGES.sistemas));
    assert.ok(!SERVICE_PAGES.sistemas.proof?.slugs.includes("ad-media-solution"));
  });
});
