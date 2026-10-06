import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  componentBox,
  polylinePath,
  unionBox,
  type ArchifyArchitecture,
  type ArchifyComponentType,
  type ArchifyLayout,
  type Box,
} from "@/data/architecture/archify";
import { CLAMP, EASE_IN_OUT, progress } from "../theme";
import { alpha, useBrand } from "./context";

/**
 * Recorre un diagrama de Archify con la piel de la marca: los componentes se
 * arman, las conexiones se dibujan y después la cámara visita cada "vista"
 * guiada (enfoca sus nodos, apaga el resto y hace correr un pulso por la ruta).
 *
 * Las rutas y las placas de etiqueta son las que calculó Archify
 * (`*.layout.json`), validadas sin cruces ni etiquetas sobre otras rutas. El
 * diagrama queda recortado a su área y la leyenda de cada vista va en su
 * propia banda, fuera del dibujo: nada se pisa con nada.
 */
export function ArchitectureScene({
  diagram,
  layout,
  area,
  caption,
  buildFrames,
  viewFrames,
  maxZoom = 1.6,
}: {
  diagram: ArchifyArchitecture;
  layout: ArchifyLayout;
  /** Rectángulo de la composición donde se dibuja (y recorta) el diagrama. */
  area: Box;
  /** Banda de la leyenda de cada vista, fuera del área del diagrama. */
  caption: { x: number; y: number; w: number; size?: number };
  buildFrames: number;
  viewFrames: number;
  /** Zoom máximo de una vista respecto de la panorámica. */
  maxZoom?: number;
}) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const views = diagram.meta.views ?? [];
  const full: Box = { x: 0, y: 0, w: layout.viewBox[0], h: layout.viewBox[1] };
  const boxOf = new Map(layout.components.map((component) => [component.id, component]));

  // Vista activa (−1 = panorámica mientras se arma).
  const viewIndex = frame < buildFrames ? -1 : Math.min(views.length - 1, Math.floor((frame - buildFrames) / viewFrames));
  const view = viewIndex >= 0 ? views[viewIndex] : null;
  const viewLocal = viewIndex >= 0 ? frame - buildFrames - viewIndex * viewFrames : 0;
  const focus = new Set(view?.focus ?? []);

  // Cámara: encuadre de la panorámica o de los nodos de la vista (zoom
  // contenido respecto de la panorámica, así se lee el contexto).
  const frameFor = (box: Box, margin: number, maxScale = Infinity) => {
    const scale = Math.min((area.w - margin * 2) / box.w, (area.h - margin * 2) / box.h, maxScale);
    return { scale, x: area.w / 2 - (box.x + box.w / 2) * scale, y: area.h / 2 - (box.y + box.h / 2) * scale };
  };
  const wide = frameFor(full, 10);
  const shotFor = (index: number) => {
    const ids = views[index]?.focus ?? [];
    const boxes = ids.map((id) => boxOf.get(id)).filter((box): box is NonNullable<typeof box> => Boolean(box));
    return boxes.length ? frameFor(unionBox(boxes, 50), 24, wide.scale * maxZoom) : wide;
  };
  const cam = (() => {
    if (viewIndex < 0) return wide;
    const a = viewIndex === 0 ? wide : shotFor(viewIndex - 1);
    const b = shotFor(viewIndex);
    const t = progress(viewLocal, 0, 36, EASE_IN_OUT);
    return { scale: a.scale + (b.scale - a.scale) * t, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  })();

  const typeColor = (type: ArchifyComponentType) => {
    switch (type) {
      case "security":
        return "#e5484d";
      case "database":
      case "frontend":
        return brand.palette.accent;
      case "backend":
      case "cloud":
        return brand.palette.accentSoft;
      default:
        return brand.palette.muted;
    }
  };
  const order = [...diagram.components].sort((a, b) => a.pos[0] - b.pos[0]);
  const dimFor = (id: string) => (view && !focus.has(id) ? 0.22 : 1);
  const paths = layout.connections.map((connection, index) => {
    const source = diagram.connections.find((item) => item.from === connection.from && item.to === connection.to);
    return {
      ...connection,
      d: polylinePath(connection.points),
      variant: source?.variant,
      draw: progress(frame, 30 + index * 4, 70 + index * 4, EASE_IN_OUT),
      inFocus: view ? focus.has(connection.from) && focus.has(connection.to) : true,
    };
  });
  // Bordes suaves: lo que sale del área se desvanece en vez de cortarse en seco.
  const edgeMask = "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent), linear-gradient(180deg, transparent, #000 5%, #000 95%, transparent)";
  const captionSize = caption.size ?? 22;

  return (
    <>
      <div style={{ position: "absolute", left: area.x, top: area.y, width: area.w, height: area.h, overflow: "hidden", maskImage: edgeMask, maskComposite: "intersect", WebkitMaskImage: edgeMask, WebkitMaskComposite: "source-in" } as CSSProperties}>
        <div style={{ position: "absolute", left: 0, top: 0, width: full.w, height: full.h, transformOrigin: "0 0", translate: `${cam.x}px ${cam.y}px`, scale: `${cam.scale}` }}>
          {layout.boundaries.map((boundary) => {
            const source = diagram.boundaries?.find((item) => item.label === boundary.label);
            const security = boundary.kind === "security-group";
            const enter = progress(frame, 10, 40);
            const dim = view && !source?.wraps.some((id) => focus.has(id)) ? 0.3 : 1;
            return (
              <div key={boundary.label} style={{ position: "absolute", left: boundary.x, top: boundary.y, width: boundary.w, height: boundary.h, boxSizing: "border-box", borderRadius: brand.radius, border: `1.5px ${security ? "dashed" : "solid"} ${security ? alpha("#e5484d", 60) : alpha(brand.palette.accent, 26)}`, background: alpha(brand.palette.surface, 55), opacity: enter * dim }}>
                <span style={{ position: "absolute", left: 12, top: 5, fontFamily: brand.fonts.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", color: security ? "#e5484d" : brand.palette.muted }}>{boundary.label}</span>
              </div>
            );
          })}

          <svg width={full.w} height={full.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs>
              <marker id={`arch-arrow-${brand.slug}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={brand.palette.accent} />
              </marker>
            </defs>
            {paths.map((path, index) => (
              <g key={`${path.from}-${path.to}`} opacity={path.inFocus ? 1 : 0.18}>
                <path
                  d={path.d}
                  fill="none"
                  stroke={path.variant === "emphasis" ? brand.palette.accent : alpha(brand.palette.accent, 55)}
                  strokeWidth={path.variant === "emphasis" ? 2.4 : 1.6}
                  strokeDasharray={path.variant === "dashed" ? "6 6" : undefined}
                  pathLength={path.variant === "dashed" ? undefined : 1}
                  strokeDashoffset={path.variant === "dashed" ? undefined : 1 - path.draw}
                  style={path.variant === "dashed" ? { opacity: path.draw } : { strokeDasharray: "1 1" }}
                  markerEnd={path.draw > 0.95 ? `url(#arch-arrow-${brand.slug})` : undefined}
                />
                {view && path.inFocus ? (
                  <circle r={4} fill={brand.palette.accentSoft} style={{ offsetPath: `path('${path.d}')`, offsetDistance: `${((viewLocal * 1.6 + index * 17) % 100).toFixed(1)}%` }} />
                ) : null}
              </g>
            ))}
            {/* Placas de etiqueta encima de rutas y pulsos: la línea pasa por detrás, nunca sobre el texto. */}
            {paths.map((path) =>
              path.label && path.draw > 0.9 ? (
                <g key={`label-${path.from}-${path.to}`} opacity={path.inFocus ? 1 : 0.3}>
                  <rect x={path.label.x} y={path.label.y} width={path.label.w} height={path.label.h} rx={4} fill={brand.palette.bg} stroke={alpha(brand.palette.accent, 30)} strokeWidth={0.75} />
                  <text
                    x={path.label.x + path.label.w / 2}
                    y={path.label.y + path.label.h / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={brand.fonts.body}
                    fontSize={9}
                    fill={brand.palette.muted}
                    textLength={path.label.text.length * 5.4 > path.label.w - 6 ? path.label.w - 6 : undefined}
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {path.label.text}
                  </text>
                </g>
              ) : null,
            )}
          </svg>

          {order.map((component, index) => {
            const box = boxOf.get(component.id) ?? componentBox(component);
            const enter = progress(frame, index * 3, index * 3 + 22);
            const color = typeColor(component.type);
            const isFocus = view && focus.has(component.id);
            // La etiqueta técnica se omite si su grupo ya la nombra (p. ej. "Next.js 16").
            const wrapper = diagram.boundaries?.find((boundary) => boundary.wraps.includes(component.id));
            const tag = component.tag && !wrapper?.label.toLowerCase().includes(component.tag.toLowerCase()) ? component.tag : null;
            return (
              <div
                key={component.id}
                style={{
                  position: "absolute",
                  left: box.x,
                  top: box.y,
                  width: box.w,
                  height: box.h,
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  borderRadius: brand.radius * 0.6,
                  background: brand.palette.raised,
                  border: `1.5px solid ${isFocus ? color : alpha(color, 45)}`,
                  boxShadow: isFocus ? `0 0 0 4px ${alpha(color, 16)}` : "none",
                  opacity: enter * dimFor(component.id),
                  scale: `${0.94 + enter * 0.06}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: brand.fonts.display, fontSize: 13, fontWeight: 600, color: brand.palette.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{component.label}</span>
                  {tag ? <span style={{ flexShrink: 0, padding: "1px 6px", borderRadius: 99, background: color, color: brand.palette.onAccent, fontFamily: brand.fonts.label, fontSize: 8, fontWeight: 700 }}>{tag}</span> : null}
                </div>
                {component.sublabel ? <div style={{ marginTop: 3, fontFamily: brand.fonts.body, fontSize: 9.5, color: brand.palette.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{component.sublabel}</div> : null}
              </div>
            );
          })}
        </div>
      </div>

      {view ? (
        <div style={{ position: "absolute", left: caption.x, top: caption.y, width: caption.w, opacity: interpolate(viewLocal, [0, 14, viewFrames - 14, viewFrames], [0, 1, 1, 0], CLAMP) }}>
          <span style={{ display: "inline-block", padding: `${captionSize * 0.36}px ${captionSize * 0.72}px`, borderRadius: 999, background: brand.palette.accent, color: brand.palette.onAccent, fontFamily: brand.fonts.label, fontSize: captionSize * 0.82, fontWeight: 700, letterSpacing: "0.06em" }}>{view.label}</span>
          {view.note ? <div style={{ marginTop: captionSize * 0.6, fontFamily: brand.fonts.body, fontSize: captionSize, lineHeight: 1.35, color: brand.palette.text }}>{view.note}</div> : null}
        </div>
      ) : null}
    </>
  );
}
