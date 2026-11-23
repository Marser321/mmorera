import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/premium/CaseStudy";
import { UnderTheHood } from "@/components/premium/UnderTheHood";
import { RegistroVisita } from "@/components/demos/RegistroVisita";
import { hasArchitecture } from "@/data/architecture/registry";
import { getProjectCase } from "@/data/projectCases";
import { negocioDeRuta } from "@/lib/negocioDeRuta";

/*
 * Enlace personal y limpio para cada negocio al que se le ofrece Oficio:
 * /oficio/la-barberia. Muestra el caso de Oficio con el nombre del negocio en la
 * vista previa y registra la visita con ese origen (como /demo/<negocio>).
 */

export async function generateMetadata({ params }: { params: Promise<{ negocio: string }> }): Promise<Metadata> {
  const { negocio } = await params;
  const datos = negocioDeRuta(negocio);
  const project = getProjectCase("oficio");
  if (!datos || !project) return {};
  const title = `Oficio para ${datos.nombre}`;
  const description = "Agenda y citas online, clientes, caja, ventas, comisiones del equipo y tienda, con la marca de cada negocio. Cada uno prende solo lo que usa.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: "/casos-de-exito/oficio" },
    openGraph: {
      type: "website",
      url: `/oficio/${datos.slug}`,
      title: `${title} — Mario Morera`,
      description,
      images: [{ url: "/oficio/og.jpg", width: 1200, height: 630, alt: "Agenda de Oficio con turnos del día" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/oficio/og.jpg"] },
  };
}

export default async function OficioNegocioPage({ params }: { params: Promise<{ negocio: string }> }) {
  const { negocio } = await params;
  const datos = negocioDeRuta(negocio);
  const project = getProjectCase("oficio");
  if (!datos || !project) notFound();
  return (
    <>
      <RegistroVisita pagina="/demos/oficio" de={datos.slug} />
      <CaseStudy project={project} underTheHood={hasArchitecture("oficio") ? <UnderTheHood slug="oficio" language="es" brandSlug="oficio" /> : null} />
    </>
  );
}
