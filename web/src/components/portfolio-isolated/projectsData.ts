export interface ProjectData {
    id: number;
    title: { es: string; en: string };
    filename: string;
    category: { es: string[]; en: string[] };
    desafio: { es: string; en: string };
    orquestacion: { es: string; en: string };
    impacto: { es: string; en: string };
    metric: { es: string; en: string };
    iframeUrl: string;
    imageUrl: string;
    stack: string[];
    codec: string;
    timecode: string;
    fileSize: string;
    codeMock: {
        language: 'typescript' | 'python' | 'html';
        content: string;
    };
}

export const PROJECTS_DATA: ProjectData[] = [
    {
        id: 0,
        title: { es: 'AutoHub 360', en: 'AutoHub 360' },
        filename: 'AutoHub360.tsx',
        category: {
            es: ['Tecnología Creativa', 'Diseño UX'],
            en: ['Creative Tech', 'UX Design']
        },
        desafio: {
            es: 'Catálogos de concesionarias lentos, con imágenes 360° pesadas y poca fluidez.',
            en: 'Slow dealership catalogs with heavy 360° imagery and little fluidity.'
        },
        orquestacion: {
            es: 'Assets WebGL comprimidos, precarga progresiva y render pensado para mobile.',
            en: 'Compressed WebGL assets, progressive preloading, and mobile-ready rendering.'
        },
        impacto: {
            es: 'Exploración 360° fluida que vuelve el catálogo más inmersivo y confiable.',
            en: 'Fluid 360° browsing that makes the catalog feel more immersive and trustworthy.'
        },
        metric: { es: 'Filtro Inmersivo', en: 'Immersive Filter' },
        iframeUrl: 'https://auto-indol-five.vercel.app/',
        imageUrl: '/portfolio/autohub-cover-v2.png',
        stack: ['3D Engine', 'Optimization', 'WebGL'],
        codec: 'ProRes 422 HQ',
        timecode: '00:01:24:12',
        fileSize: '42.8 KB',
        codeMock: {
            language: 'typescript',
            content: `import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AssetLoader } from '@/utils/loader';

/**
 * @module AutoHub360Viewer
 * @description Visor WebGL interactivo optimizado para catálogos 360°
 * 
 * @challenge "Carga lenta de texturas 4K en móviles de gama baja."
 * @solution "Pre-compresión de texturas y carga progresiva multinivel."
 */
export function AutoHub360Viewer({ modelSrc }: { modelSrc: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Configuración de la escena 3D y renderizador WebGL
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // AssetLoader gestiona la descompresión gzip en segundo plano
    AssetLoader.loadCompressedTexture(modelSrc).then((texture) => {
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1); // Invertir esfera para vista interna
      const material = new THREE.MeshBasicMaterial({ map: texture });
      scene.add(new THREE.Mesh(geometry, material));
    });
    
    camera.position.set(0, 0, 0.1);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    return () => renderer.dispose();
  }, [modelSrc]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}`
        }
    },
    {
        id: 1,
        title: { es: 'LNB SaaS', en: 'LNB SaaS' },
        filename: 'LnbSaaS.tsx',
        category: {
            es: ['Tablero SaaS', 'Sistemas de Datos'],
            en: ['SaaS Dashboard', 'Data Systems']
        },
        desafio: {
            es: 'Panel administrativo lento para reportes, inventario y lectura financiera diaria.',
            en: 'Slow admin dashboard for reports, inventory, and daily financial reads.'
        },
        orquestacion: {
            es: 'Caché local, componentes reactivos y vistas optimizadas para decisiones rápidas.',
            en: 'Local cache, reactive components, and optimized views for faster decisions.'
        },
        impacto: {
            es: 'Márgenes, stock y operación visibles con menos espera y menos fricción.',
            en: 'Margins, stock, and operations visible with less waiting and less friction.'
        },
        metric: { es: 'Panel Reactivo', en: 'Reactive Dashboard' },
        iframeUrl: 'https://lnb-saass.vercel.app/',
        imageUrl: '/portfolio/lnb-saass.png',
        stack: ['Dashboard', 'Performance', 'Cache'],
        codec: 'ProRes 422 LT',
        timecode: '00:02:18:05',
        fileSize: '118.5 KB',
        codeMock: {
            language: 'typescript',
            content: `import React, { useMemo } from 'react';
import { useSWR } from 'swr';
import { MetricsCalculator } from '@/lib/metrics';

/**
 * @module LnbFinanceDashboard
 * @description Cache optimizada de estados financieros y render reactivo de gráficos
 * 
 * @challenge "Frecuentes re-renderizados pesados por recálculo de ROI."
 * @solution "useMemo y caché distribuida con SWR y revalidación en foco."
 */
export function FinanceMetricsPanel() {
  const { data: sales, error } = useSWR('/api/v1/sales-feed', fetcher, {
    refreshInterval: 5000,
    dedupingInterval: 2000
  });

  // Recálculo memoizado para evitar lag en renderizado de gráficos
  const processedMetrics = useMemo(() => {
    if (!sales) return null;
    return MetricsCalculator.runFinancialAudit(sales, {
      taxMultiplier: 1.21,
      cacheRetention: true
    });
  }, [sales]);

  if (error) return <div className="text-red-500">Failed to fetch telemetry</div>;
  if (!processedMetrics) return <div className="animate-pulse">Streaming data...</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card title="ROI" value={processedMetrics.roi + "%"} trend="up" />
      <Card title="Net Profit" value={"$" + processedMetrics.profit} />
      <Card title="Operational Latency" value="12ms" />
    </div>
  );
}`
        }
    },
    {
        id: 2,
        title: { es: 'Hub Profesional AI', en: 'AI Professional Hub' },
        filename: 'HubProfesional.py',
        category: {
            es: ['AI & Agentes', 'Automatización'],
            en: ['AI & Agents', 'Automation']
        },
        desafio: {
            es: 'Evaluación manual de CVs lenta, repetitiva y difícil de comparar.',
            en: 'Manual resume review that was slow, repetitive, and hard to compare.'
        },
        orquestacion: {
            es: 'Pipeline IA para leer CVs, extraer datos clave y ordenar señales de match.',
            en: 'AI pipeline to read resumes, extract key data, and rank match signals.'
        },
        impacto: {
            es: 'Reporte claro de compatibilidad y mejoras accionables en pocos segundos.',
            en: 'Clear fit report and actionable improvements in a few seconds.'
        },
        metric: { es: 'Clasificador IA', en: 'AI Classifier' },
        iframeUrl: 'https://profecionalcv.vercel.app/',
        imageUrl: '/portfolio/profesional-cv.png',
        stack: ['AI Agent', 'Database', 'Backend API'],
        codec: 'H.264 High',
        timecode: '00:03:05:22',
        fileSize: '34.2 KB',
        codeMock: {
            language: 'python',
            content: `from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, Field
import openai
import json

app = FastAPI()

class ResumeAudit(BaseModel):
    fit_score: int = Field(..., description="Score 0-100 of job fit")
    missing_skills: list[str] = Field(..., description="Key technical skills missing")
    verdict: str = Field(..., description="Short professional assessment")

@app.post("/api/v1/cv-evaluate")
async def evaluate_resume(file: UploadFile = File(...)):
    # Lectura del archivo en binario y extracción básica de texto
    resume_text = await extract_text_from_pdf(file)
    
    # Llamada estructurada a OpenAI con JSON schema
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a senior recruiter. Output a structured JSON matching ResumeAudit model."},
            {"role": "user", "content": f"Analyze this resume:\\n{resume_text}"}
        ]
    )
    
    audit_data = json.loads(response.choices[0].message.content)
    return ResumeAudit(**audit_data)
`
        }
    },
    {
        id: 3,
        title: { es: 'EvoWrap Custom', en: 'EvoWrap Custom' },
        filename: 'EvoWrap.html',
        category: {
            es: ['Diseño Conversión', 'SEO Técnico'],
            en: ['Conversion Design', 'Technical SEO']
        },
        desafio: {
            es: 'Servicios premium de personalización con tráfico, pero poca conversión.',
            en: 'Premium customization services with traffic, but low conversion.'
        },
        orquestacion: {
            es: 'Landing rápida con microinteracciones y recorrido visual orientado a consulta.',
            en: 'Fast landing with microinteractions and a visual path designed for inquiries.'
        },
        impacto: {
            es: 'Marca más premium y camino de contacto más claro para leads de alto valor.',
            en: 'More premium brand presence and a clearer contact path for high-value leads.'
        },
        metric: { es: 'Conversión++', en: 'Conversion++' },
        iframeUrl: 'https://evowrap.vercel.app/',
        imageUrl: '/portfolio/evowrap.png',
        stack: ['Frontend', 'Animation', 'SEO'],
        codec: 'ProRes 4444',
        timecode: '00:04:12:18',
        fileSize: '15.9 KB',
        codeMock: {
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>EvoWrap - Personalización Vehicular</title>
  <!-- SEO Técnico: Pre-resolviendo dominios críticos de CDN -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white font-sans overflow-x-hidden">
  
  <!-- UI interactiva de personalización -->
  <main class="min-h-screen flex items-center justify-center p-8">
    <div class="max-w-4xl w-full border border-white/10 rounded-3xl bg-zinc-950 p-8">
      <h1 class="text-3xl font-black tracking-tighter">EVOWRAP PREMIUM</h1>
      <p class="text-zinc-400 mt-2">Personalizá tu vehículo en tiempo real.</p>
      
      <!-- Selector de textura dinámico -->
      <div class="grid grid-cols-3 gap-4 mt-6">
        <button onclick="changeColor('matte-black')" class="bg-zinc-900 border border-white/20 p-4 rounded-xl hover:bg-zinc-800 transition-colors">Matte Black</button>
        <button onclick="changeColor('satin-grey')" class="bg-neutral-800 border border-white/20 p-4 rounded-xl hover:bg-neutral-700 transition-colors">Satin Grey</button>
        <button onclick="changeColor('gloss-gold')" class="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl text-amber-400">Gloss Gold</button>
      </div>
    </div>
  </main>

  <script>
    function changeColor(style) {
      console.log("Visualizer config updated: " + style);
      // Despacha evento personalizado de UI
      window.dispatchEvent(new CustomEvent('wrap-config', { detail: { style } }));
    }
  </script>
</body>
</html>`
        }
    },
    {
        id: 4,
        title: { es: 'Booking Barbería', en: 'Booking Barber' },
        filename: 'BookingBarber.ts',
        category: {
            es: ['Automatizaciones', 'Pasarelas Pago'],
            en: ['Automations', 'Payment Gateways']
        },
        desafio: {
            es: 'Reservas manuales con ausencias frecuentes y tiempo operativo perdido.',
            en: 'Manual bookings with frequent no-shows and wasted operating time.'
        },
        orquestacion: {
            es: 'Pago de seña, confirmaciones automáticas y reglas simples para ordenar turnos.',
            en: 'Deposit payment, automated confirmations, and simple rules to organize bookings.'
        },
        impacto: {
            es: 'Agenda más predecible, menos ausencias y reservas confirmadas sin llamadas.',
            en: 'More predictable schedule, fewer no-shows, and confirmed bookings without calls.'
        },
        metric: { es: 'Reserva Segura', en: 'Secure Booking' },
        iframeUrl: 'https://nb-oa7mhumgz-marios-projects-4a53e443.vercel.app/reservar',
        imageUrl: '/portfolio/booking-clinico.png',
        stack: ['Automation', 'Payments', 'Webhooks'],
        codec: 'H.265 Main',
        timecode: '00:05:40:02',
        fileSize: '88.3 KB',
        codeMock: {
            language: 'typescript',
            content: `import { Stripe } from 'stripe';
import { WhatsAppClient } from '@/lib/whatsapp';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

/**
 * @handler StripeWebhookReceiver
 * @description Webhook de confirmación de pago y alerta automatizada de WhatsApp
 * 
 * @challenge "Notificar instantáneamente al cliente tras el pago de reserva."
 * @solution "Handler asíncrono e integración con la API oficial de WhatsApp."
 */
export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Despachar alerta instantánea de confirmación
    await WhatsAppClient.sendTemplate({
      phone: session.customer_details?.phone || '',
      templateName: 'booking_confirm_alert',
      params: {
        customer_name: session.customer_details?.name || 'Cliente',
        booking_date: session.metadata?.date || ''
      }
    });
  }
  
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}`
        }
    },
    {
        id: 5,
        title: { es: 'Punta 360 Inmobiliario', en: 'Punta 360 Real Estate' },
        filename: 'Punta360.ts',
        category: {
            es: ['WebGL / 3D', 'Real Estate'],
            en: ['WebGL / 3D', 'Real Estate']
        },
        desafio: {
            es: 'Desarrollos premium difíciles de presentar a distancia con suficiente impacto.',
            en: 'Premium developments were hard to present remotely with enough impact.'
        },
        orquestacion: {
            es: 'Recorrido 360° con carga progresiva y escenas preparadas para navegación fluida.',
            en: '360° walkthrough with progressive loading and scenes tuned for smooth browsing.'
        },
        impacto: {
            es: 'Visita remota más convincente para elevar percepción y acelerar consultas.',
            en: 'More convincing remote visit to raise perceived value and speed up inquiries.'
        },
        metric: { es: 'Tour Inmersivo', en: 'Immersive Tour' },
        iframeUrl: 'https://punta-360.vercel.app/',
        imageUrl: '/portfolio/punta-360.png',
        stack: ['3D Tour', 'WebGL', 'UI/UX'],
        codec: 'ProRes 422 HQ',
        timecode: '00:06:15:10',
        fileSize: '210.4 KB',
        codeMock: {
            language: 'typescript',
            content: `import * as THREE from 'three';

/**
 * @module RealEstatePanoramicViewer
 * @description Tour virtual interactivo 360° con Three.js
 * 
 * @challenge "Frecuencia de fotogramas inestable al rotar la cámara."
 * @solution "Desactivar sombras dinámicas y reciclar geometrías en memoria."
 */
export class PanoramicViewer {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;

  constructor(container: HTMLElement, imageSrc: string) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    
    // Crear esfera de proyección
    const geometry = new THREE.SphereGeometry(500, 32, 32);
    geometry.scale(-1, 1, 1);
    
    const texture = new THREE.TextureLoader().load(imageSrc);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
    
    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}`
        }
    },
    {
        id: 6,
        title: { es: 'Truckers Choice', en: 'Truckers Choice' },
        filename: 'TruckersChoice.tsx',
        category: {
            es: ['Diseño Corporativo', 'Sistemas de Trámites'],
            en: ['Corporate Design', 'Workflow Systems']
        },
        desafio: {
            es: 'Cotizadores y trámites para transportistas con fricción, demora y poca claridad móvil.',
            en: 'Carrier quoting and permit flows with friction, delays, and poor mobile clarity.'
        },
        orquestacion: {
            es: 'Interfaz bilingüe, carga selectiva y flujo guiado para consultar desde la ruta.',
            en: 'Bilingual interface, selective loading, and guided flow for on-the-road inquiries.'
        },
        impacto: {
            es: 'Consulta móvil más clara para choferes, con menos abandono en formularios clave.',
            en: 'Clearer mobile inquiry flow for drivers, with less drop-off on key forms.'
        },
        metric: { es: 'Trámite Ágil', en: 'Agile Workflow' },
        iframeUrl: 'https://truckers-choice-web-site.vercel.app/',
        imageUrl: '/portfolio/truckers-cover.png',
        stack: ['Next.js', 'Tailwind CSS', 'i18n'],
        codec: 'H.264 High',
        timecode: '00:07:32:04',
        fileSize: '95.1 KB',
        codeMock: {
            language: 'typescript',
            content: `/**
 * @module QuotingSystem
 * @description Dynamic translation wrapper and lazy component loader for the insurance quoting wizard.
 */
export function useTranslation(locale: string) {
  const translations: Record<string, { title: string; button: string }> = {
    en: { title: "Insurance & Permits Specialists", button: "Get a quote" },
    es: { title: "Especialistas en Seguros y Permisos", button: "Obtener cotización" }
  };
  return translations[locale] || translations.en;
}`
        }
    },
    {
        id: 7,
        title: { es: 'AD Media Solution', en: 'AD Media Solution' },
        filename: 'AdMediaSolution.tsx',
        category: {
            es: ['Dirección Comercial', 'Pauta Digital'],
            en: ['Sales & Marketing', 'Paid Ads']
        },
        desafio: {
            es: 'Prospectos dispersos, agenda lenta y poco seguimiento dentro del flujo comercial.',
            en: 'Scattered leads, slow scheduling, and weak follow-up inside the sales flow.'
        },
        orquestacion: {
            es: 'CRM personalizado, automatización de pauta y embudo de agenda más ordenado.',
            en: 'Custom CRM, paid-media automation, and a cleaner booking funnel.'
        },
        impacto: {
            es: 'Seguimiento más consistente, citas mejor gestionadas y base lista para escalar.',
            en: 'More consistent follow-up, better-managed bookings, and a base ready to scale.'
        },
        metric: { es: 'CRM & Escala', en: 'CRM & Scaling' },
        iframeUrl: 'https://admediasolution.vercel.app/',
        imageUrl: '/portfolio/admedia-cover.png',
        stack: ['Next.js', 'Tailwind CSS', 'CRM Integration'],
        codec: 'ProRes 422 LT',
        timecode: '00:08:44:12',
        fileSize: '112.3 KB',
        codeMock: {
            language: 'typescript',
            content: `/**
 * @handler LeadIngestionCRM
 * @description Secure endpoint to automatically push paid ad leads straight to the internal CRM.
 */
export async function submitLeadToCRM(lead: { name: string; phone: string; email: string }) {
  const response = await fetch('/api/crm/ingest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, source: 'paid_ads_campaign' })
  });
  return response.ok ? { success: true } : { error: 'Failed to sync lead' };
}`
        }
    },
    {
        id: 8,
        title: { es: 'América Trámites', en: 'América Trámites' },
        filename: 'AmericaTramites.tsx',
        category: {
            es: ['Gestión Consular', 'Plataformas Web'],
            en: ['Consular Forms', 'Web Platforms']
        },
        desafio: {
            es: 'Formularios consulares largos, confusos y con alta carga de soporte manual.',
            en: 'Long, confusing consular forms with a heavy manual support load.'
        },
        orquestacion: {
            es: 'Formulario guiado con validaciones por paso, carga de documentos y avance claro.',
            en: 'Guided form with step validation, document upload, and clear progression.'
        },
        impacto: {
            es: 'Usuarios mejor guiados y equipo interno con menos correcciones repetidas.',
            en: 'Better-guided users and internal teams facing fewer repeated corrections.'
        },
        metric: { es: 'Trámites Guiados', en: 'Guided Compliance' },
        iframeUrl: 'https://atreact.vercel.app/',
        imageUrl: '/portfolio/america-cover.png',
        stack: ['React', 'Vite', 'Validation API'],
        codec: 'H.265 Main',
        timecode: '00:09:18:22',
        fileSize: '48.7 KB',
        codeMock: {
            language: 'typescript',
            content: `/**
 * @helper FormStepValidator
 * @description Validates required legal documents and personal data fields progressively before allowing step progression.
 */
export function StepValidator({ currentStep, data }: { currentStep: number; data: Record<string, any> }) {
  const requiredFields = ['fullName', 'passportNumber', 'birthDate'];
  const isStepValid = requiredFields.every(field => data[field] && data[field].trim() !== '');
  return { valid: isStepValid };
}`
        }
    },
    {
        id: 9,
        title: { es: 'DOGE.S.M LLC', en: 'DOGE.S.M LLC' },
        filename: 'DogeCleaning.tsx',
        category: {
            es: ['Diseño de Lujo', 'Servicios Premium'],
            en: ['Luxury Design', 'Premium Services']
        },
        desafio: {
            es: 'Servicio premium con presencia digital genérica que no transmitía confianza.',
            en: 'Premium service with generic digital presence that did not build trust.'
        },
        orquestacion: {
            es: 'Landing de lujo con interacción cuidada y catálogo claro de membresías.',
            en: 'Luxury landing with polished interaction and clear membership catalog.'
        },
        impacto: {
            es: 'Marca más específica y consulta más simple para clientes premium.',
            en: 'More specific brand presence and simpler inquiries for premium clients.'
        },
        metric: { es: 'Estándar de Élite', en: 'Elite Cleaning Standard' },
        iframeUrl: 'https://doge-27dp.vercel.app/',
        imageUrl: '/portfolio/doge-cover.png',
        stack: ['Next.js', 'Tailwind CSS', 'Custom Cursor'],
        codec: 'ProRes 4444',
        timecode: '00:10:05:08',
        fileSize: '134.8 KB',
        codeMock: {
            language: 'typescript',
            content: `import { useEffect } from 'react';

/**
 * @hook useLuxuryCursor
 * @description Animates a high-end customized circle aura that follows mouse coordinates smoothly across the page.
 */
export function useLuxuryCursor() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById('aura-cursor');
      if (cursor) {
        cursor.style.transform = \`translate(\${e.clientX - 40}px, \${e.clientY - 40}px)\`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
}`
        }
    }
];
