/**
 * Qué se muestra de cada caso en su galería: páginas reales del sitio y, en los
 * de una sola página, sus secciones. `section` es un selector si empieza con `#`
 * y, si no, un texto visible al que bajar. Quedan afuera las páginas de equipo,
 * CEO, lookbook, piercings o testimonios en video: ahí hay caras de personas sin
 * permiso para mostrarlas.
 *
 * Las rutas salen de scripts/discover-case-routes.ts.
 */
export interface GalleryView {
  id: string;
  path: string;
  label: { es: string; en: string };
  section?: string;
}

const view = (id: string, path: string, es: string, en: string, section?: string): GalleryView => ({ id, path, label: { es, en }, section });

export const GALLERY_TARGETS: Record<string, GalleryView[]> = {
  "ad-media-solution": [
    view("inicio", "/", "Inicio", "Home"),
    view("servicios", "/servicios", "Servicios", "Services"),
    view("comunidad", "/comunidad", "Comunidad", "Community"),
    view("planificacion", "/planificacion", "Planificación", "Planning"),
    view("operacion", "/", "Operación", "Operation", "Tu marketing, tu CRM y tu agenda"),
  ],
  "america-tramites": [
    view("inicio", "/", "Inicio", "Home"),
    view("emprender", "/emprender", "Emprender", "Start a business"),
    view("tramites", "/tramites", "Trámites", "Paperwork"),
    view("aprender", "/aprender", "Aprender", "Learn"),
    view("ruta", "/", "Clasificador", "Classifier", "#quiz"),
    view("contacto", "/contacto", "Contacto", "Contact"),
  ],
  "autohub-360": [
    view("inicio", "/", "Inicio", "Home"),
    view("catalogo", "/catalogo", "Catálogo", "Catalog"),
    view("ficha", "/catalogo/demo-1", "Ficha del vehículo", "Vehicle page"),
    view("servicios", "/servicios", "Servicios", "Services"),
    view("permutas", "/permutas", "Permutas", "Trade-ins"),
    view("contacto", "/contacto", "Agencias", "Dealers"),
  ],
  "doge-sm": [
    view("inicio", "/", "Inicio", "Home"),
    view("servicios", "/services", "Servicios", "Services"),
    view("membresias", "/membership", "Membresías", "Memberships"),
    view("tienda", "/store", "Tienda", "Store"),
    view("cotizar", "/booking", "Cotización", "Quote"),
  ],
  evowrap: [
    view("inicio", "/", "Inicio", "Home"),
    view("servicios", "/services", "Servicios", "Services"),
    view("ppf", "/services/ppf", "Paint Protection", "Paint protection"),
    view("ceramico", "/services/ceramic-coating", "Cerámico", "Ceramic coating"),
    view("diagnostico", "/booking", "Diagnóstico", "Diagnosis"),
    view("resultados", "/", "Resultados", "Results", "#transformation"),
  ],
  "hub-profesional-ai": [
    view("inicio", "/", "Inicio", "Home"),
    view("galeria", "/showcase", "Galería de plantillas", "Template gallery"),
    view("servicios", "/", "Servicios", "Services", "Servicios Elite"),
    view("casos", "/", "Casos", "Cases", "Casos de Éxito Real"),
    view("proceso", "/", "Proceso", "Process", "EL CAMINO A LA POTENCIA"),
    view("preguntas", "/", "Preguntas", "FAQ", "Preguntas Frecuentes"),
  ],
  "lb-elite-wash-detail": [
    view("inicio", "/", "Inicio", "Home"),
    view("rutas", "/", "Rutas de servicio", "Service routes", "#services"),
    view("cotizador", "/", "Cotizador", "Quote builder", "#quoter"),
    view("politicas", "/", "Políticas", "Policies", "#policies"),
  ],
  "lnb-saas": [
    view("inicio", "/", "Inicio", "Home"),
    view("pizza", "/pizza-studio", "Pizza Studio", "Pizza Studio"),
    view("burger", "/burger-studio", "Burger Studio", "Burger Studio"),
    view("torta", "/studio", "Cake Studio", "Cake Studio"),
    view("express", "/express", "Beach Express", "Beach Express"),
    view("pass", "/subscription", "LNB Pass", "LNB Pass"),
  ],
  "mr-studio-tattoo": [
    view("inicio", "/", "Inicio", "Home"),
    view("proyectos", "/", "Proyectos", "Projects", "Proyectos que hablan por nuestro trabajo"),
    view("estudio", "/", "Estudio", "Studio", "Innovación en la piel"),
    view("agenda", "/booking", "Agenda", "Booking"),
  ],
  "new-brothers-barberia": [
    view("inicio", "/", "Inicio", "Home"),
    view("reservar", "/reservar", "Reserva", "Booking"),
    view("tienda", "/tienda", "Tienda", "Store"),
    view("contacto", "/contacto", "Contacto", "Contact"),
    view("servicios", "/", "Servicios", "Services", "Nuestros Servicios"),
  ],
  "punta-360": [
    view("portal", "/", "Portal", "Portal"),
    view("propietarios", "/owners", "Propietarios", "Owners"),
    view("disciplinas", "/owners", "Producción", "Production", "Tour Inmersivo 3D"),
    view("agencias", "/enterprise", "Agencias", "Agencies"),
    view("planes", "/enterprise", "Planes", "Plans", "Agente Solo"),
  ],
  "rangel-oviedo-group": [
    view("inicio", "/", "Inicio", "Home"),
    view("metodo", "/", "Método", "Method", "Antes de mostrar propiedades"),
    view("seleccion", "/", "Selección", "Selection", "Propiedades en Texas, elegidas"),
    view("propiedades", "/propiedades", "Propiedades", "Properties"),
  ],
  "truckers-choice": [
    view("inicio", "/en", "Inicio", "Home"),
    view("servicios", "/en/services", "Servicios", "Services"),
    view("paquetes", "/en/packages", "Paquetes", "Packages"),
    view("seguro", "/en/services/truck-insurance", "Seguro de camión", "Truck insurance"),
    view("oficinas", "/en/locations", "Oficinas", "Locations"),
    view("recursos", "/en/resources", "Recursos", "Resources"),
  ],
};
