import { test } from "node:test";
import assert from "node:assert/strict";
import { PROPUESTA_EJEMPLO } from "../data/propuestaEjemplo";
import {
  enlaceEmailPropuesta,
  enlaceWhatsAppPropuesta,
  fechaPropuesta,
  normalizarPropuesta,
  slugPropuestaValido,
  tienePrecio,
} from "./propuesta";
import { ejemploDisponible, leerCuerpo } from "./propuestaFuente";

type Crudo = {
  [clave: string]: unknown;
  demo: Record<string, unknown>;
  diagnostico: Record<string, unknown>[];
  como_quedaria: string[];
  siguiente_paso: Record<string, unknown>;
};
const base = () => JSON.parse(JSON.stringify(PROPUESTA_EJEMPLO)) as Crudo;

test("el ejemplo (mismo formato que n8n) queda completo", () => {
  const p = normalizarPropuesta(base(), { ejemplo: true });
  assert.ok(p);
  assert.equal(p.negocio, "Lavadero Sur");
  assert.equal(p.idioma, "es");
  assert.equal(p.diagnostico.length, 2);
  assert.equal(p.comoQuedaria.length, 4);
  assert.equal(p.porQuePropio.length, 4);
  assert.equal(p.demo.url, "https://oficio.mmorera.agency/");
  assert.equal(p.siguientePaso.whatsapp, "https://wa.me/59892323675");
  assert.equal(p.siguientePaso.email, null);
  assert.equal(p.ejemplo, true);
});

test("sin titular, situación, demo o siguiente paso no hay propuesta", () => {
  for (const quitar of ["titular", "situacion", "demo", "siguiente_paso", "slug"]) {
    const d = base();
    delete d[quitar];
    assert.equal(normalizarPropuesta(d), null, quitar);
  }
  assert.equal(normalizarPropuesta(null), null);
  assert.equal(normalizarPropuesta([]), null);
  assert.equal(normalizarPropuesta("texto"), null);
});

test("descarta enlaces que no son https y contactos raros", () => {
  const d = base();
  d.demo.url = "javascript:alert(1)";
  assert.equal(normalizarPropuesta(d), null);

  const e = base();
  e.demo.imagen = "http://inseguro.com/a.jpg";
  e.diagnostico[0].captura = "/demos/captura.webp";
  e.diagnostico[1].captura = "//otro-sitio.com/a.jpg";
  e.siguiente_paso.whatsapp = "https://evil.example/wa.me/598";
  e.siguiente_paso.email = "mario@mmorera.agency";
  const p = normalizarPropuesta(e);
  assert.ok(p);
  assert.equal(p.demo.imagen, null);
  assert.equal(p.diagnostico[0].captura, "/demos/captura.webp");
  assert.equal(p.diagnostico[1].captura, null);
  assert.equal(p.siguientePaso.whatsapp, null);
  assert.equal(p.siguientePaso.email, "mario@mmorera.agency");
});

test("como mucho tres hallazgos; los incompletos se saltean", () => {
  const d = base();
  d.diagnostico = [
    { titulo: "Uno", detalle: "a" },
    { titulo: "", detalle: "sin título" },
    { titulo: "Dos", detalle: "b" },
    { titulo: "Tres", detalle: "c" },
    { titulo: "Cuatro", detalle: "d" },
  ];
  const p = normalizarPropuesta(d);
  assert.deepEqual(
    p?.diagnostico.map((h) => h.titulo),
    ["Uno", "Dos", "Tres"],
  );
});

test("tienePrecio encuentra cifras con moneda y deja pasar horas y fechas", () => {
  for (const conPrecio of ["Sale USD 500", "desde $ 1.200", "US$49", "49 €", "30 dólares", "49/mes", "U$S 600 la implementación", "1.500 pesos"]) {
    assert.equal(tienePrecio(conPrecio), true, conPrecio);
  }
  for (const sinPrecio of ["24 h", "abierto 24/7", "desde 2019", "5 sucursales", "3 de cada 10 clientes", "una vez al mes", "Av. Italia 2400"]) {
    assert.equal(tienePrecio(sinPrecio), false, sinPrecio);
  }
});

test("una propuesta con precio no se muestra (D-011)", () => {
  const d = base();
  d.como_quedaria[2] = "Todo esto por USD 49 al mes.";
  assert.equal(normalizarPropuesta(d), null);
});

test("idioma: solo es o en", () => {
  const d = base();
  d.idioma = "pt";
  assert.equal(normalizarPropuesta(d)?.idioma, "es");
  d.idioma = "en";
  assert.equal(normalizarPropuesta(d)?.idioma, "en");
});

test("slug: igual que el webhook (minúsculas, números y guiones, hasta 60)", () => {
  assert.equal(slugPropuestaValido("nettuno-4384"), true);
  assert.equal(slugPropuestaValido("Nettuno"), false);
  assert.equal(slugPropuestaValido("-x"), false);
  assert.equal(slugPropuestaValido("a".repeat(61)), false);
});

test("WhatsApp con el mensaje armado y email con asunto", () => {
  const p = { negocio: "Lavadero Sur", idioma: "es" as const };
  assert.equal(
    enlaceWhatsAppPropuesta("https://wa.me/59892323675", p),
    "https://wa.me/59892323675?text=Hola+Mario%2C+vi+la+propuesta+para+Lavadero+Sur.+Lo+hablamos.",
  );
  assert.equal(enlaceWhatsAppPropuesta("https://wa.me/59892323675?text=Hola", p), "https://wa.me/59892323675?text=Hola");
  assert.equal(enlaceEmailPropuesta("a@b.co", p), "mailto:a@b.co?subject=Propuesta%20para%20Lavadero%20Sur");
});

test("fecha con la hora de Montevideo", () => {
  assert.equal(fechaPropuesta("2026-11-25T21:29:46Z", "es"), "25 de noviembre de 2026");
  assert.equal(fechaPropuesta("2026-11-26T01:00:00Z", "es"), "25 de noviembre de 2026");
  assert.equal(fechaPropuesta("no es fecha", "es"), null);
  assert.equal(fechaPropuesta(null, "en"), null);
});

test("leerCuerpo acepta el JSON de n8n, también doblemente codificado, y fija el slug", () => {
  const json = JSON.stringify({ ...base(), slug: "otro" });
  assert.equal(leerCuerpo(json, "nettuno-4384")?.slug, "nettuno-4384");
  assert.equal(leerCuerpo(JSON.stringify(json), "nettuno-4384")?.titular, base().titular);
  assert.equal(leerCuerpo("no es json", "x"), null);
  assert.equal(leerCuerpo("[1,2]", "x"), null);
});

test("el ejemplo nunca se sirve en producción, sí en vistas previas", () => {
  assert.equal(ejemploDisponible({ NODE_ENV: "development" } as NodeJS.ProcessEnv), true);
  assert.equal(ejemploDisponible({ NODE_ENV: "production" } as NodeJS.ProcessEnv), false);
  assert.equal(ejemploDisponible({ NODE_ENV: "production", VERCEL_ENV: "preview" } as NodeJS.ProcessEnv), true);
  assert.equal(ejemploDisponible({ NODE_ENV: "production", VERCEL_ENV: "production" } as NodeJS.ProcessEnv), false);
});

test("etiquetas propias: toma los títulos que vienen y descarta lo que no encaja", () => {
  const d = base() as Record<string, unknown>;
  d.etiquetas = { demo: { titulo: "Mi trabajo", boton: "Ver portfolio" }, como_quedaria: { indice: "Cómo trabajaríamos" }, inventada: { titulo: "x" } };
  const p = normalizarPropuesta(d);
  assert.ok(p);
  assert.equal(p.etiquetas.demo?.titulo, "Mi trabajo");
  assert.equal(p.etiquetas.demo?.boton, "Ver portfolio");
  assert.equal(p.etiquetas.como_quedaria?.indice, "Cómo trabajaríamos");
  assert.ok(!("inventada" in p.etiquetas));
});

test("sin etiquetas, quedan vacías", () => {
  const p = normalizarPropuesta(base());
  assert.ok(p);
  assert.deepEqual(p.etiquetas, {});
});

test("una cifra con moneda en una etiqueta también bloquea la propuesta", () => {
  const d = base() as Record<string, unknown>;
  d.etiquetas = { siguiente_paso: { titulo: "Desde USD 500" } };
  assert.equal(normalizarPropuesta(d), null);
});
