import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getInsForge } from '@/lib/insforge';
import { MOCK_SERVICES } from '@/data/services';

// Permitir streaming de hasta 30 segundos de respuesta
export const maxDuration = 30;

export async function POST(req: Request) {
    // Extraemos el array de mensajes que el cliente nos envía.
    // Gracias a useChat, esto contiene todo el historial de la conversación (memoria efímera).
    const { messages } = await req.json();

    const insforge = getInsForge();

    // 1. Fetching Dinámico (RAG)
    let context = 'Servicios no disponibles temporalmente.';
    try {
        if (insforge) {
            const { data: services } = await insforge.database
                .from('kb_assets')
                .select('*')
                .eq('asset_type', 'servicio')
                .eq('is_active', true);

            if (services && services.length > 0) {
                context = services.map((s: { title: string, content: string }) => `- ${s.title}: ${s.content}`).join('\n');
            }
        }
    } catch (e) {
        console.error("Error fetching Supabase para RAG", e);
    }

    // Fallback: Si no hay Supabase o falló la data, usamos los mock de MOCK_SERVICES
    if (context === 'Servicios no disponibles temporalmente.' && MOCK_SERVICES) {
        context = MOCK_SERVICES.map(s => `- ${s.nombre}: ${s.descripcion}`).join('\n');
    }

    // Prompt del sistema para el comportamiento del bot
    const systemPrompt = `
Eres el asistente virtual premium y experto de NEXO Agency (antes MMORE).
Tu tono es profesional, elegante, persuasivo y sutilmente tecnológico ("dark mode" ciberpunk elegante).
Usás español rioplatense (Uruguay/Argentina), tratando de 'vos' al usuario de forma respetuosa pero cercana.

Objetivos:
1. Ayudar a agendar consultorías de IA, desarrollos de software (Next.js/InsForge) y automatizaciones.
2. Responder de manera concisa y al grano. No des respuestas exageradamente largas.
3. Si el usuario muestra interés en contratar un servicio, redirigí la conversación a invitarlo a dejar sus datos en el formulario de contacto o pedir su email ahí mismo.

Información sobre los servicios ACTUALES de NEXO (Obtenida dinámicamente de la Base de Conocimientos):
${context}

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
