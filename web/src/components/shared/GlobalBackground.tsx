"use client";

import { TechParticleField } from "./TechParticleField";

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#070809]" aria-hidden="true">
      <div className="absolute inset-0"><TechParticleField /></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,9,.82)_0%,rgba(7,8,9,.38)_46%,rgba(7,8,9,.02)_72%,rgba(7,8,9,.12)_100%)] max-lg:bg-[linear-gradient(to_bottom,rgba(7,8,9,.42),rgba(7,8,9,.08)_58%,rgba(7,8,9,.48))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_77%_28%,transparent_0%,rgba(7,8,9,.08)_38%,rgba(7,8,9,.62)_86%,#070809_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,8,9,.02),rgba(7,8,9,.56))]" />
    </div>
  );
}
