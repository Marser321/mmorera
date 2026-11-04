import timing from "./timing.json";

/**
 * El código que muestra la escena «Código»: las once secuencias de
 * ContentTrailer.tsx, tal como están escritas (trailerTiming.test.ts compara
 * este texto con el archivo, para que la pantalla no muestre código inventado).
 */
const SCENE_CODE: Record<string, { name: string; component: string }> = {
  hook: { name: "Gancho", component: "HookScene" },
  title: { name: "Título", component: "TitleScene" },
  reframe: { name: "Reencuadre", component: "ReframeScene" },
  captions: { name: "Subtítulos", component: "CaptionsScene" },
  color: { name: "Color", component: "ColorScene" },
  ai: { name: "Escenas con IA", component: "AiScene" },
  rhythm: { name: "Ritmo", component: "RhythmScene" },
  formats: { name: "Formatos", component: "FormatsScene" },
  review: { name: "Revisión", component: "ReviewScene" },
  code: { name: "Código", component: "CodeScene" },
  finale: { name: "Cierre", component: "FinaleScene" },
};

export const TRAILER_CODE: string[] = timing.scenes.flatMap((scene) => {
  const { name, component } = SCENE_CODE[scene.id];
  return [
    "<Sequence",
    `  name="${name}"`,
    `  from={${scene.from}}`,
    `  durationInFrames={${scene.duration}}`,
    "  premountFor={fps}",
    ">",
    `  <${component} language={language} />`,
    "</Sequence>",
  ];
});
