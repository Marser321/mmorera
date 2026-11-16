import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { CITIES, CITY_IDS, CLIP_FRAMES, CLIP_IDS, END_FRAMES, END_FROM, PLANE, REEL_FRAMES, REEL_POSTER, REEL_SCENES, TRAILER_FRAMES, TRAILER_POSTER, TRAILER_SCENES, VESPERA_FPS, XFADE, type Scene } from "@/components/films/vespera/timing";
import { getCaseMedia } from "./caseMedia";
import { getProjectCase } from "./projectCases";

const publicFile = (src: string) => path.join(process.cwd(), "public", src);
const source = (file: string) => path.join(process.cwd(), "film-sources", "vespera", file);

describe("tráiler y reel de Vespera", () => {
  const project = getProjectCase("vespera");

  it("el caso lleva su tráiler y su reel, y los archivos existen", () => {
    assert.ok(project?.trailer, "Vespera no tiene tráiler");
    for (const src of [project.trailer.mp4, project.trailer.webm, project.trailer.poster]) assert.ok(existsSync(publicFile(src)), `falta ${src}: correr scripts/render-vespera.ts`);
    const reel = getCaseMedia("vespera")?.reel;
    assert.ok(reel, "Vespera no tiene reel");
    for (const src of [reel.mp4, reel.webm, reel.poster]) assert.ok(existsSync(publicFile(src)), `falta ${src}: correr scripts/render-vespera.ts`);
    assert.ok(project.trailer.caption.es && project.trailer.caption.en);
  });

  it("la duración que se muestra es la del tráiler", () => {
    assert.equal(project?.trailer?.seconds, Math.round(TRAILER_FRAMES / VESPERA_FPS));
    assert.equal(TRAILER_FRAMES, END_FROM + END_FRAMES);
    assert.equal(REEL_FRAMES / VESPERA_FPS, 6, "el reel dura seis segundos, como los demás");
  });

  it("es un proyecto propio: no lleva la línea de AD Media", () => {
    assert.equal(project?.soldVia, undefined);
  });

  it("los planos de origen, el avión y las fuentes están en el repo", () => {
    for (const clip of CLIP_IDS) assert.ok(existsSync(source(`${clip}.mp4`)), `falta el clip ${clip}`);
    for (const file of ["plane-top.webp", "fonts/cormorant-normal.woff2", "fonts/jakarta-normal.woff2", "fonts/OFL-Cormorant.txt", "fonts/OFL-Jakarta.txt"]) assert.ok(existsSync(source(file)), `falta ${file}`);
  });

  for (const [name, scenes] of [["tráiler", TRAILER_SCENES], ["reel", REEL_SCENES]] as [string, Scene[]][]) {
    it(`${name}: cada escena usa cuadros que el clip tiene y se encadena con la anterior`, () => {
      scenes.forEach((scene, index) => {
        assert.ok(scene.start + scene.frames <= CLIP_FRAMES, `${scene.clip} pide cuadros que el clip no tiene`);
        // Nunca se acelera: un cuadro del film es un cuadro del clip.
        if (index > 0) assert.equal(scene.from, scenes[index - 1].from + scenes[index - 1].frames - XFADE);
      });
    });

    it(`${name}: la tarjeta de la ciudad sale antes de que entre el avión`, () => {
      scenes.forEach((scene, index) => {
        const next = scenes[index + 1];
        if (!scene.city || next?.enter !== "plane") return;
        const cardOut = scene.from + scene.frames - (XFADE + PLANE.lead + 1);
        assert.ok(cardOut <= next.from - PLANE.lead, `${scene.clip}: la tarjeta sigue cuando entra el avión`);
        assert.ok(cardOut - scene.from >= 48, `${scene.clip}: la tarjeta se ve menos de dos segundos`);
      });
    });
  }

  it("el avión descubre la escena nueva antes de que termine la anterior", () => {
    const planeHeight = PLANE.width * PLANE.ratio;
    const speed = (720 + planeHeight) / PLANE.frames;
    // Cuadro de la pasada en el que el corte ya salió por arriba: desde ahí la escena anterior no se ve.
    const cleared = Math.ceil((720 + planeHeight * PLANE.seamRoot) / speed);
    assert.ok(cleared <= PLANE.lead + XFADE, "la escena anterior termina con el corte todavía en pantalla");
    assert.ok(PLANE.width * PLANE.wingTip * 2 >= 1280, "las alas no llegan de lado a lado");
  });

  it("los pósters son de cine puro: sin tarjetas ni avión cenital", () => {
    const pure = (scenes: Scene[], frame: number) => {
      const scene = [...scenes].reverse().find((item) => frame >= item.from);
      return Boolean(scene && !scene.city && scene.enter === "fade" && frame >= scene.from + XFADE && frame < scene.from + scene.frames - XFADE);
    };
    assert.ok(pure(TRAILER_SCENES, TRAILER_POSTER));
    assert.ok(pure(REEL_SCENES, REEL_POSTER));
  });

  it("los kilómetros solo suman y cada ciudad tiene su sello", () => {
    const km = CITY_IDS.map((city) => CITIES[city].km);
    assert.deepEqual(km, [...km].sort((a, b) => a - b));
    for (const city of CITY_IDS) assert.match(CITIES[city].code, /^[A-Z]{3}$/);
  });
});
