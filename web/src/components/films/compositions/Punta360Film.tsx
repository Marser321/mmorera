import { Img, Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  PUNTA_ASSETS,
  PUNTA_CHAPTERS,
  PUNTA_COPY,
  PUNTA_FACTS,
  PUNTA_TIMELINE,
} from "@/data/films/flagships/punta360";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateOpening } from "./kit/KitScenes";
import {
  puntaComparisonLayout,
  puntaPlansLayout,
  puntaVirtualTourLayout,
  puntaWorkflowLayout,
} from "./punta360FilmLayout";

export type Punta360FilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["punta-360"];

/**
 * Escena de Comparativa Visual: HDR Profesional vs Foto Celular.
 */
function ComparisonScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = PUNTA_COPY.comparison;
  const layout = puntaComparisonLayout(format, language);

  const leftIn = progress(frame, 10, 26, EASE_IN_OUT);
  const rightIn = progress(frame, 22, 38, EASE_IN_OUT);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={PUNTA_COPY.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: "left",
        }}
      />

      {/* Lado izquierdo: Foto Celular Amateur */}
      <div style={{ opacity: leftIn }}>
        <KitPanel box={layout.leftCard} />
        <div
          style={{
            ...boxStyle(layout.leftCard),
            position: "absolute",
            borderRadius: b.radius,
            overflow: "hidden",
            border: `1px solid ${alpha(b.palette.line, 70)}`,
          }}
        >
          <Img
            src={PUNTA_ASSETS.enterpriseShot.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(40%) contrast(85%) brightness(80%)",
            }}
          />
        </div>

        <div
          style={{
            ...boxStyle(layout.leftBadge),
            borderRadius: 99,
            background: alpha(b.palette.surface, 85),
            border: `1px solid ${b.palette.line}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
          }}
        >
          <BoxText
            block={layout.leftBadgeBlock}
            style={{
              fontFamily: b.fonts.label,
              color: b.palette.muted,
              fontSize: 13,
              fontWeight: 600,
            }}
          />
        </div>
      </div>

      {/* Lado derecho: HDR Editorial Pro (con acento ámbar y mayor luminosidad) */}
      <div style={{ opacity: rightIn }}>
        <KitPanel box={layout.rightCard} glow={0.5} />
        <div
          style={{
            ...boxStyle(layout.rightCard),
            position: "absolute",
            borderRadius: b.radius,
            overflow: "hidden",
            border: `1.5px solid ${b.palette.accent}`,
            boxShadow: `0 0 32px ${alpha(b.palette.accent, 20)}`,
          }}
        >
          <Img
            src={PUNTA_ASSETS.ownersShot.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div
          style={{
            ...boxStyle(layout.rightBadge),
            borderRadius: 99,
            background: alpha(b.palette.accent, 20),
            border: `1px solid ${b.palette.accent}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
          }}
        >
          <BoxText
            block={layout.rightBadgeBlock}
            style={{
              fontFamily: b.fonts.label,
              color: b.palette.accent,
              fontSize: 13,
              fontWeight: 700,
            }}
          />
        </div>
      </div>
    </Fade>
  );
}

/**
 * Escena protagonista: Tour Inmersivo 3D Espacial.
 * Simula navegación fotográfica con telemetría, retícula de escaneo y hotspots interactivos.
 */
function VirtualTourScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = PUNTA_COPY.tour;
  const layout = puntaVirtualTourLayout(format, language);

  // Cámara panorámica suave en el viewport
  const panX = Math.sin((frame / 180) * Math.PI) * 20;
  const panScale = 1.05 + Math.sin((frame / 240) * Math.PI) * 0.03;

  // Pulso de los hotspots
  const pulse = Math.sin((frame / 18) * Math.PI) * 0.2 + 0.8;

  // Aparición escalonada de elementos
  const viewportIn = progress(frame, 8, 24, EASE_IN_OUT);
  const hotspotIn = progress(frame, 30, 48, EASE_IN_OUT);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      {/* Ventana de visualización 3D */}
      <div style={{ opacity: viewportIn }}>
        <KitPanel box={layout.viewportBox} glow={0.4} />
        <div
          style={{
            ...boxStyle(layout.viewportBox),
            position: "absolute",
            borderRadius: b.radius,
            overflow: "hidden",
            border: `1.5px solid ${alpha(b.palette.accent, 60)}`,
          }}
        >
          <Img
            src={PUNTA_ASSETS.ownersShot.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${panScale}) translateX(${panX}px)`,
            }}
          />

          {/* Retícula sutil de escaneo espacial */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${alpha(b.palette.accent, 12)} 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
              pointerEvents: "none",
            }}
          />

          {/* Cruz central de calibración de cámara */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 24,
              height: 24,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <div style={{ position: "absolute", left: 11, top: 0, width: 2, height: 24, background: alpha(b.palette.accent, 40) }} />
            <div style={{ position: "absolute", left: 0, top: 11, width: 24, height: 2, background: alpha(b.palette.accent, 40) }} />
          </div>
        </div>

        {/* Hotspots interactivos */}
        <div style={{ opacity: hotspotIn }}>
          {layout.hotspots.map((h) => (
            <div key={h.id}>
              {/* Marcador circular con pulso */}
              <div
                style={{
                  ...boxStyle(h.marker),
                  borderRadius: "50%",
                  background: alpha(b.palette.accent, 40),
                  border: `2px solid ${b.palette.accent}`,
                  boxShadow: `0 0 ${16 * pulse}px ${b.palette.accent}`,
                  transform: `scale(${pulse})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                  }}
                />
              </div>

              {/* Tarjeta de detalle de espacio */}
              <KitPanel box={h.card} glow={0.3} />
              <div
                style={{
                  ...boxStyle(h.card),
                  position: "absolute",
                  borderRadius: 16,
                  background: alpha(b.palette.surface, 85),
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${alpha(b.palette.accent, 40)}`,
                  padding: "12px 18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: b.fonts.display,
                    fontSize: format === "portrait" ? 20 : 16,
                    fontWeight: 700,
                    color: b.palette.accent,
                    marginBottom: 4,
                  }}
                >
                  {h.titleBlock.text}
                </div>
                <div
                  style={{
                    fontFamily: b.fonts.body,
                    fontSize: format === "portrait" ? 16 : 13,
                    color: b.palette.text,
                    opacity: 0.85,
                  }}
                >
                  {h.detailBlock.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra inferior de telemetría */}
        <div
          style={{
            ...boxStyle(layout.telemetryBar),
            borderRadius: 12,
            background: alpha(b.palette.surface, 80),
            border: `1px solid ${b.palette.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <BoxText
            block={layout.telemetryBlock}
            style={{
              fontFamily: b.fonts.label,
              color: b.palette.accent,
              fontWeight: 600,
              fontSize: format === "portrait" ? 18 : 15,
            }}
          />
          <div
            style={{
              fontFamily: b.fonts.label,
              fontSize: format === "portrait" ? 16 : 13,
              color: b.palette.muted,
              letterSpacing: 1,
            }}
          >
            360° VR READY · 4K HDR
          </div>
        </div>
      </div>
    </Fade>
  );
}

/**
 * Escena de Flujo de Trabajo en 4 Fases (Simple & Transparente).
 */
function WorkflowScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = PUNTA_COPY.workflow;
  const layout = puntaWorkflowLayout(format, language);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: "left",
        }}
      />

      {layout.steps.map((s, index) => {
        const stepIn = progress(frame, 10 + index * 6, 26 + index * 6, EASE_IN_OUT);
        return (
          <div key={s.step} style={{ opacity: stepIn }}>
            <KitPanel box={s.card} />
            <div
              style={{
                ...boxStyle(s.card),
                position: "absolute",
                borderRadius: b.radius,
                border: `1px solid ${b.palette.line}`,
                padding: format === "portrait" ? "12px 16px" : "18px 20px",
                display: "flex",
                flexDirection: format === "portrait" ? "row" : "column",
                alignItems: format === "portrait" ? "center" : "flex-start",
                gap: format === "portrait" ? 16 : 10,
              }}
            >
              <div
                style={{
                  fontFamily: b.fonts.display,
                  fontSize: format === "portrait" ? 28 : 34,
                  fontWeight: 900,
                  color: b.palette.accent,
                  lineHeight: 1,
                }}
              >
                {s.step}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    fontFamily: b.fonts.display,
                    fontSize: format === "portrait" ? 20 : 22,
                    fontWeight: 700,
                    color: b.palette.text,
                  }}
                >
                  {s.titleBlock.text}
                </div>
                <div
                  style={{
                    fontFamily: b.fonts.body,
                    fontSize: format === "portrait" ? 15 : 15,
                    color: b.palette.muted,
                    lineHeight: 1.35,
                  }}
                >
                  {s.descBlock.text}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Escena de Planes de Suscripción para Agentes y Agencias.
 */
function PlansScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = PUNTA_COPY.plans;
  const layout = puntaPlansLayout(format, language);

  const pulse = Math.sin((frame / 26) * Math.PI) * 0.15 + 0.85;

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: "left",
        }}
      />

      {layout.cards.map((c, index) => {
        const cardIn = progress(frame, 10 + index * 6, 26 + index * 6, EASE_IN_OUT);
        const isGrowth = c.id === "growth";
        const borderColor = isGrowth ? b.palette.accent : b.palette.line;

        return (
          <div key={c.id} style={{ opacity: cardIn }}>
            <KitPanel box={c.card} glow={isGrowth ? 0.6 * pulse : 0.1} />
            <div
              style={{
                ...boxStyle(c.card),
                position: "absolute",
                borderRadius: b.radius,
                border: isGrowth ? `1.5px solid ${borderColor}` : `1px solid ${b.palette.line}`,
                padding: format === "portrait" ? "12px 18px" : "20px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div
                    style={{
                      fontFamily: b.fonts.display,
                      fontSize: format === "portrait" ? 22 : 24,
                      fontWeight: 700,
                      color: isGrowth ? b.palette.accent : b.palette.text,
                    }}
                  >
                    {c.nameBlock.text}
                  </div>
                  {isGrowth && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 99,
                        background: alpha(b.palette.accent, 20),
                        border: `1px solid ${b.palette.accent}`,
                        fontSize: 12,
                        fontWeight: 700,
                        color: b.palette.accent,
                      }}
                    >
                      {language === "es" ? "Más vendido" : "Most popular"}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 10 }}>
                  <span
                    style={{
                      fontFamily: b.fonts.display,
                      fontSize: format === "portrait" ? 32 : 36,
                      fontWeight: 900,
                      color: b.palette.text,
                    }}
                  >
                    {c.priceBlock.text}
                  </span>
                  <span
                    style={{
                      fontFamily: b.fonts.body,
                      fontSize: 15,
                      color: b.palette.muted,
                    }}
                  >
                    {c.cadenceBlock.text}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
                  {c.features.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        fontFamily: b.fonts.body,
                        fontSize: format === "portrait" ? 15 : 14,
                        color: b.palette.text,
                        opacity: 0.9,
                      }}
                    >
                      {f.text}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  ...boxStyle(c.ctaBox),
                  position: "relative",
                  borderRadius: 99,
                  background: isGrowth ? b.palette.accent : alpha(b.palette.raised, 80),
                  border: `1px solid ${isGrowth ? b.palette.accent : b.palette.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: b.fonts.display,
                    fontSize: 14,
                    fontWeight: 700,
                    color: isGrowth ? b.palette.onAccent : b.palette.text,
                  }}
                >
                  {c.ctaBlock.text}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Escena de Cifras e Impacto Comercial (FactsBeat).
 */
function MetricsScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const copy = PUNTA_COPY.metrics;
  const facts = [
    { value: `${PUNTA_FACTS.disciplines.value}`, label: copy.disciplines[language], source: language === "es" ? "sitio en producción" : "live site" },
    { value: `${PUNTA_FACTS.steps.value}`, label: copy.steps[language], source: language === "es" ? "sitio en producción" : "live site" },
    { value: `${PUNTA_FACTS.plans.value}`, label: copy.plans[language], source: language === "es" ? "sitio en producción" : "live site" },
  ];

  return (
    <FactsBeat
      format={format}
      duration={duration}
      language={language}
      kicker={copy.kicker[language]}
      title={copy.title[language]}
      facts={facts}
    />
  );
}

/**
 * Composición principal del film insignia Punta360.
 */
export function Punta360Film({ language = "es" }: Punta360FilmProps) {
  const { portrait, width, height, fps } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const b = brand.palette;

  return (
    <KitFrame brand={brand} chapters={[...PUNTA_CHAPTERS]}>
      {/* 0. Apertura de marca (7s / 210 f) */}
      <Sequence from={PUNTA_TIMELINE.opening.from} durationInFrames={PUNTA_TIMELINE.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={PUNTA_TIMELINE.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: PUNTA_ASSETS.heroLoop,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 480, h: 120 },
            markAspect: 1,
          }}
          asset={PUNTA_ASSETS.heroLoop}
          poster="/portfolio/brands/punta-360/hero-loop-poster.jpg"
          kicker={PUNTA_COPY.kicker[language]}
          tagline={PUNTA_COPY.tagline[language]}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 1. Comparativa HDR Profesional vs Foto Celular (8.5s / 255 f) */}
      <Sequence from={PUNTA_TIMELINE.comparison.from} durationInFrames={PUNTA_TIMELINE.comparison.duration}>
        <ComparisonScene
          format={format}
          duration={PUNTA_TIMELINE.comparison.duration}
          language={language}
        />
      </Sequence>

      {/* 2. Tour Inmersivo 3D Espacial (PROTAGONISTA: 24s / 720 f) */}
      <Sequence from={PUNTA_TIMELINE.tour.from} durationInFrames={PUNTA_TIMELINE.tour.duration}>
        <VirtualTourScene
          format={format}
          duration={PUNTA_TIMELINE.tour.duration}
          language={language}
        />
      </Sequence>

      {/* 3. Metodología en 4 fases operativas (9.5s / 285 f) */}
      <Sequence from={PUNTA_TIMELINE.workflow.from} durationInFrames={PUNTA_TIMELINE.workflow.duration}>
        <WorkflowScene
          format={format}
          duration={PUNTA_TIMELINE.workflow.duration}
          language={language}
        />
      </Sequence>

      {/* 4. Planes de Suscripción para Agentes (9s / 270 f) */}
      <Sequence from={PUNTA_TIMELINE.plans.from} durationInFrames={PUNTA_TIMELINE.plans.duration}>
        <PlansScene
          format={format}
          duration={PUNTA_TIMELINE.plans.duration}
          language={language}
        />
      </Sequence>

      {/* 5. Métricas de Impacto Comercial (7s / 210 f) */}
      <Sequence from={PUNTA_TIMELINE.metrics.from} durationInFrames={PUNTA_TIMELINE.metrics.duration}>
        <MetricsScene
          format={format}
          duration={PUNTA_TIMELINE.metrics.duration}
          language={language}
        />
      </Sequence>

      {/* 6. Firma y Cierre (6.5s / 195 f) */}
      <Sequence from={PUNTA_TIMELINE.signature.from} durationInFrames={PUNTA_TIMELINE.signature.duration} premountFor={fps}>
        <SignatureScene
          portrait={portrait}
          width={width}
          height={height}
          duration={PUNTA_TIMELINE.signature.duration}
        />
      </Sequence>
    </KitFrame>
  );
}
