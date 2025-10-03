import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { FiFileText, FiImage, FiUser, FiCode, FiShoppingCart, FiHelpCircle, FiSearch } from 'react-icons/fi';
import { ActionCard } from '../../lib/types/chat';

interface ActionCardsProps {
  onActionCardClick?: (prompt: string) => void;
  type?: 'general' | 'conversation';
}

const generalActionCards: ActionCard[] = [
  {
    id: 'write-copy',
    title: 'Write copy',
    description: 'Generate marketing copy, blog posts, and content',
    color: 'orange',
    icon: 'FiFileText',
    prompt: 'Write compelling copy for a product launch announcement',
  },
  {
    id: 'image-generation',
    title: 'Image generation',
    description: 'Create images, illustrations, and visual content',
    color: 'blue',
    icon: 'FiImage',
    prompt: 'Generate an image for a modern tech startup website',
  },
  {
    id: 'create-avatar',
    title: 'Create avatar',
    description: 'Design profile pictures and avatar images',
    color: 'green',
    icon: 'FiUser',
    prompt: 'Create a professional avatar for a business profile',
  },
  {
    id: 'write-code',
    title: 'Write code',
    description: 'Generate code snippets and programming solutions',
    color: 'pink',
    icon: 'FiCode',
    prompt: 'Write a React component for a user authentication form',
  },
];

const conversationActionCards: ActionCard[] = [
  {
    id: 'procurement',
    title: 'Start a Procurement',
    description: 'Begin a new procurement process',
    color: 'blue',
    icon: 'FiShoppingCart',
    prompt: 'Help me start a new procurement process. What are the key steps I should follow?',
  },
  {
    id: 'advice',
    title: 'Ask Advice',
    description: 'Get expert consultation',
    color: 'green',
    icon: 'FiHelpCircle',
    prompt: 'I need advice on best practices for supplier management and compliance.',
  },
  {
    id: 'inspect',
    title: 'Inspect a Project',
    description: 'Analyze project details',
    color: 'pink',
    icon: 'FiSearch',
    prompt: 'Help me analyze and inspect the current project status, risks, and opportunities.',
  },
  {
    id: 'report',
    title: 'Generate Report',
    description: 'Create comprehensive reports',
    color: 'orange',
    icon: 'FiFileText',
    prompt: 'Generate a comprehensive report with analytics and insights for this project.',
  },
];

const iconMap = {
  FiFileText: FiFileText,
  FiImage: FiImage,
  FiUser: FiUser,
  FiCode: FiCode,
  FiShoppingCart: FiShoppingCart,
  FiHelpCircle: FiHelpCircle,
  FiSearch: FiSearch,
};

const colorClasses = {
  orange: 'text-white',
  blue: 'text-white',
  green: 'text-white',
  pink: 'text-white',
};

const colorStyles = {
  orange: { backgroundColor: 'hsl(var(--action-orange))' },
  blue: { backgroundColor: 'hsl(var(--action-blue))' },
  green: { backgroundColor: 'hsl(var(--action-green))' },
  pink: { backgroundColor: 'hsl(var(--action-pink))' },
};

export function   ActionCards({ onActionCardClick, type = 'general' }: ActionCardsProps) {
  const actionCards = type === 'conversation' ? conversationActionCards : conversationActionCards;
  
  const handleCardClick = (card: ActionCard) => {
    
    if(type==='conversation'){
      onActionCardClick?.(card.prompt);
    }
    
  };

  return (
    <>
      {actionCards.map((card) => {
        const IconComponent = iconMap[card.icon as keyof typeof iconMap];
        
        return (
          <Card
            key={card.id}
            isPressable
            className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${colorClasses[card.color]} w-full rounded-xl`}
            style={colorStyles[card.color]}
            onClick={() => handleCardClick(card)}
          >
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/20 flex-shrink-0">
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{card.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90 line-clamp-2">{card.description}</p>
                </div>
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                  <span className="text-sm sm:text-lg font-bold">+</span>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </>
  );
}
