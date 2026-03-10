import { test, describe, mock, afterEach } from 'node:test';
import assert from 'node:assert';

describe('chat-api: saveChatMessage', () => {
    let getInsForgeMock: any;
    let saveChatMessage: any;

    afterEach(() => {
        mock.restoreAll();
    });

    test('should insert chat message successfully when client is initialized', async () => {
        // Arrange
        const insertMock = mock.fn(async () => ({ error: null }));
        const fromMock = mock.fn(() => ({ insert: insertMock }));

        const mockClient = {
            database: {
                from: fromMock
            }
        };

        const proxyquire = require('proxyquire').noCallThru();

        getInsForgeMock = mock.fn(() => mockClient);

        const module = proxyquire('./chat-api.ts', {
            '@/lib/insforge': {
                getInsForge: getInsForgeMock
            }
        });
        saveChatMessage = module.saveChatMessage;

        const sessionId = 'test-session-id';
        const role = 'user';
        const content = 'Hello, world!';

        // Act
        await saveChatMessage(sessionId, role, content);

        // Assert
        assert.strictEqual(getInsForgeMock.mock.callCount(), 1);
        assert.strictEqual(fromMock.mock.callCount(), 1);
        assert.deepStrictEqual(fromMock.mock.calls[0].arguments, ['chat_messages']);

        assert.strictEqual(insertMock.mock.callCount(), 1);
        assert.deepStrictEqual(insertMock.mock.calls[0].arguments, [[{
            session_id: sessionId,
            role,
            content
        }]]);
    });

    test('should return null early when InsForge client is not initialized', async () => {
        // Arrange
        const proxyquire = require('proxyquire').noCallThru();

        getInsForgeMock = mock.fn(() => null);

        const module = proxyquire('./chat-api.ts', {
            '@/lib/insforge': {
                getInsForge: getInsForgeMock
            }
        });
        saveChatMessage = module.saveChatMessage;

        const sessionId = 'test-session-id';
        const role = 'user';
        const content = 'Hello, world!';

        // Act
        const result = await saveChatMessage(sessionId, role, content);

        // Assert
        assert.strictEqual(getInsForgeMock.mock.callCount(), 1);
        assert.strictEqual(result, null);
    });

    test('should console.error when database insert returns an error', async () => {
        // Arrange
        const expectedError = new Error('Database insert failed');
        const insertMock = mock.fn(async () => ({ error: expectedError }));
        const fromMock = mock.fn(() => ({ insert: insertMock }));

        const mockClient = {
            database: {
                from: fromMock
            }
        };

        const proxyquire = require('proxyquire').noCallThru();

        getInsForgeMock = mock.fn(() => mockClient);

        const module = proxyquire('./chat-api.ts', {
            '@/lib/insforge': {
                getInsForge: getInsForgeMock
            }
        });
        saveChatMessage = module.saveChatMessage;

        const consoleErrorMock = mock.method(console, 'error', () => {});

        const sessionId = 'test-session-id';
        const role = 'assistant';
        const content = 'Test response';

        // Act
        await saveChatMessage(sessionId, role, content);

        // Assert
        assert.strictEqual(getInsForgeMock.mock.callCount(), 1);
        assert.strictEqual(fromMock.mock.callCount(), 1);
        assert.strictEqual(insertMock.mock.callCount(), 1);

        assert.strictEqual(consoleErrorMock.mock.callCount(), 1);
        assert.strictEqual(consoleErrorMock.mock.calls[0].arguments[0], 'Error saving message:');
        assert.strictEqual(consoleErrorMock.mock.calls[0].arguments[1], expectedError);
    });
});
