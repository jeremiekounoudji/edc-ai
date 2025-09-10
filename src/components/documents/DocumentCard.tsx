'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Button, Checkbox } from '@heroui/react';
import { FiDownload, FiTrash2, FiFileText, FiFile, FiImage, FiArchive } from 'react-icons/fi';
import { Document } from '../../lib/types/documents';
import { formatFileSize, formatDate, getFileTypeIcon } from '../../lib/utils/formatters';

interface DocumentCardProps {
  document: Document;
  isSelected?: boolean;
  onSelect?: (documentId: string, selected: boolean) => void;
  onDownload?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  showSelection?: boolean;
}

export function DocumentCard({
  document,
  isSelected = false,
  onSelect,
  onDownload,
  onDelete,
  showSelection = false
}: DocumentCardProps) {
  const handleSelect = (checked: boolean) => {
    onSelect?.(document.id, checked);
  };

  const handleDownload = () => {
    onDownload?.(document);
  };

  const handleDelete = () => {
    onDelete?.(document);
  };

  const getFileIcon = () => {
    const iconName = getFileTypeIcon(document.name);
    
    switch (iconName) {
      case 'FiFileText':
        return <FiFileText className="h-6 w-6 text-blue-500" />;
      case 'FiImage':
        return <FiImage className="h-6 w-6 text-green-500" />;
      case 'FiArchive':
        return <FiArchive className="h-6 w-6 text-orange-500" />;
      default:
        return <FiFile className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-green-100 text-green-800';
      case 'receipt':
        return 'bg-blue-100 text-blue-800';
      case 'specification':
        return 'bg-purple-100 text-purple-800';
      case 'purchase_order':
        return 'bg-orange-100 text-orange-800';
      case 'contract':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={`w-full transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          {showSelection && (
            <Checkbox
              isSelected={isSelected}
              onValueChange={handleSelect}
              size="sm"
              color="primary"
            />
          )}
          <div className="flex items-center space-x-2">
            {getFileIcon()}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-foreground truncate max-w-[200px]">
                {document.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(document.type)}`}>
                {document.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Size: {formatFileSize(document.size)}</span>
            <span>{formatDate(document.uploadDate, { format: 'short' })}</span>
          </div>
          
          {document.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {document.description}
            </p>
          )}
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              size="sm"
              variant="light"
              color="primary"
              startContent={<FiDownload className="h-4 w-4" />}
              onClick={handleDownload}
              className="min-w-0"
            >
              Download
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              startContent={<FiTrash2 className="h-4 w-4" />}
              onClick={handleDelete}
              className="min-w-0"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
