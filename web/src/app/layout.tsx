import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GlobalBackground } from "@/components/shared/GlobalBackground";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import dynamic from 'next/dynamic';
import CustomCursor from "@/components/ui/CustomCursor";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const ChatWidgetLoader = dynamic(() => import('@/components/interactive/chat-widget-loader').then(mod => mod.ChatWidgetLoader));

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
    title: "Mario Morera | Multipotential Tech Architect — Creative Development, Video & Automation",
    description: "I orchestrate AI-powered development, high-end video production, modern marketing and analog-to-digital operations for global brands. Remote worldwide, based in Miami, FL.",
    keywords: ["AI Development", "Vibe Coding", "Motion Design", "Marketing Automation", "Process Orchestration", "Miami Tech", "Mario Morera"],
    authors: [{ name: "Mario Morera", url: "https://mmorera.com" }],
    creator: "Mario Morera",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://mmorera.com",
        title: "Mario Morera | Multipotential Tech Architect",
        description: "AI-powered development, high-end video, modern marketing and operational orchestration. Remote worldwide, based in Miami, FL.",
        siteName: "Mario Morera",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`dark ${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ProfessionalService",
                            "name": "Mario Morera — AI-Powered Growth Partner",
                            "image": "https://mmorera.com/og-image.png",
                            "@id": "https://mmorera.com",
                            "url": "https://mmorera.com",
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
                            "description": "Multipotential tech architect: AI-powered creative development, high-end video production, modern marketing integrations and analog-to-digital operations orchestration."
                        })
                    }}
                />
            </head>
            <body className="min-h-screen font-sans antialiased bg-background text-foreground">
                <LanguageProvider>
                    {/* Skip to content — WCAG 2.4.1 */}
                    <a
                        href="#contenido-principal"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
                    >
                        Saltar al contenido principal
                    </a>
                    <GlobalBackground />
                    <CustomCursor />
                    <LanguageSwitcher />
                    <Navbar />
                    <div className="relative z-10 flex flex-col min-h-screen">
                        {children}
                    </div>
                    <Footer />
                    <ChatWidgetLoader />
                </LanguageProvider>
            </body>
        </html>
    );
}

