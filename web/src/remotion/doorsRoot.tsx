import { Composition, registerRoot } from "remotion";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { DoorFilm } from "@/components/films/puertas/DoorFilm";
import { DOORS, DOOR_FPS, DOOR_IDS, DOOR_SIZE, doorFrames, type DoorId } from "@/components/films/puertas/timing";
import { FontGate } from "./FontGate";

/**
 * Raíz de Remotion de los films de las puertas de servicio (home, escena 02).
 * No la carga el sitio: la usa `npx tsx scripts/render-doors.ts`.
 *
 * - puerta-<id>-<idioma>: las que llevan texto (agentes y sistemas).
 * - puerta-contenido: sin idioma.
 */

const LANGUAGES: FilmLanguage[] = ["es", "en"];

function DoorRender({ door, language }: { door: DoorId; language: FilmLanguage }) {
  return (
    <FontGate>
      <DoorFilm door={door} language={language} />
    </FontGate>
  );
}

export function DoorsRoot() {
  return (
    <>
      {DOOR_IDS.flatMap((door) =>
        (DOORS[door].bilingual ? LANGUAGES : (["es"] as FilmLanguage[])).map((language) => (
          <Composition
            key={`${door}-${language}`}
            id={DOORS[door].bilingual ? `puerta-${door}-${language}` : `puerta-${door}`}
            component={DoorRender}
            durationInFrames={doorFrames(door)}
            fps={DOOR_FPS}
            width={DOOR_SIZE.width}
            height={DOOR_SIZE.height}
            defaultProps={{ door, language }}
          />
        )),
      )}
    </>
  );
}

registerRoot(DoorsRoot);
