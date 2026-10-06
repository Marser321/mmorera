import { safeArea } from "@/lib/filmLayout";
import { ChecklistGrid } from "../scenes/brand/ChecklistGrid";
import { EvidenceLedger } from "../scenes/brand/EvidenceLedger";
import { FactWall } from "../scenes/brand/FactWall";
import { KeywordSearch } from "../scenes/brand/KeywordSearch";
import { ScriptTimeline } from "../scenes/brand/ScriptTimeline";
import { DATA_SAMPLE_LABEL, DEMO_CHECKLIST, DEMO_FACTS, DEMO_LEDGER, DEMO_SCRIPT, DEMO_SEARCH } from "../scenes/brand/layout/dataSamples";
import type { LabDemo } from "./types";

/**
 * Demos del laboratorio: grupo "data". Cada escena registra acá una demo con
 * datos rotulados (badge "Datos de ejemplo"), dentro de la zona útil.
 */

export const DEMOS_DATA: Record<string, LabDemo> = {
  EvidenceLedger: {
    duration: 300,
    brand: "fenix-medical-center",
    render: ({ language, format }) => <EvidenceLedger box={safeArea(format)} duration={300} {...DEMO_LEDGER[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  FactWall: {
    duration: 240,
    brand: "ad-media-solution",
    render: ({ language, format }) => <FactWall box={safeArea(format)} duration={240} facts={DEMO_FACTS[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  /** La misma escena con `countUp`: cuenta hasta cada valor (solo para datos de ejemplo). */
  FactWallConConteo: {
    duration: 240,
    brand: "ad-media-solution",
    render: ({ language, format }) => <FactWall box={safeArea(format)} duration={240} facts={DEMO_FACTS[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} countUp />,
  },
  ChecklistGrid: {
    duration: 240,
    brand: "ad-media-solution",
    render: ({ language, format }) => <ChecklistGrid box={safeArea(format)} duration={240} {...DEMO_CHECKLIST[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  KeywordSearch: {
    duration: 300,
    brand: "ad-media-solution",
    render: ({ language, format }) => <KeywordSearch box={safeArea(format)} duration={300} {...DEMO_SEARCH[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  ScriptTimeline: {
    duration: 300,
    brand: "fenix-medical-center",
    render: ({ language, format }) => <ScriptTimeline box={safeArea(format)} duration={300} {...DEMO_SCRIPT[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
};
