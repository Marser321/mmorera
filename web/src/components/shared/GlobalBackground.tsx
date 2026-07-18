"use client";

import { TechParticleField } from "./TechParticleField";

/* Scrims de profundidad: niebla del color del fondo (grafito en Deep Space,
   marfil en Master Print). `color-mix` sobre el token hace que la atmósfera
   funcione idéntica en ambos temas. */
const mist = (pct: number) => `color-mix(in srgb, var(--color-background) ${pct}%, transparent)`;

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background" aria-hidden="true">
      <div className="absolute inset-0"><TechParticleField /></div>
      <div
        className="absolute inset-0 max-lg:hidden"
        style={{ background: `linear-gradient(90deg, ${mist(82)} 0%, ${mist(38)} 46%, ${mist(2)} 72%, ${mist(12)} 100%)` }}
      />
      <div
        className="absolute inset-0 lg:hidden"
        style={{ background: `linear-gradient(to bottom, ${mist(42)}, ${mist(8)} 58%, ${mist(48)})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 77% 28%, transparent 0%, ${mist(8)} 38%, ${mist(62)} 86%, var(--color-background) 100%)` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${mist(2)}, ${mist(56)})` }}
      />
    </div>
  );
}
