import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FILM_FPS, type FilmLanguage } from "@/data/films/filmTypes";
import {
  LB_CHAPTERS,
  LB_COPY,
  LB_DURATION,
  LB_FACTS,
  LB_SCENES,
  LB_TIMELINE,
} from "./lbWash";

const DOSSIER_PATH = path.join(process.cwd(), "docs/films/dossiers/lb-wash.md");

test("L&B film: el dossier existe y documenta cada cifra", () => {
  assert.ok(fs.existsSync(DOSSIER_PATH), "Falta el dossier docs/films/dossiers/lb-wash.md");
  const dossier = fs.readFileSync(DOSSIER_PATH, "utf8");

  for (const [key, fact] of Object.entries(LB_FACTS)) {
    assert.ok(
      fact.source.length > 0,
      `La cifra ${key} no declara su fuente en el dossier`,
    );
    const num = fact.value;
    const wholeWordRegex = new RegExp(`\\b${num}\\b`);
    assert.ok(
      wholeWordRegex.test(dossier),
      `La cifra ${key} (${num}) no aparece en el dossier`,
    );
  }
});

test("L&B film: estructura, capítulos y timeline", () => {
  const total = LB_SCENES.reduce((sum, s) => sum + Math.round(s.seconds * FILM_FPS), 0);
  assert.equal(total, LB_DURATION, "La suma de escenas no coincide con LB_DURATION");

  const durationSec = LB_DURATION / FILM_FPS;
  assert.ok(durationSec >= 70 && durationSec <= 80, `Duración ${durationSec}s fuera del rango 70-80s`);

  // Capítulos contiguos
  let offset = 0;
  for (const chapter of LB_CHAPTERS) {
    assert.equal(chapter.from, offset, `Capítulo ${chapter.id} no arranca en offset esperado`);
    offset += chapter.durationInFrames;
  }
  assert.equal(offset, LB_DURATION, "Los capítulos no cubren la duración total");

  // Escena final es signature
  assert.equal(LB_SCENES[LB_SCENES.length - 1].kind, "signature");
});

test("L&B film: copia honesta sin métricas no verificadas ni cronología", () => {
  const languages: FilmLanguage[] = ["es", "en"];
  const forbiddenPhrases = [
    "tasa de conversión",
    "conversion rate",
    "aumento del 300%",
    "+300%",
    "en solo 2 semanas",
    "en solo 3 semanas",
    "en 1 mes",
    "días récord",
  ];

  for (const lang of languages) {
    const copy = LB_COPY[lang];
    const textDump = JSON.stringify(copy).toLowerCase();

    for (const phrase of forbiddenPhrases) {
      assert.ok(
        !textDump.includes(phrase),
        `La copia en ${lang} contiene frase no verificada: "${phrase}"`,
      );
    }

    // Fact wall sources son transparentes
    for (const fact of copy.engineeringFacts) {
      assert.ok(
        fact.source.includes("repositorio") || fact.source.includes("project repository"),
        `Fuente no transparente en fact wall: ${fact.source}`,
      );
    }
  }
});
