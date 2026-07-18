import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main id="contenido-principal" className="flex min-h-screen items-center bg-background px-5 pt-24 text-foreground sm:px-8 lg:px-12"><div className="mx-auto w-full max-w-[1480px]"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-track-create">Error 404</p><h1 className="mt-5 max-w-5xl text-[clamp(4rem,12vw,12rem)] font-medium leading-[.82] tracking-[-.08em]">Esta ruta no llegó a compilar.</h1><p className="mt-8 max-w-md text-lg leading-7 text-foreground/52">La página no existe o cambió de lugar.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm light:border-[rgb(var(--ink-rgb)/0.15)]"><ArrowLeft className="h-4 w-4" />Volver al inicio</Link></div></main>;
}
