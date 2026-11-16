import { AGENT_DEMO_SCRIPT } from "@/data/agentDemoScript";
import { CAMPANAS_FILM } from "@/data/films/campanasFilm";
import type { FilmLanguage } from "@/data/films/filmTypes";

/**
 * Lo poco que se lee en los films de las puertas.
 *
 * - La conversación sale de la demo guiada del agente (datos de muestra,
 *   respuestas escritas de antemano): el film no promete nada que la demo no muestre.
 * - El recorrido es el de una reserva en te_Cargo (su README): el pago se
 *   retiene al reservar y, al terminar, se cobra lo que se usó.
 * - La cuenta de anuncios es la de la cinemática de /campanas: datos de ejemplo,
 *   sin resultados de ningún cliente. La máquina propone y una persona decide.
 */
const question = AGENT_DEMO_SCRIPT.options[0];

export const DOOR_COPY: Record<FilmLanguage, { question: string; answer: string; handoff: string; flow: readonly [string, string, string, string] }> = {
  es: {
    question: question.question.es,
    answer: question.answer[0].es,
    handoff: "Pasa a una persona",
    flow: ["Reserva el cargador", "Se retiene el pago", "Carga el auto", "Se cobra lo usado"],
  },
  en: {
    question: question.question.en,
    answer: question.answer[0].en,
    handoff: "Handed to a person",
    flow: ["The charger is booked", "The payment is held", "The car charges", "Only what's used is charged"],
  },
};

/** La pregunta a la cuenta, lo que encuentra la máquina y lo que decide una persona. */
export function campaignCopy(language: FilmLanguage) {
  const { question, machine, person, badge } = CAMPANAS_FILM;
  return {
    badge: badge[language],
    prompt: question.prompt[language],
    decides: person.decides[language],
    rows: machine.findings.map((finding) => {
      const decision = person.decisions.find((item) => item.id === finding.id)!;
      return { id: finding.id, title: finding.title[language], verdict: decision.verdict[language], approved: decision.approved };
    }),
  };
}

/** Los formatos del reencuadre: no llevan idioma. */
export const CONTENT_FORMATS = [
  { ratio: "16:9", piece: "VIDEO" },
  { ratio: "9:16", piece: "REEL" },
  { ratio: "1:1", piece: "POST" },
] as const;

/** La dirección que se ve en la ventana de la puerta de webs: el sitio real del caso. */
export const WEBS_ADDRESS = "l-b-five.vercel.app";
