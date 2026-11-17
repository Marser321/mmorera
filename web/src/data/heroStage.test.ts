import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { getFilmOfDoor } from "./doorFilms";
import { HERO_STAGE_CLIP_MS, HERO_STAGE_MS, HERO_STAGE_PAIRS } from "./heroStage";
import { getProjectCase } from "./projectCases";
import { SERVICE_SOLUTIONS } from "./solutionsData";
import { TECH_STACK } from "./techStack";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("escenario del hero: cada tecnología y en qué se convierte", () => {
  it("hay entre cuatro y cinco pares, sin repetir tecnología ni servicio", () => {
    assert.ok(HERO_STAGE_PAIRS.length >= 4 && HERO_STAGE_PAIRS.length <= 5);
    assert.equal(new Set(HERO_STAGE_PAIRS.map((pair) => pair.tech)).size, HERO_STAGE_PAIRS.length);
    assert.equal(new Set(HERO_STAGE_PAIRS.map((pair) => pair.serviceId)).size, HERO_STAGE_PAIRS.length);
    assert.equal(new Set(HERO_STAGE_PAIRS.map((pair) => pair.id)).size, HERO_STAGE_PAIRS.length);
  });

  it("cada tecnología tiene logo para las partículas y cada servicio está en la lista del home", () => {
    for (const pair of HERO_STAGE_PAIRS) {
      assert.ok(TECH_STACK.some((tech) => tech.name === pair.tech), `${pair.id}: «${pair.tech}» no está en TECH_STACK, las partículas no pueden dibujarla`);
      assert.ok(SERVICE_SOLUTIONS.some((service) => service.id === pair.serviceId), `${pair.id}: el servicio ${pair.serviceId} no está en el home`);
    }
  });

  it("cada par dice en los dos idiomas en qué se convierte y qué se ve", () => {
    for (const pair of HERO_STAGE_PAIRS) {
      for (const language of ["es", "en"] as const) {
        assert.ok(pair.becomes[language].length > 4, `${pair.id}: falta en qué se convierte (${language})`);
        assert.ok(pair.source[language].length > 4, `${pair.id}: falta el rótulo de lo que se ve (${language})`);
      }
    }
  });

  it("los clips y sus pósters existen en los dos idiomas", () => {
    for (const pair of HERO_STAGE_PAIRS) {
      for (const language of ["es", "en"] as const) {
        const reel = pair.reel[language];
        for (const src of [reel.mp4, reel.webm, reel.poster]) assert.ok(existsSync(publicFile(src)), `${pair.id}: falta ${src}`);
      }
    }
  });

  it("el rótulo lleva a una página que existe", () => {
    for (const pair of HERO_STAGE_PAIRS) {
      const slug = pair.href.match(/^\/casos-de-exito\/(.+)$/)?.[1];
      if (slug) assert.ok(getProjectCase(slug), `${pair.id}: no existe el caso ${slug}`);
      else assert.match(pair.href, /^\/(fabricas|agentes|sistemas|estudio|campanas)$/, `${pair.id}: ${pair.href} no es una página de servicio`);
    }
  });

  it("no repite los films de las puertas de Servicios, que están justo debajo", () => {
    const doorFiles = new Set((["webs", "agentes", "sistemas", "contenido"] as const).flatMap((door) => (["es", "en"] as const).flatMap((language) => { const film = getFilmOfDoor(door, language); return [film.mp4, film.webm]; })));
    for (const pair of HERO_STAGE_PAIRS) {
      for (const language of ["es", "en"] as const) assert.ok(!doorFiles.has(pair.reel[language].mp4) && !doorFiles.has(pair.reel[language].webm), `${pair.id}: usa el film de una puerta`);
    }
  });

  it("el logo se ve lo suficiente y la ventana dura menos que su clip", () => {
    assert.ok(HERO_STAGE_MS.logo >= 3000, "con menos de tres segundos el logo no llega a leerse");
    assert.ok(HERO_STAGE_MS.film >= 5000 && HERO_STAGE_MS.film <= 7000, "los clips duran seis segundos");
  });

  it("el film no llega a dar la vuelta antes de que cambie el par", () => {
    // Arranca cuando la ventana aparece y se sigue viendo mientras se va (300 ms).
    assert.ok(HERO_STAGE_MS.reveal >= 400 && HERO_STAGE_MS.reveal <= 1100, "la ventana tiene que esperar al marco sin quedarse atrás");
    assert.ok(HERO_STAGE_MS.film - HERO_STAGE_MS.reveal + 300 <= HERO_STAGE_CLIP_MS, "el clip se reiniciaría a la vista");
  });
});
