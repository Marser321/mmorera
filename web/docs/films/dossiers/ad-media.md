# Dossier · AD Media Solution

> **Estado:** Verificado contra el código fuente en `c:\Users\morer\OneDrive\Desktop\MMORERA\AD Media Solution\` (paquete `solution-agency-web`, Next.js 15+ + Tailwind + Lucide + Framer Motion).
> **Cliente:** AD Media Solution (Danger Fernández, CEO).
> **Dominio público:** `https://admediasolution.vercel.app`.

---

## 1. Identidad, Posicionamiento y Alianza Comercial

- **Qué es:** Agencia de "Arquitectura de Ingresos y CRM" de marca blanca para empresas y contratistas hispanos en EE. UU.
- **Relación Comercial y Autoría (White-Label Engineering):**
  - AD Media Solution funciona como la **agencia comercial y socia de negocio** a través de la cual se comercializaron y vendieron muchos de los proyectos del portafolio.
  - Tienen su merecido crédito como la agencia que cerró, gestionó y canalizó las cuentas comerciales.
  - **Mario Morera operó como el socio técnico y líder de desarrollo frontend exclusivo tercerizado (White-Label Tech Partner)**, desarrollando la arquitectura de funnels, las landing pages, las interfaces web interactivas y las integraciones con CRM.
  - Por ello, AD Media Solution forma parte legítima y destacada del portafolio, con su propia portada de proyecto, banners corporativos oficiales y honrando la colaboración bilateral.
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
- **Catálogo de Assets de Marca en el Repo (`web/public/portfolio/brands/ad-media-solution/`):**
  - `banner.jpg`: Manual de identidad (1684×8356): logotipo, grilla de construcción, paleta, tipografía Nexa y papelería.
  - `ceo.jpg`: Fotografía corporativa del CEO (Danger Fernández), 1086×1448. Hasta el 2026-10-07 este archivo era una copia byte a byte de `banner.jpg`; se reemplazó por `Danger Fernández CEO.png` del repo del cliente.
  - `brand-grid.jpg`: la grilla de construcción del isotipo, recortada de `banner.jpg` (franja 1534–2484 px, 1684×950).
  - `logo-full-white.png`: Logotipo completo horizontal en blanco sobre transparente.
  - `logo-full.png`: Logotipo completo con isotipo azul y tipografía blanca.
  - `logo-icon.png`: Isotipo independiente en alta resolución.
  - `logo-crm.png`: Emblema oficial del módulo de CRM de Marca Blanca.
  - `mark.png` y `wordmark.png`: Variantes vectoriales optimizadas.

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


---

## 5. Cifras del Film y Material (verificado, 2026-10-07)

- **10 secciones** del funnel en `src/components/sections` (AuthoritySection, BlueprintSection, CRMSection, FooterContact, HeroSection, ProblemSection, ProjectsGallery, ScannerSection, ScrollytellingSection, ServicesSection).
- **4 pilares** de servicio (CRM & Automatización, Paid Ads, Social Media Growth, Desarrollo Web).
- **5 herramientas** integradas: GoHighLevel, Meta Ads Manager, Google Business Profile, Twilio / WhatsApp Business API y Stripe.
- **5 etapas** del pipeline (Lead nuevo → Calificado → Llamada agendada → Propuesta enviada → Ganado / Onboarding). `ServicesSection.tsx` también habla de "5 etapas automatizadas".
- **24 horas**: espera del Reputation Engine antes de pedir la reseña de Google Maps.
- **Speed-to-Lead "< 30 s"**: es la meta declarada del caso (`projectCases.ts` y diagrama de Archify). No hay una medición en el código. En el film aparece solo como "ventana objetivo", dentro de la simulación rotulada "Datos de ejemplo".
- **No usar** las cifras de marketing del sitio del cliente ("70 % de los leads…", "84 % de nuestros clientes…", "3.200 leads", "CPA reducido 67 %"): son afirmaciones comerciales de la agencia, sin auditoría.
- **Sitio en vivo** (`admediasolution.vercel.app`, 2026-10-07): hero con agenda directa, VSL del sistema comercial, testimonios en video, centro de comando comercial (Meta Ads, Google, WhatsApp → CRM) y formulario que califica por nivel de facturación.
  - Captura: `shots/site-recorrido.jpg` (1440×4752), con `scripts/capture-film-flows.ts ad-site`. El popup "Diagnóstico gratis" se cierra como lo haría una visita.
