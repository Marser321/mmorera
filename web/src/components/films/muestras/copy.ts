import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Textos de las siete muestras, en español neutro con tuteo y en inglés.
 * Cada frase sale de la web de la marca (sus films de caso en
 * src/data/films/flagships/ y sus capturas) o del film de autor de Mario;
 * se acortan para que se lean a tiempo, sin cifras ni promesas nuevas.
 */
export const SAMPLE_COPY = {
  es: {
    persona: {
      captions: [
        ["Me cuentas", "el *pedido.*"],
        ["Lo armo", "con *IA.*"],
        ["Y lo reviso", "*yo.*"],
      ],
      name: "Mario Morera",
      role: "AI Automation & Operations",
      closing: "Hablas conmigo, *lo construyo yo.*",
      url: "mmorera.agency",
    },
    empresa: {
      chapters: [
        { kicker: "01 / 03", text: "La tormenta no pregunta *si estás cubierto.*" },
        { kicker: "02 / 03", text: "Detrás de cada milla, *una oficina que contesta.*" },
        { kicker: "03 / 03", text: "Y la carretera *vuelve a abrirse.*" },
      ],
      tagline: "Seguros + permisos. *Todo en un solo lugar.*",
      lines: ["Seguro de camiones", "Permisos", "Cumplimiento DOT"],
      offices: "Medley · Jersey City · Elizabeth",
    },
    vsl: {
      hook: ["¿Quieres invertir, comprar", "o mudarte a Texas?"],
      risk: "Antes de mostrar propiedades, *filtramos el riesgo.*",
      methodTitle: "El Método Rangel",
      steps: ["Diagnóstico de decisión", "Lectura de mercado", "Selección privada", "Negociación de oficio", "Continuidad"],
      promise: "Con un asesor que *habla tu idioma.*",
      cta: "Agenda tu asesoría privada",
      chapters: ["La pregunta", "El método", "La asesoría"],
    },
    reel: {
      hook: ["Del tatuaje", "que imaginas"],
      hook2: ["a la agenda", "del artista."],
      process: "Rosa realista · negro y rojo",
      steps: ["Paso 1 · Edad", "Paso 4 · Tamaño", "Paso 5 · Zona", "Paso 6 · Concepto"],
      closing: "Diez pasos. *Una pregunta por pantalla.*",
      cta: "mrstudiotattoo.com",
    },
    historia: {
      name: "La Nueva Brasil",
      place: "Punta del Este",
      first: "Cafetería de especialidad, *en Punta del Este.*",
      second: "Nunca más pagues *por un café individual.*",
      poll: { question: "¿Qué plan eliges?", options: ["LNB Start", "LNB Club"] },
      third: "Pide y retira *en 15 minutos.*",
      link: "Pedir en LNB Express",
      reply: "Enviar mensaje",
    },
    cuadrado: {
      tagline: "Donde tu salud renace",
      sublines: ["Atención primaria", "Longevidad", "Recuperación"],
      booking: "Agenda tu evaluación",
      steps: ["1 · Día", "2 · Hora", "3 · Tus datos"],
      url: "fenixmedicalcenters.com",
    },
    carrusel: {
      kicker: "EvoWrap · Estética automotriz",
      title: "Cuatro especialidades de estudio",
      swipe: "Desliza",
      items: [
        { title: "Tratamiento Cerámico", badge: "Protección 9H", line: "Brillo profundo y repelencia al agua." },
        { title: "Paint Protection Film", badge: "PPF autorregenerable", line: "Contra gravilla, salitre y microrrayas." },
        { title: "Color Change Wrap", badge: "Vinilos fundidos", line: "Brillo, satinado, mate o metálico." },
        { title: "Interior Boutique", badge: "Detailing y cuero", line: "Cuero hidratado y filtros UV." },
      ],
      closing: "Reinventa tu vehículo",
      cta: "Agenda tu visita",
      url: "evowrap.vercel.app",
    },
  },
  en: {
    persona: {
      captions: [
        ["You tell me", "what you *need.*"],
        ["I build it", "with *AI.*"],
        ["And I review it", "*myself.*"],
      ],
      name: "Mario Morera",
      role: "AI Automation & Operations",
      closing: "You talk to me. *I build it.*",
      url: "mmorera.agency",
    },
    empresa: {
      chapters: [
        { kicker: "01 / 03", text: "The storm doesn't ask *if you're covered.*" },
        { kicker: "02 / 03", text: "Behind every mile, *an office that answers.*" },
        { kicker: "03 / 03", text: "And the road *opens again.*" },
      ],
      tagline: "Insurance + permits. *One roof.*",
      lines: ["Truck insurance", "Permits", "DOT compliance"],
      offices: "Medley · Jersey City · Elizabeth",
    },
    vsl: {
      hook: ["Investing, buying", "or moving to Texas?"],
      risk: "Before showing properties, *we filter the risk.*",
      methodTitle: "The Rangel Method",
      steps: ["Decision diagnostic", "Market reading", "Private selection", "Expert negotiation", "Long-term continuity"],
      promise: "With an advisor who *speaks your language.*",
      cta: "Book your private consultation",
      chapters: ["The question", "The method", "The consultation"],
    },
    reel: {
      hook: ["From the tattoo", "you imagine"],
      hook2: ["to the artist's", "calendar."],
      process: "Realistic rose · black and red",
      steps: ["Step 1 · Age", "Step 4 · Size", "Step 5 · Placement", "Step 6 · Concept"],
      closing: "Ten steps. *One question per screen.*",
      cta: "mrstudiotattoo.com",
    },
    historia: {
      name: "La Nueva Brasil",
      place: "Punta del Este",
      first: "Specialty coffee, *in Punta del Este.*",
      second: "Never pay for *a single coffee again.*",
      poll: { question: "Which plan is yours?", options: ["LNB Start", "LNB Club"] },
      third: "Order and pick up *in 15 minutes.*",
      link: "Order on LNB Express",
      reply: "Send message",
    },
    cuadrado: {
      tagline: "Where your health is reborn",
      sublines: ["Primary care", "Longevity", "Recovery"],
      booking: "Book your evaluation",
      steps: ["1 · Day", "2 · Time", "3 · Your details"],
      url: "fenixmedicalcenters.com",
    },
    carrusel: {
      kicker: "EvoWrap · Automotive aesthetics",
      title: "Four studio specialties",
      swipe: "Swipe",
      items: [
        { title: "Ceramic Coating", badge: "9H protection", line: "Deep gloss, extreme water repellency." },
        { title: "Paint Protection Film", badge: "Self-healing PPF", line: "Against stone chips, salt and swirls." },
        { title: "Color Change Wrap", badge: "Cast vinyls", line: "Gloss, satin, matte or metallic." },
        { title: "Interior Boutique", badge: "Detailing & leather", line: "Conditioned leather, UV filters." },
      ],
      closing: "Reinvent your vehicle",
      cta: "Book your visit",
      url: "evowrap.vercel.app",
    },
  },
} as const;

export type SampleCopy = (typeof SAMPLE_COPY)[FilmLanguage];
