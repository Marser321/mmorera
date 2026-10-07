import type { CSSProperties } from "react";
import { polylinePath } from "@/data/architecture/archify";
import { cn } from "@/lib/utils";
import { type ArchitectureModel, type BoundaryTitle, type ComponentRole, type ComponentSpec, type Plate } from "./underTheHoodModel";
import styles from "./UnderTheHood.module.css";

/**
 * Piezas de dibujo compartidas por el póster (server) y el explorador
 * (cliente): mismas cajas, rutas, placas y rótulos, así el cambio de uno al
 * otro no mueve nada. Sin hooks: sirve en ambos lados.
 */

export const ROLE_COLOR: Record<ComponentRole, string> = {
  danger: "var(--uth-danger)",
  accent: "var(--uth-accent)",
  accentSoft: "var(--uth-accent-soft)",
  muted: "var(--uth-muted)",
};

export type RouteLook = { stroke: string; width: number; dash?: string; strong: boolean };

/** Trazo de una ruta: énfasis (o resaltada por el inspector) en acento pleno; punteada si Archify la marca así. */
export function routeLook(variant: string | null, highlighted = false): RouteLook {
  const strong = variant === "emphasis" || highlighted;
  return {
    stroke: strong ? "var(--uth-accent)" : "var(--uth-route)",
    width: strong ? 2.2 : 1.5,
    dash: variant === "dashed" ? "6 6" : undefined,
    strong,
  };
}

export function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: color }} />
    </marker>
  );
}

export function BoundaryShape({ x, y, w, h, security, radius }: { x: number; y: number; w: number; h: number; security: boolean; radius: number }) {
  return (
    <rect
      x={x + 0.75}
      y={y + 0.75}
      width={w - 1.5}
      height={h - 1.5}
      rx={radius}
      style={{
        fill: "var(--uth-surface)",
        stroke: security ? "color-mix(in srgb, var(--uth-danger) 60%, transparent)" : "color-mix(in srgb, var(--uth-accent) 28%, transparent)",
        strokeWidth: 1.5,
        strokeDasharray: security ? "5 4" : undefined,
      }}
    />
  );
}

export function BoundaryTitleText({ title, language }: { title: BoundaryTitle; language: string }) {
  return (
    <text
      x={title.x}
      y={title.y + title.h / 2}
      dominantBaseline="central"
      style={{
        fontFamily: "var(--uth-font-label)",
        fontSize: title.fontSize,
        fontWeight: 600,
        letterSpacing: "0.08em",
        fill: title.security ? "var(--uth-danger)" : "var(--uth-muted)",
      }}
    >
      {title.label.toLocaleUpperCase(language)}
    </text>
  );
}

/** Placa de etiqueta de una ruta: opaca, encima de las líneas (ninguna ruta pasa por debajo, lo valida Archify). */
export function PlateShape({ plate }: { plate: Plate }) {
  const tight = plate.text.length * 5.4 > plate.w - 6;
  return (
    <g>
      <rect
        x={plate.x}
        y={plate.y}
        width={plate.w}
        height={plate.h}
        rx={4}
        style={{ fill: "var(--uth-plate)", stroke: "color-mix(in srgb, var(--uth-accent) 32%, transparent)", strokeWidth: 0.75 }}
      />
      <text
        x={plate.x + plate.w / 2}
        y={plate.y + plate.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        textLength={tight ? plate.w - 6 : undefined}
        lengthAdjust="spacingAndGlyphs"
        style={{ fontFamily: "var(--uth-font-body)", fontSize: 9, fill: "var(--uth-muted)" }}
      >
        {plate.text}
      </text>
    </g>
  );
}

export function ComponentCard({ spec }: { spec: ComponentSpec }) {
  const { component, role, tag } = spec;
  return (
    <div className={styles.card} style={{ "--role": ROLE_COLOR[role], "--size": spec.labelSize, "--sub-size": spec.subSize } as CSSProperties}>
      <div className={styles.cardHead}>
        <span className={styles.cardLabel}>
          {component.label}
        </span>
        {tag ? <span className={styles.cardTag}>{tag}</span> : null}
      </div>
      {component.sublabel ? <span className={styles.cardSub}>{component.sublabel}</span> : null}
    </div>
  );
}

const percent = (value: number, total: number) => `${((value / total) * 100).toFixed(4)}%`;

/**
 * Póster estático del diagrama: grupos, rutas, placas y rótulos en un SVG que
 * escala con su viewBox; las cajas en HTML posicionadas en porcentaje y con
 * tipografía en unidades del lienzo (--u), igual que en el explorador.
 */
export function ArchitecturePoster({ model, idPrefix, radius, language, className }: { model: ArchitectureModel; idPrefix: string; radius: number; language: string; className?: string }) {
  const { frame } = model;
  const marker = (strong: boolean) => `${idPrefix}-arrow-${strong ? "strong" : "soft"}`;
  return (
    <div className={cn(styles.poster, className)} style={{ "--uth-frame-w": frame.w, "--uth-frame-ar": `${frame.w} / ${frame.h}` } as CSSProperties} aria-hidden="true">
      <svg className={styles.posterSvg} viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`} preserveAspectRatio="xMidYMid meet" focusable="false">
        <defs>
          <ArrowMarker id={marker(true)} color="var(--uth-accent)" />
          <ArrowMarker id={marker(false)} color="var(--uth-route)" />
        </defs>
        {model.boundaries.map((boundary) => (
          <BoundaryShape key={boundary.id} x={boundary.x} y={boundary.y} w={boundary.w} h={boundary.h} security={boundary.security} radius={radius} />
        ))}
        {model.routes.map((route) => {
          const look = routeLook(route.variant);
          return (
            <path
              key={route.id}
              d={polylinePath(route.points)}
              fill="none"
              markerEnd={`url(#${marker(look.strong)})`}
              style={{ stroke: look.stroke, strokeWidth: look.width, strokeDasharray: look.dash }}
            />
          );
        })}
        {model.plates.map((plate) => (
          <PlateShape key={plate.key} plate={plate} />
        ))}
        {model.titles.map((title) => (
          <BoundaryTitleText key={title.index} title={title} language={language} />
        ))}
      </svg>
      {model.components.map((spec) => (
        <div
          key={spec.id}
          className={styles.posterNode}
          style={{ left: percent(spec.x - frame.x, frame.w), top: percent(spec.y - frame.y, frame.h), width: percent(spec.w, frame.w), height: percent(spec.h, frame.h) }}
        >
          <ComponentCard spec={spec} />
        </div>
      ))}
    </div>
  );
}
