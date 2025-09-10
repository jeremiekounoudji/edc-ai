'use client';

import React from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { FiDownload, FiTrash2, FiMoreVertical, FiCheckSquare } from 'react-icons/fi';
import { Document } from '../../lib/types/documents';
import { documentToasts } from '../../lib/utils/toast';

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
    try {
      onBulkDownload(selectedDocuments);
      documentToasts.bulkDownloadSuccess(selectedCount);
    } catch (error) {
      documentToasts.bulkActionError('download', selectedCount);
    }
  };

  const handleBulkDelete = () => {
    try {
      onBulkDelete(selectedDocuments);
      documentToasts.bulkDeleteSuccess(selectedCount);
    } catch (error) {
      documentToasts.bulkActionError('delete', selectedCount);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4 sm:max-w-none sm:px-0">
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        {/* Selection Info */}
        <div className="flex items-center gap-2 text-sm text-foreground">
          <FiCheckSquare className="h-4 w-4 text-primary" />
          <span className="font-medium">
            {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            color="primary"
            variant="solid"
            startContent={<FiDownload className="h-4 w-4" />}
            onClick={handleBulkDownload}
            disabled={disabled}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">Download All</span>
            <span className="sm:hidden">Download</span>
          </Button>

          <Button
            size="sm"
            color="danger"
            variant="solid"
            startContent={<FiTrash2 className="h-4 w-4" />}
            onClick={handleBulkDelete}
            disabled={disabled}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">Delete All</span>
            <span className="sm:hidden">Delete</span>
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
