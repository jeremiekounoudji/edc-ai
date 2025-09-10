import React, { useEffect, useState } from 'react';
import { ChatMessage } from '../../lib/types/chat';
import { FiUser, FiMessageSquare } from 'react-icons/fi';
import { formatDate } from '../../lib/utils/common';

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  streamingContent?: string;
}

export function ChatBubble({ message, isStreaming = false, streamingContent }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const [displayContent, setDisplayContent] = useState(message.content);

  // Update display content when streaming content changes
  useEffect(() => {
    if (streamingContent !== undefined) {
      setDisplayContent(streamingContent);
    } else {
      setDisplayContent(message.content);
    }
  }, [streamingContent, message.content]);

  // Streaming animation effect
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setDisplayContent(prev => {
          // Add a subtle animation effect for streaming
          return prev;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {isUser ? (
              <FiUser className="h-4 w-4" />
            ) : (
              <FiMessageSquare className="h-4 w-4" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`rounded-2xl px-4 py-3 transition-all duration-200 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-muted-foreground rounded-bl-md'
          } ${isStreaming ? 'shadow-sm' : ''}`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {displayContent}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-muted-foreground mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatDate(message.timestamp)}
            {isStreaming && (
              <span className="ml-2 text-xs text-muted-foreground">
                • Typing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
