export interface VoiceDialogueTurn {
  id: string;
  speaker: "caller" | "agent";
  timeOffsetSec: number;
  text: {
    es: string;
    en: string;
  };
  audioEnergy: number; // 0.0 - 1.0 (para el visualizador de ondas)
  crmEvent?: {
    action: string;
    payload: Record<string, string | number | boolean>;
  };
}

export interface VoiceAgentPersona {
  id: "clinic" | "realestate" | "dealership";
  name: {
    es: string;
    en: string;
  };
  role: {
    es: string;
    en: string;
  };
  voiceName: string;
  accentColor: string;
  accentBg: string;
  badge: {
    es: string;
    en: string;
  };
  telemetry: {
    latencyMs: number;
    sttEngine: string;
    llmEngine: string;
    ttsEngine: string;
    sentimentScore: string;
    samplingRate: string;
  };
  dialogue: VoiceDialogueTurn[];
  summary: {
    es: string;
    en: string;
  };
}

export const VOICE_AGENT_PERSONAS: VoiceAgentPersona[] = [
  {
    id: "clinic",
    name: {
      es: "Dra. Sofía · Recepción Clínica",
      en: "Dr. Sofia · Clinical Reception",
    },
    role: {
      es: "Triaje, Cobertura Médica y Reserva de Turnos",
      en: "Triage, Insurance Verification & Appointment Booking",
    },
    voiceName: "Neural LatAm · Clara (ElevenLabs Flash v2)",
    accentColor: "#71F3A2",
    accentBg: "rgba(113, 243, 162, 0.12)",
    badge: {
      es: "Sector Salud & Clínicas",
      en: "Health & Private Clinics",
    },
    telemetry: {
      latencyMs: 245,
      sttEngine: "Deepgram Nova-2 (Medical Lexicon)",
      llmEngine: "Claude 3.5 Sonnet / Function Calling",
      ttsEngine: "ElevenLabs Ultra-Low Latency Turbo",
      sentimentScore: "98% Empatía / Calma",
      samplingRate: "24 kHz / Opus 64kbps",
    },
    summary: {
      es: "Atiende llamadas entrantes 24/7, detecta urgencias, valida la cobertura médica y agenda en el software de la clínica sin intervención humana.",
      en: "Handles 24/7 inbound calls, detects urgency, verifies insurance coverage and books slots directly into clinic software.",
    },
    dialogue: [
      {
        id: "c-1",
        speaker: "caller",
        timeOffsetSec: 0,
        text: {
          es: "Hola, buenos días. Necesito un turno urgente para odontología con el Dr. Varela.",
          en: "Hi, good morning. I urgently need a dental appointment with Dr. Varela.",
        },
        audioEnergy: 0.65,
      },
      {
        id: "c-2",
        speaker: "agent",
        timeOffsetSec: 2,
        text: {
          es: "¡Hola! Con gusto te ayudo. El Dr. Varela tiene un espacio hoy a las 16:30 o mañana a las 10:00. ¿Cuál te resulta más cómodo?",
          en: "Hello! Happy to help. Dr. Varela has an opening today at 4:30 PM or tomorrow at 10:00 AM. Which works better for you?",
        },
        audioEnergy: 0.85,
        crmEvent: {
          action: "CHECK_CALENDAR_SLOTS",
          payload: { doctor: "Dr. Varela", specialty: "Odontología", availableSlots: 2 },
        },
      },
      {
        id: "c-3",
        speaker: "caller",
        timeOffsetSec: 6,
        text: {
          es: "Hoy a las cuatro y media me viene perfecto. ¿Aceptan seguro Mapfre?",
          en: "Today at four thirty is perfect. Do you take Mapfre insurance?",
        },
        audioEnergy: 0.58,
      },
      {
        id: "c-4",
        speaker: "agent",
        timeOffsetSec: 8,
        text: {
          es: "Sí, trabajamos con Mapfre con cobertura directa. Ya te reservé el turno para las 16:30. Te acabo de enviar la confirmación y la ubicación por WhatsApp.",
          en: "Yes, Mapfre has direct coverage. I have booked your 4:30 PM slot. Confirmation and clinic location were just sent to your WhatsApp.",
        },
        audioEnergy: 0.9,
        crmEvent: {
          action: "CONFIRM_APPOINTMENT_AND_DISPATCH_SMS",
          payload: {
            time: "16:30",
            insurance: "Mapfre",
            patientPhone: "+59892***675",
            status: "CONFIRMED",
          },
        },
      },
    ],
  },
  {
    id: "realestate",
    name: {
      es: "Mateo · Calificador Inmobiliario",
      en: "Mateo · Real Estate Qualifier",
    },
    role: {
      es: "Filtro de Inversión, Tipología y Asignación de Broker",
      en: "Investment Filter, Typology & Broker Assignment",
    },
    voiceName: "Natural Male · Lucas (OpenAI Realtime API)",
    accentColor: "#55D8FF",
    accentBg: "rgba(85, 216, 255, 0.12)",
    badge: {
      es: "Bienes Raíces & Desarrollos",
      en: "Real Estate & Developers",
    },
    telemetry: {
      latencyMs: 220,
      sttEngine: "Whisper Large v3 Turbo",
      llmEngine: "GPT-4o Realtime Audio Engine",
      ttsEngine: "Direct Neural Audio Stream",
      sentimentScore: "95% Profesional / Ejecutivo",
      samplingRate: "24 kHz / PCM 16-bit",
    },
    summary: {
      es: "Filtra prospectos de pauta publicitaria en menos de 30 segundos, califica rango de inversión y transfiere la llamada al broker adecuado.",
      en: "Screens ad campaign leads in under 30 seconds, qualifies budget range and routes warm calls to the right broker.",
    },
    dialogue: [
      {
        id: "r-1",
        speaker: "caller",
        timeOffsetSec: 0,
        text: {
          es: "Hola, vi el anuncio del desarrollo en Pocitos y quería saber precios de unidades de 2 dormitorios.",
          en: "Hi, I saw your development ad in Pocitos and wanted to check prices for 2-bedroom units.",
        },
        audioEnergy: 0.6,
      },
      {
        id: "r-2",
        speaker: "agent",
        timeOffsetSec: 2,
        text: {
          es: "¡Hola! En la torre de Pocitos nos quedan 3 unidades de 2 dormitorios desde USD 185.000 con terraza y garaje. ¿Buscás para vivir o como inversión de renta?",
          en: "Hello! We have 3 2-bedroom units left in Pocitos starting at $185,000 with balcony and garage. Are you looking to live or rental investment?",
        },
        audioEnergy: 0.88,
        crmEvent: {
          action: "QUERY_INVENTORY_PRICING",
          payload: { development: "Torre Pocitos", typology: "2D", minPrice: 185000 },
        },
      },
      {
        id: "r-3",
        speaker: "caller",
        timeOffsetSec: 6,
        text: {
          es: "Para inversión. Dispongo de un anticipo de 80.000 y el resto financiado.",
          en: "For investment. I have an $80k down payment and want to finance the rest.",
        },
        audioEnergy: 0.52,
      },
      {
        id: "r-4",
        speaker: "agent",
        timeOffsetSec: 8,
        text: {
          es: "Excelente calce. Tenemos un plan en 36 cuotas con 7.8% de retorno proyectado. ¿Te gustaría coordinar una videollamada de 10 minutos con el director de ventas?",
          en: "Great fit. We have a 36-installment plan with 7.8% projected yield. Would you like a 10-minute video tour with our sales director?",
        },
        audioEnergy: 0.92,
        crmEvent: {
          action: "QUALIFY_LEAD_HIGH_INTENT",
          payload: { intent: "Investment", budget: 185000, downPayment: 80000, score: "A+" },
        },
      },
    ],
  },
  {
    id: "dealership",
    name: {
      es: "Camila · Taller & Servicios Automotriz",
      en: "Camila · Dealership & Service Desk",
    },
    role: {
      es: "Cotización de Servicio Oficial, Repuestos y Agenda de Taller",
      en: "Official Maintenance Quotes, Parts & Bay Booking",
    },
    voiceName: "Dynamic Female · Mariana (Cartesia Sonic)",
    accentColor: "#FFB86C",
    accentBg: "rgba(255, 184, 108, 0.12)",
    badge: {
      es: "Concesionarias & Detailing",
      en: "Dealerships & Auto Detailing",
    },
    telemetry: {
      latencyMs: 195,
      sttEngine: "Deepgram Flux Audio",
      llmEngine: "Fast Router LLM (Llama 3.3 70B)",
      ttsEngine: "Cartesia Sonic (135ms TTS)",
      sentimentScore: "99% Eficiencia Operativa",
      samplingRate: "48 kHz / Ultra-HD",
    },
    summary: {
      es: "Resuelve consultas de kilometraje, cotiza el mantenimiento por modelo de vehículo y asigna bahía técnica en el ERP del taller.",
      en: "Handles mileage service inquiries, quotes maintenance by vehicle model, and assigns technician bays in workshop ERP.",
    },
    dialogue: [
      {
        id: "d-1",
        speaker: "caller",
        timeOffsetSec: 0,
        text: {
          es: "Hola, tengo que hacerle el service de los 40.000 km a un Toyota Corolla 2022. ¿Cuánto me sale?",
          en: "Hi, I need the 40,000 km service for a 2022 Toyota Corolla. What does that cost?",
        },
        audioEnergy: 0.62,
      },
      {
        id: "d-2",
        speaker: "agent",
        timeOffsetSec: 2,
        text: {
          es: "Hola. El service de 40.000 km para Corolla incluye cambio de fluidos sintéticos, filtros originales y diagnóstico computarizado por $240 con IVA incluido.",
          en: "Hello. The 40k service for Corolla includes synthetic oil, OEM filters, and computer diagnostics for $240 taxes included.",
        },
        audioEnergy: 0.84,
        crmEvent: {
          action: "CALCULATE_MAINTENANCE_QUOTE",
          payload: { vehicle: "Toyota Corolla 2022", serviceKm: 40000, priceUsd: 240 },
        },
      },
      {
        id: "d-3",
        speaker: "caller",
        timeOffsetSec: 6,
        text: {
          es: "¿Tienen turno para dejarlo este jueves temprano?",
          en: "Do you have an opening to drop it off this Thursday morning?",
        },
        audioEnergy: 0.55,
      },
      {
        id: "d-4",
        speaker: "agent",
        timeOffsetSec: 8,
        text: {
          es: "Sí, podés dejarlo el jueves a las 08:15 hs en la bahía de recepción rápida y retirarlo a las 13:00. ¿Querés que te reserve ese horario?",
          en: "Yes, you can drop it off Thursday at 8:15 AM at express bay and pick it up at 1:00 PM. Should I lock in that slot?",
        },
        audioEnergy: 0.89,
        crmEvent: {
          action: "RESERVE_BAY_AND_NOTIFY_LEAD_TECH",
          payload: { bay: "Express-Bay-2", dropoff: "Thursday 08:15", status: "HOLD" },
        },
      },
    ],
  },
];
