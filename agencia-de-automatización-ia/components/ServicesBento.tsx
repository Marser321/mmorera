import { Users, FileText, LayoutTemplate, Mic, Search, Lightbulb, Zap } from 'lucide-react';

const services = [
  {
    title: 'CRM Inteligente',
    description: 'Gestión de clientes potenciada por IA para predecir comportamientos y automatizar seguimientos.',
    icon: Users,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Automatización de Contenido',
    description: 'Generación masiva de contenido optimizado para redes y blogs con modelos de lenguaje avanzados.',
    icon: FileText,
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    title: 'Web Apps',
    description: 'Desarrollo de aplicaciones web modulares e integradas con ecosistemas de inteligencia artificial.',
    icon: LayoutTemplate,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Agentes de Voz',
    description: 'Asistentes telefónicos autónomos capaces de agendar citas y resolver consultas en tiempo real.',
    icon: Mic,
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    title: 'SEO con IA',
    description: 'Optimización de motores de búsqueda basada en análisis semántico y tendencias predictivas.',
    icon: Search,
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
  {
    title: 'Consultoría Estratégica',
    description: 'Auditoría de procesos y diseño de roadmaps de implementación tecnológica a medida.',
    icon: Lightbulb,
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
];

export default function ServicesBento() {
  return (
    <section id="servicios" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Módulos de <span className="text-gradient">Transformación</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Arquitectura modular diseñada para escalar. Implementamos soluciones que se adaptan a la madurez tecnológica de tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative glass-panel rounded-3xl p-8 overflow-hidden neon-border flex flex-col justify-between transition-transform hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-serif">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
              
              <div className="relative z-10 mt-6 flex items-center text-sm font-medium text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                Explorar módulo <Zap className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
