import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { bundle as fenixArchitecture } from "@/data/architecture/bundles/fenix-medical-center";
import { brandCssVars, CASE_BRANDS } from "@/data/brands/caseBrands";
import { FENIX_ASSETS, FENIX_CHAPTERS, FENIX_COPY, FENIX_FACTS, FENIX_HOST, FENIX_TIMELINE, fx } from "@/data/films/flagships/fenix";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea, splitColumns, stackBands, type Box } from "@/lib/filmLayout";
import { ArchitectureScene } from "../scenes/brand/ArchitectureScene";
import { BrandTitle, Fade } from "../scenes/brand/camera";
import { ChecklistGrid } from "../scenes/brand/ChecklistGrid";
import { CinematicPlate } from "../scenes/brand/CinematicPlate";
import { alpha, BrandProvider, useBrand } from "../scenes/brand/context";
import { EvidenceLedger } from "../scenes/brand/EvidenceLedger";
import { FactWall } from "../scenes/brand/FactWall";
import { KeywordSearch } from "../scenes/brand/KeywordSearch";
import { ManifestoBeats, RevealWords } from "../scenes/brand/ManifestoBeats";
import { MechanismTriptych } from "../scenes/brand/MechanismTriptych";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { ScriptTimeline } from "../scenes/brand/ScriptTimeline";
import { ScrollReel } from "../scenes/brand/ScrollReel";
import { ShotStack } from "../scenes/brand/ShotStack";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { Letterbox } from "../scenes/case/shared";
import { ChapterTicks } from "../scenes/primitives";
import { progress, useFilmLayout, windowed } from "../scenes/theme";
import {
  fenixOpeningLayout,
  fenixMechanismLayout,
  fenixDoseStripLayout,
  fenixSiteNoteLayout,
  fenixEngineeringLayout,
} from "./fenixFilmLayout";

export type FenixFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["fenix-medical-center"];

/**
 * "Donde tu salud renace": Fenix Medical Center con su propia estructura
 * (obsidiana y latón, Fraunces y Manrope). El fénix se forma sobre el
 * corredor, la investigación antes que el diseño, el registro de afirmaciones,
 * el posicionamiento, el sitio y la reserva, la arquitectura con su frontera de
 * compliance, el Cerebro de contenido, la ingeniería y la firma.
 *
 * Cada escena recibe cajas calculadas (lib/filmLayout): el título vive en su
 * banda, los medios en sus placas y las leyendas en bandas propias.
 */
export function FenixFilm({ language }: FenixFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format = portrait ? "portrait" : "landscape";
  const safe = safeArea(format);
  const T = FENIX_TIMELINE;
  const titleBand = portrait ? 168 : 96;
  const bands = stackBands(safe, [{ id: "title", h: titleBand }, { id: "body", flex: 1 }], portrait ? 28 : 22);

  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...brandCssVars(brand), background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        <DustField color={brand.palette.accentSoft} count={36} opacity={0.14} />

        <Sequence name="Renacer" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
          <Opening language={language} width={width} height={height} portrait={portrait} duration={T.opening.duration} />
        </Sequence>

        <Sequence name="La investigación" from={T.mechanism.from} durationInFrames={T.mechanism.duration} premountFor={fps}>
          <Mechanism language={language} bands={bands} portrait={portrait} duration={T.mechanism.duration} />
        </Sequence>

        <Sequence name="Registro de afirmaciones" from={T.evidence.from} durationInFrames={T.evidence.duration} premountFor={fps}>
          <Evidence language={language} bands={bands} portrait={portrait} duration={T.evidence.duration} />
        </Sequence>

        <Sequence name="Posicionamiento" from={T.positioning.from} durationInFrames={T.positioning.duration} premountFor={fps}>
          <Positioning language={language} safe={safe} portrait={portrait} duration={T.positioning.duration} />
        </Sequence>

        <Sequence name="Sitio y reserva" from={T.site.from} durationInFrames={T.site.duration} premountFor={fps}>
          <SiteAndBooking language={language} bands={bands} portrait={portrait} duration={T.site.duration} />
        </Sequence>

        <Sequence name="Arquitectura" from={T.architecture.from} durationInFrames={T.architecture.duration} premountFor={fps}>
          <Architecture language={language} bands={bands} portrait={portrait} duration={T.architecture.duration} />
        </Sequence>

        <Sequence name="El Cerebro" from={T.brain.from} durationInFrames={T.brain.duration} premountFor={fps}>
          <Brain language={language} bands={bands} portrait={portrait} duration={T.brain.duration} />
        </Sequence>

        <Sequence name="Ingeniería" from={T.engineering.from} durationInFrames={T.engineering.duration} premountFor={fps}>
          <Engineering language={language} bands={bands} portrait={portrait} duration={T.engineering.duration} />
        </Sequence>

        <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
          <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
        </Sequence>

        <Letterbox portrait={portrait} />
        <ChapterTicks chapters={FENIX_CHAPTERS} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
      </AbsoluteFill>
    </BrandProvider>
  );
}

type SceneProps = { language: FilmLanguage; portrait: boolean; duration: number };
type Bands = Record<string, Box>;

function SceneTitle({ kicker, title, box, portrait, from = 6 }: { kicker: string; title: string; box: Box; portrait: boolean; from?: number }) {
  return <BrandTitle kicker={kicker} title={title} from={from} size={portrait ? 56 : 42} style={{ left: box.x, top: box.y, width: box.w }} />;
}

/** Tiempos de la apertura: el fénix se forma a oscuras, asciende y se enciende el corredor. */
const OPENING = { formFrom: 8, formTo: 104, rise: 132, lightFrom: 120, lightTo: 172, taglineFrom: 150 } as const;

/** 1 · El fénix se forma en partículas de latón y, al ascender, se enciende el corredor. */
function Opening({ language, width, height, portrait, duration }: SceneProps & { width: number; height: number }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = FENIX_COPY[language];
  const format = portrait ? "portrait" : "landscape";
  const corridor = FENIX_ASSETS.corridor;
  const layout = fenixOpeningLayout(format, width, height, copy.tagline);
  // A oscuras mientras se forma el fénix; la luz sube cuando asciende.
  const night = 0.94 - 0.8 * progress(frame, OPENING.lightFrom, OPENING.lightTo);
  const kickerIn = progress(frame, OPENING.taglineFrom, OPENING.taglineFrom + 18);
  return (
    <Fade duration={duration + 20}>
      <CinematicPlate box={layout.plateBox} asset={corridor} poster={FENIX_ASSETS.corridorPoster.src} duration={duration + 20} veilOpacity={0.5} push={0.05} align="top">
        <div style={{ position: "absolute", inset: 0, background: b.palette.bg, opacity: night }} />
      </CinematicPlate>
      <div style={{ position: "absolute", left: layout.placed.x, top: layout.placed.y, width: layout.placed.w, height: layout.placed.h, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -layout.placed.x, top: -layout.placed.y, width, height }}>
          <ParticleLogo
            src={b.logo.mark}
            mode={b.logo.particleMode}
            colors={[b.palette.accentSoft, b.palette.accent, b.palette.accentDeep]}
            size={layout.logoSize}
            center={{ x: layout.placed.x + layout.placed.w / 2, y: layout.placed.y + layout.placed.h / 2 }}
            formFrom={OPENING.formFrom}
            formTo={OPENING.formTo}
            dissolveAt={OPENING.rise}
            count={2600}
            restAlpha={0.95}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: layout.textX,
          top: layout.kickerY,
          width: layout.textW,
          textAlign: portrait ? "center" : "left",
          fontFamily: b.fonts.label,
          fontSize: layout.kickerSize,
          lineHeight: 1.2,
          fontWeight: 600,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: b.palette.accent,
          opacity: kickerIn,
          translate: `0 ${(1 - kickerIn) * 8}px`,
        }}
      >
        {copy.sublines.join(" · ")}
      </div>
      <RevealWords
        text={copy.tagline}
        from={OPENING.taglineFrom + 6}
        size={layout.size}
        box={{ x: layout.textX, y: layout.textY, w: layout.textW, h: layout.textH }}
        align={portrait ? "center" : "left"}
        fontFamily={b.fonts.display}
        weight={500}
        color={b.palette.text}
        emphasis={b.palette.accentSoft}
      />
    </Fade>
  );
}

/** 2 · El mecanismo (tres láminas propias) y "la dosis es el claim". */
function Mechanism({ language, bands, portrait, duration }: SceneProps & { bands: Bands }) {
  const frame = useCurrentFrame();
  const copy = FENIX_COPY[language];
  const triptych = Math.round(duration * 0.46);
  const beats = duration - triptych;
  const slot = Math.floor(beats / copy.doseBeats.length);
  const titleShow = windowed(frame, 2, 16, triptych - 16, triptych - 2);
  // Frases a un lado y tira de sesiones al otro (en 4:5, una sobre otra).
  const area = { ...bands.body, y: bands.title.y, h: bands.body.y + bands.body.h - bands.title.y };
  const { doseText, doseStrip } = fenixMechanismLayout(area, portrait ? "portrait" : "landscape");
  return (
    <AbsoluteFill>
      <div style={{ opacity: titleShow }}>
        <SceneTitle kicker={copy.mechanismKicker} title={copy.mechanismTitle} box={bands.title} portrait={portrait} />
      </div>
      <Sequence name="Tríptico" durationInFrames={triptych}>
        <MechanismTriptych
          box={bands.body}
          stills={[FENIX_ASSETS.mechanismPlasma, FENIX_ASSETS.mechanismDiffusion, FENIX_ASSETS.mechanismAngiogenesis]}
          captions={copy.mechanismCaptions.map((title) => ({ title }))}
          formula={{ kicker: copy.mechanismLawKicker, text: copy.mechanismLaw }}
          duration={triptych}
        />
      </Sequence>
      <Sequence name="La dosis es el claim" from={triptych} durationInFrames={beats}>
        <ManifestoBeats
          box={doseText}
          beats={copy.doseBeats.map((beat, index) => ({ ...beat, from: index * slot, to: (index + 1) * slot }))}
          duration={beats}
          maxLines={3}
          maxSize={portrait ? 72 : 64}
          uniformSize
        />
        <DoseStrip box={doseStrip} duration={beats} slot={slot} language={language} portrait={portrait} />
      </Sequence>
    </AbsoluteFill>
  );
}

/**
 * Tira de sesiones: una barra por sesión hasta el máximo del protocolo; las
 * del rango con señal (40–60, dossier · HBOT) se encienden en latón. Primero
 * aparecen vacías ("la dosis"), después se llenan en orden ("la señal").
 */
function DoseStrip({ box, duration, slot, language, portrait }: { box: Box; duration: number; slot: number; language: FilmLanguage; portrait: boolean }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = FENIX_COPY[language];
  const total = FENIX_FACTS.sessionsMax.value;
  const signalFrom = FENIX_FACTS.sessionsMin.value;
  const signal = copy.evidenceTiers.find((tier) => tier.id === "signal")?.label ?? "";
  const layout = fenixDoseStripLayout(box, portrait ? "portrait" : "landscape", total);
  const fill = { from: slot + 6, to: slot + 54 };
  const bracketIn = progress(frame, fill.to - 4, fill.to + 14);
  const exit = 1 - progress(frame, duration - 18, duration - 2);
  const xOf = (session: number) => box.x + (session - 1) * layout.pitch + (layout.pitch - layout.barW) / 2;
  const signalX = xOf(signalFrom);
  const signalW = xOf(total) + layout.barW - signalX;
  const tick = (session: number, value: string) => (
    <div key={session} style={{ position: "absolute", top: layout.barsY + layout.barsH + layout.labelSize * 0.7, left: xOf(session), fontFamily: b.fonts.label, fontSize: layout.labelSize, lineHeight: 1.2, color: session >= signalFrom ? b.palette.accentSoft : b.palette.muted, whiteSpace: "nowrap" }}>
      {value}
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: exit }}>
      {/* Corchete y rótulo del rango con señal, arriba de las barras. */}
      <div style={{ position: "absolute", left: signalX, top: layout.top, width: signalW, height: layout.headH - layout.labelSize * 0.6, opacity: bracketIn, translate: `0 ${(1 - bracketIn) * 8}px` }}>
        <div style={{ fontFamily: b.fonts.label, fontSize: layout.labelSize, lineHeight: 1.2, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: b.palette.accent, whiteSpace: "nowrap", textAlign: "right" }}>
          {signal}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: layout.labelSize * 0.6, borderTop: `2px solid ${b.palette.accent}`, borderLeft: `2px solid ${b.palette.accent}`, borderRight: `2px solid ${b.palette.accent}`, borderRadius: "4px 4px 0 0" }} />
      </div>
      {Array.from({ length: total }, (_, index) => {
        const session = index + 1;
        const appear = progress(frame, 4 + index * 0.5, 22 + index * 0.5);
        const lit = progress(frame, fill.from + ((fill.to - fill.from) * index) / total, fill.from + ((fill.to - fill.from) * index) / total + 8);
        const inSignal = session >= signalFrom;
        const height = layout.barsH * (0.25 + 0.75 * appear);
        return (
          <div
            key={session}
            style={{
              position: "absolute",
              left: xOf(session),
              top: layout.barsY + layout.barsH - height,
              width: layout.barW,
              height,
              borderRadius: layout.barW / 2,
              background: inSignal ? b.palette.accent : b.palette.muted,
              opacity: appear * (0.16 + lit * (inSignal ? 0.84 : 0.4)),
              boxShadow: inSignal && lit > 0.5 ? `0 0 ${portrait ? 16 : 12}px ${alpha(b.palette.accent, 45)}` : undefined,
            }}
          />
        );
      })}
      {tick(1, "1")}
      {tick(signalFrom, fx("sessionsMin", language))}
      <div style={{ position: "absolute", top: layout.barsY + layout.barsH + layout.labelSize * 0.7, left: box.x, width: box.w, textAlign: "right", fontFamily: b.fonts.label, fontSize: layout.labelSize, lineHeight: 1.2, color: b.palette.accentSoft, whiteSpace: "nowrap" }}>
        {fx("sessionsMax", language)} {copy.doseUnit}
      </div>
    </div>
  );
}

/** 3 · El registro de afirmaciones: qué se puede decir y qué no. */
function Evidence({ language, bands, portrait, duration }: SceneProps & { bands: Bands }) {
  const copy = FENIX_COPY[language];
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.evidenceKicker} title={copy.evidenceTitle} box={bands.title} portrait={portrait} />
      <EvidenceLedger
        box={bands.body}
        duration={duration}
        language={language}
        total={{ value: FENIX_FACTS.claims.value, label: copy.evidenceTotalLabel }}
        breakdown={copy.evidenceBreakdown.map((item) => ({ label: item.label, value: FENIX_FACTS[item.key].value }))}
        tiers={copy.evidenceTiers}
        wording={copy.evidenceWording}
      />
    </Fade>
  );
}

/** 4 · Posicionamiento: frases sobre la cámara hiperbárica, cada una en su banda. */
function Positioning({ language, safe, portrait, duration }: SceneProps & { safe: Box }) {
  const copy = FENIX_COPY[language];
  const [plateBox, textBox] = portrait
    ? (() => {
        const stacked = stackBands(safe, [{ id: "plate", h: 560 }, { id: "text", flex: 1 }], 36);
        return [stacked.plate, stacked.text];
      })()
    : splitColumns(safe, [1.3, 1], 56);
  const slot = Math.floor(duration / copy.positioningBeats.length);
  return (
    <Fade duration={duration}>
      <CinematicPlate box={plateBox} asset={FENIX_ASSETS.chamber} poster={FENIX_ASSETS.chamberPoster.src} duration={duration} veilOpacity={0.35} push={0.04} align="center" />
      <ManifestoBeats
        box={textBox}
        beats={copy.positioningBeats.map((beat, index) => ({ ...beat, from: index * slot + (index === 0 ? 10 : 0), to: (index + 1) * slot }))}
        duration={duration}
        maxLines={portrait ? 4 : 5}
        uniformSize
      />
    </Fade>
  );
}

/** 5 · El sitio real y después la reserva en 3 pasos (capturas reales, formulario vacío). */
function SiteAndBooking({ language, bands, portrait, duration }: SceneProps & { bands: Bands }) {
  const b = useBrand();
  const copy = FENIX_COPY[language];
  const { main, note } = fenixSiteNoteLayout(bands.body, portrait ? "portrait" : "landscape");
  const shots = [FENIX_ASSETS.bookingDay, FENIX_ASSETS.bookingTime, FENIX_ASSETS.bookingDetails].map((shot, index) => ({ ...shot, label: copy.bookingSteps[index] }));
  // Una cosa por vez y a su tamaño: primero el sitio, después los tres pasos de la reserva.
  const half = Math.round(duration * 0.42);
  const noteShow = progress(useCurrentFrame(), half + 30, half + 50);
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.siteKicker} title={copy.siteTitle} box={bands.title} portrait={portrait} />
      <Sequence name="Sitio" durationInFrames={half}>
        <ScrollReel box={main} asset={FENIX_ASSETS.siteHbot} host={FENIX_HOST} path="" duration={half} stops={[0, 0.6]} />
      </Sequence>
      <Sequence name="Reserva" from={half} durationInFrames={duration - half}>
        <ShotStack box={main} shots={shots} duration={duration - half} frame="card" startAt={16} />
      </Sequence>
      <div style={{ position: "absolute", left: note.x, top: note.y, width: note.w, height: note.h, display: "flex", alignItems: "center", gap: 12, fontFamily: b.fonts.body, fontSize: portrait ? 24 : 18, color: b.palette.muted, opacity: noteShow }}>
        <span style={{ width: portrait ? 10 : 8, height: portrait ? 10 : 8, borderRadius: 99, background: b.palette.accent }} />
        {copy.bookingNote}
      </div>
    </Fade>
  );
}

/** 6 · Arquitectura: tres vistas (lead, reserva, compliance) con la geometría de Archify. */
function Architecture({ language, bands, portrait, duration }: SceneProps & { bands: Bands }) {
  const copy = FENIX_COPY[language];
  const architecture = resolveArchitecture(fenixArchitecture, language, portrait ? "portrait" : "landscape");
  const parts = stackBands(bands.body, [{ id: "diagram", flex: 1 }, { id: "caption", h: portrait ? 170 : 92 }], portrait ? 20 : 14);
  const build = 75;
  // En 16:9 el diagrama usa casi todo el ancho (más grande que el área segura de los textos).
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.archKicker} title={copy.archTitle} box={bands.title} portrait={portrait} />
      <ArchitectureScene
        diagram={architecture.diagram}
        layout={architecture.layout}
        area={parts.diagram}
        caption={{ x: parts.caption.x, y: parts.caption.y, w: parts.caption.w, size: portrait ? 28 : 20 }}
        maxZoom={1.8}
        buildFrames={build}
        viewFrames={Math.floor((duration - build) / 3)}
      />
    </Fade>
  );
}

/** 7 · El Cerebro: búsqueda por palabras clave y la plantilla de guion. */
function Brain({ language, bands, portrait, duration }: SceneProps & { bands: Bands }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = FENIX_COPY[language];
  const search = Math.round(duration * 0.55);
  const script = duration - search;
  const firstTitle = windowed(frame, 2, 16, search - 16, search - 2);
  const secondTitle = windowed(frame, search + 2, search + 16, duration - 16, duration - 2);
  return (
    <AbsoluteFill>
      <div style={{ opacity: firstTitle }}>
        <SceneTitle kicker={copy.brainKicker} title={copy.brainTitle} box={bands.title} portrait={portrait} />
      </div>
      <div style={{ opacity: secondTitle }}>
        <Sequence name="Título de guiones" from={search} durationInFrames={script} layout="none">
          <SceneTitle kicker={copy.brainKicker} title={copy.scriptTitle} box={bands.title} portrait={portrait} />
        </Sequence>
      </div>
      <Sequence name="Búsqueda" durationInFrames={search}>
        <KeywordSearch
          box={bands.body}
          duration={search}
          language={language}
          query={copy.brainQuery}
          tokens={copy.brainTokens}
          results={copy.brainResults}
          stats={copy.brainStats.map((stat) => ({ value: fx(stat.key, language), label: stat.label }))}
          methodLabel={copy.brainMethod}
          sampleLabel={copy.sample}
          highlightTone={b.palette.muted}
        />
      </Sequence>
      <Sequence name="Guiones" from={search} durationInFrames={script}>
        <ScriptTimeline
          box={bands.body}
          duration={script}
          language={language}
          segments={copy.scriptSegments}
          counter={{ value: FENIX_FACTS.hooks.value, label: copy.hooksLabel }}
          breakdown={copy.scriptBreakdown.map((item) => ({ value: FENIX_FACTS[item.key].value, label: item.label }))}
          checklist={{ title: copy.scriptChecklist, items: copy.scriptChecklistItems }}
        />
      </Sequence>
    </AbsoluteFill>
  );
}

/** 8 · Ingeniería: cifras documentadas y la grilla de chequeos de producción. */
function Engineering({ language, bands, portrait, duration }: SceneProps & { bands: Bands }) {
  const b = useBrand();
  const copy = FENIX_COPY[language];
  const { agents, factsBox, gridBox } = fenixEngineeringLayout(bands.body, portrait ? "portrait" : "landscape");
  const agentsShow = progress(useCurrentFrame(), 80, 100);
  return (
    <Fade duration={duration + 20}>
      <SceneTitle kicker={copy.engineeringKicker} title={copy.engineeringTitle} box={bands.title} portrait={portrait} />
      <FactWall box={factsBox} duration={duration} language={language} facts={copy.engineeringFacts.map((fact) => ({ value: fx(fact.key, language), label: fact.label, source: fact.source }))} />
      <ChecklistGrid box={gridBox} duration={duration} language={language} total={FENIX_FACTS.qaChecks.value} passed={FENIX_FACTS.qaChecks.value} groups={copy.qaGroups} unitLabel={copy.qaLabel} />
      <div style={{ position: "absolute", left: agents.x, top: agents.y, width: agents.w, height: agents.h, display: "flex", alignItems: "center", fontFamily: b.fonts.label, fontSize: portrait ? 22 : 16, letterSpacing: "0.04em", color: b.palette.muted, opacity: agentsShow, whiteSpace: "nowrap", overflow: "hidden" }}>
        {copy.agentsLine}
      </div>
    </Fade>
  );
}
