import { Fragment, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Box } from "@/lib/filmLayout";
import type { SlideElement, SocialText } from "@/data/social/layout";
import type { ImagenesProp } from "@/data/social/render";
import type { Tono } from "@/data/social/types";
import { LogoMark } from "../films/scenes/LogoMark";
import { CLAMP, EASE_IN_OUT, EASE_OUT, FILM_FONTS, progress } from "../films/scenes/theme";

/**
 * Kit visual de las piezas de redes: blanco y negro, tipografía del sitio y
 * movimiento que sale del frame. Lento con pulso: cada texto entra por máscara,
 * palabra a palabra, y los énfasis (`*palabra*`) se invierten.
 */

export const SOCIAL_COLORS: Record<Tono, { bg: string; fg: string; body: string; muted: string; line: string; rgb: string }> = {
  oscuro: { bg: "#070809", fg: "#F3F0E8", body: "rgba(243,240,232,0.82)", muted: "rgba(243,240,232,0.58)", line: "rgba(243,240,232,0.22)", rgb: "243 240 232" },
  claro: { bg: "#F3F0E8", fg: "#0B0C0E", body: "rgba(11,12,14,0.82)", muted: "rgba(11,12,14,0.6)", line: "rgba(11,12,14,0.2)", rgb: "11 12 14" },
};

/** Fondo y variables de color: el monograma (LogoMark) lee --color-foreground. */
export function SocialFrame({ tono, children, style }: { tono: Tono; children: ReactNode; style?: CSSProperties }) {
  const c = SOCIAL_COLORS[tono];
  const vars = { "--color-foreground": c.fg, "--color-background": c.bg, "--color-signal": c.fg, "--color-accent": c.fg, "--ink-rgb": c.rgb } as CSSProperties;
  return <AbsoluteFill style={{ ...vars, background: c.bg, color: c.fg, overflow: "hidden", fontFamily: FILM_FONTS.body, ...style }}>{children}</AbsoluteFill>;
}

const boxStyle = (box: Box): CSSProperties => ({ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h });

type Token = { word: string; enfasis: boolean };

/** Divide en palabras respetando `*énfasis*` (puede abarcar varias palabras). */
export function tokens(value: string): Token[] {
  const out: Token[] = [];
  let enfasis = false;
  for (const raw of value.split(/\s+/).filter(Boolean)) {
    let word = raw;
    const opens = word.startsWith("*");
    if (opens) {
      enfasis = true;
      word = word.slice(1);
    }
    const closes = word.endsWith("*") || /\*[.,;:!?)»"]*$/.test(word);
    word = word.replace(/\*/g, "");
    out.push({ word, enfasis });
    if (closes) enfasis = false;
  }
  return out;
}

function fontOf(block: SocialText): CSSProperties {
  if (block.fuente === "display") return { fontFamily: FILM_FONTS.body, fontWeight: 500, letterSpacing: "-0.035em" };
  if (block.fuente === "mono") return { fontFamily: FILM_FONTS.mono, fontWeight: 700, letterSpacing: "0.14em", textTransform: block.upper ? "uppercase" : "none" };
  return { fontFamily: FILM_FONTS.body, fontWeight: 400, letterSpacing: "-0.01em" };
}

/** Un número suelto ("26", "1560,") cuenta desde cero hasta su valor real. */
const COUNTABLE = /^(\d{1,5})([^\d]*)$/;

/**
 * Texto que entra palabra por palabra: sube desde su máscara, con un poco de
 * escala y desenfoque, y se asienta. Los números cuentan hasta su valor; los
 * énfasis se invierten con un salto. Con `exitAt`, las palabras salen hacia
 * arriba (el corte del pulso).
 */
export function MaskWords({ block, from, color, tono, stagger = 2, exitAt }: { block: SocialText; from: number; color: string; tono: Tono; stagger?: number; exitAt?: number }) {
  const frame = useCurrentFrame();
  const c = SOCIAL_COLORS[tono];
  const words = tokens(block.raw);
  // La frase entera se asienta en ~18 frames aunque sea larga.
  const gap = Math.min(stagger, 18 / Math.max(1, words.length));
  return (
    <div style={{ ...boxStyle(block.box), fontSize: block.size, lineHeight: block.lh, color, ...fontOf(block) }}>
      {words.map((token, index) => {
        const start = from + index * gap;
        const rise = progress(frame, start, start + 12, EASE_OUT);
        const out = exitAt === undefined ? 0 : progress(frame, exitAt + index * 0.5, exitAt + 7 + index * 0.5, EASE_IN_OUT);
        const y = (1 - rise) * 105 - out * 105;
        // La barra del énfasis se dibuja después de que entra la palabra y se va con ella.
        const mark = token.enfasis ? progress(frame, start + 11, start + 20, EASE_OUT) * (1 - out) : 0;
        const pop = token.enfasis ? 1 + 0.08 * Math.sin(Math.PI * progress(frame, start + 11, start + 22)) : 1;
        // Si la palabra siguiente también va resaltada, la barra cubre el espacio (sombra sin desplazar el texto).
        const joined = token.enfasis && words[index + 1]?.enfasis && mark > 0.98;
        const count = token.word.match(COUNTABLE);
        const shown = count ? `${Math.round(Number(count[1]) * progress(frame, start + 2, start + 26, EASE_OUT))}${count[2]}` : token.word;
        // El espacio va fuera de la palabra: dentro de un inline-block el navegador lo descarta.
        return (
          <Fragment key={index}>
            <span
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                padding: token.enfasis ? "0 0.08em 0.08em" : "0 0 0.08em",
                margin: token.enfasis ? "0 -0.08em -0.08em" : "0 0 -0.08em",
                backgroundImage: token.enfasis ? `linear-gradient(${c.fg}, ${c.fg})` : undefined,
                backgroundRepeat: "no-repeat",
                backgroundSize: token.enfasis ? `${mark * 100}% 100%` : undefined,
                boxShadow: joined ? `0.24em 0 0 0 ${c.fg}` : undefined,
                transform: `scale(${pop})`,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${y}%) scale(${0.92 + 0.08 * rise})`,
                  filter: rise < 1 ? `blur(${(1 - rise) * 6}px)` : undefined,
                  color: token.enfasis && mark > 0.5 ? c.bg : undefined,
                  fontVariantNumeric: count ? "tabular-nums" : undefined,
                }}
              >
                {shown}
              </span>
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </div>
  );
}

/**
 * Grano de película: la misma textura se corre a una posición al azar en cada
 * cuadro. Da cuerpo al negro y al marfil sin agregar color.
 */
export function Grain({ opacity = 0.09 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const x = Math.round(random(`grano-x-${frame}`) * 384);
  const y = Math.round(random(`grano-y-${frame}`) * 384);
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("social/grano.png")})`, backgroundPosition: `${x}px ${y}px`, opacity, mixBlendMode: "overlay", pointerEvents: "none" }} />;
}

/**
 * Eco: una palabra o un número gigante, en contorno, detrás del texto. Se
 * corre en horizontal mientras dura el pulso y se recorta contra el borde.
 */
export function Eco({ text, tono, duration, top, direction = 1, size: forced, strength = 0.13 }: { text: string; tono: Tono; duration: number; top: number; direction?: 1 | -1; size?: number; strength?: number }) {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  if (!text) return null;
  const c = SOCIAL_COLORS[tono];
  const size = forced ?? Math.max(300, Math.min(900, (width * 1.25) / (text.length * 0.56)));
  const drift = interpolate(frame, [0, duration], [0.06, -0.06]) * width * direction;
  const show = progress(frame, 0, 14, EASE_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: top - size * 0.55,
        width: "100%",
        whiteSpace: "nowrap",
        textAlign: "center",
        fontFamily: FILM_FONTS.body,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.05em",
        color: "transparent",
        WebkitTextStroke: `3px ${c.fg}`,
        opacity: strength * show,
        transform: `translateX(${drift}px) scale(${1.1 - 0.1 * show})`,
        pointerEvents: "none",
      }}
    >
      {text.toUpperCase()}
    </div>
  );
}

/** Barra de progreso por segmentos (como las historias): uno por pulso. */
export function SegmentedProgress({ segments, box, tono }: { segments: Array<{ from: number; duration: number; tono: Tono }>; box: Box; tono?: Tono }) {
  const frame = useCurrentFrame();
  const current = segments.find((segment) => frame >= segment.from && frame < segment.from + segment.duration) ?? segments[segments.length - 1];
  const c = SOCIAL_COLORS[tono ?? current.tono];
  const gap = 8;
  const w = (box.w - gap * (segments.length - 1)) / segments.length;
  return (
    <>
      {segments.map((segment, index) => {
        const fill = Math.min(1, Math.max(0, (frame - segment.from) / segment.duration));
        return (
          <div key={index} style={{ position: "absolute", left: box.x + index * (w + gap), top: box.y, width: w, height: box.h, background: c.line, borderRadius: box.h, overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: c.fg }} />
          </div>
        );
      })}
    </>
  );
}

/** Texto que aparece subiendo y aclarándose (cuerpos, rótulos, listas). */
export function FadeText({ block, from, color, exitAt }: { block: SocialText; from: number; color: string; exitAt?: number }) {
  const frame = useCurrentFrame();
  const show = progress(frame, from, from + 18, EASE_OUT);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, exitAt + 8, EASE_IN_OUT);
  return (
    <div style={{ ...boxStyle(block.box), fontSize: block.size, lineHeight: block.lh, color, opacity: show * (1 - out), transform: `translateY(${(1 - show) * 18 - out * 18}px)`, whiteSpace: block.lines === 1 ? "nowrap" : "normal", ...fontOf(block) }}>
      {block.text}
    </div>
  );
}

/** Dibuja los elementos de un layout con su entrada escalonada (orden × 6 frames). */
export function ElementsLayer({ elements, tono, start = 4, step = 6, imagenes = {}, exitAt, contador }: { elements: SlideElement[]; tono: Tono; start?: number; step?: number; imagenes?: ImagenesProp; exitAt?: number; contador?: string }) {
  const frame = useCurrentFrame();
  const c = SOCIAL_COLORS[tono];
  return (
    <>
      {elements.map((element, index) => {
        const from = start + element.order * step;
        switch (element.kind) {
          case "rule": {
            const draw = progress(frame, from, from + 20, EASE_OUT);
            return <div key={index} style={{ ...boxStyle(element.box), background: c.fg, transformOrigin: "left", transform: `scaleX(${draw})` }} />;
          }
          case "panel": {
            const show = progress(frame, from, from + 16, EASE_OUT);
            return (
              <div
                key={index}
                style={{
                  ...boxStyle(element.box),
                  boxSizing: "border-box",
                  borderRadius: 20,
                  background: element.invert ? c.fg : "transparent",
                  border: element.invert ? "none" : `2px solid ${c.line}`,
                  opacity: show,
                  transform: `translateY(${(1 - show) * 16}px)`,
                }}
              />
            );
          }
          case "image": {
            const src = imagenes[element.slot]?.src;
            const show = progress(frame, from, from + 20, EASE_OUT);
            const push = interpolate(frame, [0, 120], [1.06, 1], CLAMP);
            return (
              <div key={index} style={{ ...boxStyle(element.box), overflow: "hidden", borderRadius: 18, opacity: show, background: c.line }}>
                {src ? <Img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", maxWidth: "none", transform: `scale(${push})`, filter: "grayscale(1) contrast(1.05)" }} /> : null}
              </div>
            );
          }
          case "logo": {
            const turn = progress(frame, from, from + 40, EASE_IN_OUT);
            return (
              <div key={index} style={boxStyle(element.box)}>
                <LogoMark id={`social-logo-${index}`} size={element.box.w} rotation={interpolate(turn, [0, 1], [-90, 0])} ring={progress(frame, from + 20, from + 56, EASE_IN_OUT)} interiorColor={c.fg} ringColor={c.fg} />
              </div>
            );
          }
          case "text": {
            // Dentro de un panel invertido el texto toma el color del fondo.
            const color = element.invert ? c.bg : element.rol === "titulo" || element.rol === "cita" || element.rol === "opcion" ? c.fg : element.rol === "cuerpo" || element.rol === "item" ? c.body : c.muted;
            const block = element.rol === "contador" && contador ? { ...element.block, text: contador, raw: contador } : element.block;
            if (element.reveal === "words") return <MaskWords key={index} block={block} from={from} color={color} tono={tono} exitAt={exitAt} />;
            return <FadeText key={index} block={block} from={from} color={color} exitAt={exitAt} />;
          }
        }
      })}
    </>
  );
}
