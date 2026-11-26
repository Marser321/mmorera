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
 *       versión B: toma las N imágenes más nuevas de la carpeta (por defecto, Descargas),
 *       en el orden en que se descargaron, las recorta a la medida del formato, las guarda
 *       como imagenes/gpt-<salida>-01.png, -02.png… y firma el cierre con el monograma
 *   npx tsx scripts/contenido.ts firmar <id> [salida]
 *       versión B hecha con Codex (ya en imagenes/gpt-…): la deja a la medida y firma el
 *       cierre con el monograma (una sola vez por archivo)
 *   npx tsx scripts/contenido.ts arte <id> <slot> [archivo]
 *       versión A: recorta un arte sin letras (por defecto, la imagen más nueva de
 *       Descargas) al formato del slot y lo guarda como imagenes/<slot>.png
 *   npx tsx scripts/contenido.ts paquete <id> --version a|b --dest <carpeta> [--redes linkedin,instagram,facebook] [--fecha AAAA-MM-DD]
 *       copia a <carpeta> los archivos finales de esa versión, numerados en orden
 *       (01-…, 02-…), y escribe publicar.md (texto por red, primer comentario, texto
 *       alternativo y orden de los archivos) y paquete.json. Si falta la versión, falla.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { SECCION_COPY, textosDeDiapositiva, validarPieza } from "../src/data/social/validate";
import { archivosChatGPT, archivosDeVersion, archivosEsperados, diapositivasChatGPT, formatoDe, type Version } from "../src/data/social/render";
import { diapositivasDe, tonoDeDiapositiva } from "../src/data/social/timing";
import { PLATAFORMAS, socialSafeArea, SOCIAL_FORMATS, type Estado, type Formato, type Pieza, type Plataforma, type Salida, type Tono } from "../src/data/social/types";
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

/* ─── Firma del cierre (versión B) ─── */

const PUBLIC = path.join(process.cwd(), "public");

/**
 * El monograma no lo dibuja ChatGPT (lo deformaría): el pedido deja vacío el
 * rincón de arriba a la izquierda del cierre y acá se pega el vector oficial,
 * con la textura de piedra y fundido hacia abajo, como en la versión A.
 */
async function firmarCierre(file: string, formato: Formato, tono: Tono) {
  const safe = socialSafeArea(formato);
  const w = formato === "reel" ? 220 : formato === "feed" ? 190 : 170;
  const h = Math.round((w * 1885.03) / 2239.69);
  const color = tono === "oscuro" ? "#ECE7DD" : "#0B0B0A";
  const svg = readFileSync(path.join(PUBLIC, "marca/monograma.svg"), "utf8").replace(/fill="#000"/g, `fill="${color}"`);
  const forma = await sharp(Buffer.from(svg)).resize(w, h).png().toBuffer();
  const fundido = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stop-color="#fff" stop-opacity="0.92"/><stop offset="1" stop-color="#fff" stop-opacity="0.35"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#f)"/></svg>`);
  const piedra = await sharp(path.join(PUBLIC, "marca/textura-piedra.webp")).resize(w, h, { fit: "cover" }).png().toBuffer();
  const logo = await sharp({ create: { width: w, height: h, channels: 4, background: color } })
    .composite([{ input: piedra, blend: "multiply" }, { input: forma, blend: "dest-in" }, { input: fundido, blend: "dest-in" }])
    .png()
    .toBuffer();
  const out = await sharp(file).composite([{ input: logo, left: safe.x, top: safe.y }]).png().toBuffer();
  writeFileSync(file, out);
}

/* ─── Paquete para publicar (Drive → notebook) ─── */

/** Redes del paquete: Facebook repite lo de Instagram (archivos y, si copy.md no tiene "## Facebook", texto). */
type Red = Plataforma | "facebook";
const NOMBRE_RED: Record<Red, string> = { linkedin: "LinkedIn", instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", shorts: "YouTube Shorts", x: "X" };

/** Sección opcional de copy.md: la de la red ("## Primer comentario · LinkedIn") o la general. */
function seccionOpcional(copy: string, titulo: string, red: Red) {
  return seccionCopy(copy, `## ${titulo} · ${NOMBRE_RED[red]}`) ?? seccionCopy(copy, `## ${titulo}`);
}

const plano = (text: string) => text.replace(/\*/g, "").trim();

/** Texto alternativo de una imagen: lo que dice la diapositiva, en una línea. */
function altDe(salida: Salida, index: number) {
  const slide = diapositivasDe(salida)[index];
  if (!slide) return "";
  return textosDeDiapositiva(slide).map(plano).join(" · ");
}

function paquete(id: string, version: Version, dest: string, redesPedidas: Red[] | undefined, fecha: string) {
  const pieza = leerPieza(id);
  const carpeta = carpetaDe(id);
  const { problemas } = revisarPieza(id);
  // Faltar renders o diapositivas de ChatGPT se informa abajo, por versión; lo demás bloquea.
  const bloqueantes = problemas.filter((p) => p.nivel === "error" && p.donde !== "salida" && !/ChatGPT/.test(p.mensaje));
  if (bloqueantes.length) throw new Error(`${id} tiene errores:\n${bloqueantes.map((p) => `  ${p.donde}: ${p.mensaje}`).join("\n")}`);
  const copy = entornoDe(id).copy;
  if (copy === undefined) throw new Error(`${id} no tiene copy.md`);

  // Redes: las de las salidas, más Facebook si hay Instagram.
  const porSalida = pieza.salidas.map((salida) => ({ salida, files: archivosDeVersion(salida, version) }));
  const deSalidas = new Map<Red, Array<{ salida: Salida; files: string[] }>>();
  for (const item of porSalida) for (const p of item.salida.para) deSalidas.set(p, [...(deSalidas.get(p) ?? []), item]);
  if (deSalidas.has("instagram") && !deSalidas.has("facebook")) deSalidas.set("facebook", deSalidas.get("instagram")!);
  const redes = redesPedidas ?? [...deSalidas.keys()];
  for (const red of redes) if (!deSalidas.has(red)) throw new Error(`${id} no tiene nada para ${NOMBRE_RED[red] ?? red} (redes de la pieza: ${[...deSalidas.keys()].join(", ")})`);

  // Archivos de esas redes en la versión pedida; si falta alguno, la versión no está.
  const usados = [...new Set(redes.flatMap((red) => deSalidas.get(red)!.flatMap(({ files }) => files)))];
  const faltan = usados.filter((file) => !existsSync(path.join(carpeta, file)));
  if (faltan.length) {
    const como = [
      ...(faltan.some((file) => file.startsWith("imagenes/gpt-")) ? [`diseñá las diapositivas en ChatGPT (chatgpt.md, bloque ENTERA) e importalas: npx tsx scripts/contenido.ts importar ${id} <salida>`] : []),
      ...(faltan.some((file) => file.startsWith("salida/")) ? [`renderizá: npx tsx scripts/render-social.ts ${id}`] : []),
    ];
    throw new Error(`${id} no tiene la versión ${version.toUpperCase()} completa para ${redes.map((red) => NOMBRE_RED[red]).join(", ")}. Faltan:\n${faltan.map((file) => `  ${file}`).join("\n")}\nPara tenerla, ${como.join("; y ")}.`);
  }

  // Numeración global, en el orden de las salidas: cada archivo se copia una vez.
  const ordenados = porSalida.flatMap(({ files }) => files).filter((file, index, all) => usados.includes(file) && all.indexOf(file) === index);
  const nombre = new Map(ordenados.map((file, index) => [file, `${String(index + 1).padStart(2, "0")}-${path.basename(file)}`]));
  mkdirSync(dest, { recursive: true });
  for (const file of ordenados) copyFileSync(path.join(carpeta, file), path.join(dest, nombre.get(file)!));

  const manifiesto: { id: string; titulo: string; version: Version; fecha: string; redes: Record<string, { archivos: string[]; texto: string; primerComentario: string; alt: Record<string, string> }> } = { id, titulo: pieza.titulo, version, fecha, redes: {} };
  const md = [
    `# Publicar · ${pieza.titulo}`,
    "",
    `- Pieza: \`${id}\``,
    `- Versión: ${version.toUpperCase()} (${version === "a" ? "arte de ChatGPT + texto por código" : "diseño entero de ChatGPT"})`,
    `- Fecha de publicación: ${fecha}`,
    `- Redes: ${redes.map((red) => NOMBRE_RED[red]).join(", ")}`,
    "",
    "Pegá cada texto **tal cual**, sin cambiar ni agregar nada. Subí los archivos **en el orden** de la lista.",
  ];
  for (const red of redes) {
    const items = deSalidas.get(red)!;
    const files = items.flatMap(({ files }) => files);
    const seccion = red === "facebook" ? (seccionCopy(copy, "## Facebook") ?? seccionCopy(copy, SECCION_COPY.instagram)) : seccionCopy(copy, SECCION_COPY[red]);
    if (!seccion) throw new Error(`copy.md de ${id} no tiene la sección de ${NOMBRE_RED[red]} (${red === "facebook" ? "## Facebook o ## Instagram" : SECCION_COPY[red]})`);
    const comentario = seccionOpcional(copy, "Primer comentario", red) ?? "";
    const alt: Record<string, string> = {};
    for (const { salida, files: own } of items)
      own.forEach((file, index) => {
        if (/\.png$/.test(file)) alt[nombre.get(file)!] = altDe(salida, index);
      });
    manifiesto.redes[red] = { archivos: files.map((file) => nombre.get(file)!), texto: seccion, primerComentario: comentario, alt };
    md.push(
      "",
      `## ${NOMBRE_RED[red]}`,
      "",
      `Archivos, en este orden${files.length > 1 && files.every((file) => file.endsWith(".png")) ? " (un carrusel: una sola publicación con todas las imágenes)" : ""}:`,
      "",
      ...files.map((file, index) => `${index + 1}. \`${nombre.get(file)}\``),
      "",
      "### Texto",
      "",
      "````text",
      seccion,
      "````",
      "",
      "### Primer comentario",
      "",
      ...(comentario ? ["Dejalo apenas sale la publicación, desde la misma cuenta:", "", "````text", comentario, "````"] : ["No lleva. No comentes nada."]),
      "",
      "### Texto alternativo",
      "",
      ...(Object.keys(alt).length ? Object.entries(alt).map(([file, text]) => `- \`${file}\`: ${text}`) : ["No lleva (es video)."]),
    );
  }
  writeFileSync(path.join(dest, "publicar.md"), `${md.join("\n")}\n`);
  writeFileSync(path.join(dest, "paquete.json"), `${JSON.stringify(manifiesto, null, 2)}\n`);
  return { archivos: ordenados.length, redes };
}

const VALUED = ["--nota", "--quien", "--version", "--dest", "--redes", "--fecha"];
const [command, ...args] = process.argv.slice(2).filter((arg, index, all) => !arg.startsWith("--") && !VALUED.includes(all[index - 1] ?? ""));
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
    const formato = formatoDe(salida);
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
    const slides = diapositivasDe(salida);
    const tono = ("tono" in salida && salida.tono) || "oscuro";
    void (async () => {
      for (const [index, candidata] of candidatas.entries()) {
        const destino = path.join(carpetaDe(id), "imagenes", destinos[index]);
        await sharp(candidata.file).resize(width, height, { fit: "cover", position: "centre" }).png().toFile(destino);
        // La portada de mosaico no pasa por ChatGPT: la posición real de cada diapositiva sale de diapositivasChatGPT.
        const item = diapositivasChatGPT(salida)[index];
        const slide = item?.slide;
        if (slide?.tipo === "cierre") await firmarCierre(destino, formato, slides.length > 1 ? tonoDeDiapositiva(slide, item.index, tono) : tono);
        console.log(`  ${path.basename(candidata.file)} → imagenes/${destinos[index]}${slide?.tipo === "cierre" ? " (firmado con el monograma)" : ""}`);
      }
      const errores = revisarPieza(id).problemas.filter((p) => p.nivel === "error" && p.donde.startsWith(`salidas.${salidaId}`));
      for (const p of errores) console.log(`  error  ${p.donde}: ${p.mensaje}`);
      console.log(errores.length ? "✖ revisá los errores de arriba" : `✔ ${id} · ${salidaId}: versión de ChatGPT importada`);
    })();
    break;
  }
  case "firmar": {
    // Versión B hecha con Codex: las gpt-*.png ya están en imagenes/. Las deja a la medida y firma el cierre, una sola vez.
    const [id, salidaId] = args;
    const pieza = leerPieza(id ?? "");
    const salidas = pieza.salidas.filter((salida) => archivosChatGPT(salida).length && (!salidaId || salida.id === salidaId));
    if (!salidas.length) throw new Error(`${id} no tiene ${salidaId ? `la salida "${salidaId}" con` : ""} diapositivas de la versión B`);
    const dir = path.join(carpetaDe(id), "imagenes");
    const registro = path.join(dir, ".firmadas.json");
    const firmadas: Record<string, number> = existsSync(registro) ? JSON.parse(readFileSync(registro, "utf8")) : {};
    void (async () => {
      for (const salida of salidas) {
        const formato = formatoDe(salida);
        const { width, height } = SOCIAL_FORMATS[formato];
        const slides = diapositivasDe(salida);
        const tono = ("tono" in salida && salida.tono) || "oscuro";
        for (const { index, slide, file } of diapositivasChatGPT(salida)) {
          const full = path.join(dir, file);
          if (!existsSync(full)) {
            console.log(`  · falta imagenes/${file}`);
            continue;
          }
          const meta = await sharp(full).metadata();
          if (meta.width !== width || meta.height !== height) writeFileSync(full, await sharp(full).resize(width, height, { fit: "cover", position: "centre" }).png().toBuffer());
          if (slide.tipo === "cierre" && firmadas[file] !== statSync(full).mtimeMs) {
            await firmarCierre(full, formato, slides.length > 1 ? tonoDeDiapositiva(slide, index, tono) : tono);
            firmadas[file] = statSync(full).mtimeMs;
            console.log(`  imagenes/${file}: firmada con el monograma`);
          }
        }
      }
      writeFileSync(registro, `${JSON.stringify(firmadas, null, 2)}\n`);
      const errores = revisarPieza(id).problemas.filter((p) => p.nivel === "error" && p.donde.startsWith("salidas."));
      for (const p of errores) console.log(`  error  ${p.donde}: ${p.mensaje}`);
      console.log(errores.length ? "✖ revisá los errores de arriba" : `✔ ${id}: versión B a la medida y firmada`);
    })();
    break;
  }
  case "arte": {
    const [id, slotName, archivo] = args;
    const pieza = leerPieza(id ?? "");
    const slot = pieza.imagenes?.find((item) => item.slot === slotName);
    if (!slot) throw new Error(`${id} no declara el slot "${slotName}" en "imagenes" (hay: ${(pieza.imagenes ?? []).map((item) => item.slot).join(", ") || "ninguno"})`);
    let origen = archivo;
    if (!origen) {
      const descargas = path.join(os.homedir(), "Downloads");
      const ultima = readdirSync(descargas)
        .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
        .map((file) => ({ file: path.join(descargas, file), time: statSync(path.join(descargas, file)).mtimeMs }))
        .sort((a, b) => b.time - a.time)[0];
      if (!ultima) throw new Error(`No hay imágenes en ${descargas}`);
      origen = ultima.file;
    }
    const { width, height } = SOCIAL_FORMATS[slot.formato];
    mkdirSync(path.join(carpetaDe(id), "imagenes"), { recursive: true });
    const destino = path.join(carpetaDe(id), "imagenes", `${slot.slot}.png`);
    void sharp(origen)
      .resize(width, height, { fit: "cover", position: "centre" })
      .png()
      .toFile(destino)
      .then(() => {
        console.log(`  ${path.basename(origen!)} → imagenes/${slot.slot}.png (${width}×${height})`);
        const errores = revisarPieza(id).problemas.filter((p) => p.nivel === "error" && p.donde === `imagenes.${slot.slot}`);
        for (const p of errores) console.log(`  error  ${p.donde}: ${p.mensaje}`);
        console.log(errores.length ? "✖ revisá los errores de arriba" : `✔ ${id} · arte "${slot.slot}" listo. Renderizá la versión A: npx tsx scripts/render-social.ts ${id}`);
      });
    break;
  }
  case "paquete": {
    const [id] = args;
    const version = option("version")?.toLowerCase();
    const dest = option("dest");
    if (!id || (version !== "a" && version !== "b") || !dest) throw new Error("Uso: paquete <id> --version a|b --dest <carpeta> [--redes linkedin,instagram,facebook] [--fecha AAAA-MM-DD]");
    const redes = option("redes")?.split(",").map((red) => red.trim().toLowerCase()).filter(Boolean) as Red[] | undefined;
    for (const red of redes ?? []) if (!(red in NOMBRE_RED)) throw new Error(`"${red}" no es una red (${Object.keys(NOMBRE_RED).join(", ")})`);
    const fecha = option("fecha") ?? leerPieza(id).fecha;
    let hecho: ReturnType<typeof paquete>;
    try {
      hecho = paquete(id, version, path.resolve(dest), redes, fecha);
    } catch (error) {
      // Lo lee un script (publicar-contenido): mensaje claro, sin la traza.
      console.error(`✖ ${(error as Error).message}`);
      process.exit(1);
    }
    console.log(`✔ ${id} · versión ${version.toUpperCase()} → ${path.resolve(dest)} (${hecho.archivos} archivo/s, ${hecho.redes.join(", ")}, publicar.md)`);
    break;
  }
  default:
    console.log("Comandos: estado · listo <id> · borrador <id> · aprobar <id…> · hoy [fecha] · publicado <id> <plataforma> <url> · revision · chatgpt · importar <id> <salida> [carpeta] · firmar <id> [salida] · arte <id> <slot> [archivo] · paquete <id> --version a|b --dest <carpeta>");
}
