import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";

export type CustomDataMessage = {
    isAttachment?: boolean;
    attachmentType?: "image" | "document";
    filename?: string;
};

export type AppTab = "dashboard" | "chat";
export type ShiftState = "pending" | "clocked_in" | "clocked_out";

export function useSkillOnboardingBot() {
    // Tab switching for the interactive mock phone
    const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

    // Shift State
    const [shiftState, setShiftState] = useState<ShiftState>("pending");
    const [clockInTime, setClockInTime] = useState<string | null>(null);

    // Chat State with AI SDK
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, input, handleInputChange, setInput, append, isLoading } = useChat({
        // @ts-expect-error El SDK inferido no reconoce api, pero es válido en tiempo de ejecución
        api: '/api/chat-hr',
        initialMessages: [
            { id: '1', role: 'assistant', content: '¡Hola Martín! Soy el Agente de MMorera HR. Hoy tienes el turno de 14:00 a 22:00. Recuerda fichar cuando llegues al local. ¿Qué necesitas consultar?' }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;

    const [customMessages, setCustomMessages] = useState<Record<string, CustomDataMessage>>({});

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeTab === "chat") {
            scrollToBottom();
        }
    }, [messages, isLoading, activeTab]);

    const handleClockIn = () => {
        if (shiftState === "pending") {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            setClockInTime(timeString);
            setShiftState("clocked_in");

            // Background notification from the bot
            append({ role: "assistant", content: `⏱️ Marcaste entrada a las ${timeString}. Validado por geolocalización en sucursal Centro. ¡Buen turno!` });
        } else if (shiftState === "clocked_in") {
            setShiftState("clocked_out");
            append({ role: "assistant", content: `🚪 Marcaste salida. Total del turno: 8h 05m. Tus horas extra fueron registradas automáticamente.` });
        }
    };

    const handleSendAction = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!(input || "").trim() && !(input || "").includes("[IMAGE]") && !(input || "").includes("[SCHEDULE_REQ]")) return;

        let contentToSend = input;
        let isAttach = false;
        let cType: CustomDataMessage["attachmentType"] = undefined;
        let cFile = "";

        if (input === "[IMAGE]") {
            contentToSend = "Envío imagen adjunta: certificado_medico.jpg [IMAGE]";
            isAttach = true;
            cType = "image";
            cFile = "Certificado_Medico.jpg";
        } else if (input === "[SCHEDULE_REQ]") {
            contentToSend = "¿Puedo cambiar mi turno del Viernes por el de Pedro? [SCHEDULE_REQ]";
        }

        const newId = Date.now().toString();

        if (isAttach) {
            setCustomMessages(prev => ({ ...prev, [newId]: { isAttachment: true, attachmentType: cType, filename: cFile } }));
        }

        append({
            id: newId,
            role: "user",
            content: contentToSend
        });

        setInput("");
    };

    return {
        activeTab,
        setActiveTab,
        shiftState,
        setShiftState,
        clockInTime,
        setClockInTime,
        messagesEndRef,
        messages,
        input,
        handleInputChange,
        setInput,
        append,
        isLoading,
        customMessages,
        setCustomMessages,
        scrollToBottom,
        handleClockIn,
        handleSendAction
    };
}
