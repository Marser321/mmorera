#!/usr/bin/env node
/**
 * Valida el "kit" de un caso: todo lo que hace falta para animar su film
 * insignia, preparado y verificado antes de escribir una línea de Remotion.
 * El contrato es docs/films/kits/<slug>.json (ver docs/films/GEMINI_PREP.md y
 * docs/films/kits/_template.json).
 *
 * Uso, desde web/:
 *   npx tsx scripts/check-case-kit.ts <slug>
 *   npx tsx scripts/check-case-kit.ts --all
 *
 * Sale con código 1 si algo falla (✖). Los avisos (⚠) no bloquean.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { PROJECT_CASES } from "../src/data/projectCases";
import { FLAGSHIP_FILMS } from "../src/data/films/flagships";
import { heroScene, type SceneKind } from "../src/data/films/flagships/types";
import { mediaSize } from "../src/lib/mediaSize";

type Localized = { es: string; en: string };
type KitMedia = { id: string; src: string; w: number; h: number; seconds?: number; webm?: string; poster?: string; note: string };
type KitCapture = { id: string; src: string; w: number; h: number; url: string; language?: "es" | "en"; what: string; highlights?: Array<{ label: Localized; rect: [number, number, number, number] }> };
type KitScene = { scene: string; kind: string; seconds: number; uses: string[]; copy: Localized };
export type CaseKit = {
  slug: string;
  verifiedAt: string;
  liveUrl: string;
  dossier: string;
  languages: Array<"es" | "en">;
  brand: {
    palette: Record<"bg" | "surface" | "raised" | "line" | "text" | "muted" | "accent" | "accentSoft" | "accentDeep" | "onAccent", string>;
    fonts: { display: string; body: string };
    logo: { mark: string; wordmark?: string; particleMode: "alpha" | "dark" };
    source: string;
  };
  facts: Array<{ key: string; value: number; label: Localized; source: string }>;
  media: KitMedia[];
  captures: KitCapture[];
  captureTarget: string;
  architecture: { bundle: string | null; reason: string };
  protagonist: { kind: string; idea: string; uses: string[] };
  storyboard: KitScene[];
  doNotClaim: string[];
};

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const KITS = path.join(ROOT, "docs/films/kits");
const PALETTE_KEYS = ["bg", "surface", "raised", "line", "text", "muted", "accent", "accentSoft", "accentDeep", "onAccent"] as const;
const LIMITS = { video: 3 * 1024 * 1024, image: 1.5 * 1024 * 1024 };
const FORBIDDEN = [/\d+\s?%/, /\bROI\b/i, /garantiz|guarante/i, /duplic|triplic|double your|triple/i, new RegExp("Uru" + "guay", "i")];

type Result = { ok: number; fail: string[]; warn: string[] };

function check(result: Result, condition: unknown, message: string) {
  if (condition) result.ok++;
  else result.fail.push(message);
}

/** Subsecuencia común más larga (misma regla que flagships.test.ts). */
function lcs(a: string[], b: string[]) {
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) table[i][j] = a[i - 1] === b[j - 1] ? table[i - 1][j - 1] + 1 : Math.max(table[i - 1][j], table[i][j - 1]);
  return table[a.length][b.length];
}

function availableFonts() {
  const source = readFileSync(path.join(ROOT, "src/components/films/brandFonts.ts"), "utf-8");
  const imported = /import \{([^}]+)\} from "next\/font\/google"/.exec(source)?.[1] ?? "";
  return imported.split(",").map((name) => name.trim().replace(/_/g, " ")).filter(Boolean);
}

function publicFile(src: string) {
  return path.join(PUBLIC, src);
}

function checkFile(result: Result, item: { id: string; src: string; w: number; h: number; seconds?: number }, kind: "video" | "image") {
  const file = publicFile(item.src);
  if (!existsSync(file)) {
    result.fail.push(`${item.id}: no existe public${item.src}`);
    return;
  }
  const bytes = statSync(file).size;
  check(result, bytes <= LIMITS[kind], `${item.id}: pesa ${(bytes / 1048576).toFixed(1)} MB (máximo ${(LIMITS[kind] / 1048576).toFixed(1)} MB)`);
  try {
    const size = mediaSize(readFileSync(file), file);
    check(result, size.width === item.w && size.height === item.h, `${item.id}: mide ${size.width}×${size.height}, el kit dice ${item.w}×${item.h}`);
    if (item.seconds !== undefined) check(result, Math.abs((size.seconds ?? 0) - item.seconds) < 0.2, `${item.id}: dura ${size.seconds?.toFixed(2)} s, el kit dice ${item.seconds}`);
  } catch (error) {
    result.fail.push(`${item.id}: no se pudo medir (${String(error)})`);
  }
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

export function checkKit(slug: string): Result {
  const result: Result = { ok: 0, fail: [], warn: [] };
  const file = path.join(KITS, `${slug}.json`);
  if (!existsSync(file)) return { ok: 0, fail: [`no existe docs/films/kits/${slug}.json`], warn: [] };
  let kit: CaseKit;
  try {
    kit = JSON.parse(readFileSync(file, "utf-8")) as CaseKit;
  } catch (error) {
    return { ok: 0, fail: [`${slug}.json no es JSON válido: ${String(error)}`], warn: [] };
  }

  // Caso y fuente.
  check(result, kit.slug === slug, `el slug del kit (${kit.slug}) no coincide con el archivo`);
  const project = PROJECT_CASES.find((item) => item.slug === slug);
  check(result, project, `${slug} no está en src/data/projectCases.ts`);
  check(result, /^\d{4}-\d{2}-\d{2}$/.test(kit.verifiedAt ?? ""), "verifiedAt debe ser AAAA-MM-DD");
  check(result, /^https:\/\//.test(kit.liveUrl ?? ""), "liveUrl debe ser https://…");
  check(result, kit.languages?.length > 0, "languages: al menos un idioma del sitio");

  // Dossier: cada cifra del kit aparece en él con su fuente.
  const dossierPath = path.join(ROOT, "docs/films/dossiers", kit.dossier ?? "");
  const dossier = existsSync(dossierPath) ? readFileSync(dossierPath, "utf-8") : "";
  check(result, dossier.length > 0, `no existe docs/films/dossiers/${kit.dossier}`);
  check(result, (kit.facts ?? []).length >= 5, "facts: al menos 5 cifras verificadas para el muro de cifras");
  for (const fact of kit.facts ?? []) {
    check(result, new RegExp(`\\b${fact.value}\\b`).test(dossier), `la cifra ${fact.key} (${fact.value}) no aparece en el dossier`);
    check(result, fact.source?.trim().length > 10, `${fact.key}: falta la fuente (URL y cómo se contó)`);
    check(result, fact.label?.es && fact.label?.en, `${fact.key}: falta el rótulo en es o en`);
  }

  // Marca.
  for (const key of PALETTE_KEYS) check(result, /^#[0-9A-Fa-f]{6}$/.test(kit.brand?.palette?.[key] ?? ""), `brand.palette.${key} debe ser #RRGGBB`);
  check(result, kit.brand?.source?.length > 20, "brand.source: de qué CSS o archivo salen los colores y las fuentes");
  const fonts = availableFonts();
  for (const role of ["display", "body"] as const) {
    const font = kit.brand?.fonts?.[role];
    if (font && !fonts.includes(font)) result.warn.push(`fuente ${font} (${role}) no está en brandFonts.ts: hay que sumarla al animar`);
  }
  const mark = kit.brand?.logo?.mark;
  if (mark && existsSync(publicFile(mark))) {
    const png = readFileSync(publicFile(mark));
    check(result, png.readUInt32BE(0) === 0x89504e47, "logo.mark debe ser PNG");
    // Tipo de color 6 = RGBA: las partículas leen el alfa del isotipo.
    if (kit.brand.logo.particleMode === "alpha") check(result, png[25] === 6, "logo.mark sin canal alfa: usar particleMode \"dark\" o exportar con transparencia");
    check(result, Math.max(png.readUInt32BE(16), png.readUInt32BE(20)) >= 512, "logo.mark: el lado mayor debe medir al menos 512 px");
  } else result.fail.push(`logo.mark no existe en public${mark ?? ""}`);
  if (kit.brand?.logo?.wordmark) check(result, existsSync(publicFile(kit.brand.logo.wordmark)), `logo.wordmark no existe en public${kit.brand.logo.wordmark}`);

  // Medios y capturas.
  const ids = new Set<string>();
  for (const item of kit.media ?? []) {
    ids.add(item.id);
    const video = item.src.endsWith(".mp4");
    checkFile(result, item, video ? "video" : "image");
    check(result, item.note?.length > 5, `${item.id}: note (qué es y de dónde sale)`);
    if (video) {
      check(result, item.webm && existsSync(publicFile(item.webm)), `${item.id}: falta la versión AV1/WebM`);
      check(result, item.poster && existsSync(publicFile(item.poster)), `${item.id}: falta el póster`);
      check(result, item.seconds !== undefined, `${item.id}: falta seconds`);
    }
  }
  const host = kit.liveUrl ? new URL(kit.liveUrl).host : "";
  for (const capture of kit.captures ?? []) {
    ids.add(capture.id);
    checkFile(result, capture, "image");
    check(result, capture.url?.includes(host), `${capture.id}: la URL capturada no es del sitio del caso`);
    check(result, capture.what?.length > 5, `${capture.id}: what (qué muestra)`);
    for (const highlight of capture.highlights ?? []) {
      const [x, y, w, h] = highlight.rect;
      check(result, x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1 && y + h <= 1, `${capture.id}: rect fuera de la captura`);
    }
  }
  check(result, (kit.captures ?? []).length >= 3, "captures: al menos 3 capturas del sitio en vivo");
  // El objetivo vive en capture-film-flows.ts o en su propio archivo de scripts/capture-targets/.
  const flows = readFileSync(path.join(ROOT, "scripts/capture-film-flows.ts"), "utf-8");
  const targetsDir = path.join(ROOT, "scripts/capture-targets");
  const ownTargets = existsSync(targetsDir) ? readdirSync(targetsDir).filter((name) => name.endsWith(".ts")).map((name) => readFileSync(path.join(targetsDir, name), "utf-8")) : [];
  check(result, flows.includes(`"${kit.captureTarget}":`) || ownTargets.some((source) => source.includes(`name: "${kit.captureTarget}"`)), `captureTarget "${kit.captureTarget}" no existe (capture-film-flows.ts o scripts/capture-targets/)`);

  // Arquitectura (solo si el caso tiene un sistema propio verificable).
  if (kit.architecture?.bundle) {
    const name = kit.architecture.bundle;
    const dir = path.join(ROOT, "src/data/architecture");
    for (const suffix of [".json", ".portrait.json", ".en.json", ".layout.json", ".en.layout.json", ".portrait.layout.json", ".portrait.en.layout.json"]) {
      check(result, existsSync(path.join(dir, `${name}${suffix}`)), `arquitectura: falta ${name}${suffix} (correr build-archify-layouts)`);
    }
    check(result, existsSync(path.join(dir, "bundles", `${slug}.ts`)), `arquitectura: falta bundles/${slug}.ts`);
    if (!readFileSync(path.join(dir, "registry.ts"), "utf-8").includes(`"${slug}"`)) result.warn.push("arquitectura: falta sumar el caso a registry.ts (lo hace quien anima)");
    const test = spawnSync("npx", ["tsx", "--test", "src/data/architecture/archify.test.ts"], { cwd: ROOT, encoding: "utf-8", shell: true });
    check(result, test.status === 0, `archify.test.ts falla:\n${(test.stdout + test.stderr).split("\n").filter((line) => /✖|Error|sale|pisa|toca/.test(line)).slice(0, 8).join("\n")}`);
  } else check(result, kit.architecture?.reason?.length > 10, "architecture.reason: por qué el caso no tiene diagrama");

  // Guion: duración, firma, protagonista propia y estructura distinta.
  const board = kit.storyboard ?? [];
  const total = board.reduce((sum, scene) => sum + scene.seconds, 0);
  check(result, total >= 70 && total <= 80, `storyboard: dura ${total} s (70–80)`);
  check(result, board.at(-1)?.kind === "signature", "storyboard: la última escena es la firma (signature)");
  check(result, board.some((scene) => scene.kind === kit.protagonist?.kind), "storyboard: la protagonista tiene que estar en el guion");
  const longest = [...board].sort((a, b) => b.seconds - a.seconds)[0];
  check(result, longest?.kind === kit.protagonist?.kind, `storyboard: la escena más larga debe ser la protagonista (${longest?.kind})`);
  check(result, /^[a-z]+(-[a-z]+)*$/.test(kit.protagonist?.kind ?? ""), "protagonist.kind en kebab-case");
  // Contra los demás films (si el caso ya tiene el suyo, no se compara consigo mismo).
  const others = Object.values(FLAGSHIP_FILMS).filter((film) => film.slug !== slug);
  const heroKinds = others.map((film) => heroScene(film.scenes).kind as string);
  check(result, !heroKinds.includes(kit.protagonist?.kind), `protagonist.kind "${kit.protagonist?.kind}" ya es la protagonista de otro film`);
  const middle = board.slice(1, -1).map((scene) => scene.kind);
  for (const film of others) {
    const other = film.scenes.slice(1, -1).map((scene) => scene.kind as SceneKind as string);
    const ratio = lcs(middle, other) / Math.max(1, Math.min(middle.length, other.length));
    check(result, ratio <= 0.6, `storyboard: se parece demasiado a ${film.slug} (${ratio.toFixed(2)})`);
  }
  for (const scene of board) {
    for (const use of scene.uses ?? []) check(result, ids.has(use), `storyboard ${scene.scene}: usa "${use}", que no está en media ni captures`);
    check(result, scene.copy?.es && scene.copy?.en, `storyboard ${scene.scene}: falta la copia en es o en`);
  }

  // Honestidad.
  check(result, (kit.doNotClaim ?? []).length > 0, "doNotClaim: lo que el film no puede afirmar");
  const copy = [...strings(kit.storyboard), ...strings(kit.facts?.map((fact) => fact.label)), ...strings(kit.captures?.map((capture) => capture.highlights))];
  for (const text of copy) for (const pattern of FORBIDDEN) check(result, !pattern.test(text), `copia prohibida (${pattern}): "${text}"`);
  return result;
}

function main() {
  const args = process.argv.slice(2);
  const slugs = args[0] === "--all" ? readdirSync(KITS).filter((name) => name.endsWith(".json") && !name.startsWith("_")).map((name) => name.replace(/\.json$/, "")) : args;
  if (!slugs.length) throw new Error("Uso: npx tsx scripts/check-case-kit.ts <slug> | --all");
  let failed = false;
  for (const slug of slugs) {
    const result = checkKit(slug);
    console.log(`\n${result.fail.length ? "✖" : "✔"} ${slug}: ${result.ok} comprobaciones bien, ${result.fail.length} fallas, ${result.warn.length} avisos`);
    for (const message of result.fail) console.log(`  ✖ ${message}`);
    for (const message of result.warn) console.log(`  ⚠ ${message}`);
    failed ||= result.fail.length > 0;
  }
  process.exit(failed ? 1 : 0);
}

main();
