import type { ComponentType } from "react";
import type { SampleId } from "@/data/contentSamples";
import { CarruselSample } from "./CarruselSample";
import { CuadradoSample } from "./CuadradoSample";
import { EmpresaSample } from "./EmpresaSample";
import { HistoriaSample } from "./HistoriaSample";
import type { SampleProps } from "./kit";
import { PersonaSample } from "./PersonaSample";
import { ReelSample } from "./ReelSample";
import { VslSample } from "./VslSample";

export { SAMPLE_SIZE } from "./kit";

/** El componente de cada muestra (sus datos viven en src/data/contentSamples.ts). */
export const SAMPLE_COMPONENTS: Record<SampleId, ComponentType<SampleProps>> = {
  persona: PersonaSample,
  empresa: EmpresaSample,
  vsl: VslSample,
  reel: ReelSample,
  historia: HistoriaSample,
  cuadrado: CuadradoSample,
  carrusel: CarruselSample,
};
