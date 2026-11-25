import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropuestaDocument } from "@/components/propuesta/PropuestaDocument";
import { obtenerPropuesta } from "@/lib/propuestaFuente";

/*
 * Propuesta a medida para un negocio: /p/<slug>. La escribe Claude con el botón
 * 📄 del bot (tabla `propuestas`) y n8n la sirve solo si está publicada. Se
 * arma en el servidor y se guarda 5 minutos. Privada por enlace: sin índice,
 * fuera del sitemap. Slug desconocido o sin publicar → not-found.tsx.
 */

export const revalidate = 300;

// Ninguna se arma al compilar: cada una se genera en la primera visita y queda guardada (ISR).
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

const SIN_INDICE: Metadata["robots"] = { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await obtenerPropuesta(slug).catch(() => null);
  if (!p) return { title: "Propuesta", robots: SIN_INDICE };

  const en = p.idioma === "en";
  const title = en ? `Proposal for ${p.negocio}` : `Propuesta para ${p.negocio}`;
  const description = p.situacion.length > 180 ? `${p.situacion.slice(0, 177).trimEnd()}…` : p.situacion;
  const image = { url: en ? "/og/sistemas-en.jpg" : "/og/sistemas-es.jpg", width: 1200, height: 630, alt: "Mario Morera" };
  return {
    title,
    description,
    robots: SIN_INDICE,
    openGraph: { type: "website", url: `/p/${p.slug}`, siteName: "Mario Morera", title: `${title} — Mario Morera`, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default async function PropuestaPage({ params }: Props) {
  const { slug } = await params;
  const propuesta = await obtenerPropuesta(slug);
  if (!propuesta) notFound();
  return <PropuestaDocument propuesta={propuesta} />;
}
