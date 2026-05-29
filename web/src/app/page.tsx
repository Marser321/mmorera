import { HeroSection } from "@/components/sections/hero-section";
import dynamic from 'next/dynamic';

const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => mod.AboutSection));
const PhilosophySection = dynamic(() => import('@/components/sections/PhilosophySection').then(mod => mod.PhilosophySection));
const AdaptiveApproach = dynamic(() => import('@/components/sections/AdaptiveApproach').then(mod => mod.AdaptiveApproach));
const TrustedByStrip = dynamic(() => import('@/components/sections/TrustedByStrip').then(mod => mod.TrustedByStrip));
const ContactForm = dynamic(() => import('@/components/sections/contact-form').then(mod => mod.ContactForm));

/**
 * Página principal — Presentación Personal.
 */
export default function HomePage() {
    return (
        <main id="contenido-principal">
            <HeroSection />
            <AboutSection />
            <AdaptiveApproach />
            <PhilosophySection />
            <TrustedByStrip />
            <ContactForm />
        </main>
    );
}
