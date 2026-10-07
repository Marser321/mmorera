import { useMemo, type ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { FilmLanguage, UseCaseFilmScript } from "@/data/films/filmTypes";
import { FlowDiagram, LogStream } from "../scenes/FlowDiagram";
import { ChapterTicks, FilmBackdrop, Headline, HonestyBadge, Kicker } from "../scenes/primitives";
import { PROBLEM_VISUALS } from "../scenes/ProblemVisuals";
import { ResultScene } from "../scenes/ResultScene";
import { FILM_COLORS, FILM_FONTS, progress, useFilmLayout } from "../scenes/theme";
import { layoutUseCaseFilm, type HeadlineSpec } from "./useCaseLayout";

// type (no interface): el Player exige props indexables (Record<string, unknown>).
export type UseCaseFilmProps = {
  script: UseCaseFilmScript;
  language: FilmLanguage;
  badgeLabel: string;
  selectedNodeId?: string | null;
  onNodeSelect?: (stageId: string) => void;
};

/** Desvanece una escena en sus últimos frames para encadenar el corte. */
function SceneOut({ end, children }: { end: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: 1 - progress(frame, end - 16, end) }}>{children}</AbsoluteFill>;
}

const headlineStyle = (spec: HeadlineSpec) => ({ left: spec.box.x, top: spec.box.y, width: spec.box.w });

/**
 * Film de caso de uso: problema → diagnóstico → sistema → resultado.
 * Un mismo guion se compone en 16:9 o 4:5 según el formato del Player; las
 * cajas salen de layoutUseCaseFilm (verificadas por tests: nada se pisa).
 * Los titulares se suceden (uno sale y recién entonces entra el otro).
 */
export function UseCaseFilm({ script, language, badgeLabel, selectedNodeId, onNodeSelect }: UseCaseFilmProps) {
  const { fps, portrait } = useFilmLayout();
  const layout = useMemo(() => layoutUseCaseFilm(script, language, portrait ? "portrait" : "landscape", badgeLabel), [script, language, portrait, badgeLabel]);
  const [problem, diagnosis, system, result] = script.chapters;
  const Visual = PROBLEM_VISUALS[script.problem.visual];
  const problemSpan = problem.durationInFrames + diagnosis.durationInFrames;
  const { kicker, badge, visual, system: systemLayout } = layout;

  return (
    <AbsoluteFill style={{ fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg, overflow: "hidden" }}>
      <FilmBackdrop accent={script.kind === "real" ? FILM_COLORS.signal : FILM_COLORS.accent} />

      <Kicker size={kicker.size} style={{ left: kicker.box.x, top: kicker.box.y, lineHeight: 1.25, whiteSpace: "nowrap" }}>
        {kicker.text}
      </Kicker>
      <HonestyBadge label={badgeLabel} real={script.kind === "real"} size={badge.size} style={{ left: badge.box.x, top: badge.box.y, lineHeight: 1.25, whiteSpace: "nowrap" }} />

      <Sequence name="Problema y diagnóstico" from={problem.from} durationInFrames={problemSpan} premountFor={fps}>
        <SceneOut end={problemSpan}>
          <Headline text={layout.problem.text} from={8} exitAt={problem.durationInFrames - 14} size={layout.problem.size} style={headlineStyle(layout.problem)} />
          <Headline text={layout.diagnosis.text} from={problem.durationInFrames + 4} size={layout.diagnosis.size} style={headlineStyle(layout.diagnosis)} color={FILM_COLORS.fg} />
          <Visual
            box={visual}
            signals={script.problem.signals.map((signal) => signal[language])}
            language={language}
            portrait={portrait}
            diagnosisAt={problem.durationInFrames}
            breakpoint={script.diagnosis.breakpoint[language]}
            lanes={script.diagnosis.lanes}
          />
        </SceneOut>
      </Sequence>

      <Sequence name="Sistema" from={system.from} durationInFrames={system.durationInFrames} premountFor={fps}>
        <SceneOut end={system.durationInFrames}>
          <Headline text={systemLayout.headline.text} from={4} size={systemLayout.headline.size} style={headlineStyle(systemLayout.headline)} />
          <FlowDiagram stages={script.stages} language={language} geometry={systemLayout.flow} selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
          {systemLayout.log ? (
            <LogStream stages={script.stages} language={language} left={systemLayout.log.box.x} top={systemLayout.log.box.y} width={systemLayout.log.box.w} size={systemLayout.log.size} />
          ) : null}
        </SceneOut>
      </Sequence>

      <Sequence name="Resultado" from={result.from} durationInFrames={result.durationInFrames} premountFor={fps}>
        <ResultScene script={script} language={language} layout={layout.result} />
      </Sequence>

      <ChapterTicks chapters={script.chapters} size={layout.ticks.size} style={{ left: layout.ticks.left, right: layout.ticks.right, bottom: layout.ticks.bottom }} />
    </AbsoluteFill>
  );
}
