export interface InteractionPreset {
  id: "tilt_card" | "scramble_text" | "magnetic_button" | "border_spotlight";
  tag: string;
  name: { es: string; en: string };
  subtitle: { es: string; en: string };
  impactMetric: { es: string; en: string };
  techStack: string[];
}

export const INTERACTION_PRESETS: InteractionPreset[] = [
  {
    id: "tilt_card",
    tag: "3D Perspective",
    name: {
      es: "Tarjeta 3D con Reflejo Especular",
      en: "3D Perspective Card & Specular Sheen",
    },
    subtitle: {
      es: "Inclinación giroscópica 3D basada en coordenadas de cursor con resplandor radial dinámico.",
      en: "3D gyroscopic tilt tracking pointer coordinates with dynamic radial sheen.",
    },
    impactMetric: {
      es: "+42% tiempo de interacción en viewport",
      en: "+42% viewport interaction dwell time",
    },
    techStack: ["CSS 3D Transforms", "Framer Motion", "Pointer Coordinates"],
  },
  {
    id: "scramble_text",
    tag: "Kinetic Typography",
    name: {
      es: "Tipografía Cinética & Cyber Scramble",
      en: "Kinetic Typography & Cyber Scramble",
    },
    subtitle: {
      es: "Resolución progresiva de glifos con resorte elástico y frecuencia de muestreo de 60 FPS.",
      en: "Progressive glyph resolution with spring restitution at 60 FPS refresh rate.",
    },
    impactMetric: {
      es: "3.2x mayor retención de marca",
      en: "3.2x higher brand memory retention",
    },
    techStack: ["Glyph Matrix", "RequestAnimationFrame", "Spring Interpolation"],
  },
  {
    id: "magnetic_button",
    tag: "Elastic Physics",
    name: {
      es: "Botón Magnético con Restitución",
      en: "Magnetic Button with Spring Restitution",
    },
    subtitle: {
      es: "Atracción fluida del cursor con radio de captura elástico y efecto de banda elástica.",
      en: "Smooth cursor snapping with elastic capture radius and rubber-band restitution.",
    },
    impactMetric: {
      es: "+28% tasa de clics en llamadas a la acción",
      en: "+28% click-through rate on primary CTAs",
    },
    techStack: ["Magnetic Attractor", "Spring Damping", "Touch Boundary"],
  },
  {
    id: "border_spotlight",
    tag: "Liquid Lighting",
    name: {
      es: "Borde Spotlight Radial Líquido",
      en: "Liquid Radial Border Spotlight",
    },
    subtitle: {
      es: "Iluminación perimetral dinámica que sigue la posición exacta del cursor con degradado cónico.",
      en: "Perimeter lighting tracking exact cursor coordinates with dynamic conic gradient.",
    },
    impactMetric: {
      es: "+35% percepción de calidad premium",
      en: "+35% perceived premium brand craft",
    },
    techStack: ["CSS Mask & Conic Gradients", "Mouse Coordinates", "Backdrop Filter"],
  },
];

export interface TiltParams {
  maxAngle: number; // 5 to 30 deg
  perspective: number; // 500 to 1500 px
  sheenOpacity: number; // 0.1 to 0.8
}

export function calculateTilt(
  offsetX: number,
  offsetY: number,
  width: number,
  height: number,
  params: TiltParams
): { rotateX: number; rotateY: number; sheenX: number; sheenY: number } {
  const normX = (offsetX / width) * 2 - 1; // -1 to +1
  const normY = (offsetY / height) * 2 - 1; // -1 to +1

  // Invert rotateX so hovering top tilts top toward viewer
  const rawX = Math.round(-normY * params.maxAngle * 10) / 10;
  const rawY = Math.round(normX * params.maxAngle * 10) / 10;
  const rotateX = rawX === 0 ? 0 : rawX;
  const rotateY = rawY === 0 ? 0 : rawY;

  const sheenX = Math.round((normX * 0.5 + 0.5) * 100);
  const sheenY = Math.round((normY * 0.5 + 0.5) * 100);

  return { rotateX, rotateY, sheenX, sheenY };
}

export const SCRAMBLE_GLYPHS = "ABCDEF0123456789!@#$%^&*<>~+=";

export function scrambleStep(
  targetText: string,
  progress: number // 0 to 1
): string {
  const targetChars = targetText.split("");
  const totalLength = targetChars.length;
  const revealedCount = Math.floor(progress * totalLength);

  return targetChars
    .map((char, idx) => {
      if (char === " ") return " ";
      if (idx < revealedCount) return char;
      const randomIdx = Math.floor(Math.random() * SCRAMBLE_GLYPHS.length);
      return SCRAMBLE_GLYPHS[randomIdx];
    })
    .join("");
}

export function generateInteractionCodeSnippet(presetId: string): string {
  switch (presetId) {
    case "tilt_card":
      return `// 3D Perspective Tilt Card with Specular Sheen (Framer Motion)
const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  setTilt({
    rotateX: -y * 20, // max 20deg tilt
    rotateY: x * 20,
    sheenX: (x + 0.5) * 100,
    sheenY: (y + 0.5) * 100,
  });
};

<motion.div
  style={{
    perspective: 1000,
    transformStyle: "preserve-3d",
    rotateX: tilt.rotateX,
    rotateY: tilt.rotateY,
  }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
  className="relative rounded-2xl border border-white/10 bg-card p-8"
>
  {/* Specular Radial Reflection */}
  <div
    className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
    style={{
      background: \`radial-gradient(circle at \${tilt.sheenX}% \${tilt.sheenY}%, rgba(255,255,255,0.25), transparent 70%)\`,
    }}
  />
</motion.div>`;

    case "scramble_text":
      return `// Progressive Kinetic Scramble (RequestAnimationFrame)
const glyphs = "ABCDEF0123456789!@#$%^&*<>~+=";

function useScramble(target: string, duration = 800) {
  const [text, setText] = useState(target);

  const trigger = () => {
    const startTime = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const revealed = Math.floor(progress * target.length);
      setText(
        target.split("").map((c, i) =>
          i < revealed ? c : glyphs[Math.floor(Math.random() * glyphs.length)]
        ).join("")
      );
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  return { text, trigger };
}`;

    case "magnetic_button":
      return `// Magnetic Cursor Pull with Elastic Restitution
const ref = useRef<HTMLButtonElement>(null);
const [position, setPosition] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent) => {
  if (!ref.current) return;
  const { left, top, width, height } = ref.current.getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
  
  if (dist < 120) { // 120px attraction radius
    setPosition({
      x: (e.clientX - centerX) * 0.35,
      y: (e.clientY - centerY) * 0.35,
    });
  }
};

<motion.button
  ref={ref}
  animate={{ x: position.x, y: position.y }}
  transition={{ type: "spring", stiffness: 350, damping: 20 }}
  onMouseLeave={() => setPosition({ x: 0, y: 0 })}
  className="rounded-full bg-signal px-6 py-3 font-semibold text-black"
>
  Interact
</motion.button>`;

    case "border_spotlight":
    default:
      return `// Liquid Radial Border Spotlight (CSS Radial Gradient Mask)
const [coords, setCoords] = useState({ x: 0, y: 0 });

<div
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }}
  className="group relative rounded-2xl border border-white/10 bg-card p-8"
>
  <div
    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    style={{
      background: \`radial-gradient(400px circle at \${coords.x}px \${coords.y}px, rgba(113,243,162,0.4), transparent 40%)\`,
    }}
  />
</div>`;
  }
}
