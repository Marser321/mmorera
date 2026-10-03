export interface VanguardPattern {
  id: string;
  name: { es: string; en: string };
  category: "dock" | "beam" | "spotlight" | "gesture";
  inspiration: string;
  description: { es: string; en: string };
  techStack: string[];
  snippet: string;
}

export const VANGUARD_PATTERNS: VanguardPattern[] = [
  {
    id: "morphing-dock",
    name: { es: "Dock Dinámico & Expansión Háptica", en: "Morphing Dynamic Island Dock" },
    category: "dock",
    inspiration: "Kokonut UI & Apple Dynamic Island",
    description: {
      es: "Barra flotante que muta su ancho y radio con resortes de física pura, magnificando iconos con escala logarítmica al pasar el cursor.",
      en: "Floating bar that morphs its width and radius using spring physics, magnifying icons with logarithmic scale on hover.",
    },
    techStack: ["Framer Motion", "Tailwind CSS 3.4", "Spring Physics"],
    snippet: `// Morphing Dock with Framer Motion Spring Physics
import { motion } from "framer-motion";

export function MorphingDock({ items }) {
  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 450, damping: 28 }}
      className="flex items-center gap-3 p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl"
    >
      {items.map((item, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.25, y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="p-3 rounded-full bg-white/10 hover:bg-signal/20 text-white hover:text-signal"
        >
          {item.icon}
        </motion.button>
      ))}
    </motion.div>
  );
}`,
  },
  {
    id: "border-beam",
    name: { es: "Trazador de Rayo Perimetral SVG", en: "Animated Perimeter Border Beam" },
    category: "beam",
    inspiration: "Magic UI Border Beam",
    description: {
      es: "Rayo de luz cian/signal de alta intensidad que recorre continuamente el perímetro de una tarjeta de interfaz sin afectar el rendimiento.",
      en: "High-intensity cyan/signal laser beam that travels continuously along a card's perimeter SVG path with zero frame drops.",
    },
    techStack: ["SVG Path Length", "CSS Animations", "Hardware Acceleration"],
    snippet: `// Magic UI Style Border Beam
export function BorderBeam({ duration = 6, size = 120 }) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
      <div 
        style={{
          animationDuration: \`\${duration}s\`,
          width: \`\${size}px\`,
        }}
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-border-beam"
      />
    </div>
  );
}`,
  },
  {
    id: "card-spotlight",
    name: { es: "Spotlight Radial Reactivo al Cursor", en: "Reactive Cursor Card Spotlight" },
    category: "spotlight",
    inspiration: "Aceternity UI Spotlight & Linear Design",
    description: {
      es: "Gradiente radial que rastrea las coordenadas X/Y del puntero, iluminando la micro-textura y los bordes con resplandor suave.",
      en: "Radial gradient tracking pointer X/Y coordinates, softly illuminating micro-textures and glass borders.",
    },
    techStack: ["CSS Variables", "Pointer Move", "Glassmorphism"],
    snippet: `// Aceternity Style Card Spotlight
export function SpotlightCard({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
      }}
      onMouseLeave={() => setPos(p => ({ ...p, opacity: 0 }))}
      className="relative rounded-3xl border border-white/10 bg-[#0b1017] p-8 overflow-hidden"
    >
      <div
        style={{
          background: \`radial-gradient(400px circle at \${pos.x}px \${pos.y}px, rgba(113, 243, 162, 0.15), transparent 80%)\`,
          opacity: pos.opacity,
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
      />
      {children}
    </div>
  );
}`,
  },
  {
    id: "inertial-deck",
    name: { es: "Deck Inercial con Rotación Gestual", en: "Inertial Gestural Card Deck" },
    category: "gesture",
    inspiration: "Motion Primitives & Tinder Gesture Physics",
    description: {
      es: "Mazo de tarjetas arrastrable (`drag`) con restitución angular elástica: la rotación acompaña la inercia del dedo y retorna con spring amortiguado.",
      en: "Draggable card deck with elastic angular restitution: rotation tracks finger velocity and snaps back with critically damped springs.",
    },
    techStack: ["Framer Motion drag", "useMotionValue", "useTransform"],
    snippet: `// Inertial Gesture Deck with Framer Motion
import { motion, useMotionValue, useTransform } from "framer-motion";

export function InertialCard() {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      whileTap={{ cursor: "grabbing", scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-80 h-96 rounded-3xl bg-[#0e141d] border border-cyan-400/30 cursor-grab shadow-2xl"
    />
  );
}`,
  },
];

export function getVanguardPattern(id: string): VanguardPattern | undefined {
  return VANGUARD_PATTERNS.find((p) => p.id === id);
}
