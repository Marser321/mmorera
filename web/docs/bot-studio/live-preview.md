# Bot Studio live chat preview

This branch adds a text-only conversation to the five fictional industry demos. Each request uses the fixed `openrouter/free` router from a server route; the browser never receives the API key. The route has no tools, plugins, CRM, booking, storage, or paid-model fallback.

## Preview configuration

Set `OPENROUTER_API_KEY` as a server-only Vercel preview environment variable. Do not add it to a `NEXT_PUBLIC_*` variable, a checked-in file, or a local `.env` committed to Git. Without the key, the API returns a clear unavailable state and the existing guided sample remains available.

The chat sends the visitor's messages to OpenRouter for inference. The application does not write messages to a database or local file. Visitors are told not to enter personal data. The upstream free-model router may select among available free models, so the exact serving model is returned in the response when reported.

## Limits

- Only five fixed demo profile IDs and Spanish or English are accepted.
- Each message is limited to 600 characters; a conversation is limited to 12 visitor turns.
- The response is capped at 350 tokens and an 18 second timeout.
- The route requests exactly `openrouter/free`; it does not retry with a paid model or enable plugins/tools. OpenRouter describes that router as selecting only available free-variant models and lists the price as zero: https://openrouter.ai/openrouter/free.
- OpenRouter quota/provider failures return an unavailable message and offer the guided sample.
- A best-effort in-memory limit allows six requests per minute per hashed client IP per server instance. It is not a shared quota store and must not be treated as production abuse protection on a horizontally scaled deployment.

## Before production

Keep this branch in preview until a shared rate-limit control is configured, the OpenRouter account's current free-model quota is checked, and the acceptance matrix passes twice. Do not publish production from this branch automatically. Public visitors' text is processed by an external model provider even though the site does not persist it; make that disclosure prominent and review the provider's current privacy terms before production.

## Local checks

Run `npx tsx --test src/app/api/bot-studio/chat/route.test.ts` and `npm run build` from `web/`. The tests mock OpenRouter and never send a real request.
