import type { ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { FilmLanguage, UseCaseFilmScript } from "@/data/films/filmTypes";
import { FlowDiagram, LogStream } from "../scenes/FlowDiagram";
import { ChapterTicks, FilmBackdrop, Headline, HonestyBadge, Kicker } from "../scenes/primitives";
import { PROBLEM_VISUALS } from "../scenes/ProblemVisuals";
import { ResultScene } from "../scenes/ResultScene";
import { FILM_COLORS, FILM_FONTS, progress, useFilmLayout } from "../scenes/theme";

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

/**
 * Film de caso de uso: problema → diagnóstico → sistema → resultado.
 * Un mismo guion se compone en 16:9 o 4:5 según el formato del Player.
 */
export function UseCaseFilm({ script, language, badgeLabel, selectedNodeId, onNodeSelect }: UseCaseFilmProps) {
  const { fps, portrait } = useFilmLayout();
  const [problem, diagnosis, system, result] = script.chapters;
  const Visual = PROBLEM_VISUALS[script.problem.visual];
  const pad = portrait ? 72 : 80;
  const headline = portrait ? { left: 72, top: 170, width: 936 } : { left: 80, top: 150, width: 680 };
  const visualBox = portrait ? { x: 72, y: 650, w: 936, h: 560 } : { x: 820, y: 150, w: 690, h: 600 };
  const problemSpan = problem.durationInFrames + diagnosis.durationInFrames;

  return (
    <AbsoluteFill style={{ fontFamily: FILM_FONTS.body, color: FILM_COLORS.fg, overflow: "hidden" }}>
      <FilmBackdrop accent={script.kind === "real" ? FILM_COLORS.signal : FILM_COLORS.accent} />

      <Kicker size={portrait ? 22 : 14} style={{ left: pad, top: portrait ? 76 : 54 }}>
        {/* En 4:5 el título no entra junto al rótulo de honestidad */}
        {portrait ? script.category[language] : `${script.category[language]} · ${script.title[language]}`}
      </Kicker>
      <HonestyBadge label={badgeLabel} real={script.kind === "real"} size={portrait ? 20 : 13} style={{ right: pad, top: portrait ? 62 : 42 }} />

      <Sequence name="Problema y diagnóstico" from={problem.from} durationInFrames={problemSpan} premountFor={fps}>
        <SceneOut end={problemSpan}>
          <Headline text={script.problem.headline[language]} from={8} exitAt={problem.durationInFrames - 14} size={portrait ? 92 : 70} style={headline} />
          <Headline text={script.diagnosis.headline[language]} from={problem.durationInFrames + 4} size={portrait ? 78 : 58} style={headline} color={FILM_COLORS.fg} />
          <Visual
            box={visualBox}
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
          <Headline
            text={script.kind === "real" ? (language === "es" ? "Así lo resolví." : "How I solved it.") : (language === "es" ? "Así se resuelve." : "How it gets solved.")}
            from={4}
            size={portrait ? 76 : 56}
            style={{ left: pad, top: portrait ? 170 : 140, width: portrait ? 936 : 1200 }}
          />
          <FlowDiagram
            stages={script.stages}
            language={language}
            portrait={portrait}
            top={portrait ? 340 : 300}
            selectedNodeId={selectedNodeId}
            onNodeSelect={onNodeSelect}
          />
          {!portrait ? <LogStream stages={script.stages} language={language} left={pad} top={560} width={1440} size={16} /> : null}
        </SceneOut>
      </Sequence>

      <Sequence name="Resultado" from={result.from} durationInFrames={result.durationInFrames} premountFor={fps}>
        <ResultScene script={script} language={language} portrait={portrait} />
      </Sequence>

      <ChapterTicks chapters={script.chapters} size={portrait ? 10 : 8} style={{ left: pad, right: pad, bottom: portrait ? 46 : 34 }} />
    </AbsoluteFill>
  );
}
