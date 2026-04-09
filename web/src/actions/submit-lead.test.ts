import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

// The submit-lead file actually uses `require('@insforge/sdk')` inside the function body
// (as confirmed by grep). Because NextJS uses `node --experimental-strip-types` locally here,
// `require` is not defined globally when running as an ES module directly via node.
// To fix this, we'll provide a global `require` mock that satisfies the code.

const sendMock = mock.fn();
mock.module('resend', {
    namedExports: {
        Resend: class Resend {
            emails = { send: sendMock }
        }
    }
});

const insertMock = mock.fn(() => ({ error: null }));
const createClientMock = mock.fn(() => ({
    database: {
        from: () => ({
            insert: insertMock
        })
    }
}));

// Provide a mock require
const myRequire = createRequire(import.meta.url);
global.require = ((id: string) => {
    if (id === '@insforge/sdk') {
        return { createClient: createClientMock };
    }
    return myRequire(id);
}) as any;

const { submitLead } = await import('./submit-lead.ts');

describe('submitLead', () => {
    let originalEnv: NodeJS.ProcessEnv;
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        originalEnv = { ...process.env };
        originalFetch = global.fetch;

        // Reset mocks
        sendMock.mock.resetCalls();
        createClientMock.mock.resetCalls();
        insertMock.mock.resetCalls();
    });

    afterEach(() => {
        process.env = originalEnv;
        global.fetch = originalFetch;
    });

    const mockFormData = {
        nombre: 'Juan',
        email: 'juan@example.com',
        telefono: '123456',
        empresa: 'Test Corp',
        servicios_interes: ['Web'],
        plan_seleccionado: 'Pro',
        mensaje: 'Hello'
    };

    it('should run successfully when all env vars are provided', async () => {
        process.env.RESEND_API_KEY = 'test_resend_key';
        process.env.TELEGRAM_BOT_TOKEN = 'test_bot_token';
        process.env.TELEGRAM_CHAT_ID = 'test_chat_id';
        process.env.NEXT_PUBLIC_INSFORGE_URL = 'test_insforge_url';
        process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY = 'test_insforge_anon';

        global.fetch = mock.fn(() => Promise.resolve({ ok: true } as Response));

        const result = await submitLead(mockFormData);

        assert.strictEqual(result.success, true);

        // Check Resend
        assert.strictEqual(sendMock.mock.calls.length, 1);
        const resendArgs = sendMock.mock.calls[0].arguments[0];
        assert.strictEqual(resendArgs.to, process.env.NOTIFICATION_EMAIL || 'nexo@example.com');
        assert.ok(resendArgs.html.includes('Juan'));

        // Check Telegram
        assert.strictEqual((global.fetch as ReturnType<typeof mock.fn>).mock.calls.length, 1);
        const fetchUrl = (global.fetch as ReturnType<typeof mock.fn>).mock.calls[0].arguments[0];
        assert.strictEqual(fetchUrl, 'https://api.telegram.org/bottest_bot_token/sendMessage');

        // Check InsForge
        assert.strictEqual(insertMock.mock.calls.length, 1);
        const insertArgs = insertMock.mock.calls[0].arguments[0];
        assert.strictEqual(insertArgs[0].first_name, 'Juan');
        assert.strictEqual(insertArgs[0].email, 'juan@example.com');
        assert.deepStrictEqual(insertArgs[0].interested_services, ['Web']);
    });

    it('should skip integrations if env vars are missing', async () => {
        delete process.env.RESEND_API_KEY;
        delete process.env.TELEGRAM_BOT_TOKEN;
        delete process.env.TELEGRAM_CHAT_ID;
        delete process.env.NEXT_PUBLIC_INSFORGE_URL;
        delete process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

        global.fetch = mock.fn();

        const result = await submitLead(mockFormData);

        assert.strictEqual(result.success, true);

        // No emails sent
        assert.strictEqual(sendMock.mock.calls.length, 0);

        // No telegram message sent
        assert.strictEqual((global.fetch as ReturnType<typeof mock.fn>).mock.calls.length, 0);

        // No DB insert
        assert.strictEqual(insertMock.mock.calls.length, 0);
    });

    it('should return error object if an exception is thrown', async () => {
        process.env.RESEND_API_KEY = 'test_resend_key';

        // Force Resend to throw an error
        sendMock.mock.mockImplementationOnce(() => {
            throw new Error('Resend failed');
        });

        const result = await submitLead(mockFormData);

        assert.strictEqual(result.success, false);
        assert.strictEqual(result.error, 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
    });

    it('should continue if InsForge returns a db error', async () => {
        process.env.RESEND_API_KEY = 'test_resend_key';
        process.env.NEXT_PUBLIC_INSFORGE_URL = 'test_insforge_url';
        process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY = 'test_insforge_anon';

        // Mock a DB error without throwing an exception
        insertMock.mock.mockImplementationOnce(() => ({ error: { message: 'DB Error' } }));

        const result = await submitLead(mockFormData);

        assert.strictEqual(result.success, true);
        assert.strictEqual(insertMock.mock.calls.length, 1);
    });
});
