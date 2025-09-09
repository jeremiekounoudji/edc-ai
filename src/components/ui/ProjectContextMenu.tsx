import React from 'react';
import { Button } from '@heroui/react';
import { FiEdit3, FiTrash2, FiCopy, FiShare, FiMoreHorizontal } from 'react-icons/fi';
import { Project } from '../../lib/types/project';

interface ProjectContextMenuProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onDuplicate?: (project: Project) => void;
  onShare?: (project: Project) => void;
  position?: { x: number; y: number };
}

export function ProjectContextMenu({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  position = { x: 0, y: 0 },
}: ProjectContextMenuProps) {
  if (!isOpen) return null;

  const handleMenuItemClick = (callback?: (project: Project) => void) => {
    callback?.(project);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed z-50 w-48 bg-popover border border-border rounded-lg shadow-lg py-2"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            startContent={<FiEdit3 className="h-4 w-4" />}
            onClick={() => handleMenuItemClick(onEdit)}
            className="w-full justify-start text-popover-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Edit Project
          </Button>

          <Button
            variant="ghost"
            size="sm"
            startContent={<FiCopy className="h-4 w-4" />}
            onClick={() => handleMenuItemClick(onDuplicate)}
            className="w-full justify-start text-popover-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Duplicate
          </Button>

          <Button
            variant="ghost"
            size="sm"
            startContent={<FiShare className="h-4 w-4" />}
            onClick={() => handleMenuItemClick(onShare)}
            className="w-full justify-start text-popover-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Share
          </Button>

          <div className="border-t border-border my-1" />

          <Button
            variant="ghost"
            size="sm"
            startContent={<FiTrash2 className="h-4 w-4" />}
            onClick={() => handleMenuItemClick(onDelete)}
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
