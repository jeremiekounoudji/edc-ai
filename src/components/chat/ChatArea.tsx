import React from "react";
import { ActionCards } from "./ActionCards";
import { InputBar } from "./InputBar";
import { ChatBubble } from "./ChatBubble";
import { Button } from "@heroui/button";
import { FiArrowLeft } from "react-icons/fi";
import { ChatMessage } from "../../lib/types/chat";
import { Project } from "../../lib/types/project";
import { Conversation } from "../../lib/types/conversation";
import { useChatInfiniteScroll } from "../../hooks/useInfiniteScroll";

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
  selectedConversation?: Conversation | null;
  onBack?: () => void;
  error?: string | null;
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
  selectedConversation,
  onBack,
  error = null,
}: ChatAreaProps) {
  const hasMessages = messages.length > 0;

  const { containerRef, scrollToBottom } = useChatInfiniteScroll({
    hasMore: hasMoreMessages,
    isLoading,
    onLoadMore: onLoadMoreMessages || (() => {}),
  });

  return (
    <div className="flex flex-col h-full relative chat-area-mobile">
      {/* Conversation Header */}
     {selectedConversation && onBack && (
         <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <FiArrowLeft className="h-4 w-4" />
              </Button>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-40 min-h-0">
        {!hasMessages ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full px-2 sm:px-4 py-6 sm:py-8 overflow-y-auto">
            <div className="text-center max-w-2xl w-full">
              {selectedConversation ? (
                <>
                  {/* Back Button */}
                  {/* {onBack && (
                    <div className="flex justify-start mb-4">
                      <Button
                        variant="ghost"
                        startContent={<FiArrowLeft className="h-4 w-4" />}
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Back to Project
                      </Button>
                    </div>
                  )} */}
                  {/* Conversation Details */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {selectedConversation.title}
                  </h1>
                  {selectedConversation.description && (
                    <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                      {selectedConversation.description}
                    </p>
                  )}
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
                    Start chatting or choose one of the quick actions below to
                    get started.
                  </p>
                  {/* Action Cards Grid for Conversation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
                    <ActionCards
                      type="conversation"
                      onActionCardClick={onActionCardClick}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* General Welcome */}
                  <h1 className="text-2xl mt-[100px]  sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                    Welcome to EDC-AI
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
                   The best procurement and reporting AI powered by Bandesoft LTD
                  </p>
                  
                  {/* Project Selection Message */}
                  {!selectedProject && (
                    <div className="bg-muted/50 rounded-lg p-4 my-5 mx-4">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        To start chatting, please create or select a project
                      </p>
                      {/* Mobile Project Selection Button */}
                      <div className="lg:hidden flex justify-center">
                        <Button
                          color="primary"
                          variant="solid"
                          size="sm"
                          onClick={() => {
                            // Trigger mobile right menu open
                            const event = new CustomEvent('openMobileProjectMenu');
                            window.dispatchEvent(event);
                          }}
                          className="text-sm"
                        >
                          Select Project
                        </Button>
                      </div>
                    </div>
                  )}
                 
                  
                  {/* Action Cards Grid for General */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
                    <ActionCards
                      type="general"
                      onActionCardClick={onActionCardClick}
                    />
                  </div>
                </>
              )}
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
                  {isLoading ? "Loading..." : "Load more messages"}
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
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      In Thinking Mode...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex justify-start px-3 sm:px-4">
                <div className="bg-danger/10 border border-danger/20 rounded-2xl px-3 sm:px-4 py-3 max-w-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-danger font-medium">
                      Error:
                    </span>
                    <span className="text-sm text-danger">{error}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Input Bar */}
      {/* selectedProject ||  */}
      {selectedConversation && (<div className="absolute bottom-0 left-0 right-0 z-40 p-2 sm:p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <InputBar
            onSendMessage={onSendMessage}
            onAttachFile={onAttachFile}
            onVoiceMessage={onVoiceMessage}
            onBrowsePrompts={onBrowsePrompts}
            placeholder="Type a message or ask about procurement, compliance, analytics…"
            maxLength={3000}
            disabled={isLoading}
          />

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground mt-1 text-center">
            EDC AI Powered by bandesoft Version 1.3.
          </p>
        </div>
      </div>)}
      
    </div>
  );
}
