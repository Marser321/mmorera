import { Img, Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  LNB_ASSETS,
  LNB_BUILDER_STEPS,
  LNB_CHAPTERS,
  LNB_COPY,
  LNB_FACTS,
  LNB_TIMELINE,
} from "@/data/films/flagships/lnbSaas";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateOpening } from "./kit/KitScenes";
import {
  lnbCakeBuilderLayout,
  lnbExpressLayout,
  lnbLoyaltyLayout,
  lnbStudiosLayout,
} from "./lnbSaasFilmLayout";

export type LnbSaasFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["lnb-saas"];

/**
 * Escena 1: Craving Studios Modulares (8.5s / 255 frames).
 */
function StudiosScene({
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
  const copy = LNB_COPY.studios;
  const layout = lnbStudiosLayout(format, language);

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

      {layout.studios.map((st, i) => {
        const itemIn = progress(frame, 10 + i * 8, 24 + i * 8, EASE_IN_OUT);
        const isCake = st.id === "cakes";

        return (
          <div
            key={st.id}
            style={{
              opacity: itemIn,
              transform: `translateY(${(1 - itemIn) * 14}px)`,
            }}
          >
            <KitPanel box={st.card} glow={isCake ? 0.45 : 0.15} />
            <div
              style={{
                ...boxStyle(st.card),
                position: "absolute",
                borderRadius: b.radius,
                background: alpha(b.palette.surface, isCake ? 92 : 80),
                border: `1.5px solid ${isCake ? b.palette.accent : alpha(b.palette.line, 70)}`,
                boxShadow: isCake ? `0 0 24px ${alpha(b.palette.accent, 25)}` : "none",
                padding: format === "portrait" ? 16 : 20,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Badge superior */}
              <div
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 99,
                  background: isCake ? alpha(b.palette.accent, 20) : alpha(b.palette.raised, 80),
                  border: `1px solid ${isCake ? b.palette.accent : b.palette.line}`,
                  padding: "4px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: b.fonts.label,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isCake ? b.palette.accentSoft : b.palette.muted,
                    letterSpacing: 0.5,
                  }}
                >
                  {st.tagBlock.text}
                </span>
              </div>

              {/* Título del Studio */}
              <div
                style={{
                  fontFamily: b.fonts.display,
                  fontSize: format === "portrait" ? 18 : 20,
                  fontWeight: 700,
                  color: isCake ? b.palette.accentSoft : b.palette.text,
                  marginTop: 14,
                  marginBottom: 8,
                }}
              >
                {st.titleBlock.text}
              </div>

              {/* Descripción */}
              <div
                style={{
                  fontFamily: b.fonts.body,
                  fontSize: 13.5,
                  lineHeight: 1.45,
                  color: b.palette.muted,
                }}
              >
                {st.descBlock.text}
              </div>
            </div>
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Escena 2 PROTAGONISTA: The Cake Studio (24.0s / 720 frames).
 * Configurador interactivo por capas con previsualización en vivo.
 */
function CakeBuilderScene({
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
  const copy = LNB_COPY.builder;
  const layout = lnbCakeBuilderLayout(format, language);

  const phase1In = progress(frame, 15, 35, EASE_IN_OUT);
  const phase2In = progress(frame, 220, 245, EASE_IN_OUT);
  const phase3In = progress(frame, 450, 480, EASE_IN_OUT);

  const activePhaseIndex = frame < 220 ? 0 : frame < 450 ? 1 : 2;

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

      {/* Lado izquierdo: Preview interactivo de la torta */}
      <div style={{ opacity: phase1In }}>
        <KitPanel box={layout.previewCard} glow={0.5} />
        <div
          style={{
            ...boxStyle(layout.previewCard),
            position: "absolute",
            borderRadius: b.radius,
            background: alpha(b.palette.surface, 92),
            border: `1.5px solid ${b.palette.accent}`,
            boxShadow: `0 0 32px ${alpha(b.palette.accent, 20)}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 20px",
          }}
        >
          {/* Captura de fondo difuminada con textura de pastelería */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.18,
              mixBlendMode: "luminosity",
            }}
          >
            <Img
              src={LNB_ASSETS.studioShot.src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                maxWidth: "none",
              }}
            />
          </div>

          {/* Badge superior de previsualización */}
          <div
            style={{
              borderRadius: 99,
              background: alpha(b.palette.bg, 85),
              border: `1px solid ${alpha(b.palette.accent, 50)}`,
              padding: "6px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: b.fonts.label,
                fontSize: 12,
                fontWeight: 700,
                color: b.palette.accentSoft,
                letterSpacing: 1,
              }}
            >
              {layout.previewBadgeBlock.text}
            </span>
          </div>

          {/* Área de pastel por capas visuales centrada */}
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              zIndex: 2,
            }}
          >
            {/* Capa 3: Cobertura (Merengue italiano dorado) */}
            <div
              style={{
                width: "68%",
                height: format === "portrait" ? 44 : 58,
                borderRadius: "14px 14px 6px 6px",
                background: `linear-gradient(180deg, #FDE68A 0%, #D97706 100%)`,
                border: "2px solid #FBBF24",
                boxShadow: `0 0 24px ${alpha("#F59E0B", 40)}`,
                opacity: phase3In,
                transform: `scale(${0.9 + 0.1 * phase3In}) translateY(${(1 - phase3In) * -16}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1C1917",
                fontWeight: 700,
                fontSize: format === "portrait" ? 13 : 15,
                fontFamily: b.fonts.display,
              }}
            >
              <span>{LNB_BUILDER_STEPS[2].choice[language]}</span>
            </div>

            {/* Capa 2: Relleno (Dulce de Leche & Frutos Rojos) */}
            <div
              style={{
                width: "82%",
                height: format === "portrait" ? 40 : 52,
                borderRadius: "8px",
                background: `linear-gradient(90deg, #B45309 0%, #991B1B 50%, #B45309 100%)`,
                border: "2px solid #F59E0B",
                boxShadow: `0 0 16px ${alpha("#B45309", 50)}`,
                opacity: phase2In,
                transform: `scale(${0.92 + 0.08 * phase2In}) translateY(${(1 - phase2In) * -12}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: format === "portrait" ? 13 : 15,
                fontFamily: b.fonts.display,
              }}
            >
              <span>{LNB_BUILDER_STEPS[1].choice[language]}</span>
            </div>

            {/* Capa 1: Base bizcochuelo (Vainilla Bourbon) */}
            <div
              style={{
                width: "95%",
                height: format === "portrait" ? 48 : 64,
                borderRadius: "6px 6px 16px 16px",
                background: `linear-gradient(180deg, #78350F 0%, #451A03 100%)`,
                border: "2px solid #D97706",
                boxShadow: `0 4px 20px rgba(0,0,0,0.6)`,
                opacity: phase1In,
                transform: `translateY(${(1 - phase1In) * 16}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F5F5F4",
                fontWeight: 700,
                fontSize: format === "portrait" ? 13 : 15,
                fontFamily: b.fonts.display,
              }}
            >
              <span>{LNB_BUILDER_STEPS[0].choice[language]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho: Tarjetas de selección por pasos */}
      {layout.steps.map((st, i) => {
        const stepIn = progress(frame, 20 + i * 16, 40 + i * 16, EASE_IN_OUT);
        const isActive = activePhaseIndex === i;

        return (
          <div
            key={st.step}
            style={{
              opacity: stepIn,
              transform: `translateY(${(1 - stepIn) * 12}px)`,
            }}
          >
            <KitPanel box={st.card} glow={isActive ? 0.35 : 0.1} />
            <div
              style={{
                ...boxStyle(st.card),
                position: "absolute",
                borderRadius: b.radius,
                background: alpha(b.palette.surface, isActive ? 95 : 80),
                border: `1.5px solid ${isActive ? b.palette.accent : alpha(b.palette.line, 70)}`,
                boxShadow: isActive ? `0 0 20px ${alpha(b.palette.accent, 20)}` : "none",
                padding: "14px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Fila superior: Número + Fase + Elección */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: b.fonts.label,
                    fontSize: format === "portrait" ? 17 : 16,
                    fontWeight: 800,
                    color: isActive ? b.palette.accentSoft : b.palette.muted,
                  }}
                >
                  {st.numberBlock.text}
                </span>

                <span
                  style={{
                    fontFamily: b.fonts.display,
                    fontSize: format === "portrait" ? 15 : 15,
                    fontWeight: 700,
                    color: b.palette.text,
                  }}
                >
                  {st.phaseBlock.text}
                </span>

                <span
                  style={{
                    fontFamily: b.fonts.label,
                    fontSize: 12,
                    fontWeight: 600,
                    color: b.palette.accent,
                    background: alpha(b.palette.accent, 15),
                    padding: "3px 10px",
                    borderRadius: 99,
                    marginLeft: "auto",
                  }}
                >
                  {st.choiceBlock.text}
                </span>
              </div>

              {/* Descripción */}
              <div
                style={{
                  fontFamily: b.fonts.body,
                  fontSize: 13,
                  lineHeight: 1.4,
                  color: b.palette.muted,
                  marginBottom: 4,
                }}
              >
                {st.descBlock.text}
              </div>

              {/* Peso / porciones */}
              <div
                style={{
                  fontFamily: b.fonts.label,
                  fontSize: 12,
                  fontWeight: 600,
                  color: isActive ? b.palette.accentSoft : b.palette.muted,
                }}
              >
                {st.weightBlock.text}
              </div>
            </div>
          </div>
        );
      })}

      {/* Barra inferior de hint */}
      <div
        style={{
          ...boxStyle(layout.hintBar),
          borderRadius: 12,
          background: alpha(b.palette.surface, 85),
          border: `1px solid ${b.palette.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 16px",
        }}
      >
        <span
          style={{
            fontFamily: b.fonts.label,
            color: b.palette.accentSoft,
            fontWeight: 600,
            fontSize: format === "portrait" ? 16 : 14,
            letterSpacing: 0.5,
          }}
        >
          {layout.hintBlock.text}
        </span>
      </div>
    </Fade>
  );
}

/**
 * Escena 3: LNB Express & Monitor KDS (9.5s / 285 frames).
 */
function ExpressScene({
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
  const copy = LNB_COPY.express;
  const layout = lnbExpressLayout(format, language);

  const leftIn = progress(frame, 10, 26, EASE_IN_OUT);
  const rightIn = progress(frame, 22, 38, EASE_IN_OUT);

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

      {/* Lado izquierdo: Catálogo Express con retiro en 15 minutos */}
      <div style={{ opacity: leftIn }}>
        <KitPanel box={layout.catalogCard} glow={0.3} />
        <div
          style={{
            ...boxStyle(layout.catalogCard),
            position: "absolute",
            borderRadius: b.radius,
            overflow: "hidden",
            border: `1.5px solid ${b.palette.accent}`,
            boxShadow: `0 0 24px ${alpha(b.palette.accent, 20)}`,
          }}
        >
          <Img
            src={LNB_ASSETS.expressShot.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              maxWidth: "none",
            }}
          />
        </div>

        <div
          style={{
            ...boxStyle(layout.pickupBadge),
            position: "absolute",
            borderRadius: 99,
            background: alpha(b.palette.surface, 92),
            border: `1px solid ${b.palette.accent}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontFamily: b.fonts.label,
              color: b.palette.accentSoft,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {layout.pickupBadgeBlock.text}
          </span>
        </div>
      </div>

      {/* Lado derecho: Kitchen Live KDS */}
      <div style={{ opacity: rightIn }}>
        <KitPanel box={layout.kdsCard} glow={0.2} />
        <div
          style={{
            ...boxStyle(layout.kdsCard),
            position: "absolute",
            borderRadius: b.radius,
            overflow: "hidden",
            border: `1px solid ${b.palette.line}`,
          }}
        >
          <Img
            src={LNB_ASSETS.kitchenShot.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              maxWidth: "none",
            }}
          />
        </div>

        <div
          style={{
            ...boxStyle(layout.zeroWaitBadge),
            position: "absolute",
            borderRadius: 99,
            background: alpha(b.palette.surface, 92),
            border: `1px solid ${b.palette.line}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontFamily: b.fonts.label,
              color: b.palette.text,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {layout.zeroWaitBadgeBlock.text}
          </span>
        </div>
      </div>
    </Fade>
  );
}

/**
 * Escena 4: Crumb Club & Membresías LNB Pass (9.0s / 270 frames).
 */
function LoyaltyScene({
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
  const copy = LNB_COPY.club;
  const layout = lnbLoyaltyLayout(format, language);

  const cardIn = progress(frame, 10, 26, EASE_IN_OUT);

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

      {/* Lado izquierdo: Tarjeta digital Crumb Club */}
      <div style={{ opacity: cardIn }}>
        <KitPanel box={layout.cardBox} glow={0.3} />
        <div
          style={{
            ...boxStyle(layout.cardBox),
            position: "absolute",
            borderRadius: b.radius,
            background: alpha(b.palette.surface, 90),
            border: `1.5px solid ${b.palette.accent}`,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: b.fonts.label,
                fontSize: 14,
                fontWeight: 700,
                color: b.palette.accentSoft,
                marginBottom: 16,
                letterSpacing: 1,
              }}
            >
              {layout.cardTitleBlock.text}
            </div>

            <div
              style={{
                borderRadius: 10,
                background: alpha(b.palette.raised, 80),
                border: `1px solid ${alpha(b.palette.accent, 40)}`,
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: b.fonts.label,
                  fontSize: 13,
                  fontWeight: 700,
                  color: b.palette.accentSoft,
                }}
              >
                {layout.pointsBlock.text}
              </span>
            </div>

            <div
              style={{
                borderRadius: 10,
                background: alpha(b.palette.raised, 80),
                border: `1px solid ${b.palette.line}`,
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
              }}
            >
              <span
                style={{
                  fontFamily: b.fonts.label,
                  fontSize: 13,
                  fontWeight: 600,
                  color: b.palette.text,
                }}
              >
                {layout.savedBlock.text}
              </span>
            </div>
          </div>

          <div
            style={{
              fontFamily: b.fonts.body,
              fontSize: 12.5,
              color: b.palette.muted,
              opacity: 0.85,
            }}
          >
            Nivel: Fan LNB · Beneficios en cada visita
          </div>
        </div>
      </div>

      {/* Lado derecho: 3 Planes LNB Pass */}
      {layout.tiers.map((t, idx) => {
        const tierIn = progress(frame, 20 + idx * 10, 36 + idx * 10, EASE_IN_OUT);
        const isClub = t.id === "club";

        return (
          <div
            key={t.id}
            style={{
              opacity: tierIn,
              transform: `translateY(${(1 - tierIn) * 12}px)`,
            }}
          >
            <KitPanel box={t.card} glow={isClub ? 0.4 : 0.1} />
            <div
              style={{
                ...boxStyle(t.card),
                position: "absolute",
                borderRadius: b.radius,
                background: alpha(b.palette.surface, isClub ? 92 : 80),
                border: `1.5px solid ${isClub ? b.palette.accent : alpha(b.palette.line, 70)}`,
                boxShadow: isClub ? `0 0 24px ${alpha(b.palette.accent, 25)}` : "none",
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Título de nivel */}
              <div
                style={{
                  fontFamily: b.fonts.display,
                  fontSize: format === "portrait" ? 17 : 17,
                  fontWeight: 700,
                  color: isClub ? b.palette.accentSoft : b.palette.text,
                  marginBottom: 6,
                }}
              >
                {t.nameBlock.text}
              </div>

              {/* Precio */}
              <div
                style={{
                  fontFamily: b.fonts.display,
                  fontSize: format === "portrait" ? 22 : 22,
                  fontWeight: 800,
                  color: b.palette.accent,
                }}
              >
                {t.priceBlock.text}
              </div>

              {/* Cadencia */}
              <div
                style={{
                  fontFamily: b.fonts.label,
                  fontSize: 12,
                  color: b.palette.muted,
                  marginBottom: 12,
                }}
              >
                {t.cadenceBlock.text}
              </div>

              {/* Perks */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {t.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    style={{
                      fontFamily: b.fonts.body,
                      fontSize: format === "portrait" ? 12 : 12,
                      color: b.palette.text,
                      opacity: 0.9,
                    }}
                  >
                    • {feat.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Escena 5: Métricas Operativas (FactsBeat) (7.0s / 210 frames).
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
  const copy = LNB_COPY.metrics;
  const facts = [
    { value: `${LNB_FACTS.studiosCount.value}`, label: copy.studios[language], source: language === "es" ? "sitio en producción" : "live site" },
    { value: `${LNB_FACTS.builderSteps.value}`, label: copy.builder[language], source: language === "es" ? "sitio en producción" : "live site" },
    { value: "3", label: copy.plans[language], source: language === "es" ? "sitio en producción" : "live site" },
    { value: `+${LNB_FACTS.catalogProducts.value}`, label: copy.catalog[language], source: language === "es" ? "sitio en producción" : "live site" },
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
 * Composición principal del film insignia La Nueva Brasil (LNB SaaS).
 */
export function LnbSaasFilm({ language = "es" }: LnbSaasFilmProps) {
  const { portrait, width, height, fps } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const b = brand.palette;

  return (
    <KitFrame brand={brand} chapters={[...LNB_CHAPTERS]}>
      {/* 0. Apertura de marca (7s / 210 f) */}
      <Sequence from={LNB_TIMELINE.opening.from} durationInFrames={LNB_TIMELINE.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={LNB_TIMELINE.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: LNB_ASSETS.heroLoop,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 480, h: 120 },
            markAspect: 1,
          }}
          asset={LNB_ASSETS.heroLoop}
          poster="/portfolio/brands/lnb-saas/hero-loop-poster.jpg"
          kicker={LNB_COPY.kicker[language]}
          tagline={LNB_COPY.tagline[language]}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 1. Craving Studios Modulares (8.5s / 255 f) */}
      <Sequence from={LNB_TIMELINE.studios.from} durationInFrames={LNB_TIMELINE.studios.duration}>
        <StudiosScene
          format={format}
          duration={LNB_TIMELINE.studios.duration}
          language={language}
        />
      </Sequence>

      {/* 2. The Cake Studio (PROTAGONISTA: 24s / 720 f) */}
      <Sequence from={LNB_TIMELINE.builder.from} durationInFrames={LNB_TIMELINE.builder.duration}>
        <CakeBuilderScene
          format={format}
          duration={LNB_TIMELINE.builder.duration}
          language={language}
        />
      </Sequence>

      {/* 3. LNB Express & Monitor KDS (9.5s / 285 f) */}
      <Sequence from={LNB_TIMELINE.express.from} durationInFrames={LNB_TIMELINE.express.duration}>
        <ExpressScene
          format={format}
          duration={LNB_TIMELINE.express.duration}
          language={language}
        />
      </Sequence>

      {/* 4. Crumb Club & Membresías LNB Pass (9s / 270 f) */}
      <Sequence from={LNB_TIMELINE.club.from} durationInFrames={LNB_TIMELINE.club.duration}>
        <LoyaltyScene
          format={format}
          duration={LNB_TIMELINE.club.duration}
          language={language}
        />
      </Sequence>

      {/* 5. Métricas de Impacto Operativo (7s / 210 f) */}
      <Sequence from={LNB_TIMELINE.metrics.from} durationInFrames={LNB_TIMELINE.metrics.duration}>
        <MetricsScene
          format={format}
          duration={LNB_TIMELINE.metrics.duration}
          language={language}
        />
      </Sequence>

      {/* 6. Firma y Cierre (6.5s / 195 f) */}
      <Sequence from={LNB_TIMELINE.signature.from} durationInFrames={LNB_TIMELINE.signature.duration} premountFor={fps}>
        <SignatureScene
          portrait={portrait}
          width={width}
          height={height}
          duration={LNB_TIMELINE.signature.duration}
        />
      </Sequence>
    </KitFrame>
  );
}
