"use client";

import dynamic from "next/dynamic";

// Lazy load del ChatWidget — evita que @ai-sdk/react se ejecute en SSR
const ChatWidget = dynamic(
    () => import("./chat-widget").then(mod => mod.ChatWidget),
    { ssr: false },
);

/**
 * Wrapper Client Component que carga el ChatWidget de forma diferida.
 * Necesario porque `next/dynamic` con `ssr: false` solo funciona
 * dentro de Client Components en Next.js 15+/16.
 */
export function ChatWidgetLoader() {
    return <ChatWidget />;
}
