# Dossier · AD Media Solution

> **Estado:** Verificado contra el código fuente en `c:\Users\morer\OneDrive\Desktop\MMORERA\AD Media Solution\` (paquete `solution-agency-web`, Next.js 15+ + Tailwind + Lucide + Framer Motion).
> **Cliente:** AD Media Solution (Danger Fernández, CEO).
> **Dominio público:** `https://admediasolution.vercel.app`.

---

## 1. Identidad y Posicionamiento

- **Qué es:** Agencia de "Arquitectura de Ingresos y CRM" de marca blanca para empresas y contratistas hispanos en EE. UU.
- **Propuesta de valor:** Sustituir procesos manuales y hojas de cálculo por una infraestructura automatizada sobre GoHighLevel con la identidad visual del cliente.
- **Paleta de marca (extraída del CSS del cliente):**
  - Fondo (`bg`): `#020617` (Deep Slate / Navy)
  - Superficie (`surface`): `#0B132B`
  - Elevada (`raised`): `#1E293B`
  - Borde (`line`): `#1E293B`
  - Texto (`text`): `#F8FAFC`
  - Muted (`muted`): `#94A3B8`
  - Acento (`accent`): `#0066FF` (Azul eléctrico)
  - Acento suave (`accentSoft`): `#488EFF`
  - Acento profundo (`accentDeep`): `#0044CC`
  - En acento (`onAccent`): `#FFFFFF`
- **Tipografía:** Montserrat (display y texto).
- **Assets de marca en el repo (`web/public/portfolio/brands/ad-media-solution/`):**
  - `mark.png`: Isotipo vectorizado / rasterizado de AD Media.
  - `wordmark.png`: Logotipo con texto.
  - `ceo.jpg`: Fotografía de Danger Fernández (CEO).
  - `banner.jpg`: Render publicitario / póster de marca.
  - `logo-crm.png`: Emblema del módulo de CRM de Marca Blanca.

---

## 2. Los Pilares del Sistema Tecnológico

1. **Captación Omnicanal:**
   - Tráfico desde Meta Ads (Facebook/Instagram), Google Ads, SEO local y WhatsApp.
   - Enrutamiento directo al webhook de GoHighLevel sin intermediarios caídos.
2. **Motor de Calificación Automática:**
   - Speed-to-Lead: disparadores inmediatos por SMS y WhatsApp al entrar un contacto.
   - Formulario inteligente de diagnóstico que descarta prospectos no calificados.
3. **Pipeline Board (Tablero de Ventas):**
   - Estados nativos de oportunidad en GHL:
     - `Lead nuevo` $\rightarrow$ `Calificado` $\rightarrow$ `Llamada agendada` $\rightarrow$ `Propuesta enviada` $\rightarrow$ `Ganado / Onboarding`.
4. **Reputation Engine:**
   - Disparo condicional de solicitud de reseña de Google Maps 24 horas después de completar el servicio.
5. **Marca Blanca Completa:**
   - El cliente accede a su portal con su propio dominio (`app.cliente.com`), su logo y sus colores corporativos, impulsado por el motor subyacente.

---

## 3. Cifras y Afirmaciones Verificadas

- **Componentes en código:** 10 secciones completas (`AuthoritySection`, `BlueprintSection`, `CRMSection`, `HeroSection`, `ProblemSection`, `ScannerSection`, `ScrollytellingSection`, `ServicesSection`, etc.).
- **Servicios ofrecidos:** 4 pilares: CRM & Automatización, Paid Ads, Social Media Growth, Desarrollo Web.
- **Herramientas integradas:** GoHighLevel, Meta Ads Manager, Google Business Profile, Twilio / WhatsApp Business API, Stripe.
- **Claims permitidos:**
  - *"Automatización de prospección y agenda 24/7 sin tareas manuales."*
  - *"Portal de cliente con marca blanca sobre infraestructura de alta disponibilidad."*
  - *"Sincronización directa entre anuncios de Meta/Google y el pipeline de ventas."*
- **Claims prohibidos (no inventar métricas ficticias):**
  - No atribuir porcentajes inventados de conversión que no estén en la base de datos de auditoría.
  - No prometer ROI fijo sin auditoría previa.

---

## 4. Escena Protagonista para el Film

- **Tipo de escena:** `pipeline-board` (nuevo tipo en `flagships/types.ts`).
- **Mecánica visual:**
  - Simulación del tablero Kanban de oportunidades de GoHighLevel:
    - Tarjetas de contacto moviéndose entre columnas con drag-and-drop cinemático.
    - Contador de valor del pipeline actualizándose al vuelo sin conteos lentos.
    - Notificación hápitca/visual de llamada agendada en el calendario.
