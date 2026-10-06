import type { CSSProperties, ReactNode } from "react";
import type { Box } from "@/lib/filmLayout";
import { alpha, useBrand } from "./context";
import { SampleBadge } from "./flat";
import { LINE_HEIGHT, type TextBlock } from "./layout/dataText";

/**
 * Piezas comunes de las escenas de datos: texto encerrado en la caja que
 * calculó su layout (nunca fuera de ella), el badge de datos de ejemplo y los
 * íconos dibujados en SVG (los íconos son gráficos, no texto).
 */

export const boxStyle = (box: Box): CSSProperties => ({ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h });

export type BoxTextProps = {
  block: TextBlock;
  align?: "left" | "center" | "right";
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Texto dentro de su caja: una línea se centra en vertical y no corta; varias
 * líneas usan el interlineado con el que el layout midió el alto. La caja
 * recorta, así un texto jamás invade la banda vecina.
 */
export function BoxText({ block, align = "left", style, children }: BoxTextProps) {
  const single = block.lines === 1;
  return (
    <div
      style={{
        ...boxStyle(block.box),
        boxSizing: "border-box",
        overflow: "hidden",
        fontSize: block.size,
        lineHeight: single ? 1.12 : LINE_HEIGHT,
        whiteSpace: single ? "nowrap" : "normal",
        textAlign: align,
        ...(single ? { display: "flex", alignItems: "center", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" } : null),
        ...style,
      }}
    >
      {single ? <span>{children ?? block.text}</span> : (children ?? block.text)}
    </div>
  );
}

/** "Datos de ejemplo" en la caja que le reservó el layout. */
export function SampleTag({ block, opacity = 1 }: { block: TextBlock; opacity?: number }) {
  return (
    <SampleBadge
      label={block.text}
      style={{ ...boxStyle(block.box), boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: block.size, lineHeight: 1, whiteSpace: "nowrap", opacity }}
    />
  );
}

export type GlyphKind = "check" | "cross" | "half" | "ring" | "search";

/** Ícono vectorial dentro de una caja cuadrada (se dibuja con `draw` 0→1). */
export function Glyph({ kind, box, color, draw = 1, weight = 2.4, style }: { kind: GlyphKind; box: Box; color: string; draw?: number; weight?: number; style?: CSSProperties }) {
  const stroke = { fill: "none", stroke: color, strokeWidth: weight, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width={box.w} height={box.h} style={{ ...boxStyle(box), overflow: "visible", ...style }}>
      {kind === "check" ? <path d="M5 12.5 L10 17.5 L19 7" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} {...stroke} /> : null}
      {kind === "cross" ? (
        <>
          <path d="M6.5 6.5 L17.5 17.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw * 2)} {...stroke} />
          <path d="M17.5 6.5 L6.5 17.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, draw * 2 - 1)} {...stroke} />
        </>
      ) : null}
      {kind === "half" ? (
        <>
          <circle cx={12} cy={12} r={8} {...stroke} opacity={draw} />
          <path d="M12 4 A8 8 0 0 1 12 20 Z" fill={color} opacity={draw} />
        </>
      ) : null}
      {kind === "ring" ? <circle cx={12} cy={12} r={8} {...stroke} strokeDasharray="2.6 2.6" opacity={draw} /> : null}
      {kind === "search" ? (
        <>
          <circle cx={10.5} cy={10.5} r={6.5} {...stroke} opacity={draw} />
          <path d="M15.5 15.5 L20 20" {...stroke} opacity={draw} />
        </>
      ) : null}
    </svg>
  );
}

/** Placa de tarjeta con la piel de la marca (fondo opaco, borde suave). */
export function Plate({ box, style, accent }: { box: Box; style?: CSSProperties; accent?: string }) {
  const brand = useBrand();
  return (
    <div
      style={{
        ...boxStyle(box),
        boxSizing: "border-box",
        borderRadius: brand.radius,
        background: `linear-gradient(165deg, ${brand.palette.raised}, ${brand.palette.surface} 70%)`,
        border: `1px solid ${accent ? alpha(accent, 45) : brand.palette.line}`,
        ...style,
      }}
    />
  );
}
