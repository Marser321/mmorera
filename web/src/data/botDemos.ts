export type BotDemoId = "agency" | "real-estate" | "appointments" | "insurance" | "paperwork";
export type DemoLanguage = "es" | "en";

export interface BotPrompt {
  id: string;
  label: Record<DemoLanguage, string>;
  reply: Record<DemoLanguage, string>;
  intent: string;
}

export interface BotDemo {
  id: BotDemoId;
  name: Record<DemoLanguage, string>;
  shortName: Record<DemoLanguage, string>;
  description: Record<DemoLanguage, string>;
  opening: Record<DemoLanguage, string>;
  accent: string;
  prompts: BotPrompt[];
}

export const BOT_DEMOS: BotDemo[] = [
  {
    id: "agency",
    name: { es: "Agencia de marketing", en: "Marketing agency" },
    shortName: { es: "Marketing", en: "Marketing" },
    description: { es: "Aterriza un objetivo antes de hablar de canales.", en: "Clarify the goal before discussing channels." },
    opening: { es: "Hola. Puedo ayudarte a ordenar un objetivo de marketing y qué información hace falta para proponer un siguiente paso.", en: "Hi. I can help clarify a marketing goal and what information is needed for a useful next step." },
    accent: "#9B8CFF",
    prompts: [
      {
        id: "objective",
        label: { es: "Quiero conseguir más clientes", en: "I want more customers" },
        reply: { es: "Empezaría por definir qué significa “más”: consultas, reservas o ventas. Después revisamos oferta, audiencia y página de destino. Esta demo no promete resultados ni calcula un retorno ficticio.", en: "I’d first define what “more” means: inquiries, bookings, or sales. Then we can review the offer, audience, and destination page. This demo does not promise results or invent a return." },
        intent: "entender objetivo y conversión",
      },
      {
        id: "channels",
        label: { es: "¿Qué canales tendría sentido probar?", en: "Which channels should I test?" },
        reply: { es: "Depende de dónde decide tu audiencia y del material disponible. Antes de recomendar canales, preguntaría por el público, la oferta, el presupuesto ya aprobado y cómo se mide una consulta útil.", en: "It depends on where your audience makes decisions and what assets are available. Before recommending channels, I’d ask about the audience, offer, already-approved budget, and how a useful inquiry is measured." },
        intent: "orientación de canales",
      },
      {
        id: "handoff",
        label: { es: "Necesito hablar con una persona", en: "I want to talk to a person" },
        reply: { es: "Claro. Para preparar una conversación útil, alcanza con identificar el objetivo principal y el tipo de ayuda que buscas. El contacto real ocurre solo si eliges el flujo de contacto del sitio.", en: "Of course. To make a conversation useful, it’s enough to identify your main goal and the kind of help you need. Actual contact only happens if you choose the site’s contact flow." },
        intent: "derivación humana",
      },
      {
        id: "out-of-scope",
        label: { es: "¿Me garantizas ventas este mes?", en: "Can you guarantee sales this month?" },
        reply: { es: "No puedo garantizar ventas ni atribuir cifras a una simulación. Para evaluar una campaña real hacen falta datos verificables, contexto y una revisión humana.", en: "I can’t guarantee sales or attach numbers to a simulation. Evaluating a real campaign requires verifiable data, context, and human review." },
        intent: "fuera de alcance: garantía comercial",
      },
    ],
  },
  {
    id: "real-estate",
    name: { es: "Inmobiliaria", en: "Real estate" },
    shortName: { es: "Inmobiliaria", en: "Real estate" },
    description: { es: "Ordena preferencias sin inventar propiedades ni disponibilidad.", en: "Organize preferences without inventing listings or availability." },
    opening: { es: "Puedo ayudarte a ordenar qué tipo de propiedad buscas. Los ejemplos de este recorrido son ficticios: no hay inventario conectado.", en: "I can help organize what kind of property you’re looking for. Examples in this journey are fictional; no listing inventory is connected." },
    accent: "#83C8FF",
    prompts: [
      {
        id: "property-type",
        label: { es: "Busco un apartamento", en: "I’m looking for an apartment" },
        reply: { es: "Para orientar una búsqueda habría que aclarar la zona, el tipo de operación y algún criterio prioritario. No consulto propiedades reales ni guardo tus preferencias.", en: "To guide a search, we’d clarify the area, transaction type, and one priority. I don’t search real listings or save your preferences." },
        intent: "preferencias de búsqueda",
      },
      {
        id: "process",
        label: { es: "¿Cómo funciona el proceso?", en: "How does the process work?" },
        reply: { es: "Un asistente puede ordenar requisitos, explicar etapas generales y derivar dudas sobre una propiedad a un agente. Fechas, documentos y condiciones concretas deben verificarse con la inmobiliaria.", en: "An assistant can organize requirements, explain general stages, and route property-specific questions to an agent. Dates, documents, and terms must be verified with the agency." },
        intent: "información general del proceso",
      },
      {
        id: "availability",
        label: { es: "¿Tienen algo disponible ahora?", en: "What’s available right now?" },
        reply: { es: "Esta demostración no tiene inventario conectado, así que no puedo confirmar disponibilidad, direcciones ni precios. Esa consulta tendría que ir a una fuente actualizada o a una persona.", en: "This demo has no listing inventory connected, so I can’t confirm availability, addresses, or prices. That needs a current source or a person." },
        intent: "derivación por dato actual no disponible",
      },
      {
        id: "out-of-scope",
        label: { es: "¿Me aseguras que subirá de valor?", en: "Can you assure me it will appreciate?" },
        reply: { es: "No. No puedo predecir ni garantizar la valorización de una propiedad. Una decisión requiere información verificable y asesoramiento profesional independiente.", en: "No. I can’t predict or guarantee a property’s appreciation. A decision requires verifiable information and independent professional advice." },
        intent: "fuera de alcance: predicción financiera",
      },
    ],
  },
  {
    id: "appointments",
    name: { es: "Negocio con citas", en: "Appointment-based business" },
    shortName: { es: "Citas", en: "Appointments" },
    description: { es: "Identifica servicio y preferencia; no reserva turnos.", en: "Identify service and preference; do not book appointments." },
    opening: { es: "Puedo ayudarte a identificar el servicio adecuado y qué preguntar antes de coordinar. Este ejemplo no consulta agendas ni confirma turnos.", en: "I can help identify the right service and what to ask before arranging a visit. This example doesn’t check calendars or confirm appointments." },
    accent: "#F0B977",
    prompts: [
      {
        id: "service",
        label: { es: "Quiero saber qué servicio elegir", en: "I’m not sure which service to choose" },
        reply: { es: "Cuéntale a una persona qué resultado buscas y si ya recibiste este servicio antes. Ella podrá recomendar la opción apropiada según la oferta real del negocio.", en: "Tell a person what outcome you want and whether you’ve had this service before. They can recommend an option based on the business’s actual services." },
        intent: "orientar consulta sobre servicios",
      },
      {
        id: "availability",
        label: { es: "¿Hay disponibilidad esta semana?", en: "Do you have an opening this week?" },
        reply: { es: "No tengo acceso a una agenda. Para confirmar disponibilidad habría que consultar el calendario real del negocio; aquí no se reserva ni bloquea ningún horario.", en: "I don’t have calendar access. Availability must be checked against the business’s actual schedule; nothing is booked or held here." },
        intent: "solicitud de disponibilidad",
      },
      {
        id: "prepare",
        label: { es: "¿Qué debería consultar antes de ir?", en: "What should I ask before visiting?" },
        reply: { es: "Puedes confirmar duración, preparación necesaria, precio vigente y política de cambios directamente con el negocio. Esta demo no inventa precios ni políticas.", en: "You can confirm duration, preparation, current price, and rescheduling terms with the business. This demo doesn’t invent prices or policies." },
        intent: "preparar cita sin confirmar reserva",
      },
      {
        id: "out-of-scope",
        label: { es: "Reserva por mí para mañana", en: "Book me for tomorrow" },
        reply: { es: "No puedo hacer una reserva desde esta demo. El flujo real tendría que consultar una agenda conectada y pedir confirmación antes de guardar un turno.", en: "I can’t book through this demo. A real flow would need to check a connected calendar and request confirmation before saving an appointment." },
        intent: "acción externa no disponible",
      },
    ],
  },
  {
    id: "insurance",
    name: { es: "Seguros", en: "Insurance" },
    shortName: { es: "Seguros", en: "Insurance" },
    description: { es: "Explica conceptos generales y deriva decisiones personales.", en: "Explain general concepts and route personal decisions to a professional." },
    opening: { es: "Puedo explicar conceptos generales de seguros. No tengo pólizas ni cotizaciones reales y no puedo recomendar una decisión personal.", en: "I can explain general insurance concepts. I have no real policies or quotes and can’t recommend a personal decision." },
    accent: "#F09A9A",
    prompts: [
      {
        id: "deductible",
        label: { es: "¿Qué es un deducible?", en: "What is a deductible?" },
        reply: { es: "En términos generales, es la parte de un gasto cubierto que la persona paga según las condiciones de su póliza. El monto, las excepciones y el cálculo dependen del contrato concreto.", en: "In general, it’s the part of a covered expense the policyholder pays under the policy terms. The amount, exceptions, and calculation depend on the specific contract." },
        intent: "concepto general",
      },
      {
        id: "coverage",
        label: { es: "¿Cómo comparo coberturas?", en: "How do I compare coverage?" },
        reply: { es: "Como guía general, compara límites, exclusiones, deducibles, condiciones y el proceso de reclamación en documentos oficiales. Un corredor o aseguradora debe aclarar cómo aplican a tu caso.", en: "As a general guide, compare limits, exclusions, deductibles, conditions, and the claims process in official documents. A licensed agent or insurer should explain how they apply to your case." },
        intent: "orientación general de comparación",
      },
      {
        id: "claim",
        label: { es: "¿Qué hago si tengo un siniestro?", en: "What should I do after an incident?" },
        reply: { es: "Contacta a tu aseguradora por su canal oficial y sigue las instrucciones de tu póliza. Los plazos y documentos varían; esta demo no puede gestionar un reclamo.", en: "Contact your insurer through its official channel and follow your policy’s instructions. Deadlines and documents vary; this demo cannot manage a claim." },
        intent: "derivación a proveedor de póliza",
      },
      {
        id: "out-of-scope",
        label: { es: "¿Qué póliza debo comprar?", en: "Which policy should I buy?" },
        reply: { es: "No puedo recomendar una póliza ni determinar qué te conviene. Depende de tu situación, contrato y regulación aplicable. Consulta a un profesional habilitado y revisa los documentos oficiales.", en: "I can’t recommend a policy or decide what’s right for you. It depends on your circumstances, contract, and applicable rules. Consult a qualified professional and review official documents." },
        intent: "fuera de alcance: recomendación individual",
      },
    ],
  },
  {
    id: "paperwork",
    name: { es: "Trámites", en: "Administrative processes" },
    shortName: { es: "Trámites", en: "Paperwork" },
    description: { es: "Orienta sobre pasos generales y pide verificar en fuentes oficiales.", en: "Explain general steps and point users to official sources." },
    opening: { es: "Puedo ayudarte a ordenar una consulta general. Los trámites cambian según país, organismo y situación; esta demo no representa una oficina pública.", en: "I can help organize a general question. Requirements vary by country, agency, and situation; this demo does not represent a government office." },
    accent: "#A6D0A2",
    prompts: [
      {
        id: "requirements",
        label: { es: "¿Qué documentos suelen pedir?", en: "What documents are usually required?" },
        reply: { es: "Depende del trámite y del organismo. Como primer paso, identifica el nombre oficial del trámite y consulta la lista vigente en el sitio del organismo correspondiente antes de reunir documentos.", en: "It depends on the process and agency. First identify the official process name and check the current list on the relevant agency’s website before collecting documents." },
        intent: "orientación general de requisitos",
      },
      {
        id: "where",
        label: { es: "¿Dónde empiezo?", en: "Where should I start?" },
        reply: { es: "Empieza por identificar el organismo responsable y el país o jurisdicción. Usa su web oficial para confirmar pasos, horarios y canales actuales.", en: "Start by identifying the responsible agency and the country or jurisdiction. Use its official website to confirm current steps, hours, and channels." },
        intent: "identificar organismo y jurisdicción",
      },
      {
        id: "status",
        label: { es: "¿Puedes revisar mi expediente?", en: "Can you check my case status?" },
        reply: { es: "No hay conexión a expedientes ni debes compartir datos personales aquí. Consulta el canal oficial del organismo; si hace falta, una persona puede orientarte sobre dónde buscar.", en: "There is no case-file connection, and you shouldn’t share personal data here. Check the agency’s official channel; a person can help identify where to look." },
        intent: "dato privado no conectado",
      },
      {
        id: "out-of-scope",
        label: { es: "¿Me confirmas que califico?", en: "Can you confirm that I qualify?" },
        reply: { es: "No puedo confirmar elegibilidad ni interpretar definitivamente tu caso. Los criterios dependen de la norma y tus circunstancias; verifica con la institución competente o asesoría profesional.", en: "I can’t confirm eligibility or make a final determination about your case. Criteria depend on the rules and your circumstances; check with the responsible institution or a qualified adviser." },
        intent: "fuera de alcance: determinación oficial",
      },
    ],
  },
];

export function getBotDemo(id: BotDemoId): BotDemo {
  return BOT_DEMOS.find((demo) => demo.id === id) ?? BOT_DEMOS[0];
}

export function getBotReply(demoId: BotDemoId, promptId: string, language: DemoLanguage): string {
  const demo = getBotDemo(demoId);
  return demo.prompts.find((prompt) => prompt.id === promptId)?.reply[language]
    ?? (language === "es"
      ? "No tengo una respuesta verificada para esa consulta. En una implementación real, la derivaría a una persona o a una fuente aprobada."
      : "I don’t have a verified answer for that question. In a real implementation, I’d route it to a person or an approved source.");
}
