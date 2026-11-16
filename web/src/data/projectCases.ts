import type { LocalizedText, ProjectCase } from "@/types/site";

const t = (es: string, en: string): LocalizedText => ({ es, en });
const liveEvidence = t("Producto desplegado y captura del trabajo.", "Deployed product and project capture.");

export const PROJECT_CASES: ProjectCase[] = [
  {
    // Fuente: docs/films/dossiers/fenix.md (verificado contra el repo del cliente).
    // Publicable por autorización de Mario: sitio, arquitectura + GHL,
    // investigación, fábrica de contenido e ingeniería. Sin testimonios,
    // datos de pacientes, FENIX OS ni costos.
    slug: "fenix-medical-center",
    title: t("Fenix Medical Center", "Fenix Medical Center"),
    summary: t(
      "Atención primaria, longevidad y recuperación bajo supervisión médica: sitio bilingüe, reserva conectada al CRM y una fábrica de contenido que respeta la evidencia.",
      "Primary care, longevity and recovery under medical supervision: a bilingual site, booking connected to the CRM and a content factory that respects the evidence.",
    ),
    tracks: ["create", "build", "scale"],
    role: t(
      "Investigación, posicionamiento, sitio, arquitectura del CRM y fábrica de contenido.",
      "Research, positioning, website, CRM architecture and content factory.",
    ),
    challenge: t(
      "Comunicar terapias médicas sin prometer más de lo que la evidencia sostiene y convertir visitas en citas sin exponer datos de salud.",
      "Communicate medical therapies without promising more than the evidence supports, and turn visits into appointments without exposing health data.",
    ),
    constraints: [
      t("Cada afirmación médica con redacción permitida y prohibida.", "Every medical claim with permitted and prohibited wording."),
      t("Datos de salud fuera del formulario y de la publicidad.", "Health data kept out of the form and out of advertising."),
      t("Pacientes hispanos: sitio bilingüe y precios claros.", "Hispanic patients: a bilingual site and clear prices."),
    ],
    decisions: [
      t("Un registro interno de 109 afirmaciones con redacción permitida y prohibida (herramienta de trabajo; no se ve en el sitio).", "An internal registry of 109 claims with permitted and prohibited wording (a working tool; not shown on the site)."),
      t("Formulario de 7 campos sin texto libre, con llave fail-closed hacia GoHighLevel.", "A 7-field form with no free text and a fail-closed switch into GoHighLevel."),
      t("Reserva en 3 pasos contra la agenda real del CRM.", "A 3-step booking against the CRM's real calendar."),
      t("Una base interna de 1.096 videos médicos públicos para escribir guiones con búsqueda por palabras clave (herramienta de trabajo; no se ve en el sitio).", "An internal base of 1,096 public medical videos for writing scripts with keyword search (a working tool; not shown on the site)."),
    ],
    result: t(
      "Un sitio de 40 páginas en dos idiomas, con reserva conectada al CRM y una fábrica de contenido que no promete de más.",
      "A 40-page site in two languages, with booking connected to the CRM and a content factory that never overpromises.",
    ),
    evidence: [liveEvidence],
    stack: ["Next.js 16", "GoHighLevel", "next-intl", "Playwright"],
    media: [{ src: "/portfolio/brands/fenix-medical-center/shots/site-hbot.jpg", alt: t("Página de oxígeno hiperbárico de Fenix Medical Center", "Fenix Medical Center hyperbaric oxygen page") }],
    liveUrl: "https://fenixmedicalcenters.com",
    // «Pruébalo tú»: rutas verificadas en T28 (docs/triada/gemini/T28-pruebalo.md).
    tryIt: [
      { href: t("https://fenixmedicalcenters.com/es/contacto", "https://fenixmedicalcenters.com/en/contacto"), label: t("Mira el formulario sin texto libre", "See the form with no free-text field"), kind: "live", note: t("Es el sitio real de la clínica: míralo, no hace falta enviarlo.", "This is the clinic's live site: look around, no need to submit it.") },
    ],
    // Su propio sitio prohíbe los marcos (frame-ancestors 'none'): el iframe quedaría en blanco.
    embeddable: false,
    accent: "#cb9334",
    client: t("Fenix Medical Group Inc · Duluth, Georgia (EE. UU.)", "Fenix Medical Group Inc · Duluth, Georgia (USA)"),
    kind: t("Salud y longevidad", "Health and longevity"),
    // Ficha: todo sale del dossier y de las líneas de capacidades (capabilityCases.ts).
    proof: {
      problem: t("Comunicar terapias médicas sin prometer de más y convertir visitas en citas sin exponer datos de salud.", "Communicate medical therapies without overpromising, and turn visits into appointments without exposing health data."),
      now: t("Reserva en 3 pasos contra la agenda real del CRM, con un formulario de 7 campos sin texto libre.", "A 3-step booking against the CRM's real calendar, with a 7-field form and no free text."),
      metric: { value: "40", label: t("páginas en dos idiomas", "pages in two languages"), verified: true },
      humanStep: t("Una persona revisa cada cambio antes de producción; las pruebas las corren agentes.", "A person reviews every change before production; agents run the tests."),
    },
    soldVia: "ad-media",
    status: "featured",
  },
  {
    // Fuente: docs/films/dossiers/lb-wash.md (verificado contra el repo del cliente).
    // Operación: flota de 4 camionetas, catálogo de 88 productos y 142 precios,
    // arquitectura database-less sobre GoHighLevel y app móvil de cuadrilla.
    slug: "lb-elite-wash-detail",
    title: t("L&B Elite Wash & Detail", "L&B Elite Wash & Detail"),
    summary: t(
      "Detailing móvil a domicilio con flota de 4 camionetas: cotizador por vehículo con 88 servicios, balanceo determinista y CRM sin base de datos.",
      "On-site mobile detailing with a 4-van fleet: dynamic vehicle quoter across 88 services, deterministic load balancing and a database-less CRM.",
    ),
    tracks: ["create", "build", "scale"],
    role: t(
      "Dirección de marca, cotizador interactivo, ruteo de flota y arquitectura sin base de datos.",
      "Brand direction, interactive quoter, fleet routing and database-less architecture.",
    ),
    challenge: t(
      "Coordinar 4 camionetas autónomas en domicilios simultáneos y cobrar sin depender de una base de datos propia ni desincronizaciones.",
      "Coordinate 4 self-contained vans across concurrent home visits and bill without maintaining a dedicated database or desyncs.",
    ),
    constraints: [
      t("Una visita es una camioneta en una casa (duraciones acumuladas).", "A visit is one van at one address (additive durations)."),
      t("Catálogo real de 88 productos y 142 precios por carrocería.", "A real catalogue of 88 products and 142 vehicle prices."),
      t("Uso táctil por cuadrillas en exteriores con manos húmedas.", "Tactile usage by outdoor crews with wet hands."),
    ],
    decisions: [
      t("Arquitectura Database-less con Webhooks: GoHighLevel como único almacén de citas, contactos y facturas, orquestado 100% mediante webhooks.", "Database-less architecture with Webhooks: GoHighLevel as the single store for appointments, contacts and invoices, 100% webhook-orchestrated."),
      t("Cotizador dinámico por carrocería con retención temporal de 15 minutos.", "Dynamic body-type quoter with 15-minute temporary holds."),
      t("Ruteador determinista con balanceo entre las 4 camionetas y fallback ante colisiones.", "Deterministic router with 4-van load balancing and collision fallback."),
      t("App móvil ligera para la cuadrilla con resolución de parada en un toque.", "Lightweight mobile crew app with one-tap stop resolution."),
    ],
    result: t(
      "Una operación de 4 camionetas sincronizada en tiempo real, con reserva autoservicio y cero sobrecoste de base de datos.",
      "A 4-van operation synchronized in real time with self-service booking and zero database overhead.",
    ),
    evidence: [liveEvidence],
    stack: ["Vanilla JS", "GoHighLevel", "Serverless API", "Webhooks"],
    media: [{ src: "/portfolio/lb-elite-cover.jpg", alt: t("Sitio de L&B Elite Wash & Detail", "L&B Elite Wash & Detail website") }],
    liveUrl: "https://l-b-five.vercel.app/",
    // «Pruébalo tú»: rutas verificadas en T28 (docs/triada/gemini/T28-pruebalo.md).
    tryIt: [
      { href: t("https://l-b-five.vercel.app/#quoter", "https://l-b-five.vercel.app/#quoter"), label: t("Cotiza por vehículo", "Get a quote by vehicle"), kind: "live", note: t("Sitio real: puedes cotizar sin reservar.", "Live site: you can get a quote without booking.") },
    ],
    accent: "#1E6FE6",
    // Ficha: docs/films/dossiers/lb-wash.md (§ 1, 2 y 3).
    proof: {
      problem: t("Coordinar 4 camionetas en domicilios a la vez y cobrar sin choques de agenda.", "Coordinate 4 vans across home visits at the same time and bill without double bookings."),
      now: t("Cotiza solo entre 88 servicios y 142 precios, y guarda el turno 15 minutos hasta que llega el pago.", "It quotes on its own across 88 services and 142 prices, and holds the slot for 15 minutes until payment arrives."),
      metric: { value: "4", label: t("domicilios atendidos a la vez, sin choques de agenda", "home visits served at once, with no double bookings"), verified: true },
      fixed: t("Una base de datos propia junto al CRM guardaba cada reserva en dos lugares. Se sacó la base y el CRM quedó como único registro.", "A separate database next to the CRM kept every booking in two places. The database was removed and the CRM became the single record."),
      humanStep: t("La cuadrilla marca cada servicio como entregado desde su app, en la casa del cliente.", "The crew marks each service as delivered from its app, at the client's home."),
    },
    soldVia: "ad-media",
    status: "featured",
  },
  {
    slug: "new-brothers-barberia",
    title: t("New Brothers Barbería", "New Brothers Barbershop"),
    summary: t("Barbería premium con reserva online y un CRM propio: agenda, clientes, caja y liquidaciones en un solo panel.", "A premium barbershop with online booking and its own CRM: schedule, clients, cash and barber payouts in one panel."),
    tracks: ["build", "scale"],
    role: t("Producto, arquitectura de datos y desarrollo full-stack.", "Product, data architecture and full-stack development."),
    challenge: t("Reunir reservas, clientes, caja y liquidaciones de una barbería en un solo sistema, sin depender de un CRM externo.", "Bring a barbershop's bookings, clients, cash and payouts into one system, without depending on an external CRM."),
    constraints: [t("Decisiones rápidas desde el teléfono.", "Quick decisions on mobile."), t("Cuatro roles con permisos distintos: cliente, barbero, gerente y admin.", "Four roles with different permissions: client, barber, manager and admin.")],
    decisions: [t("Reserva en seis pasos, una decisión por paso.", "Six-step booking, one decision per step."), t("Un CRM propio sobre Supabase en lugar de uno externo.", "Its own CRM on Supabase instead of an external one."), t("Las reglas del negocio viven en la base: agenda sin solapes, cierre de caja y liquidaciones.", "Business rules live in the database: no double booking, cash close and barber payouts.")],
    result: t("La reserva se vuelve autoservicio y el negocio se gestiona desde su propio panel: agenda, clientes, caja, stock y liquidaciones.", "Booking becomes self-service and the business runs from its own panel: schedule, clients, cash, stock and payouts."),
    evidence: [liveEvidence],
    stack: ["Next.js", "Supabase", "PostgreSQL", "POS", t("IA", "AI")],
    media: [{ src: "/portfolio/nb-barber-cover.jpg", alt: t("Sitio de New Brothers Barbería", "New Brothers Barbershop website") }],
    liveUrl: "https://nb-barber.vercel.app/",
    // «Pruébalo tú»: rutas verificadas en T28 (docs/triada/gemini/T28-pruebalo.md).
    tryIt: [
      { href: t("https://nb-barber.vercel.app/reservar", "https://nb-barber.vercel.app/reservar"), label: t("Prueba la reserva en 6 pasos", "Try the 6-step booking"), kind: "demo" },
      { href: t("https://nb-barber.vercel.app/admin-login", "https://nb-barber.vercel.app/admin-login"), label: t("Entra al CRM", "Open the CRM"), kind: "demo", note: t("Con el botón de acceso demo; incluye el asistente con base de conocimiento.", "Use the demo access button; it includes the assistant with its knowledge base.") },
    ],
    accent: "#D4AF37",
    // Ficha: docs/films/dossiers/otros-casos.md (New Brothers). No tiene cobro en línea.
    proof: {
      problem: t("Reunir reservas, clientes, caja y liquidaciones de una barbería en un solo sistema, sin un CRM externo.", "Bring a barbershop's bookings, clients, cash and payouts into one system, without an external CRM."),
      now: t("Reserva en 6 pasos y un panel propio con agenda, clientes, caja, stock y liquidaciones.", "A 6-step booking and its own panel with schedule, clients, cash, stock and payouts."),
      metric: { value: "14", label: t("secciones en un solo panel, de la agenda a las liquidaciones", "sections in one panel, from the schedule to the payouts"), verified: true },
      humanStep: t("El cobro lo hace una persona en el mostrador: efectivo, tarjeta, transferencia o Mercado Pago.", "A person takes payment at the counter: cash, card, transfer or Mercado Pago."),
    },
    status: "featured",
  },
  {
    slug: "truckers-choice",
    title: t("Truckers Choice", "Truckers Choice"),
    summary: t(
      "Seguros, permisos y cumplimiento para transportistas: sitio bilingüe con rutas espejo, 6 líneas de servicio con 30 trámites y cotización en 3 pasos.",
      "Insurance, permits and compliance for truckers: a bilingual site with mirrored routes, 6 service lines with 30 filings and a 3-step quote.",
    ),
    tracks: ["build", "scale"], role: t("Arquitectura, UX bilingüe y frontend.", "Architecture, bilingual UX and frontend."),
    challenge: t(
      "Ordenar seguros, autoridad DOT, placas, permisos y cumplimiento en un solo recorrido, en inglés y en español.",
      "Bring insurance, DOT authority, plates, permits and compliance into one journey, in English and Spanish.",
    ),
    constraints: [t("Uso móvil y dos idiomas con el mismo diseño.", "Mobile use and two languages with the same design.")],
    decisions: [
      t("Rutas espejo /en y /es con los mismos segmentos.", "Mirrored /en and /es routes with the same segments."),
      t("Catálogo en 6 líneas y una hoja de ruta de 4 pasos.", "A 6-line catalog and a 4-step roadmap."),
      t("Cotización por pasos: qué resolver, la operación y el contacto.", "A step-by-step quote: what to solve, the operation and contact."),
    ],
    result: t(
      "Un solo lugar para empezar cualquier trámite, en el idioma del transportista. El formulario está hoy en modo vista previa.",
      "One place to start any filing, in the trucker's language. The form is in preview mode today.",
    ),
    evidence: [liveEvidence],
    stack: ["Next.js", "Tailwind CSS", "i18n /en · /es", t("Cotización por pasos", "Multi-step quoting")], media: [{ src: "/portfolio/truckers-cover.webp", alt: t("Web de Truckers Choice", "Truckers Choice website") }],
    liveUrl: "https://truckers-choice-web-site.vercel.app/",
    // «Pruébalo tú»: rutas verificadas en T38 (docs/triada/gemini/T38-pruebalo.md).
    tryIt: [
      { href: t("https://truckers-choice-web-site.vercel.app/es/contact", "https://truckers-choice-web-site.vercel.app/en/contact"), label: t("Prueba la cotización en 3 pasos", "Try the 3-step quote"), kind: "live", note: t("Sitio real: puedes recorrer los pasos sin enviar la solicitud.", "Live site: you can go through the steps without sending the request.") },
    ],
    demoUrl: "https://truckers-choice-web-site.vercel.app/en",
    accent: "#FFB020",
    // Ficha: docs/films/dossiers/truckers-choice.md (§ 3 y 5).
    proof: {
      problem: t("Reunir seguros, autoridad DOT, placas y permisos en un solo recorrido, en inglés y en español.", "Bring insurance, DOT authority, plates and permits into one journey, in English and Spanish."),
      now: t("30 trámites ordenados en 6 líneas, con una cotización en 3 pasos en los dos idiomas.", "30 filings organized into 6 lines, with a 3-step quote in both languages."),
      metric: { value: "30", label: t("trámites en 6 líneas, en dos idiomas", "filings in 6 lines, in two languages"), verified: true },
      pending: t("El formulario de cotización está en vista previa: falta conectarlo para que las solicitudes lleguen.", "The quote form is in preview mode: it still has to be connected so requests arrive."),
    },
    soldVia: "ad-media",
    status: "featured",
  },
  {
    // Demo propia de portfolio, con marca ficticia. Fuente: README.md de `viajes-demo` y la demo
    // publicada (16/11). Todas las escenas son generadas con IA: no hay personas reales.
    // No lleva la línea de AD Media: es un proyecto propio.
    slug: "vespera",
    title: t("Vespera", "Vespera"),
    summary: t(
      "Una agencia de viajes ficticia, «Europa para dos»: la portada es un vuelo que se recorre con el scroll, con la ventanilla, el avión entre nubes y la llegada a cada ciudad.",
      "A fictional travel agency, “Europe for two”: the home page is a flight you scroll through, with the window, the plane among clouds and the arrival in each city.",
    ),
    tracks: ["create", "build"],
    role: t("Demo propia de portfolio: dirección de arte, escenas generadas con IA y desarrollo.", "My own portfolio demo: art direction, AI-generated scenes and development."),
    challenge: t(
      "Que la web de una agencia de viajes a medida se viva como el viaje desde la primera pantalla, y no como un catálogo de paquetes.",
      "Make a tailor-made travel agency's website feel like the trip from the first screen, not like a catalogue of packages.",
    ),
    constraints: [
      t("Marca, nombre y pasajes ficticios: no representa a ninguna agencia real.", "A fictional brand, name and tickets: it doesn't represent any real agency."),
      t("Todas las escenas y las imágenes son generadas con IA; no hay personas reales.", "Every scene and image is AI-generated; there are no real people."),
      t("El vuelo se guía con el scroll y también se puede recorrer con el movimiento reducido.", "The flight is driven by scroll and can also be viewed with reduced motion."),
    ],
    decisions: [
      t("La portada es el vuelo: la ventanilla, el avión de perfil y la llegada a cada ciudad entre nubes.", "The home page is the flight: the window, the plane in profile and the arrival in each city through the clouds."),
      t("El avión visto desde arriba es la transición: descubre la ciudad que sigue por detrás de sus alas.", "The plane seen from above is the transition: it reveals the next city behind its wings."),
      t("Cada destino deja su tarjeta y un sello de pasaporte, y el pie de la página es el pasaje.", "Each destination leaves its card and a passport stamp, and the page footer is the boarding pass."),
      t("«Tu ruta»: un globo donde el recorrido se arma por ciudades, con la tarjeta de embarque para dos.", "“Your route”: a globe where the trip is built city by city, with a boarding pass for two."),
      t("Postales en profundidad: cada ciudad en capas, con el avión que rompe el marco.", "Postcards with depth: each city in layers, with the plane breaking out of the frame."),
    ],
    result: t(
      "Una demo publicada, en español y en inglés, que muestra cómo queda una landing de viajes contada como cine.",
      "A published demo, in Spanish and English, that shows what a travel landing page looks like when it's told as cinema.",
    ),
    evidence: [t("Demo publicada con marca ficticia y escenas generadas con IA.", "Published demo with a fictional brand and AI-generated scenes.")],
    stack: ["Next.js", "React", "TypeScript", "GSAP", "MapLibre", t("Video e imágenes con IA", "AI video and images")],
    media: [{ src: "/portfolio/trailers/vespera-poster.jpg", alt: t("El avión de Vespera de perfil sobre un mar de nubes", "The Vespera plane in profile above a sea of clouds") }],
    liveUrl: "https://vespera-demo-psi.vercel.app/",
    tryIt: [
      { href: t("https://vespera-demo-psi.vercel.app/", "https://vespera-demo-psi.vercel.app/en"), label: t("Recorre el vuelo de Vespera", "Take the Vespera flight"), kind: "demo", note: t("Marca ficticia. Baja con el scroll: el avión cruza entre ciudad y ciudad.", "Fictional brand. Scroll down: the plane crosses between one city and the next.") },
    ],
    embeddable: false,
    accent: "#F08A72",
    year: "2026",
    kind: t("Demo propia · Agencia de viajes", "Own demo · Travel agency"),
    proof: {
      problem: t("Que una agencia de viajes a medida se sienta como el viaje desde la primera pantalla.", "Make a tailor-made travel agency feel like the trip from the first screen."),
      now: t("Un vuelo guiado por el scroll, un armador de ruta sobre el globo y postales en profundidad.", "A scroll-driven flight, a route builder on a globe and postcards with depth."),
      metric: { value: "6", label: t("destinos con su llegada entre nubes y su sello de pasaporte", "destinations with their arrival through the clouds and their passport stamp"), verified: true },
      humanStep: t("El armador de ruta entrega una primera idea; las rutas, las fechas y la disponibilidad las confirma una persona.", "The route builder gives a first idea; a person confirms routes, dates and availability."),
      pending: t("Es una demo con marca ficticia: no vende viajes ni toma reservas.", "It's a demo with a fictional brand: it doesn't sell trips or take bookings."),
    },
    trailer: {
      mp4: "/portfolio/trailers/vespera.mp4",
      webm: "/portfolio/trailers/vespera.webm",
      poster: "/portfolio/trailers/vespera-poster.jpg",
      seconds: 27,
      caption: t(
        "El vuelo de la portada, de corrido: la ventanilla, el avión y la llegada a Venecia, París y Granada. Escenas generadas con IA.",
        "The home page flight, start to finish: the window, the plane and the arrival in Venice, Paris and Granada. AI-generated scenes.",
      ),
    },
    status: "featured",
  },
  {
    // Producto propio. Fuente: oportunidades/crm-propio-relevamiento.md (recorrido del 15/11
    // sobre la demo pública con datos sintéticos) y el repo Marser321/lava.
    slug: "oficio",
    title: t("Oficio", "Oficio"),
    summary: t(
      "Mi CRM para negocios de oficio: agenda, atención, caja, equipo y automatizaciones por WhatsApp, con la web de reservas de cada negocio. Se arma por módulos y por rubro.",
      "My CRM for service businesses: schedule, customer messages, cash, team and WhatsApp automations, plus each business's booking site. It's built from modules, per industry.",
    ),
    tracks: ["build", "scale"],
    role: t("Producto propio: diseño, desarrollo y operación en mi servidor.", "My own product: design, development and running it on my server."),
    challenge: t(
      "Que un lavadero, una barbería o un gimnasio manejen el día entero desde un solo lugar, sin papelitos ni planillas sueltas.",
      "Let a car wash, a barbershop or a gym run the whole day from one place, with no paper notes or loose spreadsheets.",
    ),
    constraints: [
      t("El mismo núcleo tiene que servir a rubros distintos.", "The same core has to serve different industries."),
      t("Lo usan en el mostrador y en el piso, desde el teléfono.", "It's used at the counter and on the floor, from a phone."),
      t("Cada negocio con su marca, sus sucursales y su dominio.", "Each business with its own brand, branches and domain."),
    ],
    decisions: [
      t("Un núcleo con módulos que se prenden y se apagan por negocio.", "One core with modules that each business turns on or off."),
      t("Una sola bandeja para WhatsApp, la web y el asistente con IA.", "One inbox for WhatsApp, the website and the AI assistant."),
      t("Siete automatizaciones por rubro: confirmación, recordatorios a 24 h y a 2 h, pedido de opinión y clientes inactivos a 60 días, entre otras.", "Seven automations per industry: confirmation, reminders 24 h and 2 h before, review requests and customers inactive for 60 days, among others."),
      t("Marca blanca: logo, color, web pública y dominio propio para cada negocio.", "White label: logo, color, public website and custom domain for each business."),
    ],
    result: t(
      "Una demo pública con cuatro rubros (lavadero, barbería, estética y gimnasio) y seis roles, con datos sintéticos.",
      "A public demo with four industries (car wash, barbershop, beauty and gym) and six roles, with synthetic data.",
    ),
    evidence: [t("Demo pública con datos sintéticos.", "Public demo with synthetic data.")],
    stack: ["TypeScript", "Fastify", "PostgreSQL", "Docker", "WhatsApp", t("IA", "AI")],
    media: [{ src: "/portfolio/brands/oficio/cover.webp", alt: t("Portada de Oficio: un taller de lavado de noche", "Oficio cover: a car-wash bay at night") }],
    liveUrl: "https://oficio.mmorera.agency/",
    tryIt: [
      { href: t("https://oficio.mmorera.agency/", "https://oficio.mmorera.agency/"), label: t("Entra a la demo de un lavadero", "Open the car-wash demo"), kind: "demo", note: t("Datos sintéticos: elige Lavadero y el rol Dueño. No hace falta cuenta.", "Synthetic data: choose Car wash and the Owner role. No account needed.") },
    ],
    embeddable: false,
    accent: "#1F5246",
    year: "2026",
    kind: t("Producto propio · CRM", "Own product · CRM"),
    proof: {
      problem: t("Que un negocio de oficio maneje agenda, atención y caja en un solo lugar, sin papelitos.", "Let a service business run its schedule, customer messages and cash in one place, with no paper notes."),
      now: t("Agenda, caja, inventario, equipo con comisiones y reportes en un panel, más la web de reservas de cada negocio.", "Schedule, cash, inventory, team commissions and reports in one panel, plus each business's booking site."),
      metric: { value: "4", label: t("rubros con su propia demo: lavadero, barbería, estética y gimnasio", "industries with their own demo: car wash, barbershop, beauty and gym"), verified: true },
      humanStep: t("La caja se abre y se cierra a mano en cada sucursal, con el efectivo esperado a la vista.", "Cash is opened and closed by hand at each branch, with the expected amount on screen."),
    },
    status: "featured",
  },
  {
    // Producto propio, sin publicar. Fuente: README.md y PRODUCT.md del repo Marser321/tecargo
    // (Desktop/tecargo). Reel: corte de 4–10 s del film de lanzamiento, sin voseo en pantalla.
    slug: "te-cargo",
    title: t("te_Cargo", "te_Cargo"),
    summary: t(
      "Una red para reservar cargadores de autos eléctricos de particulares, hoteles y comercios: mapa, reservas, cobro con preautorización y una línea de turismo con carga en destino.",
      "A network to book electric-car chargers from private hosts, hotels and shops: map, bookings, pre-authorized payments and a tourism line with destination charging.",
    ),
    tracks: ["create", "build"],
    role: t("Producto propio: producto, diseño y desarrollo full-stack.", "My own product: product, design and full-stack development."),
    challenge: t(
      "Que un conductor reserve el cargador de un particular o de un comercio con la misma confianza que uno público, y que el anfitrión cobre sin sorpresas.",
      "Let a driver book a private host's or a shop's charger with the same confidence as a public one, and let the host get paid with no surprises.",
    ),
    constraints: [
      t("Tres perfiles en una misma cuenta: conductor, anfitrión o los dos.", "Three profiles in one account: driver, host or both."),
      t("Cobro por kWh solo con el medidor verificado; si no, por hora.", "Per-kWh pricing only with a verified meter; otherwise, by the hour."),
      t("Métricas sin guardar la IP ni quién generó cada evento.", "Metrics without storing the IP or who triggered each event."),
    ],
    decisions: [
      t("Preautorización con un margen configurable y tope de una hora de sobreestadía: el anfitrión nunca cobra más de lo retenido.", "Pre-authorization with a configurable margin and a one-hour overstay cap: the host never charges more than what was held."),
      t("Tres ofertas que no se miden igual: cargador, comercio y campaña.", "Three offers measured differently: charger, business and campaign."),
      t("Todo lo que crea una cuenta de demostración queda marcado y se puede ocultar del sitio público.", "Everything a demo account creates is flagged and can be hidden from the public site."),
      t("Una propuesta aparte para inversores e instituciones, con tres destinos turísticos y un comparador económico.", "A separate proposal for investors and institutions, with three tourist destinations and an economic comparison tool."),
    ],
    result: t(
      "La plataforma funciona en desarrollo, con anfitriones de prueba en todo el mapa, y la propuesta se usa para acordar un piloto. Todavía no está publicada.",
      "The platform runs in development, with test hosts across the map, and the proposal is used to agree on a pilot. It isn't published yet.",
    ),
    evidence: [t("Build local y film de lanzamiento.", "Local build and launch film.")],
    stack: ["React Router", "React", "TypeScript", "SQLite", "Mercado Pago", "Docker"],
    media: [{ src: "/portfolio/reels/te-cargo-poster.jpg", alt: t("Tarjeta de un cargador en te_Cargo, con precio, conector y horario", "A te_Cargo charger card with price, connector and hours") }],
    accent: "#1F6B45",
    year: "2026",
    kind: t("Producto propio · Movilidad eléctrica", "Own product · Electric mobility"),
    proof: {
      problem: t("Reservar el cargador de un particular o de un comercio con la misma confianza que uno público.", "Book a private host's or a shop's charger with the same confidence as a public one."),
      now: t("Mapa, reservas, sesiones de carga con evidencias y disputas, para conductores y anfitriones.", "Map, bookings, charging sessions with evidence and disputes, for drivers and hosts."),
      metric: { value: "3", label: t("perfiles en una misma cuenta: conductor, anfitrión o los dos", "profiles in one account: driver, host or both"), verified: true },
      humanStep: t("Administración verifica el medidor de cada cargador antes de permitir el cobro por kWh.", "An admin verifies each charger's meter before per-kWh pricing is allowed."),
      pending: t("Todavía no está publicada: se presenta a inversores e instituciones para acordar un piloto.", "It isn't published yet: it's being presented to investors and institutions to agree on a pilot."),
    },
    status: "featured",
  },
  {
    slug: "rangel-oviedo-group",
    title: t("Rangel Oviedo Group", "Rangel Oviedo Group"),
    summary: t(
      "Asesoría inmobiliaria privada y bilingüe en Texas: El Método Rangel en 5 etapas, diagnóstico por 4 perfiles y curaduría residencial.",
      "Private bilingual real estate advisory in Texas: The 5-stage Rangel Method, 4-profile diagnostic and residential curation.",
    ),
    tracks: ["create", "scale"],
    role: t("Dirección de marca digital, diseño web y arquitectura del recorrido de contacto.", "Digital brand direction, web design and contact-journey architecture."),
    challenge: t("Posicionar una asesoría privada en un mercado saturado de portales genéricos.", "Position a private advisory in a market saturated with generic listing portals."),
    constraints: [
      t("Audiencia bilingüe en español e inglés.", "A bilingual Spanish and English audience."),
      t("Confianza como requisito antes del primer contacto.", "Trust required before first contact."),
    ],
    decisions: [
      t("El Método Rangel: 5 etapas estructuradas antes de abrir listados.", "The Rangel Method: 5 structured stages before opening listings."),
      t("Diagnóstico por 4 perfiles: inversor, compra familiar, vendedor y relocation.", "Diagnostic across 4 profiles: investor, family purchase, seller and relocation."),
      t("Selector de idioma instantáneo en el cliente sin recargas ni rutas secundarias.", "Instant client-side language selector without page reloads or subpaths."),
    ],
    result: t("Una presencia que se siente de asesoría privada y conduce a una consulta directa.", "A presence that feels like a private advisory and leads to a direct consultation."),
    evidence: [liveEvidence],
    stack: ["Next.js", "Tailwind CSS", "Playfair Display", "i18n EN/ES"],
    media: [{ src: "/portfolio/rangel-oviedo-cover.jpg", alt: t("Sitio de Rangel Oviedo Group", "Rangel Oviedo Group website") }],
    liveUrl: "https://rangeloviedo-tor8.vercel.app/",
    // «Pruébalo tú»: rutas verificadas en T38 (docs/triada/gemini/T38-pruebalo.md).
    tryIt: [
      { href: t("https://rangeloviedo-tor8.vercel.app/#perfiles", "https://rangeloviedo-tor8.vercel.app/#perfiles"), label: t("Mira el diagnóstico por 4 perfiles", "See the 4-profile diagnosis"), kind: "live" },
    ],
    embeddable: false,
    accent: "#C9A864",
    status: "featured",
  },
  {
    slug: "mr-studio-tattoo",
    title: t("Mr. Studio Tattoo", "Mr. Studio Tattoo"),
    summary: t(
      "Estudio de tatuajes en Miami: reserva guiada en 10 pasos con selector anatómico, artista elegido y consentimiento según la edad.",
      "A Miami tattoo studio: a guided 10-step booking with an anatomical selector, a chosen artist and age-based consent.",
    ),
    tracks: ["create", "build"],
    role: t("Dirección visual, frontend interactivo y el flujo de reserva con consentimiento.", "Visual direction, interactive frontend and the booking flow with consent."),
    challenge: t("Calificar cada solicitud antes de la sesión, sin el ida y vuelta interminable por mensajes.", "Qualify every request before the session, without the endless back-and-forth over messages."),
    constraints: [
      t("Selector anatómico de frente y de espalda, cómodo en el celular.", "A front-and-back anatomical selector that works on a phone."),
      t("Consentimiento distinto para adultos (digital) y menores (notarizado y con tutor).", "Different consent for adults (digital) and minors (notarized, with a guardian)."),
    ],
    decisions: [
      t("Una pregunta por pantalla: edad, servicio, artista, tamaño, zona y concepto antes de los datos.", "One question per screen: age, service, artist, size, placement and concept before contact details."),
      t("Fecha y hora directamente con el artista; el depósito se cobra al confirmar.", "Date and time directly with the artist; the deposit is charged on confirmation."),
    ],
    result: t("Cada cita llega al artista con zona, tamaño, concepto y consentimiento resueltos.", "Every appointment reaches the artist with placement, size, concept and consent settled."),
    evidence: [liveEvidence],
    stack: ["React", "Tailwind CSS", t("Reserva por pasos", "Multi-step booking"), t("Consentimiento digital", "Digital consent")],
    media: [{ src: "/portfolio/mrstudio-tattoo-cover.jpg", alt: t("Sitio de Mr. Studio Tattoo", "Mr. Studio Tattoo website") }],
    liveUrl: "https://www.mrstudiotattoo.com/",
    // «Pruébalo tú»: rutas verificadas en T38 (docs/triada/gemini/T38-pruebalo.md).
    tryIt: [
      { href: t("https://www.mrstudiotattoo.com/booking", "https://www.mrstudiotattoo.com/booking"), label: t("Prueba la reserva guiada con selector anatómico", "Try the guided booking with the body selector"), kind: "live", note: t("Es el estudio real: recórrela sin confirmar la reserva.", "This is the real studio: go through it without confirming a booking.") },
    ],
    accent: "#2A4DE8",
    status: "featured",
  },
  {
    // Source: output/portfolio-v1/canavacation. Static-only until Mario's case cinematic is ready.
    slug: "cana-vacations",
    title: t("Cana Vacations", "Cana Vacations"),
    summary: t(
      "Experiencia bilingüe de viajes en Punta Cana para explorar excursiones, comparar planes Classic y VIP y preparar una cotización guiada. Se muestra una implementación local; no se verificó que coincida con el dominio activo.",
      "A bilingual Punta Cana travel experience to explore excursions, compare Classic and VIP plans, and prepare a guided quote. This is a local implementation; its match to the active domain has not been verified.",
    ),
    tracks: ["create", "build"],
    role: t(
      "Estructura del producto, diseño visual y desarrollo frontend de un recorrido de viaje bilingüe.",
      "Product structure, visual design and frontend development for a bilingual travel journey.",
    ),
    challenge: t(
      "Hacer más fácil comparar excursiones, entender las opciones de transporte y preparar una solicitud sin perderse entre pasos.",
      "Make it easier to compare excursions, understand pickup options and prepare an enquiry without losing the thread.",
    ),
    constraints: [
      t("La experiencia presenta contenido en español e inglés.", "The experience presents content in Spanish and English."),
      t("Los planes Classic y VIP se muestran junto a la selección de excursiones.", "Classic and VIP plans are presented alongside excursion selection."),
      t("La cotización considera cantidad de viajeros y zona de pickup antes del formulario guiado.", "The quote flow considers traveler count and pickup zone before the guided form."),
    ],
    decisions: [
      t("Separar descubrimiento, selección del plan y solicitud de cotización en etapas legibles.", "Separate discovery, plan selection and quote request into legible steps."),
      t("Usar una cotización guiada que calcula un total y presenta el depósito opcional como desglose, sin afirmar que se haya procesado un pago.", "Use a guided quote that calculates a total and presents an optional deposit breakdown, without claiming that a payment was processed."),
      t("Mantener la jerarquía del escritorio y reorganizar acciones y contenido para la pantalla móvil.", "Keep the desktop hierarchy while reorganizing actions and content for mobile."),
    ],
    result: t(
      "La implementación local conecta exploración, elección del plan y preparación de la cotización. No se verificó el despliegue actual ni se afirman reservas o ingresos.",
      "The local implementation connects discovery, plan selection and quote preparation. The current deployment has not been verified, and no booking or revenue results are claimed.",
    ),
    evidence: [t(
      "Capturas de la implementación local en escritorio y móvil; el estado del dominio activo no está verificado.",
      "Desktop and mobile captures of the local implementation; the active domain status is unverified.",
    )],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    media: [
      { src: "/portfolio/brands/cana-vacations/atlas-litoral-cana-cover.webp", alt: t("Portada estática de Cana Vacations con capturas de escritorio y móvil", "Cana Vacations static cover with desktop and mobile captures") },
      { src: "/portfolio/brands/cana-vacations/shots/desktop.png", alt: t("Página de inicio de la implementación local de Cana Vacations en escritorio", "Cana Vacations local implementation homepage on desktop") },
      { src: "/portfolio/brands/cana-vacations/shots/mobile.png", alt: t("Página de inicio de la implementación local de Cana Vacations en móvil", "Cana Vacations local implementation homepage on mobile") },
    ],
    accent: "#1C7EA8",
    kind: t("Viajes · implementación local", "Travel · local implementation"),
    status: "archive",
    cinematicPending: true,
  },
  {
    slug: "autohub-360",
    title: t("AutoHub 360", "AutoHub 360"),
    summary: t("Un catálogo de vehículos que convierte la exploración 360° en parte natural de la compra.", "A vehicle catalogue that makes 360° exploration a natural part of the buying journey."),
    tracks: ["create", "build"],
    role: t("Diseño de experiencia, interfaz y desarrollo WebGL.", "Experience design, interface and WebGL development."),
    challenge: t("Presentar inventario automotor inmersivo sin convertir cada consulta en una carga pesada o frágil.", "Present immersive vehicle inventory without turning every visit into a heavy or fragile load."),
    constraints: [
      t("Imágenes 360° de alto peso.", "Heavy 360° image assets."),
      t("Uso frecuente desde móviles.", "Frequent mobile usage."),
    ],
    decisions: [
      t("Carga progresiva y jerarquía visual centrada en el vehículo.", "Progressive loading and a visual hierarchy centred on the vehicle."),
      t("Interacción 360° directa, sin controles innecesarios.", "Direct 360° interaction without unnecessary controls."),
    ],
    result: t("El catálogo se siente más tangible y mantiene un recorrido claro desde la exploración hasta la consulta.", "The catalogue feels more tangible while keeping a clear path from exploration to enquiry."),
    evidence: [liveEvidence],
    stack: ["Next.js", "WebGL", "Three.js", "Tailwind CSS"],
    media: [{ src: "/portfolio/autohub-cover-v2.webp", alt: t("Interfaz de AutoHub 360", "AutoHub 360 interface") }],
    liveUrl: "https://auto-indol-five.vercel.app/",
    accent: "#DC2626",
    status: "archive",
  },
  {
    slug: "lnb-saas",
    title: t("La Nueva Brasil", "La Nueva Brasil"),
    summary: t("Plataforma gastronómica y SaaS operativo para pastelería y cafetería de especialidad con configuradores interactivos, fidelización Crumb Club y suscripciones LNB Pass.", "Gastronomic platform and operational SaaS for specialty bakery and coffee shop with interactive studios, Crumb Club loyalty, and LNB Pass subscriptions."),
    tracks: ["build", "scale"],
    role: t("Arquitectura de información, diseño de producto y desarrollo.", "Information architecture, product design and development."),
    challenge: t("Integrar pedidos rápidos de playa, personalización de tortas por capas y fidelización recurrente en una única experiencia sin fricción.", "Integrate beach express orders, layer-by-layer cake customization, and recurring customer loyalty into a seamless experience."),
    constraints: [t("Múltiples unidades de negocio (cafetería, panadería, catering, tortas a medida).", "Multiple business units (coffee shop, bakery, catering, custom cakes)."), t("Operación en temporada de alta demanda en Punta del Este.", "High-demand seasonal operation in Punta del Este.")],
    decisions: [t("Modular la plataforma en Craving Studios dedicados (Cake Studio, Pizza, Burger, Empanadas).", "Modularize the platform into dedicated Craving Studios (Cake Studio, Pizza, Burger, Empanadas)."), t("Implementar club de puntos Crumb Club y membresía LNB Pass con retiro express sin filas.", "Implement Crumb Club rewards and LNB Pass membership with zero-queue express pickup.")],
    result: t("Una plataforma que reúne pedidos con retiro express programado, tortas por capas, el club de puntos Crumb Club y la suscripción LNB Pass.", "One platform bringing together scheduled express pickup orders, layer-by-layer cakes, the Crumb Club points program and the LNB Pass subscription."),
    evidence: [liveEvidence],
    stack: ["Next.js", "React", "Tailwind CSS", "Product Design"],
    media: [{ src: "/portfolio/lnb-saass.webp", alt: t("Dashboard de La Nueva Brasil", "La Nueva Brasil platform dashboard") }],
    liveUrl: "https://lnb-saass.vercel.app/",
    accent: "#D97706",
    status: "archive",
  },
  {
    slug: "hub-profesional-ai",
    title: t("Hub Profesional", "Hub Profesional"),
    summary: t(
      "Plataforma de plantillas premium y herramientas de autoridad para profesionales independientes, con la suite insignia de Mecánica Premium.",
      "Premium template platform and authority engines for independent professionals, featuring the flagship Mechanics suite.",
    ),
    tracks: ["create", "build"],
    role: t("Dirección de diseño, arquitectura frontend y desarrollo de plantillas.", "Design direction, frontend architecture and template development."),
    challenge: t("Elevar la percepción de valor de profesionales independientes mediante herramientas de autoridad que transformen tráfico en clientes calificados.", "Elevate the perceived value of independent professionals with authority tools that transform traffic into qualified clients."),
    constraints: [t("6 rubros con necesidades narrativas y cromáticas distintas.", "6 industries with distinct narrative and color requirements."), t("Estética Dark Mode de alta gama y carga instantánea.", "High-end Dark Mode aesthetics with instant page loads.")],
    decisions: [t("Construir sobre Next.js 15 con metamorfosis dinámica de estilos en el cliente.", "Build on Next.js 15 with dynamic client-side style transitions."), t("Desplegar la suite de Mecánica Premium como caso insignia de alta fidelidad.", "Deploy the Mechanics suite as the high-fidelity flagship showcase.")],
    result: t("Una plataforma con 6 plantillas por rubro, diseño mobile-first y cambio de especialidad en vivo.", "A platform with 6 field templates, mobile-first design and live specialty switching."),
    evidence: [liveEvidence],
    stack: ["Next.js 15", "Tailwind CSS", "Dark Mode", "Authority Templates"],
    media: [{ src: "/portfolio/brands/hub-profesional-ai/shots/hero.jpg", alt: t("Interfaz de Hub Profesional", "Hub Profesional interface") }],
    liveUrl: "https://profecionalcv.vercel.app/",
    accent: "#FF3B30",
    status: "archive",
  },
  {
    slug: "evowrap",
    title: t("EvoWrap", "EvoWrap"),
    summary: t("Una experiencia visual para presentar personalización vehicular con una percepción más premium.", "A visual experience that presents vehicle customisation with a more premium feel."),
    tracks: ["create", "build"],
    role: t("Dirección visual, diseño de interacción y frontend.", "Visual direction, interaction design and frontend."),
    challenge: t("Traducir un servicio físico y visual a una experiencia digital que impulse la consulta.", "Translate a physical, visual service into a digital experience that encourages enquiries."),
    constraints: [t("Material visual protagonista.", "Visual material as the protagonist."), t("Necesidad de velocidad y claridad comercial.", "Need for speed and commercial clarity.")],
    decisions: [t("Usar el vehículo y los acabados como navegación visual.", "Use the vehicle and finishes as visual navigation."), t("Contener el motion para conservar una lectura premium.", "Keep motion restrained to preserve a premium reading experience.")],
    result: t("La marca gana una presentación más propia y un camino de contacto fácil de entender.", "The brand gains a more distinctive presentation and an easy-to-understand contact path."),
    evidence: [liveEvidence],
    stack: ["Next.js", "Motion", "Creative Direction", "SEO"],
    media: [{ src: "/portfolio/evowrap.webp", alt: t("Experiencia web de EvoWrap", "EvoWrap web experience") }],
    liveUrl: "https://evowrap.vercel.app/",
    accent: "#F59E0B",
    status: "archive",
  },
  {
    slug: "ad-media-solution",
    title: t("AD Media Solution", "AD Media Solution"),
    summary: t(
      "Arquitectura de ingresos y desarrollo frontend de funnels: socio de ingeniería de marca blanca para la agencia que impulsó la venta del portfolio.",
      "Revenue architecture and funnel frontend: white-label engineering partner for the commercial agency that drove portfolio sales.",
    ),
    tracks: ["create", "scale"],
    role: t(
      "Socio de ingeniería y líder de desarrollo frontend tercerizado: diseño de funnels, webapps y automatización de CRM.",
      "White-label engineering partner & frontend lead: funnel architecture, webapps and CRM automation.",
    ),
    challenge: t(
      "Desarrollar funnels de alta conversión y portales de cliente de marca blanca comercializados por la agencia en EE. UU.",
      "Develop high-converting funnels and white-label client portals commercialized by the agency across the US.",
    ),
    constraints: [
      t("Experiencia 100% marca blanca: el cliente opera con su propio dominio e identidad.", "100% white-label experience: clients operate under their own domain and identity."),
      t("Velocidad de respuesta crítica: Speed-to-Lead automatizado en menos de 30 segundos.", "Critical speed-to-lead: automated contact in under 30 seconds."),
      t("Integración con pauta de Meta Ads y Google Ads.", "Direct integration with Meta Ads and Google Ads campaigns."),
    ],
    decisions: [
      t("Frontend en Next.js con scanner diagnóstico interactivo para auditar y calificar prospectos al vuelo.", "Next.js frontend featuring an interactive diagnostic scanner to audit and qualify leads on the fly."),
      t("Pipeline Kanban automatizado con avance de etapas por eventos y sincronización de agenda.", "Automated Kanban pipeline advancing stages via events and calendar synchronization."),
      t("Motor de reputación que dispara solicitudes automáticas de reseñas en Google Maps tras el servicio.", "Reputation engine triggering automated Google Maps review requests after delivery."),
    ],
    result: t(
      "Una infraestructura de venta predecible y funnels de alta conversión operando bajo marca blanca con total autonomía.",
      "Predictable sales infrastructure and high-converting funnels operating autonomously under white-label.",
    ),
    evidence: [liveEvidence],
    stack: ["Next.js", "GoHighLevel", "Tailwind CSS", "Funnels", "Stripe"],
    media: [
      { src: "/portfolio/brands/ad-media-solution/banner.webp", alt: t("Banner de AD Media Solution", "AD Media Solution banner") },
      { src: "/portfolio/admedia-cover.png", alt: t("Sitio de AD Media Solution", "AD Media Solution website") },
    ],
    liveUrl: "https://admediasolution.vercel.app/",
    accent: "#0066FF",
    status: "archive",
  },
  {
    slug: "punta-360",
    title: t("Punta 360", "Punta 360"),
    summary: t(
      "Marketing visual y plataforma de producción inmobiliaria premium en Punta del Este: fotografía editorial, tours inmersivos 3D, cinematografía aérea y planes de suscripción para agentes.",
      "Visual marketing and luxury real-estate production platform in Punta del Este: editorial photography, 3D immersive tours, aerial cinematography and agent subscriptions.",
    ),
    tracks: ["create", "build", "scale"],
    role: t(
      "Dirección visual, plataforma web, catálogo de producción multimedia y arquitectura de planes.",
      "Visual direction, web platform, multimedia production catalog and tier architecture.",
    ),
    challenge: t(
      "Transformar la presentación de propiedades de lujo reduciendo la fricción para compradores a distancia y estandarizando la producción para agencias.",
      "Elevate luxury property presentation to eliminate friction for remote buyers while standardizing production for agencies.",
    ),
    constraints: [
      t("Contenido visual de altísima resolución optimizado para carga ágil.", "Ultra high-resolution visual assets optimized for rapid loading."),
      t("Presentación de 4 disciplinas de producción y comparación técnica HDR.", "Presentation of 4 production disciplines and technical HDR comparison."),
      t("Tres perfiles operativos: propietarios, agentes y equipo interno.", "Three operational profiles: owners, agents and internal team."),
    ],
    decisions: [
      t("Estructura de 4 disciplinas de marketing: Fotografía Editorial, Tour Inmersivo 3D, Cinematografía Aérea y Redes.", "Structure of 4 marketing disciplines: Editorial Photography, 3D Immersive Tour, Aerial Cinematography and Socials."),
      t("Proceso estandarizado en 4 pasos: Agenda, Producción Visual, Lanzamiento Global y Cierre.", "Standardized 4-step workflow: Booking, Visual Production, Global Launch and Closing."),
      t("Catálogo de suscripciones para agentes con 3 niveles: Agente Solo, Agencia Growth y Scale.", "Agent subscription catalog with 3 tiers: Agente Solo, Agencia Growth and Scale."),
      t("Comparador interactivo de calidad: HDR Profesional vs Foto Celular.", "Interactive quality comparison demo: Professional HDR vs Mobile Photo."),
    ],
    result: t(
      "Una plataforma visual que reúne fotografía editorial, tours 3D, video aéreo y planes para agentes en un solo catálogo.",
      "A visual platform bringing editorial photography, 3D tours, aerial video and agent plans together in one catalog.",
    ),
    evidence: [liveEvidence],
    stack: ["Next.js", "Tailwind CSS", "Geist", "Multimedia"],
    media: [{ src: "/portfolio/brands/punta-360/shots/owners.jpg", alt: t("Portal de Punta360", "Punta360 portal") }],
    liveUrl: "https://punta-360.vercel.app/",
    accent: "#F59E0B",
    status: "archive",
  },
  {
    slug: "america-tramites",
    title: t("América Trámites", "América Trámites"),
    summary: t(
      "Asistencia administrativa y educación documental para la comunidad hispana: clasificador de intención, catálogo por familias y derivación responsable.",
      "Administrative assistance and document education for the Hispanic community: intent classifier, family catalog and responsible referral.",
    ),
    tracks: ["build", "scale"],
    role: t("Diseño de flujo, arquitectura de información y frontend interactivo.", "Flow design, information architecture and interactive frontend."),
    challenge: t(
      "Clarificar opciones y alcance documental para una comunidad vulnerable a falsas promesas o desinformación.",
      "Clarify options and document scope for a community vulnerable to false promises or misinformation.",
    ),
    constraints: [
      t("Límites éticos y legales visibles: sin asesoría legal ni falsas garantías.", "Visible ethical and legal boundaries: no legal advice or false guarantees."),
      t("Acceso móvil y derivación directa a WhatsApp con contexto.", "Mobile access and direct WhatsApp routing with context."),
    ],
    decisions: [
      t("Clasificador interactivo de entrada por tres rutas: emprender, tramitar y aprender.", "Inbound interactive classifier across three routes: enterprise, filings and learning."),
      t("Catálogo de cuatro trámites en tres familias con alcance y checklist previo.", "Catalog of four filings across three families with scope and preliminary checklist."),
      t("Formulario contextual que valida en cliente y deriva directamente sin guardar datos.", "Contextual form validating in-client and routing directly without storing data."),
    ],
    result: t(
      "Un portal con transparencia institucional donde la persona entiende el alcance antes de solicitar apoyo.",
      "An institutional portal with transparency where users understand the scope before seeking support.",
    ),
    evidence: [liveEvidence],
    stack: ["React", "Tailwind CSS", "Vite", t("Validación en cliente", "Client-side validation")],
    media: [{ src: "/portfolio/america-cover.webp", alt: t("Portal de América Trámites", "América Trámites portal") }],
    liveUrl: "https://atreact.vercel.app/",
    accent: "#BE0000",
    status: "archive",
  },
  {
    slug: "doge-sm",
    title: t("DOGE.S.M LLC", "DOGE.S.M LLC"),
    summary: t(
      "Limpieza técnica y preservación de activos inmobiliarios en Miami: catálogo de membresías en 3 niveles, flujo de solicitud en 4 pasos y tienda de insumos profesionales.",
      "Technical cleaning and architectural asset preservation in Miami: 3-tier membership catalog, 4-step request flow and professional supplies store.",
    ),
    tracks: ["create", "build"],
    role: t(
      "Dirección visual Titanium Noir, experiencia digital, catálogo de membresías y frontend.",
      "Titanium Noir visual direction, digital experience, membership catalog and frontend.",
    ),
    challenge: t(
      "Presentar un servicio de mantenimiento de alta gama con transparencia técnica en métodos y estructura clara de precios por frecuencia.",
      "Present a high-end maintenance service with technical transparency across methods and clear cadence pricing.",
    ),
    constraints: [
      t("Presupuesto dependiente de evaluación técnica presencial del inmueble.", "Estimate subject to preliminary on-site property technical evaluation."),
      t("Especialidades técnicas con equipamiento comercial (WFP agua pura, presión calibrada).", "Technical disciplines with commercial equipment (WFP pure water, calibrated pressure)."),
      t("Acceso ágil y derivación directa a WhatsApp sin fricción administrativa.", "Agile access and direct WhatsApp routing without administrative friction."),
    ],
    decisions: [
      t("Oferta por niveles en 3 membresías (Essential, Signature y Estate) con cadencias de 30, 14 y 7 días.", "Tiered offer in 3 memberships (Essential, Signature and Estate) with 30, 14 and 7 day cadences."),
      t("Flujo de solicitud en 4 etapas: alcance, estimado técnico, agenda de cuadrilla y reporte de control fotográfico.", "4-step request flow: scope, technical estimate, crew scheduling and photographic inspection report."),
      t("Presentación técnica de 3 especialidades: Cristales WFP sin químicos, Presión Calibrada y Extracción Térmica.", "Technical breakdown of 3 disciplines: chemical-free WFP glass, calibrated pressure and thermal extraction."),
      t("Catálogo de insumos profesionales organizado en 7 departamentos de tienda.", "Professional supplies catalog organized across 7 store departments."),
    ],
    result: t(
      "Una presencia digital con estética Titanium Noir y un catálogo transparente de métodos, membresías e insumos.",
      "A digital presence with Titanium Noir aesthetics and a transparent catalog of methods, memberships and supplies.",
    ),
    evidence: [liveEvidence],
    stack: ["Next.js", "Tailwind CSS", "TypeScript", t("Catálogo de tienda", "Store catalog")],
    media: [{ src: "/portfolio/brands/doge-sm/shots/hero.jpg", alt: t("Portal de DOGE.S.M LLC", "DOGE.S.M LLC portal") }],
    liveUrl: "https://doge-27dp.vercel.app/",
    accent: "#D62828",
    status: "archive",
  },

];

export const FEATURED_CASES = PROJECT_CASES.filter((project) => project.status === "featured");
export const ARCHIVE_CASES = PROJECT_CASES.filter((project) => project.status === "archive");

export function getProjectCase(slug: string) {
  return PROJECT_CASES.find((project) => project.slug === slug);
}
