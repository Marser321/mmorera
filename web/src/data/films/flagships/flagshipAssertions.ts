import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { mediaSize } from "@/lib/mediaSize";
import { FILM_FPS } from "../filmTypes";
import { heroScene, type FilmAsset, type FilmFact, type FlagshipChapter, type FlagshipScene, type SceneKind } from "./types";

/**
 * Comprobaciones comunes de los datos de cada film insignia: duración y
 * protagonista, capítulos contiguos, cifras respaldadas por el dossier,
 * medios que miden lo que declaran y copia sin promesas ni métricas sueltas.
 */

export function readDossier(file: string) {
  return readFileSync(path.join(process.cwd(), "docs/films/dossiers", file), "utf8");
}

export function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => strings(item, out));
  return out;
}

export function assertStructure(scenes: ReadonlyArray<FlagshipScene>, duration: number, protagonist: SceneKind) {
  const seconds = duration / FILM_FPS;
  assert.ok(seconds >= 70 && seconds <= 80, `dura ${seconds} s`);
  assert.equal(heroScene([...scenes]).kind, protagonist, "escena protagonista");
  assert.equal(scenes[scenes.length - 1].kind, "signature");
}

export function assertChapters(chapters: FlagshipChapter[], duration: number) {
  let expected = 0;
  for (const chapter of chapters) {
    assert.equal(chapter.from, expected, `${chapter.label.es} no es contiguo`);
    expected += chapter.durationInFrames;
  }
  assert.equal(expected, duration);
}

export function assertFactsInDossier(facts: Record<string, FilmFact>, dossier: string) {
  for (const [key, fact] of Object.entries(facts)) {
    assert.ok(new RegExp(`\\b${String(fact.value).replace(".", "\\.")}\\b`).test(dossier), `${key}=${fact.value} no aparece en el dossier`);
    assert.ok(fact.source.startsWith("Dossier"), `${key}: fuente sin documentar`);
  }
}

export function assertAssets(assets: Record<string, FilmAsset>) {
  for (const asset of Object.values(assets)) {
    const size = mediaSize(readFileSync(path.join(process.cwd(), "public", asset.src)), asset.src);
    assert.equal(size.width, asset.w, `${asset.src}: ancho`);
    assert.equal(size.height, asset.h, `${asset.src}: alto`);
    if (asset.seconds) assert.ok(Math.abs((size.seconds ?? 0) - asset.seconds) < 0.2, `${asset.src}: duración ${size.seconds}`);
    if (asset.webm) assert.ok(readFileSync(path.join(process.cwd(), "public", asset.webm)).length > 0, `${asset.webm} no existe`);
  }
}

/** Lo que ningún film dice sin fuente: porcentajes, ROI, garantías ni "multiplicá". */
export const FORBIDDEN_CLAIMS = [/\d+\s?%/, /\bROI\b/i, /garantiz|guarante/i, /duplic|triplic|double your|triple/i];

export function assertHonestCopy(texts: string[], extra: RegExp[] = []) {
  for (const text of texts) {
    for (const pattern of [...FORBIDDEN_CLAIMS, ...extra]) assert.ok(!pattern.test(text), `"${text}" coincide con ${pattern}`);
  }
}
