'use client';

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
}

export function CreateConversationModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: CreateConversationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h3 className="text-lg font-semibold">New Conversation</h3>
          </ModalHeader>
          
          <ModalBody className="space-y-4">
            <Input
              label="Title"
              placeholder="Enter conversation title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isRequired
              disabled={isSubmitting}
            />
            
            <Textarea
              label="Description (optional)"
              placeholder="Enter conversation description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              minRows={3}
            />
          </ModalBody>
          
          <ModalFooter>
            <Button
              variant="ghost"
              onPress={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              disabled={!title.trim()}
            >
              Create Conversation
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}