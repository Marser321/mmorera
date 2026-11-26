import test from "node:test";
import assert from "node:assert/strict";
import { layoutProblems } from "@/components/films/scenes/brand/layout/dataText";
import { tokens } from "@/components/social/SocialKit";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { CONTENIDO, entornoDe, listarPiezas, revisarPieza } from "../../../scripts/lib/piezas";
import { FRANJA_TEXTO, reelBeatLayout, reelCasoLayout, reelFirmaLayout, slideLayout } from "./layout";
import { cajaDeCelda, colorDeAngulo, luzDeCelda, MOSAICO, origenDeCelda } from "./mosaico";
import { archivosChatGPT, archivosDeVersion, archivosEsperados, luzDeSalida } from "./render";
import { desafioDiapositivas, reelTextoBeats, videoSeconds } from "./timing";
import { SOCIAL_FORMATS, type Diapositiva, type Formato, type Pieza } from "./types";
import { validarPieza, type Entorno } from "./validate";

const FORMATOS: Formato[] = ["reel", "feed", "cuadrado"];

/** Textos al límite de lo razonable para cada tipo de diapositiva. */
const SLIDES: Diapositiva[] = [
  { tipo: "portada", kicker: "Desafío del mes", titulo: "Mi web se veía *alejada* en los celulares y no lo sabía", bajada: "Un detalle invisible en el escritorio estiraba la página a 1560 píxeles de ancho." },
  { tipo: "texto", kicker: "02 · El problema", titulo: "Lo que no se ve también se mide", cuerpo: "Unos textos ocultos para lectores de pantalla quedaban posicionados contra un contenedor de afuera de la tira que se desplaza. En la computadora no pasaba nada; en el teléfono, el navegador alejaba toda la página para que entrara." },
  { tipo: "lista", kicker: "Antes de pedir una landing", titulo: "Tres preguntas que ahorran semanas", items: ["¿Qué tiene que pasar después de que alguien completa el formulario?", "¿Quién responde, en cuánto tiempo y con qué herramienta?", "¿Cómo vas a saber si funcionó, sin inventar números?"] },
  { tipo: "cita", kicker: "Criterio", cita: "Un agente sin tests es un pasante con acceso a producción.", autor: "Mario Morera" },
  { tipo: "comparacion", kicker: "Lo mismo, de dos maneras", titulo: "Un formulario, dos destinos", antes: { rotulo: "Antes", texto: "El lead llega a un correo que se revisa al día siguiente." }, despues: { rotulo: "Después", texto: "El lead entra al CRM, recibe respuesta y queda con su siguiente paso agendado (datos de ejemplo)." } },
  { tipo: "imagen", kicker: "Detrás de escena", imagen: "portada", titulo: "El film de cada caso sale de código", pie: "Remotion, datos verificados y una revisión cuadro por cuadro." },
  { tipo: "cierre", titulo: "¿Te pasó algo parecido?", cta: "Contame en los comentarios cómo lo resolviste.", enlace: "mmorera.agency/casos-de-exito" },
  { tipo: "tarjeta", kicker: "Opinión", texto: "Dejá de pedir *una web*. Pedí un sistema que conteste a las 23:45." },
  { tipo: "encuesta", pregunta: "¿Qué tarea te gustaría dejar de hacer a mano primero?", opciones: ["Responder consultas", "Agendar turnos", "Seguimiento post-venta", "Reportes semanales"] },
  { tipo: "sorteo", premio: "Una landing page lista para publicar", pasos: ["Seguí la cuenta.", "Comentá qué negocio tenés y qué tendría que lograr la landing.", "Compartí la publicación en tus historias (opcional)."], cierre: "Cierra el domingo 8 de noviembre a las 23:59", bases: "mmorera.agency/sorteos/landing-noviembre" },
];

test("piezas de redes: geometría", async (t) => {
  for (const formato of FORMATOS) {
    for (const slide of SLIDES) {
      await t.test(`${formato} · ${slide.tipo}`, () => {
        const layout = slideLayout(formato, slide, { n: 2, total: 7 }, { portada: { w: 1080, h: 1350 } });
        assert.deepEqual(layoutProblems(layout.blocks, layout.safe), [], `${formato} ${slide.tipo}`);
        // Nada sale del lienzo ni de la zona segura.
        for (const block of layout.blocks) assert.ok(block.box.y >= layout.safe.y - 0.5 && block.box.y + block.box.h <= layout.safe.y + layout.safe.h + 0.5, `${formato} ${slide.tipo}: ${block.id} fuera de la zona segura`);
      });
    }
  }
  await t.test("pulsos de reel, de una palabra a frases largas", () => {
    for (const value of ["Ojo.", "Un agente sin tests es un *pasante* con acceso a producción.", "Si tu web no contesta fuera de horario, tu competencia sí lo hace, y lo hace con un mensaje que parece escrito para esa persona."]) {
      for (const rol of ["gancho", "pulso", "remate"] as const) assert.deepEqual(layoutProblems(reelBeatLayout(value, rol, "01").blocks, reelBeatLayout(value, rol).safe), [], `${rol}: ${value}`);
      const caso = reelCasoLayout(value, "Decisión 01", true);
      assert.deepEqual(layoutProblems(caso.blocks, caso.safe), [], `caso: ${value}`);
    }
    const firma = reelFirmaLayout("Seguime para ver cómo lo construyo", "mmorera.agency/casos-de-exito/new-brothers-barberia");
    assert.deepEqual(layoutProblems(firma.blocks, firma.safe), []);
  });
});

test("piezas de redes: énfasis y ritmo", () => {
  assert.deepEqual(tokens("Pedí un *sistema que conteste* ya."), [
    { word: "Pedí", enfasis: false },
    { word: "un", enfasis: false },
    { word: "sistema", enfasis: true },
    { word: "que", enfasis: true },
    { word: "conteste", enfasis: true },
    { word: "ya.", enfasis: false },
  ]);
  assert.deepEqual(tokens("Un *pasante*, con acceso."), [
    { word: "Un", enfasis: false },
    { word: "pasante,", enfasis: true },
    { word: "con", enfasis: false },
    { word: "acceso.", enfasis: false },
  ]);
  const beats = reelTextoBeats({ id: "r", plantilla: "reel-texto", para: ["instagram"], gancho: "Gancho", pulsos: [{ texto: "Uno" }, { texto: "Dos" }], remate: "Remate", cta: "Seguime" });
  assert.equal(beats.at(-2)?.tono, "claro", "el remate se invierte");
  beats.forEach((beat, index) => index && assert.equal(beat.from, beats[index - 1].from + beats[index - 1].duration));
  assert.equal(desafioDiapositivas({ id: "d", plantilla: "desafio", formato: "feed", para: ["linkedin"], titulo: "T", contexto: "C", problema: "P", decision: "D", resultado: "R", aprendizaje: "A" }).length, 7);
});

const ENTORNO_OK: Entorno = { carpeta: "2026-10-12-muestra", copy: "## LinkedIn\nTexto\n## Instagram\nTexto\n## TikTok y Shorts\nTexto\n## X\nTexto", imagen: () => undefined, salida: [] };

const PIEZA_OK: Pieza = {
  id: "2026-10-12-muestra",
  fecha: "2026-10-12",
  rama: "criterio",
  titulo: "Muestra",
  estado: "borrador",
  salidas: [
    { id: "tarjeta", plantilla: "imagen", formato: "cuadrado", para: ["x", "linkedin"], diapositiva: { tipo: "tarjeta", texto: "Un agente sin tests es un pasante con acceso a producción." } },
    { id: "reel", plantilla: "reel-texto", para: ["instagram", "tiktok", "shorts"], gancho: "Un agente sin tests", pulsos: [{ texto: "Escribe rápido" }, { texto: "Se equivoca con *confianza*" }], remate: "Los tests son el jefe", cta: "Seguime para más" },
  ],
};

test("piezas de redes: validador", async (t) => {
  await t.test("una pieza bien armada no tiene errores", () => {
    assert.deepEqual(validarPieza(PIEZA_OK, ENTORNO_OK).filter((p) => p.nivel === "error"), []);
    assert.ok(videoSeconds(PIEZA_OK.salidas[1]) < 60);
  });
  await t.test("rechaza cifras de resultado, inglés y copy faltante", () => {
    const mala: Pieza = { ...PIEZA_OK, salidas: [{ ...PIEZA_OK.salidas[0], para: ["x"], diapositiva: { tipo: "tarjeta", texto: "Duplicamos ventas un 40% en un mes" } } as Pieza["salidas"][number]] };
    const problemas = validarPieza(mala, { ...ENTORNO_OK, copy: "## LinkedIn\nTexto" });
    assert.ok(problemas.some((p) => p.donde === "honestidad"), "40 % y duplicar");
    assert.ok(problemas.some((p) => p.donde === "copy.md" && p.mensaje.includes("## X")), "falta la sección de X");
  });
  await t.test("una pieza lista exige sus renders", () => {
    const lista: Pieza = { ...PIEZA_OK, estado: "listo" };
    const faltan = validarPieza(lista, ENTORNO_OK).filter((p) => p.donde === "salida").length;
    assert.equal(faltan, archivosEsperados(lista).length);
    assert.deepEqual(archivosEsperados(lista), ["tarjeta.png", "reel.mp4", "reel-portada.png"]);
  });
  await t.test("datos de ejemplo: alguna pantalla lo dice", () => {
    const problemas = validarPieza({ ...PIEZA_OK, ejemplo: true }, ENTORNO_OK);
    assert.ok(problemas.some((p) => p.mensaje.includes("datos de ejemplo")));
  });
});

test("piezas de redes: las de contenido/ validan", () => {
  for (const id of listarPiezas()) {
    const { problemas } = revisarPieza(id);
    // Renders e imágenes son binarios fuera de git: se exigen en check-pieza, no acá.
    const errores = problemas.filter((p) => p.nivel === "error" && p.donde !== "salida" && !p.donde.startsWith("imagenes."));
    assert.deepEqual(errores, [], `${id}: ${errores.map((p) => `${p.donde}: ${p.mensaje}`).join(" · ")}`);
    assert.ok(entornoDe(id).copy !== undefined || revisarPieza(id).pieza?.estado === "idea", `${id}: falta copy.md`);
  }
});

test("piezas de redes: las plantillas de contenido/plantillas son ejemplos válidos", () => {
  const dir = path.join(CONTENIDO, "plantillas");
  const files = readdirSync(dir).filter((file) => file.endsWith(".json"));
  assert.ok(files.length >= 7, "faltan plantillas");
  for (const file of files) {
    const pieza = JSON.parse(readFileSync(path.join(dir, file), "utf8")) as Pieza;
    const errores = validarPieza(pieza, { ...ENTORNO_OK, carpeta: pieza.id }).filter((p) => p.nivel === "error" && p.donde !== "salida" && !p.donde.startsWith("imagenes."));
    assert.deepEqual(errores, [], `${file}: ${errores.map((p) => `${p.donde}: ${p.mensaje}`).join(" · ")}`);
  }
});

test("piezas de redes: arte de fondo (versión A)", async (t) => {
  const conFondo = (slide: Diapositiva, formato: "feed" | "cuadrado" = "cuadrado"): Pieza => ({
    ...PIEZA_OK,
    imagenes: [{ slot: "llave", formato, prompt: "Una llave colgada de un clavo, arriba a la derecha." }],
    salidas: [{ id: "tarjeta", plantilla: "imagen", formato, para: ["linkedin"], diapositiva: slide }],
  });
  const errores = (pieza: Pieza, entorno: Entorno = ENTORNO_OK) => validarPieza(pieza, entorno).filter((p) => p.nivel === "error");
  await t.test("un fondo declarado y del mismo formato valida", () => {
    assert.deepEqual(errores(conFondo({ tipo: "tarjeta", texto: "Un agente sin tests es un *pasante* con acceso a producción.", fondo: "llave" })), []);
  });
  await t.test("rechaza un fondo sin declarar, de otro formato o en un tipo que no lo admite", () => {
    assert.ok(errores(conFondo({ tipo: "tarjeta", texto: "Hola.", fondo: "otra" })).some((p) => p.mensaje.includes("no está declarado")));
    const otroFormato = conFondo({ tipo: "tarjeta", texto: "Hola.", fondo: "llave" });
    otroFormato.imagenes = [{ slot: "llave", formato: "feed", prompt: "Una llave." }];
    assert.ok(errores(otroFormato).some((p) => p.mensaje.includes("mismo formato")));
    const enTexto = conFondo({ tipo: "texto", titulo: "T", cuerpo: "C", fondo: "llave" } as unknown as Diapositiva);
    assert.ok(errores(enTexto).some((p) => p.mensaje.includes("solo va en")));
  });
  await t.test("si falta el arte de una pieza lista, avisa (la versión A sale solo con código)", () => {
    const lista = { ...conFondo({ tipo: "tarjeta", texto: "Hola.", fondo: "llave" }), estado: "listo" as const };
    const problemas = validarPieza(lista, { ...ENTORNO_OK, salida: ["tarjeta.png"] });
    assert.deepEqual(problemas.filter((p) => p.nivel === "error"), []);
    assert.ok(problemas.some((p) => p.nivel === "aviso" && p.donde === "imagenes.llave"));
  });
  await t.test("con fondo, el texto queda en su franja de abajo", () => {
    const casos: Array<[Formato, Diapositiva]> = [
      ["cuadrado", { tipo: "tarjeta", kicker: "Criterio", texto: "Dejá de pedir *una web*. Pedí un sistema que conteste a las 23:45.", fondo: "a" }],
      ["feed", { tipo: "portada", kicker: "Así funciona", titulo: "Qué pasa con un lead que llega a las *23:45*", bajada: "El mismo formulario, con y sin sistema.", fondo: "a" }],
      ["feed", { tipo: "cita", cita: "Un agente sin tests es un pasante con acceso a producción.", autor: "Mario Morera", fondo: "a" }],
      ["feed", { tipo: "cierre", titulo: "¿Tu formulario contesta de noche?", cta: "Guardalo para revisarlo con tu equipo.", enlace: "mmorera.agency/sistemas", fondo: "a" }],
    ];
    for (const [formato, slide] of casos) {
      const layout = slideLayout(formato, slide, { n: 1, total: 5 });
      assert.deepEqual(layoutProblems(layout.blocks, layout.safe), [], `${formato} ${slide.tipo}`);
      const franja = FRANJA_TEXTO[slide.tipo as keyof typeof FRANJA_TEXTO];
      assert.ok(layout.zona && layout.zona.y >= SOCIAL_FORMATS[formato].height * (1 - franja) - 0.5, `${formato} ${slide.tipo}: el texto sube a ${layout.zona?.y}`);
    }
  });
  await t.test("versiones: A sale del render, B de ChatGPT (los videos siempre del código)", () => {
    const carrusel: Pieza["salidas"][number] = { id: "carrusel", plantilla: "carrusel", formato: "feed", video: true, para: ["instagram"], diapositivas: [{ tipo: "portada", titulo: "Uno" }, { tipo: "texto", titulo: "Dos", cuerpo: "Tres" }, { tipo: "cierre", titulo: "Cuatro", cta: "Cinco" }] };
    assert.deepEqual(archivosDeVersion(carrusel, "a"), ["salida/carrusel-01.png", "salida/carrusel-02.png", "salida/carrusel-03.png", "salida/carrusel.mp4"]);
    assert.deepEqual(archivosDeVersion(carrusel, "b"), ["imagenes/gpt-carrusel-01.png", "imagenes/gpt-carrusel-02.png", "imagenes/gpt-carrusel-03.png", "salida/carrusel.mp4"]);
    assert.deepEqual(archivosDeVersion(PIEZA_OK.salidas[1], "b"), ["salida/reel.mp4"], "el reel no lleva su portada en el paquete");
  });
});

test("piezas de redes: luz y mosaico del feed", async (t) => {
  const portada = (celda: number, titulo = "Chatbots"): Diapositiva => ({ tipo: "portada", kicker: "03", titulo, mosaico: { celda } });
  const carrusel = (celda: number): Pieza["salidas"][number] => ({ id: "carrusel", plantilla: "carrusel", formato: "feed", para: ["instagram"], diapositivas: [portada(celda), { tipo: "texto", titulo: "Dos", cuerpo: "Tres" }, { tipo: "cierre", titulo: "Cuatro", cta: "Cinco" }] });
  await t.test("la vuelta de color pasa por los tres colores del sitio y cierra", () => {
    assert.equal(colorDeAngulo(MOSAICO.desde), "#B68CFF");
    assert.equal(colorDeAngulo(MOSAICO.desde + 120), "#55D8FF");
    assert.equal(colorDeAngulo(MOSAICO.desde + 240), "#71F3A2");
    assert.equal(luzDeCelda(5), undefined, "el centro no lleva luz");
    for (const celda of [1, 2, 3, 4, 6, 7, 8, 9]) assert.match(luzDeCelda(celda)!, /^#[0-9A-F]{6}$/);
  });
  await t.test("las nueve portadas calzan: celdas de 3:4 con su separación, sin huecos", () => {
    assert.equal(origenDeCelda(1).x, -MOSAICO.recorte);
    assert.equal(origenDeCelda(2).x - origenDeCelda(1).x, MOSAICO.cellW + MOSAICO.gap);
    assert.equal(origenDeCelda(4).y - origenDeCelda(1).y, SOCIAL_FORMATS.feed.height + MOSAICO.gap);
    assert.equal(origenDeCelda(9).x + SOCIAL_FORMATS.feed.width - MOSAICO.recorte, MOSAICO.width);
  });
  await t.test("el texto de cada portada entra en su caja y queda fuera del anillo", () => {
    const serie = JSON.parse(readFileSync(path.join(CONTENIDO, "series", "feed-9.json"), "utf8")) as { celdas: Array<{ celda: number; kicker?: string; titulo: string }> };
    assert.deepEqual(serie.celdas.map((item) => item.celda), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const item of serie.celdas) {
      const layout = slideLayout("feed", { tipo: "portada", kicker: item.kicker, titulo: item.titulo, mosaico: { celda: item.celda } });
      assert.deepEqual(layoutProblems(layout.blocks, layout.safe), [], `celda ${item.celda}`);
      if (item.celda === 5) assert.equal(layout.elements.length, 0, "el centro no lleva texto");
      const caja = cajaDeCelda(item.celda);
      const origen = origenDeCelda(item.celda);
      for (const block of layout.blocks) {
        assert.ok(caja && block.box.y >= caja.box.y - 0.5 && block.box.y + block.box.h <= caja.box.y + caja.box.h + 0.5, `celda ${item.celda}: ${block.id} fuera de su caja`);
        // Ninguna esquina del texto cae dentro del anillo (con 30 px de aire para el halo).
        for (const [x, y] of [[block.box.x, block.box.y], [block.box.x + block.box.w, block.box.y], [block.box.x, block.box.y + block.box.h], [block.box.x + block.box.w, block.box.y + block.box.h]]) {
          const d = Math.hypot(origen.x + x - MOSAICO.anillo.cx, origen.y + y - MOSAICO.anillo.cy);
          assert.ok(block.id === "kicker" || d > MOSAICO.anillo.r + 30 || block.box.w > 600, `celda ${item.celda}: ${block.id} toca el anillo`);
        }
      }
    }
  });
  await t.test("validador: mosaico solo en la portada que abre, en 4:5 y del 1 al 9; luz de las tres", () => {
    const pieza = (salida: Pieza["salidas"][number], extra: Partial<Pieza> = {}): Pieza => ({ ...PIEZA_OK, ...extra, salidas: [salida] });
    const errores = (p: Pieza) => validarPieza(p, ENTORNO_OK).filter((x) => x.nivel === "error").map((x) => x.mensaje);
    assert.deepEqual(errores(pieza(carrusel(3))), []);
    assert.ok(errores(pieza(carrusel(12))).some((m) => m.includes("del 1 al 9")));
    const cuadrado = { ...carrusel(3), formato: "cuadrado" } as Pieza["salidas"][number];
    assert.ok(errores(pieza(cuadrado)).some((m) => m.includes("4:5")));
    const segunda = carrusel(3) as Extract<Pieza["salidas"][number], { plantilla: "carrusel" }>;
    segunda.diapositivas = [{ tipo: "portada", titulo: "Uno" }, portada(3), { tipo: "cierre", titulo: "Cuatro", cta: "Cinco" }];
    assert.ok(errores(pieza(segunda)).some((m) => m.includes("abre la salida")));
    assert.ok(errores(pieza(carrusel(3), { luz: "rojo" as never })).some((m) => m.includes("no es una luz")));
  });
  await t.test("la luz de un carrusel de mosaico es la de su celda; si no, la de la pieza", () => {
    assert.equal(luzDeSalida({}, carrusel(8)), luzDeCelda(8));
    assert.equal(luzDeSalida({ luz: "verde" }, PIEZA_OK.salidas[0]), "#71F3A2");
    assert.equal(luzDeSalida({}, PIEZA_OK.salidas[0]), undefined);
  });
  await t.test("la portada de mosaico sale siempre del código, también en la versión B", () => {
    assert.deepEqual(archivosChatGPT(carrusel(3)), ["gpt-carrusel-02.png", "gpt-carrusel-03.png"]);
    assert.deepEqual(archivosDeVersion(carrusel(3), "b"), ["salida/carrusel-01.png", "imagenes/gpt-carrusel-02.png", "imagenes/gpt-carrusel-03.png"]);
  });
});
