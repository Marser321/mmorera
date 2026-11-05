import type { LocalizedText } from "@/types/site";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * Recorridos para inmobiliarias (Mario, 5/11): un servicio más, sin protagonismo.
 * Vive en una rama chica con puertas discretas desde /casos-de-uso y /fabricas.
 * Lo real se rotula como real. Lo de terceros lleva su fuente y dice que es una
 * referencia: nada de eso es trabajo de Mario.
 */
export const RECORRIDOS_PATH = "/casos-de-uso/recorridos-inmobiliarios";

const TOUR_URL = "https://kuula.co/share/collection/7HFSl?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1";

export interface RecorridoReference {
  id: string;
  title: LocalizedText;
  /** Qué es y qué no es. */
  body: LocalizedText;
  source: { name: string; detail?: LocalizedText; href: string };
  /** Dirección oficial para embeberlo; solo carga si la persona la abre. */
  embed: string;
  open: LocalizedText;
  /** Qué se va a abrir, antes de abrirlo. */
  hint: LocalizedText;
  /** Permisos del marco: un visor 3D no pide lo mismo que un video. */
  allow: string;
}

export const RECORRIDOS_PAGE = {
  eyebrow: t("Casos de uso · Inmobiliario", "Use cases · Real estate"),
  title: t("Una propiedad que se recorre antes de la visita.", "A property people walk through before the visit."),
  body: t(
    "Para inmobiliarias y proyectos que quieren mostrar un espacio a quien todavía no puede ir. El camino depende de una pregunta: ¿el lugar ya existe?",
    "For agencies and developments that want to show a space to people who can't visit yet. The path depends on one question: does the place exist yet?"
  ),
  metaTitle: t("Recorridos 360 para inmobiliarias", "360 tours for real estate"),
  metaSuffix: t("Casos de uso", "Use cases"),
  metaDescription: t(
    "Tours 360 con fotos reales para inmobiliarias, y una referencia de cómo los mundos generados con IA podrían mostrar un proyecto sin construir.",
    "360 tours with real photos for real estate agencies, and a reference for how AI-generated worlds could present an unbuilt project."
  ),
  real: {
    kicker: t("Si el lugar ya existe", "If the place already exists"),
    title: t("Un tour 360 con fotos reales.", "A 360 tour with real photos."),
    body: t(
      "Hago fotos 360 en el lugar y las uno en un recorrido. La persona mira alrededor y pasa de un ambiente a otro desde el teléfono o la computadora. Lo que ve es lo que hay.",
      "I take 360 photos on site and join them into a tour. People look around and move from room to room on a phone or a computer. What they see is what's there."
    ),
    label: t("Muestra real · 25 escenas con fotos hechas en la propiedad", "Real sample · 25 scenes with photos taken on site"),
    cta: t("Hablemos de tu propiedad", "Let's talk about your property"),
    tour: {
      src: TOUR_URL,
      title: t("Tour 360 de una casa, con fotos reales", "360 tour of a house, with real photos"),
      poster: {
        src: "/portfolio/recorridos/casa-360-entrada.jpg",
        alt: t("Entrada de una casa blanca de una planta, bajo una pérgola de madera, con un camino de piedra.", "Entrance of a white single-storey house under a timber pergola, with a gravel drive."),
      },
      open: t("Entrar al recorrido", "Enter the tour"),
      hint: t("Arrastra para mirar alrededor", "Drag to look around"),
      newTab: t("Abrir en una pestaña nueva", "Open in a new tab"),
    },
  },
  generated: {
    kicker: t("Si todavía no existe", "If it doesn't exist yet"),
    title: t("Un proyecto que se puede caminar.", "A project people can walk through."),
    body: t(
      "Cuando el proyecto todavía está en planos, dos tecnologías ya permiten recorrerlo. Una convierte el modelo 3D en un espacio que se explora en el navegador. La otra, con modelos como Genie, de Google DeepMind, genera el lugar en tiempo real a partir de un texto o una foto.",
      "When a project is still on paper, two technologies already let people walk through it. One turns the 3D model into a space you explore in the browser. The other, with models like Genie from Google DeepMind, generates the place in real time from a text or a photo."
    ),
    label: t("Referencia externa · no es trabajo mío", "External reference · not my work"),
    sourceLabel: t("Fuente", "Source"),
    references: [
      {
        id: "seven-park-unidad",
        title: t("Un apartamento que se recorre en el navegador", "An apartment you explore in the browser"),
        body: t(
          "Una unidad del desarrollo Seven Park, en Miami, modelada en 3D y convertida en un espacio interactivo.",
          "A unit from the Seven Park development in Miami, modeled in 3D and turned into an interactive space."
        ),
        source: {
          name: "sa3d · SuperSplat",
          detail: t("copyright de STEP Inc.", "copyright STEP Inc."),
          href: "https://superspl.at/scene/b185fd52",
        },
        embed: "https://superspl.at/s?id=b185fd52",
        open: t("Entrar al apartamento", "Enter the apartment"),
        hint: t("Interactivo · 41 MB", "Interactive · 41 MB"),
        allow: "xr-spatial-tracking; gyroscope; accelerometer; fullscreen",
      },
      {
        id: "project-genie-sala",
        title: t("Una sala generada con Genie 3", "A living room generated with Genie 3"),
        body: t(
          "Uno de los mundos de muestra de Project Genie: una sala que se recorre con el teclado, a bordo de un robot aspirador. No es una propiedad real, pero enseña cómo se avanza por un interior generado.",
          "One of Project Genie's sample worlds: a living room you explore with the keyboard, riding a robot vacuum. It isn't a real property, but it shows how you move through a generated interior."
        ),
        source: {
          name: "Google DeepMind",
          detail: t("20 de febrero de 2026", "February 20, 2026"),
          href: "https://www.youtube.com/watch?v=CSAy3S1JMAU",
        },
        embed: "https://www.youtube-nocookie.com/embed/CSAy3S1JMAU",
        open: t("Ver el video", "Watch the video"),
        hint: t("Video · 23 s", "Video · 23 s"),
        allow: "fullscreen; picture-in-picture",
      },
    ] satisfies RecorridoReference[],
    note: t(
      "Ninguna de estas dos piezas es trabajo mío. Son referencias de cómo podría quedar tu proyecto, no una promesa. Un espacio generado con IA es una interpretación: muestra el ambiente de una idea, no medidas ni terminaciones, y no reemplaza a un plano. Genie 4 se anunció en octubre de 2026 y sigue en vista previa, con acceso limitado. Si tu proyecto lo pide, lo probamos con la herramienta disponible en ese momento, y lo que se publique va rotulado como imagen generada.",
      "Neither of these two pieces is my work. They're references for how your project could look, not a promise. An AI-generated space is an interpretation: it shows the feel of an idea, not measurements or finishes, and it doesn't replace a floor plan. Genie 4 was announced in October 2026 and is still a limited-access preview. If your project calls for it, we'll try it with whatever tool is available then, and anything published is labeled as generated imagery."
    ),
    readMore: {
      label: t("Para leer más", "Further reading"),
      links: [
        { label: t("El anuncio de Genie 4 · Google DeepMind", "The Genie 4 announcement · Google DeepMind"), href: "https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/" },
        { label: t("Una prueba de Genie 4 con un interior · VP Land", "A Genie 4 test on an interior · VP Land"), href: "https://www.vp-land.com/stories/we-walked-through-genie-4-worlds-built-from-a-single-photo-and-debated-ais-place-on-iatse" },
      ],
    },
  },
  /** Las puertas discretas que llevan a esta rama. */
  door: {
    eyebrow: t("También hago", "I also make"),
    title: t("Recorridos 360 para inmobiliarias", "360 tours for real estate"),
  },
};
