import { Container } from "@/components/ui/container";

const kpis = [
    { valor: "+80%", label: "Leads cualificados", fuente: "estimado" },
    { valor: "<5 min", label: "Tiempo de respuesta", fuente: "benchmark" },
    { valor: "-35%", label: "Costos operativos", fuente: "estimado" },
    { valor: "21×", label: "Más probabilidad de cierre", fuente: "estudio B2B" },
] as const;

/**
 * MetricsBar — barra de KPIs con datos de Ancla.md y Copys.md.
 * Diseño horizontal con separadores y fondo sutil.
 */
export function MetricsBar() {
    return (
        <section
            id="resultados"
            className="py-12 border-y border-border/20 bg-card/20"
            aria-label="Indicadores clave de rendimiento"
        >
            <Container>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-border/20">
                    {kpis.map((kpi) => (
                        <div
                            key={kpi.label}
                            className="flex flex-col items-center text-center gap-1 py-2"
                        >
                            <span className="text-3xl font-bold text-gradient sm:text-4xl">
                                {kpi.valor}
                            </span>
                            <span className="text-sm text-foreground font-medium">
                                {kpi.label}
                            </span>
                            <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
                                {kpi.fuente}
                            </span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
