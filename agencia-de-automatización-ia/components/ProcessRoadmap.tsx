import { Compass, Beaker, Rocket } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Explorar',
    description: 'Analizamos tus procesos actuales y detectamos cuellos de botella donde la IA puede generar el mayor impacto.',
    icon: Compass,
  },
  {
    id: '02',
    title: 'Prototipar',
    description: 'Desarrollamos un MVP (Producto Mínimo Viable) en semanas, no meses, para validar la solución en tu entorno real.',
    icon: Beaker,
  },
  {
    id: '03',
    title: 'Escalar',
    description: 'Desplegamos la solución completa, integramos con tu stack y capacitamos a tu equipo para maximizar el ROI.',
    icon: Rocket,
  }
];

export default function ProcessRoadmap() {
  return (
    <section id="metodologia" className="py-24 relative z-10 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Nuestro <span className="text-gradient">Roadmap</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Una metodología ágil diseñada para minimizar el riesgo y acelerar la adopción de IA en tu organización.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Number Badge */}
                <div className="absolute -top-6 -left-4 md:left-1/2 md:-translate-x-1/2 md:-top-12 text-6xl font-serif font-bold text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                  {step.id}
                </div>
                
                {/* Icon Node */}
                <div className="w-20 h-20 rounded-full glass-panel neon-border flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-300 bg-[#0B0B0F]">
                  <step.icon className="w-8 h-8 text-[#00F0FF]" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 font-serif">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
