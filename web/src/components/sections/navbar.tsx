"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navLinks = [
    { label: "Sistemas", href: "#sistemas" },
    { label: "Proceso", href: "#proceso" },
    { label: "Resultados", href: "#resultados" },
    { label: "Testimonios", href: "#testimonios" },
] as const;

/**
 * Navbar — navegación principal con glassmorphism.
 * Menú hamburguesa accesible en móvil con aria-expanded.
 */
export function Navbar() {
    const [menuAbierto, setMenuAbierto] = React.useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <Container as="div">
                <nav
                    className="flex items-center justify-between h-16"
                    role="navigation"
                    aria-label="Navegación principal"
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                        aria-label="MMORE — Ir al inicio"
                    >
                        <span className="text-gradient">MMORE</span>
                    </Link>

                    {/* Links — Desktop */}
                    <ul className="hidden md:flex items-center gap-1" role="list">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/40"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA — Desktop */}
                    <div className="hidden md:block">
                        <Button variant="shimmer" size="sm" asChild>
                            <a href="#auditoria">Solicitar Auditoría</a>
                        </Button>
                    </div>

                    {/* Hamburguesa — Mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        aria-expanded={menuAbierto}
                        aria-controls="menu-mobile"
                        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                    >
                        {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </nav>

                {/* Panel móvil */}
                <div
                    id="menu-mobile"
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
                        menuAbierto ? "max-h-80 opacity-100 pb-6" : "max-h-0 opacity-0"
                    )}
                    role="menu"
                >
                    <ul className="flex flex-col gap-1 pt-2" role="list">
                        {navLinks.map((link) => (
                            <li key={link.href} role="menuitem">
                                <a
                                    href={link.href}
                                    className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors"
                                    onClick={() => setMenuAbierto(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 px-4">
                        <Button variant="shimmer" size="default" className="w-full" asChild>
                            <a href="#auditoria" onClick={() => setMenuAbierto(false)}>
                                Solicitar Auditoría
                            </a>
                        </Button>
                    </div>
                </div>
            </Container>
        </header>
    );
}
