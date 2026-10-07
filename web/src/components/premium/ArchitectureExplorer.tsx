"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type KeyboardEvent } from "react";
import {
  BaseEdge,
  Handle,
  Position,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
  useStore,
  useViewport,
  type Edge,
  type EdgeProps,
  type EdgeTypes,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { polylinePath } from "@/data/architecture/archify";
import type { ArchitectureOrientation } from "@/data/architecture/bundle";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { ArrowMarker, BoundaryShape, BoundaryTitleText, ComponentCard, PlateShape, routeLook } from "./ArchitectureArt";
import {
  DIM_OPACITY,
  focusState,
  isDimmed,
  typeLabel,
  type ArchitectureModel,
  type BoundarySpec,
  type ComponentSpec,
  type FocusState,
  type RouteSpec,
} from "./underTheHoodModel";
import styles from "./UnderTheHood.module.css";

/**
 * Diagrama interactivo de "Bajo el capó" sobre React Flow. Único archivo que
 * importa @xyflow/react (y su CSS): llega en un chunk aparte, cuando la
 * sección se acerca.
 *
 * Nada se recalcula: los nodos van en las posiciones de Archify y cada arista
 * ignora el camino que calcula React Flow y dibuja los puntos congelados.
 * Capas (zIndexMode manual): grupos 0 → rutas 1 → componentes 3; encima, las
 * placas y los rótulos (OverlayLayer). Ninguna línea pasa por encima de un
 * texto, y placas y rótulos nunca tocan una caja (lo validan los tests).
 */

export type ArchitectureExplorerProps = {
  model: ArchitectureModel;
  language: FilmLanguage;
  idPrefix: string;
  radius: number;
  viewId: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onReady: (orientation: ArchitectureOrientation) => void;
  reducedMotion: boolean;
};

type ComponentNodeType = Node<{ spec: ComponentSpec }, "component">;
type BoundaryNodeType = Node<{ spec: BoundarySpec }, "boundary">;
type ExplorerNode = ComponentNodeType | BoundaryNodeType;
type RouteEdgeType = Edge<{ route: RouteSpec }, "route">;

type ExplorerState = { focus: FocusState; selectedId: string | null; idPrefix: string; radius: number; language: FilmLanguage };
const StateContext = createContext<ExplorerState>({ focus: null, selectedId: null, idPrefix: "uth", radius: 16, language: "es" });

/** Lo que un póster no tiene: estados de foco. El estado viaja por contexto, los nodos no se rehacen. */
function ComponentNode({ id, data }: NodeProps<ComponentNodeType>) {
  const { focus, selectedId } = useContext(StateContext);
  const dim = isDimmed(focus, "nodes", id);
  const selected = selectedId === id;
  return (
    <div className={styles.node} data-dim={dim} data-focus={focus !== null && !dim && !selected} data-selected={selected}>
      <Handle type="target" position={Position.Left} isConnectable={false} aria-hidden="true" />
      <Handle type="source" position={Position.Right} isConnectable={false} aria-hidden="true" />
      <ComponentCard spec={data.spec} />
    </div>
  );
}

function BoundaryNode({ data }: NodeProps<BoundaryNodeType>) {
  const { focus, radius } = useContext(StateContext);
  const { spec } = data;
  const dim = isDimmed(focus, "boundaries", spec.label);
  return (
    <svg width={spec.w} height={spec.h} className={styles.dimmable} style={{ display: "block", overflow: "visible", opacity: dim ? 0.4 : 1 }} aria-hidden="true">
      <BoundaryShape x={0} y={0} w={spec.w} h={spec.h} security={spec.security} radius={radius} />
    </svg>
  );
}

/**
 * Placas de etiqueta y rótulos de grupo: una capa SVG sin eventos encima del
 * lienzo, fuera del viewport de React Flow y sincronizada por viewBox. Así se
 * escala como el póster: dentro del viewport (transform de CSS) Chrome a
 * veces no pintaba los textos SVG que habían quedado fuera de pantalla antes
 * de reencuadrar.
 */
function OverlayLayer({ model }: { model: ArchitectureModel }) {
  const { focus, language } = useContext(StateContext);
  const { x, y, zoom } = useViewport();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  if (!width || !height || !zoom) return null;
  return (
    <svg className={styles.overlay} viewBox={`${-x / zoom} ${-y / zoom} ${width / zoom} ${height / zoom}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {model.titles.map((title) => (
        <g key={title.index} className={styles.dimmable} style={{ opacity: isDimmed(focus, "boundaries", title.label) ? 0.4 : 1 }}>
          <BoundaryTitleText title={title} language={language} />
        </g>
      ))}
      {model.plates.map((plate) => (
        <g key={plate.key} className={styles.dimmable} style={{ opacity: isDimmed(focus, "edges", plate.key) ? DIM_OPACITY : 1 }}>
          <PlateShape plate={plate} />
        </g>
      ))}
    </svg>
  );
}

/** Ruta congelada de Archify (se ignoran sourceX/targetX de React Flow). */
function RouteEdge({ id, data }: EdgeProps<RouteEdgeType>) {
  const { focus, selectedId, idPrefix } = useContext(StateContext);
  if (!data) return null;
  const dim = isDimmed(focus, "edges", id);
  const look = routeLook(data.route.variant, selectedId !== null && !dim);
  const markerId = `${idPrefix}-${data.route.id.replace(/[^\w-]/g, "_")}-arrow`;
  return (
    <g className={styles.dimmable} style={{ opacity: dim ? DIM_OPACITY : 1 }}>
      <defs>
        <ArrowMarker id={markerId} color={look.stroke} />
      </defs>
      <BaseEdge id={id} path={polylinePath(data.route.points)} markerEnd={`url(#${markerId})`} interactionWidth={0} style={{ stroke: look.stroke, strokeWidth: look.width, strokeDasharray: look.dash }} />
    </g>
  );
}

const NODE_TYPES: NodeTypes = { component: ComponentNode, boundary: BoundaryNode };
const EDGE_TYPES: EdgeTypes = { route: RouteEdge };

const FOCUS_ZOOM_MAX = 1.6;
const FLY_MS = 650;

/**
 * Encuadre: "Todo" muestra el marco completo (igual que el póster); una vista
 * encuadra sus nodos. Se anima solo al cambiar de vista; al cambiar el tamaño
 * del lienzo se reencuadra al instante.
 */
function Camera({ model, viewId, reducedMotion, onReady, onZoom }: { model: ArchitectureModel; viewId: string | null; reducedMotion: boolean; onReady: () => void; onZoom: (zoom: number) => void }) {
  const { fitBounds, fitView, getViewport } = useReactFlow();
  const initialized = useNodesInitialized();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);
  const last = useRef<{ viewId: string | null } | null>(null);

  useEffect(() => {
    if (!initialized || !width || !height) return;
    const previous = last.current;
    last.current = { viewId };
    const duration = previous !== null && previous.viewId !== viewId && !reducedMotion ? FLY_MS : 0;
    const focus = viewId ? (model.diagram.meta.views?.find((view) => view.id === viewId)?.focus ?? null) : null;
    const { frame } = model;
    const fit = focus?.length
      ? fitView({ nodes: focus.map((id) => ({ id })), padding: 0.08, maxZoom: FOCUS_ZOOM_MAX, duration })
      : fitBounds({ x: frame.x, y: frame.y, width: frame.w, height: frame.h }, { padding: 0, duration });
    void fit.then(() => {
      onZoom(getViewport().zoom);
      if (previous === null) onReady();
    });
  }, [fitBounds, fitView, getViewport, height, initialized, model, onReady, onZoom, reducedMotion, viewId, width]);

  return null;
}

export function ArchitectureExplorer({ model, language, idPrefix, radius, viewId, selectedId, onSelect, onReady, reducedMotion }: ArchitectureExplorerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isEs = language === "es";

  // Nodos y aristas fijos por diagrama; foco y selección van por contexto.
  const nodes = useMemo<ExplorerNode[]>(() => {
    const fixed = { draggable: false, selectable: false, connectable: false, deletable: false } as const;
    const decorative = { ...fixed, focusable: false, style: { pointerEvents: "none" as const }, domAttributes: { "aria-hidden": true } };
    return [
      ...model.boundaries.map((spec): BoundaryNodeType => ({
        ...decorative,
        id: spec.id,
        type: "boundary",
        position: { x: spec.x, y: spec.y },
        width: spec.w,
        height: spec.h,
        measured: { width: spec.w, height: spec.h },
        zIndex: 0,
        data: { spec },
      })),
      ...model.components.map((spec): ComponentNodeType => ({
        ...fixed,
        id: spec.id,
        type: "component",
        position: { x: spec.x, y: spec.y },
        width: spec.w,
        height: spec.h,
        measured: { width: spec.w, height: spec.h },
        zIndex: 3,
        focusable: true,
        ariaRole: "button",
        ariaLabel: [spec.component.label, spec.component.sublabel, typeLabel(spec.component.type, language)].filter(Boolean).join(". "),
        domAttributes: { "aria-roledescription": isEs ? "componente" : "component" },
        data: { spec },
      })),
    ];
  }, [isEs, language, model]);

  const edges = useMemo<RouteEdgeType[]>(
    () =>
      model.routes.map((route) => ({
        id: route.id,
        source: route.from,
        target: route.to,
        type: "route",
        zIndex: 1,
        selectable: false,
        focusable: false,
        deletable: false,
        domAttributes: { "aria-hidden": true },
        data: { route },
      })),
    [model],
  );

  const state = useMemo<ExplorerState>(
    () => ({ focus: focusState(model.diagram, viewId, selectedId), selectedId, idPrefix, radius, language }),
    [idPrefix, language, model, radius, selectedId, viewId],
  );

  const setZoom = useCallback((zoom: number) => {
    wrapperRef.current?.style.setProperty("--uth-zoom", String(zoom));
  }, []);
  const ready = useCallback(() => onReady(model.orientation), [model.orientation, onReady]);

  // Enter o espacio sobre un componente enfocado abre su detalle (Esc lo cierra desde la isla).
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target as HTMLElement;
    if (!target.classList.contains("react-flow__node-component")) return;
    const id = target.dataset.id;
    if (!id) return;
    event.preventDefault();
    onSelect(id);
  };

  const description = isEs ? "Enter o espacio abre el detalle del componente." : "Press Enter or Space to open the component details.";

  return (
    <div ref={wrapperRef} className={styles.flow} onKeyDown={onKeyDown}>
      <StateContext.Provider value={state}>
        <ReactFlow<ExplorerNode, RouteEdgeType>
          id={idPrefix}
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          zIndexMode="manual"
          minZoom={0.05}
          maxZoom={2.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable
          edgesFocusable={false}
          autoPanOnNodeFocus
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          panOnDrag={false}
          zoomOnPinch
          zoomOnDoubleClick={false}
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          panActivationKeyCode={null}
          zoomActivationKeyCode={null}
          proOptions={{ hideAttribution: true }}
          ariaLabelConfig={{ "node.a11yDescription.default": description, "node.a11yDescription.keyboardDisabled": description }}
          onNodeClick={(_, node) => {
            if (node.type === "component") onSelect(node.id === selectedId ? null : node.id);
          }}
          onPaneClick={() => onSelect(null)}
          onMove={(_, viewport) => setZoom(viewport.zoom)}
        >
          <OverlayLayer model={model} />
          <Camera model={model} viewId={viewId} reducedMotion={reducedMotion} onReady={ready} onZoom={setZoom} />
        </ReactFlow>
      </StateContext.Provider>
    </div>
  );
}
