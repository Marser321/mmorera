import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServicePage } from "./ServicePage";
import type { ServicePageContent } from "@/types/servicePage";

const t = (key: string) => ({ es: `TODO(Claude): ${key} ES`, en: `TODO(Claude): ${key} EN` });
const example: ServicePageContent = {
  hero: { eyebrow: t("eyebrow"), title: t("hero"), body: t("body"), cta: { label: t("cta") } },
  audience: { title: t("audience"), for: t("for"), notFor: t("notFor") },
  tools: t("tools"), howItWorks: { title: t("how") },
  proof: { title: t("proof"), slugs: ["new-brothers-barberia"] },
  hiring: { title: t("hiring"), steps: ["one", "two", "three"].map(key => ({ title: t(key), body: t(`${key}-body`) })), price: t("price") },
  closing: { title: t("closing"), cta: { label: t("close") } },
};

const render = (content: ServicePageContent, language: "es" | "en" = "es") => renderToStaticMarkup(createElement(ServicePage, { content, language, howItWorks: content.howItWorks ? createElement("p", null, "SLOT") : undefined }));

describe("service page template", () => {
  test("renders only the hero when optional data is absent", () => {
    const html = render({ hero: { title: t("minimal") } });
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
    assert.doesNotMatch(html, /<section|<a |<h2/);
  });
  test("keeps the seven sections in order, a single H1 and the interactive slot", () => {
    const html = render(example);
    assert.deepEqual([...html.matchAll(/data-service-section="(.*?)"/g)].map(match => match[1]), ["hero", "audience", "tools", "how", "proof", "hiring", "closing"]);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
    assert.equal((html.match(/<h2[ >]/g) ?? []).length, 5);
    assert.match(html, /SLOT/);
    assert.match(html, /Demo/);
    assert.match(html, /noopener noreferrer/);
    assert.match(html, /aria-describedby="service-new-brothers-barberia-0-notice"/);
  });
  test("resolves copy and CTA destinations for each language", () => {
    for (const language of ["es", "en"] as const) {
      const html = render(example, language);
      assert.match(html, new RegExp(`hero ${language.toUpperCase()}`));
      assert.match(html, new RegExp(`href="${language === "es" ? "" : "/en"}/aplicar"`));
      assert.doesNotMatch(html, new RegExp(`hero ${language === "es" ? "EN" : "ES"}`));
    }
  });
  test("omits empty proof, hiring and closing sections", () => {
    const html = render({ hero: example.hero, proof: { slugs: ["missing-case"] }, hiring: { steps: [] }, closing: {} });
    assert.doesNotMatch(html, /data-service-section="(?:proof|hiring|closing)"/);
  });
});
