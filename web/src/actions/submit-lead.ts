'use server'

import type { ContactFormData } from '@/types'
import { Resend } from 'resend'

export async function submitLead(data: ContactFormData) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
    try {
        // Enviar Email via Resend
        if (RESEND_API_KEY) {
            const resend = new Resend(RESEND_API_KEY)
            const htmlContent = `
                <h2>Nuevo contacto recibido a través de la Web</h2>
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Teléfono:</strong> ${data.telefono || 'No proporcionado'}</p>
                <p><strong>Empresa:</strong> ${data.empresa || 'No proporcionada'}</p>
                ${data.revenue ? `<p><strong>Facturación Mensual (Revenue):</strong> ${data.revenue}</p>` : ''}
                ${data.timeline ? `<p><strong>Timeline de Despliegue:</strong> ${data.timeline}</p>` : ''}
                <p><strong>Servicios de Interés:</strong> ${data.servicios_interes?.join(', ') || 'No especificados'}</p>
                <p><strong>Plan Seleccionado:</strong> ${data.plan_seleccionado || 'Ninguno'}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${data.mensaje || 'Sin mensaje'}</p>
            `;

            await resend.emails.send({
                from: 'MMorera Web Leads <onboarding@resend.dev>',
                to: process.env.NOTIFICATION_EMAIL || 'moreraescobar@gmail.com',
                subject: `Nuevo Lead: ${data.nombre} - ${data.empresa || 'Empresa no especificada'}`,
                html: htmlContent
            })
        }

        // Enviar Notificación a Telegram
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            let telegramMessage = `
🔔 *NUEVO LEAD - WEB* 🔔

👤 *Nombre:* ${data.nombre}
✉️ *Email:* ${data.email}
📱 *Teléfono:* ${data.telefono || 'No proporcionado'}
🏢 *Empresa:* ${data.empresa || 'No proporcionada'}
`;
            if (data.revenue) telegramMessage += `💰 *Revenue:* ${data.revenue}\n`;
            if (data.timeline) telegramMessage += `📅 *Timeline:* ${data.timeline}\n`;

            telegramMessage += `
🛠 *Servicios:* ${data.servicios_interes?.join(', ') || 'No especificados'}
💎 *Plan:* ${data.plan_seleccionado || 'Ninguno'}

💬 *Mensaje:*
${data.mensaje || 'Sin mensaje'}
            `;

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown',
                }),
            });
        }

        // Guardar Lead en InsForge
        const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL
        const insforgeKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
        if (insforgeUrl && insforgeKey) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const { createClient } = require('@insforge/sdk')
                const insforge = createClient({ baseUrl: insforgeUrl, anonKey: insforgeKey })

                let finalMessage = data.mensaje || null;
                if (data.revenue || data.timeline) {
                    finalMessage = `[Brief Info]\nRevenue: ${data.revenue || 'N/A'}\nTimeline: ${data.timeline || 'N/A'}\n\nChallenge:\n${data.mensaje || 'Sin mensaje'}`;
                }

                const { error: dbError } = await insforge.database.from('leads').insert([{
                    first_name: data.nombre,
                    email: data.email,
                    company_name: data.empresa || null,
                    phone: data.telefono || null,
                    interested_services: data.servicios_interes || [],
                    selected_plan: data.plan_seleccionado || null,
                    message: finalMessage,
                    source: 'website'
                }])

                if (dbError) {
                    console.error("Error guardando lead en BD:", dbError)
                }
            } catch (err) {
                console.error("Error de cliente InsForge:", err)
            }
        }

        return { success: true }
    } catch (error) {
        console.error("Error al procesar lead:", error)
        return { success: false, error: 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.' }
    }
}
