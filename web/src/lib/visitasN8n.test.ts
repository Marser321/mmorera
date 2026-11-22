import { afterEach, beforeEach, mock, test } from "node:test";
import assert from "node:assert/strict";
import type { VisitaDemo } from "./origen";
import { WEBHOOK_VISITAS, reenviarVisitaAN8n } from "./visitasN8n";

const fetchOriginal = globalThis.fetch;
let llamadas: { url: string; init?: RequestInit }[] = [];
const conOrigen: VisitaDemo = { pagina: "/demos/gimnasios", evento: "vista", de: "gym-prueba", detalle: null };

beforeEach(() => {
  llamadas = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    llamadas.push({ url: String(url), init });
    return new Response(null, { status: 200 });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = fetchOriginal;
  mock.restoreAll();
});

test("una visita con origen va al webhook de n8n con el token en el encabezado", async () => {
  await reenviarVisitaAN8n(conOrigen, "token-de-prueba");
  assert.equal(llamadas.length, 1);
  const [{ url, init }] = llamadas;
  assert.equal(url, WEBHOOK_VISITAS);
  assert.equal(url, "https://n8n.smorera.tech/webhook/visita-demo");
  assert.equal(init?.method, "POST");
  assert.equal((init?.headers as Record<string, string>)["X-Visita-Token"], "token-de-prueba");
  assert.deepEqual(JSON.parse(String(init?.body)), conOrigen);
});

test("sin token no se manda nada", () => {
  assert.equal(reenviarVisitaAN8n(conOrigen, undefined), null);
  assert.equal(reenviarVisitaAN8n(conOrigen, ""), null);
  assert.equal(llamadas.length, 0);
});

test("una visita sin origen no va a n8n: no hay envío con qué cruzarla", () => {
  assert.equal(reenviarVisitaAN8n({ ...conOrigen, de: null }, "token-de-prueba"), null);
  assert.equal(llamadas.length, 0);
});

test("si n8n falla o rechaza el token, no rompe la visita", async () => {
  const avisos = mock.method(console, "warn", () => {});
  globalThis.fetch = (async () => new Response(null, { status: 403 })) as typeof fetch;
  await reenviarVisitaAN8n(conOrigen, "token-malo");
  assert.equal(avisos.mock.callCount(), 1);

  globalThis.fetch = (async () => {
    throw new Error("n8n caído");
  }) as typeof fetch;
  await assert.doesNotReject(reenviarVisitaAN8n(conOrigen, "token-de-prueba") as Promise<void>);
});
