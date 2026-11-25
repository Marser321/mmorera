/**
 * Propuesta de ejemplo para desarrollo y vistas previas: /p/ejemplo. Mismo
 * formato exacto que devuelve n8n (`propuestas.contenido`), con un negocio
 * ficticio: el repo es público y las propuestas reales no van acá. Nunca se
 * sirve en producción (ver `lib/propuestaFuente.ts`).
 */
export const SLUG_EJEMPLO = "ejemplo";

export const PROPUESTA_EJEMPLO = {
  demo: {
    url: "https://oficio.mmorera.agency",
    imagen: null,
    titulo: "Oficio para lavaderos: caja, clientes, reservas, recordatorios y web del negocio",
  },
  // El sitio no nombra países fuera de las páginas legales (D7, publicContent.test.ts): en el ejemplo va vacío.
  pais: null,
  slug: SLUG_EJEMPLO,
  rubro: "Lavaderos de autos",
  ciudad: "Montevideo",
  creado: "2026-11-25T21:29:46Z",
  idioma: "es",
  negocio: "Lavadero Sur",
  titular: "Lavadero Sur: tus tres sucursales en un solo sistema propio",
  situacion:
    "Lavadero Sur tiene tres sucursales en Montevideo (Pocitos, Cordón y Carrasco), con lavado a mano y detailing, y toma los turnos por WhatsApp y por teléfono.",
  diagnostico: [
    {
      titulo: "Tres sedes, cada una por su lado",
      captura: null,
      detalle:
        "Con tres sucursales, la caja, los clientes y el contacto con quien vuelve a lavar se reparten entre sedes. Tenerlos en un solo lugar te deja ver el día de cada sucursal y el de todo el negocio.",
    },
    {
      titulo: "Los turnos dependen de que alguien conteste",
      captura: null,
      detalle:
        "Las reservas llegan por WhatsApp y por teléfono, y no encontré una forma de reservar desde la web. Cada turno que entra fuera de hora espera a que alguien lo vea.",
    },
  ],
  como_quedaria: [
    "Cada sucursal de Lavadero Sur (Pocitos, Cordón y Carrasco) carga su caja en el mismo sistema, y vos ves cada sede y el total del día.",
    "Los clientes que vuelven quedan registrados una sola vez, con su auto y lo que se hicieron, laven en la sede que laven.",
    "Reservas desde la web y por WhatsApp que caen en la misma agenda, con recordatorio automático el día antes.",
    "La web de Lavadero Sur conectada al sistema: sucursales, servicios, horarios y el botón para reservar.",
  ],
  por_que_propio: [
    "Es software propio de Lavadero Sur, no una plataforma más con la marca de otro.",
    "Se aloja de tu lado: los datos de tus clientes y de tu caja quedan bajo tu control, con más seguridad y privacidad.",
    "Se arma a medida de cómo trabajan hoy tus sucursales, no al revés.",
    "Mario lo arma, lo mantiene y lo va mejorando con vos; si suma, también puede encargarse del marketing.",
  ],
  siguiente_paso: {
    email: null,
    texto:
      "Cuando te quede bien, lo vemos en una llamada corta: me contás cómo manejan hoy la caja y los turnos en cada sucursal y te muestro cómo funcionaría para Lavadero Sur. Si tenés alguna referencia (la planilla que usan hoy o lo que más les cuesta entre sedes), mandámela y la llevo preparada. Decime qué día te queda mejor y lo coordinamos.",
    whatsapp: "https://wa.me/59892323675",
  },
} as const;
