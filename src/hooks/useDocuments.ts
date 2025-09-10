'use client';

import React, { useState, useMemo } from 'react';
import { Document, DocumentFilters, DocumentPagination, DocumentSelection } from '../lib/types/documents';
import { mockDocuments } from '../lib/mockData/documents';

export function useDocuments() {
  const [filters, setFilters] = useState<DocumentFilters>({
    searchQuery: '',
    typeFilter: 'all',
    sortBy: 'uploadDate',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState<DocumentPagination>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20,
    totalItems: 0
  });

  const [selection, setSelection] = useState<DocumentSelection>({
    selectedIds: [],
    isAllSelected: false
  });

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = [...mockDocuments];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filters.typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === filters.typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'uploadDate':
          aValue = a.uploadDate.getTime();
          bValue = b.uploadDate.getTime();
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [filters]);

  // Paginate documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredDocuments.slice(startIndex, endIndex);
  }, [filteredDocuments, pagination.currentPage, pagination.itemsPerPage]);

  // Update pagination when filtered documents change
  React.useEffect(() => {
    const totalPages = Math.ceil(filteredDocuments.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems: filteredDocuments.length,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [filteredDocuments.length, pagination.itemsPerPage]);

  // Event handlers
  const handleFiltersChange = (newFilters: DocumentFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      typeFilter: 'all',
      sortBy: 'uploadDate',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({ ...prev, itemsPerPage, currentPage: 1 }));
  };

  const handleSelectDocument = (documentId: string, selected: boolean) => {
    setSelection(prev => ({
      selectedIds: selected 
        ? [...prev.selectedIds, documentId]
        : prev.selectedIds.filter(id => id !== documentId),
      isAllSelected: false
    }));
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelection({
        selectedIds: paginatedDocuments.map(doc => doc.id),
        isAllSelected: true
      });
    } else {
      setSelection({
        selectedIds: [],
        isAllSelected: false
      });
    }
  };

  const handleClearSelection = () => {
    setSelection({ selectedIds: [], isAllSelected: false });
  };

  const selectedDocuments = mockDocuments.filter(doc => 
    selection.selectedIds.includes(doc.id)
  );

  return {
    // State
    filters,
    pagination,
    selection,
    filteredDocuments,
    paginatedDocuments,
    selectedDocuments,
    
    // Actions
    handleFiltersChange,
    handleClearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleSelectDocument,
    handleSelectAll,
    handleClearSelection,
  };
}
