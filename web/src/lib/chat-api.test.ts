import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startOrResumeChatSession, getOrCreateSessionCookie } from './chat-api';
import * as insforgeModule from './insforge';

// Mock getInsForge
vi.mock('./insforge', () => ({
  getInsForge: vi.fn(),
}));

// Mock uuid to have a predictable session cookie if not in localStorage
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}));

describe('chat-api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getOrCreateSessionCookie', () => {
    it('generates a new cookie if none exists and saves it to localStorage', () => {
      const cookie = getOrCreateSessionCookie();
      expect(cookie).toBe('mock-uuid-1234');
      expect(localStorage.getItem('nexo_chat_session_cookie')).toBe('mock-uuid-1234');
    });

    it('returns existing cookie from localStorage', () => {
      localStorage.setItem('nexo_chat_session_cookie', 'existing-cookie');
      const cookie = getOrCreateSessionCookie();
      expect(cookie).toBe('existing-cookie');
    });
  });

  describe('startOrResumeChatSession', () => {
    it('throws error if InsForge client is not initialized', async () => {
      vi.mocked(insforgeModule.getInsForge).mockReturnValue(null);

      await expect(startOrResumeChatSession('test_skill')).rejects.toThrow(
        'InsForge client not initialized.'
      );
    });

    it('returns existing session ID if an active session is found', async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: { id: 'existing-session-id' },
        error: null,
      });
      const mockLimit = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockEqEstado = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEqSkill = vi.fn().mockReturnValue({ eq: mockEqEstado });
      const mockEqCookie = vi.fn().mockReturnValue({ eq: mockEqSkill });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqCookie });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(insforgeModule.getInsForge).mockReturnValue({
        database: {
          from: mockFrom,
        },
      } as any);

      // Setup an existing cookie
      localStorage.setItem('nexo_chat_session_cookie', 'my-cookie');

      const sessionId = await startOrResumeChatSession('test_skill');

      expect(sessionId).toBe('existing-session-id');
      expect(mockFrom).toHaveBeenCalledWith('chat_sessions');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEqCookie).toHaveBeenCalledWith('session_cookie', 'my-cookie');
      expect(mockEqSkill).toHaveBeenCalledWith('skill_origin', 'test_skill');
      expect(mockEqEstado).toHaveBeenCalledWith('estado_conversacion', 'active');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockLimit).toHaveBeenCalledWith(1);
    });

    it('creates and returns a new session ID if no active session exists', async () => {
      // Mock for checking existing session (returns null data)
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const mockLimit = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockEqEstado = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEqSkill = vi.fn().mockReturnValue({ eq: mockEqEstado });
      const mockEqCookie = vi.fn().mockReturnValue({ eq: mockEqSkill });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqCookie });

      // Mock for creating new session
      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: 'new-session-id' },
        error: null,
      });
      const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

      // The 'from' method needs to return the right chain based on whether it's
      // followed by .select() (read) or .insert() (write).
      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
        insert: mockInsert,
      });

      vi.mocked(insforgeModule.getInsForge).mockReturnValue({
        database: {
          from: mockFrom,
        },
      } as any);

      localStorage.setItem('nexo_chat_session_cookie', 'my-cookie');

      const sessionId = await startOrResumeChatSession('test_skill');

      expect(sessionId).toBe('new-session-id');
      expect(mockInsert).toHaveBeenCalledWith([{
        session_cookie: 'my-cookie',
        skill_origin: 'test_skill',
        estado_conversacion: 'active'
      }]);
    });

    it('throws error if creating a new session fails', async () => {
      // Mock for checking existing session
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      const mockLimit = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockEqEstado = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEqSkill = vi.fn().mockReturnValue({ eq: mockEqEstado });
      const mockEqCookie = vi.fn().mockReturnValue({ eq: mockEqSkill });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEqCookie });

      // Mock for failing insert
      const mockError = new Error('Database insert failed');
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });
      const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
        insert: mockInsert,
      });

      vi.mocked(insforgeModule.getInsForge).mockReturnValue({
        database: {
          from: mockFrom,
        },
      } as any);

      // spy on console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(startOrResumeChatSession('test_skill')).rejects.toThrow('Database insert failed');

      expect(consoleSpy).toHaveBeenCalledWith("Error creating chat session:", mockError);

      consoleSpy.mockRestore();
    });
  });
});
