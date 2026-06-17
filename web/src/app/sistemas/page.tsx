import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { RevealHeading } from '@/components/type/RevealHeading';
import { SystemsHUDHeader } from '@/components/sections/SystemsHUDHeader';
import { BackgroundVideo } from '@/components/shared/BackgroundVideo';
import { DesktopOnlyGHLCRMOrbit } from '@/components/sections/DesktopOnlyGHLCRMOrbit';

const SistemasBlueprint = dynamic(() => import('@/components/portfolio-isolated/SistemasBlueprint').then(mod => mod.SistemasBlueprint));
const AppsBuildSection = dynamic(() => import('@/components/sections/AppsBuildSection').then(mod => mod.AppsBuildSection));
const SystemsServices = dynamic(() => import('@/components/sections/SystemsServices').then(mod => mod.SystemsServices));
const SystemsApplyCTA = dynamic(() => import('@/components/sections/SystemsApplyCTA').then(mod => mod.SystemsApplyCTA));
const CrossTrackBridge = dynamic(() => import('@/components/sections/CrossTrackBridge').then(mod => mod.CrossTrackBridge));

const mobileCrmSummary = [
    { label: 'Captación', value: 'Leads y WhatsApp ordenados' },
    { label: 'Seguimiento', value: 'Agenda, pipeline y recordatorios' },
    { label: 'Reporting', value: 'Métricas simples para decidir' },
] as const;

export const metadata: Metadata = {
    title: "CRM & GoHighLevel Systems | Mario Morera — Automation Architect",
    description: "GoHighLevel CRM systems, AI automation, lead flows, pipelines and dashboards for freelancers, sales teams and growing operations.",
};

export default function SystemsPage() {
    return (
        <main id="contenido-principal" className="pt-24 min-h-screen">
            {/* Hero de Sistemas */}
            <section className="relative overflow-hidden py-10 md:py-16">
                {/* Video de fondo: infografía CRM */}
                <BackgroundVideo
                    src="/videos/crm-infographic.mp4"
                    poster="/videos/posters/crm-infographic.jpg"
                    intensity="cinematic"
                    scrim="center"
                    tint="cyan"
                />
                <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
                    <SystemsHUDHeader />
                    <RevealHeading
                        text="CRM operativo para conectar captación, seguimiento y ventas"
                        as="h1"
                        trigger="mount"
                        className="max-w-5xl font-heading text-4xl md:text-7xl font-bold tracking-tight text-white"
                    />
                    <p className="mt-5 max-w-3xl text-sm md:mt-6 md:text-xl text-white/58 leading-relaxed">
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
                    <div className="mt-8 grid w-full max-w-md gap-3 md:hidden">
                        {mobileCrmSummary.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-white/10 bg-black/45 p-4 text-left backdrop-blur-md">
                                <div className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-emerald-300/80">
                                    {item.label}
                                </div>
                                <div className="mt-1 text-sm font-bold text-white">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 hidden w-full md:block">
                        <DesktopOnlyGHLCRMOrbit />
                    </div>
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
