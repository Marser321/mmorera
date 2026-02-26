"use client";

import { useState } from "react";
import { Filter, FileText, BrainCircuit, Mail, Phone, Sparkles } from "lucide-react";
import { SkillLeadQualifier } from "./SkillLeadQualifier";
import { SkillProposalGenerator } from "./SkillProposalGenerator";
import { SkillStrictRAG } from "./SkillStrictRAG";
import { SkillColdOutbound } from "./SkillColdOutbound";
import { SkillVoiceAgent } from "./SkillVoiceAgent";
import { SkillOnboardingBot } from "./SkillOnboardingBot";
import { Users } from "lucide-react";

export function AILab() {
    const [activeTab, setActiveTab] = useState(0);

    const skills = [
        {
            id: "lead-qualifier",
            title: "Calificador de Leads",
            icon: <Filter className="w-4 h-4" />,
            component: <SkillLeadQualifier />,
        },
        {
            id: "proposal-gen",
            title: "Generador de Propuestas",
            icon: <FileText className="w-4 h-4" />,
            component: <SkillProposalGenerator />,
        },
        {
            id: "strict-rag",
            title: "RAG Corporativo",
            icon: <BrainCircuit className="w-4 h-4" />,
            component: <SkillStrictRAG />,
        },
        {
            id: "cold-outbound",
            title: "Prospección B2B",
            icon: <Mail className="w-4 h-4" />,
            component: <SkillColdOutbound />,
        },
        {
            id: "hr-onboarding",
            title: "HR & Onboarding",
            icon: <Users className="w-4 h-4" />,
            component: <SkillOnboardingBot />,
        },
        {
            id: "voice-agent",
            title: "Agente de Voz",
            icon: <Phone className="w-4 h-4" />,
            component: <SkillVoiceAgent />,
        }
    ];

    return (
        <section id="laboratorio-ia" className="py-20 md:py-32 relative bg-background overflow-hidden border-y border-white/5">
            {/* Background noise/mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.1)_0%,transparent_60%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        AILab_Interactivo
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight">
                        Experimenta la <br className="hidden sm:block" /> autonomía operativa.
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto px-2 md:px-0 font-medium">
                        No creas en simulaciones. Prueba las capacidades exactas de nuestros agentes de Inteligencia Artificial en tiempo real.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">
                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto pb-4 pt-1 md:pb-0 md:pt-0 md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 px-1 scrollbar-hide snap-x">
                        {skills.map((skill, index) => (
                            <button
                                key={skill.id}
                                onClick={() => setActiveTab(index)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm md:text-base font-semibold transition-all whitespace-nowrap snap-center shrink-0 ${activeTab === index
                                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105"
                                    : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {skill.icon}
                                {skill.title}
                            </button>
                        ))}
                    </div>

                    {/* Active Component Container */}
                    <div className="w-full mt-2 md:mt-6 bg-transparent rounded-3xl relative">
                        {skills[activeTab].component}
                    </div>
                </div>
            </div>
        </section>
    );
}
