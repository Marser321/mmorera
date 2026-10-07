import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { bundle as adArchitecture } from "@/data/architecture/bundles/ad-media-solution";
import { brandCssVars, CASE_BRANDS } from "@/data/brands/caseBrands";
import { AD_ASSETS, AD_CHAPTERS, AD_COPY, AD_HOST, AD_SITE_STOPS, AD_TIMELINE, adFx } from "@/data/films/flagships/adMedia";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { ArchitectureScene } from "../scenes/brand/ArchitectureScene";
import { BrandTitle, Fade } from "../scenes/brand/camera";
import { CinematicPlate } from "../scenes/brand/CinematicPlate";
import { alpha, BrandProvider, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText, Glyph, SampleTag } from "../scenes/brand/dataKit";
import { FactWall } from "../scenes/brand/FactWall";
import type { TextBlock } from "../scenes/brand/layout/dataText";
import { MANIFESTO_KICKER_TRACKING } from "../scenes/brand/layout/manifestoBeats";
import { ManifestoBeats, RevealWords } from "../scenes/brand/ManifestoBeats";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { ScrollReel } from "../scenes/brand/ScrollReel";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { Letterbox } from "../scenes/case/shared";
import { ChapterTicks } from "../scenes/primitives";
import { EASE_IN_OUT, progress, useFilmLayout, windowed } from "../scenes/theme";
import {
  AD_GRID_FOCAL,
  AD_HERO_SLOT,
  AD_TITLE,
  adAllianceLayout,
  adBands,
  adEngineeringLayout,
  adOpeningLayout,
  adPipelineLayout,
  adPipelineTiming,
  adSiteLayout,
  adSiteStopFrames,
  type AdCard,
} from "./adMediaFilmLayout";

export type AdMediaFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["ad-media-solution"];

/** Verde de "respondido" y de oportunidad ganada (semáforo de estado del tablero). */
const SUCCESS = "#34D399";

/**
 * "Marketing y ventas en una sola operación": AD Media Solution con su propia
 * estructura (navy y azul eléctrico, Montserrat). El isotipo se forma sobre su
 * grilla de construcción, la alianza (la agencia vende; la ingeniería es de
 * marca blanca), el funnel en producción, el Speed-to-Lead con el pipeline de
 * 5 etapas (escena protagonista, datos de ejemplo), la arquitectura de
 * Archify, las cifras verificadas y la firma.
 *
 * Cada escena recibe cajas calculadas (adMediaFilmLayout): el título vive en su
 * banda, los medios en sus placas y el tablero en sus columnas o filas.
 */
export function AdMediaFilm({ language }: AdMediaFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const T = AD_TIMELINE;

  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...brandCssVars(brand), background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        <DustField color={brand.palette.accentSoft} count={40} opacity={0.15} />

        <Sequence name="Isotipo" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
          <Opening language={language} format={format} duration={T.opening.duration} width={width} height={height} />
        </Sequence>

        <Sequence name="La alianza" from={T.alliance.from} durationInFrames={T.alliance.duration} premountFor={fps}>
          <Alliance language={language} format={format} duration={T.alliance.duration} />
        </Sequence>

        <Sequence name="El funnel" from={T.site.from} durationInFrames={T.site.duration} premountFor={fps}>
          <Site language={language} format={format} duration={T.site.duration} />
        </Sequence>

        <Sequence name="Speed-to-Lead" from={T.pipeline.from} durationInFrames={T.pipeline.duration} premountFor={fps}>
          <Pipeline language={language} format={format} duration={T.pipeline.duration} />
        </Sequence>

        <Sequence name="Arquitectura" from={T.architecture.from} durationInFrames={T.architecture.duration} premountFor={fps}>
          <Architecture language={language} format={format} duration={T.architecture.duration} />
        </Sequence>

        <Sequence name="Ingeniería" from={T.engineering.from} durationInFrames={T.engineering.duration} premountFor={fps}>
          <Engineering language={language} format={format} duration={T.engineering.duration} />
        </Sequence>

        <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
          <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
        </Sequence>

        <Letterbox portrait={portrait} />
        <ChapterTicks chapters={AD_CHAPTERS} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
      </AbsoluteFill>
    </BrandProvider>
  );
}

type SceneProps = { language: FilmLanguage; format: FilmFormatName; duration: number };

function SceneTitle({ kicker, title, box, format, from = 6 }: { kicker: string; title: string; box: Box; format: FilmFormatName; from?: number }) {
  return <BrandTitle kicker={kicker} title={title} from={from} size={AD_TITLE[format].size} style={{ left: box.x, top: box.y, width: box.w }} />;
}

/** Placa de panel con la piel de la marca. */
function PanelPlate({ box, opacity = 1 }: { box: Box; opacity?: number }) {
  const b = useBrand();
  return (
    <div
      style={{
        ...boxStyle(box),
        boxSizing: "border-box",
        borderRadius: b.radius,
        background: `linear-gradient(160deg, ${alpha(b.palette.raised, 90)}, ${alpha(b.palette.surface, 96)} 65%)`,
        border: `1px solid ${b.palette.line}`,
        boxShadow: `0 40px 90px ${alpha("#000000", 45)}`,
        opacity,
      }}
    />
  );
}

/** Emblema del CRM de marca blanca sobre una pastilla clara (el logo es tinta oscura sobre transparente). */
function CrmBadge({ box, opacity = 1 }: { box: Box; opacity?: number }) {
  return (
    <div style={{ ...boxStyle(box), boxSizing: "border-box", borderRadius: 10, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", opacity }}>
      <Img src={AD_ASSETS.logoCrm.src} style={{ height: box.h - 12, width: "auto", maxWidth: "none" }} />
    </div>
  );
}

/** Tiempos de la apertura: el isotipo se forma a oscuras sobre su grilla y la grilla se enciende al disolverse. */
const OPENING = { formFrom: 8, formTo: 96, dissolve: 132, lightFrom: 118, lightTo: 176, wordmark: 146, kicker: 156, tagline: 166 } as const;

/** 1 · El "ad" en partículas sobre la grilla de construcción del manual de marca. */
function Opening({ language, format, duration, width, height }: SceneProps & { width: number; height: number }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = AD_COPY[language];
  const portrait = format === "portrait";
  const layout = adOpeningLayout(format, copy.openingTagline, copy.openingKicker);
  const align = portrait ? "center" : "left";
  // La grilla es azul plena: el velo la deja como textura detrás del isotipo.
  const night = 0.92 - 0.42 * progress(frame, OPENING.lightFrom, OPENING.lightTo);
  const wordmarkIn = progress(frame, OPENING.wordmark, OPENING.wordmark + 20);
  return (
    <Fade duration={duration}>
      <CinematicPlate box={layout.plateBox} asset={layout.asset} focal={AD_GRID_FOCAL} duration={duration} veilOpacity={0.6} push={0.04} align="top">
        <div style={{ position: "absolute", inset: 0, background: b.palette.bg, opacity: night }} />
      </CinematicPlate>
      <div style={{ ...boxStyle(layout.plate), overflow: "hidden", borderRadius: b.radius * 0.6 }}>
        <div style={{ position: "absolute", left: -layout.plate.x, top: -layout.plate.y, width, height }}>
          <ParticleLogo
            src={b.logo.mark}
            mode={b.logo.particleMode}
            colors={["#81E7FF", b.palette.accentSoft, "#488EFF", b.palette.accent]}
            size={layout.logoSize}
            center={layout.logoCenter}
            formFrom={OPENING.formFrom}
            formTo={OPENING.formTo}
            dissolveAt={OPENING.dissolve}
            count={2400}
            restAlpha={0.95}
          />
        </div>
      </div>
      <Img src={AD_ASSETS.wordmark.src} style={{ ...boxStyle(layout.wordmark), maxWidth: "none", opacity: wordmarkIn, translate: `0 ${(1 - wordmarkIn) * 8}px` }} />
      <div
        style={{
          ...boxStyle(layout.kicker),
          textAlign: align,
          fontFamily: b.fonts.label,
          fontSize: layout.kickerSize,
          lineHeight: 1.2,
          fontWeight: 600,
          letterSpacing: `${MANIFESTO_KICKER_TRACKING}em`,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: b.palette.accentSoft,
          opacity: progress(frame, OPENING.kicker, OPENING.kicker + 18),
        }}
      >
        {copy.openingKicker}
      </div>
      <RevealWords
        text={copy.openingTagline}
        from={OPENING.tagline}
        size={layout.taglineSize}
        box={layout.tagline}
        align={align}
        fontFamily={b.fonts.display}
        weight={700}
        color={b.palette.text}
        emphasis={b.palette.accentSoft}
      />
    </Fade>
  );
}

/** 2 · La alianza: el CEO de la agencia en placa y quién hace qué, en tres beats. */
function Alliance({ language, format, duration }: SceneProps) {
  const copy = AD_COPY[language];
  const portrait = format === "portrait";
  const layout = adAllianceLayout(format, copy);
  const slot = Math.floor(duration / copy.allianceBeats.length);
  return (
    <Fade duration={duration}>
      <CinematicPlate box={layout.plateBox} asset={AD_ASSETS.ceo} focal={{ x: 0.6, y: 0.32 }} caption={layout.caption} captionFrom={20} duration={duration} veilOpacity={0.4} push={0.04} />
      <ManifestoBeats
        box={layout.text}
        beats={copy.allianceBeats.map((beat, index) => ({ ...beat, from: index * slot + (index === 0 ? 12 : 0), to: (index + 1) * slot }))}
        duration={duration}
        maxLines={3}
        maxSize={portrait ? 68 : 60}
        uniformSize
      />
    </Fade>
  );
}

/** 3 · El sitio real de arriba abajo y, al lado, qué hace cada parada del recorrido. */
function Site({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = AD_COPY[language];
  const layout = adSiteLayout(format, copy);
  const stopAt = adSiteStopFrames(duration, AD_SITE_STOPS.length);
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.siteKicker} title={copy.siteTitle} box={layout.title} format={format} />
      <ScrollReel box={layout.reel} asset={AD_ASSETS.site} host={AD_HOST} path="/" duration={duration} stops={[...AD_SITE_STOPS]} />
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

/** Tarjeta del tablero: nombre arriba y etiqueta debajo, dibujada en coordenadas relativas a su marco. */
function BoardCard({ card, tag, hero = false, glow = 0, won = 0 }: { card: AdCard; tag: string; hero?: boolean; glow?: number; won?: number }) {
  const b = useBrand();
  const rel = (block: TextBlock): TextBlock => ({ ...block, box: { ...block.box, x: block.box.x - card.frame.x, y: block.box.y - card.frame.y } });
  const chip = card.tag.frame;
  const accent = won > 0 ? SUCCESS : b.palette.accent;
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxSizing: "border-box",
          borderRadius: Math.round(b.radius * 0.7),
          background: hero ? `linear-gradient(160deg, ${alpha(accent, 26)}, ${b.palette.surface} 80%)` : `linear-gradient(165deg, ${b.palette.raised}, ${b.palette.surface} 75%)`,
          border: `1px solid ${hero ? alpha(accent, 55 + glow * 45) : b.palette.line}`,
          boxShadow: hero ? `0 ${8 + glow * 14}px ${24 + glow * 26}px ${alpha("#000000", 40)}, 0 0 ${18 + glow * 30}px ${alpha(accent, 25 + glow * 30)}` : `0 6px 18px ${alpha("#000000", 30)}`,
        }}
      />
      <BoxText block={rel(card.name)} style={{ fontFamily: b.fonts.display, fontWeight: 600, color: b.palette.text }} />
      {card.meta ? <BoxText block={rel(card.meta)} style={{ fontFamily: b.fonts.body, color: b.palette.muted }} /> : null}
      <div style={{ position: "absolute", left: chip.x - card.frame.x, top: chip.y - card.frame.y, width: chip.w, height: chip.h, boxSizing: "border-box", borderRadius: 999, border: `1px solid ${alpha(accent, 45)}`, background: alpha(accent, hero ? 18 : 10) }} />
      <BoxText block={{ ...rel(card.tag.text), text: tag }} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 600, color: hero && won > 0 ? SUCCESS : b.palette.accentSoft }} />
    </>
  );
}

/** 4 · Speed-to-Lead: el lead de pauta recibe respuesta en segundos y su oportunidad recorre las 5 etapas (datos de ejemplo). */
function Pipeline({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = AD_COPY[language];
  const layout = adPipelineLayout(format, copy);
  const { speed, board, caption } = layout;
  const lastSecond = Math.max(...copy.leadEvents.map((event) => event.at));
  const T = adPipelineTiming(duration, copy.stages.length, lastSecond);

  // Reloj de la muestra: corre hasta el último disparo y se detiene ("respondido").
  const elapsed = Math.min(lastSecond, Math.max(0, (frame - T.clockFrom) / T.secondFrames));
  const clockText = `00:${String(Math.floor(elapsed)).padStart(2, "0")}`;
  const replied = progress(frame, T.clockStop + 4, T.clockStop + 22);
  const toastIn = progress(frame, T.toastIn, T.toastIn + 18);
  const entered = progress(frame, T.entry, T.entry + T.entryFrames, EASE_IN_OUT);
  // Cuando el lead pasa al tablero, el panel queda en segundo plano.
  const speedDim = 1 - 0.45 * progress(frame, T.entry, T.entry + 30);

  // Etapa de la protagonista: asentada en `settled`; viajando durante cada movimiento.
  const moving = T.moves.findIndex((start) => frame >= start && frame < start + T.moveFrames);
  const settled = T.moves.filter((start) => frame >= start + T.moveFrames).length;
  const at = moving >= 0 ? moving : settled;
  const travel = moving >= 0 ? progress(frame, T.moves[moving] + 6, T.moves[moving] + T.moveFrames - 6, EASE_IN_OUT) : 0;
  const lift = moving >= 0 ? windowed(frame, T.moves[moving], T.moves[moving] + 8, T.moves[moving] + T.moveFrames - 8, T.moves[moving] + T.moveFrames) : 0;
  const lastStage = copy.stages.length - 1;
  const won = settled === lastStage ? progress(frame, T.moves[lastStage - 1] + T.moveFrames, T.moves[lastStage - 1] + T.moveFrames + 20) : 0;
  const heroFrom = board.columns[at].slots[AD_HERO_SLOT];
  const heroTo = board.columns[Math.min(lastStage, at + 1)].slots[AD_HERO_SLOT];
  const heroBox: Box = {
    x: heroFrom.frame.x + (heroTo.frame.x - heroFrom.frame.x) * travel,
    y: heroFrom.frame.y + (heroTo.frame.y - heroFrom.frame.y) * travel,
    w: heroFrom.frame.w,
    h: heroFrom.frame.h,
  };
  // Entrada: la tarjeta sale del lead entrante y aterriza en "Lead nuevo".
  const entryDx = (speed.toast.frame.x - heroBox.x) * (1 - entered);
  const entryDy = (speed.toast.frame.y - heroBox.y) * (1 - entered);
  const arrivedFlash = T.moves.reduce((flash, start) => Math.max(flash, windowed(frame, start + T.moveFrames - 4, start + T.moveFrames + 4, start + T.moveFrames + 10, start + T.moveFrames + 40)), 0);

  // Leyenda: la automatización de la etapa actual, una a la vez.
  const captionStarts = [T.clockFrom, ...T.moves.map((start) => start + T.moveFrames - 4)];
  const ringR = speed.ring.w / 2 - 6;
  const circumference = 2 * Math.PI * ringR;

  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.pipelineKicker} title={copy.pipelineTitle} box={layout.title} format={format} />

      {/* Panel Speed-to-Lead */}
      <div style={{ position: "absolute", inset: 0, opacity: progress(frame, 4, 26) * speedDim }}>
        <PanelPlate box={speed.frame} />
        <BoxText block={speed.title} style={{ fontFamily: b.fonts.label, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: b.palette.accent }} />
        <div style={{ opacity: toastIn * (1 - 0.5 * entered), translate: `0 ${(1 - toastIn) * -14}px` }}>
          <div style={{ ...boxStyle(speed.toast.frame), boxSizing: "border-box", borderRadius: Math.round(b.radius * 0.7), background: alpha(b.palette.accent, 12), border: `1px solid ${alpha(b.palette.accent, 50)}`, boxShadow: `0 0 ${24 * windowed(frame, T.toastIn, T.toastIn + 10, T.toastIn + 30, T.toastIn + 60)}px ${alpha(b.palette.accent, 50)}` }} />
          <div style={{ ...boxStyle(speed.toast.source.frame), boxSizing: "border-box", borderRadius: 999, background: alpha("#1877F2", 30), border: `1px solid ${alpha("#1877F2", 70)}` }} />
          <BoxText block={speed.toast.source.text} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 700, color: b.palette.text }} />
          <BoxText block={speed.toast.name} style={{ fontFamily: b.fonts.display, fontWeight: 700, color: b.palette.text }} />
          <BoxText block={speed.toast.meta} style={{ fontFamily: b.fonts.body, color: b.palette.muted }} />
        </div>
        {/* Reloj: la vuelta completa son los 30 s de la ventana; el arco muestra lo que tardó la respuesta. */}
        <svg viewBox={`0 0 ${speed.ring.w} ${speed.ring.h}`} width={speed.ring.w} height={speed.ring.h} style={{ ...boxStyle(speed.ring), overflow: "visible", opacity: progress(frame, T.clockFrom - 16, T.clockFrom) }}>
          <circle cx={speed.ring.w / 2} cy={speed.ring.h / 2} r={ringR} fill={alpha(b.palette.bg, 70)} stroke={b.palette.line} strokeWidth={6} />
          <circle
            cx={speed.ring.w / 2}
            cy={speed.ring.h / 2}
            r={ringR}
            fill="none"
            stroke={replied > 0.5 ? SUCCESS : b.palette.accent}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${(elapsed / 30) * circumference} ${circumference}`}
            transform={`rotate(-90 ${speed.ring.w / 2} ${speed.ring.h / 2})`}
          />
        </svg>
        <BoxText block={{ ...speed.value, text: clockText }} align="center" style={{ fontFamily: b.fonts.display, fontWeight: 700, color: b.palette.text, fontVariantNumeric: "tabular-nums", opacity: progress(frame, T.clockFrom - 16, T.clockFrom) }} />
        <BoxText block={speed.replied} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 700, color: SUCCESS, opacity: replied }} />
        <BoxText block={speed.window} align="center" style={{ fontFamily: b.fonts.body, color: b.palette.muted, opacity: progress(frame, T.clockFrom, T.clockFrom + 18) }} />
        {speed.events.map((event, index) => {
          const fireAt = T.clockFrom + copy.leadEvents[index].at * T.secondFrames;
          const lit = progress(frame, fireAt, fireAt + 10);
          return (
            <div key={event.label.id} style={{ opacity: progress(frame, T.clockFrom - 10 + index * 4, T.clockFrom + 8 + index * 4) }}>
              <div style={{ ...boxStyle(event.dot), borderRadius: 99, background: lit > 0.5 ? b.palette.accent : "transparent", border: `2px solid ${lit > 0.02 ? b.palette.accent : b.palette.line}`, boxSizing: "border-box", boxShadow: lit > 0 && lit < 1 ? `0 0 0 ${lit * 6}px ${alpha(b.palette.accent, (1 - lit) * 50)}` : undefined }} />
              <BoxText block={event.time} style={{ fontFamily: b.fonts.label, fontWeight: 700, color: lit > 0.5 ? b.palette.accentSoft : b.palette.muted, fontVariantNumeric: "tabular-nums" }} />
              <BoxText block={event.label} style={{ fontFamily: b.fonts.body, color: lit > 0.5 ? b.palette.text : b.palette.muted }} />
            </div>
          );
        })}
      </div>

      {/* Tablero de oportunidades */}
      <div style={{ position: "absolute", inset: 0, opacity: progress(frame, 10, 34) }}>
        <PanelPlate box={board.frame} />
        <CrmBadge box={board.logo} />
        <BoxText block={board.title} style={{ fontFamily: b.fonts.display, fontWeight: 600, color: b.palette.text }} />
        <SampleTag block={board.sample} opacity={progress(frame, 24, 40)} />
        {board.columns.map((column, stage) => {
          const heroHere = entered > 0.5 && moving < 0 && settled === stage ? 1 : moving === stage ? 1 : 0;
          const count = 2 + (entered > 0.5 ? heroHere : 0);
          const show = progress(frame, 14 + stage * 5, 30 + stage * 5);
          const final = stage === lastStage;
          return (
            <div key={column.label.id} style={{ opacity: show }}>
              <div style={{ ...boxStyle(column.frame), boxSizing: "border-box", borderRadius: Math.round(b.radius * 0.8), background: alpha(b.palette.bg, 55), border: `1px solid ${alpha(b.palette.line, 80)}` }} />
              <BoxText block={column.label} style={{ fontFamily: b.fonts.label, fontWeight: 600, color: final ? SUCCESS : b.palette.text }} />
              <div style={{ ...boxStyle(column.count.frame), boxSizing: "border-box", borderRadius: 999, background: alpha(b.palette.accent, 14), border: `1px solid ${alpha(b.palette.accent, 30)}` }} />
              <BoxText block={{ ...column.count.text, text: String(count) }} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 700, color: b.palette.accentSoft, fontVariantNumeric: "tabular-nums" }} />
              {/* Carril de la protagonista: un hueco punteado donde puede caer. */}
              <div style={{ ...boxStyle(column.slots[AD_HERO_SLOT].frame), boxSizing: "border-box", borderRadius: Math.round(b.radius * 0.7), border: `1px dashed ${alpha(b.palette.line, 90)}`, opacity: 0.7 }} />
              {column.slots.slice(0, AD_HERO_SLOT).map((card, slot) => (
                <div key={card.name.id} style={{ ...boxStyle(card.frame), opacity: 0.72 * progress(frame, 22 + stage * 5 + slot * 4, 40 + stage * 5 + slot * 4) }}>
                  <BoardCard card={card} tag={copy.boardCards[stage][slot].tag} />
                </div>
              ))}
            </div>
          );
        })}
        {/* La protagonista: sale del lead entrante y recorre su carril, etapa por etapa. */}
        {entered > 0 ? (
          <div style={{ ...boxStyle(heroBox), zIndex: 3, opacity: entered, translate: `${entryDx}px ${entryDy}px`, scale: `${1 + lift * 0.05}` }}>
            <BoardCard card={heroFrom} tag={copy.heroTags[settled]} hero glow={Math.max(lift, arrivedFlash)} won={won} />
            {won > 0 ? <Glyph kind="check" box={{ x: heroBox.w - 30, y: 8, w: 22, h: 22 }} color={SUCCESS} draw={won} weight={3} /> : null}
          </div>
        ) : null}
      </div>

      {/* Leyenda: qué automatización dispara cada etapa. */}
      <div style={{ position: "absolute", inset: 0, opacity: progress(frame, T.clockFrom - 10, T.clockFrom + 10) }}>
        <div style={{ ...boxStyle(caption.frame), boxSizing: "border-box", borderRadius: 999, background: alpha(b.palette.accent, 10), border: `1px solid ${alpha(b.palette.accent, 30)}` }} />
        {copy.automations.map((text, index) => {
          const start = captionStarts[index];
          const end = captionStarts[index + 1] ?? duration + 20;
          const show = windowed(frame, start, start + 12, end - 10, end);
          return show > 0 ? (
            <BoxText key={text} block={{ kind: "text", id: `caption.${index}`, box: caption.text, text, size: caption.size, lines: caption.lines, glyph: 0.58 }} align="center" style={{ fontFamily: b.fonts.body, fontWeight: 600, color: index === copy.automations.length - 1 ? SUCCESS : b.palette.text, opacity: show }} />
          ) : null;
        })}
      </div>
    </Fade>
  );
}

/** 5 · Arquitectura de CRM y marca blanca: tres vistas guiadas con el pulso de datos de Archify. */
function Architecture({ language, format, duration }: SceneProps) {
  const copy = AD_COPY[language];
  const portrait = format === "portrait";
  const { title, body } = adBands(format);
  const architecture = resolveArchitecture(adArchitecture, language, format);
  const parts = stackBands(body, [{ id: "diagram", flex: 1 }, { id: "caption", h: portrait ? 170 : 92 }], portrait ? 20 : 14);
  const build = 75;
  const views = architecture.diagram.meta.views?.length || 3;
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.archKicker} title={copy.archTitle} box={title} format={format} />
      <ArchitectureScene
        diagram={architecture.diagram}
        layout={architecture.layout}
        area={parts.diagram}
        caption={{ x: parts.caption.x, y: parts.caption.y, w: parts.caption.w, size: portrait ? 28 : 20 }}
        maxZoom={1.7}
        buildFrames={build}
        viewFrames={Math.floor((duration - build) / views)}
      />
    </Fade>
  );
}

/** 6 · Ingeniería: las cifras verificadas y quién hizo qué. */
function Engineering({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = AD_COPY[language];
  const layout = adEngineeringLayout(format, copy.creditLine);
  const creditIn = progress(frame, 96, 120);
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.engineeringKicker} title={copy.engineeringTitle} box={layout.title} format={format} />
      <FactWall box={layout.facts} duration={duration} language={language} facts={copy.engineeringFacts.map((fact) => ({ value: `${adFx(fact.key, language)}${fact.unit}`, label: fact.label, source: fact.source }))} />
      <CrmBadge box={layout.logo} opacity={creditIn} />
      <BoxText block={layout.credit} style={{ fontFamily: b.fonts.body, fontWeight: 500, color: b.palette.muted, opacity: creditIn }} />
    </Fade>
  );
}
