"use client";

import { MainLayout } from '../../components/layout/MainLayout';
import { ChatArea } from '../../components/chat/ChatArea';
import { ProjectManager } from '../../components/project/ProjectManager';
import { useChat } from '../../hooks/useChat';
import { useProjects } from '../../hooks/useProject';
import { useState } from 'react';
import { Project } from '../../lib/types/project';
import { ChatMessage } from '../../lib/types/chat';

export default function ChatPage() {
  const {
    currentSession,
    sessions,
    isLoading,
    error,
    createSession,
    sendMessage,
    loadSession,
    deleteSession,
    clearError,
  } = useChat();

  const [showBrowsePrompts, setShowPrompts] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects } = useProjects();

  const handleActionCardClick = (prompt: string) => {
    console.log('Action card clicked with prompt:', prompt);
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
    setShowPrompts(true);
  };

  const handleProjectSelect = (projectId: string) => {
    // Find the project by ID from real API data
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
    }
  };

  const handleProjectDeselect = () => {
    setSelectedProject(null);
  };

  // Use current session messages for the general chat
  const displayMessages = currentSession?.messages || [];

  console.log('ChatPage render', { 
    hasSession: !!currentSession, 
    messageCount: displayMessages.length,
    sendMessageFunction: typeof sendMessage 
  });

  return (
    <MainLayout 
      onProjectSelect={handleProjectSelect}
      currentTitle={selectedProject?.title || "EDC AI"}
      
    >
      {selectedProject ? (
        <ProjectManager 
          selectedProject={selectedProject}
          onProjectDeselect={handleProjectDeselect}
        />
      ) : (
        <ChatArea
          messages={displayMessages}
          onSendMessage={sendMessage}
          onActionCardClick={handleActionCardClick}
          onAttachFile={handleAttachFile}
          onVoiceMessage={handleVoiceMessage}
          onBrowsePrompts={handleBrowsePrompts}
          isLoading={isLoading}
          error={error}
          hasMoreMessages={false}
          onLoadMoreMessages={() => {}}
          selectedProject={selectedProject}
        />
      )}
    </MainLayout>
  );
}