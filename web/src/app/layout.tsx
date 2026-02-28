import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GlobalBackground } from "@/components/shared/GlobalBackground";

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
    title: "MMorera SME | Infraestructura de Conversión B2B con IA — Más ventas, menos operación",
    description: "La agencia de Mario Morera especializada en transformar operaciones lentas en sistemas de alta velocidad mediante Inteligencia Artificial agresiva y humana.",
    keywords: ["IA", "Automatización", "Next.js", "B2B", "Conversión", "Mario Morera", "MMorera SME"],
    authors: [{ name: "Mario Morera", url: "https://mmorera.com" }],
    creator: "Mario Morera",
    openGraph: {
        type: "website",
        locale: "es_UY",
        url: "https://mmorera.com",
        title: "MMorera SME | Infraestructura de Conversión B2B con IA",
        description: "Construimos Sistemas Operativos Inteligentes que se adaptan a tu empresa.",
        siteName: "MMorera SME",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`dark ${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ProfessionalService",
                            "name": "MMorera SME",
                            "image": "https://mmorera.com/og-image.png",
                            "@id": "https://mmorera.com",
                            "url": "https://mmorera.com",
                            "telephone": "+58992323675",
                            "priceRange": "$$$",
                            "address": {
                                "@type": "PostalAddress",
                                "addressCountry": "UY"
                            },
                            "description": "Tu Agencia Integral de Crecimiento & IA. Transformamos operaciones lentas en máquinas de ventas."
                        })
                    }}
                />
            </head>
            <body className="min-h-screen font-sans antialiased bg-background text-foreground">
                {/* Skip to content — WCAG 2.4.1 */}
                <a
                    href="#contenido-principal"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
                >
                    Saltar al contenido principal
                </a>
                <GlobalBackground />
                <div className="relative z-10 flex flex-col min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}

