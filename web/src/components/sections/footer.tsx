import Link from "next/link";
import { Container } from "@/components/ui/container";

const linksFooter = [
    {
        titulo: "Sistemas",
        links: [
            { label: "Captación y Conversión", href: "#sistemas" },
            { label: "Follow-up Automático", href: "#sistemas" },
            { label: "Reporting Ejecutivo", href: "#sistemas" },
            { label: "Creatividades e IA", href: "#sistemas" },
        ],
    },
    {
        titulo: "Empresa",
        links: [
            { label: "Sobre nosotros", href: "#" },
            { label: "Proceso", href: "#proceso" },
            { label: "Resultados", href: "#resultados" },
            { label: "Blog", href: "#" },
        ],
    },
    {
        titulo: "Contacto",
        links: [
            { label: "Solicitar Auditoría", href: "#auditoria" },
            { label: "hola@mmore.agency", href: "mailto:hola@mmore.agency" },
        ],
    },
] as const;

/**
 * Footer — pie de página con links, copyright y social.
 */
export function Footer() {
    const anioActual = new Date().getFullYear();

    return (
        <footer
            className="border-t border-border/20 bg-card/10 pt-12 pb-8"
            role="contentinfo"
        >
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link
                            href="/"
                            className="text-lg font-bold text-gradient"
                            aria-label="MMORE — Ir al inicio"
                        >
                            MMORE
                        </Link>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Sistemas de automatización y agentes de IA para marketing B2B.
                            Desde Uruguay para el mundo.
                        </p>
                    </div>

                    {/* Link Groups */}
                    {linksFooter.map((grupo) => (
                        <div key={grupo.titulo}>
                            <h3 className="text-sm font-semibold text-foreground mb-3">
                                {grupo.titulo}
                            </h3>
                            <ul className="space-y-2" role="list">
                                {grupo.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {anioActual} MMORE Agency. Todos los derechos reservados.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-foreground transition-colors">
                            Privacidad
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Términos
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
