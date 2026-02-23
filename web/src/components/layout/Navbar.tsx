import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
                            <span className="text-primary font-bold text-xl leading-none tracking-tighter">M</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Agencia Mario</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/#sistemas" className="hover:text-primary transition-colors">
                        Sistemas
                    </Link>
                    <Link href="/#conversion-engine" className="hover:text-primary transition-colors">
                        Cómo Funciona
                    </Link>
                    <Link href="/tecnologia" className="hover:text-primary transition-colors flex items-center gap-1.5 text-primary/80">
                        <Beaker className="w-4 h-4" />
                        Tech Lab
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button asChild className="hidden md:inline-flex shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                        <Link href="#auditoria">Solicitar Auditoría</Link>
                    </Button>

                    {/* Mobile Menu Button - TODO: Add Sheet for mobile nav later */}
                    <button className="md:hidden p-2 text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
