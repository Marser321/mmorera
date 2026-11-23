import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RUBROS } from "@/data/demos";
import { DemoRubroExperience } from "@/components/demos/DemoRubroExperience";
import { negocioDeRuta } from "@/lib/negocioDeRuta";

/*
 * Enlace personal y limpio para cada gimnasio o estudio: /demo/city-fitness.
 * Es la misma demo de /demos/gimnasios, con el nombre del negocio en pantalla y
 * en la vista previa del enlace. La visita se registra con ese origen, igual
 * que antes con `?de=`, pero sin parámetros raros en la dirección.
 */

export async function generateMetadata({ params }: { params: Promise<{ negocio: string }> }): Promise<Metadata> {
  const { negocio } = await params;
  const datos = negocioDeRuta(negocio);
  if (!datos) return {};
  const rubro = RUBROS.gimnasios;
  const title = `Demo para ${datos.nombre}`;
  return {
    title,
    description: rubro.bajada,
    robots: { index: false, follow: false },
    alternates: { canonical: "/demos/gimnasios" },
    openGraph: {
      type: "website",
      url: `/demo/${datos.slug}`,
      title: `${title} — Mario Morera`,
      description: rubro.bajada,
      images: [{ url: "/demos/gimnasios/og.jpg", width: 1200, height: 630, alt: rubro.titulo }],
    },
    twitter: { card: "summary_large_image", title, description: rubro.bajada, images: ["/demos/gimnasios/og.jpg"] },
  };
}

export default async function DemoNegocioPage({ params }: { params: Promise<{ negocio: string }> }) {
  const { negocio } = await params;
  const datos = negocioDeRuta(negocio);
  if (!datos) notFound();
  return <DemoRubroExperience rubro={RUBROS.gimnasios} negocio={datos} />;
}
