import type { LocalizedText } from "@/types/site";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * Textos de /campanas (Mario, 5/11): lo que hace la máquina, lo que decide una
 * persona y lo nuevo en cada plataforma. Nada de cifras de mejora: los números de
 * las plataformas son suyos y no son resultados de Mario. Lo que cambia rápido
 * lleva fuente y fecha de revisión, y solo se afirma lo que dice esa fuente.
 */

export interface CampanasJob {
  id: string;
  title: LocalizedText;
  machine: LocalizedText;
  person: LocalizedText;
  tools: string[];
}

export interface CampanasRadarItem {
  name: string;
  body: LocalizedText;
  source: { label: string; href: string };
}

export const CAMPANAS_JOBS: CampanasJob[] = [
  {
    id: "leer",
    title: t("Leer la cuenta", "Reading the account"),
    machine: t("Cruza plataformas, explica qué subió o bajó y arma el reporte en segundos.", "Crosses platforms, explains what went up or down and builds the report in seconds."),
    person: t("Elige qué número importa para tu negocio y qué pregunta vale la pena hacer.", "Chooses which number matters to your business and which question is worth asking."),
    tools: ["Ask Advisor", "Meta AI connectors", "Google Ads MCP", "Claude"],
  },
  {
    id: "encontrar",
    title: t("Encontrar a quién hablarle", "Finding who to talk to"),
    machine: t("Amplía búsquedas y públicos según la intención, más allá de lo que cargaste a mano.", "Expands searches and audiences by intent, beyond what was set up by hand."),
    person: t("Define a quién no le quieres vender, qué zonas atiendes y qué búsquedas no te sirven.", "Defines who you don't want to sell to, which areas you serve and which searches don't help."),
    tools: ["AI Max", "Performance Max", "Advantage+"],
  },
  {
    id: "crear",
    title: t("Producir creatividades", "Producing creative"),
    machine: t("Genera variantes de texto, imagen y video para probar muchas más ideas.", "Generates text, image and video variants to test many more ideas."),
    person: t("Decide qué se puede prometer, qué suena a tu marca y qué pieza no sale.", "Decides what can be promised, what sounds like your brand and which piece doesn't go out."),
    tools: ["Asset Studio", "Advantage+", "Symphony", "Remotion"],
  },
  {
    id: "repartir",
    title: t("Repartir el presupuesto", "Allocating budget"),
    machine: t("Ajusta pujas y mueve presupuesto hacia lo que responde, subasta por subasta.", "Adjusts bids and moves budget toward what responds, auction by auction."),
    person: t("Pone los topes, el objetivo y los momentos en que el negocio manda sobre el algoritmo.", "Sets the limits, the goal and the moments when the business overrules the algorithm."),
    tools: ["Smart Bidding", "Advantage+"],
  },
  {
    id: "vigilar",
    title: t("Vigilar la cuenta", "Watching the account"),
    machine: t("Avisa de anuncios rechazados, gastos raros, páginas caídas y datos que dejan de llegar.", "Flags rejected ads, odd spending, broken pages and data that stops arriving."),
    person: t("Decide qué se corrige ya, qué se deja correr y cuándo se frena todo.", "Decides what gets fixed now, what keeps running and when everything stops."),
    tools: ["Ask Advisor", "n8n", "WhatsApp"],
  },
  {
    id: "vender",
    title: t("Conectar con ventas", "Connecting to sales"),
    machine: t("Lleva cada lead al CRM y le devuelve a la plataforma quién terminó comprando.", "Takes each lead to the CRM and tells the platform who ended up buying."),
    person: t("Define qué es un buen lead. Eso lo sabe tu equipo, no la plataforma.", "Defines what a good lead is. Your team knows that, not the platform."),
    tools: ["Conversions API", "Enhanced Conversions", "GoHighLevel", "HubSpot"],
  },
];

export const CAMPANAS_RADAR: Array<{ platform: string; items: CampanasRadarItem[] }> = [
  {
    platform: "Google",
    items: [
      {
        name: "AI Max",
        body: t(
          "Amplía las búsquedas con señales de intención y mantiene controles de marca, zona y texto. Salió de beta en 2026 y reemplaza a los anuncios dinámicos de búsqueda.",
          "Expands searches with intent signals and keeps brand, location and text controls. It left beta in 2026 and is replacing Dynamic Search Ads."
        ),
        source: { label: "Google", href: "https://blog.google/products/ads-commerce/dsa-upgrade-to-ai-max-2026/" },
      },
      {
        name: "Ask Advisor",
        body: t(
          "Un agente con Gemini que une Google Ads y Analytics para explicar resultados y recomendar pasos. Está en beta, para cuentas en inglés.",
          "A Gemini agent that joins Google Ads and Analytics to explain results and recommend next steps. It's in beta, for English-language accounts."
        ),
        source: { label: "PPC Land", href: "https://ppc.land/googles-ask-advisor-unifies-ads-analytics-and-commerce-in-one-ai-agent/" },
      },
      {
        name: "Asset Studio",
        body: t(
          "Genera piezas dentro de Google Ads a partir de tu brief, tu web y tus guías de marca.",
          "Generates assets inside Google Ads from your brief, your website and your brand guidelines."
        ),
        source: { label: "Google", href: "https://blog.google/products/ads-commerce/asset-studio-updates/" },
      },
      {
        name: "Google Ads MCP",
        body: t(
          "El servidor oficial que conecta un modelo con la cuenta. Consulta datos y, antes de escribir, exige proponer y confirmar.",
          "The official server that connects a model to the account. It queries data and, before writing, requires propose and confirm."
        ),
        source: { label: "GitHub", href: "https://github.com/googleads/google-ads-mcp" },
      },
    ],
  },
  {
    platform: "Meta",
    items: [
      {
        name: "Meta ads AI connectors",
        body: t(
          "Servidor MCP y línea de comandos oficiales, en beta abierta: reportes, campañas, catálogos y diagnóstico de señales. Se puede limitar qué hace cada agente.",
          "Official MCP server and command line, in open beta: reports, campaigns, catalogs and signal diagnostics. You can limit what each agent does."
        ),
        source: { label: "Meta", href: "https://www.facebook.com/business/news/meta-ads-ai-connectors" },
      },
      {
        name: "Advantage+",
        body: t(
          "Automatiza público, ubicaciones y presupuesto. En campañas de leads viene activado, y los controles manuales siguen disponibles.",
          "Automates audience, placements and budget. It's on by default for lead campaigns, and manual controls remain available."
        ),
        source: { label: "Meta", href: "https://www.facebook.com/business/ads/meta-advantage-plus/leads" },
      },
      {
        name: "Andromeda",
        body: t(
          "El motor que elige qué anuncios entran en juego para cada persona. Está hecho para manejar muchas más creatividades.",
          "The engine that picks which ads are in play for each person. It's built to handle far more creative."
        ),
        source: { label: "Meta Engineering", href: "https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/" },
      },
      {
        name: "Conversions API",
        body: t(
          "Conecta tu CRM con Meta para que la campaña apunte a los leads con más probabilidad de convertir.",
          "Connects your CRM to Meta so the campaign aims at the leads most likely to convert."
        ),
        source: { label: "Meta", href: "https://www.facebook.com/business/ads/meta-advantage-plus/leads" },
      },
    ],
  },
  {
    platform: "TikTok",
    items: [
      {
        name: "Symphony Agent",
        body: t(
          "Presentado en Cannes Lions en junio de 2026 para acelerar la creación de anuncios, encontrar creadores y escalar contenido.",
          "Unveiled at Cannes Lions in June 2026 to speed up ad creation, find creators and scale content."
        ),
        source: { label: "ANA", href: "https://www.ana.net/magazines/show/id/news-2026-06-25-tik-tok-symphony-agent" },
      },
    ],
  },
  {
    platform: "Independientes",
    items: [
      {
        name: "Madgicx · Birch · Smartly",
        body: t(
          "Plataformas para automatizar y optimizar campañas por fuera de los paneles nativos. Se eligen según el caso y la inversión.",
          "Platforms to automate and optimize campaigns outside the native dashboards. The choice depends on the case and the budget."
        ),
        source: { label: "Segwise, comparativa de un proveedor", href: "https://segwise.ai/blog/best-ai-agents-ad-creative-performance-marketing-2026" },
      },
      {
        name: "AdCreative.ai · Pencil",
        body: t(
          "Generan y puntúan creatividades, pero no manejan el gasto de la campaña.",
          "They generate and score creative, but they don't manage campaign spend."
        ),
        source: { label: "Segwise, comparativa de un proveedor", href: "https://segwise.ai/blog/best-ai-agents-ad-creative-performance-marketing-2026" },
      },
    ],
  },
];

export const CAMPANAS_PAGE = {
  jobs: {
    title: t("Qué hace la máquina y qué decide una persona", "What the machine does and what a person decides"),
    body: t(
      "La IA ya hace gran parte del trabajo repetitivo de una cuenta. Esto es lo que le dejo a ella y lo que no sale sin una persona.",
      "AI already does much of an account's repetitive work. This is what I leave to it and what doesn't go out without a person."
    ),
    work: t("El trabajo", "The work"),
    machine: t("La máquina", "The machine"),
    person: t("Una persona", "A person"),
    tools: t("Con", "With"),
  },
  limits: {
    title: t("Por qué sigue haciendo falta una persona", "Why it still takes a person"),
    items: [
      {
        title: t("Se equivoca con seguridad", "It's confidently wrong"),
        body: t(
          "Ante una pregunta vaga, un modelo puede dar cifras que no coinciden con la plataforma. Cada número importante se comprueba.",
          "Given a vague question, a model can state figures that don't match the platform. Every number that matters gets checked."
        ),
      },
      {
        title: t("Explica, pero no prueba", "It explains, but doesn't prove"),
        body: t(
          "Sus causas son hipótesis hasta que se miden. Que una venta llegue después de un anuncio no significa que el anuncio la trajo.",
          "Its causes are hypotheses until they're measured. A sale arriving after an ad doesn't mean the ad brought it."
        ),
      },
      {
        title: t("No ve fuera de la cuenta", "It can't see outside the account"),
        body: t(
          "No conoce tu stock, tu temporada ni lo que pasó en la llamada de ventas. Eso lo aporta quien conoce el negocio.",
          "It doesn't know your stock, your season or what happened on the sales call. That comes from someone who knows the business."
        ),
      },
    ],
  },
  radar: {
    title: t("Lo nuevo que ya se puede usar", "What's new and usable today"),
    body: t(
      "Las plataformas cambian cada mes. Esto es lo que revisé en noviembre de 2026, con su fuente. No uso todo: elijo según tu caso.",
      "The platforms change every month. This is what I reviewed in November 2026, with its source. I don't use all of it: I choose based on your case."
    ),
    independent: t("Independientes", "Independent"),
    source: t("Fuente", "Source"),
  },
};
