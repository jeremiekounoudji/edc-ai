import { useState, useCallback, useRef } from 'react';
import { ChatState, ChatMessage, ChatSession, StreamingResponse } from '../lib/types/chat';
import { generateId, formatDate } from '../lib/utils/common';
import { aiService } from '../lib/services/aiService';
import { logDebug, logInfo, logError, logAI, logWarn } from '../lib/utils/logger';
import { showToast } from '../lib/utils/toast';

const initialState: ChatState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
};

export function useChat() {
  const [state, setState] = useState<ChatState>(initialState);
  const streamingHandlerRef = useRef<AbortController | null>(null);

  // Create a new chat session
  const createSession = useCallback((title?: string) => {
    logDebug('Creating new chat session', { title });
    
    const newSession: ChatSession = {
      id: generateId(),
      title: title || `Chat ${formatDate(new Date())}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      currentSession: newSession,
      sessions: [newSession, ...prev.sessions],
    }));

    logInfo('Chat session created', { sessionId: newSession.id, title: newSession.title });
    return newSession;
  }, []);

  // Send a message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) {
      logDebug('Skipping sendMessage - empty content', { 
        contentLength: content.length 
      });
      return;
    }

    // Create a session if one doesn't exist
    let session = state.currentSession;
    if (!session) {
      logDebug('No current session, creating new session');
      session = createSession();
      logInfo('New session created for message sending', { sessionId: session.id });
    }

    logDebug('Sending message', { 
      sessionId: session.id, 
      messageLength: content.length 
    });

    const userMessage: ChatMessage = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const assistantMessage: ChatMessage = {
      id: generateId(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      // Remove streaming flag since we're not streaming anymore
    };

    // Add user message immediately
    setState(prev => ({
      ...prev,
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        messages: [...prev.currentSession.messages, userMessage],
        updatedAt: new Date(),
      } : null,
      isLoading: true,
      error: null,
    }));

    // Add assistant message placeholder
    setState(prev => ({
      ...prev,
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        messages: [...prev.currentSession.messages, assistantMessage],
      } : null,
    }));

    try {
      logAI('Calling AI service for message response', { 
        sessionId: session.id, 
        messageId: userMessage.id 
      });
      
      // Call the actual AI service (non-streaming)
      const response = await aiService.sendMessage(content, session.id, 'user-id');
      
      logDebug('AI service response received', { 
        sessionId: session.id, 
        responseAvailable: !!response 
      });
      
      // Update the assistant message with the full response
      setState(prev => ({
        ...prev,
        currentSession: prev.currentSession ? {
          ...prev.currentSession,
          messages: prev.currentSession.messages.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: response, isStreaming: false }
              : msg
          ),
        } : null,
        isLoading: false,
      }));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      logError('Failed to send message', { 
        sessionId: session.id, 
        error: errorMessage 
      });
      
      // Show error to user
      showToast.error(errorMessage);
      
      // Stop thinking mode by setting isLoading to false and removing the placeholder message
      setState(prev => ({
        ...prev,
        currentSession: prev.currentSession ? {
          ...prev.currentSession,
          messages: prev.currentSession.messages.filter(msg => msg.id !== assistantMessage.id),
        } : null,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [state.currentSession, createSession]);

  // Load a session
  const loadSession = useCallback((sessionId: string) => {
    logDebug('Loading session', { sessionId });
    
    const session = state.sessions.find(s => s.id === sessionId);
    if (session) {
      setState(prev => ({
        ...prev,
        currentSession: session,
      }));
      
      logInfo('Session loaded', { sessionId });
    } else {
      logWarn('Session not found', { sessionId });
    }
  }, [state.sessions]);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    logDebug('Deleting session', { sessionId });
    
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== sessionId),
      currentSession: prev.currentSession?.id === sessionId ? null : prev.currentSession,
    }));
    
    logInfo('Session deleted', { sessionId });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    logDebug('Clearing error state');
    
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    createSession,
    sendMessage,
    loadSession,
    deleteSession,
    clearError,
  };
}