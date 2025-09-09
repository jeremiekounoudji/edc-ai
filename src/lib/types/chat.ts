export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}

export interface ActionCard {
  id: string;
  title: string;
  description: string;
  color: 'orange' | 'blue' | 'green' | 'pink';
  icon: string;
  prompt: string;
}

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
}

export interface StreamingResponse {
  content: string;
  isComplete: boolean;
  error?: string;
}
