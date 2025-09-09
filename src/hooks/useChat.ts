import { useState, useCallback, useRef } from 'react';
import { ChatState, ChatMessage, ChatSession, StreamingResponse } from '../lib/types/chat';
import { createStreamingHandler, debounceStreamingUpdate } from '../lib/utils/streaming';
import { generateId, formatDate } from '../lib/utils/common';

const initialState: ChatState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
};

export function useChat() {
  const [state, setState] = useState<ChatState>(initialState);
  const streamingHandlerRef = useRef<any>(null);

  // Create a new chat session
  const createSession = useCallback((title?: string) => {
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

    return newSession;
  }, []);

  // Send a message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!state.currentSession || !content.trim()) return;

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
      isStreaming: true,
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
      // Simulate AI response (replace with actual AI service call)
      const response = await simulateAIResponse(content);
      
      // Create streaming handler
      const debouncedUpdate = debounceStreamingUpdate((streamingContent: string) => {
        setState(prev => ({
          ...prev,
          currentSession: prev.currentSession ? {
            ...prev.currentSession,
            messages: prev.currentSession.messages.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: streamingContent }
                : msg
            ),
          } : null,
        }));
      });

      streamingHandlerRef.current = createStreamingHandler(
        debouncedUpdate,
        () => {
          // Mark streaming as complete
          setState(prev => ({
            ...prev,
            currentSession: prev.currentSession ? {
              ...prev.currentSession,
              messages: prev.currentSession.messages.map(msg =>
                msg.id === assistantMessage.id
                  ? { ...msg, isStreaming: false }
                  : msg
              ),
            } : null,
            isLoading: false,
          }));
        },
        (error: string) => {
          setState(prev => ({
            ...prev,
            error,
            isLoading: false,
          }));
        }
      );

      // Start streaming
      await streamingHandlerRef.current.streamText(response);

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message',
        isLoading: false,
      }));
    }
  }, [state.currentSession]);

  // Load a session
  const loadSession = useCallback((sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (session) {
      setState(prev => ({
        ...prev,
        currentSession: session,
      }));
    }
  }, [state.sessions]);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== sessionId),
      currentSession: prev.currentSession?.id === sessionId ? null : prev.currentSession,
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Simulate AI response (replace with actual AI service)
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response simulation
    const responses = [
      `I understand you're asking about: "${userMessage}". Let me help you with that.`,
      `That's an interesting question about "${userMessage}". Here's what I can tell you...`,
      `Regarding "${userMessage}", I can provide some insights and recommendations.`,
      `I see you're interested in "${userMessage}". Let me share some thoughts on this topic.`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return {
    ...state,
    createSession,
    sendMessage,
    loadSession,
    deleteSession,
    clearError,
  };
}
