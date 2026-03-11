import { test, describe, mock } from 'node:test';
import * as assert from 'node:assert';

const mockStreamText = mock.fn(() => ({
    toTextStreamResponse: () => new Response('mocked-stream')
}));

mock.module('ai', {
    namedExports: { streamText: mockStreamText }
});

const mockOpenai = mock.fn(() => 'mocked-openai-model');

mock.module('@ai-sdk/openai', {
    namedExports: { openai: mockOpenai }
});

describe('POST /api/chat-hr', () => {
    test('handles valid request and returns stream response', async () => {
        const { POST } = await import('./route.ts');

        const mockMessages = [{ role: 'user', content: 'hello' }];
        const req = new Request('http://localhost/api/chat-hr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: mockMessages })
        });

        const res = await POST(req);

        assert.strictEqual(res.status, 200);
        const text = await res.text();
        assert.strictEqual(text, 'mocked-stream');

        assert.strictEqual(mockOpenai.mock.calls.length, 1);
        assert.deepStrictEqual(mockOpenai.mock.calls[0].arguments, ['gpt-4o-mini']);

        assert.strictEqual(mockStreamText.mock.calls.length, 1);
        const streamTextArgs = mockStreamText.mock.calls[0].arguments[0] as any;
        assert.strictEqual(streamTextArgs.model, 'mocked-openai-model');
        assert.deepStrictEqual(streamTextArgs.messages, mockMessages);
        assert.ok(streamTextArgs.system.includes('Eres un Agente de Recursos Humanos'));
    });
});
