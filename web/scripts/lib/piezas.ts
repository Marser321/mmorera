import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { mediaSize } from "../../src/lib/mediaSize";
import type { Pieza } from "../../src/data/social/types";
import { validarPieza, type Entorno, type Problema } from "../../src/data/social/validate";

/**
 * Acceso a disco de las piezas de redes (contenido/piezas/<id>/). Lo comparten
 * check-pieza, render-social, contenido.ts y los tests. Funciona desde web/ o
 * desde la raíz del repo.
 */

export const CONTENIDO = existsSync(path.resolve(process.cwd(), "contenido")) ? path.resolve(process.cwd(), "contenido") : path.resolve(process.cwd(), "..", "contenido");
export const PIEZAS = path.join(CONTENIDO, "piezas");

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

export const carpetaDe = (id: string) => path.join(PIEZAS, id);

export function listarPiezas(): string[] {
  if (!existsSync(PIEZAS)) return [];
  return readdirSync(PIEZAS)
    .filter((name) => !name.startsWith(".") && !name.startsWith("_") && statSync(path.join(PIEZAS, name)).isDirectory())
    .sort();
}

/** Imagen elegida para un slot: imagenes/<slot>.png|jpg|jpeg|webp. */
export function imagenDe(id: string, slot: string): { file: string; w: number; h: number } | undefined {
  for (const extension of IMAGE_EXTENSIONS) {
    const file = path.join(carpetaDe(id), "imagenes", `${slot}.${extension}`);
    if (existsSync(file)) {
      const size = mediaSize(readFileSync(file), file);
      return { file, w: size.width, h: size.height };
    }
  }
  return undefined;
}

export function leerPieza(id: string): Pieza {
  return JSON.parse(readFileSync(path.join(carpetaDe(id), "pieza.json"), "utf8")) as Pieza;
}

export function guardarPieza(pieza: Pieza) {
  writeFileSync(path.join(carpetaDe(pieza.id), "pieza.json"), `${JSON.stringify(pieza, null, 2)}\n`);
}

export function entornoDe(id: string): Entorno {
  const carpeta = carpetaDe(id);
  const copyFile = path.join(carpeta, "copy.md");
  const salida = path.join(carpeta, "salida");
  return {
    carpeta: id,
    copy: existsSync(copyFile) ? readFileSync(copyFile, "utf8") : undefined,
    imagen: (slot) => {
      const found = imagenDe(id, slot);
      return found ? { w: found.w, h: found.h } : undefined;
    },
    salida: existsSync(salida) ? readdirSync(salida) : [],
    archivoImagen: (file) => {
      const full = path.join(carpeta, "imagenes", file);
      if (!existsSync(full)) return undefined;
      const size = mediaSize(readFileSync(full), full);
      return { w: size.width, h: size.height };
    },
  };
}

export function revisarPieza(id: string): { pieza?: Pieza; problemas: Problema[] } {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path.join(carpetaDe(id), "pieza.json"), "utf8"));
  } catch (error) {
    return { problemas: [{ nivel: "error", donde: "pieza.json", mensaje: `no se puede leer: ${(error as Error).message}` }] };
  }
  return { pieza: raw as Pieza, problemas: validarPieza(raw, entornoDe(id)) };
}

/** Sección "## Plataforma" de copy.md (hasta la siguiente "## "). */
export function seccionCopy(copy: string, titulo: string) {
  const start = copy.indexOf(titulo);
  if (start < 0) return undefined;
  const rest = copy.slice(start + titulo.length);
  const end = rest.search(/\n## /);
  return (end < 0 ? rest : rest.slice(0, end)).trim();
}
