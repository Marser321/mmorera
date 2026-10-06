import { safeArea } from "@/lib/filmLayout";
import { BeforeAfterSplit } from "../scenes/brand/BeforeAfterSplit";
import { CRM_SAMPLE_LABEL, DEMO_BEFORE_AFTER, DEMO_PIPELINE } from "../scenes/brand/layout/crmSamples";
import { PipelineBoard } from "../scenes/brand/PipelineBoard";
import type { LabDemo } from "./types";

/**
 * Demos del laboratorio: grupo "crm" (escenas para agencias: pipeline de un
 * CRM y antes/después de un flujo). Personas y flujos inventados, siempre con
 * el badge "Datos de ejemplo", dentro de la zona útil.
 */
export const DEMOS_CRM: Record<string, LabDemo> = {
  PipelineBoard: {
    duration: 360,
    brand: "ad-media-solution",
    render: ({ language, format }) => <PipelineBoard box={safeArea(format)} duration={360} {...DEMO_PIPELINE[language]} language={language} sampleLabel={CRM_SAMPLE_LABEL[language]} />,
  },
  BeforeAfterSplit: {
    duration: 270,
    brand: "ad-media-solution",
    render: ({ language, format }) => <BeforeAfterSplit box={safeArea(format)} duration={270} {...DEMO_BEFORE_AFTER[language]} language={language} sampleLabel={CRM_SAMPLE_LABEL[language]} />,
  },
};
