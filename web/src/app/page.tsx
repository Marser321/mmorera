import { HeroPortfolio } from "@/components/portfolio-isolated/HeroPortfolio";
import dynamic from 'next/dynamic';

const AdaptiveApproach = dynamic(() => import('@/components/sections/AdaptiveApproach').then(mod => mod.AdaptiveApproach));
const PhilosophySection = dynamic(() => import('@/components/sections/PhilosophySection').then(mod => mod.PhilosophySection));
const TrustedByStrip = dynamic(() => import('@/components/sections/TrustedByStrip').then(mod => mod.TrustedByStrip));
const ContactForm = dynamic(() => import('@/components/sections/contact-form').then(mod => mod.ContactForm));

/**
 * Home — Hero de tres tracks (crear/construir/escalar) de la página paralela,
 * seguido del enfoque, la filosofía, el stack y el contacto.
 */
export default function HomePage() {
    return (
        <main id="contenido-principal">
            <HeroPortfolio />
            <AdaptiveApproach />
            <PhilosophySection />
            <TrustedByStrip />
            <ContactForm />
        </main>
    );
}
