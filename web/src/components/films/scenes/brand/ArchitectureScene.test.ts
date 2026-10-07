import test from "node:test";
import assert from "node:assert/strict";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { ARCHITECTURE_LOADERS } from "@/data/architecture/registry";
import {
  boundaryTitles,
  cardTextSizes,
  CARD_INSET_X,
  tagWidth,
  textWidth,
  visibleTag,
} from "@/data/architecture/diagramModel";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import { safeArea, type Box } from "@/lib/filmLayout";
import { unionBox } from "@/data/architecture/archify";

test("ArchitectureScene: ajuste de etiquetas, títulos y encuadre por marca, orientación e idioma", async (t) => {
  for (const [slug, load] of Object.entries(ARCHITECTURE_LOADERS)) {
    const bundle = await load();
    const brand = CASE_BRANDS[slug];
    assert.ok(brand, `Marca ${slug} no existe en CASE_BRANDS`);

    for (const orientation of ["landscape", "portrait"] as const) {
      for (const language of ["es", "en"] as const) {
        const label = `${slug} ${orientation} ${language}`;
        const { diagram, layout } = resolveArchitecture(bundle, language, orientation);

        await t.test(`${label}: ninguna etiqueta de componente se corta con la tipografía de la marca`, () => {
          for (const component of diagram.components) {
            const box = layout.components.find((c) => c.id === component.id);
            assert.ok(box, `Caja ${component.id} no existe en layout`);
            const tag = visibleTag(diagram, component);
            const { labelSize, subSize } = cardTextSizes(component, tag, box.w, brand.fonts);
            const inner = box.w - CARD_INSET_X;
            const room = inner - (tag ? tagWidth(tag, brand.fonts) : 0);

            const labelW = textWidth(component.label, brand.fonts.display, labelSize);
            assert.ok(
              labelW <= room,
              `Etiqueta "${component.label}" (${labelW.toFixed(1)}px) no entra en ${room.toFixed(1)}px en ${component.id}`,
            );

            if (component.sublabel) {
              const subW = textWidth(component.sublabel, brand.fonts.body, subSize);
              assert.ok(
                subW <= inner,
                `Subetiqueta "${component.sublabel}" (${subW.toFixed(1)}px) no entra en ${inner.toFixed(1)}px en ${component.id}`,
              );
            }
          }
        });

        await t.test(`${label}: títulos de grupo calculados por boundaryTitles`, () => {
          const titles = boundaryTitles(layout);
          assert.equal(titles.length, layout.boundaries.length);
          for (const title of titles) {
            assert.equal(title.fallback, false, `Título "${title.label}" cayó en fallback`);
            const boundary = layout.boundaries[title.index];
            assert.ok(
              title.x >= boundary.x && title.x + title.w <= boundary.x + boundary.w,
              `Título "${title.label}" sale del grupo`,
            );
          }
        });

        await t.test(`${label}: en cada vista guiada, los nodos en foco quedan dentro del encuadre y no cortan el borde`, () => {
          const safe = safeArea(orientation);
          const area: Box = orientation === "portrait"
            ? { x: safe.x, y: 296, w: safe.w, h: 760 }
            : { x: safe.x, y: 176, w: safe.w, h: 536 };

          const boxOf = new Map(layout.components.map((c) => [c.id, c]));
          const full: Box = { x: 0, y: 0, w: layout.viewBox[0], h: layout.viewBox[1] };
          const frameFor = (box: Box, margin: number, maxScale = Infinity) => {
            const scale = Math.min((area.w - margin * 2) / box.w, (area.h - margin * 2) / box.h, maxScale);
            return { scale, x: area.w / 2 - (box.x + box.w / 2) * scale, y: area.h / 2 - (box.y + box.h / 2) * scale };
          };
          const wide = frameFor(full, 10);
          const maxZoom = orientation === "portrait" ? 2.2 : 1.6;

          for (const view of diagram.meta.views ?? []) {
            const boxes = view.focus.map((id) => boxOf.get(id)).filter((b): b is NonNullable<typeof b> => Boolean(b));
            assert.ok(boxes.length > 0, `Vista ${view.id} no tiene componentes`);
            const target = frameFor(unionBox(boxes, 50), 24, wide.scale * maxZoom);

            for (const box of boxes) {
              const x1 = target.x + box.x * target.scale;
              const y1 = target.y + box.y * target.scale;
              const x2 = x1 + box.w * target.scale;
              const y2 = y1 + box.h * target.scale;
              assert.ok(
                x1 >= 6 && y1 >= 6 && x2 <= area.w - 6 && y2 <= area.h - 6,
                `Nodo en foco ${box.id} de vista ${view.id} corta o sale del área segura ([${x1.toFixed(1)}, ${y1.toFixed(1)}, ${x2.toFixed(1)}, ${y2.toFixed(1)}] en ${area.w}x${area.h})`,
              );
            }
          }
        });
      }
    }
  }
});
