import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { FiFolder, FiTrash2 } from 'react-icons/fi';
import { Project } from '../../lib/types/project';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onUpdateProject?: (data: { id: string; title: string; description: string }) => void;
  onDeleteProject?: (projectId: string) => void;
}

export function EditProjectModal({ 
  isOpen, 
  onClose, 
  project, 
  onUpdateProject, 
  onDeleteProject 
}: EditProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form when project changes
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    }
  }, [project]);

  const handleUpdate = async () => {
    if (!project || !title.trim()) return;

    setIsLoading(true);
    try {
      await onUpdateProject?.({ 
        id: project.id, 
        title: title.trim(), 
        description: description.trim() 
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    setIsLoading(true);
    try {
      await onDeleteProject?.(project.id);
      handleClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setIsLoading(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleUpdate();
    }
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <FiFolder className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Edit Project</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Update your project details
          </p>
        </ModalHeader>
        
        <ModalBody>
          {!showDeleteConfirm ? (
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
                classNames={{
                  inputWrapper: "!border-2 !rounded-lg !min-h-[48px]"
                }}
                style={{
                  borderColor: 'hsl(var(--foreground))'
                } as React.CSSProperties}
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
                classNames={{
                  inputWrapper: "!border-2 !rounded-lg"
                }}
                style={{
                  borderColor: 'hsl(var(--foreground))'
                } as React.CSSProperties}
              />
              
              <div className="text-xs text-muted-foreground">
                <p>• Created: {project.createdAt.toLocaleDateString()}</p>
                <p>• Last updated: {project.updatedAt.toLocaleDateString()}</p>
                <p>• Chat sessions: {project.chatSessions.length}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <FiTrash2 className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Delete Project
                </h3>
                <p className="text-muted-foreground">
                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will also remove all associated chat sessions from this project.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          {!showDeleteConfirm ? (
            <>
              <Button 
                variant="ghost" 
                color="danger" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={handleUpdate}
                isLoading={isLoading}
                disabled={!title.trim()}
              >
                Update Project
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={handleDelete}
                isLoading={isLoading}
              >
                Delete Project
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
