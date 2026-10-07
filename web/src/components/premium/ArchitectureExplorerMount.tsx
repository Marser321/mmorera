"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { resolveArchitecture, type ArchitectureBundle, type ArchitectureOrientation } from "@/data/architecture/bundle";
import { loadArchitecture } from "@/data/architecture/registry";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import { cn } from "@/lib/utils";
import { ROLE_COLOR } from "./ArchitectureArt";
import type { ArchitectureExplorerProps } from "./ArchitectureExplorer";
import { buildArchitectureModel, componentLinks, orientationFor, typeLabel, viewsWith, type ArchitectureModel, type CardFonts, type ComponentLink } from "./underTheHoodModel";
import styles from "./UnderTheHood.module.css";

/* Import manual (no next/dynamic), como FilmStage: el chunk de React Flow y
   su CSS se piden recién cuando la sección se acerca, en paralelo con los
   datos del caso. Promesas a nivel de módulo: una sola carga por página. */
let explorerModule: Promise<ComponentType<ArchitectureExplorerProps>> | null = null;
function loadExplorer() {
  explorerModule ??= import("./ArchitectureExplorer")
    .then((mod) => mod.ArchitectureExplorer)
    .catch((error: unknown) => {
      explorerModule = null;
      throw error;
    });
  return explorerModule;
}

const bundles = new Map<string, Promise<ArchitectureBundle | null>>();
function loadBundle(slug: string) {
  let pending = bundles.get(slug);
  if (!pending) {
    pending = loadArchitecture(slug).catch((error: unknown) => {
      bundles.delete(slug);
      throw error;
    });
    bundles.set(slug, pending);
  }
  return pending;
}

const COPY = {
  es: {
    tablist: "Recorridos del diagrama",
    all: "Todo",
    allTitle: "Todo el sistema",
    hint: "Abrí un componente para ver qué recibe, a dónde envía y en qué recorridos aparece.",
    close: "Cerrar detalle",
    appears: "Aparece en",
    incoming: "Recibe de",
    outgoing: "Envía a",
    none: "Ninguno",
    via: "vía",
  },
  en: {
    tablist: "Diagram paths",
    all: "All",
    allTitle: "The whole system",
    hint: "Open a component to see what it receives, where it sends and which paths include it.",
    close: "Close details",
    appears: "Appears in",
    incoming: "Receives from",
    outgoing: "Sends to",
    none: "None",
    via: "via",
  },
} as const;

export type ExplorerView = { id: string; label: string; note: string };

type Loaded = { Explorer: ComponentType<ArchitectureExplorerProps>; bundle: ArchitectureBundle };

/**
 * Isla interactiva de "Bajo el capó". Muestra el póster del server hasta que
 * la sección se acerca (useDeferredMount, igual que los films); entonces
 * pide React Flow y los datos del caso en paralelo y cambia el póster por el
 * explorador en el mismo lienzo (mismo alto, mismo encuadre). Las pestañas y
 * la banda inferior son de esta isla, así que no cambian al hacer el cambio.
 */
export function ArchitectureExplorerMount({
  slug,
  language,
  title,
  views,
  summary,
  radius,
  fonts,
  idPrefix,
  children,
}: {
  slug: string;
  language: FilmLanguage;
  title: string;
  views: ExplorerView[];
  summary: string;
  radius: number;
  /** Tipografías de la marca: miden los textos de las cajas igual que el póster. */
  fonts: CardFonts;
  idPrefix: string;
  /** Pósteres estáticos (uno por orientación) que se ven hasta montar el explorador. */
  children: ReactNode;
}) {
  const copy = COPY[language];
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const inspectorTitleRef = useRef<HTMLHeadingElement>(null);
  const focusInspector = useRef(false);
  const mounted = useDeferredMount(rootRef);
  const reducedMotion = useReducedMotion() === true;
  const [width, setWidth] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [readyFor, setReadyFor] = useState<ArchitectureOrientation | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Mismo umbral que el container query del CSS: el ancho del marco decide la orientación.
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const orientation = width === null ? null : orientationFor(width);

  useEffect(() => {
    if (!mounted) return;
    let alive = true;
    Promise.all([loadExplorer(), loadBundle(slug)])
      .then(([Explorer, bundle]) => {
        if (alive && bundle) setLoaded({ Explorer, bundle });
      })
      .catch(() => {
        /* Sin red o sin chunk: queda el póster, que ya muestra todo el diagrama. */
      });
    return () => {
      alive = false;
    };
  }, [mounted, slug]);

  const model = useMemo(() => {
    if (!loaded || !orientation) return null;
    const { diagram, layout } = resolveArchitecture(loaded.bundle, language, orientation);
    return buildArchitectureModel(diagram, layout, orientation, fonts);
  }, [fonts, loaded, language, orientation]);
  const ready = model !== null && readyFor === model.orientation;

  const tabs = useMemo(() => [{ id: null as string | null, label: copy.all }, ...views.map((view) => ({ id: view.id as string | null, label: view.label }))], [copy.all, views]);
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === viewId));
  const activeView = views.find((view) => view.id === viewId) ?? null;

  const selectView = useCallback((id: string | null) => {
    setViewId(id);
    setSelectedId(null);
  }, []);

  const select = useCallback((id: string | null, options: { focusInspector?: boolean } = {}) => {
    focusInspector.current = Boolean(options.focusInspector && id);
    setSelectedId(id);
  }, []);

  // Al navegar desde el inspector, el foco sigue en el inspector (su título).
  useEffect(() => {
    if (selectedId && focusInspector.current) {
      focusInspector.current = false;
      inspectorTitleRef.current?.focus();
    }
  }, [selectedId]);

  const closeInspector = useCallback(() => {
    if (!selectedId) return;
    const root = rootRef.current;
    const focusWasInside = root?.querySelector("[data-uth-inspector]")?.contains(document.activeElement) ?? false;
    const back = selectedId;
    setSelectedId(null);
    if (focusWasInside) {
      const node = root?.querySelector<HTMLElement>(`.react-flow__node[data-id="${CSS.escape(back)}"]`);
      node?.focus({ preventScroll: true });
    }
  }, [selectedId]);

  const onRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && selectedId) {
      event.preventDefault();
      closeInspector();
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    selectView(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  const goToView = (id: string) => {
    selectView(id);
    const index = tabs.findIndex((tab) => tab.id === id);
    tabRefs.current[index]?.focus();
  };

  const Explorer = loaded?.Explorer;
  const panelId = `${idPrefix}-panel`;

  return (
    <div ref={rootRef} className={styles.frame} onKeyDown={onRootKeyDown} data-uth-ready={ready ? "true" : "false"}>
      <div className={styles.toolbar}>
        <p className={styles.toolbarTitle}>{title}</p>
        <div role="tablist" aria-label={copy.tablist} aria-orientation="horizontal" className={styles.tablist}>
          {tabs.map((tab, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={tab.id ?? "all"}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${idPrefix}-tab-${index}`}
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                className={styles.tab}
                onClick={() => selectView(tab.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={`${idPrefix}-tab-${activeIndex}`}>
        <div className={styles.canvas}>
          <div className={cn(styles.layer, styles.posterLayer)} hidden={ready}>
            {children}
          </div>
          {Explorer && model ? (
            <div className={styles.layer} style={{ visibility: ready ? "visible" : "hidden" }}>
              <Explorer
                key={model.orientation}
                model={model}
                language={language}
                idPrefix={`${idPrefix}-flow`}
                radius={radius}
                viewId={viewId}
                selectedId={selectedId}
                onSelect={select}
                onReady={setReadyFor}
                reducedMotion={reducedMotion}
              />
            </div>
          ) : null}
        </div>

        <div className={styles.band}>
          <div aria-live="polite">
            <p className={styles.kicker}>{activeView ? activeView.label : copy.allTitle}</p>
            <p className={styles.noteText}>{activeView ? activeView.note : summary}</p>
          </div>
          <div aria-live="polite">
            {model && selectedId ? (
              <Inspector
                key={selectedId}
                model={model}
                id={selectedId}
                language={language}
                titleRef={inspectorTitleRef}
                onSelect={(id) => select(id, { focusInspector: true })}
                onView={goToView}
                onClose={closeInspector}
              />
            ) : (
              <p className={styles.hint}>{copy.hint}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Inspector({
  model,
  id,
  language,
  titleRef,
  onSelect,
  onView,
  onClose,
}: {
  model: ArchitectureModel;
  id: string;
  language: FilmLanguage;
  titleRef: RefObject<HTMLHeadingElement | null>;
  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onClose: () => void;
}) {
  const copy = COPY[language];
  const spec = model.components.find((item) => item.id === id);
  if (!spec) return null;
  const { component } = spec;
  const links = componentLinks(model.diagram, id);
  const views = viewsWith(model.diagram, id);

  const list = (heading: string, items: ComponentLink[]) => (
    <div>
      <p className={styles.kicker}>{heading}</p>
      {items.length ? (
        <ul className={styles.linkList}>
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className={styles.linkButton} onClick={() => onSelect(item.id)}>
                {item.label}
              </button>
              {item.via ? (
                <span className={styles.via}>
                  {copy.via} {item.via}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{copy.none}</p>
      )}
    </div>
  );

  return (
    <section className={styles.inspector} data-uth-inspector="" aria-labelledby={`uth-inspector-${id}`} style={{ "--role": ROLE_COLOR[spec.role] } as CSSProperties}>
      <div className={styles.inspectorHead}>
        <span className={styles.typeDot} aria-hidden="true" />
        <span className={styles.kicker} style={{ color: "var(--uth-muted)" }}>
          {typeLabel(component.type, language)}
        </span>
        {component.tag ? <span className={styles.pill}>{component.tag}</span> : null}
      </div>
      <h3 ref={titleRef} id={`uth-inspector-${id}`} tabIndex={-1} className={styles.inspectorTitle}>
        {component.label}
      </h3>
      {component.sublabel ? <p className={styles.inspectorSub}>{component.sublabel}</p> : null}
      <button type="button" className={styles.close} onClick={onClose} aria-label={copy.close}>
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      {views.length ? (
        <div className={styles.section}>
          <p className={styles.kicker}>{copy.appears}</p>
          <div className={styles.chips}>
            {views.map((view) => (
              <button key={view.id} type="button" className={styles.chip} onClick={() => onView(view.id)}>
                {view.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className={styles.links}>
        {list(copy.incoming, links.incoming)}
        {list(copy.outgoing, links.outgoing)}
      </div>
    </section>
  );
}
