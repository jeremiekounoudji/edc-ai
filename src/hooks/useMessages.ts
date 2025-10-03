import useSWR from "swr";
import { Message, CreateMessageData } from "@/lib/types/conversation";
import { aiService } from "@/lib/services/aiService";
import { logDebug, logInfo, logError, logAI } from "@/lib/utils/logger";
import { showToast } from "@/lib/utils/toast";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (res.status === 401) {
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
};

export function useMessages(conversationId: string | null) {
  const { data, error, mutate } = useSWR(
    conversationId ? `/api/conversations/${conversationId}/messages` : null,
    fetcher
  );

  const sendMessage = async (messageData: CreateMessageData) => {
    if (!conversationId) throw new Error("Conversation ID is required");

    logDebug("Sending message to conversation", { 
      conversationId, 
      messageLength: messageData.content.length 
    });

    // Send user message first
    const userRes = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...messageData,"sessionId":conversationId}),
    });

    if (!userRes.ok) {
      throw new Error("Failed to send message");
    }

    const userMessage = await userRes.json();
    mutate(); // Refresh messages to show user message

    // If it's a user message, get AI response
    if (messageData.sender === 'user') {
      try {
        logAI('Calling AI service for conversation response', { 
          conversationId, 
          userMessageId: userMessage.id 
        });
        
        // Call the AI service
        const aiResponse = await aiService.sendMessage(messageData.content,

          conversationId,messageData.sender_id);
        
        logDebug('AI service response received', { 
          conversationId, 
          responseAvailable: !!aiResponse 
        });
        
        // // Send AI response as assistant message
        // const assistantRes = await fetch(`/api/conversations/${conversationId}/messages`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     sender: 'assistant',
        //     content: aiResponse,
        //   }),
        // });

        // if (!assistantRes.ok) {
        //   logError('Failed to send AI response', { conversationId });
        //   showToast.error('Failed to get AI response');
        // } else {
        //   logInfo('AI response sent successfully', { conversationId });
        // }

        mutate(); // Refresh messages to show AI response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response';
        
        logError('Failed to get AI response', { 
          conversationId, 
          error: errorMessage 
        });
        
        showToast.error(errorMessage);
      }
    }

    return userMessage;
  };

  const messages: Message[] = Array.isArray(data) ? data : [];

  return {
    messages,
    isLoading: !data && !error,
    isError: error,
    sendMessage,
    mutate,
  };
}
