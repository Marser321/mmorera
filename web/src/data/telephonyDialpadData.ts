export interface DtmfTone {
  key: string;
  lowFreq: number;
  highFreq: number;
  sublabel: string;
}

export interface TelephonyPreset {
  id: string;
  name: { es: string; en: string };
  phoneNumber: string;
  personaName: string;
  industry: { es: string; en: string };
  latencyMs: number;
  ttsEngine: string;
  firstMessage: { es: string; en: string };
  callerIntent: { es: string; en: string };
  aiFollowup: { es: string; en: string };
  crmAction: { es: string; en: string };
}

export const DTMF_KEYPAD: DtmfTone[] = [
  { key: "1", lowFreq: 697, highFreq: 1209, sublabel: "" },
  { key: "2", lowFreq: 697, highFreq: 1336, sublabel: "ABC" },
  { key: "3", lowFreq: 697, highFreq: 1477, sublabel: "DEF" },
  { key: "4", lowFreq: 770, highFreq: 1209, sublabel: "GHI" },
  { key: "5", lowFreq: 770, highFreq: 1336, sublabel: "JKL" },
  { key: "6", lowFreq: 770, highFreq: 1477, sublabel: "MNO" },
  { key: "7", lowFreq: 852, highFreq: 1209, sublabel: "PQRS" },
  { key: "8", lowFreq: 852, highFreq: 1336, sublabel: "TUV" },
  { key: "9", lowFreq: 852, highFreq: 1477, sublabel: "WXYZ" },
  { key: "*", lowFreq: 941, highFreq: 1209, sublabel: "" },
  { key: "0", lowFreq: 941, highFreq: 1336, sublabel: "+" },
  { key: "#", lowFreq: 941, highFreq: 1477, sublabel: "" },
];

export const TELEPHONY_PRESETS: TelephonyPreset[] = [
  {
    id: "preset-dental",
    name: { es: "Recepción Clínica Dental", en: "Dental Clinic Receptionist" },
    phoneNumber: "+1 (800) 336-8251",
    personaName: "Dra. Sofía AI",
    industry: { es: "Salud Privada & Odontología", en: "Private Healthcare & Dental" },
    latencyMs: 185,
    ttsEngine: "Cartesia Sonic WebSockets",
    firstMessage: {
      es: "Hola, gracias por llamar a Clínica Dental Alvear. Soy Sofía, asistente virtual. ¿Querés agendar una consulta o tenés una urgencia?",
      en: "Hi, thanks for calling Alvear Dental. I am Sofia, virtual assistant. Would you like to book an appointment or do you have an urgent inquiry?",
    },
    callerIntent: {
      es: "Hola, se me desprendió un bracket y quería ver si tienen turno para hoy a la tarde.",
      en: "Hi, one of my brackets came loose and I wanted to see if you have any slots available this afternoon.",
    },
    aiFollowup: {
      es: "Entendido, es una urgencia de ortodoncia. Tenemos disponibilidad con el Dr. Méndez hoy a las 16:30 o a las 18:00. ¿Cuál te queda mejor?",
      en: "Understood, an orthodontic emergency. We have availability with Dr. Mendez today at 4:30 PM or 6:00 PM. Which works best?",
    },
    crmAction: {
      es: "Turno reservado en Google Calendar + SMS de confirmación con dirección y ficha médica.",
      en: "Slot locked in Google Calendar + SMS confirmation with clinic address and medical form.",
    },
  },
  {
    id: "preset-realty",
    name: { es: "Calificador Inmobiliario A+", en: "Luxury Real Estate Qualifier" },
    phoneNumber: "+1 (800) 732-5890",
    personaName: "Mateo Broker AI",
    industry: { es: "Desarrollo Inmobiliario & Lujo", en: "Real Estate & Luxury Developments" },
    latencyMs: 210,
    ttsEngine: "Claude 3.5 Haiku + Cartesia",
    firstMessage: {
      es: "Buen día, te comunicás con la torre Residencias del Este. Soy Mateo. ¿Buscás información sobre unidades de 2 o 3 dormitorios?",
      en: "Good day, you reached Residencias del Este tower. I am Mateo. Are you inquiring about 2 or 3 bedroom residences?",
    },
    callerIntent: {
      es: "Hola Mateo, vi el penthouse del piso 14 en internet y quería saber el valor de m2 y si aceptan permutas.",
      en: "Hi Mateo, I saw the 14th floor penthouse online and wanted to know the price per sq ft and if you accept trade-ins.",
    },
    aiFollowup: {
      es: "El penthouse tiene 240m² y terraza privada con vista al río. El valor parte en $480,000 USD y sí tomamos propiedades en parte de pago previa tasación. ¿Te gustaría coordinar una visita privada este jueves?",
      en: "The penthouse features 2,600 sq ft and a private riverview terrace. Pricing starts at $480,000 USD, and we do evaluate trade-in properties. Would you like a private tour this Thursday?",
    },
    crmAction: {
      es: "Lead calificado A+ (Presupuesto $450k+) asignado a director comercial con grabación y transcripción.",
      en: "Qualified A+ lead ($450k+ budget) dispatched to senior broker with call audio and transcript.",
    },
  },
  {
    id: "preset-detailing",
    name: { es: "Turnos Auto Detailing & Taller", en: "Auto Detailing & Service Booker" },
    phoneNumber: "+1 (800) 458-9201",
    personaName: "Lucas Detailing AI",
    industry: { es: "Servicios Automotrices & Estética", en: "Automotive Detailing & Services" },
    latencyMs: 195,
    ttsEngine: "ElevenLabs Conversational WebRTC",
    firstMessage: {
      es: "Hola, Elite Auto Detailing. Te atiende Lucas. ¿En qué vehículo te gustaría hacer el tratamiento cerámico o pulido?",
      en: "Hello, Elite Auto Detailing. Lucas here. Which vehicle would you like a ceramic coating or paint correction for?",
    },
    callerIntent: {
      es: "Hola, tengo una Ford Ranger Raptor negra y quiero hacerle tratamiento cerámico de 3 años.",
      en: "Hi, I have a black Ford Ranger Raptor and want a 3-year ceramic coating package.",
    },
    aiFollowup: {
      es: "Excelente vehículo. Para la Raptor incluye descontaminado ferroso, corrección de laca en 2 pasos y sellado cerámico Gyeon de 3 años por $380 USD. Demora 24h. ¿Te reservo la bahía para el lunes próximo?",
      en: "Incredible truck. For the Raptor that includes chemical decontamination, 2-stage paint correction and 3-year Gyeon coating for $380 USD. 24h turnaround. Shall I book your bay for next Monday?",
    },
    crmAction: {
      es: "Bahía reservada en GoHighLevel + Link de pago de seña enviado automáticamente por WhatsApp.",
      en: "Service bay reserved in GoHighLevel + Deposit payment link dispatched via WhatsApp.",
    },
  },
];

export function getDtmfTone(key: string): DtmfTone | undefined {
  return DTMF_KEYPAD.find((t) => t.key === key);
}

export function formatDialDisplay(rawNumber: string): string {
  const digits = rawNumber.replace(/[^\d+*#]/g, "");
  if (!digits) return "";
  return digits;
}
