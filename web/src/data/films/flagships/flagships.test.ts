import test from "node:test";
import assert from "node:assert/strict";
import { FILM_FPS } from "../filmTypes";
import { FLAGSHIP_FILMS } from "./index";
import { heroScene, type SceneKind } from "./types";

/** Subsecuencia común más larga entre dos listas de tipos de escena. */
function lcs(a: SceneKind[], b: SceneKind[]) {
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) table[i][j] = a[i - 1] === b[j - 1] ? table[i - 1][j - 1] + 1 : Math.max(table[i - 1][j], table[i][j - 1]);
  }
  return table[a.length][b.length];
}

const films = Object.values(FLAGSHIP_FILMS);
/** Lo que define la estructura: todo menos la apertura y la firma. */
const middle = (kinds: SceneKind[]) => kinds.slice(1, -1);

test("films insignia: cada cliente con su propia estructura", async (t) => {
  for (const film of films) {
    await t.test(`${film.slug}: escenas contiguas, 70–80 s y firma al final`, () => {
      const total = film.scenes.reduce((sum, scene) => sum + Math.round(scene.seconds * FILM_FPS), 0);
      assert.equal(total, film.durationInFrames);
      const seconds = film.durationInFrames / FILM_FPS;
      assert.ok(seconds >= 70 && seconds <= 80, `${film.slug}: dura ${seconds} s`);
      assert.equal(film.scenes[film.scenes.length - 1].kind, "signature");
      let expected = 0;
      for (const chapter of film.chapters) {
        assert.equal(chapter.from, expected, `${film.slug}: capítulo ${chapter.id} no es contiguo`);
        expected += chapter.durationInFrames;
      }
      assert.equal(expected, film.durationInFrames);
      assert.equal(new Set(film.scenes.map((scene) => scene.id)).size, film.scenes.length, "ids de escena repetidos");
    });
  }

  await t.test("no hay dos films con la misma estructura ni el mismo protagonista", () => {
    for (let i = 0; i < films.length; i++) {
      for (let j = i + 1; j < films.length; j++) {
        const a = middle(films[i].scenes.map((scene) => scene.kind));
        const b = middle(films[j].scenes.map((scene) => scene.kind));
        const ratio = lcs(a, b) / Math.min(a.length, b.length);
        assert.ok(ratio <= 0.6, `${films[i].slug} y ${films[j].slug} se parecen demasiado (${ratio.toFixed(2)})`);
        assert.notEqual(heroScene(films[i].scenes).kind, heroScene(films[j].scenes).kind, `${films[i].slug} y ${films[j].slug} comparten escena protagonista`);
      }
    }
  });
});
