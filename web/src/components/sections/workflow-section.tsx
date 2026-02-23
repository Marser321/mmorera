import { Search, Rocket, RefreshCcw, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

interface PasoWorkflow {
    icono: React.ElementType;
    numero: string;
    titulo: string;
    descripcion: string;
    items: string[];
    color: string;
}

const pasos: PasoWorkflow[] = [
    {
        icono: Search,
        numero: "01",
        titulo: "Diagnóstico",
        descripcion: "Entendemos tu operación actual y encontramos los puntos de mayor impacto.",
        items: ["Mapa de procesos", "Auditoría de datos y tracking", "Backlog priorizado"],
        color: "from-primary/20 to-primary/5",
    },
    {
        icono: Rocket,
        numero: "02",
        titulo: "Sprint de Implementación",
        descripcion: "Construimos e integramos los sistemas en 2–4 semanas con entregables claros.",
        items: ["Automatizaciones + agentes", "QA + validaciones", "KPIs y dashboard"],
        color: "from-accent/20 to-accent/5",
    },
    {
        icono: RefreshCcw,
        numero: "03",
        titulo: "Retainer de Optimización",
        descripcion: "Optimización continua con testing, nuevos casos de uso y reportes ejecutivos.",
        items: ["Test y mejora continua", "Nuevos casos de uso", "Reportes ejecutivos"],
        color: "from-primary/15 to-accent/10",
    },
];

/**
 * WorkflowSection — visualización del pipeline Diagnóstico → Sprint → Retainer.
 * CSS puro (sin Mermaid) para evitar issues SSR. Mobile: vertical, Desktop: horizontal.
 */
export function WorkflowSection() {
    return (
        <section
            id="proceso"
            className="py-20 sm:py-28 relative"
            aria-labelledby="proceso-heading"
        >
            {/* Glow de fondo */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[150px]" />
            </div>

            <Container>
                <SectionHeading
                    id="proceso-heading"
                    overline="Nuestro Proceso"
                    title="De diagnóstico a resultados en semanas"
                    description="Un modelo claro y predecible: sabés exactamente qué comprás, en cuánto tiempo y qué resultado esperás."
                />

                {/* Timeline */}
                <div className="relative">
                    {/* Línea conectora — Desktop */}
                    <div
                        className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
                        aria-hidden="true"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
                        {pasos.map((paso, index) => {
                            const Icono = paso.icono;
                            return (
                                <div key={paso.titulo} className="relative group">
                                    {/* Conector vertical — Mobile */}
                                    {index < pasos.length - 1 && (
                                        <div
                                            className="lg:hidden absolute left-6 top-full w-px h-8 bg-gradient-to-b from-border to-transparent"
                                            aria-hidden="true"
                                        />
                                    )}

                                    <div
                                        className={`rounded-xl border border-border/30 bg-gradient-to-br ${paso.color} p-6 transition-all duration-400 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5`}
                                    >
                                        {/* Número y flecha */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center size-12 rounded-xl bg-card/80 border border-border/30 text-primary">
                                                    <Icono className="size-5" />
                                                </div>
                                                <span className="text-xs font-mono text-muted-foreground tracking-widest">
                                                    PASO {paso.numero}
                                                </span>
                                            </div>
                                            {index < pasos.length - 1 && (
                                                <ArrowRight
                                                    className="hidden lg:block size-4 text-muted-foreground/50 group-hover:text-primary transition-colors"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </div>

                                        <h3 className="text-lg font-semibold text-foreground mb-2">
                                            {paso.titulo}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                            {paso.descripcion}
                                        </p>

                                        <ul className="space-y-1.5" role="list">
                                            {paso.items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                                >
                                                    <span
                                                        className="size-1 rounded-full bg-primary/60"
                                                        aria-hidden="true"
                                                    />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
