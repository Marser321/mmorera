import { limpiarOrigen } from "@/lib/origen";

const MINUSCULAS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "en", "the", "and", "of"]);

/**
 * Convierte el slug de un enlace personal (`/demo/city-fitness`) en el nombre
 * que se muestra («City Fitness»). Devuelve null si el slug no es válido, y
 * entonces la página responde 404.
 */
export function negocioDeRuta(valor: string): { slug: string; nombre: string } | null {
  const slug = limpiarOrigen(decodeURIComponent(valor));
  if (!slug) return null;
  const nombre = slug
    .split("-")
    .filter(Boolean)
    .map((palabra, i) => {
      if (i > 0 && MINUSCULAS.has(palabra)) return palabra;
      if (/^\d+$/.test(palabra)) return palabra;
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
  return { slug, nombre };
}
