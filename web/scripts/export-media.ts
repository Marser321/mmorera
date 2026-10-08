#!/usr/bin/env node
/**
 * Material de portfolio y redes a partir de los films insignia: videos en el
 * formato de cada plataforma, recortes por escena o capítulo, imágenes
 * explicativas, diagramas de arquitectura (Archify) y los textos del caso.
 *
 * Uso, desde web/ (salida en media-kit/, fuera de git):
 *   npx tsx scripts/export-media.ts presets                       lista de formatos
 *   npx tsx scripts/export-media.ts info <slug>                   capítulos y escenas con tiempos y textos
 *   npx tsx scripts/export-media.ts kit <slug…|--all> [--languages es,en] [--light]
 *   npx tsx scripts/export-media.ts preset <preset> <slug> [--lang es] [--scene <id> | --chapter <id> | --from 12 --to 30] [--fit pad|cover] [--out ruta]
 *   npx tsx scripts/export-media.ts frame <slug> [--preset image-16x9] [--lang es] [--at 12.5 | --at chapter:<id> | --at scene:<id>] [--out ruta]
 *   npx tsx scripts/export-media.ts diagramas [slug…]
 *
 * Parte de los MP4 maestros de renders/ (16:9 1920×1080 y 4:5 1080×1350); si
 * falta uno, lo renderiza con scripts/render-films.ts.
 */
import { execFileSync, execSync } from "node:child_process";
import { copyFileSync, existsSync, linkSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PROJECT_CASES } from "../src/data/projectCases";
import { FLAGSHIP_FILMS } from "../src/data/films/flagships";
import { FLAGSHIP_STILLS, flagshipStill } from "../src/data/films/flagships/slugs";
import { heroScene, timelineFrom } from "../src/data/films/flagships/types";
import { localizeDiagram, type ArchifyArchitecture, type ArchifyTranslation } from "../src/data/architecture/archify";
import { MEDIA_PRESETS, type MediaPreset } from "./lib/mediaPresets";

type Language = "es" | "en";
type Range = { from: number; to: number; label: string };

const ROOT = process.cwd();
const FPS = 30;
const OUT = path.join(ROOT, "media-kit");
const SITE = "https://mmorera.agency";

function ffmpeg() {
  const candidates = [
    process.env.FFMPEG,
    "C:/Users/morer/AppData/Local/Microsoft/WinGet/Packages/yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-N-124716-g054dffd133-winarm64-gpl/bin/ffmpeg.exe",
    path.join(ROOT, ".remotion-bin/package/ffmpeg.exe"),
  ].filter((candidate): candidate is string => Boolean(candidate));
  return candidates.find((candidate) => existsSync(candidate)) ?? "ffmpeg";
}
const FFMPEG = ffmpeg();
const run = (args: string[]) => execFileSync(FFMPEG, ["-v", "error", "-y", ...args], { stdio: ["ignore", "ignore", "inherit"] });

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}
const positional = () => process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !(all[index - 1]?.startsWith("--") && !["--all", "--light"].includes(all[index - 1])));

function film(slug: string) {
  const data = FLAGSHIP_FILMS[slug];
  if (!data) throw new Error(`${slug} no tiene film insignia (${Object.keys(FLAGSHIP_FILMS).join(", ")})`);
  const slots = timelineFrom(data.scenes).slots as Record<string, { from: number; duration: number }>;
  const scenes = data.scenes.map((scene) => ({ id: scene.id, kind: scene.kind, ...slots[scene.id] }));
  return { data, scenes, hero: heroScene(data.scenes).id, architecture: scenes.find((scene) => scene.kind === "architecture")?.id };
}

/** MP4 maestro (16:9 o 4:5); si no está, se renderiza. */
function master(slug: string, format: "landscape" | "portrait", language: Language) {
  const file = path.join(ROOT, "renders", slug, `${slug}-${format}-${language}.mp4`);
  if (!existsSync(file)) execSync(`npx tsx scripts/render-films.ts ${slug} --formats ${format} --languages ${language}`, { cwd: ROOT, stdio: "inherit" });
  return file;
}

function range(slug: string, preset: MediaPreset | null): Range {
  const info = film(slug);
  const total = info.data.durationInFrames / FPS;
  const scene = option("scene");
  const chapter = option("chapter");
  const pick = (id: string, list: Array<{ id: string; from: number; duration?: number; durationInFrames?: number }>) => {
    const item = list.find((entry) => entry.id === id);
    if (!item) throw new Error(`No existe "${id}" en ${slug}: ${list.map((entry) => entry.id).join(", ")}`);
    return { from: item.from / FPS, to: (item.from + (item.duration ?? item.durationInFrames ?? 0)) / FPS, label: id };
  };
  let selected: Range = { from: 0, to: total, label: "film" };
  if (scene) selected = pick(scene, info.scenes);
  else if (chapter) selected = pick(chapter, info.data.chapters);
  else if (option("from") || option("to")) selected = { from: Number(option("from") ?? 0), to: Number(option("to") ?? total), label: "tramo" };
  else if (preset?.maxSeconds && total > preset.maxSeconds) selected = pick(info.hero, info.scenes);
  if (preset?.maxSeconds && selected.to - selected.from > preset.maxSeconds) selected = { ...selected, to: selected.from + preset.maxSeconds };
  return selected;
}

/** Filtro de encuadre: igual proporción, "pad" sobre fondo desenfocado del propio film, o "cover". */
function frameFilter(w: number, h: number, fit: "pad" | "cover", sourceAspect: number) {
  const same = Math.abs(w / h - sourceAspect) < 0.01;
  if (same) return `[0:v]scale=${w}:${h}:flags=lanczos,setsar=1[v]`;
  if (fit === "cover") return `[0:v]scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h},setsar=1[v]`;
  return `[0:v]split=2[a][b];[a]scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},gblur=sigma=40,eq=brightness=-0.18[bg];[b]scale=${w}:${h}:force_original_aspect_ratio=decrease:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v]`;
}

/** El maestro que mejor encaja: 16:9 para formatos anchos, 4:5 para verticales y cuadrados. */
const sourceFor = (preset: MediaPreset) => (preset.w / preset.h >= 1.2 ? { format: "landscape" as const, aspect: 16 / 9 } : { format: "portrait" as const, aspect: 4 / 5 });

function exportVideo(slug: string, language: Language, presetName: string, out: string, chosen?: Range) {
  const preset = MEDIA_PRESETS[presetName];
  const selected = chosen ?? range(slug, preset);
  const source = sourceFor(preset);
  const input = master(slug, source.format, language);
  const duration = selected.to - selected.from;
  const filter = frameFilter(preset.w, preset.h, (option("fit") as "pad" | "cover") ?? preset.fit ?? "pad", source.aspect);
  mkdirSync(path.dirname(out), { recursive: true });
  if (preset.kind === "gif") {
    const fps = preset.fps ?? 15;
    run(["-ss", String(selected.from), "-t", String(Math.min(duration, preset.maxSeconds ?? 8)), "-i", input, "-filter_complex", `${filter};[v]fps=${fps},split[s0][s1];[s0]palettegen=max_colors=192[p];[s1][p]paletteuse=dither=sierra2_4a`, out]);
    return out;
  }
  const cap = preset.maxMB ? ["-maxrate", `${Math.floor((preset.maxMB * 8192 * 0.9) / duration)}k`, "-bufsize", `${Math.floor((preset.maxMB * 8192 * 1.8) / duration)}k`] : [];
  run(["-ss", String(selected.from), "-t", String(duration), "-i", input, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "20", ...cap, "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]);
  return out;
}

/** Segundo de un cuadro: número, chapter:<id> o scene:<id> (el cuadro con todo armado, antes del fundido). */
function frameTime(slug: string, at: string | undefined) {
  const info = film(slug);
  if (!at) return (FLAGSHIP_STILLS[slug as keyof typeof FLAGSHIP_STILLS]?.og ?? 215) / FPS;
  const [type, id] = at.split(":");
  if (type === "chapter") {
    const chapter = info.data.chapters.find((entry) => entry.id === id);
    if (!chapter) throw new Error(`No existe el capítulo ${id}`);
    return (chapter.from + chapter.durationInFrames - 24) / FPS;
  }
  if (type === "scene") {
    const scene = info.scenes.find((entry) => entry.id === id);
    if (!scene) throw new Error(`No existe la escena ${id}`);
    return (scene.from + scene.duration - 24) / FPS;
  }
  return Number(at);
}

function exportFrame(slug: string, language: Language, presetName: string, seconds: number, out: string) {
  const preset = MEDIA_PRESETS[presetName];
  const source = sourceFor(preset);
  const input = master(slug, source.format, language);
  mkdirSync(path.dirname(out), { recursive: true });
  run(["-ss", seconds.toFixed(3), "-i", input, "-frames:v", "1", "-filter_complex", frameFilter(preset.w, preset.h, preset.fit ?? "pad", source.aspect), "-map", "[v]", "-q:v", "2", out]);
  return out;
}

/** Enlace duro al maestro (no duplica espacio); si no se puede, copia. */
function place(source: string, target: string) {
  mkdirSync(path.dirname(target), { recursive: true });
  if (existsSync(target)) return target;
  try {
    linkSync(source, target);
  } catch {
    copyFileSync(source, target);
  }
  return target;
}

/* ─── Diagramas de Archify ─── */

const ARCHIFY = path.join(ROOT, "../.claude/skills/archify/bin/archify.mjs");

function diagramSources() {
  const dir = path.join(ROOT, "src/data/architecture");
  const out: Record<string, string> = {};
  for (const file of readdirSync(path.join(dir, "bundles"))) {
    const name = /from "\.\.\/([^"]+)\.json"/.exec(readFileSync(path.join(dir, "bundles", file), "utf-8"))?.[1];
    if (name) out[file.replace(/\.ts$/, "")] = name;
  }
  return out;
}

async function exportDiagrams(slugs: string[]) {
  const sources = diagramSources();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const done: string[] = [];
  for (const slug of slugs) {
    const name = sources[slug];
    if (!name) continue;
    const dir = path.join(ROOT, "src/data/architecture");
    const base = JSON.parse(readFileSync(path.join(dir, `${name}.json`), "utf-8")) as ArchifyArchitecture;
    const translation = JSON.parse(readFileSync(path.join(dir, `${name}.en.json`), "utf-8")) as ArchifyTranslation;
    for (const language of ["es", "en"] as const) {
      const diagram = language === "es" ? base : localizeDiagram(base, translation);
      const outDir = path.join(OUT, slug, language, "diagrama");
      mkdirSync(outDir, { recursive: true });
      const json = path.join(os.tmpdir(), `${slug}-${language}-archify.json`);
      writeFileSync(json, JSON.stringify(diagram, null, 2));
      const html = path.join(outDir, `arquitectura-${language}.html`);
      execFileSync("node", [ARCHIFY, "render", "architecture", json, html, "--quality", "showcase"], { stdio: "ignore" });
      // Dos versiones: papel (la clara de Archify) y oscura (para redes).
      for (const theme of ["light", "dark"] as const) {
        const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, colorScheme: theme });
        await page.goto(pathToFileURL(html).href);
        await page.evaluate(`document.documentElement.setAttribute("data-theme", "${theme}")`);
        await page.waitForTimeout(1200);
        const png = path.join(outDir, `arquitectura-${language}${theme === "dark" ? "-oscuro" : ""}.png`);
        await page.locator("svg").first().screenshot({ path: png });
        await page.close();
        done.push(path.relative(ROOT, png));
      }
      done.push(path.relative(ROOT, html));
    }
  }
  await browser.close();
  return done;
}

/* ─── Textos del caso (para las descripciones en cada plataforma) ─── */

function caseTexts(slug: string, language: Language) {
  const project = PROJECT_CASES.find((item) => item.slug === slug);
  if (!project) return "";
  const info = film(slug);
  const caseUrl = `${SITE}${language === "en" ? "/en" : ""}/casos-de-exito/${slug}`;
  const t = (value: { es: string; en: string } | undefined) => value?.[language] ?? "";
  const lines = [
    `# ${t(project.title)}`,
    "",
    t(project.summary),
    "",
    `- ${language === "es" ? "Caso" : "Case study"}: ${caseUrl}`,
    `- Film: ${caseUrl}#film`,
    project.liveUrl ? `- ${language === "es" ? "Sitio" : "Site"}: ${project.liveUrl}` : "",
    `- ${language === "es" ? "Rol" : "Role"}: ${t(project.role)}`,
    `- Stack: ${project.stack.join(", ")}`,
    "",
    `## ${language === "es" ? "Desafío" : "Challenge"}`,
    t(project.challenge),
    "",
    `## ${language === "es" ? "Decisiones" : "Decisions"}`,
    ...project.decisions.map((decision) => `- ${t(decision)}`),
    "",
    `## ${language === "es" ? "Resultado" : "Outcome"}`,
    t(project.result),
    "",
    `## ${language === "es" ? "Capítulos del film" : "Film chapters"}`,
    ...info.data.chapters.map((chapter) => `- **${t(chapter.label)}** (${(chapter.from / FPS).toFixed(1)}–${((chapter.from + chapter.durationInFrames) / FPS).toFixed(1)} s, \`--chapter ${chapter.id}\`): ${t(chapter.caption)}`),
  ];
  return lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n") + "\n";
}

/* ─── Kit por caso ─── */

async function kit(slug: string, languages: Language[], light: boolean) {
  const info = film(slug);
  const files: string[] = [];
  for (const language of languages) {
    const dir = path.join(OUT, slug, language);
    const v = (name: string) => path.join(dir, "videos", name);
    const i = (name: string) => path.join(dir, "imagenes", name);
    files.push(place(master(slug, "landscape", language), v("film-16x9.mp4")));
    files.push(place(master(slug, "portrait", language), v("film-4x5.mp4")));
    const hero = info.scenes.find((scene) => scene.id === info.hero)!;
    const heroRange = { from: hero.from / FPS, to: (hero.from + hero.duration) / FPS, label: hero.id };
    if (!light) files.push(exportVideo(slug, language, "video-9x16", v("film-9x16.mp4"), { from: 0, to: info.data.durationInFrames / FPS, label: "film" }));
    files.push(exportVideo(slug, language, "video-16x9", v(`clip-${hero.id}-16x9.mp4`), heroRange));
    files.push(exportVideo(slug, language, "video-4x5", v(`clip-${hero.id}-4x5.mp4`), heroRange));
    files.push(exportVideo(slug, language, "video-9x16", v(`clip-${hero.id}-9x16.mp4`), heroRange));
    files.push(exportVideo(slug, language, "video-1x1", v(`clip-${hero.id}-1x1.mp4`), heroRange));
    if (info.architecture) {
      const scene = info.scenes.find((entry) => entry.id === info.architecture)!;
      files.push(exportVideo(slug, language, "video-16x9", v("clip-arquitectura-16x9.mp4"), { from: scene.from / FPS, to: (scene.from + scene.duration) / FPS, label: scene.id }));
      for (const [index, share] of [0.4, 0.7, 0.97].entries()) {
        const seconds = (scene.from + Math.min(scene.duration - 24, scene.duration * share)) / FPS;
        files.push(exportFrame(slug, language, "image-16x9", seconds, i(`arquitectura-${index + 1}-16x9.jpg`)));
      }
    }
    const cover = frameTime(slug, undefined);
    files.push(exportFrame(slug, language, "image-16x9", cover, i("portada-16x9.jpg")));
    files.push(exportFrame(slug, language, "image-4x5", cover, i("portada-4x5.jpg")));
    files.push(exportFrame(slug, language, "image-1x1", cover, i("portada-1x1.jpg")));
    files.push(exportFrame(slug, language, "image-4x3", cover, i("portada-4x3.jpg")));
    const og = flagshipStill(slug, "og", language);
    if (og && existsSync(path.join(ROOT, "public", og))) files.push(place(path.join(ROOT, "public", og), i("og-1200x630.jpg")));
    for (const [index, chapter] of info.data.chapters.entries()) {
      const seconds = (chapter.from + chapter.durationInFrames - 24) / FPS;
      files.push(exportFrame(slug, language, "image-16x9", seconds, i(`capitulo-${String(index + 1).padStart(2, "0")}-${chapter.id}-16x9.jpg`)));
      files.push(exportFrame(slug, language, "image-4x5", seconds, i(`capitulo-${String(index + 1).padStart(2, "0")}-${chapter.id}-4x5.jpg`)));
    }
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "textos.md"), caseTexts(slug, language));
    files.push(path.join(dir, "textos.md"));
  }
  files.push(...(await exportDiagrams([slug])).map((file) => path.join(ROOT, file)));
  return files;
}

/* ─── Índice ─── */

function probe(file: string) {
  try {
    const out = execFileSync(FFMPEG.replace(/ffmpeg(\.exe)?$/, "ffprobe$1"), ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "csv=p=0", file], { encoding: "utf-8" });
    const [size, duration] = out.trim().split("\n");
    const [w, h] = size.split(",");
    return { w: Number(w), h: Number(h), seconds: duration ? Number(Number(duration).toFixed(1)) : undefined };
  } catch {
    return null;
  }
}

function writeIndex() {
  if (!existsSync(OUT)) return;
  const entries: Array<Record<string, unknown>> = [];
  const lines = ["# Media kit de los casos", "", "Generado con `npx tsx scripts/export-media.ts`. Cada caso tiene `es/` y `en/` con `videos/`, `imagenes/`, `diagrama/` (si tiene arquitectura) y `textos.md`.", ""];
  for (const slug of readdirSync(OUT).filter((name) => statSync(path.join(OUT, name)).isDirectory()).sort()) {
    lines.push(`## ${slug}`, "", "| archivo | tipo | medida | duración | peso |", "| --- | --- | --- | --- | --- |");
    const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => (statSync(path.join(dir, name)).isDirectory() ? walk(path.join(dir, name)) : [path.join(dir, name)]));
    for (const file of walk(path.join(OUT, slug)).sort()) {
      const relative = path.relative(OUT, file).replace(/\\/g, "/");
      const ext = path.extname(file).slice(1);
      const type = ext === "mp4" ? "video" : ext === "gif" ? "gif" : ["jpg", "png"].includes(ext) ? "imagen" : ext === "html" ? "diagrama interactivo" : "texto";
      const media = ["mp4", "gif", "jpg", "png"].includes(ext) ? probe(file) : null;
      const mb = (statSync(file).size / 1048576).toFixed(1);
      entries.push({ slug, file: relative, type, width: media?.w, height: media?.h, seconds: type === "video" ? media?.seconds : undefined, mb: Number(mb) });
      lines.push(`| ${relative} | ${type} | ${media ? `${media.w}×${media.h}` : "—"} | ${type === "video" && media?.seconds ? `${media.seconds} s` : "—"} | ${mb} MB |`);
    }
    lines.push("");
  }
  writeFileSync(path.join(OUT, "INDEX.md"), lines.join("\n"));
  writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(entries, null, 2));
}

async function main() {
  const [command, ...rest] = positional();
  const language = (option("lang") as Language) ?? "es";
  switch (command) {
    case "presets":
      for (const [name, preset] of Object.entries(MEDIA_PRESETS)) console.log(`${name.padEnd(20)} ${preset.kind.padEnd(5)} ${`${preset.w}×${preset.h}`.padEnd(10)} ${preset.maxSeconds ? `≤${preset.maxSeconds} s ` : ""}${preset.note}`);
      return;
    case "info": {
      const info = film(rest[0]);
      console.log(`${rest[0]} · ${(info.data.durationInFrames / FPS).toFixed(1)} s · protagonista: ${info.hero}${info.architecture ? ` · arquitectura: ${info.architecture}` : ""}`);
      console.log("\nEscenas (--scene):");
      for (const scene of info.scenes) console.log(`  ${scene.id.padEnd(14)} ${scene.kind.padEnd(16)} ${(scene.from / FPS).toFixed(1)}–${((scene.from + scene.duration) / FPS).toFixed(1)} s`);
      console.log("\nCapítulos (--chapter):");
      for (const chapter of info.data.chapters) console.log(`  ${chapter.id.padEnd(14)} ${(chapter.from / FPS).toFixed(1)}–${((chapter.from + chapter.durationInFrames) / FPS).toFixed(1)} s  ${chapter.label.es} — ${chapter.caption.es}`);
      return;
    }
    case "kit": {
      const slugs = rest.length && !process.argv.includes("--all") ? rest : Object.keys(FLAGSHIP_FILMS);
      const languages = (option("languages") ?? "es,en").split(",") as Language[];
      for (const slug of slugs) {
        const started = Date.now();
        const files = await kit(slug, languages, process.argv.includes("--light"));
        console.log(`${slug}: ${files.length} archivos (${Math.round((Date.now() - started) / 1000)} s)`);
      }
      writeIndex();
      console.log(`Índice: ${path.relative(ROOT, path.join(OUT, "INDEX.md"))}`);
      return;
    }
    case "preset": {
      const [presetName, slug] = rest;
      const preset = MEDIA_PRESETS[presetName];
      if (!preset) throw new Error(`Preset desconocido: ${presetName}. Ver: npx tsx scripts/export-media.ts presets`);
      if (preset.kind === "image") {
        const seconds = frameTime(slug, option("at"));
        const out = option("out") ?? path.join(OUT, slug, language, "pedidos", `${presetName}-${seconds.toFixed(1)}s.jpg`);
        console.log(exportFrame(slug, language, presetName, seconds, out));
      } else {
        const selected = range(slug, preset);
        const out = option("out") ?? path.join(OUT, slug, language, "pedidos", `${presetName}-${selected.label}.${preset.kind === "gif" ? "gif" : "mp4"}`);
        console.log(exportVideo(slug, language, presetName, out, selected));
      }
      writeIndex();
      return;
    }
    case "frame": {
      const [slug] = rest;
      const presetName = option("preset") ?? "image-16x9";
      const seconds = frameTime(slug, option("at"));
      const out = option("out") ?? path.join(OUT, slug, language, "pedidos", `${presetName}-${seconds.toFixed(1)}s.jpg`);
      console.log(exportFrame(slug, language, presetName, seconds, out));
      writeIndex();
      return;
    }
    case "diagramas": {
      const slugs = rest.length ? rest : Object.keys(diagramSources());
      for (const file of await exportDiagrams(slugs)) console.log(file);
      writeIndex();
      return;
    }
    default:
      console.log("Uso: npx tsx scripts/export-media.ts <presets|info|kit|preset|frame|diagramas> … (ver el encabezado del script)");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
