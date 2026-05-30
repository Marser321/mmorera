import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const PortfolioGrid = dynamic(() => import('@/components/portfolio-isolated/PortfolioGrid').then(mod => mod.PortfolioGrid));
const MetricsShowcase = dynamic(() => import('@/components/sections/metrics-showcase').then(mod => mod.MetricsShowcase));
const NotebookCases = dynamic(() => import('@/components/sections/notebook-cases').then(mod => mod.NotebookCases));

export const metadata: Metadata = {
    title: "Case Studies | Mario Morera — AI & Automation Impact",
    description: "Real-world case studies demonstrating measurable ROI: AI-powered lead generation, full-stack platforms, and automation systems deployed for B2B clients.",
};

/**
 * Casos de Éxito — PortfolioGrid (doble vista Media Pool / VS Code) + métricas + notebook.
 */
export default function CaseStudiesPage() {
    return (
        <main id="contenido-principal" className="pt-24 min-h-screen">
            <PortfolioGrid />
            <MetricsShowcase />
            <NotebookCases />
        </main>
    );
}
