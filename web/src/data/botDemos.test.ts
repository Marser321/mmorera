import assert from "node:assert/strict";
import test from "node:test";
import { BOT_DEMOS, getBotDemo, getBotReply } from "./botDemos";

test("the gallery contains exactly the five planned, separate industries", () => {
  assert.deepEqual(BOT_DEMOS.map(({ id }) => id), [
    "agency",
    "real-estate",
    "appointments",
    "insurance",
    "paperwork",
  ]);
});

test("each demo has its own localized opening and scoped question paths", () => {
  for (const demo of BOT_DEMOS) {
    assert.ok(demo.opening.es.length > 30);
    assert.ok(demo.opening.en.length > 30);
    assert.equal(new Set(demo.prompts.map(({ id }) => id)).size, demo.prompts.length);
    assert.ok(demo.prompts.some(({ id }) => id === "out-of-scope"));
    for (const prompt of demo.prompts) {
      assert.ok(prompt.label.es.length > 0);
      assert.ok(prompt.label.en.length > 0);
      assert.ok(prompt.reply.es.length > 30);
      assert.ok(prompt.reply.en.length > 30);
    }
  }
});

test("unknown prompts use a human/source escalation instead of borrowing another industry's answer", () => {
  assert.match(getBotReply("insurance", "available-listings", "es"), /persona o a una fuente aprobada/i);
  assert.match(getBotReply("paperwork", "available-listings", "en"), /person or an approved source/i);
  assert.notEqual(
    getBotReply("real-estate", "availability", "es"),
    getBotReply("appointments", "availability", "es"),
  );
});

test("insurance and paperwork avoid a definitive personalized decision", () => {
  assert.match(getBotDemo("insurance").prompts.find(({ id }) => id === "out-of-scope")!.reply.es, /No puedo recomendar/);
  assert.match(getBotDemo("paperwork").prompts.find(({ id }) => id === "out-of-scope")!.reply.es, /No puedo confirmar elegibilidad/);
});
