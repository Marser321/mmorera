import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import dynamic from 'next/dynamic';

const PhilosophySection = dynamic(() => import('@/components/sections/PhilosophySection').then(mod => mod.PhilosophySection));
const MetricsShowcase = dynamic(() => import('@/components/sections/metrics-showcase').then(mod => mod.MetricsShowcase));
const TrustedByStrip = dynamic(() => import('@/components/sections/TrustedByStrip').then(mod => mod.TrustedByStrip));
const NotebookCases = dynamic(() => import('@/components/sections/notebook-cases').then(mod => mod.NotebookCases));
const AuditFunnel = dynamic(() => import('@/components/sections/AuditFunnel').then(mod => mod.AuditFunnel));
const AutonomousEcosystemBanner = dynamic(() => import('@/components/sections/AutonomousEcosystemBanner').then(mod => mod.AutonomousEcosystemBanner));
const ProblemSolution = dynamic(() => import('@/components/sections/problem-solution').then(mod => mod.ProblemSolution));
const ServicesCatalog = dynamic(() => import('@/components/sections/services-catalog').then(mod => mod.ServicesCatalog));
const PricingSection = dynamic(() => import('@/components/sections/pricing-section').then(mod => mod.PricingSection));
const PortfolioSection = dynamic(() => import('@/components/sections/portfolio-section').then(mod => mod.PortfolioSection));
const WorkflowSection = dynamic(() => import('@/components/sections/workflow-section').then(mod => mod.WorkflowSection));
const ContactForm = dynamic(() => import('@/components/sections/contact-form').then(mod => mod.ContactForm));
const FAQSection = dynamic(() => import('@/components/sections/FAQSection').then(mod => mod.FAQSection));
const Footer = dynamic(() => import('@/components/sections/footer').then(mod => mod.Footer));
const ChatWidgetLoader = dynamic(() => import('@/components/interactive/chat-widget-loader').then(mod => mod.ChatWidgetLoader));
const KnowledgeCenter = dynamic(() => import('@/components/sections/knowledge-center').then(mod => mod.KnowledgeCenter));
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
                <AutonomousEcosystemBanner />
                <ProblemSolution />
                <ServicesCatalog />
                <PricingSection />
                <PortfolioSection />
                <WorkflowSection />
                <KnowledgeCenter />
                <FAQSection />
                <ContactForm />
            </main>
            <Footer />
            <ChatWidgetLoader />
        </>
    );
}
