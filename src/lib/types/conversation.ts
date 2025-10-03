export interface Conversation {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant';
  content: string;
  file_url?: string;
  created_at: string | Date;
}

export interface CreateConversationData {
  title: string;
  description?: string;
}

export interface CreateMessageData {
  sender: 'user' | 'assistant';
  content: string;
  sender_id: string;
  file_url?: string;
}