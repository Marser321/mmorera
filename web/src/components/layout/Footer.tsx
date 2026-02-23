import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black/20">
            <div className="container mx-auto px-4 py-12 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="size-6 rounded-md bg-primary/20 flex items-center justify-center border border-primary/50">
                                <span className="text-primary font-bold tracking-tighter text-sm">M</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">Agencia Mario</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            Automatizamos marketing y ventas B2B para que cierres más negocios sin escalar tu operación manual.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Sistemas</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#sistemas" className="hover:text-primary transition-colors">Presencia que Convierte</Link></li>
                            <li><Link href="#sistemas" className="hover:text-primary transition-colors">Lead Magnets IA</Link></li>
                            <li><Link href="#sistemas" className="hover:text-primary transition-colors">Autopilot CRM</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Compañía</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#casos" className="hover:text-primary transition-colors">Resultados</Link></li>
                            <li><Link href="#auditoria" className="hover:text-primary transition-colors">Auditoría IA</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Agencia Mario. Todos los derechos reservados.</p>
                    <p>Operando desde Uruguay para el mundo.</p>
                </div>
            </div>
        </footer>
    );
}
