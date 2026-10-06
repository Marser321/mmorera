import { AbsoluteFill, Sequence } from "remotion";
import { brandCssVars, getCaseBrand } from "@/data/brands/caseBrands";
import type { CaseFilmScript } from "@/data/films/caseFilms";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { BlueprintDevices, ConstraintsText, DecisionsText } from "../scenes/case/BlueprintScenes";
import { ChallengeScene } from "../scenes/case/ChallengeScene";
import { OutcomeScene, ProofScene, SignatureScene } from "../scenes/case/ClosingScenes";
import { ColdOpen } from "../scenes/case/ColdOpen";
import { ProductScene } from "../scenes/case/ProductScene";
import { Letterbox } from "../scenes/case/shared";
import { DustField } from "../scenes/brand/ParticleLogo";
import { ChapterTicks, FilmBackdrop } from "../scenes/primitives";
import { FILM_COLORS, FILM_FONTS, useFilmLayout } from "../scenes/theme";

// type (no interface): el Player exige props indexables (Record<string, unknown>).
export type CaseFilmProps = {
  script: CaseFilmScript;
  language: FilmLanguage;
};

/**
 * "Cómo lo resolví": el tráiler de un caso real. Apertura en frío, reto,
 * restricciones sobre el plano, decisiones que llenan el plano con el sitio
 * real, el producto en vivo, (la prueba) y el resultado, con la firma MM.
 */
export function CaseFilm({ script, language }: CaseFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const { timeline } = script;
  const layout = { portrait, width, height };
  const shared = { script, language, portrait, width, height };
  const blueprintSpan = timeline.constraints.duration + timeline.decisions.duration;
  // Con marca registrada, el film toma la paleta y la tipografía del cliente (estilo plano).
  const brand = getCaseBrand(script.slug);

  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg, ...(brand ? brandCssVars(brand) : {}), background: brand?.palette.bg }}>
      {brand ? (brand.texture === "gold-dust" ? <DustField color={brand.palette.accentSoft} opacity={0.3} /> : null) : <FilmBackdrop />}

      <Sequence name="Apertura" from={timeline.coldOpen.from} durationInFrames={timeline.coldOpen.duration} premountFor={fps}>
        <ColdOpen {...shared} duration={timeline.coldOpen.duration} />
      </Sequence>

      <Sequence name="El reto" from={timeline.challenge.from} durationInFrames={timeline.challenge.duration} premountFor={fps}>
        <ChallengeScene {...shared} duration={timeline.challenge.duration} />
      </Sequence>

      <Sequence name="Plano y dispositivos" from={timeline.constraints.from} durationInFrames={blueprintSpan} premountFor={fps}>
        <BlueprintDevices script={script} layout={layout} decisionsAt={timeline.constraints.duration} duration={blueprintSpan} />
      </Sequence>
      <Sequence name="Restricciones" from={timeline.constraints.from} durationInFrames={timeline.constraints.duration} premountFor={fps}>
        <ConstraintsText script={script} language={language} layout={layout} duration={timeline.constraints.duration} />
      </Sequence>
      <Sequence name="Decisiones" from={timeline.decisions.from} durationInFrames={timeline.decisions.duration} premountFor={fps}>
        <DecisionsText script={script} language={language} layout={layout} duration={timeline.decisions.duration} />
      </Sequence>

      <Sequence name="El producto" from={timeline.product.from} durationInFrames={timeline.product.duration} premountFor={2 * fps}>
        <ProductScene {...shared} duration={timeline.product.duration} />
      </Sequence>

      {timeline.proof ? (
        <Sequence name="La prueba" from={timeline.proof.from} durationInFrames={timeline.proof.duration} premountFor={fps}>
          <ProofScene {...shared} duration={timeline.proof.duration} />
        </Sequence>
      ) : null}

      <Sequence name="Resultado" from={timeline.outcome.from} durationInFrames={timeline.outcome.duration} premountFor={fps}>
        <OutcomeScene {...shared} duration={timeline.outcome.duration} />
      </Sequence>

      <Sequence name="Firma" from={timeline.signature.from} durationInFrames={timeline.signature.duration} premountFor={fps}>
        <SignatureScene portrait={portrait} width={width} height={height} duration={timeline.signature.duration} />
      </Sequence>

      <Letterbox portrait={portrait} />
      <ChapterTicks chapters={script.chapters} size={portrait ? 8 : 6} style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: portrait ? 26 : 26, zIndex: 21 }} />
    </AbsoluteFill>
  );
}
