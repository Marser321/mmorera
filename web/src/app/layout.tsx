import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-sans",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-heading",
    weight: ["400", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "MMORE | Automatizaciones de Marketing con IA — Más ventas, menos operación",
    description:
        "Sistemas de automatización y agentes de IA para marketing B2B. Aumentá tu productividad y ventas sin aumentar tu plantilla. Auditoría de IA gratuita.",
    keywords: [
        "automatización marketing",
        "IA marketing B2B",
        "agencia automatizaciones",
        "lead generation",
        "CRM automatizado",
    ],
    authors: [{ name: "MMORE Agency" }],
    openGraph: {
        title: "MMORE | Automatizaciones de Marketing con IA",
        description:
            "Sistemas de automatización y agentes de IA para marketing B2B. Auditoría gratuita.",
        type: "website",
        locale: "es_UY",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`dark ${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
            <body className="min-h-screen font-sans antialiased bg-background text-foreground">
                {/* Skip to content — WCAG 2.4.1 */}
                <a
                    href="#contenido-principal"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
                >
                    Saltar al contenido principal
                </a>
                {children}
            </body>
        </html>
    );
}

