import { GraduationCap, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

interface PasoWorkflow {
    icono: React.ElementType;
    numero: string;
    titulo: string;
    descripcion: string;
    items: string[];
}

const pasos: PasoWorkflow[] = [
    {
        icono: GraduationCap,
        numero: "01",
        titulo: "Capacitamos a tu equipo",
        descripcion: "No reemplazamos a tu personal, le damos superpoderes.",
        items: ["Talleres inmersivos", "Material de estudio a medida", "Adopción sin fricción"],
    },
    {
        icono: ShieldCheck,
        numero: "02",
        titulo: "Seguridad y Control",
        descripcion: "Todas nuestras implementaciones cuentan con mecanismos de validación donde los humanos toman las decisiones de alto riesgo.",
        items: ["Auditoría humana integrada", "Controles de calidad IA", "Privacidad por diseño"],
    },
    {
        icono: HeartHandshake,
        numero: "03",
        titulo: "Acompañamiento Continuo",
        descripcion: "Te guiamos en cada etapa de la curva de aprendizaje tecnológico.",
        items: ["Soporte dedicado", "Consultoría estratégica", "Optimización periódica"],
    },
];

export function WorkflowSection() {
    return (
        <section
            id="proceso"
            className="py-24 sm:py-32 relative bg-transparent"
            aria-labelledby="proceso-heading"
        >
            <Container className="relative z-10 flex flex-col items-center">

                <div className="text-center mb-16 md:mb-24 space-y-6 max-w-3xl">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] text-primary font-mono tracking-[0.3em] uppercase mx-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        Nuestra Promesa
                    </div>
                    <h2
                        id="proceso-heading"
                        className="text-4xl md:text-5xl font-heading text-white tracking-tight"
                    >
                        El Enfoque <span className="text-accent italic font-light">Human-in-the-Loop</span>
                    </h2>
                    <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl mx-auto">
                        El marketing atrae, la web convierte y la IA escala. En nuestra agencia fusionamos creatividad humana e ingeniería tecnológica para un crecimiento sin límites.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl">
                    {pasos.map((paso, index) => {
                        const Icono = paso.icono;
                        return (
                            <div
                                key={paso.titulo}
                                className="group relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Fondo tarjeta 3D */}
                                <div className="absolute inset-0 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-3xl transition-colors duration-500 group-hover:bg-white/[0.04] group-hover:border-primary/20" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-primary shadow-[0_0_20px_var(--color-primary)] opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_30px_var(--color-primary)] transition-all duration-500">
                                            <Icono className="w-6 h-6" />
                                        </div>
                                        <span className="text-4xl font-black text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-500 select-none font-mono">
                                            {paso.numero}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-heading text-white mb-3">
                                        {paso.titulo}
                                    </h3>
                                    <p className="text-white/40 mb-8 font-light leading-relaxed text-sm">
                                        {paso.descripcion}
                                    </p>

                                    <div className="w-full h-px bg-white/5 mb-8" />

                                    <ul className="space-y-4">
                                        {paso.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3 text-sm text-white/60 font-light"
                                            >
                                                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Puntero / Flecha flow (oculta en ultimo card) */}
                                {index < pasos.length - 1 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-6 w-8 h-8 -translate-y-1/2 items-center justify-center z-20 text-white/20">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
