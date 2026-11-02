import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ABOUT_MANIFESTO,
  ABOUT_PAGE,
  CAPABILITIES_PAGE,
  CAPABILITY_SERVICE,
  CAPABILITY_SLUGS,
  EXPLORE_DOORS,
  LAB_PAGE,
  LAB_SLUGS,
  USE_CASES_PAGE,
  USE_CASE_SERVICE,
  USE_CASE_SLUGS,
  familyFromSlug,
  findUseCaseBySlug,
} from "./branchPages";
import { SKILL_ORBIT } from "./skillOrbit";
import { USE_CASE_FILMS } from "./films/systemsFilms";
import { SERVICE_PAGES } from "./servicePages";
import { AGENT_DEMO_SCRIPT } from "./agentDemoScript";

const SERVICE_ROUTES = new Set(Object.keys(SERVICE_PAGES).map((key) => `/${key}`));
// Voz de marca: español neutro con tuteo, nunca voseo.
const VOSEO = /\b(quer|ten|pod|sab|hac)és\b|\b(prefer|ven|escrib|viv)ís\b|\b(necesit|mir|cont|escuch)ás\b|\b(decime|contame|escribime|avisame|fijate)\b/i;

describe("ramas del sitio", () => {
  it("cada familia de la órbita tiene un slug único que vuelve a ella y un servicio que existe", () => {
    const slugs = Object.values(CAPABILITY_SLUGS);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const node of SKILL_ORBIT) {
      const slug = CAPABILITY_SLUGS[node.id];
      assert.ok(slug, `${node.id} no tiene slug`);
      assert.equal(familyFromSlug(slug), node.id);
      assert.ok(SERVICE_ROUTES.has(CAPABILITY_SERVICE[node.id].path), `${node.id} lleva a un servicio inexistente`);
    }
  });

  it("cada film de caso de uso tiene slug y servicio, y no sobra ninguno", () => {
    assert.deepEqual(Object.keys(USE_CASE_SLUGS).sort(), USE_CASE_FILMS.map((film) => film.id).sort());
    for (const film of USE_CASE_FILMS) {
      assert.equal(findUseCaseBySlug(USE_CASE_SLUGS[film.id]), film.id);
      assert.ok(SERVICE_ROUTES.has(USE_CASE_SERVICE[film.id].path), `${film.id} lleva a un servicio inexistente`);
    }
    assert.equal(findUseCaseBySlug("no-existe"), undefined);
  });

  it("los textos de las ramas y de la demo del agente tienen sus dos idiomas y hablan de tú", () => {
    const texts = JSON.stringify({ CAPABILITIES_PAGE, USE_CASES_PAGE, LAB_PAGE, ABOUT_PAGE, ABOUT_MANIFESTO, EXPLORE_DOORS, AGENT_DEMO_SCRIPT, CAPABILITY_SERVICE, USE_CASE_SERVICE });
    assert.doesNotMatch(texts, /"es":""|"en":""/);
    assert.doesNotMatch(texts, VOSEO);
  });

  it("la demo del agente se rotula como demo y muestra tanto respuestas como el traspaso a una persona", () => {
    assert.match(AGENT_DEMO_SCRIPT.disclaimer.es, /demo/i);
    assert.match(AGENT_DEMO_SCRIPT.disclaimer.en, /demo/i);
    assert.ok(AGENT_DEMO_SCRIPT.options.some((option) => option.handoff));
    assert.ok(AGENT_DEMO_SCRIPT.options.some((option) => !option.handoff));
  });

  it("las puertas llevan a las ramas y cada demo del Lab tiene su slug", () => {
    for (const door of Object.values(EXPLORE_DOORS.doors)) assert.match(door.path, /^\/(capacidades|casos-de-uso|lab)$/);
    assert.deepEqual(Object.keys(LAB_SLUGS).sort(), Object.keys(LAB_PAGE.demos).sort());
  });
});
