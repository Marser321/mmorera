import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RUBROS } from "@/data/demos";
import { DemoRubroExperience } from "@/components/demos/DemoRubroExperience";
import { negocioDeRuta } from "@/lib/negocioDeRuta";

/*
 * Enlace personal y limpio para cada clínica o consultorio dental:
 * /clinica/dental-norte. Es la demo de /demos/consulta (Oficio con el rubro de
 * clínica), con el nombre del negocio en pantalla y en la vista previa del
 * enlace. La visita se registra con ese origen, igual que /demo/<negocio>.
 */

export async function generateMetadata({ params }: { params: Promise<{ negocio: string }> }): Promise<Metadata> {
  const { negocio } = await params;
  const datos = negocioDeRuta(negocio);
  if (!datos) return {};
  const rubro = RUBROS.consulta;
  const title = `Demo para ${datos.nombre}`;
  return {
    title,
    description: rubro.bajada,
    robots: { index: false, follow: false },
    alternates: { canonical: "/demos/consulta" },
    openGraph: {
      type: "website",
      url: `/clinica/${datos.slug}`,
      title: `${title} — Mario Morera`,
      description: rubro.bajada,
      images: [{ url: "/demos/clinicas/og.jpg", width: 1200, height: 630, alt: rubro.titulo }],
    },
    twitter: { card: "summary_large_image", title, description: rubro.bajada, images: ["/demos/clinicas/og.jpg"] },
  };
}

export default async function ClinicaNegocioPage({ params }: { params: Promise<{ negocio: string }> }) {
  const { negocio } = await params;
  const datos = negocioDeRuta(negocio);
  if (!datos) notFound();
  return <DemoRubroExperience rubro={RUBROS.consulta} negocio={datos} />;
}
