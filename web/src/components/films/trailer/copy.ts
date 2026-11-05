import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Textos del trailer de la fábrica de contenido, en español neutro con tuteo
 * y en inglés. Nada de cifras, clientes ni capacidades que no estén en el
 * propio video: cada escena muestra la edición o el estilo que nombra.
 */
export const TRAILER_COPY = {
  es: {
    brand: "Fábrica de contenido",
    rawTag: "Toma original",
    rawMeta: "16:9 · sin editar",
    prompt: "conviértela en un reel",
    title: ["UNA TOMA.", "TODAS LAS", "PIEZAS."],
    titleSub: "Sin volver a grabar.",
    reframe: { chip: "Reencuadre", line: "De horizontal a vertical, sin perder el foco.", ready: "9:16 · listo" },
    captions: { chip: "Subtítulos", line: "Cada palabra entra a tiempo.", words: [["Lo", "que", "dices,"], ["palabra", "por", "palabra."]] },
    color: { chip: "Color", line: "El look de tu marca en cada toma.", before: "Antes", after: "Después", looks: ["Cálido", "Frío", "Marca"] },
    ai: { chip: "Escenas con IA", line: "Escenas generadas con IA, siempre rotuladas.", status: "Generando", ready: "Lista", tag: ["Imagen generada", "escena conceptual"] },
    bridge: { lines: ["No solo una toma.", "Tu web entera."], sub: "Siete estilos, con escenas de las webs que hice." },
    styles: { chip: "Estilo", own: "Material: mi film de autor", site: "Material: la web de {brand}" },
    wall: { chip: "Formatos", line: "Siete estilos, en español e inglés.", stamp: "Revisado por Mario" },
    code: { chip: "Código", line: "Este video es código.", sub: "Editado con IA, dirigido por una persona." },
    finale: { service: "Fábricas de contenido con IA", human: "Hablas conmigo, lo construyo yo.", url: "mmorera.agency/fabricas" },
  },
  en: {
    brand: "Content factory",
    rawTag: "Raw take",
    rawMeta: "16:9 · unedited",
    prompt: "turn it into a reel",
    title: ["ONE TAKE.", "EVERY", "PIECE."],
    titleSub: "No reshoots.",
    reframe: { chip: "Reframe", line: "From landscape to vertical, focus intact.", ready: "9:16 · ready" },
    captions: { chip: "Captions", line: "Every word lands on time.", words: [["What", "you", "say,"], ["word", "by", "word."]] },
    color: { chip: "Color", line: "Your brand's look on every shot.", before: "Before", after: "After", looks: ["Warm", "Cool", "Brand"] },
    ai: { chip: "AI scenes", line: "AI-generated scenes, always labeled.", status: "Generating", ready: "Ready", tag: ["Generated image", "concept scene"] },
    bridge: { lines: ["Not just one take.", "Your whole website."], sub: "Seven styles, from scenes of sites I built." },
    styles: { chip: "Style", own: "From my author film", site: "From {brand}'s website" },
    wall: { chip: "Formats", line: "Seven styles, in English and Spanish.", stamp: "Reviewed by Mario" },
    code: { chip: "Code", line: "This video is code.", sub: "Edited with AI, directed by a person." },
    finale: { service: "AI content factories", human: "You talk to me. I build it.", url: "mmorera.agency/en/fabricas" },
  },
} as const;

export type TrailerCopy = (typeof TRAILER_COPY)[FilmLanguage];
