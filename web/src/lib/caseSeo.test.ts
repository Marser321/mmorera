import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { FILM_FPS } from "@/data/films/filmTypes";
import { FLAGSHIP_FILMS } from "@/data/films/flagships";
import { FLAGSHIP_SECONDS, FLAGSHIP_SLUGS, FLAGSHIP_STILLS, STILL_SIZE, flagshipStill } from "@/data/films/flagships/slugs";
import { PROJECT_CASES } from "@/data/projectCases";
import { mediaSize } from "./mediaSize";
import { caseJsonLd, caseMetadata, caseShareImage, jsonLdHtml } from "./caseSeo";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

test("los cuadros fijos de cada film insignia caen dentro del film y miden lo declarado", () => {
  for (const slug of FLAGSHIP_SLUGS) {
    for (const kind of ["og", "hero"] as const) {
      assert.ok(FLAGSHIP_STILLS[slug][kind] < FLAGSHIP_FILMS[slug].durationInFrames, `${slug}: ${kind} fuera del film`);
      for (const language of ["es", "en"] as const) {
        const src = flagshipStill(slug, kind, language)!;
        assert.ok(existsSync(publicFile(src)), `${src} no existe: correr scripts/build-film-stills.ts`);
        const size = mediaSize(readFileSync(publicFile(src)), src);
        assert.deepEqual([size.width, size.height], [STILL_SIZE[kind].w, STILL_SIZE[kind].h], src);
      }
    }
  }
});

test("la duración de las tarjetas coincide con la de cada film", () => {
  for (const slug of FLAGSHIP_SLUGS) assert.equal(FLAGSHIP_SECONDS[slug] * FILM_FPS, FLAGSHIP_FILMS[slug].durationInFrames, slug);
});

test("cada caso se comparte con imagen propia, canónica y datos estructurados", () => {
  for (const project of PROJECT_CASES) {
    for (const language of ["es", "en"] as const) {
      const image = caseShareImage(project, language);
      assert.ok(existsSync(publicFile(image.url)), `${project.slug}: falta ${image.url}`);
      if (FLAGSHIP_SLUGS.includes(project.slug as never)) assert.match(image.url, new RegExp(`/films/${project.slug}/og-${language}\.jpg$`));

      const metadata = caseMetadata(project, language);
      const canonical = language === "es" ? `/casos-de-exito/${project.slug}` : `/en/casos-de-exito/${project.slug}`;
      assert.equal(metadata.alternates?.canonical, canonical);

      const jsonLd = caseJsonLd(project, language);
      const [work, breadcrumbs] = jsonLd["@graph"];
      assert.equal(work.url, `https://mmorera.agency${canonical}`);
      assert.equal(breadcrumbs.itemListElement.length, 3);
      assert.ok(!jsonLdHtml(jsonLd).includes("<"), "el JSON-LD no puede cerrar la etiqueta script");
    }
  }
});

test("el JSON-LD escapa lo que cerraría la etiqueta script", () => {
  const html = jsonLdHtml({ text: "</script><b>" });
  assert.ok(!html.includes("<"));
  assert.deepEqual(JSON.parse(html), { text: "</script><b>" });
});
