'use server'

import { createClient } from '@insforge/sdk'
import { Resend } from 'resend'
import type { ContactFormData } from '@/types'
import {
    BRIEF_VALUE_LABELS,
    composeLeadMessage,
    escapeHtml,
    validateAndNormalizeLead,
    type LeadField,
} from '@/lib/leadValidation'

export type SubmitLeadResult =
    | { success: true }
    | { success: false; error: string; fieldErrors?: Partial<Record<LeadField, string>> }

export async function submitLead(input: ContactFormData): Promise<SubmitLeadResult> {
    // El honeypot responde como un envío válido para no enseñar el filtro al bot.
    if (typeof input.website === 'string' && input.website.trim()) return { success: true }

    const validation = validateAndNormalizeLead(input)
    if (!validation.success) {
        return {
            success: false,
            error: 'Revisá los campos marcados y volvé a enviar.',
            fieldErrors: validation.fieldErrors,
        }
    }

    const data = validation.data
    const finalMessage = composeLeadMessage(data)
    const serviceNames = data.servicios_interes.join(', ') || 'No especificados'
    const projectStage = BRIEF_VALUE_LABELS.projectStage[data.projectStage]
    const teamContext = BRIEF_VALUE_LABELS.teamContext[data.teamContext]
    const timeline = BRIEF_VALUE_LABELS.timeline[data.timeline]

    try {
        const resendApiKey = process.env.RESEND_API_KEY
        if (resendApiKey) {
            const resend = new Resend(resendApiKey)
            await resend.emails.send({
                from: 'MMorera Web Leads <onboarding@resend.dev>',
                to: process.env.NOTIFICATION_EMAIL || 'moreraescobar@gmail.com',
                subject: `Nuevo contexto: ${data.nombre} — ${data.empresa || 'Proyecto personal'}`,
                html: [
                    '<h2>Nuevo contexto recibido desde la web</h2>',
                    `<p><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>`,
                    `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`,
                    `<p><strong>Proyecto o empresa:</strong> ${escapeHtml(data.empresa || 'No indicado')}</p>`,
                    `<p><strong>Madurez:</strong> ${escapeHtml(projectStage)}</p>`,
                    `<p><strong>Equipo:</strong> ${escapeHtml(teamContext)}</p>`,
                    `<p><strong>Inicio:</strong> ${escapeHtml(timeline)}</p>`,
                    `<p><strong>Servicios:</strong> ${escapeHtml(serviceNames)}</p>`,
                    '<p><strong>Proyecto:</strong></p>',
                    `<p>${escapeHtml(data.mensaje).replace(/\n/g, '<br />')}</p>`,
                ].join(''),
            })
        }

        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
        const telegramChatId = process.env.TELEGRAM_CHAT_ID
        if (telegramBotToken && telegramChatId) {
            const telegramMessage = [
                'NUEVO CONTEXTO — WEB',
                '',
                `Nombre: ${data.nombre}`,
                `Email: ${data.email}`,
                `Proyecto o empresa: ${data.empresa || 'No indicado'}`,
                `Madurez: ${projectStage}`,
                `Equipo: ${teamContext}`,
                `Inicio: ${timeline}`,
                `Servicios: ${serviceNames}`,
                '',
                'Proyecto:',
                data.mensaje,
            ].join('\n')

            const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: telegramChatId, text: telegramMessage }),
            })
            if (!response.ok) throw new Error(`Telegram respondió ${response.status}`)
        }

        const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL
        const insforgeKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
        if (insforgeUrl && insforgeKey) {
            try {
                const insforge = createClient({ baseUrl: insforgeUrl, anonKey: insforgeKey })
                const { error: dbError } = await insforge.database.from('leads').insert([{
                    first_name: data.nombre,
                    email: data.email,
                    company_name: data.empresa || null,
                    phone: data.telefono || null,
                    interested_services: data.servicios_interes,
                    selected_plan: data.plan_seleccionado || null,
                    message: finalMessage,
                    source: 'website',
                }])
                if (dbError) console.error('Error guardando lead en BD:', dbError)
            } catch (error) {
                console.error('Error de cliente InsForge:', error)
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Error al procesar lead:', error)
        return { success: false, error: 'No pude enviar el contexto. Probá nuevamente o escribime por email.' }
    }
}
