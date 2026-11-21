import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RUBROS, RUBRO_IDS, type RubroId } from "@/data/demos";
import { DemoRubroExperience } from "@/components/demos/DemoRubroExperience";

export const dynamicParams = false;
export function generateStaticParams() {
  return RUBRO_IDS.map((rubro) => ({ rubro }));
}

const esRubro = (valor: string): valor is RubroId => (RUBRO_IDS as string[]).includes(valor);

// Fuera de los buscadores mientras las demos se presentan a mano (socios y prospectos).
export async function generateMetadata({ params }: { params: Promise<{ rubro: string }> }): Promise<Metadata> {
  const { rubro } = await params;
  if (!esRubro(rubro)) return {};
  const data = RUBROS[rubro];
  const title = `Demo para ${data.etiqueta.toLowerCase()}`;
  return {
    title,
    description: data.bajada,
    robots: { index: false, follow: false },
    alternates: { canonical: `/demos/${rubro}` },
    openGraph: {
      type: "website",
      url: `/demos/${rubro}`,
      title: `${title} — Mario Morera`,
      description: data.bajada,
      images: [{ url: "/demos/gimnasios/og.jpg", width: 1200, height: 630, alt: data.titulo }],
    },
    twitter: { card: "summary_large_image", title, description: data.bajada, images: ["/demos/gimnasios/og.jpg"] },
  };
}

export default async function DemoRubroPage({ params }: { params: Promise<{ rubro: string }> }) {
  const { rubro } = await params;
  if (!esRubro(rubro)) notFound();
  return <DemoRubroExperience rubro={RUBROS[rubro]} />;
}
