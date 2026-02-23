import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/**
 * CTASection — llamada a la acción final con fondo gradiente atmosférico.
 * "Solicita tu Auditoría de IA gratuita" como copy central.
 */
export function CTASection() {
    return (
        <section
            id="auditoria"
            className="py-20 sm:py-28 relative overflow-hidden"
            aria-labelledby="cta-heading"
        >
            {/* Fondo gradiente atmosférico */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-primary/8 blur-[150px]" />
                <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-accent/6 blur-[120px]" />
            </div>

            <Container
                maxWidth="narrow"
                className="text-center flex flex-col items-center gap-6"
            >
                <div
                    className="flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-2"
                    aria-hidden="true"
                >
                    <Sparkles className="size-7" />
                </div>

                <h2
                    id="cta-heading"
                    className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                >
                    Solicita tu{" "}
                    <span className="text-gradient">Auditoría de IA</span>{" "}
                    gratuita
                </h2>

                <p className="max-w-xl text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Mapeamos tus procesos actuales, identificamos las oportunidades de
                    mayor impacto y te entregamos un plan de acción concreto.
                    Sin compromiso, sin humo.
                </p>

                {/* Entregables */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md w-full text-left mt-2">
                    {[
                        "Mapa de procesos as-is",
                        "Backlog priorizado",
                        "Blueprint del sistema",
                        "Estimación de ROI",
                    ].map((item) => (
                        <div
                            key={item}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                            <span
                                className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0"
                                aria-hidden="true"
                            />
                            {item}
                        </div>
                    ))}
                </div>

                <Button variant="shimmer" size="lg" className="mt-4" asChild>
                    <a href="mailto:hola@mmore.agency">
                        Agendar Auditoría
                        <ArrowRight className="ml-1" />
                    </a>
                </Button>

                <p className="text-xs text-muted-foreground">
                    Respuesta en menos de 24 horas · Sin compromiso
                </p>
            </Container>
        </section>
    );
}
