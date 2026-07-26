import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portafolio Interactivo | Mario Morera",
    description: "Explorá el portafolio interactivo de Mario Morera. Visualizá animaciones cinéticas, métricas del Dev Mode y blueprints de automatizaciones.",
    // Ruta de desarrollo/previsualización: nunca indexable.
    robots: { index: false, follow: false },
};

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
