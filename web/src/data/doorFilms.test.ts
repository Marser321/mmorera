import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { DOOR_COPY } from "@/components/films/puertas/copy";
import { DOORS, DOOR_IDS, DOOR_SIZE, SAFE, WEBS_UI, XFADE, doorFrames, secondShotStart } from "@/components/films/puertas/timing";
import { DOOR_FILM_SERVICES, getDoorFilm } from "./doorFilms";
import { SERVICE_SOLUTIONS } from "./solutionsData";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("films de las puertas de servicio", () => {
  it("cada servicio del home tiene su film, en los dos idiomas", () => {
    assert.deepEqual([...DOOR_FILM_SERVICES].sort(), SERVICE_SOLUTIONS.map((service) => service.id).sort());
    for (const id of DOOR_FILM_SERVICES) {
      for (const language of ["es", "en"] as const) {
        const film = getDoorFilm(id, language);
        assert.ok(film, `${id} no tiene film`);
        for (const src of [film.mp4, film.webm, film.poster]) assert.ok(existsSync(publicFile(src)), `falta ${src}: correr scripts/render-doors.ts`);
      }
    }
  });

  it("cada puerta tiene su color y ninguno se parece a otro", () => {
    // Tono (0–360) de cada color: azul, dorado, verde y coral quedan bien separados.
    const hue = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16) / 255);
      const max = Math.max(r, g, b);
      const delta = max - Math.min(r, g, b);
      const raw = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
      return (raw * 60 + 360) % 360;
    };
    const hues = DOOR_IDS.map((door) => hue(DOORS[door].tone));
    for (let a = 0; a < hues.length; a += 1) {
      for (let b = a + 1; b < hues.length; b += 1) {
        const gap = Math.min(Math.abs(hues[a] - hues[b]), 360 - Math.abs(hues[a] - hues[b]));
        assert.ok(gap >= 20, `${DOOR_IDS[a]} y ${DOOR_IDS[b]} tienen colores muy parecidos (${Math.round(gap)}°)`);
      }
    }
  });

  it("los planos de origen están en el repo", () => {
    for (const door of DOOR_IDS) for (const shot of [0, 1]) assert.ok(existsSync(path.join(process.cwd(), "film-sources", "puertas", `${door}-${shot}.mp4`)), `falta el plano ${door}-${shot}`);
    for (const file of WEBS_UI) assert.ok(existsSync(path.join(process.cwd(), "film-sources", "puertas", file)), `falta la captura ${file}`);
  });

  it("el reloj cierra: cine primero, interfaz después y cola libre para el fundido", () => {
    for (const door of DOOR_IDS) {
      const spec = DOORS[door];
      const total = doorFrames(door);
      assert.ok(total >= 120 && total <= 200, `${door}: dura ${total} cuadros`);
      // Al menos dos segundos y medio de cine puro antes de la interfaz.
      assert.ok(spec.overlayFrom >= 60, `${door}: la interfaz entra demasiado pronto`);
      assert.ok(spec.overlayFrom > secondShotStart(door), `${door}: la interfaz entra antes del segundo plano`);
      assert.ok(spec.overlayOut <= total - XFADE, `${door}: la interfaz pisa el fundido de la cola`);
      assert.ok(spec.poster < spec.overlayFrom - 6, `${door}: el póster tiene que ser cine puro`);
    }
  });

  it("lo que se lee entra en la columna central", () => {
    assert.ok(SAFE.x >= 0 && SAFE.x + SAFE.width <= DOOR_SIZE.width);
    // A 1024 px la puerta abierta muestra el 43 % central del ancho.
    assert.ok(SAFE.width <= DOOR_SIZE.width * 0.43);
    assert.equal(SAFE.x + SAFE.width / 2, DOOR_SIZE.width / 2);
  });

  it("el texto está en los dos idiomas y sale de la demo guiada", () => {
    for (const language of ["es", "en"] as const) {
      const copy = DOOR_COPY[language];
      assert.ok(copy.question.trim() && copy.answer.trim() && copy.handoff.trim());
      assert.equal(copy.flow.length, 4);
      assert.doesNotMatch(JSON.stringify(copy), /%|\$|AD\s*Media/i);
    }
  });
});
