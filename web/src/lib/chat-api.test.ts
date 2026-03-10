import { startOrResumeChatSession } from './chat-api';
import { getInsForge } from '@/lib/insforge';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies
jest.mock('@/lib/insforge', () => ({
  getInsForge: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

describe('startOrResumeChatSession', () => {
  let mockDatabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Setup mock chain for Supabase database operations
    mockDatabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn()
    };
  });

  it('throws an error if InsForge client is not initialized', async () => {
    (getInsForge as jest.Mock).mockReturnValue(null);

    await expect(startOrResumeChatSession('test-skill')).rejects.toThrow('InsForge client not initialized.');
  });

  it('returns existing session id if an active session exists', async () => {
    const existingSessionId = 'existing-session-123';

    mockDatabase.maybeSingle.mockResolvedValueOnce({
      data: { id: existingSessionId },
      error: null
    });

    (getInsForge as jest.Mock).mockReturnValue({
      database: mockDatabase
    });

    const result = await startOrResumeChatSession('test-skill');

    expect(result).toBe(existingSessionId);
    expect(mockDatabase.from).toHaveBeenCalledWith('chat_sessions');
    expect(mockDatabase.select).toHaveBeenCalledWith('*');
    expect(mockDatabase.eq).toHaveBeenCalledWith('skill_origin', 'test-skill');
    expect(mockDatabase.eq).toHaveBeenCalledWith('estado_conversacion', 'active');
  });

  it('creates and returns a new session id if no active session exists', async () => {
    const newSessionId = 'new-session-456';
    const mockCookie = 'mock-cookie-789';

    (uuidv4 as jest.Mock).mockReturnValue(mockCookie);

    // First call (maybeSingle) returns no existing session
    mockDatabase.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null
    });

    // Second call (single) returns newly inserted session
    mockDatabase.single.mockResolvedValueOnce({
      data: { id: newSessionId },
      error: null
    });

    (getInsForge as jest.Mock).mockReturnValue({
      database: mockDatabase
    });

    const result = await startOrResumeChatSession('test-skill');

    expect(result).toBe(newSessionId);
    expect(mockDatabase.insert).toHaveBeenCalledWith([{
      session_cookie: mockCookie,
      skill_origin: 'test-skill',
      estado_conversacion: 'active'
    }]);
  });

  it('throws an error if creating a new session fails', async () => {
    const mockCookie = 'mock-cookie-789';
    const mockError = new Error('Database insert failed');

    (uuidv4 as jest.Mock).mockReturnValue(mockCookie);

    // First call (maybeSingle) returns no existing session
    mockDatabase.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null
    });

    // Second call (single) returns an error
    mockDatabase.single.mockResolvedValueOnce({
      data: null,
      error: mockError
    });

    (getInsForge as jest.Mock).mockReturnValue({
      database: mockDatabase
    });

    await expect(startOrResumeChatSession('test-skill')).rejects.toThrow('Database insert failed');
    expect(mockDatabase.insert).toHaveBeenCalled();
  });
});
