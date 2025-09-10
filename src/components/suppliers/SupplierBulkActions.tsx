'use client';

import React from 'react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { FiTrash2, FiMoreVertical, FiCheckSquare, FiMail, FiPhone } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';

interface SupplierBulkActionsProps {
  selectedSuppliers: Supplier[];
  onBulkDelete: (suppliers: Supplier[]) => void;
  onBulkEmail: (suppliers: Supplier[]) => void;
  onBulkCall: (suppliers: Supplier[]) => void;
  onClearSelection: () => void;
  disabled?: boolean;
}

export function SupplierBulkActions({
  selectedSuppliers,
  onBulkDelete,
  onBulkEmail,
  onBulkCall,
  onClearSelection,
  disabled = false
}: SupplierBulkActionsProps) {
  const selectedCount = selectedSuppliers.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDelete = () => {
    onBulkDelete(selectedSuppliers);
  };

  const handleBulkEmail = () => {
    onBulkEmail(selectedSuppliers);
  };

  const handleBulkCall = () => {
    onBulkCall(selectedSuppliers);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 flex items-center gap-3">
        {/* Selection Info */}
        <div className="flex items-center gap-2 text-sm text-foreground">
          <FiCheckSquare className="h-4 w-4 text-primary" />
          <span className="font-medium">
            {selectedCount} supplier{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="primary"
            variant="solid"
            startContent={<FiMail className="h-4 w-4" />}
            onClick={handleBulkEmail}
            disabled={disabled}
          >
            Email All
          </Button>

          <Button
            size="sm"
            color="success"
            variant="solid"
            startContent={<FiPhone className="h-4 w-4" />}
            onClick={handleBulkCall}
            disabled={disabled}
          >
            Call All
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
