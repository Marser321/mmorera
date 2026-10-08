import { CAPABILITY_CASES } from "../capabilityCases";
import { SKILL_ORBIT, techsForFamily } from "../skillOrbit";
import { FAMILIES, type Family } from "../techStack";
import type { FilmLanguage, Localized } from "./filmTypes";
import { STILL_SIZE } from "./flagships/slugs";
import { timelineFrom, type FilmAsset, type FlagshipChapter } from "./flagships/types";

/**
 * Films cortos por capacidad: uno por familia de /estudio (~25 s, es/en).
 * Qué resuelve la familia y con qué herramientas, los casos que la demuestran
 * (el cuadro protagonista de cada film insignia con su frase del mapa de
 * capacidades) y la firma. Todo sale de skillOrbit, techStack y
 * capabilityCases: el film no suma afirmaciones propias.
 */

export const CAPABILITY_SCENE_SECONDS = { intro: 6.5, case: 5, signature: 5 } as const;
/** Casos que entran en el film (el panel de /estudio los lista todos). */
export const CAPABILITY_FILM_CASES = 3;
/** Herramientas que entran como pastillas; el resto se resume en "+N". */
export const CAPABILITY_TOOLS_MAX = 8;

export type CapabilityFilmCase = { slug: string; chapter: string; name: string; text: string; asset: FilmAsset };

/** "Fénix: 1.096 videos…" → nombre del caso ("Fénix") y frase ("1.096 videos…"). */
export function splitCaseLine(line: string) {
  const at = line.indexOf(": ");
  if (at < 0) return { name: "", text: line };
  const text = line.slice(at + 2);
  return { name: line.slice(0, at), text: text.charAt(0).toUpperCase() + text.slice(1) };
}

const filmCases = (family: Family) => CAPABILITY_CASES[family].slice(0, CAPABILITY_FILM_CASES);

function capabilityTimeline(family: Family) {
  return timelineFrom([
    { id: "intro", seconds: CAPABILITY_SCENE_SECONDS.intro },
    { id: "cases", seconds: CAPABILITY_SCENE_SECONDS.case * filmCases(family).length },
    { id: "signature", seconds: CAPABILITY_SCENE_SECONDS.signature },
  ] as const);
}

export function capabilityDuration(family: Family) {
  return capabilityTimeline(family).durationInFrames;
}

/** Capítulos: la familia y un capítulo por caso (el último sigue hasta la firma). */
export function capabilityChapters(family: Family): FlagshipChapter[] {
  const node = SKILL_ORBIT.find((item) => item.id === family)!;
  const { slots, durationInFrames } = capabilityTimeline(family);
  const cases = filmCases(family);
  const each = Math.round(slots.cases.duration / cases.length);
  return [
    { id: "capability", label: { es: node.label.es, en: node.label.en }, caption: { es: node.blurb.es, en: node.blurb.en }, from: 0, durationInFrames: slots.intro.duration },
    ...cases.map((entry, index): FlagshipChapter => {
      const from = slots.cases.from + index * each;
      const label: Localized = { es: splitCaseLine(entry.line.es).name, en: splitCaseLine(entry.line.en).name };
      return { id: `case-${index + 1}`, label, caption: entry.line, from, durationInFrames: index === cases.length - 1 ? durationInFrames - from : each };
    }),
  ];
}

/** Id de exportación: capability-<familia> (p. ej. capability-ai); el MP4 suma formato e idioma. */
export const capabilityFilmId = (family: Family) => `capability-${family.toLowerCase()}`;

const pad = (value: number) => String(value).padStart(2, "0");

export function capabilityFilm(family: Family, language: FilmLanguage) {
  const node = SKILL_ORBIT.find((item) => item.id === family)!;
  const index = FAMILIES.findIndex((item) => item.id === family);
  const { slots, durationInFrames } = capabilityTimeline(family);
  const names = techsForFamily(family).map((tech) => tech.label?.[language] ?? tech.name);
  const tools = names.slice(0, CAPABILITY_TOOLS_MAX);
  if (names.length > tools.length) tools.push(`+${names.length - tools.length} ${language === "es" ? "más" : "more"}`);
  const cases = filmCases(family).map((entry): CapabilityFilmCase => {
    const { name, text } = splitCaseLine(entry.line[language]);
    return { slug: entry.slug, chapter: entry.chapter, name, text, asset: { src: `/portfolio/films/${entry.slug}/${entry.still}-${language}.jpg`, ...STILL_SIZE[entry.still] } };
  });
  return {
    family,
    color: node.color,
    related: node.related.map((id) => SKILL_ORBIT.find((item) => item.id === id)!.color),
    durationInFrames,
    timeline: slots,
    chapters: capabilityChapters(family),
    intro: {
      kicker: language === "es" ? `Capacidad ${pad(index + 1)} de ${pad(FAMILIES.length)}` : `Capability ${pad(index + 1)} of ${pad(FAMILIES.length)}`,
      title: node.label[language],
      blurb: node.blurb[language],
      toolsLabel: language === "es" ? "Herramientas" : "Tools",
      tools,
    },
    cases,
  };
}

export type CapabilityFilmData = ReturnType<typeof capabilityFilm>;
