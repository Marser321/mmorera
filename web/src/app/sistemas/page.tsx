import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const ServicesCatalog = dynamic(() => import('@/components/sections/services-catalog').then(mod => mod.ServicesCatalog));
const CRMScaleSection = dynamic(() => import('@/components/sections/CRMScaleSection').then(mod => mod.CRMScaleSection));
const GHLCRMOrbit = dynamic(() => import('@/components/animations/GHLCRMOrbit').then(mod => mod.GHLCRMOrbit));
const CRMFlowMap = dynamic(() => import('@/components/animations/CRMFlowMap').then(mod => mod.CRMFlowMap));
const CRMValueProposition = dynamic(() => import('@/components/sections/CRMValueProposition').then(mod => mod.CRMValueProposition));
const CRMBeforeAfter = dynamic(() => import('@/components/sections/CRMBeforeAfter').then(mod => mod.CRMBeforeAfter));

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
                <h1 className="max-w-5xl font-heading text-4xl md:text-7xl font-bold tracking-tight text-white">
                    CRM operativo para conectar captación, seguimiento y ventas
                </h1>
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

            {/* Secciones de valor CRM — contexto de lo que se puede lograr */}
            <CRMValueProposition />
            <CRMBeforeAfter />
            <CRMScaleSection />
            <CRMFlowMap />

            {/* Secciones de servicios */}
            <ServicesCatalog />
        </main>
    );
}
