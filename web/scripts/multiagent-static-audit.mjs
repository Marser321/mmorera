#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");

if (!existsSync(srcDir)) {
  console.error("Error: No se encontró la carpeta 'src' en el directorio actual.");
  process.exit(1);
}

const allowedExtensions = new Set([".tsx", ".ts", ".jsx", ".js"]);
const findings = [];

function walk(dir) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) return walk(fullPath);
    if (!allowedExtensions.has(path.extname(entry))) return [];
    return [fullPath];
  });
}

function lineFor(source, index) {
  return source.slice(0, index).split("\n").length;
}

function addFinding(file, line, type, agent, message) {
  findings.push({
    file: path.relative(root, file),
    line,
    type,
    agent,
    message,
  });
}

function auditFile(file) {
  const source = readFileSync(file, "utf8");
  const relativePath = path.relative(root, file);
  const isPage = relativePath.includes("app") && path.basename(file).startsWith("page.");

  // 1. Agente UX/UI: Colores planos e inarmónicos (Tailwind básicos) o inline hex styles
  const rawColorRegex = /className\s*=\s*["'][^"']*(bg|text|border)-(red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan)-(500|600|700)[^"']*["']/g;
  let match;
  while ((match = rawColorRegex.exec(source)) !== null) {
    addFinding(
      file,
      lineFor(source, match.index),
      "UX/UI",
      "Agente UX/UI",
      `Evitar el uso de colores planos de Tailwind como '${match[0]}' sin adaptar al design system Deep Space.`
    );
  }

  const inlineHexRegex = /style\s*=\s*\{\{\s*[^}]*(color|background|backgroundColor|borderColor)\s*:\s*["']#(?:[A-Fa-f0-9]{3}){1,2}["']/g;
  while ((match = inlineHexRegex.exec(source)) !== null) {
    addFinding(
      file,
      lineFor(source, match.index),
      "UX/UI",
      "Agente UX/UI",
      "Evitar estilos de color Hex inline ad-hoc. Usar variables HSL del tema central."
    );
  }

  // 2. Agente SEO: Validar metadata en page.tsx (o en el layout.tsx del mismo
  // directorio — Next hereda la metadata del layout que envuelve la página).
  if (isPage) {
    const metadataRegex = /export\s+const\s+metadata\b|export\s+(async\s+)?function\s+generateMetadata\b/;
    let exportsMetadata = metadataRegex.test(source);
    if (!exportsMetadata) {
      const siblingLayout = ["layout.tsx", "layout.jsx", "layout.ts", "layout.js"]
        .map((name) => path.join(path.dirname(file), name))
        .find((candidate) => existsSync(candidate));
      if (siblingLayout) {
        exportsMetadata = metadataRegex.test(readFileSync(siblingLayout, "utf8"));
      }
    }
    if (!exportsMetadata) {
      addFinding(
        file,
        1,
        "SEO",
        "Agente SEO",
        "La ruta de la página no exporta un objeto 'metadata' ni una función 'generateMetadata'."
      );
    }
  }

  // Comprobar múltiples <h1> en la misma página/componente
  const h1Matches = source.match(/<h1\b/g);
  if (h1Matches && h1Matches.length > 1) {
    addFinding(
      file,
      1,
      "SEO",
      "Agente SEO",
      `Se detectaron ${h1Matches.length} etiquetas <h1> en el archivo. Se recomienda usar solo una por página.`
    );
  }

  // 3. Agente Accesibilidad (a11y)
  // Tags <img> sin alt
  const imgRegex = /<img\b([^>]*)/g;
  while ((match = imgRegex.exec(source)) !== null) {
    const attributes = match[1];
    if (!/alt\s*=/i.test(attributes)) {
      addFinding(
        file,
        lineFor(source, match.index),
        "Accesibilidad",
        "Agente Accesibilidad",
        "Etiqueta <img> detectada sin el atributo requerido 'alt'."
      );
    }
  }

  // Botones sin aria-label o texto
  const emptyButtonRegex = /<button\b([^>]*?)>\s*(?:<[A-Za-z0-9_.-]+\s*\/?>)?\s*<\/button>/g;
  while ((match = emptyButtonRegex.exec(source)) !== null) {
    const attributes = match[1];
    if (!/aria-label\s*=/i.test(attributes)) {
      addFinding(
        file,
        lineFor(source, match.index),
        "Accesibilidad",
        "Agente Accesibilidad",
        "Botón vacío o con solo icono sin 'aria-label' descriptivo."
      );
    }
  }

  // 4. Agente Performance: <img> en lugar de <Image> de Next
  const standardImgRegex = /<img\b/g;
  while ((match = standardImgRegex.exec(source)) !== null) {
    addFinding(
      file,
      lineFor(source, match.index),
      "Rendimiento",
      "Agente Rendimiento",
      "Se sugiere reemplazar la etiqueta <img> de HTML por el componente de Next.js <Image> para optimizar la carga."
    );
  }

  // Import de mermaid en componentes del frontend
  if (source.includes("import") && source.includes("mermaid")) {
    addFinding(
      file,
      1,
      "Rendimiento",
      "Agente Rendimiento",
      "Evitar importar la librería pesada 'mermaid' en componentes de frontend de cara al usuario. Usarla solo en páginas dedicadas de documentación."
    );
  }

  // 5. Agente Deuda Técnica y Cumplimiento de InsForge
  // ts-ignore
  const tsIgnoreRegex = /\/\/\s*@ts-ignore|\/\*\s*@ts-ignore\s*\*\/|\/\/\s*@ts-nocheck/g;
  while ((match = tsIgnoreRegex.exec(source)) !== null) {
    addFinding(
      file,
      lineFor(source, match.index),
      "Deuda Técnica",
      "Agente Deuda Técnica",
      "Evitar el uso de directivas que supriman la verificación de TypeScript (@ts-ignore / @ts-nocheck)."
    );
  }

  // InsForge insert array format validation
  // Busca llamadas a .insert( que no empiecen por [ (arreglo)
  const insforgeInsertRegex = /\.insert\s*\(\s*([^\[\s][^\)]*)\)/g;
  while ((match = insforgeInsertRegex.exec(source)) !== null) {
    const argument = match[1];
    // Evita falsos positivos con llamadas vacías o variables complejas, pero advierte sobre objetos directos
    if (argument.trim().startsWith("{")) {
      addFinding(
        file,
        lineFor(source, match.index),
        "Cumplimiento SDK",
        "Agente Deuda Técnica",
        `Llamada .insert() detectada con formato de objeto: ${match[0]}. InsForge requiere formato de arreglo: [{...}].`
      );
    }
  }

  // Parallax double transform y wrapper conflict
  const doubleTransformRegex = /<motion\.[a-zA-Z0-9]+/g;
  let motionMatch;
  while ((motionMatch = doubleTransformRegex.exec(source)) !== null) {
    const start = motionMatch.index;
    let cursor = doubleTransformRegex.lastIndex;
    let depth = 0;
    let quote = null;
    let end = -1;

    for (; cursor < source.length; cursor++) {
      const char = source[cursor];
      const prev = source[cursor - 1];

      if (quote) {
        if (char === quote && prev !== "\\") quote = null;
        continue;
      }

      if (char === "\"" || char === "'" || char === "`") {
        quote = char;
        continue;
      }

      if (char === "{") depth++;
      if (char === "}") depth = Math.max(0, depth - 1);
      if (char === ">" && depth === 0) {
        end = cursor + 1;
        break;
      }
    }

    if (end > start) {
      const blockText = source.slice(start, end);
      const styleMatch = blockText.match(/style\s*=\s*\{\{([\s\S]*?)\}\}/);
      const animateMatch = blockText.match(/animate\s*=\s*\{\{([\s\S]*?)\}\}/);
      if (styleMatch && animateMatch) {
        if (/\by\s*:/m.test(styleMatch[1]) && /\by\s*:/m.test(animateMatch[1])) {
          addFinding(
            file,
            lineFor(source, start),
            "UX/UI",
            "Agente UX/UI",
            "Doble animación sobre 'y' (style y animate) en un mismo elemento motion.*. Separar en wrappers distintos."
          );
        }
      }
    }
  }
}

// Iniciar escaneo
const filesToAudit = walk(srcDir);
filesToAudit.forEach(auditFile);

if (findings.length > 0) {
  console.log("--------------------------------------------------------------------------------");
  console.log(`🔍 REPORTE MULTI-AGENTE DE DEFICIENCIAS DE LA PÁGINA (Total: ${findings.length} hallazgos)`);
  console.log("--------------------------------------------------------------------------------");
  
  findings.forEach((finding) => {
    console.log(`[${finding.agent}] [${finding.type}]`);
    console.log(`  Archivo: ${finding.file}:${finding.line}`);
    console.log(`  Deficiencia: ${finding.message}`);
    console.log("");
  });
  
  console.log("--------------------------------------------------------------------------------");
} else {
  console.log("✨ Excelente: No se detectaron deficiencias críticas mediante el análisis multi-agente estático.");
}
