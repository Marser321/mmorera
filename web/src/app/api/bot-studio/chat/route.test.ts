import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { POST, validateChatRequest } from "./route";

const ids = ["agency", "real-estate", "appointments", "insurance", "paperwork"] as const;

const originalKey = process.env.OPENROUTER_API_KEY;
const originalFetch = globalThis.fetch;

afterEach(() => {
  if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
  else process.env.OPENROUTER_API_KEY = originalKey;
  globalThis.fetch = originalFetch;
});

describe("Bot Studio chat API", () => {
  it("accepts free text for each isolated demo profile", () => {
    for (const demoId of ids) {
      const result = validateChatRequest({
        demoId,
        language: "es",
        messages: [{ role: "user", content: "Tengo una pregunta abierta sobre este servicio." }],
      });
      assert.equal(result.ok, true);
    }
  });

  it("rejects unknown demo IDs, malformed turns, oversized input, and excess turns", () => {
    assert.equal(validateChatRequest({ demoId: "asana", language: "es", messages: [{ role: "user", content: "Hola" }] }).ok, false);
    assert.equal(validateChatRequest({ demoId: "agency", language: "es", messages: [{ role: "assistant", content: "Hola" }] }).ok, false);
    assert.deepEqual(validateChatRequest({ demoId: "agency", language: "es", messages: [{ role: "user", content: "x".repeat(601) }] }), { ok: false, reason: "too_long" });
    assert.deepEqual(validateChatRequest({
      demoId: "agency",
      language: "en",
      messages: Array.from({ length: 13 }, (_, index) => ({ role: "user", content: `Question ${index + 1}` })),
    }), { ok: false, reason: "too_many_turns" });
  });

  it("accepts assistant replies in a resumed conversation while keeping visitor turns bounded", () => {
    const result = validateChatRequest({
      demoId: "agency",
      language: "en",
      messages: [
        { role: "user", content: "I want more customers." },
        { role: "assistant", content: "First, what would a useful inquiry look like for your business?" },
        { role: "user", content: "A qualified consultation." },
      ],
    });
    assert.equal(result.ok, true);
  });

  it("always calls the fixed free router without tools, streaming, or paid fallback", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const calls: Array<[RequestInfo | URL, RequestInit | undefined]> = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push([input, init]);
      return new Response(JSON.stringify({
      model: "example/model:free",
      choices: [{ message: { content: "Primero aclararía qué resultado buscas." } }],
      }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof fetch;

    const response = await POST(new Request("https://preview.test/api/bot-studio/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": "192.0.2.1" },
      body: JSON.stringify({ demoId: "agency", language: "es", messages: [{ role: "user", content: "Quiero conversar libremente." }] }),
    }));
    const result = await response.json();
    const requestBody = JSON.parse(calls[0][1]?.body as string);

    assert.equal(response.status, 200);
    assert.equal(result.message, "Primero aclararía qué resultado buscas.");
    assert.equal(calls[0][0], "https://openrouter.ai/api/v1/chat/completions");
    assert.equal(requestBody.model, "openrouter/free");
    assert.equal(requestBody.stream, false);
    assert.equal(requestBody.tools, undefined);
    assert.equal(requestBody.plugins, undefined);
    assert.ok(requestBody.max_tokens <= 350);
  });

  it("shows service unavailability without falling back when no secret is configured", async () => {
    process.env.OPENROUTER_API_KEY = "";
    let called = false;
    globalThis.fetch = (async () => { called = true; throw new Error("unexpected upstream call"); }) as typeof fetch;
    const response = await POST(new Request("https://preview.test/api/bot-studio/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": "192.0.2.2" },
      body: JSON.stringify({ demoId: "insurance", language: "en", messages: [{ role: "user", content: "Can I get advice?" }] }),
    }));
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /guided sample/);
    assert.equal(called, false);
  });

  it("applies a per-instance request limit and does not retry the provider", async () => {
    process.env.OPENROUTER_API_KEY = "";
    let called = false;
    globalThis.fetch = (async () => { called = true; throw new Error("unexpected upstream call"); }) as typeof fetch;
    const send = () => POST(new Request("https://preview.test/api/bot-studio/chat", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": "192.0.2.99" },
      body: JSON.stringify({ demoId: "paperwork", language: "en", messages: [{ role: "user", content: "Where should I start?" }] }),
    }));
    const statuses: number[] = [];
    for (let index = 0; index < 7; index += 1) statuses.push((await send()).status);
    assert.deepEqual(statuses, [503, 503, 503, 503, 503, 503, 429]);
    assert.equal(called, false);
  });
});
