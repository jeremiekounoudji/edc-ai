import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { FiFileText, FiImage, FiUser, FiCode } from 'react-icons/fi';
import { ActionCard } from '../../lib/types/chat';

interface ActionCardsProps {
  onActionCardClick?: (prompt: string) => void;
}

const actionCards: ActionCard[] = [
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

const iconMap = {
  FiFileText: FiFileText,
  FiImage: FiImage,
  FiUser: FiUser,
  FiCode: FiCode,
};

const colorClasses = {
  orange: 'bg-action-orange-500 hover:bg-action-orange-600 text-white',
  blue: 'bg-action-blue-500 hover:bg-action-blue-600 text-white',
  green: 'bg-action-green-500 hover:bg-action-green-600 text-white',
  pink: 'bg-action-pink-500 hover:bg-action-pink-600 text-white',
};

export function ActionCards({ onActionCardClick }: ActionCardsProps) {
  const handleCardClick = (card: ActionCard) => {
    onActionCardClick?.(card.prompt);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actionCards.map((card) => {
        const IconComponent = iconMap[card.icon as keyof typeof iconMap];
        
        return (
          <Card
            key={card.id}
            isPressable
            className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${colorClasses[card.color]}`}
            onClick={() => handleCardClick(card)}
          >
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <span className="text-lg font-bold">+</span>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
