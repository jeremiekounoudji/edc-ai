import React from 'react';
import { ActionCards } from './ActionCards';
import { InputBar } from './InputBar';
import { ChatBubble } from './ChatBubble';
import { ChatMessage } from '../../lib/types/chat';
import { Project } from '../../lib/types/project';
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
  selectedProject?: Project | null;
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
  selectedProject,
}: ChatAreaProps) {
  const hasMessages = messages.length > 0;
  
  const { containerRef, scrollToBottom } = useChatInfiniteScroll({
    hasMore: hasMoreMessages,
    isLoading,
    onLoadMore: onLoadMoreMessages || (() => {}),
  });

  return (
    <div className="flex flex-1 flex-col h-full relative">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {!hasMessages ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full px-4 py-6 sm:py-8">
            <div className="text-center max-w-2xl w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Welcome to Script
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                Get started by Script a task and Chat can do the rest. Not sure where to start?
              </p>
              
              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
                <ActionCards onActionCardClick={onActionCardClick} />
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div 
            ref={containerRef}
            className="flex flex-col space-y-3 sm:space-y-4 p-3 sm:p-4 overflow-y-auto"
          >
            {/* Load More Button */}
            {hasMoreMessages && (
              <div className="flex justify-center py-3 sm:py-4">
                <button
                  onClick={onLoadMoreMessages}
                  disabled={isLoading}
                  className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
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
              <div className="flex justify-start px-3 sm:px-4">
                <div className="bg-muted rounded-2xl px-3 sm:px-4 py-3 max-w-xs">
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

      {/* Floating Input Bar */}
      <div className="absolute bottom-0 left-0 bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 right-0 z-40 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <InputBar
            onSendMessage={onSendMessage}
            onAttachFile={onAttachFile}
            onVoiceMessage={onVoiceMessage}
            onBrowsePrompts={onBrowsePrompts}
            placeholder="Type a message or ask about procurement, compliance, analytics…"
            maxLength={3000}
          />
          
          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Script may generate inaccurate information about people, places, or facts. Model: Script AI v1.3.
          </p>
        </div>
      </div>
    </div>
  );
}
