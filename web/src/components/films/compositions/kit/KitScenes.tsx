import type { ReactNode } from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import type { ArchitectureBundle } from "@/data/architecture/bundle";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { brandCssVars, type CaseBrand } from "@/data/brands/caseBrands";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmAsset, FlagshipChapter } from "@/data/films/flagships/types";
import { stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import type { CameraShotSpec } from "@/lib/filmCamera";
import type { ImageSampleMode } from "@/lib/sampleImage";
import { ArchitectureScene } from "../../scenes/brand/ArchitectureScene";
import { BrandTitle, CameraReel, Fade } from "../../scenes/brand/camera";
import { CinematicPlate } from "../../scenes/brand/CinematicPlate";
import { alpha, BrandProvider, useBrand } from "../../scenes/brand/context";
import { boxStyle, BoxText } from "../../scenes/brand/dataKit";
import { FactWall } from "../../scenes/brand/FactWall";
import type { PlateCaption } from "../../scenes/brand/layout/cinematicPlate";
import { MANIFESTO_KICKER_TRACKING } from "../../scenes/brand/layout/manifestoBeats";
import { ManifestoBeats, RevealWords } from "../../scenes/brand/ManifestoBeats";
import { DustField, ParticleLogo } from "../../scenes/brand/ParticleLogo";
import { ScrollReel } from "../../scenes/brand/ScrollReel";
import { ShotStack } from "../../scenes/brand/ShotStack";
import { Letterbox } from "../../scenes/case/shared";
import { ChapterTicks } from "../../scenes/primitives";
import { progress, useFilmLayout, windowed } from "../../scenes/theme";
import { factsLayout, KIT_TITLE, kitBands, plateManifestoLayout, plateOpeningLayout, shotsLayout, siteStopFrames, siteTourLayout, type PlateOpeningSpec } from "./kitLayout";

/**
 * Kit de escenas de los films insignia: las piezas que se repiten entre
 * clientes con distinto contenido. Todo movimiento sale del frame y cada
 * escena se envuelve en Fade; las cajas vienen de kitLayout (puro y testeado).
 */

type Beat = { kicker?: string; text: string };

/** Raíz de un film insignia: marca, polvo de luz, barras de cine y marcas de capítulo. */
export function KitFrame({ brand, chapters, children, dust = { count: 40, opacity: 0.15 } }: { brand: CaseBrand; chapters: FlagshipChapter[]; children: ReactNode; dust?: { count: number; opacity: number } }) {
  const { portrait } = useFilmLayout();
  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...brandCssVars(brand), background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        <DustField color={brand.palette.accentSoft} count={dust.count} opacity={dust.opacity} />
        {children}
        <Letterbox portrait={portrait} />
        <ChapterTicks chapters={chapters} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
      </AbsoluteFill>
    </BrandProvider>
  );
}

export function KitTitle({ kicker, title, box, format, from = 6 }: { kicker: string; title: string; box: Box; format: FilmFormatName; from?: number }) {
  return <BrandTitle kicker={kicker} title={title} from={from} size={KIT_TITLE[format].size} style={{ left: box.x, top: box.y, width: box.w }} />;
}

/** Placa de panel con la piel de la marca. */
export function KitPanel({ box, glow = 0, opacity = 1 }: { box: Box; glow?: number; opacity?: number }) {
  const b = useBrand();
  return (
    <div
      style={{
        ...boxStyle(box),
        boxSizing: "border-box",
        borderRadius: b.radius,
        background: `linear-gradient(160deg, ${alpha(b.palette.raised, 90)}, ${alpha(b.palette.surface, 96)} 65%)`,
        border: `1px solid ${glow > 0 ? alpha(b.palette.accent, 30 + glow * 40) : b.palette.line}`,
        boxShadow: `0 40px 90px ${alpha("#000000", 45)}${glow > 0 ? `, 0 0 ${40 * glow}px ${alpha(b.palette.accent, 22 * glow)}` : ""}`,
        opacity,
      }}
    />
  );
}

/** Logo sobre una pastilla clara (para logos de tinta oscura sobre transparente). */
export function LogoPill({ box, src, opacity = 1, background = "#F8FAFC" }: { box: Box; src: string; opacity?: number; background?: string }) {
  return (
    <div style={{ ...boxStyle(box), boxSizing: "border-box", borderRadius: 10, background, display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
      <Img src={src} style={{ height: box.h - 12, width: "auto", maxWidth: "none" }} />
    </div>
  );
}

export type PlateOpeningTiming = { formFrom: number; formTo: number; dissolve: number; lightFrom: number; lightTo: number; textFrom: number; textOut?: number; beatsFrom?: number };

const OPENING_TIMING: PlateOpeningTiming = { formFrom: 8, formTo: 96, dissolve: 132, lightFrom: 118, lightTo: 176, textFrom: 150 };

/**
 * Apertura: el isotipo se forma en partículas sobre la placa a oscuras, la
 * placa se enciende al disolverse y entran el rótulo y la tagline. Con
 * `beats`, la tagline sale y la banda de texto pasa a un manifiesto.
 */
export function PlateOpening({
  format,
  duration,
  width,
  height,
  spec,
  asset,
  poster,
  kicker,
  tagline,
  wordmarkSrc,
  particle,
  timing = OPENING_TIMING,
  night = { from: 0.92, to: 0.5 },
  beats,
}: {
  format: FilmFormatName;
  duration: number;
  width: number;
  height: number;
  spec: PlateOpeningSpec;
  asset: FilmAsset;
  poster?: string;
  kicker: string;
  tagline: string;
  wordmarkSrc?: string;
  particle: { src: string; mode: ImageSampleMode; colors: string[]; count?: number };
  timing?: PlateOpeningTiming;
  night?: { from: number; to: number };
  beats?: Beat[];
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const layout = plateOpeningLayout(format, spec, tagline, kicker);
  const dim = night.from - (night.from - night.to) * progress(frame, timing.lightFrom, timing.lightTo);
  const textShow = timing.textOut ? windowed(frame, timing.textFrom, timing.textFrom + 18, timing.textOut - 18, timing.textOut) : progress(frame, timing.textFrom, timing.textFrom + 18);
  const beatsFrom = timing.beatsFrom ?? duration;
  const beatFrames = duration - beatsFrom;
  const slot = beats?.length ? Math.floor(beatFrames / beats.length) : 0;
  return (
    <Fade duration={duration}>
      <CinematicPlate box={layout.plateBox} asset={asset} poster={poster} focal={spec.focal} duration={duration} veilOpacity={0.55} push={0.04} align="top">
        <div style={{ position: "absolute", inset: 0, background: b.palette.bg, opacity: dim }} />
      </CinematicPlate>
      {/* Las partículas viven dentro de la placa: nunca invaden la banda del texto. */}
      <div style={{ ...boxStyle(layout.plate), overflow: "hidden", borderRadius: b.radius * 0.6 }}>
        <div style={{ position: "absolute", left: -layout.plate.x, top: -layout.plate.y, width, height }}>
          <ParticleLogo
            src={particle.src}
            mode={particle.mode}
            colors={particle.colors}
            size={layout.logoSize}
            center={layout.logoCenter}
            formFrom={timing.formFrom}
            formTo={timing.formTo}
            dissolveAt={timing.dissolve}
            count={particle.count ?? 2400}
            restAlpha={0.95}
          />
        </div>
      </div>
      <div style={{ opacity: textShow }}>
        {wordmarkSrc && layout.wordmark ? <Img src={wordmarkSrc} style={{ ...boxStyle(layout.wordmark), maxWidth: "none", opacity: progress(frame, timing.textFrom - 4, timing.textFrom + 16) }} /> : null}
        <div
          style={{
            ...boxStyle(layout.kicker),
            textAlign: layout.align,
            fontFamily: b.fonts.label,
            fontSize: layout.kickerSize,
            lineHeight: 1.2,
            fontWeight: 600,
            letterSpacing: `${MANIFESTO_KICKER_TRACKING}em`,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: b.palette.accentSoft,
            opacity: progress(frame, timing.textFrom + 6, timing.textFrom + 24),
          }}
        >
          {kicker}
        </div>
        <RevealWords text={tagline} from={timing.textFrom + 14} size={layout.taglineSize} box={layout.tagline} align={layout.align} fontFamily={b.fonts.display} weight={600} color={b.palette.text} emphasis={b.palette.accentSoft} uppercase={b.uppercaseDisplay} />
      </div>
      {beats?.length ? (
        <Sequence name="Beats" from={beatsFrom} durationInFrames={beatFrames}>
          <ManifestoBeats box={layout.text} beats={beats.map((beat, index) => ({ ...beat, from: index * slot, to: (index + 1) * slot }))} duration={beatFrames} maxLines={format === "portrait" ? 3 : 2} maxSize={format === "portrait" ? 72 : 60} align={layout.align} uniformSize />
        </Sequence>
      ) : null}
    </Fade>
  );
}

/** Una placa por frase: cada beat trae su foto o su video. */
export type ManifestoPlate = { asset: FilmAsset; poster?: string; focal?: { x: number; y: number } };

/** Frames del cruce entre una placa y la siguiente. */
const PLATE_CROSS = 14;

/**
 * Placa con manifiesto: una foto o un video en su placa y las frases, de a una,
 * al lado. Con `plates`, cada frase llega con su propia placa (mismo encuadre;
 * la siguiente entra encima de la anterior).
 */
export function PlateManifesto({ format, duration, asset, poster, caption, focal, beats, veil = 0.4, ratio, plates }: { format: FilmFormatName; duration: number; asset: FilmAsset; poster?: string; caption?: PlateCaption; focal?: { x: number; y: number }; beats: Beat[]; veil?: number; ratio?: [number, number]; plates?: ManifestoPlate[] }) {
  const frame = useCurrentFrame();
  const layout = plateManifestoLayout(format, asset, caption, focal, ratio);
  const slot = Math.floor(duration / beats.length);
  return (
    <Fade duration={duration}>
      {plates?.length ? (
        plates.map((plate, index) => {
          const from = Math.max(0, index * slot - PLATE_CROSS);
          const length = index === plates.length - 1 ? duration - from : (index + 1) * slot - from;
          return (
            <Sequence key={plate.asset.src} name={`Placa ${index + 1}`} from={from} durationInFrames={length} layout="none">
              <div style={{ position: "absolute", inset: 0, opacity: index === 0 ? 1 : progress(frame, index * slot - PLATE_CROSS, index * slot) }}>
                <CinematicPlate box={layout.plateBox} asset={plate.asset} poster={plate.poster} focal={plate.focal ?? focal} duration={length} veilOpacity={veil} push={0.04} />
              </div>
            </Sequence>
          );
        })
      ) : (
        <CinematicPlate box={layout.plateBox} asset={asset} poster={poster} focal={focal} caption={caption} captionFrom={20} duration={duration} veilOpacity={veil} push={0.04} />
      )}
      <ManifestoBeats box={layout.text} beats={beats.map((beat, index) => ({ ...beat, from: index * slot + (index === 0 ? 12 : 0), to: (index + 1) * slot }))} duration={duration} maxLines={3} maxSize={format === "portrait" ? 68 : 60} uniformSize />
    </Fade>
  );
}

/** El sitio en producción de arriba abajo, con la lista de lo que hace cada parada. */
export function SiteTour({ format, duration, asset, poster, host, path, stops, labels, kicker, title, reelHeight }: { format: FilmFormatName; duration: number; asset: FilmAsset; poster?: string; host: string; path: string; stops: number[]; labels: string[]; kicker: string; title: string; reelHeight?: number }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const layout = siteTourLayout(format, labels, reelHeight);
  const stopAt = siteStopFrames(duration, stops.length);
  return (
    <Fade duration={duration}>
      <KitTitle kicker={kicker} title={title} box={layout.title} format={format} />
      <ScrollReel box={layout.reel} asset={asset} poster={poster} host={host} path={path} duration={duration} stops={stops} />
      {layout.items.map((item, index) => {
        const show = progress(frame, 24 + index * 10, 44 + index * 10);
        const next = stopAt[index + 1];
        const lit = progress(frame, stopAt[index], stopAt[index] + 16) * (next === undefined ? 1 : 1 - progress(frame, next, next + 16));
        return (
          <div key={item.label.id} style={{ opacity: show * (0.42 + 0.58 * lit), translate: `${(1 - show) * 12}px 0` }}>
            <div style={{ position: "absolute", left: item.label.box.x - 14, top: item.label.box.y, width: 3, height: item.label.box.h, borderRadius: 3, background: b.palette.accent, opacity: lit, transformOrigin: "top", scale: `1 ${lit}` }} />
            <BoxText block={item.index} style={{ fontFamily: b.fonts.label, fontWeight: 700, color: lit > 0.5 ? b.palette.accentSoft : b.palette.muted, fontVariantNumeric: "tabular-nums" }} />
            <BoxText block={item.label} style={{ fontFamily: b.fonts.display, fontWeight: 600, color: b.palette.text }} />
            {index < layout.items.length - 1 ? <div style={{ ...boxStyle(item.rule), background: b.palette.line }} /> : null}
          </div>
        );
      })}
    </Fade>
  );
}

/** Pasos reales de un flujo (capturas) que se empujan uno a otro en una sola ventana. */
export function ShotsBeat({ format, duration, kicker, title, shots, note }: { format: FilmFormatName; duration: number; kicker: string; title: string; shots: Array<FilmAsset & { label: string }>; note?: string }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const layout = shotsLayout(format, note);
  return (
    <Fade duration={duration}>
      <KitTitle kicker={kicker} title={title} box={layout.title} format={format} />
      <ShotStack box={layout.main} shots={shots} duration={duration} frame="card" startAt={16} />
      {layout.note ? (
        <>
          <div style={{ position: "absolute", left: layout.note.box.x - 22, top: layout.note.box.y + layout.note.size * 0.45, width: 10, height: 10, borderRadius: 99, background: b.palette.accent, opacity: progress(frame, 40, 60) }} />
          <BoxText block={layout.note} style={{ fontFamily: b.fonts.body, color: b.palette.muted, opacity: progress(frame, 40, 60) }} />
        </>
      ) : null}
    </Fade>
  );
}

/**
 * Pantallas reales de un flujo en una sola ventana: cada paso empuja al
 * anterior, la cámara se acerca a lo que se eligió y la nota se rotula en la
 * barra (nunca sobre la captura). Todas las capturas comparten proporción.
 */
export function ReelBeat({ format, duration, kicker, title, shots, aspect, nativeWidth, host, noteLabels, srcFor, note }: { format: FilmFormatName; duration: number; kicker: string; title: string; shots: CameraShotSpec[]; aspect: number; nativeWidth: number; host: string; noteLabels: Record<string, string>; srcFor: (shot: CameraShotSpec) => string; note?: string }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const layout = shotsLayout(format, note);
  return (
    <Fade duration={duration}>
      <KitTitle kicker={kicker} title={title} box={layout.title} format={format} />
      <CameraReel shots={shots} frameBox={layout.main} imageAspect={aspect} nativeWidth={nativeWidth} host={host} noteLabels={noteLabels} srcFor={srcFor} />
      {layout.note ? (
        <>
          <div style={{ position: "absolute", left: layout.note.box.x - 22, top: layout.note.box.y + layout.note.size * 0.45, width: 10, height: 10, borderRadius: 99, background: b.palette.accent, opacity: progress(frame, 40, 60) }} />
          <BoxText block={layout.note} style={{ fontFamily: b.fonts.body, color: b.palette.muted, opacity: progress(frame, 40, 60) }} />
        </>
      ) : null}
    </Fade>
  );
}

/** Arquitectura de Archify con sus vistas guiadas y el pulso de datos. */
export function ArchitectureBeat({ format, duration, language, bundle, kicker, title, maxZoom = 1.7 }: { format: FilmFormatName; duration: number; language: FilmLanguage; bundle: ArchitectureBundle; kicker: string; title: string; maxZoom?: number }) {
  const portrait = format === "portrait";
  const { title: titleBox, body } = kitBands(format);
  const architecture = resolveArchitecture(bundle, language, format);
  const parts = stackBands(body, [{ id: "diagram", flex: 1 }, { id: "caption", h: portrait ? 170 : 92 }], portrait ? 20 : 14);
  const build = 75;
  const views = architecture.diagram.meta.views?.length || 3;
  return (
    <Fade duration={duration}>
      <KitTitle kicker={kicker} title={title} box={titleBox} format={format} />
      <ArchitectureScene
        diagram={architecture.diagram}
        layout={architecture.layout}
        area={parts.diagram}
        caption={{ x: parts.caption.x, y: parts.caption.y, w: parts.caption.w, size: portrait ? 28 : 20 }}
        maxZoom={maxZoom}
        buildFrames={build}
        viewFrames={Math.floor((duration - build) / views)}
      />
    </Fade>
  );
}

/** Cifras verificadas (cada una con su fuente) y, opcional, la línea de créditos. */
export function FactsBeat({ format, duration, language, kicker, title, facts, credit }: { format: FilmFormatName; duration: number; language: FilmLanguage; kicker: string; title: string; facts: Array<{ value: string; label: string; source: string }>; credit?: { text: string; logo?: FilmAsset } }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const layout = factsLayout(format, credit ? { text: credit.text, logo: credit.logo } : undefined);
  const creditIn = progress(frame, 96, 120);
  return (
    <Fade duration={duration}>
      <KitTitle kicker={kicker} title={title} box={layout.title} format={format} />
      <FactWall box={layout.facts} duration={duration} language={language} facts={facts} />
      {credit?.logo && layout.logo ? <LogoPill box={layout.logo} src={credit.logo.src} opacity={creditIn} /> : null}
      {layout.credit ? <BoxText block={layout.credit} style={{ fontFamily: b.fonts.body, fontWeight: 500, color: b.palette.muted, opacity: creditIn }} /> : null}
    </Fade>
  );
}
