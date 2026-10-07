import test from "node:test";
import assert from "node:assert/strict";
import { safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import {
  lbOpeningLayout,
  lbFleetLayout,
  lbQuoterLayout,
  lbCrewLayout,
} from "./lbWashFilmLayout";

function assertWithin(inner: Box, outer: Box, name: string) {
  assert.ok(inner.x >= outer.x - 1, `${name}: x ${inner.x} fuera de ${outer.x}`);
  assert.ok(inner.y >= outer.y - 1, `${name}: y ${inner.y} fuera de ${outer.y}`);
  assert.ok(inner.x + inner.w <= outer.x + outer.w + 1, `${name}: desborde derecho`);
  assert.ok(inner.y + inner.h <= outer.y + outer.h + 1, `${name}: desborde inferior`);
}

test("lbWashFilmLayout: respeta safeArea en 16:9 y 4:5", () => {
  const formats: FilmFormatName[] = ["landscape", "portrait"];

  for (const format of formats) {
    const safe = safeArea(format);

    // Opening
    const opening = lbOpeningLayout(format);
    assertWithin(opening.markBox, safe, `opening.markBox (${format})`);
    assertWithin(opening.titleBox, safe, `opening.titleBox (${format})`);

    // Fleet
    const fleet = lbFleetLayout(format);
    assertWithin(fleet.titleBox, safe, `fleet.titleBox (${format})`);
    assertWithin(fleet.vansBox, safe, `fleet.vansBox (${format})`);
    assertWithin(fleet.equationBox, safe, `fleet.equationBox (${format})`);

    // Quoter
    const quoter = lbQuoterLayout(format);
    assertWithin(quoter.titleBox, safe, `quoter.titleBox (${format})`);
    assertWithin(quoter.gridBox, safe, `quoter.gridBox (${format})`);
    assertWithin(quoter.summaryBox, safe, `quoter.summaryBox (${format})`);

    // Crew
    const crew = lbCrewLayout(format);
    assertWithin(crew.titleBox, safe, `crew.titleBox (${format})`);
    assertWithin(crew.phoneBox, safe, `crew.phoneBox (${format})`);
    assertWithin(crew.crmFeedBox, safe, `crew.crmFeedBox (${format})`);
  }
});
