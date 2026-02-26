import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Permitir streaming de hasta 30 segundos de respuesta
export const maxDuration = 30;

export async function POST(req: Request) {
    // Extraemos el array de mensajes que el cliente nos envía.
    // Gracias a useChat, esto contiene todo el historial de la conversación (memoria efímera).
    const { messages } = await req.json();

    // Prompt del sistema para el comportamiento del bot
    const systemPrompt = `
Eres el asistente virtual premium y experto de NEXO Agency (antes MMORE).
Tu tono es profesional, elegante, persuasivo y sutilmente tecnológico ("dark mode" ciberpunk elegante).
Usás español rioplatense (Uruguay/Argentina), tratando de 'vos' al usuario de forma respetuosa pero cercana.

Objetivos:
1. Ayudar a agendar consultorías de IA, desarrollos de software (Next.js/Supabase) y automatizaciones.
2. Responder de manera concisa y al grano. No des respuestas exageradamente largas.
3. Si el usuario muestra interés en contratar un servicio, redirigí la conversación a invitarlo a dejar sus datos en el formulario de contacto o pedir su email ahí mismo.

Información sobre los servicios de NEXO:
- Auditoría de IA
- Arquitecto de Onboarding (Chatbots, automatizaciones de CRM)
- Pipeline de Contenido (Generación masiva de contenido con IA)
- E-commerce y Landing Pages de Alta Conversión

Si no sabes la respuesta a algo, simplemente ofrece tomar sus datos para que un estratega humano (Mathias) se contacte con ellos.
  `.trim();

    // Llamada a la API de OpenAI
    // Asegúrate de tener OPENAI_API_KEY en tu .env o Vercel environment variables
    const result = streamText({
        model: openai('gpt-4o-mini'),
        system: systemPrompt,
        messages,
    });

    // Retornamos la respuesta como un stream de datos hacia el frontend
    return result.toTextStreamResponse();
}
