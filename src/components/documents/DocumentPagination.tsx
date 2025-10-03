'use client';

import React from 'react';
import { Pagination } from '@heroui/react';
import { DocumentPagination as DocumentPaginationType } from '../../lib/types/documents';

interface DocumentPaginationProps {
  pagination: DocumentPaginationType;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
}

export function DocumentPagination({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPageSelector = false
}: DocumentPaginationProps) {
  const { currentPage, totalPages, itemsPerPage, totalItems } = pagination;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const itemsPerPageOptions = [10, 20, 50, 100];

  if (totalPages <= 1) {
    return (
      <div className="flex justify-center items-center py-4">
        <span className="text-sm text-muted-foreground">
          Showing {totalItems} document{totalItems !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Items Info */}
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} document{totalItems !== 1 ? 's' : ''}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        {/* Items Per Page Selector */}
        {showItemsPerPageSelector && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        )}

        {/* Pagination Component */}
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={onPageChange}
          size="sm"
          showControls
          showShadow
          color="primary"
          classNames={{
            wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
            item: "w-8 h-8 text-small rounded-none bg-transparent",
            cursor: "bg-primary text-primary-foreground shadow-lg",
          }}
        />
      </div>
    </div>
  );
}
