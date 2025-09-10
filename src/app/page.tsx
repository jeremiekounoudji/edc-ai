"use client";

import { MainLayout } from '../components/layout/MainLayout';
import { ChatArea } from '../components/chat/ChatArea';
import { useChat } from '../hooks/useChat';
import { useState } from 'react';
import { Project } from '../lib/types/project';
import { ChatMessage } from '../lib/types/chat';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectMessages, setProjectMessages] = useState<ChatMessage[]>([]);

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

  const handleProjectSelect = (projectId: string) => {
    // Find the project by ID
    const project = getProjectById(projectId);
    if (project) {
      setSelectedProject(project);
      // Load messages for this project
      const messages = getProjectMessages(projectId);
      setProjectMessages(messages);
    }
  };

  const getProjectById = (projectId: string): Project | null => {
    // Mock function - in real app, this would fetch from API
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Procurement Analytics Dashboard',
        description: 'Comprehensive dashboard for tracking procurement metrics, supplier performance, and cost analysis across all departments.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        chatSessions: ['session1', 'session2'],
      },
      {
        id: '2',
        title: 'Supplier Compliance Review',
        description: 'Quarterly review of supplier compliance with regulatory requirements and quality standards.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        chatSessions: ['session3'],
      },
      // Add more projects as needed
    ];
    return mockProjects.find(p => p.id === projectId) || null;
  };

  const getProjectMessages = (projectId: string): ChatMessage[] => {
    // Mock function - in real app, this would fetch from API
    const mockMessages: Record<string, ChatMessage[]> = {
      '1': [
        {
          id: 'msg1',
          content: 'Can you help me create a procurement analytics dashboard?',
          role: 'user',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          projectId: '1',
        },
        {
          id: 'msg2',
          content: 'I\'d be happy to help you create a procurement analytics dashboard! Let me break this down into key components:\n\n1. **Key Metrics to Track:**\n   - Spend analysis by category\n   - Supplier performance metrics\n   - Cost savings opportunities\n   - Contract compliance rates\n\n2. **Dashboard Components:**\n   - Executive summary with KPIs\n   - Interactive charts and graphs\n   - Trend analysis over time\n   - Supplier scorecards\n\nWould you like me to elaborate on any specific aspect?',
          role: 'assistant',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
          projectId: '1',
        },
        {
          id: 'msg3',
          content: 'What tools would you recommend for building this dashboard?',
          role: 'user',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          projectId: '1',
        },
        {
          id: 'msg4',
          content: 'For a procurement analytics dashboard, I recommend these tools:\n\n**Business Intelligence Platforms:**\n- **Power BI** - Great for Microsoft ecosystem integration\n- **Tableau** - Excellent for advanced visualizations\n- **Looker** - Good for data modeling and exploration\n\n**Data Sources:**\n- ERP systems (SAP, Oracle)\n- Procurement platforms (Coupa, Ariba)\n- Excel/CSV files for smaller datasets\n\n**Key Features to Look For:**\n- Real-time data connectivity\n- Interactive filtering and drilling down\n- Mobile-responsive design\n- Automated report scheduling\n\nWould you like me to help you design the specific dashboard layout?',
          role: 'assistant',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 45000),
          projectId: '1',
        },
      ],
      '2': [
        {
          id: 'msg5',
          content: 'I need to conduct a supplier compliance review. What should I focus on?',
          role: 'user',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          projectId: '2',
        },
        {
          id: 'msg6',
          content: 'For a comprehensive supplier compliance review, focus on these key areas:\n\n**Regulatory Compliance:**\n- Industry-specific regulations (ISO, FDA, etc.)\n- Environmental standards (ISO 14001)\n- Safety certifications (OSHA compliance)\n\n**Quality Standards:**\n- Product quality metrics\n- Defect rates and returns\n- Customer satisfaction scores\n\n**Business Practices:**\n- Financial stability\n- Ethical sourcing policies\n- Data security and privacy\n\n**Operational Performance:**\n- Delivery times and reliability\n- Communication responsiveness\n- Innovation capabilities\n\nWould you like me to help you create a compliance checklist for your specific industry?',
          role: 'assistant',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 60000),
          projectId: '2',
        },
      ],
    };
    return mockMessages[projectId] || [];
  };

  // Use project messages if a project is selected, otherwise use regular messages
  const displayMessages = selectedProject ? projectMessages : messages;

  return (
    <MainLayout 
      onProjectSelect={handleProjectSelect}
      currentTitle={selectedProject?.title || "AI Chat"}
    >
      <ChatArea
        messages={displayMessages}
        onSendMessage={sendMessage}
        onActionCardClick={handleActionCardClick}
        onAttachFile={handleAttachFile}
        onVoiceMessage={handleVoiceMessage}
        onBrowsePrompts={handleBrowsePrompts}
        isLoading={isLoading}
        hasMoreMessages={false}
        onLoadMoreMessages={() => {}}
        selectedProject={selectedProject}
      />
    </MainLayout>
  );
}