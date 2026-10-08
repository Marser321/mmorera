import { Sequence, useCurrentFrame, Img } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  AT_ASSETS,
  AT_CHAPTERS,
  AT_COPY,
  AT_HOST,
  AT_STAGE_KEYS,
  AT_TIMELINE,
  type AtStageKey,
} from "@/data/films/flagships/americaTramites";
import type { FilmAsset } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateManifesto, PlateOpening, ShotsBeat } from "./kit/KitScenes";
import { atStagedFormLayout } from "./americaTramitesFilmLayout";

export type AmericaTramitesFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["america-tramites"];

const STAGE_URLS: Record<AtStageKey, string> = {
  quiz: `${AT_HOST}/#quiz`,
  catalog: `${AT_HOST}/tramites`,
  modal: `${AT_HOST}/tramites`,
  contact: `${AT_HOST}/contacto?ruta=tramites`,
};

const STAGE_ASSETS: Record<AtStageKey, FilmAsset> = {
  quiz: AT_ASSETS.quiz,
  catalog: AT_ASSETS.servicesCatalog,
  modal: AT_ASSETS.serviceModal,
  contact: AT_ASSETS.contactForm,
};

/**
 * Escena protagonista: El recorrido documental por etapas.
 * Geometría calculada por atStagedFormLayout (pura y testeada).
 */
function StagedFormScene({
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
  const copy = AT_COPY[language];
  const layout = atStagedFormLayout(format, copy, language);

  // 4 etapas a lo largo de los 720 cuadros (180 cuadros cada una)
  const stageFrames = (duration - 40) / 4;
  const currentStageIndex = Math.max(0, Math.min(3, Math.floor((frame - 20) / stageFrames)));
  const activeKey = AT_STAGE_KEYS[currentStageIndex];

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={language === "es" ? "Proceso administrativo" : "Administrative process"}
        title={copy.staged.title}
        box={layout.title}
        format={format}
      />

      {/* Ventana de captura interactiva */}
      <div style={{ ...boxStyle(layout.window.win), borderRadius: 12, overflow: "hidden", border: `1px solid ${b.palette.line}`, backgroundColor: b.palette.bg }}>
        {/* Barra superior de navegador */}
        <div
          style={{
            height: layout.window.bar.h,
            backgroundColor: b.palette.surface,
            borderBottom: `1px solid ${b.palette.line}`,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Botones de control de ventana */}
          <div style={{ display: "flex", gap: 6, marginLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: alpha(b.palette.muted, 0.4) }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: alpha(b.palette.muted, 0.4) }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: alpha(b.palette.muted, 0.4) }} />
          </div>
          <div
            style={{
              marginLeft: 20,
              padding: "3px 12px",
              borderRadius: 6,
              backgroundColor: alpha(b.palette.raised, 0.8),
              border: `1px solid ${alpha(b.palette.line, 0.6)}`,
              color: b.palette.muted,
              fontSize: layout.window.url.size,
              fontFamily: b.fonts.label,
            }}
          >
            {STAGE_URLS[activeKey]}
          </div>
        </div>

        {/* Pantalla con captura de la etapa activa */}
        <div
          style={{
            height: layout.window.screen.h,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          {AT_STAGE_KEYS.map((key, index) => {
            const isCurrent = index === currentStageIndex;
            const asset = STAGE_ASSETS[key];
            const stageIn = progress(frame, 20 + index * stageFrames, 30 + index * stageFrames, EASE_IN_OUT);
            const scale = 1 + (frame % stageFrames) * 0.0002;

            if (frame < 20 + (index - 1) * stageFrames && index > 0) return null;

            return (
              <div
                key={key}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: isCurrent ? 1 : index < currentStageIndex ? 0 : stageIn,
                  transition: "opacity 0.4s ease",
                  overflow: "hidden",
                }}
              >
                <Img
                  src={asset.src}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    transform: `scale(${scale})`,
                    maxWidth: "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Tarjetas de etapas */}
      {layout.cards.map((c, index) => {
        const isActive = index === currentStageIndex;
        const isPast = index < currentStageIndex;
        const cardIn = progress(frame, 15 + index * 6, 30 + index * 6, EASE_IN_OUT);
        const glow = isActive ? 0.8 : 0;

        return (
          <div key={c.id} style={{ opacity: cardIn }}>
            {/* Panel de fondo */}
            <KitPanel box={c.card} glow={glow} />

            {/* Badge de número */}
            <div
              style={{
                ...boxStyle(c.badge),
                borderRadius: 8,
                backgroundColor: isActive ? b.palette.accent : isPast ? alpha(b.palette.accent, 0.2) : b.palette.raised,
                border: `1px solid ${isActive ? b.palette.accentSoft : isPast ? b.palette.accent : b.palette.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />

            {/* Textos absolutos con BoxText */}
            <BoxText
              block={c.numBlock}
              style={{
                color: isActive ? b.palette.onAccent : isPast ? b.palette.accentSoft : b.palette.muted,
                fontWeight: 700,
                textAlign: "center",
              }}
            />

            <BoxText
              block={c.tagBlock}
              style={{
                color: isActive ? b.palette.accentSoft : b.palette.muted,
                fontFamily: b.fonts.label,
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            />

            <BoxText
              block={c.titleBlock}
              style={{
                color: isActive ? b.palette.text : alpha(b.palette.text, 0.75),
                fontFamily: b.fonts.display,
                fontWeight: 600,
              }}
            />

            <BoxText
              block={c.detailBlock}
              style={{
                color: isActive ? b.palette.text : b.palette.muted,
                lineHeight: 1.25,
              }}
            />
          </div>
        );
      })}
    </Fade>
  );
}

export function AmericaTramitesFilm({ language }: AmericaTramitesFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const copy = AT_COPY[language];
  const T = AT_TIMELINE;
  const b = brand.palette;

  return (
    <KitFrame brand={brand} chapters={AT_CHAPTERS}>
      {/* 1. Apertura con partículas y placa institucional */}
      <Sequence name="Identidad" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={T.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: AT_ASSETS.conversionScene,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 420, h: 80 },
            markAspect: 1,
          }}
          asset={AT_ASSETS.conversionScene}
          kicker={copy.opening.kicker}
          tagline={copy.opening.subtitle}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 2. Rutas guiadas por intención */}
      <Sequence name="Rutas" from={T.routes.from} durationInFrames={T.routes.duration} premountFor={fps}>
        <PlateManifesto
          format={format}
          duration={T.routes.duration}
          asset={AT_ASSETS.hero}
          beats={copy.routes.items.map((item) => ({
            kicker: item.title,
            text: item.note,
          }))}
          veil={0.25}
          ratio={[1.2, 0.8]}
        />
      </Sequence>

      {/* 3. Escena protagonista: Recorrido documental por etapas */}
      <Sequence name="Recorrido" from={T.staged.from} durationInFrames={T.staged.duration} premountFor={fps}>
        <StagedFormScene format={format} duration={T.staged.duration} language={language} />
      </Sequence>

      {/* 4. Formación profesional: Seis semanas */}
      <Sequence name="Formación" from={T.roadmap.from} durationInFrames={T.roadmap.duration} premountFor={fps}>
        <ShotsBeat
          format={format}
          duration={T.roadmap.duration}
          kicker={copy.roadmap.tag}
          title={copy.roadmap.title}
          shots={[
            { ...AT_ASSETS.roadmap, label: copy.roadmap.caption },
            {
              ...AT_ASSETS.educationScene,
              label: language === "es" ? "Centro de recursos y educación documental" : "Resource center and document education",
            },
          ]}
        />
      </Sequence>

      {/* 5. Cifras y rigor documental */}
      <Sequence name="Documentos" from={T.documents.from} durationInFrames={T.documents.duration} premountFor={fps}>
        <FactsBeat
          format={format}
          duration={T.documents.duration}
          language={language}
          kicker={language === "es" ? "Estructura del portal" : "Portal structure"}
          title={copy.documents.title}
          facts={copy.documents.facts}
        />
      </Sequence>

      {/* 6. Firma institucional */}
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
