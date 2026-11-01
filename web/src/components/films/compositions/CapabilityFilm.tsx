import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { LucideIcon } from "lucide-react";
import { brandCssVars, type CaseBrand } from "@/data/brands/caseBrands";
import { capabilityFilm, type CapabilityFilmData } from "@/data/films/capabilityFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FlagshipChapter } from "@/data/films/flagships/types";
import { SKILL_ORBIT } from "@/data/skillOrbit";
import type { Family } from "@/data/techStack";
import type { Box, FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, BrandProvider, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { RevealWords } from "../scenes/brand/ManifestoBeats";
import { DustField } from "../scenes/brand/ParticleLogo";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { Letterbox } from "../scenes/case/shared";
import { ChapterTicks } from "../scenes/primitives";
import { FILM_FONTS, progress, useFilmLayout } from "../scenes/theme";
import { CAPABILITY_MONTAGE, capabilityIntroLayout } from "./capabilityFilmLayout";
import { PlateManifesto } from "./kit/KitScenes";

export type CapabilityFilmProps = { family: Family; language: FilmLanguage };

/**
 * Film corto de una capacidad de /estudio: la familia con su órbita y sus
 * herramientas, los casos que la demuestran (cuadro protagonista de cada film
 * insignia) y la firma. Piel del portfolio con el color de la familia.
 */

const INK = "#F3F0E8";

function capabilityBrand(color: string): CaseBrand {
  return {
    slug: "mario-morera",
    name: "Mario Morera",
    palette: { bg: "#070809", surface: "#0D1114", raised: "#12181C", line: "#232B31", text: INK, muted: "#A4A9A6", accent: color, accentSoft: color, accentDeep: color, onAccent: "#070809" },
    fonts: { display: FILM_FONTS.body, body: FILM_FONTS.body, label: FILM_FONTS.mono },
    uppercaseDisplay: false,
    logo: { mark: "", particleMode: "alpha" },
    radius: 18,
    texture: "none",
    source: "src/app/globals.css (tema oscuro del sitio) y src/data/skillOrbit.ts (color de la familia)",
  };
}

/**
 * Raíz: los colores de la marca y las tipografías del sitio. No redefine las
 * variables --ff-*: la piel las usa tal cual (redefinirlas con sí mismas las anula).
 */
function CapabilityFrame({ brand, chapters, children }: { brand: CaseBrand; chapters: FlagshipChapter[]; children: ReactNode }) {
  const { portrait } = useFilmLayout();
  const colors = Object.fromEntries(Object.entries(brandCssVars(brand)).filter(([key]) => !key.startsWith("--ff-"))) as CSSProperties;
  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...colors, background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        <DustField color={brand.palette.accent} count={36} opacity={0.12} />
        {children}
        <Letterbox portrait={portrait} />
        <ChapterTicks chapters={chapters} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
      </AbsoluteFill>
    </BrandProvider>
  );
}

/** La familia como en la órbita de /estudio: núcleo con su icono y las familias con que se combina. */
function OrbitMotif({ box, color, related, Icon }: { box: Box; color: string; related: string[]; Icon: LucideIcon }) {
  const frame = useCurrentFrame();
  const show = progress(frame, 0, 30);
  const c = box.w / 2;
  const ring = c - 14;
  const core = Math.round(box.w * 0.34);
  const turn = 200 + frame * 0.3;
  return (
    <div style={{ ...boxStyle(box), opacity: show, scale: `${0.94 + 0.06 * show}` }}>
      <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={c} cy={c} r={ring} fill="none" stroke={alpha(INK, 16)} strokeWidth={1.5} />
        <circle cx={c} cy={c} r={ring * 0.66} fill="none" stroke={alpha(color, 26)} strokeWidth={1.5} strokeDasharray="3 9" />
        {related.map((dot, index) => {
          const angle = ((turn + (index * 360) / related.length) * Math.PI) / 180;
          const x = c + ring * Math.cos(angle);
          const y = c + ring * Math.sin(angle);
          const lit = progress(frame, 24 + index * 8, 44 + index * 8);
          return (
            <g key={`${dot}-${index}`} opacity={lit}>
              <line x1={c} y1={c} x2={x} y2={y} stroke={dot} strokeOpacity={0.4} strokeWidth={1.5} strokeDasharray="3 6" />
              <circle cx={x} cy={y} r={11} fill="#0D1114" stroke={dot} strokeWidth={2} />
              <circle cx={x} cy={y} r={4} fill={dot} />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: c - core / 2,
          top: c - core / 2,
          width: core,
          height: core,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${core * 0.7}px ${alpha(color, 40)}`,
        }}
      >
        <Icon size={Math.round(core * 0.42)} strokeWidth={1.6} color="#070809" />
      </div>
    </div>
  );
}

function IntroScene({ format, duration, film }: { format: FilmFormatName; duration: number; film: CapabilityFilmData }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const layout = capabilityIntroLayout(format, film.intro);
  const Icon = SKILL_ORBIT.find((node) => node.id === film.family)!.Icon;
  const blurbIn = progress(frame, 36, 56);
  const label: CSSProperties = { fontFamily: b.fonts.label, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" };
  return (
    <Fade duration={duration}>
      <OrbitMotif box={layout.orbit} color={film.color} related={film.related} Icon={Icon} />
      <BoxText block={layout.kicker} style={{ ...label, color: b.palette.accent, opacity: progress(frame, 8, 26) }} />
      <RevealWords text={layout.title.text} from={14} size={layout.title.size} box={layout.title.box} fontFamily={b.fonts.display} weight={500} color={b.palette.text} style={{ letterSpacing: "-0.04em" }} />
      <BoxText block={layout.blurb} style={{ fontFamily: b.fonts.body, color: b.palette.muted, opacity: blurbIn, translate: `0 ${(1 - blurbIn) * 12}px` }} />
      <BoxText block={layout.toolsLabel} style={{ ...label, color: alpha(b.palette.text, 45), opacity: progress(frame, 52, 68) }} />
      {layout.chips.map((chip, index) => {
        const show = progress(frame, 58 + index * 4, 76 + index * 4);
        return (
          <div key={chip.label.id} style={{ opacity: show, translate: `0 ${(1 - show) * 10}px` }}>
            <div style={{ ...boxStyle(chip.box), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${alpha(film.color, 45)}`, background: alpha(film.color, 10) }} />
            <BoxText block={chip.label} align="center" style={{ fontFamily: b.fonts.body, fontWeight: 500, color: b.palette.text }} />
          </div>
        );
      })}
    </Fade>
  );
}

export function CapabilityFilm({ family, language }: CapabilityFilmProps) {
  const { portrait, width, height, fps } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const film = capabilityFilm(family, language);
  const { intro, cases, signature } = film.timeline;
  return (
    <CapabilityFrame brand={capabilityBrand(film.color)} chapters={film.chapters}>
      <Sequence name="Capacidad" from={intro.from} durationInFrames={intro.duration} premountFor={fps}>
        <IntroScene format={format} duration={intro.duration} film={film} />
      </Sequence>
      <Sequence name="Casos" from={cases.from} durationInFrames={cases.duration} premountFor={fps}>
        <PlateManifesto
          format={format}
          duration={cases.duration}
          asset={film.cases[0].asset}
          plates={film.cases.map((item) => ({ asset: item.asset }))}
          beats={film.cases.map((item) => ({ kicker: item.name, text: item.text }))}
          ratio={CAPABILITY_MONTAGE.ratio}
          veil={0.12}
        />
      </Sequence>
      <Sequence name="Firma" from={signature.from} durationInFrames={signature.duration} premountFor={fps}>
        <SignatureScene portrait={portrait} width={width} height={height} duration={signature.duration} />
      </Sequence>
    </CapabilityFrame>
  );
}
