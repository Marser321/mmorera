import type { Metadata } from "next";
import { Familjen_Grotesk, Space_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { SITE_IDENTITY } from "@/config/site";
import { AppProviders } from "@/components/providers/AppProviders";
import { GlobalBackground } from "@/components/shared/GlobalBackground";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { WhatsAppFab } from "@/components/shared/WhatsAppFab";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { PageCurtain } from "@/components/motion/PageCurtain";
import { jsonLdHtml, pageMetadata, personaJsonLd, sitioJsonLd } from "@/lib/seo";

const displayFont = Unbounded({
  subsets: ["latin"], display: "swap", variable: "--ff-display", weight: ["400", "500", "700", "900"],
});
const bodyFont = Familjen_Grotesk({
  subsets: ["latin"], display: "swap", variable: "--ff-body", weight: ["400", "500", "600", "700"],
});
const monoFont = Space_Mono({
  subsets: ["latin"], display: "swap", variable: "--ff-mono", weight: ["400", "700"],
});

const { canonical } = SITE_IDENTITY;

// Por defecto, los metadatos del inicio (cada página fija pisa los suyos con
// `pageMetadata`). El título por defecto no lleva la plantilla.
const inicio = pageMetadata("inicio", "es");

export const metadata: Metadata = {
  ...inicio,
  metadataBase: new URL(canonical),
  title: { default: (inicio.title as { absolute: string }).absolute, template: "%s — Mario Morera" },
  applicationName: SITE_IDENTITY.brand,
  authors: [{ name: SITE_IDENTITY.brand, url: canonical }],
  creator: SITE_IDENTITY.brand,
  publisher: SITE_IDENTITY.brand,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport = {
  themeColor: "#0B0B0A",
};

/* Anti-FOUC: aplica el tema persistido antes del primer paint. El server
   siempre emite `dark` (default de marca); si el visitante eligió light, este
   script lo cambia en <html> antes de que exista contenido pintado. También
   corrige el idioma en /en (un solo layout raíz emite `lang="es"`), para
   lectores de pantalla y buscadores que leen el atributo. */
const themeInitScript = `(function(){try{var p=location.pathname;if(p==="/en"||p.indexOf("/en/")===0)document.documentElement.lang="en";if(localStorage.getItem("mm-theme")==="light"){var r=document.documentElement;r.classList.remove("dark");r.classList.add("light");r.style.colorScheme="light";var m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content","#F3F0E8")}}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`dark ${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(personaJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(sitioJsonLd()) }} />
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
          {/* Grano de pared: textura fija y tenue sobre todo el sitio (debajo de la barra). */}
          <div aria-hidden="true" className="grano-pared" />
          <WhatsAppFab />
          <CursorLabel />
          <PageCurtain />
        </AppProviders>
      </body>
    </html>
  );
}
