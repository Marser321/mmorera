import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "./rateLimit";

function clock(start = 0) {
  let time = start;
  return { now: () => time, advance: (ms: number) => { time += ms; } };
}

describe("límite de envíos", () => {
  test("acepta hasta el límite y rechaza el siguiente", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    assert.equal(limiter.allow("a"), true);
    assert.equal(limiter.allow("a"), true);
    assert.equal(limiter.allow("a"), false);
  });

  test("cada clave lleva su propia cuenta", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    assert.equal(limiter.allow("a"), true);
    assert.equal(limiter.allow("b"), true);
    assert.equal(limiter.allow("a"), false);
  });

  test("vuelve a aceptar cuando pasa la ventana", () => {
    const time = clock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: time.now });
    assert.equal(limiter.allow("a"), true);
    time.advance(999);
    assert.equal(limiter.allow("a"), false);
    time.advance(1);
    assert.equal(limiter.allow("a"), true);
  });

  test("un envío rechazado no alarga la espera", () => {
    const time = clock();
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: time.now });
    limiter.allow("a");
    time.advance(900);
    assert.equal(limiter.allow("a"), false);
    time.advance(100);
    assert.equal(limiter.allow("a"), true);
  });

  test("no crece sin límite en memoria y olvida la clave menos reciente", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    limiter.allow("a");
    limiter.allow("b");
    limiter.allow("c");
    assert.equal(limiter.size, 2);
    assert.equal(limiter.allow("a"), true);
    assert.equal(limiter.allow("c"), false);
  });
});
