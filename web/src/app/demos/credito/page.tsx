import type { Metadata } from "next";
import { DemoCreditoExperience } from "@/components/demos/DemoCreditoExperience";

const description = "Una plataforma de crédito en español con dos caras: la persona aprende paso a paso y el negocio capta, ordena y cumple.";

// Página sin enlaces desde el sitio: sólo se llega por el correo que se manda a ese rubro.
// Fuera de los buscadores, como el resto de /demos.
export const metadata: Metadata = {
  title: "Demo de la plataforma de crédito",
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/demos/credito" },
  openGraph: {
    type: "website",
    url: "/demos/credito",
    title: "Demo de la plataforma de crédito — Mario Morera",
    description,
    images: [{ url: "/demos/credito/og.jpg", width: 1200, height: 630, alt: "Crédito, paso a paso" }],
  },
  twitter: { card: "summary_large_image", title: "Demo de la plataforma de crédito", description, images: ["/demos/credito/og.jpg"] },
};

export default function DemoCreditoPage() {
  return <DemoCreditoExperience />;
}
