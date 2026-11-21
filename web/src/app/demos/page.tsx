import type { Metadata } from "next";
import { DemosPortada } from "@/components/demos/DemosPortada";

const description = "Las apps que construyo para gimnasios y consultas, para probar aquí mismo con datos de ejemplo.";

export const metadata: Metadata = {
  title: "Demos",
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/demos" },
  openGraph: {
    type: "website",
    url: "/demos",
    title: "Demos — Mario Morera",
    description,
    images: [{ url: "/demos/gimnasios/og.jpg", width: 1200, height: 630, alt: "La casa, en cada pantalla" }],
  },
  twitter: { card: "summary_large_image", title: "Demos — Mario Morera", description, images: ["/demos/gimnasios/og.jpg"] },
};

export default function DemosPage() {
  return <DemosPortada />;
}
