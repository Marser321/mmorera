import test from "node:test";
import assert from "node:assert/strict";
import { layoutProblems } from "@/components/films/scenes/brand/layout/dataText";
import { tokens } from "@/components/social/SocialKit";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { CONTENIDO, entornoDe, listarPiezas, revisarPieza } from "../../../scripts/lib/piezas";
import { reelBeatLayout, reelCasoLayout, reelComparacionLayout, reelConteoItemLayout, reelConteoNumeroLayout, reelEncuestaLayout, reelFirmaLayout, slideLayout } from "./layout";
import { archivosEsperados, contarLaminas } from "./render";
import { desafioDiapositivas, reelCasoBeats, reelComparacionBeats, reelConteoBeats, reelEncuestaBeats, reelTextoBeats, videoSeconds } from "./timing";
import type { Diapositiva, Formato, Pieza } from "./types";
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
  await t.test("nuevas plantillas: geometría pura en zona segura", () => {
    for (const n of [1, 3, 5]) {
      const numLayout = reelConteoNumeroLayout(n);
      assert.deepEqual(layoutProblems(numLayout.blocks, numLayout.safe), [], `conteo num ${n}`);
    }
    for (const [title, text] of [
      ["Interfaces verificadas", "Los contratos de datos se definen antes de codificar la lógica."],
      ["Un título intencionalmente largo para medir el límite", "Un texto explicativo completo que demuestra que el escalón tipográfico se adapta a la zona segura sin pisar elementos."],
    ]) {
      const itemLayout = reelConteoItemLayout(title, text, "N.º 3");
      assert.deepEqual(layoutProblems(itemLayout.blocks, itemLayout.safe), [], `conteo item: ${title}`);
    }

    for (const etapa of ["antes", "despues", "juntas"] as const) {
      const compLayout = reelComparacionLayout(
        etapa,
        { rotulo: "Antes", texto: "El lead llega a un correo que se revisa al día siguiente." },
        { rotulo: "Después", texto: "El lead entra al CRM, recibe respuesta y queda agendado (datos de ejemplo)." },
      );
      assert.deepEqual(layoutProblems(compLayout.blocks, compLayout.safe), [], `comparacion ${etapa}`);
    }

    const opts = ["Responder consultas", "Conciliar facturas", "Agendar reuniones", "Actualizar bases"];
    for (let i = 0; i < opts.length; i++) {
      const encLayout = reelEncuestaLayout("¿Qué tarea te frena más?", opts, i, i);
      assert.deepEqual(layoutProblems(encLayout.blocks, encLayout.safe), [], `encuesta paso ${i}`);
    }
    const todasLayout = reelEncuestaLayout("¿Qué tarea te frena más?", opts, opts.length - 1, undefined, "Comentá A, B, C o D");
    assert.deepEqual(layoutProblems(todasLayout.blocks, todasLayout.safe), [], "encuesta todas juntas");
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

  const conteoBeats = reelConteoBeats({ id: "c", plantilla: "reel-conteo", para: ["instagram"], gancho: "G", items: [{ titulo: "T1", texto: "X1" }, { titulo: "T2", texto: "X2" }, { titulo: "T3", texto: "X3" }], remate: "R", cta: "S" });
  assert.equal(conteoBeats.at(-2)?.tono, "claro", "el remate de conteo se invierte");
  assert.equal(conteoBeats.filter((b) => b.id.startsWith("num-")).length, 3);

  const compBeats = reelComparacionBeats({ id: "cp", plantilla: "reel-comparacion", para: ["instagram"], gancho: "G", antes: { rotulo: "A", texto: "TA" }, despues: { rotulo: "D", texto: "TD" }, remate: "R", cta: "S" });
  assert.ok(compBeats.some((b) => b.id === "antes"));
  assert.ok(compBeats.some((b) => b.id === "despues"));
  assert.ok(compBeats.some((b) => b.id === "juntas"));

  const encBeats = reelEncuestaBeats({ id: "e", plantilla: "reel-encuesta", para: ["instagram"], pregunta: "P", opciones: ["O1", "O2", "O3"], cta: "S" });
  assert.equal(encBeats.filter((b) => b.id.startsWith("opcion-")).length, 3);
  assert.ok(encBeats.some((b) => b.id === "todas-juntas"));

  const casoBeats = reelCasoBeats({ id: "cs", plantilla: "reel-caso", para: ["instagram"], caso: "new-brothers-barberia", gancho: "G", decisiones: ["D1", "D2", "D3"], cierre: "C" }, "New Brothers");
  assert.equal(casoBeats.length, 6);
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
  await t.test("generador html: pide diseno.html y sus láminas, no imágenes de ChatGPT", () => {
    const diapositivas: Diapositiva[] = [
      { tipo: "portada", titulo: "Llegó a las 23:45. La vieron a las 9:10." },
      { tipo: "texto", titulo: "La respuesta salió", cuerpo: "El seguimiento, no." },
      { tipo: "cierre", titulo: "¿Quién la retoma?", cta: "Contame cómo lo resolvés." },
    ];
    const pieza: Pieza = { ...PIEZA_OK, salidas: [{ id: "carrusel", plantilla: "carrusel", generador: "html", formato: "feed", para: ["linkedin", "instagram"], diapositivas }] };
    assert.ok(validarPieza(pieza, ENTORNO_OK).some((p) => p.nivel === "error" && p.mensaje.includes("falta diseno.html")));
    const conDiseno = validarPieza(pieza, { ...ENTORNO_OK, laminas: 3 });
    assert.deepEqual(conDiseno.filter((p) => p.nivel === "error"), []);
    assert.ok(!conDiseno.some((p) => p.mensaje.includes("ChatGPT")));
    assert.ok(validarPieza(pieza, { ...ENTORNO_OK, laminas: 4 }).some((p) => p.nivel === "aviso" && p.mensaje.includes("4 lámina(s)")));
    const faltan = validarPieza({ ...pieza, estado: "listo" }, { ...ENTORNO_OK, laminas: 3 }).filter((p) => p.donde === "salida");
    assert.deepEqual(faltan.map((p) => p.mensaje.split(" ")[1]), ["lamina-01.png", "lamina-02.png", "lamina-03.png", "carrusel.pdf"]);
    assert.equal(contarLaminas('<section class="lamina portada">a</section><section class="laminas">b</section><section id="x" class="lamina">c</section>'), 2);
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
