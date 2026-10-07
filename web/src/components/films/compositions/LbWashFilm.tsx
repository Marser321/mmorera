import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { bundle as lbArchitecture } from "@/data/architecture/bundles/lb-elite-wash-detail";
import { brandCssVars, CASE_BRANDS } from "@/data/brands/caseBrands";
import { LB_ASSETS, LB_CHAPTERS, LB_COPY, LB_CREW_TAP, LB_HOST, LB_TIMELINE, type LbCrewActionId } from "@/data/films/flagships/lbWash";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { ArchitectureScene } from "../scenes/brand/ArchitectureScene";
import { BrandTitle, Fade } from "../scenes/brand/camera";
import { CinematicPlate } from "../scenes/brand/CinematicPlate";
import { alpha, BrandProvider, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText, SampleTag } from "../scenes/brand/dataKit";
import { FactWall } from "../scenes/brand/FactWall";
import { MANIFESTO_KICKER_TRACKING } from "../scenes/brand/layout/manifestoBeats";
import { ManifestoBeats, RevealWords } from "../scenes/brand/ManifestoBeats";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { ScrollReel } from "../scenes/brand/ScrollReel";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { Letterbox, PhoneFrame } from "../scenes/case/shared";
import { ChapterTicks } from "../scenes/primitives";
import { EASE_IN_OUT, progress, useFilmLayout, windowed } from "../scenes/theme";
import { LB_TITLE, lbBands, lbCrewLayout, lbHeroLayout, lbQuoterLayout, PHONE } from "./lbWashFilmLayout";

export type LbWashFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["lb-elite-wash-detail"];

/** Colores de estado de la app de la cuadrilla (site/cuadrilla.html: --ok, --cash, --link, --warn). */
const CREW_COLORS: Record<LbCrewActionId, string> = { attended: "#16A34A", cash: "#2563EB", link: "#7C3AED", noshow: "#B45309" };

/**
 * "Detailing móvil que llega a ti": L&B Elite Wash & Detail con su propia
 * estructura (azul eléctrico, Outfit e Inter). La camioneta real y el monograma
 * en partículas con la regla de la operación, el cotizador real del sitio y el
 * webhook que crea la cita en HighLevel, la arquitectura sin base de datos, la
 * app real de la cuadrilla, las cifras verificadas y la firma.
 *
 * Cada escena recibe cajas calculadas (lbWashFilmLayout): el título vive en su
 * banda, los medios en sus placas y los paneles en sus columnas.
 */
export function LbWashFilm({ language }: LbWashFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const T = LB_TIMELINE;

  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...brandCssVars(brand), background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        <DustField color={brand.palette.accentSoft} count={44} opacity={0.16} />

        <Sequence name="Flota y regla" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
          <Hero language={language} format={format} duration={T.opening.duration} width={width} height={height} />
        </Sequence>

        <Sequence name="Cotizador" from={T.quoter.from} durationInFrames={T.quoter.duration} premountFor={fps}>
          <Quoter language={language} format={format} duration={T.quoter.duration} />
        </Sequence>

        <Sequence name="Arquitectura" from={T.architecture.from} durationInFrames={T.architecture.duration} premountFor={fps}>
          <Architecture language={language} format={format} duration={T.architecture.duration} />
        </Sequence>

        <Sequence name="Cuadrilla" from={T.crew.from} durationInFrames={T.crew.duration} premountFor={fps}>
          <Crew language={language} format={format} duration={T.crew.duration} />
        </Sequence>

        <Sequence name="Ingeniería" from={T.engineering.from} durationInFrames={T.engineering.duration} premountFor={fps}>
          <Engineering language={language} format={format} duration={T.engineering.duration} />
        </Sequence>

        <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
          <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
        </Sequence>

        <Letterbox portrait={portrait} />
        <ChapterTicks chapters={LB_CHAPTERS} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
      </AbsoluteFill>
    </BrandProvider>
  );
}

type SceneProps = { language: FilmLanguage; format: FilmFormatName; duration: number };

function SceneTitle({ kicker, title, box, format, from = 6 }: { kicker: string; title: string; box: Box; format: FilmFormatName; from?: number }) {
  return <BrandTitle kicker={kicker} title={title} from={from} size={LB_TITLE[format].size} style={{ left: box.x, top: box.y, width: box.w }} />;
}

/** Placa de panel con la piel de la marca. */
function PanelPlate({ box, glow = 0 }: { box: Box; glow?: number }) {
  const b = useBrand();
  return (
    <div
      style={{
        ...boxStyle(box),
        boxSizing: "border-box",
        borderRadius: b.radius,
        background: `linear-gradient(160deg, ${alpha(b.palette.raised, 92)}, ${alpha(b.palette.surface, 96)} 65%)`,
        border: `1px solid ${glow > 0 ? alpha(b.palette.accent, 30 + glow * 40) : b.palette.line}`,
        boxShadow: `0 40px 90px ${alpha("#000000", 45)}${glow > 0 ? `, 0 0 ${40 * glow}px ${alpha(b.palette.accent, 22 * glow)}` : ""}`,
      }}
    />
  );
}

/** Tiempos de la apertura: el monograma se forma a oscuras, la camioneta se enciende y después la regla. */
const HERO = { formFrom: 8, formTo: 104, dissolve: 150, lightFrom: 138, lightTo: 214, taglineFrom: 176, taglineOut: 292, beatsFrom: 300 } as const;

/** 1 · La camioneta real a oscuras, el monograma en partículas, "llega a ti" y la regla de la operación. */
function Hero({ language, format, duration, width, height }: SceneProps & { width: number; height: number }) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = LB_COPY[language];
  const portrait = format === "portrait";
  const layout = lbHeroLayout(format, copy.heroTagline, copy.heroKicker);
  const align = portrait ? "center" : "left";
  // A oscuras mientras se forma el monograma; la luz sube cuando se disuelve.
  const night = 0.92 - 0.6 * progress(frame, HERO.lightFrom, HERO.lightTo);
  const taglineShow = windowed(frame, HERO.taglineFrom, HERO.taglineFrom + 18, HERO.taglineOut - 18, HERO.taglineOut);
  const beats = duration - HERO.beatsFrom;
  const slot = Math.floor(beats / copy.ruleBeats.length);
  return (
    <Fade duration={duration}>
      <CinematicPlate box={layout.plateBox} asset={layout.asset} duration={duration} veilOpacity={0.5} push={0.05} align="top">
        <div style={{ position: "absolute", inset: 0, background: b.palette.bg, opacity: night }} />
      </CinematicPlate>
      {/* Las partículas viven dentro de la placa: nunca invaden la banda del texto. */}
      <div style={{ ...boxStyle(layout.plate), overflow: "hidden", borderRadius: b.radius * 0.6 }}>
        <div style={{ position: "absolute", left: -layout.plate.x, top: -layout.plate.y, width, height }}>
          <ParticleLogo
            src={b.logo.mark}
            mode={b.logo.particleMode}
            colors={[b.palette.accentSoft, b.palette.accent, b.palette.accentDeep]}
            size={layout.logoSize}
            center={layout.logoCenter}
            formFrom={HERO.formFrom}
            formTo={HERO.formTo}
            dissolveAt={HERO.dissolve}
            count={2400}
            restAlpha={0.95}
          />
        </div>
      </div>
      <div style={{ opacity: taglineShow }}>
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
            color: b.palette.accent,
            opacity: progress(frame, HERO.taglineFrom, HERO.taglineFrom + 18),
          }}
        >
          {copy.heroKicker}
        </div>
        <RevealWords
          text={copy.heroTagline}
          from={HERO.taglineFrom + 6}
          size={layout.taglineSize}
          box={layout.tagline}
          align={align}
          fontFamily={b.fonts.display}
          weight={600}
          color={b.palette.text}
          emphasis={b.palette.accentSoft}
        />
      </div>
      <Sequence name="La regla" from={HERO.beatsFrom} durationInFrames={beats}>
        <ManifestoBeats
          box={layout.text}
          beats={copy.ruleBeats.map((beat, index) => ({ ...beat, from: index * slot, to: (index + 1) * slot }))}
          duration={beats}
          maxLines={portrait ? 3 : 2}
          maxSize={portrait ? 72 : 60}
          align={align}
          uniformSize
        />
      </Sequence>
    </Fade>
  );
}

/** Tiempos del cotizador: la cita se arma línea por línea, nace en `new` y se confirma con el pago. */
const QUOTER = { panel: 18, visit: 52, lineFrom: 84, lineEvery: 24, hold: 246, confirm: 340, route: 392, assign: 430 } as const;

/** 2 · El cotizador real (5 pasos) y, al lado, la cita que su webhook crea en HighLevel. */
function Quoter({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = LB_COPY[language];
  const { title, reel, panel } = lbQuoterLayout(format, copy);
  const enter = progress(frame, QUOTER.panel, QUOTER.panel + 24);
  const holdIn = progress(frame, QUOTER.hold, QUOTER.hold + 16);
  const confirmIn = progress(frame, QUOTER.confirm, QUOTER.confirm + 16);
  // El hold corre (15 minutos que se consumen) hasta que llega el pago.
  const holdLeft = 1 - 0.18 * progress(frame, QUOTER.hold, QUOTER.confirm, EASE_IN_OUT);
  const stateColor = [CREW_COLORS.noshow, CREW_COLORS.attended];
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.quoterKicker} title={copy.quoterTitle} box={title} format={format} />
      <ScrollReel box={reel} asset={LB_ASSETS.quoter} host={LB_HOST} path="/#quoter" duration={duration} stops={[0, 0.34, 1]} />

      <div style={{ position: "absolute", inset: 0, opacity: enter, translate: `0 ${(1 - enter) * 14}px` }}>
        <PanelPlate box={panel.frame} glow={confirmIn * (1 - progress(frame, QUOTER.confirm + 40, QUOTER.confirm + 90))} />
        <BoxText block={panel.kicker} style={{ fontFamily: b.fonts.label, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: b.palette.accent }} />
        <SampleTag block={panel.sample} opacity={progress(frame, QUOTER.panel + 12, QUOTER.panel + 30)} />
        <BoxText block={panel.visit} style={{ fontFamily: b.fonts.display, fontWeight: 600, color: b.palette.text, opacity: progress(frame, QUOTER.visit, QUOTER.visit + 18) }} />
        {panel.lines.map((line, index) => {
          const show = progress(frame, QUOTER.lineFrom + index * QUOTER.lineEvery, QUOTER.lineFrom + index * QUOTER.lineEvery + 16);
          return (
            <div key={line.key.id} style={{ opacity: show, translate: `${(1 - show) * 12}px 0` }}>
              <BoxText block={line.key} style={{ fontFamily: b.fonts.label, fontWeight: 600, color: b.palette.accentSoft }} />
              <BoxText block={line.value} style={{ fontFamily: b.fonts.body, color: b.palette.text, fontVariantNumeric: "tabular-nums" }} />
            </div>
          );
        })}
        {panel.pills.map((pill, index) => {
          const show = index === 0 ? holdIn : confirmIn;
          // Al confirmarse, el hold queda atrás (atenuado): es el mismo objeto en otro estado.
          const dim = index === 0 ? 1 - 0.55 * confirmIn : 1;
          const color = stateColor[index];
          const multi = pill.text.lines > 1;
          return (
            <div key={pill.text.id} style={{ opacity: show * dim, scale: `${0.97 + show * 0.03}` }}>
              <div style={{ ...boxStyle(pill.frame), boxSizing: "border-box", borderRadius: multi ? 14 : 999, background: alpha(color, 14), border: `1px solid ${alpha(color, 55)}`, overflow: "hidden" }}>
                {index === 0 ? <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: `${holdLeft * 100}%`, background: alpha(color, 70) }} /> : null}
              </div>
              <div style={{ ...boxStyle(pill.dot), borderRadius: 99, background: color, boxShadow: `0 0 ${10 + 8 * Math.abs(Math.sin(frame / 9))}px ${alpha(color, 60)}` }} />
              <BoxText block={pill.text} style={{ fontFamily: b.fonts.label, fontWeight: 600, color: b.palette.text }} />
            </div>
          );
        })}
        <BoxText block={panel.route} style={{ fontFamily: b.fonts.label, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: b.palette.muted, opacity: progress(frame, QUOTER.route, QUOTER.route + 16) }} />
        {panel.vans.map((van, index) => {
          const show = progress(frame, QUOTER.route + 8 + index * 5, QUOTER.route + 22 + index * 5);
          // Rotación determinista (visitas del día % 4): esta visita cae en la camioneta 1, la misma de la cuadrilla.
          const lit = index === 0 ? progress(frame, QUOTER.assign, QUOTER.assign + 16) : 0;
          return (
            <div key={van.text.id} style={{ opacity: show }}>
              <div
                style={{
                  ...boxStyle(van.frame),
                  boxSizing: "border-box",
                  borderRadius: 10,
                  background: lit > 0 ? alpha(b.palette.accent, 12 + lit * 70) : alpha(b.palette.bg, 60),
                  border: `1px solid ${lit > 0 ? b.palette.accentSoft : b.palette.line}`,
                  boxShadow: lit > 0 ? `0 0 ${24 * lit}px ${alpha(b.palette.accent, 45 * lit)}` : undefined,
                }}
              />
              <BoxText block={van.text} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 600, color: lit > 0.5 ? b.palette.onAccent : b.palette.muted }} />
            </div>
          );
        })}
      </div>
    </Fade>
  );
}

/** 3 · Arquitectura sin base de datos: tres vistas guiadas con el pulso de datos de Archify. */
function Architecture({ language, format, duration }: SceneProps) {
  const copy = LB_COPY[language];
  const portrait = format === "portrait";
  const { title, body } = lbBands(format);
  const architecture = resolveArchitecture(lbArchitecture, language, format);
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
        maxZoom={1.6}
        buildFrames={build}
        viewFrames={Math.floor((duration - build) / views)}
      />
    </Fade>
  );
}

/** Tiempos de la cuadrilla: el panel explica los botones, el dedo toca "Atendida" y la cita cambia. */
const CREW = { rowsFrom: 34, tap: 176, swap: 188 } as const;

/** 4 · La app real de la cuadrilla (paradas de ejemplo): un toque y la cita pasa a `showed`. */
function Crew({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = LB_COPY[language];
  const { title, phone, panel } = lbCrewLayout(format, copy);
  const enter = progress(frame, 6, 34);
  const swap = progress(frame, CREW.swap, CREW.swap + 10);
  const press = windowed(frame, CREW.tap - 12, CREW.tap - 4, CREW.tap + 4, CREW.tap + 14);
  const ripple = progress(frame, CREW.tap, CREW.tap + 26);
  const attended = progress(frame, CREW.swap, CREW.swap + 16);
  const float = Math.sin(frame / 38) * 4;
  const screen = { position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", objectFit: "cover" } as const;
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.crewKicker} title={copy.crewTitle} box={title} format={format} />

      <PhoneFrame
        width={phone.w}
        style={{
          left: phone.x,
          top: phone.y + float,
          opacity: enter,
          scale: `${0.96 + enter * 0.04}`,
          background: "#14171C",
          boxShadow: `0 50px 110px ${alpha("#000000", 60)}, 0 0 0 1px ${alpha(b.palette.text, 16)}, 0 0 60px ${alpha(b.palette.accent, 14)}`,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <Img src={LB_ASSETS.crewToday.src} style={{ ...screen, opacity: 1 - swap }} />
          <Img src={LB_ASSETS.crewAttended.src} style={{ ...screen, opacity: swap }} />
          {/* El toque: un dedo que presiona y una onda que se abre sobre "Atendida". */}
          <div style={{ position: "absolute", left: `${LB_CREW_TAP.x * 100}%`, top: `${LB_CREW_TAP.y * 100}%` }}>
            <div style={{ position: "absolute", width: phone.w * 0.36, height: phone.w * 0.36, translate: "-50% -50%", borderRadius: 999, border: `2px solid ${alpha("#FFFFFF", 80)}`, scale: `${0.2 + ripple * 0.8}`, opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0 }} />
            <div style={{ position: "absolute", width: phone.w * 0.12, height: phone.w * 0.12, translate: "-50% -50%", borderRadius: 999, background: alpha("#FFFFFF", 45), opacity: press }} />
          </div>
        </div>
        {/* Reflejo sutil del vidrio. */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(118deg, ${alpha("#FFFFFF", 9)} 0%, transparent 32%)`, borderRadius: phone.w * PHONE.radius }} />
      </PhoneFrame>

      <div style={{ position: "absolute", inset: 0, opacity: progress(frame, 18, 42) }}>
        <PanelPlate box={panel.frame} glow={attended * (1 - progress(frame, CREW.swap + 60, CREW.swap + 120))} />
        <BoxText block={panel.title} style={{ fontFamily: b.fonts.label, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: b.palette.accent }} />
        <SampleTag block={panel.sample} />
        {panel.rows.map((row, index) => {
          const action = copy.crewActions[index];
          const show = progress(frame, CREW.rowsFrom + index * 14, CREW.rowsFrom + index * 14 + 18);
          const lit = action.id === "attended" ? progress(frame, CREW.tap, CREW.tap + 14) : 0;
          // Después del toque, el resto queda en segundo plano.
          const rest = action.id === "attended" ? 1 : 1 - 0.4 * attended;
          const color = CREW_COLORS[action.id];
          return (
            <div key={action.id} style={{ opacity: show * rest, translate: `${(1 - show) * 14}px 0` }}>
              <div style={{ ...boxStyle(row.button), borderRadius: 10, background: color, boxShadow: lit > 0 ? `0 0 0 ${4 * lit}px ${alpha(color, 35)}, 0 0 ${30 * lit}px ${alpha(color, 50)}` : undefined, scale: `${1 + 0.05 * windowed(frame, CREW.tap - 6, CREW.tap, CREW.tap + 4, CREW.tap + 16)}` }} />
              <BoxText block={row.label} align="center" style={{ fontFamily: b.fonts.body, fontWeight: 650, color: "#FFFFFF" }} />
              <svg viewBox="0 0 30 14" width={row.arrow.w} height={row.arrow.h} style={{ ...boxStyle(row.arrow), overflow: "visible" }}>
                <path d="M1 7 H25 M19 1.5 L26 7 L19 12.5" fill="none" stroke={lit > 0.5 ? color : b.palette.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <BoxText block={row.effect} style={{ fontFamily: b.fonts.label, color: lit > 0.5 ? b.palette.text : b.palette.muted }} />
            </div>
          );
        })}
        <BoxText block={panel.result} style={{ fontFamily: b.fonts.label, fontWeight: 600, color: CREW_COLORS.attended, opacity: attended, translate: `0 ${(1 - attended) * 8}px` }} />
        <BoxText block={panel.note} style={{ fontFamily: b.fonts.body, color: b.palette.muted, opacity: progress(frame, 96, 120) }} />
      </div>
    </Fade>
  );
}

/** 5 · Ingeniería: las cifras verificadas, cada una con su fuente. */
function Engineering({ language, format, duration }: SceneProps) {
  const copy = LB_COPY[language];
  const { title, body } = lbBands(format);
  return (
    <Fade duration={duration}>
      <SceneTitle kicker={copy.engineeringKicker} title={copy.engineeringTitle} box={title} format={format} />
      <FactWall box={body} duration={duration} language={language} facts={copy.engineeringFacts.map((fact) => ({ value: fact.value, label: fact.label, source: fact.source }))} />
    </Fade>
  );
}
