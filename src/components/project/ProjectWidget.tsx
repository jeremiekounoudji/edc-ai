"use client";

import React, { useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { FiPlus, FiMessageCircle, FiCalendar } from "react-icons/fi";
import { Project } from "@/lib/types/project";
import { Conversation } from "@/lib/types/conversation";
import { formatRelativeTime } from "@/lib/utils/common";
import { useConversations } from "@/hooks/useConversations";
import { ConversationList } from "./ConversationList";
import { CreateConversationModal } from "./CreateConversationModal";
import { ChatArea } from "@/components/chat/ChatArea";
import { useMessages } from "@/hooks/useMessages";
import { ChatMessage } from "@/lib/types/chat";
import { useAuthStore } from "@/store/useAuthStore";

interface ProjectWidgetProps {
  project: Project;
  onClose?: () => void;
}

export function ProjectWidget({ project, onClose }: ProjectWidgetProps) {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuthStore();
  const { conversations, createConversation, isLoading } = useConversations(
    project.id
  );
  const {
    messages,
    sendMessage,
    isLoading: messagesLoading,
  } = useMessages(selectedConversation?.id || null);

  const handleCreateConversation = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      const newConversation = await createConversation(data);
      setSelectedConversation(newConversation);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isSending || !selectedConversation) return;

    setIsSending(true);

    try {
      await sendMessage({
        sender: "user",
        content: messageContent,
        sender_id: user?.id || '',
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionCardClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Transform messages to ChatMessage format
  const chatMessages: ChatMessage[] = messages.map((message) => ({
    id: message.id,
    content: message.content,
    role: message.sender === "user" ? "user" : "assistant",
    timestamp: new Date(message.created_at),
  }));

  if (selectedConversation) {
    return (
      <div className="h-full">
        <ChatArea
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onActionCardClick={handleActionCardClick}
          isLoading={messagesLoading || isSending}
          selectedConversation={selectedConversation}
          onBack={handleBackToConversations}
          hasMoreMessages={false}
          onLoadMoreMessages={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between w-full">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {project.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {project.description}
              </p>
            </div>
            {onClose && (
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-2"
              >
                ×
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FiCalendar className="h-4 w-4" />
              <span>Updated {formatRelativeTime(project.updatedAt)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FiMessageCircle className="h-4 w-4" />
              <span>{conversations.length} conversations</span>
            </div>
          </div>

        </CardBody>
        <CardFooter className="pt-0">
           <div className="mb-4 flex items-center">
        <Button
          color="primary"
          startContent={<FiPlus className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
          className="w-full max-w-xl"
        >
          New Conversation
        </Button>
      </div>

         </CardFooter>
      </Card>

      {/* Create Conversation Button */}
     

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        <ConversationList
          conversations={conversations}
          isLoading={isLoading}
          onConversationSelect={handleConversationSelect}
        />
      </div>

      {/* Create Conversation Modal */}
      <CreateConversationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateConversation}
      />
    </div>
  );
}
