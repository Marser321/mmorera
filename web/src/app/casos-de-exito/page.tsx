import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const PortfolioSection = dynamic(() => import('@/components/sections/portfolio-section').then(mod => mod.PortfolioSection));
const MetricsShowcase = dynamic(() => import('@/components/sections/metrics-showcase').then(mod => mod.MetricsShowcase));
const NotebookCases = dynamic(() => import('@/components/sections/notebook-cases').then(mod => mod.NotebookCases));

export const metadata: Metadata = {
    title: "Case Studies | Mario Morera — AI & Automation Impact",
    description: "Real-world case studies demonstrating measurable ROI: AI-powered lead generation, full-stack platforms, and automation systems deployed for B2B clients.",
};

/**
 * Casos de Éxito — La evidencia irrefutable para reclutadores y USCIS (EB-2 NIW).
 * Estructura: Problema → Solución Arquitectónica → Resultado (Métricas).
 */
export default function CaseStudiesPage() {
    return (
        <main id="contenido-principal" className="pt-24 min-h-screen">
            {/* Hero de la sección */}
            <section className="container mx-auto px-4 pt-12 pb-8 text-center">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                    Evidence-Based Results
                </p>
                <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                    Case <span className="text-gradient">Studies</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                    Each project follows a rigorous <span className="text-white font-medium">Problem → Solution → Result</span> framework. 
                    Real metrics, real code, real impact.
                </p>
            </section>

            <PortfolioSection />
            <MetricsShowcase />
            <NotebookCases />
        </main>
    );
}
