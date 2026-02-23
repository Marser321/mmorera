import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { MetricsBar } from "@/components/sections/metrics-bar";
import { SystemsGrid } from "@/components/sections/systems-grid";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/sections/footer";
import { ChatWidget } from "@/components/interactive/chat-widget";

/**
 * Página principal — Landing Page B2B "Deep Space".
 * Composición de todas las secciones en orden de conversión.
 * Server Component (sin "use client").
 */
export default function HomePage() {
    return (
        <>
            <Navbar />
            <main id="contenido-principal">
                <HeroSection />
                <MetricsBar />
                <SystemsGrid />
                <PortfolioSection />
                <PricingSection />
                <WorkflowSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
            <ChatWidget />
        </>
    );
}
