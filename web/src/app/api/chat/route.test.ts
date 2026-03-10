import test, { mock, beforeEach } from 'node:test';
import assert from 'node:assert';
import { MOCK_SERVICES } from '@/data/services';

process.env.OPENAI_API_KEY = "dummy-key";

let fetchCallArgs: any[] = [];

// We just intercept fetch to see what payload is being sent to OpenAI!
global.fetch = mock.fn(async (url: any, options: any) => {
    fetchCallArgs.push({ url, options });

    // Return an empty valid event stream to prevent immediate crashes
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
            controller.close();
        }
    });

    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } });
});

test('POST /api/chat tests', async (t) => {
    let mockGetInsForgeResult: any = null;

    mock.module('@/lib/insforge', {
        namedExports: {
            getInsForge: () => mockGetInsForgeResult,
        }
    });

    const routeModule = await import('./route');
    const { POST } = routeModule;

    beforeEach(() => {
        mockGetInsForgeResult = null;
        fetchCallArgs = [];
        (global.fetch as any).mock.resetCalls();
    });

    await t.test('Test 1: Happy Path with Supabase RAG data', async () => {
        const mockData = [
            { title: 'Servicio DB 1', content: 'Contenido 1' },
            { title: 'Servicio DB 2', content: 'Contenido 2' },
        ];

        mockGetInsForgeResult = {
            database: {
                from: (table: string) => {
                    assert.strictEqual(table, 'kb_assets');
                    return {
                        select: (fields: string) => {
                            assert.strictEqual(fields, '*');
                            return {
                                eq: (field1: string, val1: string) => {
                                    assert.strictEqual(field1, 'asset_type');
                                    assert.strictEqual(val1, 'servicio');
                                    return {
                                        eq: async (field2: string, val2: boolean) => {
                                            assert.strictEqual(field2, 'is_active');
                                            assert.strictEqual(val2, true);
                                            return { data: mockData };
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            }
        };

        const mockReq = {
            json: async () => ({ messages: [{ role: 'user', content: 'hello' }] })
        } as Request;

        const response = await POST(mockReq);
        // We catch any streaming validation errors because we only care about the fetch payload!
        await response.text().catch(() => {});

        assert.strictEqual(fetchCallArgs.length, 1);
        const requestBody = JSON.parse(fetchCallArgs[0].options.body);
        const messages = requestBody.messages || requestBody.input;
        const systemPromptMsg = messages.find((m: any) => m.role === 'system');
        const systemPrompt = systemPromptMsg.content;

        assert.ok(systemPrompt.includes('- Servicio DB 1: Contenido 1'));
        assert.ok(systemPrompt.includes('- Servicio DB 2: Contenido 2'));
        assert.strictEqual(systemPrompt.includes('Servicios no disponibles temporalmente'), false);
    });

    await t.test('Test 2: Fallback to Mock Services when Supabase returns null', async () => {
        mockGetInsForgeResult = null;

        const mockReq = {
            json: async () => ({ messages: [{ role: 'user', content: 'hello' }] })
        } as Request;

        const response = await POST(mockReq);
        await response.text().catch(() => {});

        assert.strictEqual(fetchCallArgs.length, 1);
        const requestBody = JSON.parse(fetchCallArgs[0].options.body);
        const messages = requestBody.messages || requestBody.input;
        const systemPromptMsg = messages.find((m: any) => m.role === 'system');
        const systemPrompt = systemPromptMsg.content;

        const expectedMockStr = MOCK_SERVICES.map(s => `- ${s.nombre}: ${s.descripcion}`).join('\n');
        assert.ok(systemPrompt.includes(expectedMockStr));
        assert.strictEqual(systemPrompt.includes('Servicios no disponibles temporalmente'), false);
    });

    await t.test('Test 3: Fallback when Supabase returns an error', async () => {
        mockGetInsForgeResult = {
            database: {
                from: () => ({
                    select: () => ({
                        eq: () => ({
                            eq: async () => {
                                throw new Error('DB Error');
                            }
                        })
                    })
                })
            }
        };

        const mockReq = {
            json: async () => ({ messages: [{ role: 'user', content: 'hello' }] })
        } as Request;

        const response = await POST(mockReq);
        await response.text().catch(() => {});

        assert.strictEqual(fetchCallArgs.length, 1);
        const requestBody = JSON.parse(fetchCallArgs[0].options.body);
        const messages = requestBody.messages || requestBody.input;
        const systemPromptMsg = messages.find((m: any) => m.role === 'system');
        const systemPrompt = systemPromptMsg.content;

        const expectedMockStr = MOCK_SERVICES.map(s => `- ${s.nombre}: ${s.descripcion}`).join('\n');
        assert.ok(systemPrompt.includes(expectedMockStr));
    });
});
