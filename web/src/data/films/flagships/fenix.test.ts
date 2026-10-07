import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { FENIX_ASSETS, FENIX_CHAPTERS, FENIX_COPY, FENIX_DURATION, FENIX_FACTS, FENIX_SCENES, FENIX_TIMELINE, fx } from "./fenix";
import { PROJECT_CASES } from "../../projectCases";
import { formatFact } from "./types";
import { mediaSize } from "../../../lib/mediaSize";

const dossier = readFileSync(path.join(process.cwd(), "docs/films/dossiers/fenix.md"), "utf8");

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

/** Lo que el film de Fénix nunca puede decir (reglas de Mario + dossier). */
const FORBIDDEN = [
  /\d+\s?%/, // porcentajes
  /\+\s?\d/, // "+N" de mejora
  /\$\s?\d/, // precios
  /testimoni/i,
  /pacientes? (reales|dicen|como)/i,
  /patients? (say|like)/i,
  /FENIX OS/i, // ni siquiera nombrado en el film
  /\bcosto|\bcost\b|nómina|payroll|contrato|contract|pitch/i,
  /cura|cures?\b|garantiz|guarante/i, // claims médicos prohibidos
  /optimiz|óptimo|optimal/i, // reemplazado por "Normal es un rango" (por ética)
];

function archTexts(filename: string): string[] {
  const content = JSON.parse(readFileSync(path.join(process.cwd(), "src/data/architecture", filename), "utf8"));
  const out: string[] = [];
  if (content.meta?.title) out.push(content.meta.title);
  if (content.title) out.push(content.title);
  if (Array.isArray(content.meta?.views)) {
    for (const v of content.meta.views) {
      if (v.label) out.push(v.label);
      if (v.note) out.push(v.note);
    }
  }
  if (content.views && typeof content.views === "object") {
    for (const v of Object.values(content.views) as Array<{ label?: string; note?: string }>) {
      if (v.label) out.push(v.label);
      if (v.note) out.push(v.note);
    }
  }
  if (Array.isArray(content.components)) {
    for (const c of content.components) {
      if (c.label) out.push(c.label);
      if (c.sublabel) out.push(c.sublabel);
      if (c.tag) out.push(c.tag);
    }
  }
  if (content.components && !Array.isArray(content.components) && typeof content.components === "object") {
    for (const c of Object.values(content.components) as Array<{ label?: string; sublabel?: string }>) {
      if (c.label) out.push(c.label);
      if (c.sublabel) out.push(c.sublabel);
    }
  }
  if (Array.isArray(content.boundaries)) {
    for (const b of content.boundaries) if (b.label) out.push(b.label);
  }
  if (content.boundaries && !Array.isArray(content.boundaries) && typeof content.boundaries === "object") {
    for (const label of Object.values(content.boundaries) as string[]) out.push(label);
  }
  if (Array.isArray(content.connections)) {
    for (const c of content.connections) if (c.label) out.push(c.label);
  }
  if (content.connections && !Array.isArray(content.connections) && typeof content.connections === "object") {
    for (const label of Object.values(content.connections) as string[]) out.push(label);
  }
  if (Array.isArray(content.cards)) {
    for (const card of content.cards) {
      if (card.title) out.push(card.title);
      if (Array.isArray(card.items)) out.push(...card.items);
    }
  }
  return out;
}

const fenixArchTexts = [
  ...archTexts("fenix-system-architecture.json"),
  ...archTexts("fenix-system-architecture.portrait.json"),
  ...archTexts("fenix-system-architecture.en.json"),
];

test("film insignia de Fénix", async (t) => {
  await t.test("capítulos contiguos que cubren todo el film", () => {
    let expected = 0;
    for (const chapter of FENIX_CHAPTERS) {
      assert.equal(chapter.from, expected, `${chapter.label.es} no es contiguo`);
      expected += chapter.durationInFrames;
    }
    assert.equal(expected, FENIX_DURATION);
    const last = FENIX_SCENES[FENIX_SCENES.length - 1];
    assert.equal(FENIX_TIMELINE[last.id].from + FENIX_TIMELINE[last.id].duration, FENIX_DURATION);
  });

  await t.test("cada cifra existe en el dossier del cliente", () => {
    const dossierNumbers = dossier.replace(/\./g, "").replace(/,/g, ".");
    for (const [key, fact] of Object.entries(FENIX_FACTS)) {
      const asText = fact.value.toString();
      const pattern = new RegExp(`\\b${asText.replace('.', '\\.')}\\b`);
      assert.ok(pattern.test(dossierNumbers), `${key}=${asText} no aparece en el dossier`);
      assert.ok(fact.source.startsWith("Dossier") || fact.source.startsWith("Capturas"), `${key}: fuente sin documentar`);
    }
  });

  await t.test("formato de cifras por idioma", () => {
    assert.equal(fx("videos", "es"), "1.096");
    assert.equal(fx("videos", "en"), "1,096");
    assert.equal(fx("wordsM", "es"), "4,33");
    assert.equal(fx("wordsM", "en"), "4.33");
    assert.equal(formatFact({ value: 8034 }, "es"), "8.034");
  });

  await t.test("sin números sueltos: toda cifra de la copia es un hecho verificado", () => {
    const allowed = new Set<string>();
    for (const language of ["es", "en"] as const) for (const key of Object.keys(FENIX_FACTS) as Array<keyof typeof FENIX_FACTS>) allowed.add(fx(key, language));
    // Números que no son métricas: pasos del asistente, el hook de 0–4 s, "510(k)", "GLP-1", "16" de Next.js y "1/2/3" de los pasos.
    for (const extra of ["0", "1", "2", "3", "4", "510", "16", "20", "40", "60", "058", "189", "2026", "10"]) allowed.add(extra);
    for (const language of ["es", "en"] as const) {
      const project = PROJECT_CASES.find((item) => item.slug === "fenix-medical-center");
      const projectTexts = strings(project).filter((text) => !text.startsWith("/") && !text.startsWith("http") && !text.startsWith("#"));
      for (const text of [...strings(FENIX_COPY[language]), ...FENIX_CHAPTERS.flatMap((chapter) => [chapter.caption[language], chapter.label[language]]), ...projectTexts, ...fenixArchTexts]) {
        for (const number of text.match(/\d[\d.,]*/g) ?? []) {
          const clean = number.replace(/[.,]$/, "");
          assert.ok(allowed.has(clean), `"${clean}" en "${text}" no es un hecho de FENIX_FACTS`);
        }
      }
    }
  });

  await t.test("nada de testimonios, pacientes, FENIX OS, costos, precios ni claims prohibidos", () => {
    const project = PROJECT_CASES.find((item) => item.slug === "fenix-medical-center");
    assert.ok(project, "Fénix no está en PROJECT_CASES");
    for (const text of [...strings(FENIX_COPY), ...strings(FENIX_CHAPTERS), ...strings(project), ...fenixArchTexts]) {
      for (const pattern of FORBIDDEN) assert.ok(!pattern.test(text), `"${text}" coincide con ${pattern}`);
    }
  });

  await t.test("la fábrica de contenido se presenta como búsqueda por palabras clave, no vectorial", () => {
    for (const language of ["es", "en"] as const) {
      const copy = FENIX_COPY[language];
      assert.match(copy.brainMethod, /BM25/);
      assert.match(copy.brainMethod, language === "es" ? /no vectorial/ : /not vector/);
      for (const text of strings(copy)) {
        if (/vector/i.test(text)) assert.ok(/no vectorial|not vector/i.test(text), `"${text}" sugiere búsqueda vectorial`);
      }
    }
  });

  await t.test("los assets declarados miden lo que dicen (la cámara nunca los amplía)", () => {
    for (const asset of Object.values(FENIX_ASSETS)) {
      const size = mediaSize(readFileSync(path.join(process.cwd(), "public", asset.src)), asset.src);
      assert.equal(size.width, asset.w, `${asset.src}: ancho`);
      assert.equal(size.height, asset.h, `${asset.src}: alto`);
      if ("seconds" in asset) assert.ok(Math.abs((size.seconds ?? 0) - asset.seconds) < 0.2, `${asset.src}: duración ${size.seconds}`);
      if ("webm" in asset) assert.ok(readFileSync(path.join(process.cwd(), "public", asset.webm)).length > 0, `${asset.webm} no existe`);
    }
  });
});
