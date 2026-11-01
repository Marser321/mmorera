import { layoutProblems } from "@/components/films/scenes/brand/layout/dataText";
import { FORBIDDEN_CLAIMS } from "@/data/films/flagships/flagshipAssertions";
import { FLAGSHIP_SLUGS } from "@/data/films/flagships/slugs";
import { PROJECT_CASES } from "@/data/projectCases";
import { plain, reelBeatLayout, reelCasoLayout, reelFirmaLayout, slideLayout, type ImageSizes } from "./layout";
import { archivosChatGPT, archivosEsperados } from "./render";
import { diapositivasDe, reelCasoBeats, reelTextoBeats, videoSeconds } from "./timing";
import { DURACION_MAXIMA, ESTADOS, PLATAFORMAS, RAMAS, SOCIAL_FORMATS, type Diapositiva, type Estado, type Pieza, type Plataforma, type Salida } from "./types";

/**
 * Validador de una pieza de redes (node: lo usan check-pieza, contenido.ts y
 * los tests). No toca el disco: el entorno le pasa lo que hay en la carpeta.
 * Errores bloquean el paso a "listo"; los avisos solo informan.
 */

export type Problema = { nivel: "error" | "aviso"; donde: string; mensaje: string };

export type Entorno = {
  /** Nombre de la carpeta de la pieza (debe ser su id). */
  carpeta: string;
  /** Contenido de copy.md (undefined si no existe). */
  copy?: string;
  /** Medida de la imagen elegida para un slot (imagenes/<slot>.png|jpg|webp), si existe. */
  imagen: (slot: string) => { w: number; h: number } | undefined;
  /** Archivos presentes en salida/. */
  salida: string[];
  /** Medida de un archivo de imagenes/ por su nombre (las diapositivas de ChatGPT), si existe. */
  archivoImagen?: (file: string) => { w: number; h: number } | undefined;
};

const ESTADO_INDEX = (estado: Estado) => ESTADOS.indexOf(estado);
const LISTO = ESTADO_INDEX("listo");

/** Secciones de copy.md por plataforma. */
export const SECCION_COPY: Record<Plataforma, string> = {
  linkedin: "## LinkedIn",
  instagram: "## Instagram",
  tiktok: "## TikTok y Shorts",
  shorts: "## TikTok y Shorts",
  x: "## X",
};

/** Lo que nunca va en público: además de las afirmaciones de resultado. */
const PROHIBIDO = [new RegExp("Uru" + "guay", "i"), /FENIX OS/i];

/** Palabras muy comunes en inglés: si aparecen varias, la pieza no está en español. */
const INGLES = /\b(the|and|with|your|you|for|this|that|from|what|how)\b/gi;

function textosDeDiapositiva(slide: Diapositiva): string[] {
  switch (slide.tipo) {
    case "portada":
      return [slide.kicker, slide.titulo, slide.bajada].filter(Boolean) as string[];
    case "texto":
      return [slide.kicker, slide.titulo, slide.cuerpo].filter(Boolean) as string[];
    case "lista":
      return [slide.kicker, slide.titulo, ...slide.items].filter(Boolean) as string[];
    case "cita":
      return [slide.kicker, slide.cita, slide.autor].filter(Boolean) as string[];
    case "comparacion":
      return [slide.kicker, slide.titulo, slide.antes.rotulo, slide.antes.texto, slide.despues.rotulo, slide.despues.texto].filter(Boolean) as string[];
    case "imagen":
      return [slide.kicker, slide.titulo, slide.pie].filter(Boolean) as string[];
    case "cierre":
      return [slide.titulo, slide.cta, slide.enlace].filter(Boolean) as string[];
    case "tarjeta":
      return [slide.kicker, slide.texto].filter(Boolean) as string[];
    case "encuesta":
      return [slide.pregunta, ...slide.opciones];
    case "sorteo":
      return [slide.premio, ...slide.pasos, slide.cierre, slide.bases];
  }
}

export function textosDeSalida(salida: Salida): string[] {
  if (salida.plantilla === "reel-texto") return [salida.gancho, ...salida.pulsos.flatMap((p) => [p.kicker, p.texto].filter(Boolean) as string[]), salida.remate, salida.cta];
  if (salida.plantilla === "reel-caso") return [salida.gancho, ...salida.decisiones, salida.cierre];
  return diapositivasDe(salida).flatMap(textosDeDiapositiva);
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isText = (value: unknown) => typeof value === "string" && value.trim().length > 0;

export function validarPieza(raw: unknown, entorno: Entorno): Problema[] {
  const problemas: Problema[] = [];
  const error = (donde: string, mensaje: string) => problemas.push({ nivel: "error", donde, mensaje });
  const aviso = (donde: string, mensaje: string) => problemas.push({ nivel: "aviso", donde, mensaje });

  // 1. Forma general.
  if (!isObject(raw)) return [{ nivel: "error", donde: "pieza.json", mensaje: "no es un objeto JSON" }];
  const pieza = raw as Pieza;
  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(String(pieza.id))) error("id", `"${pieza.id}" no tiene la forma AAAA-MM-DD-slug`);
  if (pieza.id !== entorno.carpeta) error("id", `no coincide con la carpeta (${entorno.carpeta})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(pieza.fecha)) || !String(pieza.id).startsWith(String(pieza.fecha))) error("fecha", "debe ser AAAA-MM-DD y abrir el id");
  if (!RAMAS.includes(pieza.rama)) error("rama", `"${pieza.rama}" no es una rama (${RAMAS.join(", ")})`);
  if (!ESTADOS.includes(pieza.estado)) error("estado", `"${pieza.estado}" no es un estado (${ESTADOS.join(", ")})`);
  if (!isText(pieza.titulo)) error("titulo", "falta el título interno");
  if (!Array.isArray(pieza.salidas) || pieza.salidas.length === 0) {
    error("salidas", "la pieza no tiene salidas");
    return problemas;
  }
  const estadoIndex = ESTADO_INDEX(pieza.estado);

  // 2. Fuente.
  if (pieza.fuente?.tipo === "caso" && !PROJECT_CASES.some((item) => item.slug === pieza.fuente?.slug)) error("fuente", `el caso "${pieza.fuente?.slug}" no existe en el sitio`);

  // 3. Imágenes declaradas y su medida.
  const slots = new Map((pieza.imagenes ?? []).map((slot) => [slot.slot, slot]));
  const sizes: ImageSizes = {};
  for (const slot of pieza.imagenes ?? []) {
    if (!isText(slot.prompt)) error(`imagenes.${slot.slot}`, "falta el prompt");
    const want = SOCIAL_FORMATS[slot.formato];
    const have = entorno.imagen(slot.slot);
    if (have) {
      sizes[slot.slot] = have;
      const ratio = have.w / have.h / (want.width / want.height);
      if (Math.abs(ratio - 1) > 0.03) error(`imagenes.${slot.slot}`, `mide ${have.w}×${have.h}; el formato ${slot.formato} pide ${want.width}×${want.height} (misma proporción)`);
    } else if (estadoIndex >= LISTO) error(`imagenes.${slot.slot}`, "falta la imagen (imagenes/<slot>.png)");
    else aviso(`imagenes.${slot.slot}`, "imagen pendiente: la genera el agente con ChatGPT");
  }

  // 4. Cada salida.
  const ids = new Set<string>();
  const plataformas = new Set<Plataforma>();
  const visibles: string[] = [];
  for (const salida of pieza.salidas) {
    const donde = `salidas.${salida.id}`;
    if (!/^[a-z0-9-]+$/.test(String(salida.id))) error(donde, "el id de la salida solo lleva minúsculas, números y guiones");
    if (ids.has(salida.id)) error(donde, "id repetido");
    ids.add(salida.id);
    if (!Array.isArray(salida.para) || salida.para.length === 0) error(donde, "falta `para` (plataformas)");
    for (const p of salida.para ?? []) {
      if (!PLATAFORMAS.includes(p)) error(donde, `"${p}" no es una plataforma`);
      plataformas.add(p);
    }
    visibles.push(...textosDeSalida(salida));

    const slides = diapositivasDe(salida);
    if (salida.plantilla === "carrusel") {
      if (slides.length < 3 || slides.length > 10) error(donde, `un carrusel lleva de 3 a 10 diapositivas (tiene ${slides.length})`);
      if (slides[0]?.tipo !== "portada") aviso(donde, "conviene abrir con una portada (gancho)");
      if (slides.at(-1)?.tipo !== "cierre") aviso(donde, "conviene cerrar con un llamado a la acción");
    }
    if (salida.plantilla === "desafio") {
      for (const key of ["titulo", "contexto", "problema", "decision", "resultado", "aprendizaje"] as const) if (!isText(salida[key])) error(donde, `falta ${key}`);
    }
    if (salida.plantilla === "reel-texto") {
      if (!Array.isArray(salida.pulsos) || salida.pulsos.length < 2 || salida.pulsos.length > 6) error(donde, "un reel de texto lleva de 2 a 6 pulsos");
      if (plain(salida.gancho).split(/\s+/).length > 14) aviso(donde, "el gancho pasa las 14 palabras: se lee lento");
    }
    if (salida.plantilla === "reel-caso") {
      if (!(FLAGSHIP_SLUGS as readonly string[]).includes(salida.caso)) error(donde, `"${salida.caso}" no tiene film insignia (placas og/hero)`);
      if (!Array.isArray(salida.decisiones) || salida.decisiones.length !== 3) error(donde, "un reel de caso lleva exactamente 3 decisiones");
    }

    // Geometría: cada diapositiva y cada pulso entra en su zona segura.
    const formato = salida.plantilla === "carrusel" || salida.plantilla === "desafio" || salida.plantilla === "imagen" ? salida.formato : "reel";
    slides.forEach((slide, index) => {
      if (slide.tipo === "imagen" && !slots.has(slide.imagen)) error(`${donde}.${index + 1}`, `la imagen "${slide.imagen}" no está declarada en "imagenes"`);
      if (slide.tipo === "encuesta") {
        if (slide.opciones.length < 2 || slide.opciones.length > 4) error(`${donde}.${index + 1}`, "una encuesta lleva de 2 a 4 opciones");
        for (const option of slide.opciones) if (option.length > 25) error(`${donde}.${index + 1}`, `"${option}" pasa los 25 caracteres (límite de las encuestas nativas)`);
      }
      const layout = slideLayout(formato, slide, slides.length > 1 ? { n: index + 1, total: slides.length } : undefined, sizes);
      for (const problem of layoutProblems(layout.blocks, layout.safe)) error(`${donde}.${index + 1}`, problem);
    });
    if (salida.plantilla === "reel-texto") {
      for (const beat of reelTextoBeats(salida)) {
        const layout = beat.rol === "firma" ? reelFirmaLayout(beat.texto) : reelBeatLayout(beat.texto, beat.rol === "pulso" ? "pulso" : beat.rol === "remate" ? "remate" : "gancho", beat.kicker);
        for (const problem of layoutProblems(layout.blocks, layout.safe)) error(`${donde}.${beat.id}`, problem);
      }
    }
    if (salida.plantilla === "reel-caso") {
      const nombre = PROJECT_CASES.find((item) => item.slug === salida.caso)?.title.es ?? salida.caso;
      for (const beat of reelCasoBeats(salida, nombre)) {
        const layout =
          beat.rol === "firma"
            ? reelFirmaLayout(beat.texto, `mmorera.agency/casos-de-exito/${salida.caso}`)
            : beat.rol === "remate"
              ? reelBeatLayout(beat.texto, "remate")
              : reelCasoLayout(beat.texto, beat.kicker ?? "", Boolean(beat.placa));
        for (const problem of layoutProblems(layout.blocks, layout.safe)) error(`${donde}.${beat.id}`, problem);
      }
    }

    // Versión de ChatGPT: o el juego completo, con la proporción del formato, o ninguna (se usa el código).
    const gpt = archivosChatGPT(salida);
    if (gpt.length) {
      const want = SOCIAL_FORMATS[formato];
      const present = gpt.filter((file) => entorno.archivoImagen?.(file));
      if (present.length === 0) aviso(donde, `versión de ChatGPT pendiente (${gpt.length} diapositiva/s): mientras falte se publica la de código`);
      else if (present.length < gpt.length) error(donde, `faltan ${gpt.length - present.length} de ${gpt.length} diapositivas de ChatGPT (${gpt.filter((file) => !present.includes(file)).join(", ")})`);
      for (const file of present) {
        const have = entorno.archivoImagen!(file)!;
        if (Math.abs(have.w / have.h / (want.width / want.height) - 1) > 0.03) error(donde, `${file} mide ${have.w}×${have.h}; el formato pide ${want.width}×${want.height}`);
      }
    }

    // Duración por plataforma.
    const seconds = videoSeconds(salida, "Caso");
    for (const p of salida.para ?? []) if (seconds > DURACION_MAXIMA[p]) error(donde, `dura ${seconds.toFixed(1)} s; ${p} admite ${DURACION_MAXIMA[p]} s`);
  }

  // 5. Honestidad y reglas de marca (pantalla y copy).
  const todo = [...visibles, entorno.copy ?? ""];
  for (const value of todo) {
    for (const pattern of [...FORBIDDEN_CLAIMS, ...PROHIBIDO]) if (pattern.test(value)) error("honestidad", `"${value.slice(0, 80)}" coincide con ${pattern}`);
  }
  if (pieza.ejemplo && !visibles.some((value) => /ejemplo/i.test(value))) error("honestidad", "la pieza usa datos de ejemplo y ninguna pantalla lo dice");
  for (const value of visibles) if ((value.match(INGLES) ?? []).length >= 3) aviso("idioma", `"${value.slice(0, 60)}" parece estar en inglés`);

  // 6. Copy por plataforma.
  if (pieza.estado !== "idea") {
    if (entorno.copy === undefined) error("copy.md", "falta copy.md");
    else for (const p of plataformas) if (!entorno.copy.includes(SECCION_COPY[p])) error("copy.md", `falta la sección "${SECCION_COPY[p]}"`);
  }

  // 7. Renders cuando la pieza está lista.
  if (estadoIndex >= LISTO) {
    for (const file of archivosEsperados(pieza)) if (!entorno.salida.includes(file)) error("salida", `falta ${file} (npx tsx scripts/render-social.ts ${pieza.id})`);
  }
  if (pieza.postura && estadoIndex < ESTADO_INDEX("aprobado")) aviso("postura", "es una opinión: Mario ajusta la postura antes de aprobar");
  if (pieza.estado === "publicado" && !(pieza.publicaciones ?? []).length) error("publicaciones", "una pieza publicada lleva la URL de cada publicación");

  return problemas;
}
