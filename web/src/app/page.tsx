import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { MetricsShowcase } from "@/components/sections/metrics-showcase";
import { NotebookCases } from "@/components/sections/notebook-cases";
import { AuditFunnel } from "@/components/sections/AuditFunnel";
import { AILab } from "@/components/sections/AILab";
import { ConversionEngine } from "@/components/sections/ConversionEngine";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { ServicesCatalog } from "@/components/sections/services-catalog";
import { Automations } from "@/components/sections/automations";
import { ROICalculator } from "@/components/sections/roi-calculator";
import { PricingSection } from "@/components/sections/pricing-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactForm } from "@/components/sections/contact-form";
import { Footer } from "@/components/sections/footer";
import { ChatWidget } from "@/components/interactive/chat-widget";

// Forzar renderizado dinámico para evitar error de pre-renderizado estático
export const dynamic = 'force-dynamic';
/**
 * Página principal — Landing Page fusionada "Deep Space" + "Socialmedia".
 * Combina las mejores secciones de ambos sitios en un flujo de conversión óptimo.
 * Server Component (sin "use client").
 */
export default function HomePage() {
    return (
        <>
            <Navbar />
            <main id="contenido-principal">
                <HeroSection />
                <MetricsShowcase />
                <NotebookCases />
                <AuditFunnel />
                <AILab />
                <ConversionEngine />
                <ProblemSolution />
                <ServicesCatalog />
                <Automations />
                <ROICalculator />
                <PricingSection />
                <PortfolioSection />
                <WorkflowSection />
                <TestimonialsSection />
                <ContactForm />
            </main>
            <Footer />
            <ChatWidget />
        </>
    );
}
