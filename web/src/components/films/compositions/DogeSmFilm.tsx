import { Img, Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  DOGE_ASSETS,
  DOGE_CHAPTERS,
  DOGE_COPY,
  DOGE_SERVICE_TRIO,
  DOGE_TIMELINE,
  DOGE_WORKFLOW_STEPS,
} from "@/data/films/flagships/dogeSm";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateManifesto, PlateOpening } from "./kit/KitScenes";
import { kitBands } from "./kit/kitLayout";
import { dogeTierOfferLayout } from "./dogeSmFilmLayout";

export type DogeSmFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["doge-sm"];

/**
 * Escena protagonista: La Oferta de Membresías por Niveles.
 * Geometría calculada por dogeTierOfferLayout (pura, sin React y verificada por test).
 */
function TierOfferScene({
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
  const copy = DOGE_COPY[language];
  const layout = dogeTierOfferLayout(format, copy, language);

  // Ciclo sutil de selección activa o foco en Signature (la más popular)
  // Se da un leve pulso de luz en Signature a lo largo del tiempo
  const pulse = Math.sin((frame / 28) * Math.PI) * 0.15 + 0.85;

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.tiers.badge}
        title={copy.tiers.title}
        box={layout.title}
        format={format}
      />

      {/* Subtítulo explicativo */}
      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: format === "portrait" ? "center" : "left",
        }}
      />

      {/* Tarjetas de planes */}
      {layout.cards.map((c, index) => {
        const cardIn = progress(frame, 12 + index * 6, 28 + index * 6, EASE_IN_OUT);
        const isSignature = c.id === "signature";
        const glow = isSignature ? 0.7 * pulse : 0.15;
        const borderColor = isSignature ? b.palette.accent : b.palette.line;

        return (
          <div key={c.id} style={{ opacity: cardIn }}>
            <KitPanel box={c.card} glow={glow} />
            <div
              style={{
                ...boxStyle(c.card),
                position: "absolute",
                borderRadius: b.radius,
                border: isSignature ? `1.5px solid ${borderColor}` : `1px solid ${b.palette.line}`,
                pointerEvents: "none",
              }}
            />

            {/* Badge de categoría */}
            <div
              style={{
                ...boxStyle(c.badgeBox),
                borderRadius: 99,
                background: isSignature
                  ? alpha(b.palette.accent, 24)
                  : alpha(b.palette.raised, 85),
                border: `1px solid ${isSignature ? b.palette.accent : b.palette.line}`,
              }}
            />
            <BoxText
              block={c.badgeBlock}
              align="center"
              style={{
                fontFamily: b.fonts.label,
                fontWeight: 700,
                color: isSignature ? b.palette.accentSoft : b.palette.muted,
              }}
            />

            {/* Nombre del plan */}
            <BoxText
              block={c.nameBlock}
              style={{
                fontFamily: b.fonts.display,
                fontWeight: 700,
                color: b.palette.text,
              }}
            />

            {/* Cadencia */}
            <BoxText
              block={c.cadenceBlock}
              style={{
                fontFamily: b.fonts.body,
                color: b.palette.muted,
              }}
            />

            {/* Precio & Período */}
            <div style={{ ...boxStyle(c.priceBox), position: "absolute", pointerEvents: "none" }} />
            <BoxText
              block={c.priceBlock}
              style={{
                fontFamily: b.fonts.display,
                fontWeight: 800,
                color: isSignature ? b.palette.accentSoft : b.palette.text,
              }}
            />
            <BoxText
              block={c.periodBlock}
              style={{
                fontFamily: b.fonts.body,
                color: b.palette.muted,
              }}
            />

            {/* Características */}
            {c.features.map((feat) => (
              <BoxText
                key={feat.id}
                block={feat}
                style={{
                  fontFamily: b.fonts.body,
                  color: b.palette.text,
                }}
              />
            ))}

            {/* Botón CTA */}
            <div
              style={{
                ...boxStyle(c.ctaBox),
                borderRadius: 8,
                background: isSignature ? b.palette.accent : alpha(b.palette.raised, 90),
                border: `1px solid ${isSignature ? b.palette.accent : b.palette.line}`,
              }}
            />
            <BoxText
              block={c.ctaBlock}
              align="center"
              style={{
                fontFamily: b.fonts.label,
                fontWeight: 700,
                color: isSignature ? "#FFFFFF" : b.palette.text,
              }}
            />
          </div>
        );
      })}

      {/* Barra inferior de resumen y evaluación previa */}
      <div
        style={{
          ...boxStyle(layout.summaryBar),
          borderRadius: 8,
          background: alpha(b.palette.surface, 85),
          border: `1px solid ${alpha(b.palette.accent, 40)}`,
        }}
      />
      <BoxText
        block={layout.summaryBlock}
        align="center"
        style={{
          fontFamily: b.fonts.label,
          fontWeight: 600,
          color: b.palette.accentSoft,
        }}
      />
    </Fade>
  );
}

/**
 * Escena de Flujo de Solicitud (Cómo Funciona en 4 Pasos).
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
  const copy = DOGE_COPY[language];
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const scale = 1.0 + 0.04 * progress(frame, 0, duration, EASE_IN_OUT);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.workflow.kicker}
        title={copy.workflow.title}
        box={title}
        format={format}
      />

      <div
        style={{
          ...boxStyle(body),
          display: "grid",
          gridTemplateColumns: portrait ? "1fr" : "1.1fr 1fr",
          gridTemplateRows: portrait ? "260px 1fr" : "1fr",
          gap: portrait ? 16 : 24,
        }}
      >
        {/* Panel izquierdo/superior: Fotografía del flujo operativo */}
        <div
          style={{
            position: "relative",
            borderRadius: b.radius,
            overflow: "hidden",
            border: `1px solid ${b.palette.line}`,
            background: b.palette.surface,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={DOGE_ASSETS.shotWorkflow.src}
              style={{ width: "100%", height: "100%", objectFit: "cover", maxWidth: "none" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, ${alpha(b.palette.bg, 90)} 0%, transparent 60%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 20,
              right: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: b.fonts.label,
                fontSize: portrait ? 13 : 12,
                color: b.palette.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              doge-27dp.vercel.app · Flujo Operativo
            </span>
            <span
              style={{
                fontFamily: b.fonts.label,
                fontSize: portrait ? 13 : 12,
                color: b.palette.accentSoft,
                fontWeight: 700,
              }}
            >
              4 ETAPAS
            </span>
          </div>
        </div>

        {/* Panel derecho/inferior: 4 Pasos del Flujo */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: portrait ? 10 : 12,
          }}
        >
          {DOGE_WORKFLOW_STEPS.map((step, idx) => {
            const stepIn = progress(frame, 12 + idx * 8, 28 + idx * 8, EASE_IN_OUT);
            const activeStep = Math.floor((frame / (duration / 4)));
            const isActive = idx === activeStep;

            return (
              <div
                key={step.step}
                style={{
                  opacity: stepIn,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 18px",
                  borderRadius: b.radius * 0.7,
                  background: isActive ? alpha(b.palette.raised, 95) : alpha(b.palette.surface, 85),
                  border: `1px solid ${isActive ? b.palette.accent : b.palette.line}`,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: isActive ? b.palette.accent : alpha(b.palette.raised, 90),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: b.fonts.label,
                    fontWeight: 800,
                    fontSize: portrait ? 17 : 15,
                    color: isActive ? "#FFFFFF" : b.palette.muted,
                    flexShrink: 0,
                  }}
                >
                  {step.step}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: b.fonts.display,
                      fontWeight: 600,
                      fontSize: portrait ? 18 : 16,
                      color: isActive ? b.palette.accentSoft : b.palette.text,
                    }}
                  >
                    {step.title[language]}
                  </div>
                  <div
                    style={{
                      fontFamily: b.fonts.body,
                      fontSize: portrait ? 14 : 13,
                      color: b.palette.muted,
                      marginTop: 2,
                      lineHeight: 1.25,
                    }}
                  >
                    {step.desc[language]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Fade>
  );
}

/**
 * Escena de Especialidades Técnicas (Tres Líneas de Servicio).
 */
function ServicesScene({
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
  const copy = DOGE_COPY[language];
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const photos = [
    DOGE_ASSETS.serviceWindow,
    DOGE_ASSETS.servicePressure,
    DOGE_ASSETS.serviceCarpet,
  ];

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.services.kicker}
        title={copy.services.title}
        box={title}
        format={format}
      />

      <div
        style={{
          ...boxStyle(body),
          display: "grid",
          gridTemplateColumns: portrait ? "1fr" : "repeat(3, 1fr)",
          gridTemplateRows: portrait ? "repeat(3, 1fr)" : "1fr",
          gap: portrait ? 14 : 20,
        }}
      >
        {DOGE_SERVICE_TRIO.map((service, idx) => {
          const cardIn = progress(frame, 10 + idx * 8, 26 + idx * 8, EASE_IN_OUT);
          const photo = photos[idx];

          return (
            <div
              key={service.id}
              style={{
                opacity: cardIn,
                borderRadius: b.radius,
                overflow: "hidden",
                border: `1px solid ${b.palette.line}`,
                background: b.palette.surface,
                display: "flex",
                flexDirection: portrait ? "row" : "column",
              }}
            >
              {/* Imagen del servicio */}
              <div
                style={{
                  position: "relative",
                  width: portrait ? "38%" : "100%",
                  height: portrait ? "100%" : "52%",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                <Img
                  src={photo.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover", maxWidth: "none" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: portrait
                      ? `linear-gradient(to right, transparent 50%, ${alpha(b.palette.surface, 90)} 100%)`
                      : `linear-gradient(to top, ${alpha(b.palette.surface, 95)} 0%, transparent 60%)`,
                  }}
                />
              </div>

              {/* Contenido técnico */}
              <div
                style={{
                  padding: portrait ? "16px 20px" : "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    alignSelf: "flex-start",
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: alpha(b.palette.accent, 20),
                    border: `1px solid ${alpha(b.palette.accent, 50)}`,
                    fontFamily: b.fonts.label,
                    fontSize: portrait ? 13 : 11,
                    fontWeight: 700,
                    color: b.palette.accentSoft,
                    marginBottom: 8,
                  }}
                >
                  {service.spec[language]}
                </div>
                <div
                  style={{
                    fontFamily: b.fonts.display,
                    fontWeight: 700,
                    fontSize: portrait ? 19 : 17,
                    color: b.palette.text,
                    marginBottom: 6,
                  }}
                >
                  {service.title[language]}
                </div>
                <div
                  style={{
                    fontFamily: b.fonts.body,
                    fontSize: portrait ? 14 : 12,
                    color: b.palette.muted,
                    lineHeight: 1.3,
                  }}
                >
                  {service.desc[language]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Fade>
  );
}

/**
 * Film insignia de DOGE.S.M LLC:
 * "Limpieza de Élite y Conservación de Activos Inmobiliarios en Miami".
 */
export function DogeSmFilm({ language = "es" }: DogeSmFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const copy = DOGE_COPY[language];
  const T = DOGE_TIMELINE;
  const b = brand.palette;

  const factsList = copy.facts.cards.map((c) => ({
    value: c.value,
    label: c.label,
    source: c.note,
  }));

  return (
    <KitFrame brand={brand} chapters={[...DOGE_CHAPTERS]}>
      {/* 1. Apertura con partículas y monograma DOGE (0 - 8.0s) */}
      <Sequence name="Identidad" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={T.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: DOGE_ASSETS.heroLoop,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 460, h: 92 },
            markAspect: 1,
          }}
          asset={DOGE_ASSETS.heroLoop}
          poster="/portfolio/brands/doge-sm/hero-loop-poster.jpg"
          kicker={copy.opening.kicker}
          tagline={copy.opening.tagline}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 2. Manifiesto: Preservación de Activos Inmobiliarios (8.0s - 19.0s) */}
      <Sequence name="Manifiesto" from={T.manifesto.from} durationInFrames={T.manifesto.duration} premountFor={fps}>
        <PlateManifesto
          format={format}
          duration={T.manifesto.duration}
          asset={DOGE_ASSETS.shotHero}
          beats={copy.manifesto.pillars.map((p) => ({ kicker: p.label, text: p.desc }))}
          ratio={[1.1, 0.9]}
          plates={[
            { asset: DOGE_ASSETS.shotHero, focal: { x: 0.5, y: 0.5 } },
            { asset: DOGE_ASSETS.shotWorkflow, focal: { x: 0.5, y: 0.5 } },
            { asset: DOGE_ASSETS.shotServices, focal: { x: 0.5, y: 0.5 } },
          ]}
        />
      </Sequence>

      {/* 3. Protagonista: Oferta de Membresías por Niveles (19.0s - 39.0s) */}
      <Sequence name="Membresías" from={T.tiers.from} durationInFrames={T.tiers.duration} premountFor={fps}>
        <TierOfferScene format={format} duration={T.tiers.duration} language={language} />
      </Sequence>

      {/* 4. Flujo de Solicitud en 4 Pasos (39.0s - 51.0s) */}
      <Sequence name="Flujo" from={T.workflow.from} durationInFrames={T.workflow.duration} premountFor={fps}>
        <WorkflowScene format={format} duration={T.workflow.duration} language={language} />
      </Sequence>

      {/* 5. Especialidades Técnicas (51.0s - 60.0s) */}
      <Sequence name="Servicios" from={T.services.from} durationInFrames={T.services.duration} premountFor={fps}>
        <ServicesScene format={format} duration={T.services.duration} language={language} />
      </Sequence>

      {/* 6. Muro de Cifras Verificadas (60.0s - 67.0s) */}
      <Sequence name="Métricas" from={T.facts.from} durationInFrames={T.facts.duration} premountFor={fps}>
        <FactsBeat
          format={format}
          duration={T.facts.duration}
          language={language}
          kicker={copy.facts.kicker}
          title={copy.facts.title}
          facts={factsList}
        />
      </Sequence>

      {/* 7. Firma y Cierre Institucional (67.0s - 71.5s) */}
      <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
        <SignatureScene
          portrait={portrait}
          width={width}
          height={height}
          duration={T.signature.duration}
        />
      </Sequence>
    </KitFrame>
  );
}
