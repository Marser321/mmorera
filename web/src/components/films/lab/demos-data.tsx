import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea } from "@/lib/filmLayout";
import { ChecklistGrid } from "../scenes/brand/ChecklistGrid";
import { EvidenceLedger } from "../scenes/brand/EvidenceLedger";
import { FactWall } from "../scenes/brand/FactWall";
import { KeywordSearch } from "../scenes/brand/KeywordSearch";
import { ScriptTimeline } from "../scenes/brand/ScriptTimeline";
import type { ChecklistGridData } from "../scenes/brand/layout/checklistGrid";
import type { EvidenceLedgerData } from "../scenes/brand/layout/evidenceLedger";
import type { FactWallFact } from "../scenes/brand/layout/factWall";
import type { KeywordSearchData } from "../scenes/brand/layout/keywordSearch";
import type { ScriptTimelineData } from "../scenes/brand/layout/scriptTimeline";
import type { LabDemo } from "./types";

/**
 * Demos del laboratorio: grupo "data". Cada escena registra acá una demo con
 * datos rotulados. Todo lo que se ve es de ejemplo (lo dice el badge "Datos de
 * ejemplo"); los films pasan sus cifras y textos publicados.
 */

export const DATA_SAMPLE_LABEL: Record<FilmLanguage, string> = { es: "Datos de ejemplo", en: "Sample data" };

export const DEMO_FACTS: Record<FilmLanguage, FactWallFact[]> = {
  es: [
    { value: "1.096", label: "videos transcritos", source: "archivo del cliente" },
    { value: "8.034", label: "fragmentos indexados", source: "índice de búsqueda" },
    { value: "4,33 M", label: "palabras en el corpus", source: "índice de búsqueda" },
    { value: "109", label: "afirmaciones revisadas", source: "dossier del cliente" },
    { value: "98/98", label: "chequeos de QA superados", source: "registro de QA" },
    { value: "53", label: "hooks escritos para reels", source: "guiones entregados" },
  ],
  en: [
    { value: "1,096", label: "videos transcribed", source: "client archive" },
    { value: "8,034", label: "fragments indexed", source: "search index" },
    { value: "4.33 M", label: "words in the corpus", source: "search index" },
    { value: "109", label: "claims reviewed", source: "client dossier" },
    { value: "98/98", label: "QA checks passed", source: "QA log" },
    { value: "53", label: "hooks written for reels", source: "delivered scripts" },
  ],
};

export const DEMO_LEDGER: Record<FilmLanguage, Omit<EvidenceLedgerData, "language" | "sampleLabel">> = {
  es: {
    total: { value: 109, label: "afirmaciones en el registro" },
    breakdown: [
      { label: "HBOT", value: 14 },
      { label: "Edad biológica", value: 16 },
      { label: "GLP-1", value: 18 },
    ],
    wording: { allowed: "Redacción permitida", prohibited: "Redacción prohibida" },
    tiers: [
      { id: "approved", label: "Aprobado", items: ["HBOT en indicaciones con aprobación regulatoria", "GLP-1 con prescripción y control médico"], note: "Se comunica tal cual, con su fuente." },
      { id: "signal", label: "Señal emergente", items: ["Marcadores de edad biológica en estudio", "HBOT en recuperación deportiva"], note: "Solo en condicional y con fuente." },
      { id: "not-established", label: "No establecido", items: ["Revertir la edad biológica", "HBOT para rendimiento cognitivo"], note: "No se afirma en ninguna pieza." },
      { id: "prohibited", label: "Prohibido", items: ["“Cura el envejecimiento”", "“Resultados garantizados”"], note: "Nunca en piezas públicas." },
    ],
  },
  en: {
    total: { value: 109, label: "claims in the registry" },
    breakdown: [
      { label: "HBOT", value: 14 },
      { label: "Biological age", value: 16 },
      { label: "GLP-1", value: 18 },
    ],
    wording: { allowed: "Allowed wording", prohibited: "Prohibited wording" },
    tiers: [
      { id: "approved", label: "Approved", items: ["HBOT for regulator-approved indications", "GLP-1 with prescription and medical follow-up"], note: "Stated as is, with its source." },
      { id: "signal", label: "Emerging signal", items: ["Biological age markers under study", "HBOT for sports recovery"], note: "Conditional wording and a source only." },
      { id: "not-established", label: "Not established", items: ["Reversing biological age", "HBOT for cognitive performance"], note: "Never claimed in any piece." },
      { id: "prohibited", label: "Prohibited", items: ["“Cures aging”", "“Guaranteed results”"], note: "Never in public pieces." },
    ],
  },
};

export const DEMO_CHECKLIST: Record<FilmLanguage, Omit<ChecklistGridData, "language" | "sampleLabel">> = {
  es: {
    total: 98,
    passed: 98,
    unitLabel: "chequeos de QA superados antes de publicar",
    legendTitle: "Áreas revisadas",
    groups: ["Accesibilidad", "SEO técnico", "Formularios", "Rendimiento", "Seguridad", "Contenido médico"],
  },
  en: {
    total: 98,
    passed: 98,
    unitLabel: "QA checks passed before launch",
    legendTitle: "Areas reviewed",
    groups: ["Accessibility", "Technical SEO", "Forms", "Performance", "Security", "Medical content"],
  },
};

export const DEMO_SEARCH: Record<FilmLanguage, Omit<KeywordSearchData, "language" | "sampleLabel">> = {
  es: {
    methodLabel: "Búsqueda por palabras clave (BM25), no vectorial",
    query: "dosis de semaglutida en adultos mayores",
    tokens: ["dosis", "semaglutida", "adultos", "mayores"],
    stats: [
      { value: "1.096", label: "videos" },
      { value: "8.034", label: "fragmentos" },
      { value: "4,33 M", label: "palabras" },
    ],
    results: [
      { title: "Consulta GLP-1 · episodio 214", fragment: "En adultos mayores la dosis de semaglutida se sube de a poco y siempre con control médico." },
      { title: "Preguntas frecuentes · episodio 87", fragment: "La dosis inicial no es la de mantenimiento: se ajusta según la tolerancia de cada paciente." },
      { title: "Charla abierta · episodio 31", fragment: "Qué cambia en adultos mayores: hidratación, masa muscular y seguimiento de cerca." },
    ],
  },
  en: {
    methodLabel: "Keyword search (BM25), not vector search",
    query: "semaglutide dose in older adults",
    tokens: ["semaglutide", "dose", "older", "adults"],
    stats: [
      { value: "1,096", label: "videos" },
      { value: "8,034", label: "fragments" },
      { value: "4.33 M", label: "words" },
    ],
    results: [
      { title: "GLP-1 consult · episode 214", fragment: "In older adults the semaglutide dose goes up slowly and always under medical follow-up." },
      { title: "FAQ · episode 87", fragment: "The starting dose is not the maintenance dose: it is adjusted to each patient's tolerance." },
      { title: "Open talk · episode 31", fragment: "What changes in older adults: hydration, muscle mass and close follow-up." },
    ],
  },
};

export const DEMO_SCRIPT: Record<FilmLanguage, Omit<ScriptTimelineData, "language" | "sampleLabel">> = {
  es: {
    counter: { value: 53, label: "hooks escritos" },
    breakdown: [
      { value: 8, label: "reels" },
      { value: 5, label: "educativos" },
      { value: 3, label: "VSL" },
      { value: 12, label: "ads" },
    ],
    segments: [{ label: "Hook", timing: "0–4 s" }, { label: "Problema" }, { label: "Mecanismo" }, { label: "Prueba" }, { label: "Oferta" }, { label: "Llamado a la acción" }],
    checklist: { title: "Checklist de compliance", items: ["Sin promesas de resultados", "Aviso médico visible", "Fuente citada en pantalla", "Sin antes y después"] },
  },
  en: {
    counter: { value: 53, label: "hooks written" },
    breakdown: [
      { value: 8, label: "reels" },
      { value: 5, label: "educational" },
      { value: 3, label: "VSL" },
      { value: 12, label: "ads" },
    ],
    segments: [{ label: "Hook", timing: "0–4 s" }, { label: "Problem" }, { label: "Mechanism" }, { label: "Proof" }, { label: "Offer" }, { label: "Call to action" }],
    checklist: { title: "Compliance checklist", items: ["No promised results", "Visible medical notice", "Source cited on screen", "No before-and-after"] },
  },
};

export const DEMOS_DATA: Record<string, LabDemo> = {
  EvidenceLedger: {
    duration: 300,
    brand: "fenix-medical-center",
    render: ({ language, format }) => <EvidenceLedger box={safeArea(format)} duration={300} {...DEMO_LEDGER[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  FactWall: {
    duration: 240,
    brand: "ad-media-solution",
    render: ({ language, format }) => <FactWall box={safeArea(format)} duration={240} facts={DEMO_FACTS[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  ChecklistGrid: {
    duration: 240,
    brand: "ad-media-solution",
    render: ({ language, format }) => <ChecklistGrid box={safeArea(format)} duration={240} {...DEMO_CHECKLIST[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  KeywordSearch: {
    duration: 300,
    brand: "ad-media-solution",
    render: ({ language, format }) => <KeywordSearch box={safeArea(format)} duration={300} {...DEMO_SEARCH[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
  ScriptTimeline: {
    duration: 300,
    brand: "fenix-medical-center",
    render: ({ language, format }) => <ScriptTimeline box={safeArea(format)} duration={300} {...DEMO_SCRIPT[language]} language={language} sampleLabel={DATA_SAMPLE_LABEL[language]} />,
  },
};
