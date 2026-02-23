import {
    Globe,
    Zap,
    BarChart3,
    MessageSquare,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Sistema {
    icono: LucideIcon;
    titulo: string;
    descripcion: string;
    features: string[];
    badge: string;
}

const sistemas: Sistema[] = [
    {
        icono: Globe,
        titulo: "Sistema de Captación y Conversión",
        descripcion:
            "Landings optimizadas + tracking + tests A/B + handoff a CRM. Infraestructura web que convierte visitantes en leads calificados.",
        features: [
            "Landing pages de alta conversión",
            "Tracking de conversiones (GA4 + UTMs)",
            "Tests A/B automatizados",
            "Integración CRM directa",
        ],
        badge: "Sprint · 2–4 sem",
    },
    {
        icono: Zap,
        titulo: "Sistema de Follow-up Automático",
        descripcion:
            "Respuesta en menos de 5 minutos. Enriquecimiento, ruteo, secuencias y SLA de respuesta para que ningún lead se enfríe.",
        features: [
            "Lead scoring predictivo",
            "Secuencias de email/WhatsApp",
            "Ruteo inteligente al equipo",
            "Alertas SLA en tiempo real",
        ],
        badge: "Retainer · Continuo",
    },
    {
        icono: BarChart3,
        titulo: "Sistema de Reporting Ejecutivo",
        descripcion:
            "Dashboard con resumen semanal, alertas de anomalías e insights accionables. Toda la data que necesitás para tomar decisiones.",
        features: [
            "Dashboards personalizados",
            "Alertas automáticas de anomalías",
            "Reportes semanales con IA",
            "ROI por canal y campaña",
        ],
        badge: "Setup · 2 sem",
    },
    {
        icono: MessageSquare,
        titulo: "Sistema de Creatividades e IA",
        descripcion:
            "Generación e iteración de anuncios, repositorio de hooks, y edición de video. Una fábrica de contenido impulsada por IA.",
        features: [
            "Generación de copy con IA",
            "Video repurposing engine",
            "Hooks y creatividades iterativas",
            "Testing de variantes",
        ],
        badge: "Sprint · 3 sem",
    },
];

/**
 * SystemsGrid — catálogo de "Sistemas" productizados.
 * Grid responsivo con Cards glassmorphism y glow hover.
 */
export function SystemsGrid() {
    return (
        <section
            id="sistemas"
            className="py-20 sm:py-28"
            aria-labelledby="sistemas-heading"
        >
            <Container>
                <SectionHeading
                    id="sistemas-heading"
                    overline="Nuestros Sistemas"
                    title="Infraestructura que convierte"
                    description="Cada sistema está diseñado para resolver un problema específico y generar resultados medibles. No vendemos servicios sueltos — vendemos máquinas operativas."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sistemas.map((sistema) => {
                        const Icono = sistema.icono;
                        return (
                            <Card key={sistema.titulo} className="glow-border flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                                            <Icono className="size-5" />
                                        </div>
                                        <Badge variant="accent" className="text-[0.6rem]">
                                            {sistema.badge}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{sistema.titulo}</CardTitle>
                                    <CardDescription>{sistema.descripcion}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <ul
                                        className="space-y-2 text-sm text-muted-foreground"
                                        role="list"
                                    >
                                        {sistema.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2">
                                                <span
                                                    className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0"
                                                    aria-hidden="true"
                                                />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button variant="ghost" size="sm" className="ml-auto" asChild>
                                        <a href="#auditoria">
                                            Ver detalles
                                            <ArrowRight className="ml-1 size-3.5" />
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
