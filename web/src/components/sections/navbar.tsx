'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Rocket, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Soluciones', href: '#servicios' },
    { name: 'Automatización', href: '#automatizacion' },
    { name: 'Inversión', href: '#pricing' },
    { name: 'Portafolio', href: '#portfolio' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsScrolled(!entry.isIntersecting);
        });

        const sentinel = document.getElementById('scroll-sentinel');
        if (sentinel) observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div id="scroll-sentinel" className="absolute top-0 w-full h-[50px] pointer-events-none bg-transparent" aria-hidden="true" />
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
                        : 'py-6 bg-transparent'
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                            <span className="relative text-2xl font-black tracking-tighter text-white">
                                NEXO
                                <span className="text-violet-500">.</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group tracking-wide"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-white group-hover:w-full transition-all duration-300 ease-out" />
                            </Link>
                        ))}
                    </nav>

                    {/* CTA & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="hidden md:flex bg-white hover:bg-gray-100 text-black border-0 rounded-full px-6 transition-all hover:scale-105 active:scale-95 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <Rocket className="w-4 h-4 mr-2" />
                            Iniciar Proyecto
                        </Button>

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-white p-2"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileOpen && (
                    <div className="md:hidden bg-[#0A0A0A] border-t border-white/10 p-6">
                        <div className="flex flex-col gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-xl font-medium text-white/80 hover:text-white transition-all"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Button
                                onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}
                                className="w-full bg-white text-black hover:bg-gray-200 rounded-full py-6 text-lg font-bold"
                            >
                                Iniciar Proyecto
                            </Button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
