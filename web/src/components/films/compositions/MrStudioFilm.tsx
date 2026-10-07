import { Img, Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import { MR_ASSETS, MR_BODY, MR_CHAPTERS, MR_COPY, MR_FLOW_SHOTS, MR_HOST, MR_TIMELINE } from "@/data/films/flagships/mrStudio";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText, SampleTag } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout, windowed } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateManifesto, PlateOpening, ReelBeat } from "./kit/KitScenes";
import { captureCamera, mrBodyLayout, mrConsentLayout } from "./mrStudioFilmLayout";

export type MrStudioFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["mr-studio-tattoo"];

/**
 * "Del tatuaje que imaginás a la agenda del artista": Mr. Studio Tattoo con su
 * propia estructura (azul eléctrico, Anton e Inter). El isotipo sobre el
 * metraje del estudio, los seis artistas, el selector anatómico del paso 5 con
 * el brief que se arma (escena protagonista), los pasos reales de la reserva,
 * la bifurcación del consentimiento por edad, las cifras y la firma.
 *
 * Todo sale de la versión publicada (mrstudiotattoo.com), recorrida en solo
 * lectura con datos de ejemplo.
 */
export function MrStudioFilm({ language }: MrStudioFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const copy = MR_COPY[language];
  const T = MR_TIMELINE;
  const b = brand.palette;

  return (
    <KitFrame brand={brand} chapters={MR_CHAPTERS}>
      <Sequence name="Isotipo" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={T.opening.duration}
          width={width}
          height={height}
          spec={{ asset: MR_ASSETS.hero, orientation: "column", focal: { x: 0.5, y: 0.45 } }}
          asset={MR_ASSETS.hero}
          poster={MR_ASSETS.heroPoster.src}
          kicker={copy.openingKicker}
          tagline={copy.openingTagline}
          particle={{ src: brand.logo.mark, mode: brand.logo.particleMode, colors: [b.text, b.accentSoft, b.accent] }}
          night={{ from: 0.9, to: 0.35 }}
        />
      </Sequence>

      <Sequence name="El estudio" from={T.studio.from} durationInFrames={T.studio.duration} premountFor={fps}>
        <PlateManifesto format={format} duration={T.studio.duration} asset={MR_ASSETS.artists} caption={copy.studioCaption} focal={{ x: 0.5, y: 0.45 }} beats={copy.studioBeats} veil={0.25} ratio={[1.3, 0.7]} />
      </Sequence>

      <Sequence name="Zona del cuerpo" from={T.bodyMap.from} durationInFrames={T.bodyMap.duration} premountFor={fps}>
        <BodyMap language={language} format={format} duration={T.bodyMap.duration} />
      </Sequence>

      <Sequence name="La reserva" from={T.flow.from} durationInFrames={T.flow.duration} premountFor={fps}>
        <ReelBeat
          format={format}
          duration={T.flow.duration}
          kicker={copy.flowKicker}
          title={copy.flowTitle}
          note={copy.flowNote}
          shots={MR_FLOW_SHOTS}
          aspect={MR_ASSETS.stepAge.w / MR_ASSETS.stepAge.h}
          nativeWidth={MR_ASSETS.stepAge.w}
          host={MR_HOST}
          noteLabels={copy.flowNotes}
          srcFor={(shot) => MR_ASSETS[shot.name as keyof typeof MR_ASSETS].src}
        />
      </Sequence>

      <Sequence name="Consentimiento" from={T.consent.from} durationInFrames={T.consent.duration} premountFor={fps}>
        <ConsentSplit language={language} format={format} duration={T.consent.duration} />
      </Sequence>

      <Sequence name="Ingeniería" from={T.engineering.from} durationInFrames={T.engineering.duration} premountFor={fps}>
        <FactsBeat format={format} duration={T.engineering.duration} language={language} kicker={copy.engineeringKicker} title={copy.engineeringTitle} facts={copy.engineeringFacts} />
      </Sequence>

      <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
        <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
      </Sequence>
    </KitFrame>
  );
}

type SceneProps = { language: FilmLanguage; format: FilmFormatName; duration: number };

/**
 * Tiempos de la zona del cuerpo: el brief ya trae los pasos previos, la cámara
 * se acerca al antebrazo, el toque lo enciende, se gira a la espalda y vuelve.
 */
const BODY = { rowsFrom: 40, rowEvery: 22, zoomIn: [126, 196], tap: 210, swap: 220, zoomOut: [300, 356], back: [362, 384], front: [446, 468], afterFrom: 480, noteFrom: 520 } as const;

/** 4 · El selector anatómico real (capturas del paso 5) y el brief que se arma al lado. */
function BodyMap({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = MR_COPY[language];
  const layout = mrBodyLayout(format, copy);
  const { window } = layout;
  const zoom = 1 + 0.9 * progress(frame, BODY.zoomIn[0], BODY.zoomIn[1], EASE_IN_OUT) - 0.9 * progress(frame, BODY.zoomOut[0], BODY.zoomOut[1], EASE_IN_OUT);
  const cam = captureCamera(window, MR_BODY.window, zoom, MR_BODY.forearm);
  const marked = progress(frame, BODY.swap, BODY.swap + 12);
  const back = progress(frame, BODY.back[0], BODY.back[1], EASE_IN_OUT) * (1 - progress(frame, BODY.front[0], BODY.front[1], EASE_IN_OUT));
  const layers = [
    { asset: MR_ASSETS.zone, opacity: 1 - marked },
    { asset: MR_ASSETS.zoneForearm, opacity: marked * (1 - back) },
    { asset: MR_ASSETS.zoneBack, opacity: back },
  ];
  const open = progress(frame, 0, 30, EASE_IN_OUT);
  const press = windowed(frame, BODY.tap - 12, BODY.tap - 4, BODY.tap + 4, BODY.tap + 14);
  const ripple = progress(frame, BODY.tap, BODY.tap + 28);
  const tapX = cam.left + MR_BODY.forearm.x * cam.scale;
  const tapY = cam.top + MR_BODY.forearm.y * cam.scale;
  const panelIn = progress(frame, 18, 42);
  return (
    <Fade duration={duration}>
      <KitTitle kicker={copy.bodyKicker} title={copy.bodyTitle} box={layout.title} format={format} />
      {/* Ventana a la figura: las capturas comparten la misma cámara y se funden entre sí. */}
      <div style={{ ...boxStyle(window), overflow: "hidden", borderRadius: b.radius * 2, background: b.palette.bg, boxShadow: `0 40px 100px ${alpha("#000000", 55)}, inset 0 0 0 1px ${b.palette.line}`, clipPath: `inset(${(1 - open) * 46}% 0 round ${b.radius * 2}px)` }}>
        {layers.map((layer) =>
          layer.opacity > 0 ? (
            <Img key={layer.asset.src} src={layer.asset.src} style={{ position: "absolute", left: cam.left, top: cam.top, width: layer.asset.w * cam.scale, height: layer.asset.h * cam.scale, maxWidth: "none", opacity: layer.opacity }} />
          ) : null,
        )}
        {/* El toque sobre el antebrazo. */}
        <div style={{ position: "absolute", left: tapX, top: tapY }}>
          <div style={{ position: "absolute", width: 120, height: 120, translate: "-50% -50%", borderRadius: 999, border: `2px solid ${alpha(b.palette.accentSoft, 85)}`, scale: `${0.2 + ripple * 0.8}`, opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0 }} />
          <div style={{ position: "absolute", width: 34, height: 34, translate: "-50% -50%", borderRadius: 999, background: alpha("#FFFFFF", 45), opacity: press }} />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: panelIn, translate: `${(1 - panelIn) * 16}px 0` }}>
        <KitPanel box={layout.frame} glow={marked * (1 - progress(frame, BODY.swap + 40, BODY.swap + 100))} />
        <BoxText block={layout.titleBlock} style={{ fontFamily: b.fonts.label, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: b.palette.accentSoft }} />
        <SampleTag block={layout.sample} />
        {layout.rows.map((row, index) => {
          const isZone = index === layout.zoneRow;
          const appearAt = isZone ? BODY.swap + 8 : index < layout.zoneRow ? BODY.rowsFrom + index * BODY.rowEvery : BODY.afterFrom + (index - layout.zoneRow - 1) * BODY.rowEvery;
          const show = progress(frame, appearAt, appearAt + 18);
          const lit = isZone ? show * (1 - 0.6 * progress(frame, BODY.swap + 60, BODY.swap + 120)) : 0;
          return (
            <div key={row.label.id} style={{ opacity: show, translate: `${(1 - show) * 12}px 0` }}>
              <div style={{ ...boxStyle(row.row), boxSizing: "border-box", borderRadius: b.radius, background: isZone ? alpha(b.palette.accent, 10 + lit * 30) : alpha(b.palette.bg, 50), border: `1px solid ${isZone ? alpha(b.palette.accent, 40 + lit * 50) : b.palette.line}`, boxShadow: lit > 0 ? `0 0 ${30 * lit}px ${alpha(b.palette.accent, 40 * lit)}` : undefined }} />
              <BoxText block={row.label} style={{ fontFamily: b.fonts.label, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: isZone ? b.palette.accentSoft : b.palette.muted }} />
              <BoxText block={row.value} style={{ fontFamily: b.fonts.body, fontWeight: 600, color: b.palette.text }} />
            </div>
          );
        })}
        <BoxText block={layout.note} style={{ fontFamily: b.fonts.body, color: b.palette.muted, opacity: progress(frame, BODY.noteFrom, BODY.noteFrom + 20) }} />
      </div>
    </Fade>
  );
}

/** Tiempos de la bifurcación: el nodo de la edad, los conectores y cada camino. */
const CONSENT = { root: 26, draw: [50, 92], cards: 92, lineEvery: 16 } as const;

/** 6 · La edad decide el camino: consentimiento digital o notarizado con tutor. */
function ConsentSplit({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const { width, height } = useFilmLayout();
  const copy = MR_COPY[language];
  const layout = mrConsentLayout(format, copy);
  const rootIn = progress(frame, CONSENT.root, CONSENT.root + 18);
  const draw = progress(frame, CONSENT.draw[0], CONSENT.draw[1], EASE_IN_OUT);
  const tones = [b.palette.accent, b.palette.accentSoft];
  return (
    <Fade duration={duration}>
      <KitTitle kicker={copy.consentKicker} title={copy.consentTitle} box={layout.title} format={format} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {layout.connectors.map((d, index) => (
          <path key={d} d={d} fill="none" stroke={tones[index]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.85} />
        ))}
      </svg>
      <div style={{ opacity: rootIn, translate: `0 ${(1 - rootIn) * -10}px` }}>
        <div style={{ ...boxStyle(layout.root), boxSizing: "border-box", borderRadius: 999, background: alpha(b.palette.accent, 16), border: `1px solid ${alpha(b.palette.accent, 70)}` }} />
        <BoxText block={layout.rootText} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 600, color: b.palette.text }} />
      </div>
      {layout.cards.map((card, index) => {
        const show = progress(frame, CONSENT.cards + index * 10, CONSENT.cards + index * 10 + 20);
        return (
          <div key={card.title.id} style={{ opacity: show, translate: `0 ${(1 - show) * 16}px` }}>
            <KitPanel box={card.frame} />
            <div style={{ position: "absolute", left: card.frame.x, top: card.frame.y, width: card.frame.w, height: 3, borderRadius: 3, background: tones[index] }} />
            <BoxText block={card.title} style={{ fontFamily: b.fonts.display, color: b.palette.text, letterSpacing: "0.01em" }} />
            {card.lines.map((line, lineIndex) => {
              const lineIn = progress(frame, CONSENT.cards + 24 + lineIndex * CONSENT.lineEvery + index * 8, CONSENT.cards + 40 + lineIndex * CONSENT.lineEvery + index * 8);
              return (
                <div key={line.text.id} style={{ opacity: lineIn }}>
                  <div style={{ ...boxStyle(line.dot), borderRadius: 99, background: tones[index] }} />
                  <BoxText block={line.text} style={{ fontFamily: b.fonts.body, color: lineIndex === card.lines.length - 1 ? b.palette.text : b.palette.muted, fontWeight: lineIndex === card.lines.length - 1 ? 600 : 400 }} />
                </div>
              );
            })}
          </div>
        );
      })}
    </Fade>
  );
}
