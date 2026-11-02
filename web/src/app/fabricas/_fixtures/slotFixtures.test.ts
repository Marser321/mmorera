import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BriefToPiece } from "@/components/premium/fabricas/BriefToPiece";
import { VideoGallery } from "@/components/premium/fabricas/VideoGallery";
import { BRIEF_TO_PIECE_FIXTURES, VIDEO_GALLERY_FIXTURES } from "./slotFixtures";

test("brief comparison exposes both pieces, five stages and localized controls before hydration", () => {
  for (const language of ["es", "en"] as const) {
    const html = renderToStaticMarkup(createElement(BriefToPiece, { pieces: BRIEF_TO_PIECE_FIXTURES, language, demo: true }));
    assert.equal((html.match(/role="tab"/g) ?? []).length, 7);
    assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 2);
    assert.match(html, /data-stage="brief"/);
    assert.match(html, /Demo/);
    assert.match(html, language === "es" ? /Revisión humana/ : /Human review/);
    assert.match(html, language === "es" ? /Persona/ : /Person/);
    assert.match(html, language === "es" ? /Siguiente/ : /Next/);
  }
});

test("gallery renders posters and request buttons without mounting or preloading any video", () => {
  for (const language of ["es", "en"] as const) {
    const html = renderToStaticMarkup(createElement(VideoGallery, { videos: VIDEO_GALLERY_FIXTURES, language, demo: true }));
    assert.doesNotMatch(html, /<video|<source|author-film-mobile\.mp4/);
    assert.equal((html.match(/<img /g) ?? []).length, 2);
    assert.equal((html.match(/<button /g) ?? []).length, 2);
    assert.match(html, language === "es" ? /Ver el video · 0:14/ : /Watch the video · 0:14/);
    assert.match(html, /Demo/);
  }
});

test("optional interactive blocks disappear when their real data is empty", () => {
  assert.equal(renderToStaticMarkup(createElement(BriefToPiece, { pieces: [], language: "es" })), "");
  assert.equal(renderToStaticMarkup(createElement(VideoGallery, { videos: [], language: "en" })), "");
});
