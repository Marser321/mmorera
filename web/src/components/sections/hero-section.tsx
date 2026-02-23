import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

const metricas = [
    { valor: "+80%", label: "Leads cualificados" },
    { valor: "<5 min", label: "Tiempo de respuesta" },
    { valor: "-35%", label: "Costos operativos" },
] as const;

/**
 * HeroSection — sección principal orientada a conversión B2B.
 * Basado en la narrativa de Plan.md y copy de Copys.md.
 */
export function HeroSection() {
    return (
        <section
            className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
            aria-labelledby="hero-heading"
        >
            {/* Fondo atmosférico */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-[100px]" />
            </div>

            <Container as="div" className="flex flex-col items-center text-center gap-8">
                {/* Overline */}
                <Badge variant="default" className="uppercase tracking-wider animate-float">
                    IA sin humo · Resultados medibles
                </Badge>

                {/* Titular principal */}
                <h1
                    id="hero-heading"
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.1]"
                >
                    Aumentá tu{" "}
                    <span className="text-gradient">productividad y ventas</span>{" "}
                    sin aumentar tu plantilla
                </h1>

                {/* Subtítulo */}
                <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                    Sistemas de automatización y agentes de IA + sprints de implementación
                    + retainer de optimización. Todo conectado a métricas reales.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button variant="shimmer" size="lg" asChild>
                        <a href="#auditoria">
                            Solicitar Auditoría de IA
                            <ArrowRight className="ml-1" />
                        </a>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <a href="#sistemas">
                            <Eye className="mr-1" />
                            Ver Sistemas
                        </a>
                    </Button>
                </div>

                {/* Métricas rápidas — prueba social */}
                <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border/30 w-full max-w-lg">
                    {metricas.map((m) => (
                        <div key={m.label} className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-bold text-gradient sm:text-3xl">
                                {m.valor}
                            </span>
                            <span className="text-xs text-muted-foreground sm:text-sm">
                                {m.label}
                            </span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
