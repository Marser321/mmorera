import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion";
import nbArchitectureJson from "@/data/architecture/new-brothers-architecture.json";
import nbArchitectureLayout from "@/data/architecture/new-brothers-architecture.layout.json";
import type { ArchifyArchitecture, ArchifyLayout } from "@/data/architecture/archify";
import { brandCssVars, CASE_BRANDS } from "@/data/brands/caseBrands";
import { NB_CHAPTERS, NB_COPY, NB_PANEL_CAPTURE, NB_PANEL_SHOTS, NB_TIMELINE } from "@/data/films/flagships/newBrothers";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { ArchitectureScene } from "../scenes/brand/ArchitectureScene";
import { BlurTravel, BrandTitle, CameraReel, Fade } from "../scenes/brand/camera";
import { alpha, BrandProvider, useBrand } from "../scenes/brand/context";
import { ChoiceRow, FlatPanel, FlatRows, FlatTicket, FlatWizard, SampleBadge, SlotGrid } from "../scenes/brand/flat";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { Letterbox, PhoneFrame } from "../scenes/case/shared";
import { ChatPile } from "../scenes/ProblemVisuals";
import { ChapterTicks } from "../scenes/primitives";
import { progress, useFilmLayout } from "../scenes/theme";

export type NewBrothersFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["new-brothers-barberia"];
const architecture = nbArchitectureJson as unknown as ArchifyArchitecture;
const architectureLayout = nbArchitectureLayout as unknown as ArchifyLayout;
const PANELS = "/portfolio/panels/new-brothers-barberia";
const BACKDROPS = "/portfolio/backdrops/new-brothers-barberia";

/**
 * "Un CRM propio, sin depender de ningún CRM": New Brothers por dentro, con
 * su propia estética (negro, dorado, Oswald). Partículas que forman el sello,
 * el problema, la reserva en seis pasos, el panel real recorrido con cámara,
 * la arquitectura de Archify y la firma.
 */
export function NewBrothersFilm({ language }: NewBrothersFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const copy = NB_COPY[language];
  const T = NB_TIMELINE;

  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...brandCssVars(brand), background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        <DustField color={brand.palette.accentSoft} />

        <Sequence name="Apertura" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
          <Opening portrait={portrait} width={width} height={height} tagline={copy.tagline} duration={T.opening.duration} />
        </Sequence>

        <Sequence name="El problema" from={T.problem.from} durationInFrames={T.problem.duration} premountFor={fps}>
          <Fade duration={T.problem.duration}>
            <BrandTitle kicker={copy.problemKicker} title={copy.problemTitle} size={portrait ? 74 : 62} style={portrait ? { left: 72, top: 150, width: 936 } : { left: 110, top: 170, width: 640 }} />
            <ChatPile
              box={portrait ? { x: 72, y: 600, w: 936, h: 560 } : { x: 820, y: 150, w: 680, h: 580 }}
              signals={copy.problemSignals}
              language={language}
              portrait={portrait}
              diagnosisAt={140}
              appearEvery={22}
              breakpoint={copy.problemBreakpoint}
              lanes={copy.lanes.map((label, index) => ({ label: { es: label, en: label }, signals: [[0, 1], [2, 3], [4]][index] }))}
            />
          </Fade>
        </Sequence>

        <Sequence name="La reserva" from={T.booking.from} durationInFrames={T.booking.duration} premountFor={fps}>
          <BookingScene portrait={portrait} duration={T.booking.duration} language={language} />
        </Sequence>

        <Sequence name="El panel" from={T.panel.from} durationInFrames={T.panel.duration} premountFor={fps}>
          <PanelScene portrait={portrait} duration={T.panel.duration} language={language} />
        </Sequence>

        <Sequence name="Arquitectura" from={T.architecture.from} durationInFrames={T.architecture.duration} premountFor={fps}>
          <Fade duration={T.architecture.duration}>
            <BrandTitle kicker={copy.archKicker} title={copy.archTitle} size={portrait ? 60 : 44} style={portrait ? { left: 72, top: 110, width: 936 } : { left: 110, top: 92, width: 1100 }} />
            <ArchitectureScene
              diagram={architecture}
              layout={architectureLayout}
              area={portrait ? { x: 20, y: 330, w: 1040, h: 720 } : { x: 70, y: 176, w: 1460, h: 536 }}
              caption={portrait ? { x: 72, y: 1076, w: 936, size: 30 } : { x: 110, y: 728, w: 1380, size: 22 }}
              maxZoom={portrait ? 2.2 : 1.6}
              buildFrames={90}
              viewFrames={Math.floor((T.architecture.duration - 90) / 3)}
            />
          </Fade>
        </Sequence>

        <Sequence name="Resultado" from={T.outcome.from} durationInFrames={T.outcome.duration} premountFor={fps}>
          <OutcomeScene portrait={portrait} duration={T.outcome.duration} language={language} />
        </Sequence>

        <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
          <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
        </Sequence>

        <Letterbox portrait={portrait} />
        <ChapterTicks chapters={NB_CHAPTERS} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }} />
      </AbsoluteFill>
    </BrandProvider>
  );
}

function Opening({ portrait, width, height, tagline, duration }: { portrait: boolean; width: number; height: number; tagline: string; duration: number }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const center = { x: width / 2, y: height * (portrait ? 0.4 : 0.43) };
  const logoSize = portrait ? 560 : 400;
  const word = progress(frame, 150, 190);
  return (
    <Fade duration={duration}>
      <BlurTravel src={`${BACKDROPS}-poster-blur.jpg`} duration={duration} opacity={0.32} />
      <ParticleLogo
        src={b.logo.mark}
        mode={b.logo.particleMode}
        colors={[b.palette.accent, b.palette.accentSoft, b.palette.accentDeep]}
        size={logoSize}
        center={center}
        formFrom={8}
        formTo={150}
        count={2600}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: center.y + logoSize * 0.6, textAlign: "center", opacity: word, translate: `0 ${(1 - word) * 16}px` }}>
        <div style={{ fontFamily: b.fonts.display, fontSize: portrait ? 86 : 66, fontWeight: 700, letterSpacing: "0.22em", color: b.palette.text }}>
          NEW <span style={{ color: b.palette.accent }}>BROTHERS</span>
        </div>
        <div style={{ marginTop: 12, fontFamily: b.fonts.body, fontSize: portrait ? 30 : 22, letterSpacing: "0.08em", color: b.palette.muted }}>{tagline}</div>
      </div>
    </Fade>
  );
}

function BookingScene({ portrait, duration, language }: { portrait: boolean; duration: number; language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const copy = NB_COPY[language];
  const stepFrames = 58;
  const panelBox = portrait ? { x: 40, y: 330, w: 1000, h: 640 } : { x: 520, y: 190, w: 1000, h: 590 };
  const current = Math.min(copy.steps.length - 1, Math.max(0, Math.floor((frame - 40) / stepFrames)));
  const tap = progress(frame, 18, 30) * (1 - progress(frame, 34, 48));

  return (
    <Fade duration={duration}>
      <BlurTravel src={`${BACKDROPS}-mobile-1-blur.jpg`} duration={duration} opacity={0.25} />
      <BrandTitle kicker={copy.bookingKicker} title={copy.bookingTitle} size={portrait ? 64 : 46} style={portrait ? { left: 72, top: 140, width: 936 } : { left: 110, top: 92, width: 900 }} />

      {!portrait ? (
        <PhoneFrame width={250} style={{ left: 150, top: 226 + Math.sin(frame / 30) * 6 }}>
          <Img src="/portfolio/shots/new-brothers-barberia-mobile-1.jpg" style={{ width: "100%", height: "auto" }} />
          {/* Toque en "Reservar Turno" (botón real del sitio) */}
          <div style={{ position: "absolute", left: "50%", top: "59.5%", width: 60, height: 60, translate: "-50% -50%", borderRadius: 99, border: `3px solid ${b.palette.accentSoft}`, opacity: tap, scale: `${0.6 + tap * 0.8}` }} />
        </PhoneFrame>
      ) : null}

      <FlatPanel kicker={copy.stepOf.replace("{n}", String(current + 1)).replace("{total}", String(copy.steps.length))} title={copy.steps[current]} width={panelBox.w} height={panelBox.h} style={{ left: panelBox.x, top: panelBox.y }}>
        <FlatWizard
          steps={copy.steps}
          from={40}
          stepFrames={stepFrames}
          width={panelBox.w - 68}
          renderStep={(index, local) => {
            switch (index) {
              case 0:
                return <ChoiceRow items={[{ title: copy.branch, meta: copy.branchMeta }]} selected={0} at={20} local={local} />;
              case 1:
                return <ChoiceRow items={copy.services} selected={1} at={24} local={local} />;
              case 2:
                return <ChoiceRow items={copy.references} selected={0} at={24} local={local} />;
              case 3:
                return <ChoiceRow items={copy.barbers} selected={0} at={24} local={local} />;
              case 4:
                return <SlotGrid slots={copy.slots} taken={2} attempt={2} chosen={3} local={local * 1.6} busyLabel={copy.busy} />;
              default:
                return (
                  <div style={{ padding: 30, borderRadius: b.radius, background: b.palette.surface, border: `1px solid ${b.palette.accent}` }}>
                    <div style={{ fontFamily: b.fonts.display, fontSize: 40, fontWeight: 600 }}>{copy.confirmTitle}</div>
                    <div style={{ marginTop: 10, fontFamily: b.fonts.body, fontSize: 22, color: b.palette.muted }}>{copy.confirmLine}</div>
                    <div style={{ marginTop: 24, display: "inline-flex", padding: "12px 20px", borderRadius: 999, background: b.palette.accent, color: b.palette.onAccent, fontFamily: b.fonts.display, fontSize: 24, fontWeight: 700, opacity: progress(local, 20, 34) }}>
                      ✓ {copy.confirmed}
                    </div>
                  </div>
                );
            }
          }}
        />
      </FlatPanel>
      <SampleBadge label={copy.sample} style={{ left: panelBox.x, top: panelBox.y + panelBox.h + 16 }} />
    </Fade>
  );
}

function PanelScene({ portrait, duration, language }: { portrait: boolean; duration: number; language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const copy = NB_COPY[language];
  const frameBox = portrait ? { x: 40, y: 250, w: 1000, h: 900 } : { x: 110, y: 172, w: 1380, h: 620 };
  const last = NB_PANEL_SHOTS[NB_PANEL_SHOTS.length - 1];
  const reelEnd = last.from + last.duration;
  const titleShow = interpolate(frame, [0, 16, 120, 140], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Fade duration={duration}>
      <Sequence name="Recorrido del panel" durationInFrames={reelEnd}>
        <Fade duration={reelEnd}>
          <CameraReel
            shots={NB_PANEL_SHOTS}
            frameBox={frameBox}
            imageAspect={NB_PANEL_CAPTURE.width / NB_PANEL_CAPTURE.height}
            nativeWidth={NB_PANEL_CAPTURE.width}
            host="nb-barber.vercel.app"
            noteLabels={copy.notes}
            srcFor={(shot) => `${PANELS}-${shot.name}.jpg`}
            blurFor={(shot) => `${BACKDROPS}-${shot.name}-blur.jpg`}
          />
        </Fade>
      </Sequence>
      <div style={{ opacity: titleShow }}>
        <BrandTitle kicker={copy.panelKicker} title={copy.panelTitle} size={portrait ? 58 : 40} style={portrait ? { left: 72, top: 96, width: 936 } : { left: 110, top: 92, width: 1000 }} />
      </div>
      <Sequence from={reelEnd} durationInFrames={duration - reelEnd}>
        <CounterSequence portrait={portrait} duration={duration - reelEnd} language={language} />
      </Sequence>
    </Fade>
  );
}

function CounterSequence({ portrait, duration, language }: { portrait: boolean; duration: number; language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const copy = NB_COPY[language];
  const panels = [
    { key: "ticket", kicker: copy.counter.kicker, title: copy.counter.title, from: 0 },
    { key: "cash", kicker: copy.cash.kicker, title: copy.cash.title, from: portrait ? 70 : 50 },
    { key: "payouts", kicker: copy.payouts.kicker, title: copy.payouts.title, from: portrait ? 140 : 100 },
  ];
  const w = portrait ? 1000 : 440;
  const h = portrait ? 860 : 600;
  return (
    <Fade duration={duration}>
      <BlurTravel src={`${BACKDROPS}-caja-blur.jpg`} duration={duration} opacity={0.3} />
      {panels.map((panel, index) => {
        const enter = progress(frame, panel.from, panel.from + 24);
        const leave = portrait && index < panels.length - 1 ? progress(frame, panels[index + 1].from, panels[index + 1].from + 20) : 0;
        const x = portrait ? 40 : 110 + index * (w + 30);
        const y = portrait ? 260 : 170;
        return (
          <FlatPanel key={panel.key} kicker={panel.kicker} title={panel.title} width={w} height={h} style={{ left: x, top: y, opacity: enter * (1 - leave), translate: `0 ${(1 - enter) * 40}px` }}>
            {panel.key === "ticket" ? <FlatTicket items={copy.ticket.items} method={copy.ticket.methods[0]} from={panel.from + 16} width={w - 68} labels={copy.ticket} /> : null}
            {panel.key === "cash" ? <FlatRows rows={copy.cash.rows} from={panel.from + 20} width={w - 68} /> : null}
            {panel.key === "payouts" ? <FlatRows rows={copy.payouts.rows} from={panel.from + 20} width={w - 68} /> : null}
          </FlatPanel>
        );
      })}
      <SampleBadge label={copy.sample} style={{ left: portrait ? 40 : 110, top: portrait ? 1150 : 800, borderColor: alpha(b.palette.muted, 60) }} />
    </Fade>
  );
}

function OutcomeScene({ portrait, duration, language }: { portrait: boolean; duration: number; language: FilmLanguage }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const copy = NB_COPY[language];
  const facts = copy.facts;
  const titleSize = portrait ? 80 : 64;
  return (
    <Fade duration={duration + 20}>
      <BlurTravel src={`${BACKDROPS}-desktop-1-blur.jpg`} duration={duration} opacity={0.22} />
      {/* Título, cifras y dominio en una sola columna: cada bloque empuja al siguiente, nada se pisa. */}
      <div style={{ position: "absolute", left: portrait ? 72 : 110, top: portrait ? 170 : 140, width: portrait ? 936 : 1380, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <BrandTitle kicker={copy.outcomeKicker} title={copy.outcomeTitle} size={titleSize} style={{ position: "relative" }} />
        <div style={{ marginTop: portrait ? 70 : 56, display: "grid", gridTemplateColumns: portrait ? "1fr 1fr" : "repeat(4, 1fr)", gap: 22, width: "100%" }}>
          {facts.map((fact, index) => {
            const enter = progress(frame, 40 + index * 10, 66 + index * 10);
            return (
              <div key={fact.label} style={{ padding: "26px 28px", borderRadius: b.radius, background: b.palette.surface, border: `1px solid ${b.palette.line}`, opacity: enter, translate: `0 ${(1 - enter) * 24}px` }}>
                <div style={{ fontFamily: b.fonts.display, fontSize: portrait ? 84 : 72, fontWeight: 700, lineHeight: 1, color: b.palette.accent }}>{fact.value}</div>
                <div style={{ marginTop: 10, fontFamily: b.fonts.body, fontSize: portrait ? 26 : 20, color: b.palette.muted }}>{fact.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: portrait ? 44 : 36, padding: "12px 22px", borderRadius: 999, border: `1px solid ${alpha(b.palette.accent, 50)}`, fontFamily: b.fonts.body, fontSize: portrait ? 26 : 20, color: b.palette.text, opacity: progress(frame, 90, 110) }}>
          ● nb-barber.vercel.app
        </div>
      </div>
    </Fade>
  );
}
