import test from 'node:test';
import assert from 'node:assert';
import { getOrCreateSessionCookie } from './chat-api';

test('getOrCreateSessionCookie', async (t) => {
    t.beforeEach(() => {
        // Clear global mocks before each test
        delete (global as any).window;
        delete (global as any).localStorage;
    });

    await t.test('returns empty string when window is undefined', () => {
        const cookie = getOrCreateSessionCookie();
        assert.strictEqual(cookie, '');
    });

    await t.test('returns existing cookie from localStorage', () => {
        const store = new Map<string, string>();
        store.set('nexo_chat_session_cookie', 'existing-cookie-123');

        global.window = {} as any;
        global.localStorage = {
            getItem: (key: string) => store.get(key) || null,
            setItem: (key: string, value: string) => store.set(key, value),
        } as any;

        const cookie = getOrCreateSessionCookie();
        assert.strictEqual(cookie, 'existing-cookie-123');
    });

    await t.test('creates and returns new cookie if none exists in localStorage', () => {
        const store = new Map<string, string>();

        global.window = {} as any;
        global.localStorage = {
            getItem: (key: string) => store.get(key) || null,
            setItem: (key: string, value: string) => store.set(key, value),
        } as any;

        const cookie = getOrCreateSessionCookie();

        // Assert it generated a non-empty string
        assert.ok(cookie.length > 0, 'Should generate a non-empty cookie');

        // Assert it was saved to localStorage
        assert.strictEqual(store.get('nexo_chat_session_cookie'), cookie, 'Should store the cookie in localStorage');

        // Call it again to make sure it returns the same cookie (since we mock localStorage behavior)
        const cookie2 = getOrCreateSessionCookie();
        assert.strictEqual(cookie2, cookie, 'Should return the same cookie on subsequent calls');
    });
});
