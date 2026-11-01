import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { overlaps, safeArea } from "@/lib/filmLayout";
import { CAPABILITY_CASES } from "@/data/capabilityCases";
import { capabilityChapters, capabilityDuration, capabilityFilm, CAPABILITY_FILM_CASES, splitCaseLine } from "@/data/films/capabilityFilms";
import { assertHonestCopy } from "@/data/films/flagships/flagshipAssertions";
import { FILM_FPS } from "@/data/films/filmTypes";
import { FAMILIES } from "@/data/techStack";
import { GLYPH_EM, lineCount } from "../scenes/brand/layout/mediaShared";
import { manifestoBeatsLayout } from "../scenes/brand/layout/manifestoBeats";
import { plateManifestoLayout } from "./kit/kitLayout";
import { assertBlocks, assertInside } from "./layoutAssertions";
import { CAPABILITY_MONTAGE, capabilityIntroLayout } from "./capabilityFilmLayout";

const FORMATS = ["landscape", "portrait"] as const;
const LANGUAGES = ["es", "en"] as const;

/** Medida real de un JPEG (marcador SOF0/SOF2). */
function jpegSize(path: string) {
  const data = readFileSync(path);
  let offset = 2;
  while (offset < data.length) {
    const marker = data[offset + 1];
    const length = data.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc2) return { h: data.readUInt16BE(offset + 5), w: data.readUInt16BE(offset + 7) };
    offset += 2 + length;
  }
  throw new Error(`${path}: sin marcador de tamaño`);
}

test("films por capacidad: datos", async (t) => {
  await t.test("un film por familia, de 20 a 30 s, con la firma al final", () => {
    for (const family of FAMILIES) {
      const seconds = capabilityDuration(family.id) / FILM_FPS;
      assert.ok(seconds >= 20 && seconds <= 30, `${family.id}: ${seconds} s`);
      const film = capabilityFilm(family.id, "es");
      assert.equal(film.timeline.signature.from + film.timeline.signature.duration, film.durationInFrames, `${family.id}: la firma no cierra el film`);
    }
  });

  await t.test("capítulos contiguos que suman la duración", () => {
    for (const family of FAMILIES) {
      const chapters = capabilityChapters(family.id);
      let from = 0;
      for (const chapter of chapters) {
        assert.equal(chapter.from, from, `${family.id}: ${chapter.id} no es contiguo`);
        assert.ok(chapter.label.es && chapter.label.en && chapter.caption.es && chapter.caption.en, `${family.id}: ${chapter.id} sin texto bilingüe`);
        from += chapter.durationInFrames;
      }
      assert.equal(from, capabilityDuration(family.id), `${family.id}: los capítulos no suman la duración`);
      assert.equal(chapters.length, 1 + Math.min(CAPABILITY_FILM_CASES, CAPABILITY_CASES[family.id].length));
    }
  });

  await t.test("cada frase nombra su caso y cada cuadro existe con su medida", () => {
    for (const family of FAMILIES) {
      for (const language of LANGUAGES) {
        const film = capabilityFilm(family.id, language);
        const plates = film.cases.map((item) => item.asset.src);
        assert.equal(new Set(plates).size, plates.length, `${family.id}: cuadros repetidos`);
        for (const item of film.cases) {
          assert.ok(item.name && item.text, `${family.id}: "${item.text}" no dice de qué caso es`);
          const file = join(process.cwd(), "public", item.asset.src);
          assert.ok(existsSync(file), `${item.asset.src} no existe`);
          assert.deepEqual(jpegSize(file), { w: item.asset.w, h: item.asset.h }, `${item.asset.src}: medida distinta a la declarada`);
        }
        assertHonestCopy([film.intro.title, film.intro.blurb, ...film.cases.map((item) => item.text)]);
      }
    }
    assert.deepEqual(splitCaseLine("Fénix: reserva en 3 pasos."), { name: "Fénix", text: "Reserva en 3 pasos." });
  });
});

test("films por capacidad: geometría", async (t) => {
  for (const format of FORMATS) {
    for (const language of LANGUAGES) {
      for (const family of FAMILIES) {
        await t.test(`${family.id} ${format}/${language}`, () => {
          const film = capabilityFilm(family.id, language);
          const name = `${family.id} ${format}/${language}`;
          const safe = safeArea(format);
          // Apertura: todo dentro, nada se pisa, y la órbita queda fuera del texto.
          const intro = capabilityIntroLayout(format, film.intro);
          assertBlocks(intro.blocks, safe, format, `${name} apertura`);
          assert.equal(intro.chips.length, film.intro.tools.length, `${name}: herramientas que no entran`);
          for (const chip of intro.chips) {
            assertInside(chip.label.box, chip.box, `${name} ${chip.label.text}`);
            assert.ok(!overlaps(chip.box, intro.orbit), `${name}: ${chip.label.text} pisa la órbita`);
          }
          // Montaje: cada frase entra en sus líneas junto a su placa.
          const montage = plateManifestoLayout(format, film.cases[0].asset, undefined, undefined, CAPABILITY_MONTAGE.ratio);
          assertInside(montage.plate.plate, safe, `${name} placa`);
          assert.ok(!overlaps(montage.plate.plate, montage.text), `${name}: la placa pisa el texto`);
          const beats = film.cases.map((item) => ({ kicker: item.name, text: item.text }));
          const layout = manifestoBeatsLayout(montage.text, { beats, maxLines: CAPABILITY_MONTAGE.maxLines, maxSize: CAPABILITY_MONTAGE.maxSize[format], uniformSize: true }, format);
          layout.beats.forEach((beat, index) => {
            const lines = lineCount(beats[index].text, beat.size, beat.text.w, GLYPH_EM.display, 99);
            assert.ok(lines <= beat.lines, `${name}: "${beats[index].text}" no entra en ${beat.lines} líneas a ${beat.size}px`);
            assertInside(beat.text, montage.text, `${name}: frase ${index + 1}`);
          });
        });
      }
    }
  }
});
