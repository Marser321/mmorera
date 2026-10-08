import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";

/**
 * Lo que comparten los renders fuera de Next (films y piezas de redes):
 *
 * - Remotion no publica su compositor para Windows ARM64: en esa máquina se usa
 *   el binario x64 (corre emulado) desde .remotion-bin/, que se baja de npm la
 *   primera vez (`npm pack @remotion/compositor-win32-x64-msvc`).
 * - En el sitio las imágenes viven en /portfolio/…; el bundle sirve public/ en
 *   otra ruta, así que se copia public/portfolio a su raíz y las rutas resuelven
 *   igual que en el sitio.
 */

const ROOT = process.cwd();
const REMOTION_VERSION = "4.0.490";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

/** Compositor x64 para Windows ARM64 (emulado); en las demás plataformas, el de npm. */
export function binariesDirectory() {
  if (!(process.platform === "win32" && os.arch() === "arm64")) return null;
  const dir = path.join(ROOT, ".remotion-bin");
  const pkg = path.join(dir, "package");
  if (!existsSync(path.join(pkg, "remotion.exe")) && !existsSync(path.join(pkg, "ffmpeg.exe"))) {
    mkdirSync(dir, { recursive: true });
    execSync(`npm pack @remotion/compositor-win32-x64-msvc@${REMOTION_VERSION}`, { cwd: dir, stdio: "inherit" });
    execSync(`tar -xzf remotion-compositor-win32-x64-msvc-${REMOTION_VERSION}.tgz`, { cwd: dir, stdio: "inherit" });
  }
  return pkg;
}

export const browserExecutable = () => (process.platform === "win32" && existsSync(CHROME) ? CHROME : null);

/** Empaqueta una raíz de Remotion con el alias `@` y la carpeta portfolio en la raíz del bundle. */
export async function bundleRoot(entry: string) {
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, entry),
    publicDir: path.join(ROOT, "public"),
    webpackOverride: (config) => ({ ...config, resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@": path.join(ROOT, "src") } } }),
  });
  cpSync(path.join(ROOT, "public/portfolio"), path.join(serveUrl, "portfolio"), { recursive: true });
  return serveUrl;
}
