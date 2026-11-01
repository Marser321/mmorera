import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PROJECT_CASES } from "@/data/projectCases";
import { PAGINAS_SEO, PORTADAS_OG, portadaPath, type PaginaSeo } from "@/data/seo/paginas";
import { caseMetadata } from "./caseSeo";
import { mediaSize } from "./mediaSize";
import { listaCasosJsonLd, pageMetadata, personaJsonLd, recortarDescripcion } from "./seo";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);
const SUFIJO = " — Mario Morera";

test("cada página fija tiene título y descripción a medida del buscador", () => {
  for (const [pagina, data] of Object.entries(PAGINAS_SEO)) {
    for (const language of ["es", "en"] as const) {
      const titulo = data.title[language] + (data.tituloAbsoluto ? "" : SUFIJO);
      assert.ok(titulo.length <= 60, `${pagina}/${language}: título de ${titulo.length} caracteres`);
      const largo = data.description[language].length;
      assert.ok(largo >= 120 && largo <= 160, `${pagina}/${language}: descripción de ${largo} caracteres`);
    }
  }
});

test("cada página fija se comparte con su portada, su URL y su idioma", () => {
  for (const pagina of Object.keys(PAGINAS_SEO) as PaginaSeo[]) {
    for (const language of ["es", "en"] as const) {
      const meta = pageMetadata(pagina, language);
      const canonical = meta.alternates?.canonical;
      assert.equal(canonical, language === "es" ? PAGINAS_SEO[pagina].path : `/en${PAGINAS_SEO[pagina].path === "/" ? "" : PAGINAS_SEO[pagina].path}`);
      assert.deepEqual(Object.keys(meta.alternates?.languages ?? {}), ["es", "en", "x-default"]);
      const og = meta.openGraph as { url: string; locale: string; images: Array<{ url: string }> };
      assert.equal(og.url, canonical, `${pagina}/${language}: og:url distinto de la canónica`);
      assert.equal(og.locale, language === "es" ? "es_ES" : "en_US");
      assert.ok(existsSync(publicFile(og.images[0].url)), `${og.images[0].url} no existe: correr scripts/og-images.ts`);
    }
  }
});

test("las portadas miden 1200×630 y pesan lo que WhatsApp acepta", () => {
  for (const portada of Object.keys(PORTADAS_OG) as Array<keyof typeof PORTADAS_OG>) {
    for (const language of ["es", "en"] as const) {
      const src = portadaPath(portada, language);
      const buffer = readFileSync(publicFile(src));
      const size = mediaSize(buffer, src);
      assert.deepEqual([size.width, size.height], [1200, 630], src);
      assert.ok(buffer.length < 300 * 1024, `${src} pesa ${Math.round(buffer.length / 1024)} KB`);
    }
  }
});

test("las descripciones de los casos entran en el resultado de Google", () => {
  for (const project of PROJECT_CASES) {
    for (const language of ["es", "en"] as const) {
      const description = String(caseMetadata(project, language).description);
      assert.ok(description.length <= 160, `${project.slug}/${language}: ${description.length} caracteres`);
    }
  }
});

test("recortar una descripción corta en una palabra entera, sin coma colgando", () => {
  assert.equal(recortarDescripcion("corta"), "corta");
  const largo = "Uno, dos, tres, cuatro ".repeat(20);
  const corto = recortarDescripcion(largo, 40);
  assert.ok(corto.length <= 40);
  assert.ok(corto.endsWith("…"));
  assert.ok(!/[,\s]…$/.test(corto));
});

test("recortar prefiere terminar en una oración completa si ya dice bastante", () => {
  const oracion = `${"palabra ".repeat(15).trim()}.`; // 119 caracteres
  const texto = `${oracion} Segunda oración que ya no entra en el resultado del buscador porque es larga.`;
  assert.equal(recortarDescripcion(texto), oracion);
});

test("los datos estructurados no publican redes ni ubicación sin verificar", () => {
  const persona = personaJsonLd();
  assert.equal(persona["@type"], "Person");
  assert.ok(!("sameAs" in persona) && !("homeLocation" in persona) && !("address" in persona));
  const lista = listaCasosJsonLd(PROJECT_CASES.slice(0, 2), "en");
  assert.equal(lista.mainEntity.itemListElement[0].url, `https://mmorera.agency/en/casos-de-exito/${PROJECT_CASES[0].slug}`);
});
