import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react';
import { FiFolder, FiX } from 'react-icons/fi';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: (data: { title: string; description: string }) => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreateProject }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onCreateProject?.({ title: title.trim(), description: description.trim() });
      handleClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIsLoading(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <FiFolder className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Create New Project</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Organize your conversations and work into focused projects
          </p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <Input
              type="text"
              label="Project Title"
              placeholder="Enter project title..."
              value={title}
              onValueChange={setTitle}
              variant="bordered"
              isRequired
              maxLength={100}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            
            <Textarea
              label="Description"
              placeholder="Describe what this project is about..."
              value={description}
              onValueChange={setDescription}
              variant="bordered"
              maxLength={500}
              minRows={3}
              maxRows={6}
              onKeyDown={handleKeyPress}
            />
            
            <div className="text-xs text-muted-foreground">
              <p>• Projects help you organize conversations by topic or client</p>
              <p>• You can add multiple chat sessions to each project</p>
              <p>• Use Ctrl+Enter to quickly create the project</p>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleCreate}
            isLoading={isLoading}
            disabled={!title.trim()}
          >
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
