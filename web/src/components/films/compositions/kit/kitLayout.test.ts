import test from "node:test";
import assert from "node:assert/strict";
import { inside, overlaps, safeArea, type FilmFormatName } from "@/lib/filmLayout";
import { GLYPH_EM, LINE_HEIGHT, lineCount } from "../../scenes/brand/layout/mediaShared";
import { assertBlocks, assertInside } from "../layoutAssertions";
import { factsLayout, kitBands, KIT_TITLE, plateManifestoLayout, plateOpeningLayout, shotsLayout, siteStopFrames, siteTourLayout, titleHeight } from "./kitLayout";

const FORMATS: FilmFormatName[] = ["landscape", "portrait"];

/** Medios típicos: foto apaisada, video vertical y logo horizontal. */
const WIDE = { w: 2048, h: 682 };
const VERTICAL = { w: 1080, h: 1920 };
const WORDMARK = { w: 900, h: 107 };

test("kitLayout: el título de escena entra en su banda", () => {
  for (const format of FORMATS) {
    const { title } = kitBands(format);
    const { size, lines } = KIT_TITLE[format];
    assert.ok(titleHeight(size, lines) <= title.h, `${format}: el título no entra`);
  }
});

test("kitLayout: aperturas en banda y en columna, con y sin logotipo", async (t) => {
  const cases = [
    { name: "banda", spec: { asset: WIDE, wordmark: WORDMARK } },
    { name: "columna", spec: { asset: VERTICAL, orientation: "column" as const, markAspect: 1 } },
    { name: "isotipo ubicado", spec: { asset: { w: 1684, h: 950 }, mark: { cx: 0.5, cy: 0.47, w: 0.32 }, markAspect: 1.86 } },
  ];
  for (const format of FORMATS) {
    const safe = safeArea(format);
    for (const item of cases) {
      await t.test(`${format}: ${item.name}`, () => {
        const tagline = "Arte en la piel, *con agenda propia.*";
        const kicker = "Estudio de tatuajes · Miami";
        const layout = plateOpeningLayout(format, item.spec, tagline, kicker);
        for (const [label, box] of Object.entries({ plate: layout.plate, kicker: layout.kicker, tagline: layout.tagline, text: layout.text })) assertInside(box, safe, `${format} ${item.name} ${label}`);
        if (layout.wordmark) {
          assertInside(layout.wordmark, safe, `${format} logotipo`);
          assert.ok(layout.wordmark.y + layout.wordmark.h <= layout.kicker.y, "el logotipo pisa el rótulo");
        }
        assert.ok(layout.kicker.y + layout.kicker.h <= layout.tagline.y, "el rótulo pisa la tagline");
        assert.ok(!overlaps(layout.plate, layout.tagline), "la placa pisa la tagline");
        assert.ok(lineCount(tagline, layout.taglineSize, layout.tagline.w, GLYPH_EM.display) * layout.taglineSize * LINE_HEIGHT.display <= layout.tagline.h + 0.5, "la tagline no entra");
        assert.ok(lineCount(kicker, layout.kickerSize, layout.kicker.w, GLYPH_EM.label(0.24)) <= 1, "el rótulo no entra en una línea");
        assert.ok(layout.plate.w <= item.spec.asset.w + 0.5, "la placa amplía el medio");
        // El isotipo entra en la placa.
        const aspect = item.spec.markAspect ?? 1;
        const w = layout.logoSize * 0.96 * (aspect >= 1 ? 1 : aspect);
        const h = layout.logoSize * 0.96 * (aspect >= 1 ? 1 / aspect : 1);
        assert.ok(inside({ x: layout.logoCenter.x - w / 2, y: layout.logoCenter.y - h / 2, w, h }, layout.plate), `${format} ${item.name}: el isotipo sale de la placa`);
      });
    }
  }
});

test("kitLayout: placa con manifiesto, recorrido, capturas y cifras", async (t) => {
  for (const format of FORMATS) {
    const safe = safeArea(format);
    await t.test(`${format}: placa con manifiesto`, () => {
      const layout = plateManifestoLayout(format, VERTICAL, { kicker: "Artistas residentes", text: "Seis agendas propias" });
      assertInside(layout.plate.plate, safe, "placa");
      assertInside(layout.text, safe, "beats");
      assert.ok(!overlaps(layout.plateBox, layout.text), "la placa pisa los beats");
      assert.ok(layout.plate.caption, "la leyenda de la placa");
    });
    await t.test(`${format}: recorrido del sitio`, () => {
      const layout = siteTourLayout(format, ["Portafolio por artista", "Estilos con su foto", "Agenda en 8 pasos", "Consentimiento digital"]);
      assertInside(layout.reel, safe, "navegador");
      assert.ok(!overlaps(layout.reel, layout.listArea), "el navegador pisa la lista");
      assertBlocks(layout.blocks, layout.listArea, format, `${format} lista`);
      const frames = siteStopFrames(300, 4);
      for (let index = 1; index < frames.length; index++) assert.ok(frames[index] > frames[index - 1]);
    });
    await t.test(`${format}: capturas con nota`, () => {
      const layout = shotsLayout(format, "Datos de ejemplo · el sitio corre en local, sin tocar el CRM");
      assertInside(layout.main, safe, "ventana");
      assert.ok(layout.note);
      assertBlocks([layout.note!], safe, format, `${format} nota`);
      assert.ok(!overlaps(layout.main, layout.note!.box), "la ventana pisa la nota");
    });
    await t.test(`${format}: cifras con créditos`, () => {
      const layout = factsLayout(format, { text: "Agencia: AD Media Solution · Ingeniería de marca blanca: Mario Morera", logo: { w: 908, h: 416 } });
      assertInside(layout.facts, safe, "cifras");
      assert.ok(layout.creditBand && layout.credit && layout.logo);
      assertInside(layout.creditBand!, safe, "créditos");
      assertBlocks([{ kind: "media", id: "logo", box: layout.logo! }, layout.credit!], layout.creditBand!, format, `${format} créditos`);
    });
  }
});
