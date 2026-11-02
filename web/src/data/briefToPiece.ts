import type { LocalizedText } from "@/types/site";
import type { BriefToPiece } from "@/types/briefToPiece";

const t = (es: string, en: string): LocalizedText => ({ es, en });

/**
 * «Del brief a la pieza» (M3): dos piezas reales del sistema de contenido,
 * de las tandas del 29/10 en adelante (en tuteo). Etapas y autoría verificadas
 * por Gemini en docs/triada/gemini/T33-piezas.md; sin datos de clientes.
 */
const STAGE = {
  brief: t("Brief", "Brief"),
  guion: t("Guion", "Script"),
  arte: t("Arte", "Art"),
  revision: t("Revisión humana", "Human review"),
  final: t("Pieza final", "Final piece"),
};

const img = (slug: string, file: string, es: string, en: string) => ({ src: `/portfolio/fabrica/${slug}/${file}`, alt: t(es, en) });

export const BRIEF_TO_PIECE: BriefToPiece[] = [
  {
    slug: "del-pedido-a-la-pieza",
    title: t("De «necesito una web» a saber qué construir", "From “I need a website” to knowing what to build"),
    stages: [
      { stage: "brief", who: "persona", label: STAGE.brief,
        summary: t("Mario define la idea: pasar de una frase abierta a una acción concreta que la persona pueda hacer al llegar.", "Mario sets the idea: turn an open request into one concrete action people can take when they arrive."),
        image: img("del-pedido-a-la-pieza", "01-brief.webp", "Tarjeta del brief: objetivo, situación y primer entregable", "Brief card: goal, situation and first deliverable") },
      { stage: "guion", who: "ia", label: STAGE.guion,
        summary: t("Claude escribe el guion de 3 láminas en tuteo, con un ejemplo recreado que no inventa complejidad.", "Claude writes the 3-slide script, with a recreated example that doesn't invent complexity."),
        image: img("del-pedido-a-la-pieza", "02-guion.webp", "Tarjeta del guion lámina por lámina", "Slide-by-slide script card") },
      { stage: "arte", who: "herramienta", label: STAGE.arte,
        summary: t("La composición se arma en código sobre el kit de marca, antes de poner el texto.", "The layout is built in code on the brand kit, before the copy goes in."),
        image: img("del-pedido-a-la-pieza", "03-arte-diseno.webp", "Composición previa con el monograma y las zonas de texto", "Draft layout with the monogram and the text areas") },
      { stage: "revision", who: "persona", label: STAGE.revision,
        summary: t("Mario revisa que la propuesta sea directa y clara, que el ejemplo esté rotulado y aprueba la versión final.", "Mario checks the offer is direct and clear and the example is labeled, then approves the final version."),
        image: img("del-pedido-a-la-pieza", "04-revision-humana.webp", "Tarjeta de la revisión humana", "Human review card") },
      { stage: "final", who: "herramienta", label: STAGE.final,
        summary: t("El sistema renderiza la lámina terminada para Instagram y LinkedIn.", "The system renders the finished slide for Instagram and LinkedIn."),
        image: img("del-pedido-a-la-pieza", "05-pieza-final.webp", "Lámina final: De «necesito una web» a saber qué construir", "Final slide: from “I need a website” to knowing what to build") },
    ],
  },
  {
    slug: "cambiar-menu-archivo-editable",
    title: t("Solo cambió un precio. El menú es una foto.", "Only a price changed. The menu is a photo."),
    stages: [
      { stage: "brief", who: "persona", label: STAGE.brief,
        summary: t("Mario plantea la escena: el cliente necesita cambiar un precio y solo tiene la imagen exportada.", "Mario sets the scene: the client needs to change a price and only has the exported image."),
        image: img("cambiar-menu-archivo-editable", "01-brief.webp", "Tarjeta del brief: entrega y mantenimiento", "Brief card: handover and maintenance") },
      { stage: "guion", who: "ia", label: STAGE.guion,
        summary: t("Claude escribe el guion: antes de prometer que podrás actualizarlo, acordar qué archivo necesitas.", "Claude writes the script: before promising you can update it, agree on which file you need."),
        image: img("cambiar-menu-archivo-editable", "02-guion.webp", "Tarjeta del guion lámina por lámina", "Slide-by-slide script card") },
      { stage: "arte", who: "ia", label: STAGE.arte,
        summary: t("Una IA genera la placa fotográfica, sin texto; el texto se compone después en código.", "An AI generates the photo background, with no text; the copy is set later in code."),
        image: img("cambiar-menu-archivo-editable", "03-arte-diseno.webp", "Placa generada sin texto: una persona frente a su pantalla", "Text-free generated background: a person at their screen") },
      { stage: "revision", who: "persona", label: STAGE.revision,
        summary: t("Mario descarta las promesas mágicas, rotula la escena como ejemplo e imagen generada y aprueba el texto.", "Mario drops the magic promises, labels the scene as an example and a generated image, and approves the copy."),
        image: img("cambiar-menu-archivo-editable", "04-revision-humana.webp", "Tarjeta de la revisión humana", "Human review card") },
      { stage: "final", who: "herramienta", label: STAGE.final,
        summary: t("El sistema compone y renderiza la lámina final, con sus rótulos visibles.", "The system composes and renders the final slide, with its labels visible."),
        image: img("cambiar-menu-archivo-editable", "05-pieza-final.webp", "Lámina final: Solo cambió un precio. El menú es una foto.", "Final slide: only a price changed, the menu is a photo") },
    ],
  },
];
