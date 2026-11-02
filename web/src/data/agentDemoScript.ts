import type { LocalizedText } from "@/types/site";
import type { AgentDemoScript } from "@/types/agentDemo";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * Guion de la demo guiada del agente (T32, D6 versión 1). Negocio y datos de
 * muestra; las respuestas están escritas de antemano para mostrar el
 * comportamiento: responder con los datos del negocio, reconocer lo que no
 * sabe y pasar a una persona. No hay un modelo en vivo detrás.
 */
export const AGENT_DEMO_SCRIPT: AgentDemoScript = {
  business: t("Barbería de ejemplo", "Sample barbershop"),
  disclaimer: t("Demo guiada · respuestas escritas de antemano · datos de muestra", "Guided demo · pre-written answers · sample data"),
  greeting: t("Hola, soy el asistente de la barbería. ¿En qué te ayudo?", "Hi, I'm the barbershop's assistant. How can I help?"),
  options: [
    {
      id: "horario",
      question: t("¿Abren el sábado?", "Are you open on Saturday?"),
      answer: [t("Sí, el sábado abrimos de 9:00 a 14:00. El domingo está cerrado.", "Yes, on Saturday we're open from 9:00 to 14:00. We're closed on Sunday.")],
    },
    {
      id: "precio",
      question: t("¿Cuánto sale un corte con barba?", "How much is a haircut and beard trim?"),
      answer: [
        t("El corte con barba cuesta 25 (precio de ejemplo) y dura unos 45 minutos.", "A haircut and beard trim costs 25 (sample price) and takes about 45 minutes."),
        t("¿Quieres que te muestre los horarios libres?", "Would you like to see the open slots?"),
      ],
    },
    {
      id: "reserva",
      question: t("Quiero reservar para mañana a la tarde.", "I'd like to book for tomorrow afternoon."),
      answer: [
        t("Mañana a la tarde quedan dos turnos: 16:00 y 17:30. ¿Cuál prefieres?", "Tomorrow afternoon there are two slots: 16:00 and 17:30. Which one do you prefer?"),
        t("Cuando eliges, te pido tu nombre y te mando la confirmación por WhatsApp.", "Once you pick one, I'll ask for your name and send the confirmation on WhatsApp."),
      ],
    },
    {
      id: "fuera-de-alcance",
      question: t("¿Me recomiendas un tratamiento para la caída del pelo?", "Can you recommend a treatment for hair loss?"),
      answer: [
        t("Eso no lo sé responder bien, y prefiero no inventarte una respuesta.", "I can't answer that properly, and I'd rather not make something up."),
        t("Si quieres, le paso tu consulta a una persona del equipo.", "If you like, I'll pass your question to someone on the team."),
      ],
      handoff: true,
    },
    {
      id: "persona",
      question: t("Prefiero hablar con alguien.", "I'd rather talk to someone."),
      answer: [t("Claro. Le paso la conversación a una persona del equipo, con lo que ya me contaste.", "Sure. I'm passing the conversation to someone on the team, with what you've already told me.")],
      handoff: true,
    },
  ],
  handoffNotice: t("La conversación pasó a una persona del equipo, con todo el contexto.", "The conversation went to a person on the team, with all the context."),
};
