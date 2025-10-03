import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { FiSearch, FiCopy, FiCheck } from 'react-icons/fi';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
}

interface BrowsePromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

const promptCategories = [
  'Writing & Content',
  'Code & Development',
  'Design & Creative',
  'Business & Marketing',
  'Education & Learning',
  'General Purpose',
];

const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    description: 'Create compelling copy for a new product launch',
    category: 'Business & Marketing',
    content: 'Write a compelling product launch announcement for [product name] that highlights its key features, benefits, and unique selling points. Include a call-to-action and make it engaging for our target audience.',
    tags: ['marketing', 'product', 'announcement'],
  },
  {
    id: '2',
    title: 'Blog Post Outline',
    description: 'Generate a structured outline for a blog post',
    category: 'Writing & Content',
    content: 'Create a detailed blog post outline about [topic] that includes an engaging introduction, main points with supporting evidence, and a strong conclusion. Make it SEO-friendly and reader-focused.',
    tags: ['blog', 'outline', 'seo'],
  },
  {
    id: '3',
    title: 'React Component',
    description: 'Generate a React component with TypeScript',
    category: 'Code & Development',
    content: 'Create a React functional component in TypeScript for [component purpose]. Include proper TypeScript interfaces, error handling, and follow React best practices.',
    tags: ['react', 'typescript', 'component'],
  },
  {
    id: '4',
    title: 'Email Template',
    description: 'Design a professional email template',
    category: 'Business & Marketing',
    content: 'Create a professional email template for [purpose] that is mobile-responsive, includes proper formatting, and follows email marketing best practices.',
    tags: ['email', 'template', 'marketing'],
  },
  {
    id: '5',
    title: 'Social Media Post',
    description: 'Generate engaging social media content',
    category: 'Business & Marketing',
    content: 'Create an engaging social media post for [platform] about [topic] that encourages interaction, includes relevant hashtags, and aligns with our brand voice.',
    tags: ['social media', 'engagement', 'content'],
  },
  {
    id: '6',
    title: 'API Documentation',
    description: 'Write comprehensive API documentation',
    category: 'Code & Development',
    content: 'Write comprehensive API documentation for [API endpoint] that includes request/response examples, error codes, authentication requirements, and usage examples.',
    tags: ['api', 'documentation', 'technical'],
  },
];

export function BrowsePromptsModal({ isOpen, onClose, onSelectPrompt }: BrowsePromptsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredPrompts = samplePrompts.filter((prompt) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt?.(prompt.content);
    onClose();
  };

  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopiedPromptId(prompt.id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Browse Prompts</h2>
          <p className="text-sm text-muted-foreground">
            Choose from our library of pre-written prompts to get started quickly
          </p>
        </ModalHeader>
        
        <ModalBody>
          {/* Search and Filter */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<FiSearch className="h-4 w-4 text-muted-foreground" />}
              variant="bordered"
              classNames={{
                inputWrapper: "!border-2 !rounded-lg !min-h-[40px]"
              }}
              style={{
                borderColor: 'hsl(var(--foreground))'
              } as React.CSSProperties}
            />
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'solid' : 'bordered'}
                size="sm"
                onClick={() => setSelectedCategory('All')}
              >
                All
              </Button>
              {promptCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'solid' : 'bordered'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardBody className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{prompt.title}</h3>
                      <p className="text-sm text-muted-foreground">{prompt.description}</p>
                      <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-2">
                        {prompt.category}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {prompt.content}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          isIconOnly
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPrompt(prompt)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copiedPromptId === prompt.id ? (
                            <FiCheck className="h-4 w-4 text-success" />
                          ) : (
                            <FiCopy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => handleSelectPrompt(prompt)}
                        >
                          Use Prompt
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          
          {filteredPrompts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No prompts found matching your criteria.</p>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
