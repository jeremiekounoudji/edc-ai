'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Document, DocumentGroup } from '../../lib/types/documents';
import { DocumentCard } from './DocumentCard';
import { getDocumentTypeLabels } from '../../lib/mockData/documents';

interface DocumentGridProps {
  documents: Document[];
  selectedIds: string[];
  onSelectDocument: (documentId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onDownload: (document: Document) => void;
  onDelete: (document: Document) => void;
  showSelection?: boolean;
  groupByType?: boolean;
}

export function DocumentGrid({
  documents,
  selectedIds,
  onSelectDocument,
  onSelectAll,
  onDownload,
  onDelete,
  showSelection = false,
  groupByType = true
}: DocumentGridProps) {
  const typeLabels = getDocumentTypeLabels();

  // Group documents by type if groupByType is true
  const groupedDocuments = React.useMemo(() => {
    if (!groupByType) {
      return [{ type: 'all' as const, documents, count: documents.length }];
    }

    const groups: DocumentGroup[] = [];
    const typeOrder: Array<keyof typeof typeLabels> = ['invoice', 'receipt', 'specification', 'purchase_order', 'contract'];

    typeOrder.forEach(type => {
      const typeDocuments = documents.filter(doc => doc.type === type);
      if (typeDocuments.length > 0) {
        groups.push({
          type,
          documents: typeDocuments,
          count: typeDocuments.length
        });
      }
    });

    return groups;
  }, [documents, groupByType]);

  const isAllSelected = selectedIds.length === documents.length && documents.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < documents.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl text-muted-foreground mb-4">📄</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Header */}
      {showSelection && (
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isIndeterminate;
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-foreground">
              {selectedIds.length > 0 
                ? `${selectedIds.length} of ${documents.length} selected`
                : `Select all ${documents.length} documents`
              }
            </span>
          </div>
        </div>
      )}

      {/* Document Groups */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {groupedDocuments.map((group) => (
          <motion.div key={group.type} variants={itemVariants}>
            {/* Group Header */}
            {groupByType && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {typeLabels[group.type]} ({group.count})
                </h2>
              </div>
            )}

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.documents.map((document) => (
                <motion.div key={document.id} variants={itemVariants}>
                  <DocumentCard
                    document={document}
                    isSelected={selectedIds.includes(document.id)}
                    onSelect={onSelectDocument}
                    onDownload={onDownload}
                    onDelete={onDelete}
                    showSelection={showSelection}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
