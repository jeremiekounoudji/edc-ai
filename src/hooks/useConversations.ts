import useSWR from 'swr';
import { Conversation, CreateConversationData } from '@/lib/types/conversation';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (res.status === 401) {
    return [];
  }
  
  if (!res.ok) {
    throw new Error('Failed to fetch conversations');
  }
  
  return res.json();
};

export function useConversations(projectId: string | null) {
  const { data, error, mutate } = useSWR(
    projectId ? `/api/projects/${projectId}/conversations` : null,
    fetcher
  );

  const createConversation = async (conversationData: CreateConversationData) => {
    if (!projectId) throw new Error('Project ID is required');
    
    const res = await fetch(`/api/projects/${projectId}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversationData),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create conversation');
    }
    
    const newConversation = await res.json();
    mutate();
    return newConversation;
  };

  const conversations: Conversation[] = Array.isArray(data) ? data : [];

  return {
    conversations,
    isLoading: !data && !error,
    isError: error,
    createConversation,
    mutate,
  };
}