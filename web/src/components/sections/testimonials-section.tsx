import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonio {
    nombre: string;
    cargo: string;
    empresa: string;
    quote: string;
    resultado: string;
    iniciales: string;
}

const testimonios: Testimonio[] = [
    {
        nombre: "Felipe",
        cargo: "CMO",
        empresa: "TechSolutions",
        quote:
            "Nuestro seguimiento era lento. Con la asesoría de IA respondemos leads en menos de 10 minutos (antes tardábamos días) y aumentamos clientes un 40% en 3 meses.",
        resultado: "Conversiones +40%",
        iniciales: "FT",
    },
    {
        nombre: "María",
        cargo: "Directora de Marketing",
        empresa: "Innotech",
        quote:
            "Equilibramos la carga de trabajo con un equipo externo. Tras automatizar campañas, vimos ~+60% leads nuevos sin aumentar nómina, y el CAC bajó un 20%.",
        resultado: "+60% leads, –20% CAC",
        iniciales: "MI",
    },
];

/**
 * TestimonialsSection — testimonios de Ancla.md.
 * Cards con glassmorphism, iniciales avatar, y resultado destacado.
 */
export function TestimonialsSection() {
    return (
        <section
            id="testimonios"
            className="py-20 sm:py-28"
            aria-labelledby="testimonios-heading"
        >
            <Container>
                <SectionHeading
                    id="testimonios-heading"
                    overline="Testimonios"
                    title="Lo que dicen nuestros clientes"
                    description="Resultados reales de equipos que decidieron automatizar su marketing con IA."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {testimonios.map((t) => (
                        <Card key={t.nombre} className="relative overflow-hidden">
                            <CardContent className="p-6 sm:p-8">
                                {/* Ícono quote decorativo */}
                                <Quote
                                    className="absolute top-4 right-4 size-8 text-primary/10"
                                    aria-hidden="true"
                                />

                                {/* Quote */}
                                <blockquote className="text-sm text-foreground leading-relaxed mb-6 italic">
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>

                                {/* Resultado destacado */}
                                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                                    {t.resultado}
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    {/* Avatar con iniciales */}
                                    <div
                                        className="flex items-center justify-center size-10 rounded-full bg-secondary text-foreground font-semibold text-sm"
                                        aria-hidden="true"
                                    >
                                        {t.iniciales}
                                    </div>
                                    <div>
                                        <cite className="text-sm font-semibold text-foreground not-italic block">
                                            {t.nombre}
                                        </cite>
                                        <span className="text-xs text-muted-foreground">
                                            {t.cargo}, {t.empresa}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
