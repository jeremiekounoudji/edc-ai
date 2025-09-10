'use client';

import React from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { FiDownload, FiTrash2, FiMoreVertical, FiCheckSquare } from 'react-icons/fi';
import { Document } from '../../lib/types/documents';

interface DocumentBulkActionsProps {
  selectedDocuments: Document[];
  onBulkDownload: (documents: Document[]) => void;
  onBulkDelete: (documents: Document[]) => void;
  onClearSelection: () => void;
  disabled?: boolean;
}

export function DocumentBulkActions({
  selectedDocuments,
  onBulkDownload,
  onBulkDelete,
  onClearSelection,
  disabled = false
}: DocumentBulkActionsProps) {
  const selectedCount = selectedDocuments.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDownload = () => {
    onBulkDownload(selectedDocuments);
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedDocuments);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 flex items-center gap-3">
        {/* Selection Info */}
        <div className="flex items-center gap-2 text-sm text-foreground">
          <FiCheckSquare className="h-4 w-4 text-primary" />
          <span className="font-medium">
            {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="primary"
            variant="solid"
            startContent={<FiDownload className="h-4 w-4" />}
            onClick={handleBulkDownload}
            disabled={disabled}
          >
            Download All
          </Button>

          <Button
            size="sm"
            color="danger"
            variant="solid"
            startContent={<FiTrash2 className="h-4 w-4" />}
            onClick={handleBulkDelete}
            disabled={disabled}
          >
            Delete All
          </Button>

          {/* More Actions Dropdown */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                variant="bordered"
                isIconOnly
                disabled={disabled}
              >
                <FiMoreVertical className="h-4 w-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="More bulk actions">
              <DropdownItem
                key="clear"
                color="default"
                onClick={onClearSelection}
                className="text-muted-foreground"
              >
                Clear Selection
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
