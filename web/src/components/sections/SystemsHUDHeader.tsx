'use client';

import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export function SystemsHUDHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mb-12 border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] font-bold tracking-[0.16em] text-zinc-500 uppercase relative"
        >
            <div className="flex items-center gap-2 text-emerald-400/80">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>02_SYSTEMS_OPS</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <span>LATENCY: 14ms</span>
                <span>ENGINE: CRM + AUTOMATION</span>
                <span className="text-zinc-600">|</span>
                <span>DATABASE: REALTIME</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-black">
                <Cpu className="h-3 w-3 text-emerald-400/80" />
                <span>INTEGRACIÓN + AUTOMATIZACIÓN IA</span>
            </div>
        </motion.div>
    );
}
