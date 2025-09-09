"use client";

import { MainLayout } from '../components/layout/MainLayout';
import { ChatArea } from '../components/chat/ChatArea';
import { useChat } from '../hooks/useChat';
import { useState } from 'react';

export default function Home() {
  const {
    currentConversation,
    messages,
    isLoading,
    isStreaming,
    startNewChat,
    sendMessage,
    addMessage,
  } = useChat();

  const [showBrowsePrompts, setShowBrowsePrompts] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const handleActionCardClick = (prompt: string) => {
    // Auto-populate the input with the selected prompt
    // This would typically be handled by the InputBar component
    // For now, we'll just send the message directly
    sendMessage(prompt);
  };

  const handleAttachFile = () => {
    // TODO: Implement file attachment functionality
    // This would open a file picker and handle file uploads
  };

  const handleVoiceMessage = () => {
    // TODO: Implement voice message functionality
    // This would start voice recording and convert to text
  };

  const handleBrowsePrompts = () => {
    setShowBrowsePrompts(true);
  };

  return (
    <MainLayout>
      <ChatArea
        messages={messages}
        onSendMessage={sendMessage}
        onActionCardClick={handleActionCardClick}
        onAttachFile={handleAttachFile}
        onVoiceMessage={handleVoiceMessage}
        onBrowsePrompts={handleBrowsePrompts}
        isLoading={isLoading}
        hasMoreMessages={false}
        onLoadMoreMessages={() => {}}
      />
    </MainLayout>
  );
}