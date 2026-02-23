'use client';

import { Bot, Cpu, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-light/20 to-primary/20 neon-border">
              <Sparkles className="w-6 h-6 text-primary-light" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wider text-white">
              NEXUS<span className="text-gradient">.AI</span>
            </span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#servicios" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Servicios</a>
              <a href="#metodologia" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Metodología</a>
              <a href="#casos" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Casos de Éxito</a>
              <Link href="/dashboard" className="crystal-btn px-6 py-2 rounded-full text-sm font-medium text-white transition-all">
                Acceder al Panel
              </Link>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#servicios" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Servicios</a>
            <a href="#metodologia" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Metodología</a>
            <a href="#casos" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Casos de Éxito</a>
            <Link href="/dashboard" className="w-full text-left crystal-btn mt-4 px-3 py-2 rounded-md text-base font-medium text-white block">
              Acceder al Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
