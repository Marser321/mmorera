import timing from "./timing.json";

/**
 * El código que muestra la escena «Código»: las diecisiete secuencias de
 * ContentTrailer.tsx, tal como están escritas (trailerTiming.test.ts compara
 * este texto con el archivo, para que la pantalla no muestre código inventado).
 */
const SCENE_CODE: Record<string, { name: string; component: string; id?: string }> = {
  hook: { name: "Gancho", component: "HookScene" },
  title: { name: "Título", component: "TitleScene" },
  reframe: { name: "Reencuadre", component: "ReframeScene" },
  captions: { name: "Subtítulos", component: "CaptionsScene" },
  color: { name: "Color", component: "ColorScene" },
  ai: { name: "Escenas con IA", component: "AiScene" },
  bridge: { name: "Puente", component: "BridgeScene" },
  persona: { name: "Persona", component: "StyleScene", id: "persona" },
  empresa: { name: "Empresa", component: "StyleScene", id: "empresa" },
  vsl: { name: "VSL", component: "StyleScene", id: "vsl" },
  reel: { name: "Reel", component: "StyleScene", id: "reel" },
  historia: { name: "Historia", component: "StyleScene", id: "historia" },
  cuadrado: { name: "Cuadrado", component: "StyleScene", id: "cuadrado" },
  carrusel: { name: "Carrusel", component: "StyleScene", id: "carrusel" },
  wall: { name: "Muro", component: "WallScene" },
  code: { name: "Código", component: "CodeScene" },
  finale: { name: "Cierre", component: "FinaleScene" },
};

export const TRAILER_CODE: string[] = timing.scenes.flatMap((scene) => {
  const { name, component, id } = SCENE_CODE[scene.id];
  return [
    "<Sequence",
    `  name="${name}"`,
    `  from={${scene.from}}`,
    `  durationInFrames={${scene.duration}}`,
    "  premountFor={fps}",
    ">",
    `  <${component}${id ? ` id="${id}"` : ""} language={language} />`,
    "</Sequence>",
  ];
});
