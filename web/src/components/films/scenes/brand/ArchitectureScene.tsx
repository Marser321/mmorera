import { interpolate, useCurrentFrame } from "remotion";
import {
  boundaryBox,
  componentBox,
  connectionPath,
  diagramBox,
  unionBox,
  type ArchifyArchitecture,
  type ArchifyComponentType,
} from "@/data/architecture/archify";
import { CLAMP, EASE_IN_OUT, progress } from "../theme";
import { alpha, useBrand } from "./context";

/**
 * Recorre un diagrama de Archify con la piel de la marca: los componentes se
 * arman, las conexiones se dibujan y después la cámara visita cada "vista"
 * guiada (enfoca sus nodos, apaga el resto y hace correr un pulso por la ruta).
 */
export function ArchitectureScene({
  diagram,
  area,
  buildFrames,
  viewFrames,
}: {
  diagram: ArchifyArchitecture;
  area: { x: number; y: number; w: number; h: number };
  buildFrames: number;
  viewFrames: number;
}) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const views = diagram.meta.views ?? [];
  const full = diagramBox(diagram);

  // Vista activa (−1 = panorámica mientras se arma).
  const viewIndex = frame < buildFrames ? -1 : Math.min(views.length - 1, Math.floor((frame - buildFrames) / viewFrames));
  const view = viewIndex >= 0 ? views[viewIndex] : null;
  const viewLocal = viewIndex >= 0 ? frame - buildFrames - viewIndex * viewFrames : 0;
  const focus = new Set(view?.focus ?? []);

  // Cámara: encuadre de la panorámica o de los nodos de la vista (zoom
  // contenido a 1.6× la panorámica, así se lee el contexto).
  const frameFor = (box: { x: number; y: number; w: number; h: number }, margin: number, maxScale = Infinity) => {
    const scale = Math.min((area.w - margin * 2) / box.w, (area.h - margin * 2) / box.h, maxScale);
    return { scale, x: area.x + area.w / 2 - (box.x + box.w / 2) * scale, y: area.y + area.h / 2 - (box.y + box.h / 2) * scale };
  };
  const wide = frameFor(full, 10);
  const shotFor = (index: number) => {
    const ids = views[index]?.focus ?? [];
    const boxes = diagram.components.filter((component) => ids.includes(component.id)).map(componentBox);
    return boxes.length ? frameFor(unionBox(boxes, 60), 30, wide.scale * 1.6) : wide;
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
        return brand.palette.accent;
      case "backend":
      case "cloud":
        return brand.palette.accentSoft;
      case "frontend":
        return brand.palette.accent;
      default:
        return brand.palette.muted;
    }
  };
  const order = [...diagram.components].sort((a, b) => a.pos[0] - b.pos[0]);
  const dimFor = (id: string) => (view && !focus.has(id) ? 0.22 : 1);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", translate: `${cam.x}px ${cam.y}px`, scale: `${cam.scale}` }}>
        {(diagram.boundaries ?? []).map((boundary) => {
          const box = boundaryBox(diagram, boundary);
          const security = boundary.kind === "security-group";
          const enter = progress(frame, 10, 40);
          const dim = view && !boundary.wraps.some((id) => focus.has(id)) ? 0.3 : 1;
          return (
            <div key={boundary.label} style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: brand.radius, border: `1.5px ${security ? "dashed" : "solid"} ${security ? alpha("#e5484d", 60) : alpha(brand.palette.accent, 26)}`, background: alpha(brand.palette.surface, 55), opacity: enter * dim }}>
              <span style={{ position: "absolute", left: 12, top: 6, fontFamily: brand.fonts.label, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: security ? "#e5484d" : brand.palette.muted }}>{boundary.label}</span>
            </div>
          );
        })}

        <svg width={full.x + full.w + 40} height={full.y + full.h + 40} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={brand.palette.accent} />
            </marker>
          </defs>
          {diagram.connections.map((connection, index) => {
            const path = connectionPath(diagram, connection);
            if (!path) return null;
            const draw = progress(frame, 30 + index * 4, 70 + index * 4, EASE_IN_OUT);
            const inFocus = view ? focus.has(connection.from) && focus.has(connection.to) : true;
            return (
              <g key={`${connection.from}-${connection.to}`} opacity={inFocus ? 1 : 0.18}>
                <path
                  d={path.d}
                  fill="none"
                  stroke={connection.variant === "emphasis" ? brand.palette.accent : alpha(brand.palette.accent, 55)}
                  strokeWidth={connection.variant === "emphasis" ? 2.4 : 1.6}
                  strokeDasharray={connection.variant === "dashed" ? "6 6" : undefined}
                  pathLength={connection.variant === "dashed" ? undefined : 1}
                  strokeDashoffset={connection.variant === "dashed" ? undefined : 1 - draw}
                  style={connection.variant === "dashed" ? { opacity: draw } : { strokeDasharray: "1 1" }}
                  markerEnd={draw > 0.95 ? "url(#arch-arrow)" : undefined}
                />
                {connection.label && draw > 0.9 ? (
                  <text x={path.mid.x} y={path.mid.y - 6} textAnchor="middle" fontFamily={brand.fonts.body} fontSize={10} fill={brand.palette.muted}>
                    {connection.label}
                  </text>
                ) : null}
                {view && inFocus ? (
                  <circle r={4.5} fill={brand.palette.accentSoft} style={{ offsetPath: `path('${path.d}')`, offsetDistance: `${((viewLocal * 1.6 + index * 17) % 100).toFixed(1)}%` }} />
                ) : null}
              </g>
            );
          })}
        </svg>

        {order.map((component, index) => {
          const box = componentBox(component);
          const enter = progress(frame, index * 3, index * 3 + 22);
          const color = typeColor(component.type);
          const isFocus = view && focus.has(component.id);
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
              <div style={{ fontFamily: brand.fonts.display, fontSize: 13, fontWeight: 600, color: brand.palette.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{component.label}</div>
              {component.sublabel ? <div style={{ marginTop: 3, fontFamily: brand.fonts.body, fontSize: 9.5, color: brand.palette.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{component.sublabel}</div> : null}
              {component.tag ? <span style={{ position: "absolute", right: 6, top: -8, padding: "1px 6px", borderRadius: 99, background: color, color: brand.palette.onAccent, fontFamily: brand.fonts.label, fontSize: 8, fontWeight: 700 }}>{component.tag}</span> : null}
            </div>
          );
        })}
      </div>

      {view ? (
        <div style={{ position: "absolute", left: area.x, right: 0, bottom: 74, opacity: interpolate(viewLocal, [0, 14, viewFrames - 14, viewFrames], [0, 1, 1, 0], CLAMP) }}>
          <span style={{ padding: "8px 16px", borderRadius: 999, background: brand.palette.accent, color: brand.palette.onAccent, fontFamily: brand.fonts.label, fontSize: 18, fontWeight: 700, letterSpacing: "0.06em" }}>{view.label}</span>
          {view.note ? <div style={{ marginTop: 14, maxWidth: area.w * 0.86, fontFamily: brand.fonts.body, fontSize: 22, lineHeight: 1.35, color: brand.palette.text }}>{view.note}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
