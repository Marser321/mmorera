import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { MetricsShowcase } from "@/components/sections/metrics-showcase";
import { TrustedByStrip } from "@/components/sections/TrustedByStrip";
import { NotebookCases } from "@/components/sections/notebook-cases";
import { AuditFunnel } from "@/components/sections/AuditFunnel";
import { AILab } from "@/components/sections/AILab";
import { ConversionEngine } from "@/components/sections/ConversionEngine";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { ServicesCatalog } from "@/components/sections/services-catalog";
import { Automations } from "@/components/sections/automations";
import { PricingSection } from "@/components/sections/pricing-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import { ContactForm } from "@/components/sections/contact-form";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/footer";
import { ChatWidgetLoader } from "@/components/interactive/chat-widget-loader";


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
                <PhilosophySection />
                <TrustedByStrip />
                <MetricsShowcase />
                <NotebookCases />
                <AuditFunnel />
                <AILab />
                <ConversionEngine />
                <ProblemSolution />
                <ServicesCatalog />
                <Automations />
                <PricingSection />
                <PortfolioSection />
                <WorkflowSection />
                <ComparisonTable />
                <FAQSection />
                <ContactForm />
            </main>
            <Footer />
            <ChatWidgetLoader />
        </>
    );
}
