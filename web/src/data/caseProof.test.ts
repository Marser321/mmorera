import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { visibleMetric } from "@/components/premium/CaseProofCard";
import { caseJsonLd, caseMetadata } from "@/lib/caseSeo";
import { CAPABILITY_CASES } from "./capabilityCases";
import { PROJECT_CASES } from "./projectCases";
import { SERVICE_PAGES } from "./servicePages";
import { SERVICE_SOLUTIONS } from "./solutionsData";
import { USE_CASE_FILMS } from "./films/systemsFilms";

// Confirmado por Mario el 16/11: pasaron por AD Media Fenix, Truckers y L&B. New Brothers es suyo.
const SOLD_VIA_AD_MEDIA = ["fenix-medical-center", "lb-elite-wash-detail", "truckers-choice"];
const WITH_PROOF = ["fenix-medical-center", "lb-elite-wash-detail", "new-brothers-barberia", "truckers-choice"];
const AD_MEDIA = /AD\s*Media/i;

describe("ficha de prueba de los casos", () => {
  it("los casos destacados del plan tienen ficha con problema, presente y número", () => {
    for (const slug of WITH_PROOF) {
      const project = PROJECT_CASES.find((item) => item.slug === slug);
      assert.ok(project?.proof, `${slug} no tiene ficha`);
      for (const language of ["es", "en"] as const) {
        assert.ok(project.proof.problem[language].trim(), `${slug}: falta el problema en ${language}`);
        assert.ok(project.proof.now[language].trim(), `${slug}: falta lo que hace hoy en ${language}`);
        assert.ok(project.proof.metric.label[language].trim(), `${slug}: falta la etiqueta del número en ${language}`);
      }
    }
  });

  it("un número sin verificar no se publica", () => {
    const proof = PROJECT_CASES.find((item) => item.proof)!.proof!;
    assert.equal(visibleMetric({ ...proof, metric: { ...proof.metric, verified: false } }), null);
    assert.deepEqual(visibleMetric({ ...proof, metric: { ...proof.metric, verified: true } }), { ...proof.metric, verified: true });
  });

  it("la ficha no promete resultados de negocio en porcentajes ni montos", () => {
    for (const project of PROJECT_CASES) {
      if (!project.proof) continue;
      const text = JSON.stringify(project.proof);
      assert.doesNotMatch(text, /%|\$|USD|€/, `${project.slug}: la ficha tiene un porcentaje o un monto`);
    }
  });
});

describe("atribución discreta a AD Media", () => {
  it("marca exactamente los casos que vendió AD Media", () => {
    const marked = PROJECT_CASES.filter((item) => item.soldVia === "ad-media").map((item) => item.slug).sort();
    assert.deepEqual(marked, [...SOLD_VIA_AD_MEDIA].sort());
  });

  it("AD Media no figura en títulos, resúmenes, fichas ni metadatos de otros casos", () => {
    for (const project of PROJECT_CASES) {
      if (project.slug === "ad-media-solution") continue;
      for (const language of ["es", "en"] as const) {
        assert.doesNotMatch(project.title[language], AD_MEDIA, `${project.slug}: título`);
        assert.doesNotMatch(project.summary[language], AD_MEDIA, `${project.slug}: resumen`);
        assert.doesNotMatch(JSON.stringify(caseMetadata(project, language)), AD_MEDIA, `${project.slug}: metadatos`);
        assert.doesNotMatch(JSON.stringify(caseJsonLd(project, language)), AD_MEDIA, `${project.slug}: JSON-LD`);
      }
      if (project.proof) assert.doesNotMatch(JSON.stringify(project.proof), AD_MEDIA, `${project.slug}: ficha`);
    }
  });

  it("AD Media no se usa como prueba de venta", () => {
    const capabilitySlugs = Object.values(CAPABILITY_CASES).flat().map((entry) => entry.slug);
    assert.ok(!capabilitySlugs.includes("ad-media-solution"), "sigue en las capacidades");
    for (const page of Object.values(SERVICE_PAGES)) {
      assert.ok(!JSON.stringify(page).includes("ad-media-solution"), "sigue en una página de servicio");
    }
    assert.ok(!SERVICE_SOLUTIONS.some((solution) => solution.proofSlug === "ad-media-solution"), "sigue como prueba de una solución");
    for (const film of USE_CASE_FILMS) {
      assert.ok(!film.seenIn?.some((item) => item.slug === "ad-media-solution"), `${film.id}: sigue en «visto en»`);
    }
  });
});
