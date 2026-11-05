import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CAMPANAS_JOBS, CAMPANAS_PAGE, CAMPANAS_RADAR } from "./campanas";
import { CAMPANAS_FILM } from "./films/campanasFilm";

// Voz de marca: español neutro con tuteo, nunca voseo.
const VOSEO = /\b(quer|ten|pod|sab|hac)és\b|\b(prefer|ven|escrib|viv)ís\b|\b(necesit|mir|cont|escuch)ás\b|\b(decime|contame|escribime|avisame|fijate)\b/i;

describe("campañas con IA", () => {
  it("los textos tienen sus dos idiomas y hablan de tú", () => {
    const texts = JSON.stringify({ CAMPANAS_JOBS, CAMPANAS_PAGE, CAMPANAS_RADAR, CAMPANAS_FILM });
    assert.doesNotMatch(texts, /"es":""|"en":""/);
    assert.doesNotMatch(texts, VOSEO);
  });

  it("cada trabajo dice qué hace la máquina y qué decide una persona", () => {
    assert.ok(CAMPANAS_JOBS.length >= 6, "la sección pide varios ejemplos");
    for (const job of CAMPANAS_JOBS) {
      assert.ok(job.machine.es && job.person.es, `${job.id} está incompleto`);
      assert.ok(job.tools.length > 0, `${job.id} no nombra herramientas`);
    }
  });

  it("lo nuevo lleva su fuente, y las de proveedores se rotulan", () => {
    for (const group of CAMPANAS_RADAR) {
      for (const item of group.items) {
        assert.match(item.source.href, /^https:\/\//, `${item.name} no tiene fuente`);
        assert.ok(item.source.label, `${item.name} no dice de dónde viene`);
      }
    }
    const independent = CAMPANAS_RADAR.find((group) => group.platform === "Independientes");
    assert.ok(independent?.items.every((item) => /proveedor/.test(item.source.label)), "una comparativa de proveedor debe decirlo");
  });

  it("no publica cifras de mejora ni promesas de resultado", () => {
    const texts = JSON.stringify({ CAMPANAS_JOBS, CAMPANAS_PAGE, CAMPANAS_RADAR }).replaceAll(/https?:[^"]+/g, "");
    assert.doesNotMatch(texts, /%|ROI|ROAS|garantiz|guarantee|duplic|triplic/i);
  });
});
