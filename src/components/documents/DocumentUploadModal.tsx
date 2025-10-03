'use client';

import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Chip
} from '@heroui/react';
import { FiUpload, FiX, FiFile, FiImage, FiFileText, FiPlus } from 'react-icons/fi';
import { DocumentType } from '../../lib/types/documents';
import { DocumentUploadProgress } from './DocumentUploadProgress';

interface SelectedFile {
  file: File;
  id: string;
  type: DocumentType;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: 'invoice', label: 'Invoice' },
  { value: 'receipt', label: 'Receipt' },
  { value: 'specification', label: 'Specification' },
  { value: 'purchase_order', label: 'Purchase Order' },
  { value: 'contract', label: 'Contract' }
];

const allowedFileTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const [selectedType, setSelectedType] = useState<DocumentType>('invoice');
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FiImage className="h-5 w-5" />;
    if (file.type === 'application/pdf') return <FiFileText className="h-5 w-5" />;
    return <FiFile className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return 'File type not supported. Please upload PDF, DOCX, or image files.';
    }
    if (file.size > maxFileSize) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: SelectedFile[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          type: selectedType
        });
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [selectedType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0 || isUploading) return;
    setIsUploading(true);
    setShowProgress(true);
  };

  const handleUploadComplete = () => {
    setShowProgress(false);
    setIsUploading(false);
    setSelectedFiles([]);
    onUploadComplete();
    onClose();
  };

  const handleProgressComplete = () => {
    handleUploadComplete();
  };

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setShowProgress(false);
      setIsDragOver(false);
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!showProgress) {
      setSelectedFiles([]);
      onClose();
    }
  };

  if (showProgress) {
    return (
      <DocumentUploadProgress
        isOpen={isOpen}
        files={selectedFiles}
        onComplete={handleProgressComplete}
      />
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Upload Documents</h2>
          <p className="text-sm text-muted-foreground">
            Select document type and upload files (PDF, DOCX, Images)
          </p>
        </ModalHeader>
        
        <ModalBody className="gap-4">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <Select
              selectedKeys={[selectedType]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as DocumentType;
                setSelectedType(key);
              }}
              placeholder="Select document type"
            >
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FiUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, DOCX, and image files up to 10MB each
            </p>
            <Button
              color="primary"
              variant="bordered"
              startContent={<FiPlus className="h-4 w-4" />}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = allowedFileTypes.join(',');
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  handleFileSelect(target.files);
                };
                input.click();
              }}
            >
              Browse Files
            </Button>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Selected Files ({selectedFiles.length})</h3>
                <Chip size="sm" variant="flat" color="primary">
                  {documentTypes.find(t => t.value === selectedType)?.label}
                </Chip>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((selectedFile) => (
                  <Card key={selectedFile.id} className="shadow-sm">
                    <CardBody className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-primary">
                            {getFileIcon(selectedFile.file)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {selectedFile.file.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(selectedFile.file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() => removeFile(selectedFile.id)}
                        >
                          <FiX className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleUpload}
            isDisabled={selectedFiles.length === 0 || isUploading}
            isLoading={isUploading}
            startContent={!isUploading && <FiUpload className="h-4 w-4" />}
          >
            {isUploading ? 'Starting Upload...' : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};