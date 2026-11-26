#!/usr/bin/env node
/**
 * Escribe piezas/<id>/chatgpt.md con los pedidos a ChatGPT para las dos
 * versiones de la pieza (Mario elige una en Telegram):
 *
 * - ARTE (versión A): imágenes SIN NINGUNA LETRA, una por slot de
 *   `pieza.imagenes`, con la franja vacía donde el código pone el texto.
 *   Se guardan en imagenes/<slot>.png (`contenido.ts arte` las recorta).
 * - ENTERA (versión B): ChatGPT diseña cada diapositiva completa, con el
 *   texto exacto. Se guardan en imagenes/gpt-<salida>-NN.png
 *   (`contenido.ts importar` las recorta y firma el cierre con el monograma).
 *
 * Los sistemas de diseño salen de contenido/marca/imagenes-chatgpt.md (ARTE)
 * y contenido/marca/chatgpt-diseno.md (ENTERA). Al abrir cada conversación
 * se adjuntan las referencias de contenido/marca/referencias/.
 *
 * Uso, desde web/:
 *   npx tsx scripts/chatgpt-prompts.ts 2026-10-25-mas-barato-otro-rol
 *   npx tsx scripts/chatgpt-prompts.ts --pendientes      (las que todavía no tienen sus imágenes)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { FRANJA_TEXTO } from "../src/data/social/layout";
import { archivosChatGPT, formatoDe, usaChatGPT } from "../src/data/social/render";
import { diapositivasDe, tonoDeDiapositiva } from "../src/data/social/timing";
import { fondoDe, SOCIAL_FORMATS, type Diapositiva, type Formato, type Pieza, type Salida, type Tono } from "../src/data/social/types";
import { carpetaDe, CONTENIDO, imagenDe, leerPieza, listarPiezas } from "./lib/piezas";

const FORMATO: Record<Formato, string> = {
  feed: "4:5 vertical (1080×1350)",
  cuadrado: "1:1 cuadrado (1080×1080)",
  reel: "9:16 vertical (1080×1920)",
};

const FONDO: Record<Tono, string> = {
  oscuro: "FONDO PARED (#0B0B0A, negro mate con grano) con texto marfil (#ECE7DD)",
  claro: "FONDO MARFIL (#ECE7DD, papel con grano) con texto pared (#0B0B0A)",
};

const plain = (text: string) => text.replace(/\*/g, "");
const q = (text: string) => `"${plain(text)}"`;
const two = (n: number) => String(n).padStart(2, "0");
const pct = (n: number) => `${Math.round(n * 100)} %`;

/** Frases marcadas con *asteriscos* → instrucción de énfasis. */
function enfasis(texts: Array<string | undefined>) {
  const marks = texts.flatMap((text) => [...(text ?? "").matchAll(/\*([^*]+)\*/g)].map((match) => `"${match[1]}"`));
  return marks.length ? `ÉNFASIS (barra sólida del color opuesto detrás, letras del color del fondo): ${marks.join(", ")}.` : "";
}

/** Bloque entre <!-- marca --> y <!-- /marca --> de un documento de contenido/marca. */
function bloque(archivo: string, marca: string) {
  const doc = readFileSync(path.join(CONTENIDO, "marca", archivo), "utf8");
  const start = doc.indexOf(`<!-- ${marca} -->`);
  const end = doc.indexOf(`<!-- /${marca} -->`);
  if (start < 0 || end < 0) throw new Error(`Falta el bloque <!-- ${marca} --> en contenido/marca/${archivo}`);
  return doc.slice(start + `<!-- ${marca} -->`.length, end).trim();
}

/** Referencias aprobadas por Mario (se adjuntan al abrir cada conversación). */
function referencias() {
  const dir = path.join(CONTENIDO, "marca", "referencias");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((file) => /\.(png|jpe?g|webp)$/i.test(file)).sort();
}

/* ─── ARTE (versión A) ─── */

type Uso = { salida: string; n: number; tipo: Diapositiva["tipo"] };

/** Dónde se usa cada slot: de fondo (con texto encima) o en la placa de una diapositiva de imagen. */
function usosDeSlots(pieza: Pieza) {
  const usos = new Map<string, Uso[]>();
  for (const salida of pieza.salidas) {
    diapositivasDe(salida).forEach((slide, index) => {
      const slot = fondoDe(slide) ?? (slide.tipo === "imagen" ? slide.imagen : undefined);
      if (slot) usos.set(slot, [...(usos.get(slot) ?? []), { salida: salida.id, n: index + 1, tipo: slide.tipo }]);
    });
  }
  return usos;
}

/** La franja que el arte deja vacía: la más alta que pida cualquiera de sus usos de fondo. */
function franjaDe(usos: Uso[]) {
  const fondos = usos.filter((uso) => uso.tipo in FRANJA_TEXTO).map((uso) => FRANJA_TEXTO[uso.tipo as keyof typeof FRANJA_TEXTO]);
  return fondos.length ? Math.max(...fondos) : 0;
}

function pedidoArte(pieza: Pieza, slot: NonNullable<Pieza["imagenes"]>[number], usos: Uso[]) {
  const franja = franjaDe(usos);
  const { width, height } = SOCIAL_FORMATS[slot.formato];
  const donde = usos.map((uso) => `${uso.salida} ${two(uso.n)} (${uso.tipo})`).join(", ") || "sin uso todavía";
  const lines = [
    `ARTE · slot "${slot.slot}" · formato ${FORMATO[slot.formato]} · se usa en: ${donde}`,
    `Escena: ${slot.prompt}`,
    franja
      ? `ZONA VACÍA: el ${pct(franja)} de abajo de la imagen es pared oscura, lisa y en calma: sin objetos, sin brillos fuertes, sin detalles. Ahí va el texto. El sujeto vive en el ${pct(1 - franja)} de arriba, mejor hacia la derecha.`
      : "Composición: un solo sujeto, centrado o en un tercio, con aire alrededor (va en una placa, sin texto encima).",
    "NINGUNA LETRA: ni texto, ni números, ni carteles, ni pantallas con contenido, ni logos, aunque sean ilegibles.",
    `Entregá la imagen en ${width}×${height} o en esa proporción.`,
  ];
  return lines.join("\n");
}

/* ─── ENTERA (versión B) ─── */

/** Composición, textos exactos y recurso gráfico de cada tipo de diapositiva. */
function cuerpo(slide: Diapositiva, n: number, pieza: Pieza, formato: Formato): string[] {
  const kicker = "kicker" in slide && slide.kicker ? [`Rótulo arriba a la izquierda (monoespaciada, mayúsculas, chica, con una raya corta debajo): ${q(slide.kicker)}`] : [];
  const arco = "Recurso gráfico: un arco grueso de anillo (como el aro de un monograma), con textura de piedra marfil, que entra por la esquina de arriba a la derecha, al 30 % de opacidad, y se funde hacia el centro. Nunca pasa por encima del texto.";
  switch (slide.tipo) {
    case "portada":
      return [
        "TIPO: portada (gancho).",
        ...kicker,
        `Título enorme, en la tipografía ancha y geométrica, apoyado abajo (tercio inferior): ${q(slide.titulo)}`,
        ...(slide.bajada ? [`Bajada en la grotesca, tamaño mediano, debajo del título: ${q(slide.bajada)}`] : []),
        arco,
        `Abajo al centro: "DESLIZÁ" en monoespaciada chica con una flecha fina hacia la derecha.`,
        enfasis([slide.titulo]),
      ];
    case "texto": {
      // Si el rótulo ya numera ("01 · Contexto"), el número gigante usa ese.
      const numero = slide.kicker?.match(/^(\d{1,2})(?!\d)/)?.[1] ?? two(n);
      return ["TIPO: texto.", ...kicker, `Título grande (tipografía ancha): ${q(slide.titulo)}`, `Cuerpo en la grotesca, tamaño mediano, 2 a 5 líneas: ${q(slide.cuerpo)}`, `Recurso gráfico: el número "${numero}" gigante en contorno fino, al 10 % de opacidad, abajo a la derecha, recortado contra el borde.`, enfasis([slide.titulo, slide.cuerpo])];
    }
    case "lista":
      return [
        "TIPO: lista numerada.",
        ...kicker,
        `Título grande (tipografía ancha): ${q(slide.titulo)}`,
        "Ítems en la grotesca, cada uno con su índice en monoespaciada a la izquierda y una línea finísima entre ítems:",
        ...slide.items.map((item, index) => `  ${two(index + 1)} — ${q(item)}`),
        `Recurso gráfico: el número "${two(n)}" gigante en contorno fino, al 10 % de opacidad, abajo a la derecha.`,
        enfasis([slide.titulo, ...slide.items]),
      ];
    case "cita":
      return ["TIPO: cita (la frase clave de la serie).", ...kicker, `La frase, enorme (tipografía ancha), apoyada abajo: ${q(slide.cita)}`, ...(slide.autor ? [`Autor, en monoespaciada chica debajo: ${q(slide.autor)}`] : []), arco, enfasis([slide.cita])];
    case "comparacion":
      return [
        "TIPO: comparación (pantalla dividida).",
        ...kicker,
        ...(slide.titulo ? [`Título (tipografía ancha): ${q(slide.titulo)}`] : []),
        `Bloque de arriba, en un recuadro de línea finísima y esquinas apenas redondeadas: rótulo ${q(slide.antes.rotulo)} y texto ${q(slide.antes.texto)}`,
        `Bloque de abajo, sólido del color opuesto al fondo, con textura de piedra: rótulo ${q(slide.despues.rotulo)} y texto ${q(slide.despues.texto)}`,
        enfasis([slide.titulo, slide.antes.texto, slide.despues.texto]),
      ];
    case "imagen": {
      const slot = pieza.imagenes?.find((item) => item.slot === slide.imagen);
      return [
        "TIPO: imagen.",
        ...kicker,
        `Foto en blanco y negro cálido (negros mate, blancos marfil), en una placa grande con esquinas apenas redondeadas que ocupa la mitad de arriba: ${slot?.prompt ?? "una escena sobria del tema"}`,
        ...(slide.titulo ? [`Título debajo de la foto (tipografía ancha): ${q(slide.titulo)}`] : []),
        ...(slide.pie ? [`Pie en la grotesca, chico, debajo: ${q(slide.pie)}`] : []),
        enfasis([slide.titulo, slide.pie]),
      ];
    }
    case "cierre":
      return [
        "TIPO: cierre.",
        "ARRIBA A LA IZQUIERDA, VACÍO: dejá libre un cuadrado de pared lisa de 20 % del ancho, pegado a los márgenes de arriba y de la izquierda. Ahí se pone después la firma (el monograma de Mario). No dibujes ningún logo ni monograma.",
        `Pregunta o llamado, grande (tipografía ancha), apoyado abajo: ${q(slide.titulo)}`,
        `Debajo, en la grotesca, mediano: ${q(slide.cta)}`,
        ...(slide.enlace ? [`Enlace en monoespaciada (minúsculas): ${q(slide.enlace)}`] : []),
        "Recurso gráfico: un arco de anillo con textura de piedra que asoma desde abajo, muy tenue (15 %).",
        enfasis([slide.titulo, slide.cta]),
      ];
    case "tarjeta":
      return ["TIPO: tarjeta de opinión.", ...kicker, `La frase, enorme (tipografía ancha), alineada a la izquierda y apoyada abajo: ${q(slide.texto)}`, arco, enfasis([slide.texto])];
    case "encuesta":
      return [
        "TIPO: encuesta.",
        `Rótulo arriba a la izquierda: "ENCUESTA"`,
        `Pregunta, enorme (tipografía ancha): ${q(slide.pregunta)}`,
        "Opciones en la grotesca, cada una en un recuadro de línea finísima con su letra en monoespaciada:",
        ...slide.opciones.map((option, index) => `  ${"ABCD"[index]} — ${q(option)}`),
        ...(formato === "reel" ? ["Dejá libre el tercio inferior (ahí va el sticker de encuesta de Instagram)."] : []),
      ];
    case "sorteo":
      return [
        "TIPO: sorteo.",
        `Rótulo arriba a la izquierda: "SORTEO"`,
        `Premio, enorme (tipografía ancha): ${q(slide.premio)}`,
        "Pasos numerados, en la grotesca:",
        ...slide.pasos.map((paso, index) => `  ${two(index + 1)} — ${q(paso)}`),
        `Fecha de cierre, en monoespaciada: ${q(slide.cierre)}`,
        `Bases, en monoespaciada chica (minúsculas): ${q(slide.bases)}`,
      ];
  }
}

function pedidosEntera(pieza: Pieza, salida: Salida) {
  const slides = diapositivasDe(salida);
  const formato = formatoDe(salida);
  const tono = ("tono" in salida && salida.tono) || "oscuro";
  const files = archivosChatGPT(salida);
  return slides.map((slide, index) => {
    const n = index + 1;
    const fondo = slides.length > 1 ? tonoDeDiapositiva(slide, index, tono) : tono;
    const pie =
      slides.length > 1
        ? `PIE: contador "${two(n)} / ${two(slides.length)}" abajo a la izquierda · "mmorera.agency" abajo a la derecha (monoespaciada chica) · una línea finísima de borde a borde cerca del pie, con un punto sólido al ${Math.round(((n - 0.5) / slides.length) * 100)} % del ancho.`
        : `PIE: "mmorera.agency" abajo a la derecha, en monoespaciada chica.`;
    const lines = [
      `DIAPOSITIVA ${n} DE ${slides.length} · formato ${FORMATO[formato]} · ${FONDO[fondo]}`,
      ...cuerpo(slide, n, pieza, formato).filter(Boolean),
      pie,
      `Texto exacto: copiá letra por letra lo que está entre comillas. No agregues ningún otro texto.`,
    ];
    return { n, file: files[index], text: lines.join("\n") };
  });
}

function escribir(id: string) {
  const pieza = leerPieza(id);
  const salidas = pieza.salidas.filter(usaChatGPT);
  const slots = pieza.imagenes ?? [];
  if (!salidas.length && !slots.length) return false;
  const usos = usosDeSlots(pieza);
  const refs = referencias();
  const carpeta = carpetaDe(id);
  const refsLinea = refs.length
    ? `Adjuntá estas referencias (están en \`${path.join(CONTENIDO, "marca", "referencias")}\`): ${refs.map((file) => `\`${file}\``).join(", ")}. Decile a ChatGPT: "Estas son piezas aprobadas de la marca: copiá su clima, su materia y su tipografía, no su texto."`
    : "Todavía no hay referencias aprobadas en `contenido/marca/referencias/`: seguí solo con el sistema.";

  const out: string[] = [
    `# ChatGPT · ${pieza.titulo}`,
    "",
    `Pieza \`${id}\`. Archivo generado con \`npx tsx scripts/chatgpt-prompts.ts ${id}\`: no lo edites a mano.`,
    `Carpeta de la pieza: \`${carpeta}\``,
    "",
    "Dos bloques, en este orden: primero **ARTE** (versión A: imágenes sin letras; el texto lo pone el código) y después **ENTERA** (versión B: ChatGPT diseña la diapositiva completa). Mario elige una de las dos.",
    "",
    "## Cómo usarlo (agente del navegador)",
    "",
    "1. Cada bloque (y en ENTERA, cada salida) va en una **conversación nueva** de ChatGPT.",
    `2. Al abrir la conversación: ${refsLinea}`,
    "3. Pegá el **sistema** del bloque, una vez por conversación.",
    "4. Pegá los pedidos **de a uno y en orden**. Después de cada imagen, pasá el control de calidad.",
    '5. Si una imagen falla, pedí: "Regenerá corrigiendo: …" con el problema concreto. Hasta 5 intentos por imagen.',
    "6. Descargá las aprobadas y pasalas a la pieza con los comandos de cada bloque (desde `web/`).",
    "",
    "## ARTE · versión A",
    "",
  ];

  if (!slots.length) out.push("Esta pieza no pide arte: la versión A sale solo con código. Seguí con ENTERA.", "");
  else {
    out.push("### Sistema de arte (pegar primero)", "", "```text", bloque("imagenes-chatgpt.md", "ARTE"), "```", "");
    for (const slot of slots) {
      const listo = imagenDe(id, slot.slot) ? " · ✔ ya está" : "";
      out.push(`### Slot \`${slot.slot}\` → \`imagenes/${slot.slot}.png\`${listo}`, "", "```text", pedidoArte(pieza, slot, usos.get(slot.slot) ?? []), "```", "", "Al descargarla:", "", "```bash", `npx tsx scripts/contenido.ts arte ${id} ${slot.slot} <archivo descargado>`, "```", "");
    }
    out.push(
      "### Control de calidad (cada arte)",
      "",
      "- [ ] **Ninguna letra**: ni texto, ni números, ni carteles, ni pantallas con contenido, aunque sean ilegibles.",
      "- [ ] La franja pedida está vacía y en calma (pared lisa): ahí va el texto.",
      "- [ ] Solo pared, marfil y grises cálidos: ningún color.",
      "- [ ] Sin logos, sin caras, sin manos deformes, sin objetos imposibles.",
      "- [ ] Parece de la misma pared que las referencias: mate, con grano, luz rasante.",
      "",
    );
  }

  out.push("## ENTERA · versión B", "");
  if (!salidas.length) out.push("Esta pieza no tiene salidas estáticas para ChatGPT (son reels): la versión B no aplica.", "");
  else {
    out.push("### Sistema de diseño (pegar primero, en cada conversación)", "", "```text", bloque("chatgpt-diseno.md", "SISTEMA"), "```");
    for (const salida of salidas) {
      const list = pedidosEntera(pieza, salida);
      out.push("", `### Salida \`${salida.id}\` · ${list.length} diapositiva(s) · para ${salida.para.join(", ")}`, "");
      for (const item of list) out.push(`#### ${item.n}. → \`imagenes/${item.file}\``, "", "```text", item.text, "```", "");
      out.push("Al terminar la salida, importá las descargas (las recorta, las numera y firma el cierre con el monograma):", "", "```bash", `npx tsx scripts/contenido.ts importar ${id} ${salida.id}`, "```", "");
    }
    out.push(
      "### Control de calidad (cada diapositiva)",
      "",
      "- [ ] El texto es exactamente el pedido: tildes, ¿ ¡, puntuación. Ni una palabra de más o de menos.",
      "- [ ] El fondo es el pedido (pared o marfil), con grano, y no hay ningún color.",
      "- [ ] Títulos en la tipografía ancha; el título se lee fácil en el teléfono; nada pegado al borde ni cortado.",
      "- [ ] Contador, mmorera.agency y la línea con su punto en su lugar (si es un carrusel).",
      "- [ ] En el cierre, el rincón de arriba a la izquierda está vacío y no hay ningún logo dibujado.",
      "- [ ] Sin logos, sin interfaces inventadas, sin caras, sin manos deformes y sin texto ilegible.",
      "- [ ] Parece de la misma serie que la diapositiva anterior y que las referencias.",
    );
  }
  writeFileSync(path.join(carpeta, "chatgpt.md"), `${out.join("\n")}\n`);
  return true;
}

const pendientes = process.argv.includes("--pendientes");
const ids = pendientes
  ? listarPiezas().filter((id) => {
      const pieza = leerPieza(id);
      if (pieza.estado === "idea" || pieza.estado === "publicado") return false;
      const faltaArte = (pieza.imagenes ?? []).some((slot) => !imagenDe(id, slot.slot));
      const faltaEntera = pieza.salidas.some((salida) => archivosChatGPT(salida).some((file) => !existsSync(path.join(carpetaDe(id), "imagenes", file))));
      return faltaArte || faltaEntera;
    })
  : process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (!ids.length) {
  console.log(pendientes ? "No hay piezas con imágenes de ChatGPT pendientes." : "Uso: npx tsx scripts/chatgpt-prompts.ts <id…> | --pendientes");
  process.exit(0);
}
for (const id of ids) console.log(escribir(id) ? `✔ ${path.join(carpetaDe(id), "chatgpt.md")}` : `· ${id}: no tiene arte ni salidas estáticas para ChatGPT`);
