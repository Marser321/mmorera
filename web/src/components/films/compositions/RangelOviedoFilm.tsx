import { Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  ROG_ASSETS,
  ROG_CHAPTERS,
  ROG_COPY,
  ROG_TIMELINE,
} from "@/data/films/flagships/rangelOviedo";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateManifesto, PlateOpening, ShotsBeat } from "./kit/KitScenes";
import { rogGoalPathsLayout } from "./rangelOviedoFilmLayout";

export type RangelOviedoFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["rangel-oviedo-group"];

/**
 * Escena protagonista: El Método Rangel y los cuatro perfiles de decisión.
 * Geometría calculada por rogGoalPathsLayout (pura y testeada).
 */
function GoalPathsScene({
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
  const copy = ROG_COPY[language];
  const layout = rogGoalPathsLayout(format, copy, language);

  // Animación: 4 ventanas activas a lo largo de la escena (24 s / 720 frames)
  // Cada perfil se conecta y resalta su etapa afín.
  const activeCycle = Math.floor(((frame - 40) / (duration - 80)) * 4);
  const activeProfileIndex = Math.max(0, Math.min(3, activeCycle));

  return (
    <Fade duration={duration}>
      <KitTitle kicker={copy.pathsKicker} title={copy.pathsTitle} box={layout.title} format={format} />

      {/* Bloque de Perfiles */}
      {layout.profileCards.map((p, index) => {
        const cardIn = progress(frame, 12 + index * 6, 28 + index * 6, EASE_IN_OUT);
        const isActive = index === activeProfileIndex;
        const glow = isActive ? 0.8 : 0;

        return (
          <div key={p.id} style={{ opacity: cardIn }}>
            <KitPanel box={p.card} glow={glow} />
            {isActive ? (
              <div
                style={{
                  ...boxStyle(p.card),
                  position: "absolute",
                  borderRadius: b.radius,
                  border: `1.5px solid ${b.palette.accent}`,
                  pointerEvents: "none",
                }}
              />
            ) : null}
            <BoxText
              block={p.label}
              style={{
                fontFamily: b.fonts.display,
                fontWeight: 600,
                color: isActive ? b.palette.accentSoft : b.palette.text,
              }}
            />
            <BoxText
              block={p.detail}
              style={{
                fontFamily: b.fonts.body,
                color: b.palette.muted,
              }}
            />
          </div>
        );
      })}

      {/* Bloque de Etapas */}
      {layout.stepCards.map((s, index) => {
        const cardIn = progress(frame, 24 + index * 5, 38 + index * 5, EASE_IN_OUT);
        // La etapa correspondiente al perfil activo o progresiva
        const isActive = index === activeProfileIndex || index === activeProfileIndex + 1;
        const glow = isActive ? 0.5 : 0;

        return (
          <div key={s.num} style={{ opacity: cardIn }}>
            <KitPanel box={s.card} glow={glow} />
            <div
              style={{
                ...boxStyle(s.badgeBox),
                borderRadius: 8,
                background: isActive ? alpha(b.palette.accent, 22) : alpha(b.palette.raised, 90),
                border: `1px solid ${isActive ? b.palette.accent : b.palette.line}`,
              }}
            />
            <BoxText
              block={s.numBlock}
              align="center"
              style={{
                fontFamily: b.fonts.label,
                fontWeight: 700,
                color: isActive ? b.palette.accentSoft : b.palette.muted,
              }}
            />
            <BoxText
              block={s.title}
              style={{
                fontFamily: b.fonts.display,
                fontWeight: 600,
                color: isActive ? b.palette.accentSoft : b.palette.text,
              }}
            />
            <BoxText
              block={s.desc}
              style={{
                fontFamily: b.fonts.body,
                color: b.palette.muted,
              }}
            />
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Film insignia de Rangel Oviedo Group:
 * Asesoría inmobiliaria de lujo, curaduría arquitectónica y El Método Rangel en Texas.
 */
export function RangelOviedoFilm({ language }: RangelOviedoFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const copy = ROG_COPY[language];
  const T = ROG_TIMELINE;
  const b = brand.palette;

  const interfaceShots = [
    { ...ROG_ASSETS.esHero, label: copy.interfaceShots[0].label },
    { ...ROG_ASSETS.enHero, label: copy.interfaceShots[1].label },
    { ...ROG_ASSETS.esCuraduria, label: copy.interfaceShots[2].label },
    { ...ROG_ASSETS.esContacto, label: copy.interfaceShots[3].label },
  ];

  const pillarBeats = copy.pillarsItems.map((item, index) => ({
    kicker: `Pilar 0${index + 1}`,
    text: item,
  }));

  return (
    <KitFrame brand={brand} chapters={ROG_CHAPTERS}>
      {/* 1. Apertura con partículas y monograma ROG */}
      <Sequence name="Isotipo" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={T.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: ROG_ASSETS.livingroom,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 420, h: 68 },
            markAspect: 1,
          }}
          asset={ROG_ASSETS.livingroom}
          poster={ROG_ASSETS.livingroomPoster.src}
          kicker={copy.openingKicker}
          tagline={copy.openingTagline}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 2. Residencias y curaduría arquitectónica */}
      <Sequence name="Residencias" from={T.residences.from} durationInFrames={T.residences.duration} premountFor={fps}>
        <PlateManifesto
          format={format}
          duration={T.residences.duration}
          asset={ROG_ASSETS.facadeLoop}
          poster={ROG_ASSETS.facadePoster.src}
          beats={copy.residencesBeats}
          veil={0.25}
          ratio={[1.2, 0.8]}
          plates={[
            { asset: ROG_ASSETS.facadeLoop, poster: ROG_ASSETS.facadePoster.src, focal: { x: 0.5, y: 0.5 } },
            { asset: ROG_ASSETS.livingroom, poster: ROG_ASSETS.livingroomPoster.src, focal: { x: 0.5, y: 0.5 } },
          ]}
        />
      </Sequence>

      {/* 3. Protagonista: El Método Rangel y los cuatro perfiles */}
      <Sequence name="El Método" from={T.paths.from} durationInFrames={T.paths.duration} premountFor={fps}>
        <GoalPathsScene format={format} duration={T.paths.duration} language={language} />
      </Sequence>

      {/* 4. Experiencia interactiva y selección bilingüe */}
      <Sequence name="Interfaz" from={T.interface.from} durationInFrames={T.interface.duration} premountFor={fps}>
        <ShotsBeat
          format={format}
          duration={T.interface.duration}
          kicker={copy.interfaceKicker}
          title={copy.interfaceTitle}
          shots={interfaceShots}
          note={copy.interfaceNote}
        />
      </Sequence>

      {/* 5. Pilares del equipo consultor */}
      <Sequence name="Pilares" from={T.pillars.from} durationInFrames={T.pillars.duration} premountFor={fps}>
        <PlateManifesto
          format={format}
          duration={T.pillars.duration}
          asset={ROG_ASSETS.teamTexans}
          beats={pillarBeats}
          veil={0.3}
          ratio={[1, 1]}
        />
      </Sequence>

      {/* 6. Muro de cifras verificadas */}
      <Sequence name="Métricas" from={T.metrics.from} durationInFrames={T.metrics.duration} premountFor={fps}>
        <FactsBeat
          format={format}
          duration={T.metrics.duration}
          language={language}
          kicker={copy.metricsKicker}
          title={copy.metricsTitle}
          facts={copy.metricsFacts}
        />
      </Sequence>

      {/* 7. Firma y cierre */}
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
