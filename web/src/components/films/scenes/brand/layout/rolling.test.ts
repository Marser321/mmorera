import assert from "node:assert/strict";
import test from "node:test";
import { rollingSteps } from "./rolling";

test("rollingSteps: todo en 0 al empezar y todo en 1 al terminar", () => {
  for (const count of [1, 2, 5, 9]) {
    assert.deepEqual(rollingSteps(count, 0), Array(count).fill(0));
    assert.deepEqual(rollingSteps(count, 1), Array(count).fill(1));
  }
});

test("rollingSteps: cada carácter avanza en orden y nunca retrocede", () => {
  let previous = rollingSteps(6, 0);
  for (let step = 1; step <= 40; step++) {
    const current = rollingSteps(6, step / 40);
    current.forEach((value, index) => {
      assert.ok(value >= previous[index], "no retrocede");
      if (index > 0) assert.ok(value <= current[index - 1], "el anterior va adelante");
    });
    previous = current;
  }
});
