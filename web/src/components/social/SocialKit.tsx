import { Fragment, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Box } from "@/lib/filmLayout";
import { LOGO_VIEWBOX } from "@/data/brand/logoPaths";
import type { SlideElement, SocialText } from "@/data/social/layout";
import type { ImagenesProp, ImagenProp } from "@/data/social/render";
import type { Tono } from "@/data/social/types";
import { CLAMP, EASE_IN_OUT, EASE_OUT, progress } from "../films/scenes/theme";

/**
 * Kit visual de las piezas de redes, «Pared y piedra»: la estética del sitio.
 * Pared negra mate con grano, marfil gastado, la textura de piedra del
 * monograma, títulos en Unbounded, cuerpo en Familjen Grotesk y rótulos en
 * Space Mono. Sin color de acento. El monograma solo firma el cierre.
 *
 * Movimiento lento con pulso: cada texto entra por máscara, palabra a
 * palabra, y los énfasis (`*palabra*`) se marcan con una barra de piedra.
 */

/** Pared #0B0B0A y marfil #ECE7DD, con los pesos del marfil de globals.css. */
export const SOCIAL_COLORS: Record<Tono, { bg: string; fg: string; body: string; muted: string; line: string; rgb: string; relieve: string }> = {
  oscuro: { bg: "#0B0B0A", fg: "#ECE7DD", body: "rgba(236,231,221,0.78)", muted: "rgba(236,231,221,0.58)", line: "rgba(236,231,221,0.16)", rgb: "236 231 221", relieve: "#141412" },
  claro: { bg: "#ECE7DD", fg: "#0B0B0A", body: "rgba(11,11,10,0.8)", muted: "rgba(11,11,10,0.62)", line: "rgba(11,11,10,0.18)", rgb: "11 11 10", relieve: "#E3DED3" },
};

export const SOCIAL_FONTS = {
  display: 'var(--ff-display), "Unbounded", system-ui, sans-serif',
  body: 'var(--ff-body), "Familjen Grotesk", system-ui, sans-serif',
  mono: 'var(--ff-mono), "Space Mono", ui-monospace, monospace',
} as const;

/** Grano de pared: el mismo ruido fractal que `--grano-pared` del sitio (globals.css). */
const GRANO_PARED =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='5' intercept='-2.05'/%3E%3CfeFuncG type='linear' slope='5' intercept='-2.05'/%3E%3CfeFuncB type='linear' slope='5' intercept='-2.05'/%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E";

export const PIEDRA = () => staticFile("marca/textura-piedra.webp");
const MONOGRAMA = () => staticFile("marca/monograma.svg");

/**
 * Fondo y variables de color. La pared no es plana: una luz rasante muy
 * suave desde arriba y la piedra apenas presente, como el muro del sitio.
 */
export function SocialFrame({ tono, children, style }: { tono: Tono; children: ReactNode; style?: CSSProperties }) {
  const c = SOCIAL_COLORS[tono];
  const vars = { "--color-foreground": c.fg, "--color-background": c.bg, "--color-signal": c.fg, "--color-accent": c.fg, "--ink-rgb": c.rgb } as CSSProperties;
  const luz = tono === "oscuro" ? "radial-gradient(120% 70% at 30% 0%, rgba(236,231,221,0.045), transparent 60%)" : "radial-gradient(120% 70% at 30% 0%, rgba(255,255,255,0.35), transparent 60%)";
  return (
    <AbsoluteFill style={{ ...vars, background: c.bg, color: c.fg, overflow: "hidden", fontFamily: SOCIAL_FONTS.body, ...style }}>
      <AbsoluteFill style={{ backgroundImage: `url(${PIEDRA()})`, backgroundSize: "640px 640px", opacity: tono === "oscuro" ? 0.035 : 0.22, mixBlendMode: tono === "oscuro" ? "screen" : "multiply" }} />
      <AbsoluteFill style={{ background: luz }} />
      {children}
    </AbsoluteFill>
  );
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
  if (block.fuente === "display") return { fontFamily: SOCIAL_FONTS.display, fontWeight: 500, letterSpacing: "-0.035em" };
  if (block.fuente === "mono") return { fontFamily: SOCIAL_FONTS.mono, fontWeight: 400, letterSpacing: "0.16em", textTransform: block.upper ? "uppercase" : "none" };
  return { fontFamily: SOCIAL_FONTS.body, fontWeight: 400, letterSpacing: "-0.01em" };
}


/** Un número suelto ("26", "1560,") cuenta desde cero hasta su valor real. */
const COUNTABLE = /^(\d{1,5})([^\d]*)$/;

/**
 * Texto que entra palabra por palabra: sube desde su máscara, con un poco de
 * escala y desenfoque, y se asienta. Los números cuentan hasta su valor; los
 * énfasis se invierten con un salto. Con `exitAt`, las palabras salen hacia
 * arriba (el corte del pulso).
 */
export function MaskWords({ block, from, color, tono, stagger = 2, exitAt, shadow }: { block: SocialText; from: number; color: string; tono: Tono; stagger?: number; exitAt?: number; shadow?: string }) {
  const frame = useCurrentFrame();
  const c = SOCIAL_COLORS[tono];
  const words = tokens(block.raw);
  // La frase entera se asienta en ~18 frames aunque sea larga.
  const gap = Math.min(stagger, 18 / Math.max(1, words.length));
  return (
    // La medida es conservadora: si el navegador corta en una línea menos, el texto se apoya abajo de su caja
    // (el hueco queda arriba, no entre el título y lo que sigue).
    <div style={{ ...boxStyle(block.box), display: "flex", flexDirection: "column", justifyContent: "flex-end", fontSize: block.size, lineHeight: block.lh, color, ...fontOf(block) }}>
      <div>
        {words.map((token, index) => {
          const start = from + index * gap;
          const rise = progress(frame, start, start + 12, EASE_OUT);
          const out = exitAt === undefined ? 0 : progress(frame, exitAt + index * 0.5, exitAt + 7 + index * 0.5, EASE_IN_OUT);
          const y = (1 - rise) * 105 - out * 105;
          // La barra del énfasis se dibuja después de que entra la palabra y se va con ella.
          const mark = token.enfasis ? progress(frame, start + 11, start + 20, EASE_OUT) * (1 - out) : 0;
          const pop = token.enfasis ? 1 + 0.08 * Math.sin(Math.PI * progress(frame, start + 11, start + 22)) : 1;
          const joined = token.enfasis && Boolean(words[index + 1]?.enfasis);
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
                  // Aire arriba (tildes altas) y abajo (descendentes de Unbounded): la máscara no los corta.
                  // Si la palabra siguiente también va resaltada, el relleno derecho estira la barra sobre el espacio.
                  padding: `0.14em ${token.enfasis ? (joined ? "0.38em" : "0.1em") : "0"} 0.24em ${token.enfasis ? "0.1em" : "0"}`,
                  margin: `-0.14em ${token.enfasis ? (joined ? "-0.38em" : "-0.1em") : "0"} -0.24em ${token.enfasis ? "-0.1em" : "0"}`,
                  // Barra lisa: la piedra de encima (PiedraEncima) ya la gasta como al resto del marfil.
                  backgroundImage: token.enfasis ? `linear-gradient(${c.fg}, ${c.fg})` : undefined,
                  backgroundRepeat: "no-repeat",
                  // La barra no ocupa el aire de las tildes ni todo el de los descendentes: no pisa las líneas vecinas.
                  backgroundPosition: "0 0.12em",
                  backgroundSize: token.enfasis ? `${mark * 100}% calc(100% - 0.28em)` : undefined,
                  transform: `scale(${pop})`,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: `translateY(${y}%) scale(${0.92 + 0.08 * rise})`,
                    filter: rise < 1 ? `blur(${(1 - rise) * 6}px)` : undefined,
                    color: token.enfasis && mark > 0.5 ? c.bg : undefined,
                    // La sombra separa la letra del arte; sobre la barra de énfasis no hace falta (y ensucia).
                    textShadow: token.enfasis ? undefined : shadow,
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
    </div>
  );
}

/**
 * Grano de pared: el ruido del sitio en overlay, por encima de todo (imagen y
 * letras comparten el mismo grano: así el texto queda impreso en la pared, no
 * pegado encima). En video se corre a una posición al azar en cada cuadro.
 */
export function Grain({ opacity = 0.35 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const x = Math.round(random(`grano-x-${frame}`) * 320);
  const y = Math.round(random(`grano-y-${frame}`) * 320);
  return <AbsoluteFill style={{ backgroundImage: `url("${GRANO_PARED}")`, backgroundSize: "320px 320px", backgroundPosition: `${x}px ${y}px`, opacity, mixBlendMode: "overlay", pointerEvents: "none" }} />;
}

/**
 * Piedra sobre todo: la textura del monograma en multiply, también sobre las
 * letras. El marfil se gasta como en el logo; la pared casi no cambia.
 */
export function PiedraEncima({ opacity = 0.2 }: { opacity?: number }) {
  return <AbsoluteFill style={{ backgroundImage: `url(${PIEDRA()})`, backgroundSize: "520px 520px", opacity, mixBlendMode: "multiply", pointerEvents: "none" }} />;
}

/**
 * El arco del anillo del monograma como recurso gráfico: una porción de aro
 * gigante, de piedra, que entra desde un borde y se funde. Mismo grosor
 * relativo que el anillo del logo (126 / 877 del radio).
 */
export function Arco({ cx, cy, r, tono, opacity = 0.16, fundido = "to top", grosor = 126 / 877 }: { cx: number; cy: number; r: number; tono: Tono; opacity?: number; fundido?: string; grosor?: number }) {
  const frame = useCurrentFrame();
  const c = SOCIAL_COLORS[tono];
  const show = progress(frame, 0, 40, EASE_OUT);
  const inner = ((1 - grosor) * 100).toFixed(2);
  const ring = `radial-gradient(circle closest-side, transparent calc(${inner}% - 1px), #000 ${inner}%, #000 calc(100% - 1px), transparent 100%)`;
  // El fundido es del cuadro entero (no del aro): el arco se apaga hacia el texto.
  const fade = `linear-gradient(${fundido}, #000 0%, rgba(0,0,0,0.55) 45%, transparent 90%)`;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: fade, maskImage: fade, opacity: opacity * show, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          backgroundColor: c.fg,
          backgroundImage: `url(${PIEDRA()})`,
          backgroundSize: "520px 520px",
          backgroundBlendMode: "multiply",
          WebkitMaskImage: ring,
          maskImage: ring,
          transform: `rotate(${(1 - show) * -8}deg)`,
        }}
      />
    </AbsoluteFill>
  );
}

/**
 * Monograma fundido (como MonogramaFundido del sitio): el MM con textura de
 * piedra que se funde hacia la pared. Solo firma el cierre.
 */
export function MonogramaPiedra({ box, tono, from = 0 }: { box: Box; tono: Tono; from?: number }) {
  const frame = useCurrentFrame();
  const c = SOCIAL_COLORS[tono];
  const show = progress(frame, from, from + 30, EASE_OUT);
  const fade = "linear-gradient(to bottom, #000 30%, rgba(0,0,0,0.35) 100%)";
  return (
    <div
      style={{
        ...boxStyle(box),
        aspectRatio: `${LOGO_VIEWBOX.width} / ${LOGO_VIEWBOX.height}`,
        backgroundColor: c.fg,
        backgroundImage: `url(${PIEDRA()})`,
        backgroundSize: "420px 420px",
        backgroundBlendMode: "multiply",
        WebkitMaskImage: `url(${MONOGRAMA()}), ${fade}`,
        WebkitMaskSize: "100% 100%, 100% 100%",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskComposite: "source-in",
        maskImage: `url(${MONOGRAMA()}), ${fade}`,
        maskSize: "100% 100%, 100% 100%",
        maskRepeat: "no-repeat",
        maskComposite: "intersect",
        opacity: 0.9 * show,
        transform: `translateY(${(1 - show) * 14}px)`,
      }}
    />
  );
}

/**
 * Arte de fondo (versión A): la imagen de ChatGPT a sangre, pasada a la
 * paleta (grises con el blanco llevado a marfil), con un velo de pared que se
 * apoya en la zona del texto y se funde hacia el arte. El grano y la piedra
 * de arriba la terminan de integrar con las letras.
 */
export function FondoArte({ imagen, zona, height }: { imagen: ImagenProp; zona?: Box; height: number }) {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 120], [1.05, 1], CLAMP);
  const top = zona ? Math.max(0, zona.y - 110) : height * 0.45;
  const bottom = zona ? Math.min(height, zona.y + zona.h + 110) : height;
  const pct = (px: number) => `${((px / height) * 100).toFixed(2)}%`;
  const fadeTop = Math.max(0, top - height * 0.22);
  const fadeBottom = Math.min(height, bottom + height * 0.18);
  // El arte ya deja su franja oscura: el velo solo asegura el contraste, no la tapa.
  const velo = `linear-gradient(to bottom, rgba(11,11,10,0) ${pct(fadeTop)}, rgba(11,11,10,0.62) ${pct(top)}, rgba(11,11,10,0.7) ${pct(bottom)}, rgba(11,11,10,${bottom >= height - 4 ? 0.7 : 0.15}) ${pct(fadeBottom)})`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img src={imagen.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", maxWidth: "none", transform: `scale(${push})`, filter: "grayscale(1) contrast(1.08) brightness(1.05)" }} />
      </AbsoluteFill>
      {/* Lo blanco de la imagen pasa a marfil; lo negro queda pared. */}
      <AbsoluteFill style={{ background: "#ECE7DD", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: velo }} />
      {/* Viñeta: los bordes se hunden en la pared. */}
      <AbsoluteFill style={{ background: "radial-gradient(130% 90% at 50% 35%, transparent 60%, rgba(11,11,10,0.45) 100%)" }} />
    </AbsoluteFill>
  );
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
  const size = forced ?? Math.max(260, Math.min(800, (width * 1.25) / (text.length * 0.86)));
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
        fontFamily: SOCIAL_FONTS.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.04em",
        color: "transparent",
        WebkitTextStroke: `2px ${c.fg}`,
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
export function FadeText({ block, from, color, exitAt, shadow }: { block: SocialText; from: number; color: string; exitAt?: number; shadow?: string }) {
  const frame = useCurrentFrame();
  const show = progress(frame, from, from + 18, EASE_OUT);
  const out = exitAt === undefined ? 0 : progress(frame, exitAt, exitAt + 8, EASE_IN_OUT);
  return (
    <div style={{ ...boxStyle(block.box), fontSize: block.size, lineHeight: block.lh, color, opacity: show * (1 - out), transform: `translateY(${(1 - show) * 18 - out * 18}px)`, whiteSpace: block.lines === 1 ? "nowrap" : "normal", textShadow: shadow, ...fontOf(block) }}>
      {block.text}
    </div>
  );
}

/** Dibuja los elementos de un layout con su entrada escalonada (orden × 6 frames). */
export function ElementsLayer({ elements, tono, start = 4, step = 6, imagenes = {}, exitAt, contador, sobreArte = false }: { elements: SlideElement[]; tono: Tono; start?: number; step?: number; imagenes?: ImagenesProp; exitAt?: number; contador?: string; sobreArte?: boolean }) {
  const frame = useCurrentFrame();
  const c = SOCIAL_COLORS[tono];
  return (
    <>
      {elements.map((element, index) => {
        const from = start + element.order * step;
        switch (element.kind) {
          case "rule": {
            const draw = progress(frame, from, from + 20, EASE_OUT);
            // Las rayas son finas y del peso de las líneas del sitio: la del rótulo un poco más presente.
            const thin = element.box.h <= 1;
            return <div key={index} style={{ ...boxStyle(element.box), height: thin ? 1 : 2, background: thin ? c.line : `rgb(${c.rgb} / 0.4)`, transformOrigin: "left", transform: `scaleX(${draw})` }} />;
          }
          case "panel": {
            const show = progress(frame, from, from + 16, EASE_OUT);
            return (
              <div
                key={index}
                style={{
                  ...boxStyle(element.box),
                  boxSizing: "border-box",
                  borderRadius: 14,
                  backgroundColor: element.invert ? c.fg : `rgb(${c.rgb} / 0.03)`,
                  border: element.invert ? "none" : `1.5px solid ${c.line}`,
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
              <div key={index} style={{ ...boxStyle(element.box), overflow: "hidden", borderRadius: 14, opacity: show, background: c.line, isolation: "isolate" }}>
                {src ? <Img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", maxWidth: "none", transform: `scale(${push})`, filter: "grayscale(1) contrast(1.06) brightness(0.9)" }} /> : null}
                <div style={{ position: "absolute", inset: 0, background: "#ECE7DD", mixBlendMode: "multiply" }} />
              </div>
            );
          }
          case "logo":
            return <MonogramaPiedra key={index} box={element.box} tono={tono} from={from} />;
          case "text": {
            // Dentro de un panel invertido el texto toma el color del fondo.
            const color = element.invert ? c.bg : element.rol === "titulo" || element.rol === "cita" || element.rol === "opcion" ? c.fg : element.rol === "cuerpo" || element.rol === "item" ? c.body : c.muted;
            const block = element.rol === "contador" && contador ? { ...element.block, text: contador, raw: contador } : element.block;
            // Sobre arte, una sombra ancha y suave separa la letra de la imagen sin que se note como sombra.
            // Los rótulos chicos (mono) van sin sombra: en ellos se ve como un recuadro.
            const shadow = sobreArte && block.fuente !== "mono" ? "0 2px 28px rgba(11,11,10,0.55), 0 1px 2px rgba(11,11,10,0.4)" : undefined;
            if (element.reveal === "words") return <MaskWords key={index} block={block} from={from} color={color} tono={tono} exitAt={exitAt} shadow={shadow} />;
            return <FadeText key={index} block={block} from={from} color={color} exitAt={exitAt} shadow={shadow} />;
          }
        }
      })}
    </>
  );
}
