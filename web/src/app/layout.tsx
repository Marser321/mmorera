import type { Metadata } from "next";
import { Familjen_Grotesk, Space_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { SITE_IDENTITY } from "@/config/site";
import { AppProviders } from "@/components/providers/AppProviders";
import { GlobalBackground } from "@/components/shared/GlobalBackground";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

const displayFont = Unbounded({
  subsets: ["latin"], display: "swap", variable: "--ff-display", weight: ["400", "500", "700", "900"],
});
const bodyFont = Familjen_Grotesk({
  subsets: ["latin"], display: "swap", variable: "--ff-body", weight: ["400", "500", "600", "700"],
});
const monoFont = Space_Mono({
  subsets: ["latin"], display: "swap", variable: "--ff-mono", weight: ["400", "700"],
});

const { canonical, metadata: siteMetadata } = SITE_IDENTITY;

export const metadata: Metadata = {
  metadataBase: new URL(canonical),
  title: { default: siteMetadata.title.es, template: "%s — Mario Morera" },
  description: siteMetadata.description.es,
  keywords: ["Creative Technologist", "Product Design", "WebGL", "IA", "Automatización", "CRM", "Mario Morera"],
  authors: [{ name: SITE_IDENTITY.brand, url: canonical }],
  creator: SITE_IDENTITY.brand,
  alternates: { canonical: "/", languages: { "es-UY": "/", en: "/en" } },
  openGraph: {
    type: "website", locale: "es_UY", alternateLocale: "en_US", url: canonical,
    title: siteMetadata.title.es, description: siteMetadata.description.es,
    siteName: SITE_IDENTITY.brand,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteMetadata.title.es }],
  },
  twitter: {
    card: "summary_large_image", title: siteMetadata.title.es,
    description: siteMetadata.description.es, images: ["/twitter-image"],
  },
};

export const viewport = {
  themeColor: "#070809",
};

/* Anti-FOUC: aplica el tema persistido antes del primer paint. El server
   siempre emite `dark` (default de marca); si el visitante eligió light, este
   script lo cambia en <html> antes de que exista contenido pintado. */
const themeInitScript = `(function(){try{if(localStorage.getItem("mm-theme")==="light"){var r=document.documentElement;r.classList.remove("dark");r.classList.add("light");r.style.colorScheme="light";var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#F3F0E8")}}catch(e){}})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_IDENTITY.brand,
  url: canonical,
  jobTitle: SITE_IDENTITY.role.es,
  description: siteMetadata.description.es,
  email: `mailto:${SITE_IDENTITY.contact.email}`,
  sameAs: [SITE_IDENTITY.social.github, SITE_IDENTITY.social.linkedin],
  homeLocation: { "@type": "Country", name: "Uruguay" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`dark ${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <AppProviders>
          <a href="#contenido-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-background">
            Saltar al contenido principal
          </a>
          <GlobalBackground />
          <Navbar />
          <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
