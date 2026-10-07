import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { edgeKey, type Box } from "@/data/architecture/archify";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { ARCHITECTURE_LOADERS } from "@/data/architecture/registry";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  boundaryTitles,
  buildArchitectureModel,
  CARD_INSET_X,
  DEFAULT_FONT_WIDTH,
  fitSize,
  fontWidth,
  LABEL_SIZES,
  SITE_FONTS,
  SUB_SIZES,
  tagWidth,
  textWidth,
  componentLinks,
  contrastRatio,
  diagramFrame,
  diagramSummary,
  explorerTheme,
  focusState,
  isDimmed,
  LANDSCAPE_MIN_WIDTH,
  mixHex,
  narrowAspect,
  orientationFor,
  SITE_PALETTE,
  THEME_KEYS,
  themeVars,
  viewsWith,
} from "./underTheHoodModel";

const overlaps = (a: Box, b: Box, gap = 0) => a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y < b.y + b.h + gap && b.y < a.y + a.h + gap;
const inside = (a: Box, b: Box) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
function segmentTouches(a: [number, number], b: [number, number], box: Box, gap = 0) {
  const [minX, maxX] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])];
  const [minY, maxY] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
  return minX < box.x + box.w + gap && maxX > box.x - gap && minY < box.y + box.h + gap && maxY > box.y - gap;
}

async function allVariants() {
  const variants = [];
  for (const [slug, load] of Object.entries(ARCHITECTURE_LOADERS)) {
    const bundle = await load();
    for (const orientation of ["landscape", "portrait"] as const) {
      for (const language of ["es", "en"] as const) {
        const { diagram, layout } = resolveArchitecture(bundle, language, orientation);
        const fonts = CASE_BRANDS[slug]?.fonts ?? SITE_FONTS;
        variants.push({ label: `${slug} ${orientation} ${language}`, slug, orientation, language, diagram, layout, fonts, model: buildArchitectureModel(diagram, layout, orientation, fonts) });
      }
    }
  }
  return variants;
}

test("Bajo el capó: geometría del póster y del explorador", async (t) => {
  for (const { label, diagram, layout, model, orientation } of await allVariants()) {
    await t.test(`${label}: el marco contiene todo lo dibujado, con margen`, () => {
      const frame = diagramFrame(layout);
      assert.deepEqual(model.frame, frame);
      const pad = { x: frame.x + 1, y: frame.y + 1, w: frame.w - 2, h: frame.h - 2 };
      for (const box of [...layout.components, ...layout.boundaries, ...model.plates]) assert.ok(inside(box, pad), `${JSON.stringify(box)} fuera del marco`);
      for (const connection of layout.connections) {
        for (const [x, y] of connection.points) assert.ok(inside({ x, y, w: 0, h: 0 }, pad), `${connection.from}→${connection.to} sale del marco`);
      }
    });

    await t.test(`${label}: cada rótulo de grupo cae dentro de su grupo, sin tocar cajas, placas, rutas ni otro rótulo`, () => {
      const titles = boundaryTitles(layout);
      assert.equal(titles.length, layout.boundaries.length);
      for (const title of titles) {
        assert.equal(title.fallback, false, `"${title.label}": no hay hueco libre en la banda superior`);
        assert.ok(inside(title, layout.boundaries[title.index]), `"${title.label}" se sale de su grupo`);
        for (const box of layout.components) assert.ok(!overlaps(title, box, 2), `"${title.label}" toca ${box.id}`);
        for (const plate of model.plates) assert.ok(!overlaps(title, plate, 2), `"${title.label}" toca la placa "${plate.text}"`);
        for (const other of titles) if (other !== title) assert.ok(!overlaps(title, other, 2), `"${title.label}" toca "${other.label}"`);
        for (const connection of layout.connections) {
          connection.points.slice(1).forEach((point, index) => {
            assert.ok(!segmentTouches(connection.points[index], point, title, 2), `la ruta ${connection.from}→${connection.to} cruza el rótulo "${title.label}"`);
          });
        }
      }
    });

    await t.test(`${label}: el modelo usa exactamente la geometría congelada`, () => {
      assert.equal(model.components.length, diagram.components.length);
      for (const spec of model.components) {
        const box = layout.components.find((item) => item.id === spec.id);
        assert.deepEqual([spec.x, spec.y, spec.w, spec.h], [box?.x, box?.y, box?.w, box?.h]);
      }
      assert.deepEqual(
        model.routes.map((route) => [route.id, route.points]),
        layout.connections.map((connection) => [edgeKey(connection.from, connection.to), connection.points]),
      );
      assert.equal(model.plates.length, layout.connections.filter((connection) => connection.label).length);
      // Orden de lectura (= orden de tabulación): columnas en apaisado, filas en vertical.
      const key = (spec: (typeof model.components)[number]) => (orientation === "landscape" ? [spec.x, spec.y] : [spec.y, spec.x]);
      model.components.slice(1).forEach((spec, index) => {
        const [a1, a2] = key(model.components[index]);
        const [b1, b2] = key(spec);
        assert.ok(a1 < b1 || (a1 === b1 && a2 <= b2), `${model.components[index].id} antes que ${spec.id}`);
      });
    });
  }
});

test("Bajo el capó: ningún título ni bajada de caja se corta", async (t) => {
  // Escala de cuerpos: el más grande que entra; si ninguno entra, el menor.
  assert.equal(fitSize("abc", 1000, "Inter", LABEL_SIZES), 13);
  assert.equal(fitSize("abc", 1, "Inter", LABEL_SIZES), 11);
  assert.deepEqual([...LABEL_SIZES].sort((a, b) => b - a), [...LABEL_SIZES]);
  const text = "GHL Inbound Webhook";
  const width = textWidth(text, "Fraunces", 12.25);
  assert.equal(fitSize(text, width, "var(--ff-brand-fraunces), Fraunces, serif", LABEL_SIZES), 12);
  // Las familias de las marcas se reconocen dentro del stack CSS; una desconocida mide como la más ancha.
  assert.equal(fontWidth("var(--ff-brand-oswald), Oswald, sans-serif"), 0.94);
  assert.ok(fontWidth("var(--ff-brand-inter), Inter, sans-serif") > fontWidth("var(--ff-brand-oswald), Oswald, sans-serif"));
  assert.equal(fontWidth("Comic Sans"), DEFAULT_FONT_WIDTH);

  for (const { label, model, fonts } of await allVariants()) {
    await t.test(label, () => {
      for (const spec of model.components) {
        const inner = spec.w - CARD_INSET_X;
        const room = inner - (spec.tag ? tagWidth(spec.tag, fonts) : 0);
        assert.ok(textWidth(spec.component.label, fonts.display, spec.labelSize) <= room, `"${spec.component.label}" no entra en ${spec.id}`);
        assert.ok((LABEL_SIZES as readonly number[]).includes(spec.labelSize));
        if (spec.component.sublabel) {
          assert.ok(textWidth(spec.component.sublabel, fonts.body, spec.subSize) <= inner, `"${spec.component.sublabel}" no entra en ${spec.id}`);
          assert.ok((SUB_SIZES as readonly number[]).includes(spec.subSize));
        }
      }
    });
  }
});

test("Bajo el capó: orientación y proporciones", () => {
  assert.equal(orientationFor(LANDSCAPE_MIN_WIDTH - 1), "portrait");
  assert.equal(orientationFor(LANDSCAPE_MIN_WIDTH), "landscape");
  assert.equal(narrowAspect({ x: 0, y: 0, w: 900, h: 600 }), "1 / 1");
  assert.equal(narrowAspect({ x: 0, y: 0, w: 600, h: 900 }), "600 / 900");
  // El container query del CSS usa el mismo umbral que el ResizeObserver.
  const css = readFileSync(path.join(process.cwd(), "src/components/premium/UnderTheHood.module.css"), "utf8");
  assert.ok(css.includes(`@container uth (width < ${LANDSCAPE_MIN_WIDTH}px)`), "el umbral del CSS no coincide con LANDSCAPE_MIN_WIDTH");
});

test("Bajo el capó: foco de vistas y del inspector", async () => {
  const bundle = await ARCHITECTURE_LOADERS["new-brothers-barberia"]();
  const { diagram } = resolveArchitecture(bundle, "es", "landscape");

  assert.equal(focusState(diagram, null, null), null);
  assert.equal(isDimmed(null, "nodes", "db"), false);

  const cash = focusState(diagram, "cash-path", null);
  assert.ok(cash);
  assert.deepEqual([...cash.nodes].sort(), ["admin_ui", "auth", "db", "rls", "rpc_cash", "rpc_settle"]);
  assert.ok(cash.edges.has(edgeKey("rls", "rpc_cash")));
  assert.ok(!cash.edges.has(edgeKey("users", "booking_ui")));
  assert.equal(isDimmed(cash, "nodes", "users"), true);
  assert.equal(isDimmed(cash, "boundaries", "Supabase"), false);

  // El inspector manda: el componente, sus vecinos y sus conexiones.
  const rls = focusState(diagram, "cash-path", "rls");
  assert.ok(rls);
  assert.deepEqual([...rls.nodes].sort(), ["admin_ui", "auth", "barber_ui", "rls", "rpc_cash", "rpc_settle"]);
  assert.deepEqual([...rls.edges].sort(), ["admin_ui>rls", "auth>rls", "barber_ui>rls", "rls>rpc_cash", "rls>rpc_settle"]);
  assert.equal(isDimmed(rls, "edges", "users>booking_ui"), true);
  // Un id que no existe no rompe nada: vuelve al foco de la vista.
  assert.deepEqual(focusState(diagram, "cash-path", "nope")?.nodes, cash.nodes);

  const links = componentLinks(diagram, "rls");
  assert.deepEqual(links.incoming, [
    { id: "admin_ui", label: "Panel admin", via: "Permisos" },
    { id: "barber_ui", label: "Portal del barbero", via: null },
    { id: "auth", label: "Roles y permisos", via: null },
  ]);
  assert.deepEqual(links.outgoing.map((link) => link.id), ["rpc_cash", "rpc_settle"]);
  assert.deepEqual(viewsWith(diagram, "rls").map((view) => view.id), ["booking-path", "cash-path"]);
  assert.deepEqual(viewsWith(diagram, "barber_ui"), []);

  assert.equal(diagramSummary(diagram, "es"), "12 componentes, 14 conexiones y 3 recorridos guiados.");
  const english = resolveArchitecture(bundle, "en", "portrait").diagram;
  assert.equal(diagramSummary(english, "en"), "12 components, 14 connections and 3 guided paths.");
  assert.deepEqual(componentLinks(english, "rls").incoming[0], { id: "admin_ui", label: "Admin panel", via: "Permissions" });
});

test("Bajo el capó: tokens de color legibles en los dos temas", () => {
  assert.equal(mixHex("#000000", "#FFFFFF", 0.5), "#808080");
  assert.equal(Math.round(contrastRatio("#000000", "#FFFFFF")), 21);
  const palettes = { ...Object.fromEntries(Object.entries(CASE_BRANDS).map(([slug, brand]) => [slug, brand.palette])), site: SITE_PALETTE };
  for (const [name, palette] of Object.entries(palettes)) {
    const themes = explorerTheme(palette);
    for (const [mode, tokens] of Object.entries(themes)) {
      const label = `${name} (${mode})`;
      assert.ok(contrastRatio(tokens.text, tokens.canvas) >= 7, `${label}: texto`);
      assert.ok(contrastRatio(tokens.text, tokens.raised) >= 7, `${label}: texto sobre caja`);
      assert.ok(contrastRatio(tokens.muted, tokens.canvas) >= 4.5, `${label}: texto secundario`);
      assert.ok(contrastRatio(tokens.muted, tokens.raised) >= 4.5, `${label}: texto secundario sobre caja`);
      assert.ok(contrastRatio(tokens.muted, tokens.plate) >= 4.5, `${label}: placas`);
      assert.ok(contrastRatio(tokens["accent-ink"], tokens.canvas) >= 4.5, `${label}: rótulos de acento`);
      assert.ok(contrastRatio(tokens["tab-ink"], tokens["tab-bg"]) >= 4.5, `${label}: pestaña activa`);
      const pillMix = Number.parseFloat(tokens["pill-mix"]) / 100;
      for (const role of [tokens.accent, tokens["accent-soft"], tokens.danger, tokens.muted]) {
        assert.ok(contrastRatio(tokens["pill-ink"], mixHex(role, tokens.raised, pillMix)) >= 4.5, `${label}: píldora ${role}`);
      }
    }
    const vars = themeVars(palette, 16);
    for (const key of THEME_KEYS) assert.ok(vars[`--uth-d-${key}`] && vars[`--uth-l-${key}`], `${name}: falta --uth-*-${key}`);
  }
  // El CSS mapea cada token en los dos temas.
  const css = readFileSync(path.join(process.cwd(), "src/components/premium/UnderTheHood.module.css"), "utf8");
  for (const key of THEME_KEYS) {
    assert.ok(css.includes(`--uth-${key}: var(--uth-d-${key});`), `CSS: falta --uth-${key} oscuro`);
    assert.ok(css.includes(`--uth-${key}: var(--uth-l-${key});`), `CSS: falta --uth-${key} claro`);
  }
});

test("Bajo el capó: React Flow y su CSS solo viajan en el chunk del explorador", () => {
  const root = path.join(process.cwd(), "src");
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx?|css)$/.test(entry) && !entry.endsWith(".test.ts")) files.push(full);
    }
  };
  walk(root);
  const importers = files.filter((file) => /from\s+["']@xyflow\/react|import\s+["']@xyflow\/react/.test(readFileSync(file, "utf8"))).map((file) => path.relative(root, file));
  assert.deepEqual(importers, [path.join("components", "premium", "ArchitectureExplorer.tsx")]);
  // El explorador se pide con import() (o solo sus tipos): nunca un import estático.
  const staticImporters = files.filter((file) => /^import\s+(?!type\b)[^;]*from\s+["'][^"']*ArchitectureExplorer["']/m.test(readFileSync(file, "utf8")));
  assert.deepEqual(staticImporters, []);
});
