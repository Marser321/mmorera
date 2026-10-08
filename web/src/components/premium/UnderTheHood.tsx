import type { CSSProperties } from "react";
import { BRAND_FONT_VARIABLES } from "@/components/films/brandFonts";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { loadArchitecture } from "@/data/architecture/registry";
import { getCaseBrand } from "@/data/brands/caseBrands";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { cn } from "@/lib/utils";
import { ArchitecturePoster } from "./ArchitectureArt";
import { ArchitectureExplorerMount } from "./ArchitectureExplorerMount";
import { buildArchitectureModel, diagramSummary, narrowAspect, SITE_FONTS, SITE_PALETTE, themeVars } from "./underTheHoodModel";
import styles from "./UnderTheHood.module.css";

const label = "font-mono text-[10px] uppercase tracking-[.16em] text-[#F3F0E8]/55 light:text-muted-foreground";

const COPY = {
  es: {
    kicker: "Arquitectura del sistema",
    title: "Bajo el capó.",
    intro: "Las piezas reales del sistema y cómo se hablan: elegí un recorrido o abrí un componente.",
    components: "Componentes",
    connections: "Conexiones",
    paths: "Recorridos guiados",
  },
  en: {
    kicker: "System architecture",
    title: "Under the hood.",
    intro: "The system's real parts and how they talk: pick a path or open a component.",
    components: "Components",
    connections: "Connections",
    paths: "Guided paths",
  },
} as const;

export type UnderTheHoodProps = {
  slug: string;
  language: FilmLanguage;
  /** Marca cuyos colores y tipografías viste el diagrama (por defecto, la del caso). */
  brandSlug?: string;
};

/**
 * Sección "Bajo el capó" de un caso: encabezado, póster estático del
 * diagrama (las dos orientaciones; el CSS elige por el ancho del marco),
 * la lista accesible de componentes y recorridos, y la isla interactiva que
 * reemplaza el póster cuando la sección se acerca al viewport.
 */
export async function UnderTheHood({ slug, language, brandSlug }: UnderTheHoodProps) {
  const bundle = await loadArchitecture(slug);
  if (!bundle) return null;
  const copy = COPY[language];
  const brand = getCaseBrand(brandSlug ?? slug);
  const radius = brand?.radius ?? 16;
  const fonts = brand?.fonts ?? SITE_FONTS;
  const model = (orientation: "landscape" | "portrait") => {
    const { diagram, layout } = resolveArchitecture(bundle, language, orientation);
    return buildArchitectureModel(diagram, layout, orientation, fonts);
  };
  const landscape = model("landscape");
  const portrait = model("portrait");
  const diagram = landscape.diagram;
  const views = (diagram.meta.views ?? []).map(({ id, label: viewLabel, note }) => ({ id, label: viewLabel, note: note ?? "" }));
  const labelOf = (id: string) => diagram.components.find((component) => component.id === id)?.label ?? id;
  const idPrefix = `uth-${slug}`;
  const vars = {
    ...themeVars(brand?.palette ?? SITE_PALETTE, radius),
    "--uth-font-display": fonts.display,
    "--uth-font-body": fonts.body,
    "--uth-font-label": fonts.label,
    "--uth-ar-l": `${landscape.frame.w} / ${landscape.frame.h}`,
    "--uth-ar-p": `${portrait.frame.w} / ${portrait.frame.h}`,
    "--uth-ar-n": narrowAspect(portrait.frame),
  } as CSSProperties;

  return (
    <section className="mx-auto mt-20 max-w-[1480px] px-5 sm:px-8 lg:px-12" aria-labelledby="case-architecture">
      <div className="grid gap-5 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
        <div>
          <p className={label}>{copy.kicker}</p>
          <h2 id="case-architecture" className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
            {copy.title}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-foreground/60 lg:pb-1.5">{copy.intro}</p>
      </div>

      <div className={cn("mt-8", styles.theme, BRAND_FONT_VARIABLES)} style={vars}>
        <ArchitectureExplorerMount
          slug={slug}
          language={language}
          title={diagram.meta.title}
          views={views}
          summary={diagramSummary(diagram, language)}
          radius={radius}
          fonts={fonts}
          idPrefix={idPrefix}
        >
          <ArchitecturePoster model={landscape} idPrefix={`${idPrefix}-landscape`} radius={radius} language={language} className={styles.posterLandscape} />
          <ArchitecturePoster model={portrait} idPrefix={`${idPrefix}-portrait`} radius={radius} language={language} className={styles.posterPortrait} />
        </ArchitectureExplorerMount>
      </div>

      {/* El mismo contenido en texto, para buscadores y lectores de pantalla. */}
      <div className="sr-only">
        <h3>{copy.components}</h3>
        <ul>
          {diagram.components.map((component) => (
            <li key={component.id}>
              {component.label}
              {component.sublabel ? ` — ${component.sublabel}` : ""}
              {component.tag ? ` (${component.tag})` : ""}
            </li>
          ))}
        </ul>
        <h3>{copy.connections}</h3>
        <ul>
          {diagram.connections.map((connection) => (
            <li key={`${connection.from}>${connection.to}`}>
              {labelOf(connection.from)} → {labelOf(connection.to)}
              {connection.label ? `: ${connection.label}` : ""}
            </li>
          ))}
        </ul>
        {views.length ? (
          <>
            <h3>{copy.paths}</h3>
            <dl>
              {views.map((view) => (
                <div key={view.id}>
                  <dt>{view.label}</dt>
                  <dd>{view.note}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </div>
    </section>
  );
}
