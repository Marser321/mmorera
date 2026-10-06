import test from "node:test";
import assert from "node:assert/strict";
import { fitsLines, inside, overlaps, type FilmFormatName } from "@/lib/filmLayout";
import { MEDIA_ASSETS, MEDIA_URLS, mediaTestBoxes } from "./mediaSamples";
import { GLYPH_EM } from "./mediaShared";
import { scrollReelLayout } from "./scrollReel";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];
const CASES = [
  { name: "captura 16:9", asset: MEDIA_ASSETS.siteHbot, kind: "image" as const, url: MEDIA_URLS.fenix },
  { name: "captura larga", asset: { w: 1440, h: 5200 }, kind: "image" as const, url: MEDIA_URLS.fenix },
  { name: "reel", asset: MEDIA_ASSETS.adReel, kind: "video" as const, url: MEDIA_URLS.adMedia },
];

test("ScrollReel: navegador, barra y medio sin solapes ni ampliación", async (t) => {
  for (const format of FORMATS)
    for (const box of mediaTestBoxes(format))
      for (const item of CASES)
        for (const maxWidth of [undefined, 900]) {
          await t.test(`${format} · ${box.h}px · ${item.name} · ${maxWidth ?? "ancho libre"}`, () => {
            const layout = scrollReelLayout(box, { asset: item.asset, kind: item.kind, host: item.url.host, path: item.url.path, maxWidth }, format);
            assert.ok(inside(layout.frame, box), "el navegador sale de la caja");
            assert.ok(inside(layout.chrome, layout.frame) && inside(layout.view, layout.frame));
            assert.ok(!overlaps(layout.chrome, layout.view), "la barra pisa la vista");
            assert.ok(inside(layout.pill, layout.chrome) && inside(layout.url, layout.pill) && inside(layout.lock, layout.pill));
            assert.ok(!overlaps(layout.lock, layout.url), "el candado pisa la dirección");
            assert.ok(fitsLines(`${item.url.host}${item.url.path}`, layout.urlSize, layout.url.w, 1, GLYPH_EM.url), "la dirección no entra");

            // Nunca por encima de la resolución nativa y sin deformar.
            assert.ok(layout.media.w <= item.asset.w + 0.5, "medio ampliado");
            assert.ok(Math.abs(layout.media.w / layout.media.h - item.asset.w / item.asset.h) < 1e-6);
            assert.ok(Math.abs(layout.media.w - layout.view.w) < 0.5);
            if (maxWidth) assert.ok(layout.frame.w <= maxWidth + 0.5);
            if (item.kind === "video") {
              assert.equal(layout.scroll, 0);
              assert.ok(Math.abs(layout.view.h - layout.media.h) < 0.5, "el reel se recorta");
            } else assert.ok(Math.abs(layout.scroll - (layout.media.h - layout.view.h)) < 0.5 && layout.scroll >= 0);
          });
        }
});

test("ScrollReel: una captura larga se recorre y una corta no", () => {
  const box = mediaTestBoxes("landscape")[0];
  assert.ok(scrollReelLayout(box, { asset: { w: 1440, h: 5200 }, kind: "image", host: "a.com", path: "/" }, "landscape").scroll > 3000);
  assert.equal(scrollReelLayout(box, { asset: { w: 1200, h: 500 }, kind: "image", host: "a.com", path: "/" }, "landscape").scroll, 0);
});
