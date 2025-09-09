import React from 'react';
import { ActionCards } from './ActionCards';
import { InputBar } from './InputBar';
import { ChatBubble } from './ChatBubble';
import { ChatMessage } from '../../lib/types/chat';
import { useChatInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface ChatAreaProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onActionCardClick?: (prompt: string) => void;
  onAttachFile?: () => void;
  onVoiceMessage?: () => void;
  onBrowsePrompts?: () => void;
  isLoading?: boolean;
  hasMoreMessages?: boolean;
  onLoadMoreMessages?: () => void;
}

export function ChatArea({
  messages = [],
  onSendMessage,
  onActionCardClick,
  onAttachFile,
  onVoiceMessage,
  onBrowsePrompts,
  isLoading = false,
  hasMoreMessages = false,
  onLoadMoreMessages,
}: ChatAreaProps) {
  const hasMessages = messages.length > 0;
  
  const { containerRef, scrollToBottom } = useChatInfiniteScroll({
    hasMore: hasMoreMessages,
    isLoading,
    onLoadMore: onLoadMoreMessages || (() => {}),
  });

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full px-4 py-8">
            <div className="text-center max-w-2xl">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to Script
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Get started by Script a task and Chat can do the rest. Not sure where to start?
              </p>
              
              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ActionCards onActionCardClick={onActionCardClick} />
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */}
          <div 
            ref={containerRef}
            className="flex flex-col space-y-4 p-4 overflow-y-auto"
          >
            {/* Load More Button */}
            {hasMoreMessages && (
              <div className="flex justify-center py-4">
                <button
                  onClick={onLoadMoreMessages}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load more messages'}
                </button>
              </div>
            )}
            
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isStreaming={message.isStreaming}
              />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="border-t border-border bg-background p-4">
        <InputBar
          onSendMessage={onSendMessage}
          onAttachFile={onAttachFile}
          onVoiceMessage={onVoiceMessage}
          onBrowsePrompts={onBrowsePrompts}
          placeholder="Summarize the latest..."
          maxLength={3000}
        />
        
        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3.
        </p>
      </div>
    </div>
  );
}
