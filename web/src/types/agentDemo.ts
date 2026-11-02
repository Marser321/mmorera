import type { LocalizedText } from "./site";

/** Demo guiada del agente (M2 versión 1, D6): respuestas escritas de antemano, sin modelo en vivo. */
export interface AgentDemoOption {
  id: string;
  /** Lo que «escribe» el visitante al elegir la opción. */
  question: LocalizedText;
  /** Mensajes del agente, en orden. */
  answer: LocalizedText[];
  /** Si la opción termina con el traspaso a una persona. */
  handoff?: boolean;
}

export interface AgentDemoScript {
  business: LocalizedText;
  /** Rótulo visible: es una demo guiada con datos de muestra. */
  disclaimer: LocalizedText;
  greeting: LocalizedText;
  options: AgentDemoOption[];
  /** Mensaje del sistema cuando la conversación pasa a una persona. */
  handoffNotice: LocalizedText;
}
