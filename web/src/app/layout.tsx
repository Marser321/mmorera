import type { Metadata } from "next";
import { Unbounded, Familjen_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { GlobalBackground } from "@/components/shared/GlobalBackground";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import dynamic from 'next/dynamic';
import CustomCursor from "@/components/ui/CustomCursor";
import { AppProviders } from "@/components/providers/AppProviders";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ScrollProgressBar } from "@/components/scroll/ScrollProgressBar";

const ChatWidgetLoader = dynamic(() => import('@/components/interactive/chat-widget-loader').then(mod => mod.ChatWidgetLoader));
const siteUrl = "https://mmorera.com";
const shareImage = {
    url: `${siteUrl}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "MMorera Agency",
};

// Identidad "Orquestador máximo": display expresivo (Unbounded) como sistema
// visual dominante, body neutro moderno (Familjen Grotesk) y mono con carácter
// (Space Mono) para timecode/telemetría. Reemplaza Inter/Playfair/JetBrains.
const displayFont = Unbounded({
    subsets: ["latin"],
    display: "swap",
    variable: "--ff-display",
    weight: ["400", "500", "700", "900"],
});

const bodyFont = Familjen_Grotesk({
    subsets: ["latin"],
    display: "swap",
    variable: "--ff-body",
    weight: ["400", "500", "600", "700"],
});

const monoFont = Space_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--ff-mono",
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Nexus.AI | Sistemas Operativos de IA y Automatización B2B",
    description: "Construimos sistemas operativos de IA y automatizaciones de alto rendimiento para escalar tus ventas y optimizar operaciones sin aumentar tu nómina.",
    keywords: ["IA Development", "Nexus.AI", "Sistemas Operativos de IA", "Automatización de Marketing", "CRM", "Orquestación de Procesos", "Mario Morera"],
    authors: [{ name: "Mario Morera", url: siteUrl }],
    creator: "Mario Morera",
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: siteUrl,
        title: "Nexus.AI | Sistemas Operativos de IA y Automatización B2B",
        description: "Construimos sistemas operativos de IA y automatizaciones de alto rendimiento para escalar tus ventas y optimizar operaciones sin aumentar tu nómina.",
        siteName: "Nexus.AI",
        images: [shareImage],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nexus.AI | Sistemas Operativos de IA y Automatización B2B",
        description: "Construimos sistemas operativos de IA y automatizaciones de alto rendimiento para escalar tus ventas y optimizar operaciones sin aumentar tu nómina.",
        images: [
            {
                url: `${siteUrl}/twitter-image`,
                alt: "Nexus.AI",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`dark ${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ProfessionalService",
                            "name": "Nexus.AI",
                            "image": `${siteUrl}/opengraph-image`,
                            "@id": siteUrl,
                            "url": siteUrl,
                            "priceRange": "$$$",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Miami",
                                "addressRegion": "FL",
                                "addressCountry": "US"
                            },
                            "areaServed": {
                                "@type": "Country",
                                "name": "United States"
                            },
                            "description": "Construimos sistemas operativos de IA y automatizaciones de alto rendimiento para escalar tus ventas y optimizar operaciones sin aumentar tu nómina."
                        })
                    }}
                />
            </head>
            <body className="min-h-screen font-sans antialiased bg-background text-foreground">
                <AppProviders>
                    {/* Skip to content — WCAG 2.4.1 */}
                    <a
                        href="#contenido-principal"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
                    >
                        Saltar al contenido principal
                    </a>
                    <ScrollProgressBar />
                    <GlobalBackground />
                    <CustomCursor />
                    <LanguageSwitcher />
                    <Navbar />
                    <div className="relative z-10 flex flex-col min-h-screen">
                        {children}
                    </div>
                    <Footer />
                    <ChatWidgetLoader />
                </AppProviders>
            </body>
        </html>
    );
}
