#!/usr/bin/env node
/**
 * Recorre el sitio EN VIVO de un caso y deja evidencia verificable para su
 * dossier: rutas, formularios (a dónde postean, qué campos piden), embeds e
 * integraciones de terceros (GoHighLevel, calendarios, chat, analítica),
 * marca real (fuentes cargadas, colores y variables CSS servidas) y metadatos.
 *
 * No envía formularios, no inicia sesión, no escribe credenciales: solo mira
 * lo que cualquier visita ve. Cada hallazgo guarda la URL y el selector donde
 * apareció, para citarlo como fuente en el dossier y en los films.
 *
 * Uso, desde web/:
 *   npx tsx scripts/analyze-live-site.ts ad-media-solution
 *   npx tsx scripts/analyze-live-site.ts ad-media-solution --max-pages 25
 *   npx tsx scripts/analyze-live-site.ts local --url http://localhost:3000
 * Salida: docs/films/dossiers/live/<slug>.json y <slug>.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Page } from "playwright";
import { PROJECT_CASES } from "../src/data/projectCases";

interface FieldInfo {
  name: string;
  type: string;
  required: boolean;
  label: string;
}

interface FormInfo {
  page: string;
  selector: string;
  action: string;
  method: string;
  fields: FieldInfo[];
  submitLabel: string;
}

interface PageInfo {
  url: string;
  title: string;
  lang: string;
  h1: string[];
  headings: string[];
  forms: FormInfo[];
  iframes: Array<{ src: string; title: string }>;
  ctas: Array<{ text: string; href: string }>;
}

interface BrandInfo {
  fontsLoaded: Array<{ family: string; weight: string; style: string }>;
  computed: Record<string, { fontFamily: string; color: string; background: string; fontWeight: string }>;
  rootVariables: Record<string, string>;
  themeColor: string | null;
}

const KNOWN_INTEGRATIONS: Array<{ name: string; pattern: RegExp }> = [
  { name: "GoHighLevel / LeadConnector", pattern: /leadconnectorhq|msgsndr|gohighlevel|highlevel|link\.msgsndr|api\.leadconnector/i },
  { name: "Calendly", pattern: /calendly/i },
  { name: "Google Calendar", pattern: /calendar\.google/i },
  { name: "Meta Pixel", pattern: /connect\.facebook\.net|facebook\.com\/tr/i },
  { name: "Google Analytics / Tag Manager", pattern: /googletagmanager|google-analytics|gtag/i },
  { name: "TikTok Pixel", pattern: /analytics\.tiktok/i },
  { name: "WhatsApp", pattern: /wa\.me|api\.whatsapp|whatsapp\.com/i },
  { name: "Stripe", pattern: /stripe\.com|js\.stripe/i },
  { name: "Supabase", pattern: /supabase\.co/i },
  { name: "Firebase", pattern: /firebaseio|firebaseapp|googleapis\.com\/identitytoolkit/i },
  { name: "Vercel Analytics", pattern: /vercel-insights|_vercel\/insights|vitals\.vercel/i },
  { name: "Resend / email API", pattern: /resend\.com/i },
  { name: "Formspree", pattern: /formspree/i },
  { name: "Typeform", pattern: /typeform/i },
  { name: "Tawk / Crisp / Intercom chat", pattern: /tawk\.to|crisp\.chat|intercom/i },
  { name: "Mapbox / Google Maps", pattern: /mapbox|maps\.googleapis/i },
];

function argValue(flag: string) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function inspectPage(page: Page, url: string): Promise<PageInfo> {
  return page.evaluate((pageUrl) => {
    const text = (element: Element | null) => (element?.textContent ?? "").replace(/\s+/g, " ").trim();
    const cssPath = (element: Element) => {
      const parts: string[] = [];
      let node: Element | null = element;
      while (node && parts.length < 4 && node !== document.body) {
        const id = node.id ? `#${node.id}` : "";
        const cls = !id && node.classList.length ? `.${[...node.classList].slice(0, 2).join(".")}` : "";
        parts.unshift(`${node.tagName.toLowerCase()}${id}${cls}`);
        node = node.parentElement;
      }
      return parts.join(" > ");
    };
    const labelFor = (field: Element) => {
      const id = field.getAttribute("id");
      const explicit = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
      return text(explicit ?? field.closest("label")) || field.getAttribute("aria-label") || field.getAttribute("placeholder") || "";
    };
    const forms = [...document.querySelectorAll("form")].map((form) => ({
      page: pageUrl,
      selector: cssPath(form),
      action: form.getAttribute("action") ?? "",
      method: (form.getAttribute("method") ?? "get").toLowerCase(),
      fields: [...form.querySelectorAll("input, select, textarea")]
        .filter((field) => (field.getAttribute("type") ?? "") !== "hidden")
        .map((field) => ({
          name: field.getAttribute("name") ?? field.getAttribute("id") ?? "",
          type: field.tagName === "INPUT" ? field.getAttribute("type") ?? "text" : field.tagName.toLowerCase(),
          required: field.hasAttribute("required") || field.getAttribute("aria-required") === "true",
          label: labelFor(field),
        })),
      submitLabel: text(form.querySelector('button[type="submit"], input[type="submit"], button:not([type])')),
    }));
    return {
      url: pageUrl,
      title: document.title,
      lang: document.documentElement.lang,
      h1: [...document.querySelectorAll("h1")].map(text).filter(Boolean),
      headings: [...document.querySelectorAll("h2, h3")].map(text).filter(Boolean).slice(0, 40),
      forms,
      iframes: [...document.querySelectorAll("iframe")].map((frame) => ({ src: frame.getAttribute("src") ?? "", title: frame.getAttribute("title") ?? "" })),
      ctas: [...document.querySelectorAll("a, button")]
        .map((element) => ({ text: text(element), href: element.getAttribute("href") ?? "" }))
        .filter((cta) => cta.text && /agend|reserv|cotiz|contact|book|schedule|quote|empez|start|llam|call|whatsapp/i.test(cta.text))
        .slice(0, 30),
    };
  }, url);
}

async function inspectBrand(page: Page): Promise<BrandInfo> {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const fontsLoaded = [...document.fonts].filter((font) => font.status === "loaded").map((font) => ({ family: font.family.replace(/["']/g, ""), weight: font.weight, style: font.style }));
    const probe = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const style = getComputedStyle(element);
      return { fontFamily: style.fontFamily, color: style.color, background: style.backgroundColor, fontWeight: style.fontWeight };
    };
    const computed: Record<string, { fontFamily: string; color: string; background: string; fontWeight: string }> = {};
    for (const selector of ["body", "h1", "h2", "p", "a", "button", "header", "footer", "nav a"]) {
      const value = probe(selector);
      if (value) computed[selector] = value;
    }
    const rootVariables: Record<string, string> = {};
    const rootStyle = getComputedStyle(document.documentElement);
    for (const sheet of [...document.styleSheets]) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of [...rules]) {
        if (!(rule instanceof CSSStyleRule) || !/^(:root|html)\b/.test(rule.selectorText)) continue;
        for (const property of [...rule.style]) {
          if (property.startsWith("--")) rootVariables[property] = rootStyle.getPropertyValue(property).trim();
        }
      }
    }
    return { fontsLoaded, computed, rootVariables, themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content") ?? null };
  });
}

async function main() {
  const slug = process.argv[2];
  if (!slug) throw new Error("Falta el slug del caso");
  const project = PROJECT_CASES.find((item) => item.slug === slug);
  const start = argValue("--url") ?? project?.liveUrl;
  if (!start) throw new Error(`El caso ${slug} no tiene liveUrl (usar --url)`);
  const maxPages = Number(argValue("--max-pages") ?? 20);
  const origin = new URL(start).origin;

  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const requests = new Map<string, { url: string; method: string; type: string; page: string }>();
  const pages: PageInfo[] = [];
  let brand: BrandInfo | null = null;
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    // tsx conserva nombres de funciones con un helper __name que la página no tiene.
    await context.addInitScript("window.__name = (fn) => fn;");
    const page = await context.newPage();
    let current = start;
    page.on("request", (request) => {
      const url = request.url();
      if (url.startsWith("data:")) return;
      const key = `${request.method()} ${url.split("?")[0]}`;
      if (!requests.has(key)) requests.set(key, { url: url.split("?")[0], method: request.method(), type: request.resourceType(), page: current });
    });

    const queue = [start];
    const seen = new Set<string>();
    while (queue.length && pages.length < maxPages) {
      const url = queue.shift()!;
      const normalized = url.replace(/#.*$/, "").replace(/\/$/, "") || url;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      current = normalized;
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => null);
      if (!response || response.status() >= 400) continue;
      await page.waitForTimeout(1500);
      // Revela contenido diferido (lazy) como lo haría una visita que recorre la página.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
      });
      pages.push(await inspectPage(page, normalized));
      if (!brand) brand = await inspectBrand(page);
      const links = await page.$$eval("a[href]", (anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
      for (const link of links) {
        if (!link.startsWith(origin)) continue;
        if (/\.(pdf|jpg|jpeg|png|webp|svg|mp4|zip)$/i.test(link)) continue;
        queue.push(link);
      }
    }
  } finally {
    await browser.close();
  }

  const all = [...requests.values()];
  const thirdParty = all.filter((request) => !request.url.startsWith(origin));
  const integrations = KNOWN_INTEGRATIONS.map((integration) => ({
    name: integration.name,
    evidence: [
      ...thirdParty.filter((request) => integration.pattern.test(request.url)).map((request) => `${request.method} ${request.url} (en ${request.page})`),
      ...pages.flatMap((page) => page.iframes.filter((frame) => integration.pattern.test(frame.src)).map((frame) => `iframe ${frame.src} (en ${page.url})`)),
      ...pages.flatMap((page) => page.ctas.filter((cta) => integration.pattern.test(cta.href)).map((cta) => `enlace "${cta.text}" → ${cta.href} (en ${page.url})`)),
    ]
      .filter((line, index, list) => list.indexOf(line) === index)
      .slice(0, 12),
  })).filter((integration) => integration.evidence.length > 0);
  const ownApi = all.filter((request) => request.url.startsWith(origin) && /\/api\//.test(request.url));

  const report = {
    slug,
    start,
    analyzedAt: new Date().toISOString(),
    pages,
    forms: pages.flatMap((page) => page.forms),
    integrations,
    ownApi,
    thirdPartyHosts: [...new Set(thirdParty.map((request) => new URL(request.url).host))].sort(),
    brand,
  };

  const outDir = path.join(process.cwd(), "docs/films/dossiers/live");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, `${slug}.json`), `${JSON.stringify(report, null, 2)}\n`);

  const md: string[] = [
    `# Recorrido en vivo · ${slug}`,
    "",
    `Origen: ${start} · ${report.analyzedAt} · ${pages.length} páginas. Generado por scripts/analyze-live-site.ts (sin enviar formularios ni iniciar sesión).`,
    "",
    "## Rutas",
    ...pages.map((page) => `- ${page.url} — ${page.title}${page.h1.length ? ` · h1: "${page.h1[0]}"` : ""}`),
    "",
    "## Formularios",
    ...(report.forms.length
      ? report.forms.map((form) => `- ${form.page} \`${form.selector}\` → ${form.method.toUpperCase()} ${form.action || "(manejado por JS)"} · campos: ${form.fields.map((field) => `${field.label || field.name} (${field.type}${field.required ? ", obligatorio" : ""})`).join(", ")}`)
      : ["- Ninguno visible en HTML (puede haber formularios montados por JS o embebidos)."]),
    "",
    "## Integraciones detectadas",
    ...(integrations.length ? integrations.flatMap((integration) => [`- **${integration.name}**`, ...integration.evidence.map((line) => `  - ${line}`)]) : ["- Ninguna de las conocidas."]),
    "",
    "## API propia",
    ...(ownApi.length ? ownApi.map((request) => `- ${request.method} ${request.url} (en ${request.page})`) : ["- Ninguna llamada a /api/ durante el recorrido."]),
    "",
    "## Marca servida",
    `- Fuentes cargadas: ${[...new Set(brand?.fontsLoaded.map((font) => font.family) ?? [])].join(", ") || "—"}`,
    ...Object.entries(brand?.computed ?? {}).map(([selector, style]) => `- \`${selector}\`: ${style.fontFamily} · color ${style.color} · fondo ${style.background} · peso ${style.fontWeight}`),
    `- theme-color: ${brand?.themeColor ?? "—"}`,
    `- Variables de :root: ${Object.keys(brand?.rootVariables ?? {}).length}`,
    "",
  ];
  writeFileSync(path.join(outDir, `${slug}.md`), md.join("\n"));
  console.log(`✓ ${pages.length} páginas · ${report.forms.length} formularios · ${integrations.length} integraciones → docs/films/dossiers/live/${slug}.{json,md}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
