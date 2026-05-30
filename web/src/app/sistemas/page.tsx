import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { RevealHeading } from '@/components/type/RevealHeading';

const GHLCRMOrbit = dynamic(() => import('@/components/animations/GHLCRMOrbit').then(mod => mod.GHLCRMOrbit));
const SistemasBlueprint = dynamic(() => import('@/components/portfolio-isolated/SistemasBlueprint').then(mod => mod.SistemasBlueprint));
const AppsBuildSection = dynamic(() => import('@/components/sections/AppsBuildSection').then(mod => mod.AppsBuildSection));
const SystemsServices = dynamic(() => import('@/components/sections/SystemsServices').then(mod => mod.SystemsServices));
const SystemsApplyCTA = dynamic(() => import('@/components/sections/SystemsApplyCTA').then(mod => mod.SystemsApplyCTA));
const CrossTrackBridge = dynamic(() => import('@/components/sections/CrossTrackBridge').then(mod => mod.CrossTrackBridge));

export const metadata: Metadata = {
    title: "CRM & GoHighLevel Systems | Mario Morera — Automation Architect",
    description: "GoHighLevel CRM systems, AI automation, lead flows, pipelines and dashboards for freelancers, sales teams and growing operations.",
};

export default function SystemsPage() {
    return (
        <main id="contenido-principal" className="pt-24 min-h-screen">
            {/* Hero de Sistemas */}
            <section className="container mx-auto px-4 py-12 md:py-16 flex flex-col items-center text-center">
                <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                    GoHighLevel + automatización IA
                </div>
                <RevealHeading
                    text="CRM operativo para conectar captación, seguimiento y ventas"
                    as="h1"
                    trigger="mount"
                    className="max-w-5xl font-heading text-4xl md:text-7xl font-bold tracking-tight text-white"
                />
                <p className="mt-6 max-w-3xl text-base md:text-xl text-white/58 leading-relaxed">
                    Uso GHL como base para ordenar leads, conversaciones, agenda, pipeline, automatizaciones y reporting. La IA acelera el sistema, pero el centro es un CRM que tu equipo pueda entender y usar todos los días.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    {["Lead management", "WhatsApp + email", "Calendario", "Pipeline", "Dashboards"].map((item) => (
                        <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/65"
                        >
                            {item}
                        </span>
                    ))}
                </div>
                <div className="mt-12 w-full">
                    <GHLCRMOrbit />
                </div>
            </section>

            {/* Blueprint operativo interactivo (reemplaza las secciones CRM) */}
            <SistemasBlueprint />

            {/* Apps a medida — el showcase de desarrollo */}
            <AppsBuildSection />

            {/* Servicios del track software (tech + ops) */}
            <SystemsServices />

            {/* Cierre: aplicar + puente al estudio */}
            <SystemsApplyCTA />
            <CrossTrackBridge to="design" />
        </main>
    );
}
