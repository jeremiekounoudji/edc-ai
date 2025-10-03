'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { Document } from '../../lib/types/documents';

interface DocumentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documents: Document[];
  isBulkDelete?: boolean;
  isLoading?: boolean;
}

export function DocumentDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  documents,
  isBulkDelete = false,
  isLoading = false
}: DocumentDeleteModalProps) {
  const documentCount = documents.length;
  const isMultiple = documentCount > 1;

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
                  {isMultiple ? 'Delete Documents' : 'Delete Document'}
                </span>
              </div>
            </ModalHeader>
            
            <ModalBody>
              <div className="space-y-4">
                <p className="text-foreground">
                  {isMultiple 
                    ? `Are you sure you want to delete ${documentCount} documents? This action cannot be undone.`
                    : `Are you sure you want to delete "${documents[0]?.name}"? This action cannot be undone.`
                  }
                </p>

                {/* Document List for Multiple Selection */}
                {isMultiple && (
                  <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Documents to be deleted:
                    </h4>
                    <ul className="space-y-1">
                      {documents.slice(0, 5).map((doc) => (
                        <li key={doc.id} className="text-sm text-muted-foreground flex items-center gap-2">
                          <FiTrash2 className="h-3 w-3 text-danger" />
                          <span className="truncate">{doc.name}</span>
                        </li>
                      ))}
                      {documentCount > 5 && (
                        <li className="text-sm text-muted-foreground italic">
                          ... and {documentCount - 5} more document{documentCount - 5 !== 1 ? 's' : ''}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Warning Message */}
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FiAlertTriangle className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-danger">
                      <p className="font-medium">Warning:</p>
                      <p>This action will permanently remove the document{documentCount > 1 ? 's' : ''} from the system. You will not be able to recover {isMultiple ? 'them' : 'it'} later.</p>
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
                {isLoading ? 'Deleting...' : `Delete ${isMultiple ? 'Documents' : 'Document'}`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
