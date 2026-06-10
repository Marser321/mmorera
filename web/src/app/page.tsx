import { HeroPortfolio } from "@/components/portfolio-isolated/HeroPortfolio";
import dynamic from 'next/dynamic';
import type { Metadata } from "next";

const AdaptiveApproach = dynamic(() => import('@/components/sections/AdaptiveApproach').then(mod => mod.AdaptiveApproach));
const PhilosophySection = dynamic(() => import('@/components/sections/PhilosophySection').then(mod => mod.PhilosophySection));
const TrustedByStrip = dynamic(() => import('@/components/sections/TrustedByStrip').then(mod => mod.TrustedByStrip));
const ContactForm = dynamic(() => import('@/components/sections/contact-form').then(mod => mod.ContactForm));

export const metadata: Metadata = {
    title: "Nexus.AI | Sistemas Operativos de IA y Automatización B2B",
    description: "Construimos sistemas operativos de IA y automatizaciones de alto rendimiento para escalar tus ventas y optimizar operaciones sin aumentar tu nómina.",
};

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
