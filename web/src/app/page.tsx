import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
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
