'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { FiTrash2, FiAlertTriangle, FiBriefcase } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';

interface SupplierDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  suppliers: Supplier[];
  isBulkDelete?: boolean;
  isLoading?: boolean;
}

export function SupplierDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  suppliers,
  isBulkDelete = false,
  isLoading = false
}: SupplierDeleteModalProps) {
  const supplierCount = suppliers.length;
  const isMultiple = supplierCount > 1;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="h-5 w-5 text-danger" />
                <span className="text-lg font-semibold">
                  {isMultiple ? 'Delete Suppliers' : 'Delete Supplier'}
                </span>
              </div>
            </ModalHeader>
            
            <ModalBody>
              <div className="space-y-4">
                <p className="text-foreground">
                  {isMultiple 
                    ? `Are you sure you want to delete ${supplierCount} suppliers? This action cannot be undone.`
                    : `Are you sure you want to delete "${suppliers[0]?.companyName}"? This action cannot be undone.`
                  }
                </p>

                {/* Supplier List for Multiple Selection */}
                {isMultiple && (
                  <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Suppliers to be deleted:
                    </h4>
                    <ul className="space-y-1">
                      {suppliers.slice(0, 5).map((supplier) => (
                        <li key={supplier.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          <FiBriefcase className="h-3 w-3 text-danger" />
                          <span className="truncate">{supplier.companyName}</span>
                          <span className="text-xs text-muted-foreground">
                            ({supplier.sector})
                          </span>
                        </li>
                      ))}
                      {supplierCount > 5 && (
                        <li className="text-sm text-muted-foreground italic">
                          ... and {supplierCount - 5} more supplier{supplierCount - 5 !== 1 ? 's' : ''}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Single Supplier Details */}
                {!isMultiple && suppliers[0] && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {suppliers[0].companyName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">
                          {suppliers[0].companyName}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {suppliers[0].sector} • {suppliers[0].domain}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning Message */}
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FiAlertTriangle className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-danger">
                      <p className="font-medium">Warning:</p>
                      <p>This action will permanently remove the supplier{isMultiple ? 's' : ''} from the system. You will not be able to recover {isMultiple ? 'them' : 'it'} later.</p>
                      {isMultiple && (
                        <p className="mt-1">This will also remove all associated contact information and ratings.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                variant="solid"
                onPress={handleConfirm}
                isLoading={isLoading}
                startContent={!isLoading ? <FiTrash2 className="h-4 w-4" /> : undefined}
              >
                {isLoading ? 'Deleting...' : `Delete ${isMultiple ? 'Suppliers' : 'Supplier'}`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
