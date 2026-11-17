import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServicePage } from "@/components/service/ServicePage";
import { getDoorFilm } from "./doorFilms";
import { getProjectCase } from "./projectCases";
import { SERVICE_HERO_PAGES, getServiceHeroFilm } from "./serviceHeroFilms";
import { SERVICE_PAGES } from "./servicePages";
import { SERVICE_SOLUTIONS } from "./solutionsData";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("film de la portada de cada servicio", () => {
  it("cada página de servicio con puerta en el home abre con un film que existe", () => {
    for (const page of SERVICE_HERO_PAGES) {
      for (const language of ["es", "en"] as const) {
        const film = getServiceHeroFilm(page, language);
        assert.ok(film, `${page} no tiene film de portada`);
        for (const src of [film.reel.mp4, film.reel.webm, film.reel.poster]) assert.ok(existsSync(publicFile(src)), `${page}: falta ${src}`);
        assert.ok(existsSync(publicFile(film.backdrop)), `${page}: falta ${film.backdrop}: correr scripts/build-film-backdrops.ts`);
        assert.ok(film.caption.es && film.caption.en, `${page}: el pie no tiene sus dos idiomas`);
        if (film.caseSlug) assert.ok(getProjectCase(film.caseSlug), `${page} lleva a un caso inexistente: ${film.caseSlug}`);
      }
    }
  });

  it("cada página lleva el film y el color de su puerta", () => {
    // La ruta de cada servicio del home es una página con film: quien entra por la puerta encuentra el mismo color.
    for (const service of SERVICE_SOLUTIONS) {
      const page = service.path.slice(1);
      assert.ok((SERVICE_HERO_PAGES as readonly string[]).includes(page), `${service.path} no tiene film de portada`);
      const hero = getServiceHeroFilm(page as (typeof SERVICE_HERO_PAGES)[number], "es");
      const door = getDoorFilm(service.id, "es");
      assert.equal(hero?.tone, door?.tone, `${page}: el color no es el de su puerta`);
      // La de contenido abre con el tráiler de Vespera; las demás, con el film de su puerta.
      if (page === "fabricas") assert.equal(hero?.reel.webm, getProjectCase("vespera")?.trailer?.webm);
      else assert.equal(hero?.reel.webm, door?.webm);
    }
  });

  it("la plantilla muestra el film, con su pie y el enlace al caso", () => {
    const html = renderToStaticMarkup(createElement(ServicePage, { content: SERVICE_PAGES.estudio, language: "es", heroFilm: getServiceHeroFilm("estudio", "es") }));
    assert.match(html, /data-service-hero-film/);
    assert.match(html, /Caso real · L&amp;B Elite Wash &amp; Detail/);
    assert.match(html, /href="\/casos-de-exito\/lb-elite-wash-detail"/);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
    // El color del servicio tiñe la página y «Cómo trabajamos» pasa a ser una escena de cine con el fondo del film.
    assert.match(html, /data-service-tone="#3F8CFF"/);
    assert.match(html, /--tono:\s*#3F8CFF/);
    assert.match(html, /data-service-scene/);
    assert.match(html, /\/portfolio\/backdrops\/webs-poster-blur\.jpg/);
    // Sin film, la plantilla queda como antes: sin color propio ni escena.
    const plain = renderToStaticMarkup(createElement(ServicePage, { content: SERVICE_PAGES.estudio, language: "es" }));
    assert.doesNotMatch(plain, /data-service-scene|--tono/);
    assert.match(plain, /data-service-section="hiring"/);
    // La de agentes muestra la demo guiada: el pie no enlaza a ningún caso.
    const agentes = renderToStaticMarkup(createElement(ServicePage, { content: { hero: SERVICE_PAGES.agentes.hero }, language: "en", heroFilm: getServiceHeroFilm("agentes", "en") }));
    assert.match(agentes, /Guided demo · sample data/);
    assert.doesNotMatch(agentes, /casos-de-exito/);
  });
});
