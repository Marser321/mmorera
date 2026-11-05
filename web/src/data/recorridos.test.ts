import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { RECORRIDOS_PAGE, RECORRIDOS_PATH } from "./recorridos";

// Voz de marca: español neutro con tuteo, nunca voseo.
const VOSEO = /\b(quer|ten|pod|sab|hac)és\b|\b(prefer|ven|escrib|viv)ís\b|\b(necesit|mir|cont|escuch)ás\b|\b(decime|contame|escribime|avisame|fijate)\b/i;
const { real, generated } = RECORRIDOS_PAGE;

describe("recorridos para inmobiliarias", () => {
  it("los textos tienen sus dos idiomas y hablan de tú", () => {
    const texts = JSON.stringify(RECORRIDOS_PAGE);
    assert.doesNotMatch(texts, /"es":""|"en":""/);
    assert.doesNotMatch(texts, VOSEO);
  });

  it("la muestra propia se rotula como real y su portada existe", () => {
    assert.match(real.label.es, /real/i);
    assert.match(real.tour.src, /^https:\/\/kuula\.co\//);
    assert.ok(existsSync(join(process.cwd(), "public", real.tour.poster.src)), "falta la portada del tour");
  });

  it("lo de terceros dice que no es trabajo de Mario, con su fuente", () => {
    assert.match(generated.label.es, /no es trabajo mío/);
    assert.match(generated.label.en, /not my work/);
    assert.match(generated.note.es, /no es trabajo mío|trabajo mío/);
    assert.ok(generated.references.length > 0);
    for (const reference of generated.references) {
      assert.ok(reference.source.name, `${reference.id} no dice de dónde viene`);
      assert.match(reference.source.href, /^https:\/\//);
      assert.match(reference.embed, /^https:\/\//);
    }
  });

  it("no promete medidas: una imagen generada no reemplaza a un plano", () => {
    assert.match(generated.note.es, /no reemplaza a un plano/);
    assert.match(generated.note.en, /doesn't replace a floor plan/);
    assert.match(generated.note.es, /rotulado como imagen generada/);
  });

  it("la rama vive debajo de los casos de uso", () => {
    assert.ok(RECORRIDOS_PATH.startsWith("/casos-de-uso/"));
  });
});
