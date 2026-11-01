#!/usr/bin/env node
/**
 * Flujo de las piezas de redes: estados, aprobación, lista del día y revisión.
 *
 *   idea → borrador → listo → aprobado → publicado
 *
 * Uso, desde web/:
 *   npx tsx scripts/contenido.ts estado                         resumen de todas las piezas
 *   npx tsx scripts/contenido.ts listo <id>                     borrador → listo (exige validación y renders)
 *   npx tsx scripts/contenido.ts borrador <id> --nota "…"       vuelve a borrador (con el motivo)
 *   npx tsx scripts/contenido.ts aprobar <id…>                  listo → aprobado. SOLO Mario (o Claude cuando Mario lo pide)
 *   npx tsx scripts/contenido.ts hoy [AAAA-MM-DD]               qué publicar hoy, por plataforma (para el agente)
 *   npx tsx scripts/contenido.ts publicado <id> <plataforma> <url>
 *   npx tsx scripts/contenido.ts revision                       escribe contenido/REVISION.md
 *   npx tsx scripts/contenido.ts chatgpt                        qué diapositivas de ChatGPT faltan
 *   npx tsx scripts/contenido.ts importar <id> <salida> [carpeta]
 *       toma las N imágenes más nuevas de la carpeta (por defecto, Descargas), en el
 *       orden en que se descargaron, las recorta a la medida del formato y las guarda
 *       como imagenes/gpt-<salida>-01.png, -02.png…
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { SECCION_COPY, validarPieza } from "../src/data/social/validate";
import { archivosChatGPT, archivosEsperados } from "../src/data/social/render";
import { PLATAFORMAS, SOCIAL_FORMATS, type Estado, type Pieza, type Plataforma } from "../src/data/social/types";
import { carpetaDe, CONTENIDO, entornoDe, guardarPieza, leerPieza, listarPiezas, revisarPieza, seccionCopy } from "./lib/piezas";

function option(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > 0 ? process.argv[index + 1] : undefined;
}

const now = () => new Date().toISOString().slice(0, 16).replace("T", " ");

function cambiar(pieza: Pieza, estado: Estado, quien: string, nota?: string) {
  pieza.estado = estado;
  pieza.historial = [...(pieza.historial ?? []), { fecha: now(), estado, quien, ...(nota ? { nota } : {}) }];
  guardarPieza(pieza);
}

function sinErrores(id: string) {
  const { problemas } = revisarPieza(id);
  const errores = problemas.filter((p) => p.nivel === "error");
  for (const p of errores) console.log(`  error  ${p.donde}: ${p.mensaje}`);
  return errores.length === 0;
}

/**
 * Plataformas de cada salida y los archivos que le tocan (rutas completas).
 * Las salidas estáticas usan la versión de ChatGPT si está completa; si no,
 * la de código. Los reels siempre son de código.
 */
function archivosPorPlataforma(pieza: Pieza) {
  const files = archivosEsperados(pieza);
  const carpeta = carpetaDe(pieza.id);
  const out = new Map<Plataforma, string[]>();
  for (const salida of pieza.salidas) {
    const gpt = archivosChatGPT(salida);
    const gptListo = gpt.length > 0 && gpt.every((file) => existsSync(path.join(carpeta, "imagenes", file)));
    const codigo = files.filter((file) => file.startsWith(`${salida.id}.`) || file.startsWith(`${salida.id}-`));
    // El carrusel en video (si lo hay) sigue saliendo del código.
    const mine = gptListo ? [...gpt.map((file) => path.join(carpeta, "imagenes", file)), ...codigo.filter((file) => file.endsWith(".mp4")).map((file) => path.join(carpeta, "salida", file))] : codigo.map((file) => path.join(carpeta, "salida", file));
    for (const p of salida.para) out.set(p, [...(out.get(p) ?? []), ...mine]);
  }
  return out;
}

const [command, ...args] = process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !["--nota", "--quien"].includes(all[index - 1] ?? ""));
const quien = option("quien") ?? "Mario";

switch (command) {
  case "estado": {
    const rows = listarPiezas().map((id) => {
      const { pieza, problemas } = revisarPieza(id);
      const errores = problemas.filter((p) => p.nivel === "error").length;
      return `${(pieza?.estado ?? "?").padEnd(10)} ${id}${errores ? `  (${errores} error/es)` : ""}`;
    });
    console.log(rows.join("\n") || "No hay piezas todavía.");
    break;
  }
  case "listo": {
    for (const id of args) {
      const pieza = leerPieza(id);
      if (pieza.estado !== "borrador") throw new Error(`${id} está en "${pieza.estado}"; solo un borrador pasa a listo`);
      // Se valida como si ya estuviera lista: exige renders e imágenes.
      const errores = validarPieza({ ...pieza, estado: "listo" }, entornoDe(id)).filter((p) => p.nivel === "error");
      for (const p of errores) console.log(`  error  ${p.donde}: ${p.mensaje}`);
      if (errores.length) throw new Error(`${id} no está lista: corregí los errores de arriba`);
      cambiar(pieza, "listo", option("quien") ?? "agente", option("nota"));
      console.log(`✔ ${id} → listo`);
    }
    break;
  }
  case "borrador": {
    for (const id of args) {
      const pieza = leerPieza(id);
      cambiar(pieza, "borrador", option("quien") ?? "agente", option("nota"));
      console.log(`✔ ${id} → borrador`);
    }
    break;
  }
  case "aprobar": {
    for (const id of args) {
      const pieza = leerPieza(id);
      if (pieza.estado !== "listo") throw new Error(`${id} está en "${pieza.estado}"; solo se aprueba lo que está listo`);
      if (!sinErrores(id)) throw new Error(`${id} tiene errores: no se aprueba`);
      cambiar(pieza, "aprobado", quien, option("nota"));
      console.log(`✔ ${id} → aprobado (${quien})`);
    }
    break;
  }
  case "publicado": {
    const [id, plataforma, url] = args;
    if (!PLATAFORMAS.includes(plataforma as Plataforma) || !/^https?:\/\//.test(url ?? "")) throw new Error("Uso: publicado <id> <plataforma> <url>");
    const pieza = leerPieza(id);
    if (pieza.estado !== "aprobado" && pieza.estado !== "publicado") throw new Error(`${id} está en "${pieza.estado}": solo se publica lo aprobado`);
    pieza.publicaciones = [...(pieza.publicaciones ?? []).filter((p) => p.plataforma !== plataforma), { plataforma: plataforma as Plataforma, url, fecha: now() }];
    const pendientes = [...archivosPorPlataforma(pieza).keys()].filter((p) => !pieza.publicaciones!.some((pub) => pub.plataforma === p));
    if (pendientes.length === 0) cambiar(pieza, "publicado", "agente");
    else guardarPieza(pieza);
    console.log(`✔ ${id} · ${plataforma} registrado${pendientes.length ? ` · faltan: ${pendientes.join(", ")}` : " · pieza publicada"}`);
    break;
  }
  case "hoy": {
    const fecha = args[0] ?? new Date().toISOString().slice(0, 10);
    const piezas = listarPiezas().filter((id) => id.startsWith(fecha));
    if (!piezas.length) console.log(`No hay piezas para ${fecha}.`);
    for (const id of piezas) {
      const pieza = leerPieza(id);
      if (pieza.estado !== "aprobado") {
        console.log(`· ${id}: ${pieza.estado} — NO se publica (solo lo aprobado).`);
        continue;
      }
      const copy = entornoDe(id).copy ?? "";
      console.log(`\n■ ${id} · ${pieza.titulo}`);
      for (const [plataforma, files] of archivosPorPlataforma(pieza)) {
        if (pieza.publicaciones?.some((p) => p.plataforma === plataforma)) {
          console.log(`  ${plataforma}: ya publicado`);
          continue;
        }
        console.log(`  ${plataforma}:`);
        for (const file of files) console.log(`    subir  ${file}${file.includes(`${path.sep}imagenes${path.sep}gpt-`) ? "  (versión ChatGPT)" : ""}`);
        console.log(`    texto  ${SECCION_COPY[plataforma]} de ${path.join(carpetaDe(id), "copy.md")}`);
        const section = seccionCopy(copy, SECCION_COPY[plataforma]);
        if (section) console.log(section.split("\n").map((line) => `      ${line}`).join("\n"));
      }
    }
    break;
  }
  case "revision": {
    const lines = ["# Revisión de piezas", "", `Generado el ${now()} con \`npx tsx scripts/contenido.ts revision\`. Para aprobar: \`npx tsx scripts/contenido.ts aprobar <id>\` (o pedíselo a Claude).`, ""];
    const grupos: Record<string, string[]> = { listo: [], borrador: [], idea: [] };
    for (const id of listarPiezas()) {
      const { pieza, problemas } = revisarPieza(id);
      if (!pieza || !(pieza.estado in grupos)) continue;
      const salida = path.join(carpetaDe(id), "salida");
      const files = existsSync(salida) ? readdirSync(salida) : [];
      const errores = problemas.filter((p) => p.nivel === "error");
      const avisos = problemas.filter((p) => p.nivel === "aviso");
      const entry = [`### ${id} · ${pieza.titulo}`, "", `Rama: ${pieza.rama}${pieza.serie ? ` · serie: ${pieza.serie}` : ""}${pieza.postura ? " · **opinión: revisá la postura**" : ""}`];
      if (files.length) entry.push("", ...files.map((file) => `- [${file}](piezas/${id}/salida/${file})`));
      entry.push("", `- [copy.md](piezas/${id}/copy.md) · [pieza.json](piezas/${id}/pieza.json)`);
      if (errores.length) entry.push("", ...errores.map((p) => `- ✖ ${p.donde}: ${p.mensaje}`));
      if (avisos.length) entry.push("", ...avisos.map((p) => `- · ${p.donde}: ${p.mensaje}`));
      grupos[pieza.estado].push(entry.join("\n"));
    }
    lines.push("## Esperan tu aprobación", "", grupos.listo.join("\n\n") || "Nada por ahora.", "", "## En preparación", "", grupos.borrador.join("\n\n") || "Nada por ahora.", "", "## Ideas", "", grupos.idea.join("\n\n") || "Nada por ahora.", "");
    writeFileSync(path.join(CONTENIDO, "REVISION.md"), lines.join("\n"));
    console.log(`✔ ${path.join(CONTENIDO, "REVISION.md")}`);
    break;
  }
  case "chatgpt": {
    for (const id of listarPiezas()) {
      const pieza = leerPieza(id);
      if (pieza.estado === "idea" || pieza.estado === "publicado") continue;
      for (const salida of pieza.salidas) {
        const gpt = archivosChatGPT(salida);
        if (!gpt.length) continue;
        const faltan = gpt.filter((file) => !existsSync(path.join(carpetaDe(id), "imagenes", file)));
        console.log(`${faltan.length ? "·" : "✔"} ${id} · ${salida.id}: ${gpt.length - faltan.length}/${gpt.length}${faltan.length ? `  → pedidos en ${path.join(carpetaDe(id), "chatgpt.md")}` : ""}`);
      }
    }
    break;
  }
  case "importar": {
    const [id, salidaId, carpeta = path.join(os.homedir(), "Downloads")] = args;
    const pieza = leerPieza(id);
    const salida = pieza.salidas.find((item) => item.id === salidaId);
    if (!salida) throw new Error(`${id} no tiene la salida "${salidaId}"`);
    const destinos = archivosChatGPT(salida);
    if (!destinos.length) throw new Error(`${salidaId} no es una salida para ChatGPT`);
    const formato = salida.plantilla === "carrusel" || salida.plantilla === "desafio" || salida.plantilla === "imagen" ? salida.formato : "feed";
    const { width, height } = SOCIAL_FORMATS[formato];
    // Las N más nuevas, en el orden en que se descargaron.
    const candidatas = readdirSync(carpeta)
      .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
      .map((file) => ({ file: path.join(carpeta, file), time: statSync(path.join(carpeta, file)).mtimeMs }))
      .sort((a, b) => b.time - a.time)
      .slice(0, destinos.length)
      .reverse();
    if (candidatas.length < destinos.length) throw new Error(`En ${carpeta} hay ${candidatas.length} imágenes; la salida necesita ${destinos.length}`);
    mkdirSync(path.join(carpetaDe(id), "imagenes"), { recursive: true });
    void (async () => {
      for (const [index, candidata] of candidatas.entries()) {
        const destino = path.join(carpetaDe(id), "imagenes", destinos[index]);
        await sharp(candidata.file).resize(width, height, { fit: "cover", position: "centre" }).png().toFile(destino);
        console.log(`  ${path.basename(candidata.file)} → imagenes/${destinos[index]}`);
      }
      const errores = revisarPieza(id).problemas.filter((p) => p.nivel === "error" && p.donde.startsWith(`salidas.${salidaId}`));
      for (const p of errores) console.log(`  error  ${p.donde}: ${p.mensaje}`);
      console.log(errores.length ? "✖ revisá los errores de arriba" : `✔ ${id} · ${salidaId}: versión de ChatGPT importada`);
    })();
    break;
  }
  default:
    console.log("Comandos: estado · listo <id> · borrador <id> · aprobar <id…> · hoy [fecha] · publicado <id> <plataforma> <url> · revision · chatgpt · importar <id> <salida> [carpeta]");
}
