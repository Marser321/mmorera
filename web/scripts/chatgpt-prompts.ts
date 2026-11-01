#!/usr/bin/env node
/**
 * Escribe piezas/<id>/chatgpt.md: los pedidos para que ChatGPT diseñe las
 * diapositivas de las salidas estáticas (carrusel, desafío, imagen) con el
 * sistema de diseño de contenido/marca/chatgpt-diseno.md. Cada pedido lleva
 * el texto exacto, el fondo que le toca en la alternancia, su recurso gráfico,
 * el pie de la serie y el nombre del archivo a guardar.
 *
 * Uso, desde web/:
 *   npx tsx scripts/chatgpt-prompts.ts 2026-10-25-mas-barato-otro-rol
 *   npx tsx scripts/chatgpt-prompts.ts --pendientes      (las que todavía no tienen sus imágenes)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { archivosChatGPT, usaChatGPT } from "../src/data/social/render";
import { diapositivasDe, ecoDe, invert, tonoDeDiapositiva } from "../src/data/social/timing";
import type { Diapositiva, Formato, Pieza, Salida, Tono } from "../src/data/social/types";
import { carpetaDe, CONTENIDO, leerPieza, listarPiezas } from "./lib/piezas";

const FORMATO: Record<Formato, string> = {
  feed: "4:5 vertical (1080×1350)",
  cuadrado: "1:1 cuadrado (1080×1080)",
  reel: "9:16 vertical (1080×1920)",
};

const FONDO: Record<Tono, string> = {
  oscuro: "FONDO NEGRO (#070809) con texto marfil (#F3F0E8)",
  claro: "FONDO MARFIL (#F3F0E8) con texto negro (#070809)",
};

const plain = (text: string) => text.replace(/\*/g, "");
const q = (text: string) => `"${plain(text)}"`;
const two = (n: number) => String(n).padStart(2, "0");

/** Frases marcadas con *asteriscos* → instrucción de énfasis. */
function enfasis(texts: Array<string | undefined>) {
  const marks = texts.flatMap((text) => [...(text ?? "").matchAll(/\*([^*]+)\*/g)].map((match) => `"${match[1]}"`));
  return marks.length ? `ÉNFASIS (barra invertida detrás, letras del color del fondo): ${marks.join(", ")}.` : "";
}

function sistema() {
  const doc = readFileSync(path.join(CONTENIDO, "marca", "chatgpt-diseno.md"), "utf8");
  const start = doc.indexOf("<!-- SISTEMA -->");
  const end = doc.indexOf("<!-- /SISTEMA -->");
  return doc.slice(start + "<!-- SISTEMA -->".length, end).trim();
}

/** Composición, textos exactos y recurso gráfico de cada tipo de diapositiva. */
function cuerpo(slide: Diapositiva, n: number, pieza: Pieza, formato: Formato): string[] {
  const kicker = "kicker" in slide && slide.kicker ? [`Rótulo arriba a la izquierda (monoespaciada, mayúsculas): ${q(slide.kicker)}`] : [];
  switch (slide.tipo) {
    case "portada":
      return [
        "TIPO: portada (gancho).",
        ...kicker,
        `Título enorme, apoyado en el tercio inferior: ${q(slide.titulo)}`,
        ...(slide.bajada ? [`Bajada chica debajo del título: ${q(slide.bajada)}`] : []),
        `Recurso gráfico: la palabra "${ecoDe(slide.titulo).toUpperCase()}" gigante en contorno fino, al 12 % de opacidad, arriba, recortada contra el borde.`,
        `Abajo al centro: "DESLIZÁ" en monoespaciada con una flecha fina hacia la derecha.`,
        enfasis([slide.titulo]),
      ];
    case "texto": {
      // Si el rótulo ya numera ("01 · Contexto"), el número gigante usa ese.
      const numero = slide.kicker?.match(/^(\d{1,2})(?!\d)/)?.[1] ?? two(n);
      return ["TIPO: texto.", ...kicker, `Título grande: ${q(slide.titulo)}`, `Cuerpo (tamaño mediano, 2 a 5 líneas): ${q(slide.cuerpo)}`, `Recurso gráfico: el número "${numero}" gigante en contorno fino, al 12 % de opacidad, abajo a la derecha, recortado contra el borde.`, enfasis([slide.titulo, slide.cuerpo])];
    }
    case "lista":
      return [
        "TIPO: lista numerada.",
        ...kicker,
        `Título grande: ${q(slide.titulo)}`,
        "Ítems, cada uno con su índice grande en monoespaciada a la izquierda y una línea fina entre ítems:",
        ...slide.items.map((item, index) => `  ${two(index + 1)} — ${q(item)}`),
        `Recurso gráfico: el número "${two(n)}" gigante en contorno fino, al 12 % de opacidad, abajo a la derecha.`,
        enfasis([slide.titulo, ...slide.items]),
      ];
    case "cita":
      return ["TIPO: cita.", ...kicker, `Comillas gigantes en contorno fino arriba a la izquierda.`, `La frase, enorme: ${q(slide.cita)}`, ...(slide.autor ? [`Autor, en monoespaciada chica debajo: ${q(slide.autor)}`] : []), enfasis([slide.cita])];
    case "comparacion":
      return [
        "TIPO: comparación (pantalla dividida).",
        ...kicker,
        ...(slide.titulo ? [`Título: ${q(slide.titulo)}`] : []),
        `Bloque de arriba, en un recuadro de línea fina: rótulo ${q(slide.antes.rotulo)} y texto ${q(slide.antes.texto)}`,
        `Bloque de abajo, sólido e invertido (color opuesto al fondo): rótulo ${q(slide.despues.rotulo)} y texto ${q(slide.despues.texto)}`,
        enfasis([slide.titulo, slide.antes.texto, slide.despues.texto]),
      ];
    case "imagen": {
      const slot = pieza.imagenes?.find((item) => item.slot === slide.imagen);
      return [
        "TIPO: imagen.",
        ...kicker,
        `Foto en blanco y negro de alto contraste, en una placa grande que ocupa la mitad de arriba: ${slot?.prompt ?? "una escena sobria del tema"}`,
        ...(slide.titulo ? [`Título debajo de la foto: ${q(slide.titulo)}`] : []),
        ...(slide.pie ? [`Pie chico debajo: ${q(slide.pie)}`] : []),
        enfasis([slide.titulo, slide.pie]),
      ];
    }
    case "cierre":
      return ["TIPO: cierre.", `Pregunta o llamado, grande: ${q(slide.titulo)}`, `Debajo, mediano: ${q(slide.cta)}`, ...(slide.enlace ? [`Enlace en monoespaciada (minúsculas): ${q(slide.enlace)}`] : []), `"Mario Morera" en monoespaciada chica arriba a la izquierda y una flecha fina hacia la derecha junto al enlace.`, enfasis([slide.titulo, slide.cta])];
    case "tarjeta":
      return ["TIPO: tarjeta de opinión.", ...kicker, `La frase, enorme, alineada a la izquierda: ${q(slide.texto)}`, `Abajo, en monoespaciada chica: "Mario Morera · mmorera.agency"`, enfasis([slide.texto])];
    case "encuesta":
      return [
        "TIPO: encuesta.",
        `Rótulo arriba a la izquierda: "ENCUESTA"`,
        `Pregunta, enorme: ${q(slide.pregunta)}`,
        "Opciones, cada una en un recuadro de línea fina con su letra en monoespaciada:",
        ...slide.opciones.map((option, index) => `  ${"ABCD"[index]} — ${q(option)}`),
        ...(formato === "reel" ? ["Dejá libre el tercio inferior (ahí va el sticker de encuesta de Instagram)."] : []),
      ];
    case "sorteo":
      return [
        "TIPO: sorteo.",
        `Rótulo arriba a la izquierda: "SORTEO"`,
        `Premio, enorme: ${q(slide.premio)}`,
        "Pasos numerados:",
        ...slide.pasos.map((paso, index) => `  ${two(index + 1)} — ${q(paso)}`),
        `Fecha de cierre, en monoespaciada: ${q(slide.cierre)}`,
        `Bases, en monoespaciada chica (minúsculas): ${q(slide.bases)}`,
      ];
  }
}

function pedidos(pieza: Pieza, salida: Salida) {
  const slides = diapositivasDe(salida);
  const formato: Formato = salida.plantilla === "carrusel" || salida.plantilla === "desafio" || salida.plantilla === "imagen" ? salida.formato : "feed";
  const tono = ("tono" in salida && salida.tono) || "oscuro";
  const files = archivosChatGPT(salida);
  return slides.map((slide, index) => {
    const n = index + 1;
    const fondo = slides.length > 1 ? tonoDeDiapositiva(slide, index, tono) : slide.tipo === "cierre" ? invert(tono) : tono;
    const pie =
      slides.length > 1
        ? `PIE: contador "${two(n)} / ${two(slides.length)}" abajo a la izquierda · "mmorera.agency" abajo a la derecha · línea fina de borde a borde cerca del pie, con un punto sólido al ${Math.round(((n - 0.5) / slides.length) * 100)} % del ancho.`
        : `PIE: "mmorera.agency" abajo a la derecha, en monoespaciada chica.`;
    const lines = [
      `DIAPOSITIVA ${n} DE ${slides.length} · formato ${FORMATO[formato]} · ${FONDO[fondo]}`,
      ...cuerpo(slide, n, pieza, formato).filter(Boolean),
      pie,
      `Texto exacto: copiá letra por letra lo que está entre comillas.`,
    ];
    return { n, file: files[index], text: lines.join("\n") };
  });
}

function escribir(id: string) {
  const pieza = leerPieza(id);
  const salidas = pieza.salidas.filter(usaChatGPT);
  if (!salidas.length) return false;
  const out: string[] = [
    `# ChatGPT · ${pieza.titulo}`,
    "",
    `Pieza \`${id}\`. Archivo generado con \`npx tsx scripts/chatgpt-prompts.ts ${id}\`: no lo edites a mano.`,
    "",
    "## Cómo usarlo (agente del navegador)",
    "",
    "1. Por cada salida de abajo, abrí una **conversación nueva** en ChatGPT.",
    "2. Pegá el **sistema de diseño**, una vez por conversación.",
    "3. Pegá los pedidos **de a uno y en orden**. Después de cada imagen, pasá el control de calidad.",
    '4. Si una diapositiva falla, pedí: "Regenerá la diapositiva N corrigiendo: …" con el problema concreto. Hacé hasta 5 intentos por diapositiva.',
    "5. Descargá las imágenes aprobadas **en orden** (01, 02, …).",
    "6. Al terminar cada salida, importalas a la pieza (recorta a la medida exacta y las nombra):",
    "   ```bash",
    `   npx tsx scripts/contenido.ts importar ${id} <salida>`,
    "   ```",
    "",
    "## Sistema de diseño (pegar primero)",
    "",
    "```text",
    sistema(),
    "```",
  ];
  for (const salida of salidas) {
    const list = pedidos(pieza, salida);
    out.push("", `## Salida \`${salida.id}\` · ${list.length} diapositiva(s) · para ${salida.para.join(", ")}`, "");
    for (const item of list) out.push(`### ${item.n}. → \`imagenes/${item.file}\``, "", "```text", item.text, "```", "");
    out.push(
      "### Control de calidad (cada diapositiva)",
      "",
      "- [ ] El texto es exactamente el pedido: tildes, ¿ ¡, puntuación. Ni una palabra de más o de menos.",
      "- [ ] El fondo es el pedido (negro o marfil) y no hay ningún color.",
      "- [ ] El título se lee fácil en el teléfono; nada pegado al borde ni cortado.",
      "- [ ] Contador, mmorera.agency y la línea con su punto están en su lugar (si es un carrusel).",
      "- [ ] Sin logos, sin interfaces inventadas, sin caras, sin manos deformes y sin texto ilegible.",
      "- [ ] Parece de la misma serie que la diapositiva anterior.",
    );
  }
  writeFileSync(path.join(carpetaDe(id), "chatgpt.md"), `${out.join("\n")}\n`);
  return true;
}

const pendientes = process.argv.includes("--pendientes");
const ids = pendientes
  ? listarPiezas().filter((id) => {
      const pieza = leerPieza(id);
      return pieza.estado !== "idea" && pieza.estado !== "publicado" && pieza.salidas.some((salida) => archivosChatGPT(salida).some((file) => !existsSync(path.join(carpetaDe(id), "imagenes", file))));
    })
  : process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (!ids.length) {
  console.log(pendientes ? "No hay piezas con diapositivas de ChatGPT pendientes." : "Uso: npx tsx scripts/chatgpt-prompts.ts <id…> | --pendientes");
  process.exit(0);
}
for (const id of ids) console.log(escribir(id) ? `✔ ${path.join(carpetaDe(id), "chatgpt.md")}` : `· ${id}: no tiene salidas estáticas para ChatGPT`);
