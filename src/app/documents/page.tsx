'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@heroui/react';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { Document, DocumentFilters, DocumentPagination, DocumentSelection } from '../../lib/types/documents';
import { mockDocuments } from '../../lib/mockData/documents';
import { DocumentFilters as DocumentFiltersComponent } from '../../components/documents/DocumentFilters';
import { DocumentGrid } from '../../components/documents/DocumentGrid';
import { DocumentPagination as DocumentPaginationComponent } from '../../components/documents/DocumentPagination';
import { DocumentBulkActions } from '../../components/documents/DocumentBulkActions';
import { DocumentDeleteModal } from '../../components/documents/DocumentDeleteModal';

export default function DocumentsPage() {
  // State management
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

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSelection, setShowSelection] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    documents: Document[];
    isBulk: boolean;
  }>({
    isOpen: false,
    documents: [],
    isBulk: false
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

  const handleDownload = (document: Document) => {
    // Mock download functionality
    console.log('Downloading document:', document.name);
    // In a real app, this would trigger the actual download
  };

  const handleDelete = (document: Document) => {
    setDeleteModal({
      isOpen: true,
      documents: [document],
      isBulk: false
    });
  };

  const handleBulkDownload = (documents: Document[]) => {
    // Mock bulk download functionality
    console.log('Bulk downloading documents:', documents.map(d => d.name));
    // In a real app, this would trigger bulk download
  };

  const handleBulkDelete = (documents: Document[]) => {
    setDeleteModal({
      isOpen: true,
      documents,
      isBulk: true
    });
  };

  const handleConfirmDelete = () => {
    // Mock delete functionality
    console.log('Deleting documents:', deleteModal.documents.map(d => d.name));
    // In a real app, this would remove documents from the data source
    
    // Clear selection and close modal
    setSelection({ selectedIds: [], isAllSelected: false });
    setDeleteModal({ isOpen: false, documents: [], isBulk: false });
  };

  const handleClearSelection = () => {
    setSelection({ selectedIds: [], isAllSelected: false });
  };

  const selectedDocuments = mockDocuments.filter(doc => 
    selection.selectedIds.includes(doc.id)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your documents
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'solid' : 'light'}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              isIconOnly
              onClick={() => setViewMode('grid')}
            >
              <FiGrid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'solid' : 'light'}
              color={viewMode === 'list' ? 'primary' : 'default'}
              isIconOnly
              onClick={() => setViewMode('list')}
            >
              <FiList className="h-4 w-4" />
            </Button>
          </div>

          {/* Selection Toggle */}
          <Button
            size="sm"
            variant={showSelection ? 'solid' : 'bordered'}
            color={showSelection ? 'primary' : 'default'}
            onClick={() => {
              setShowSelection(!showSelection);
              if (showSelection) {
                setSelection({ selectedIds: [], isAllSelected: false });
              }
            }}
          >
            Select
          </Button>

          {/* Add Document Button */}
          <Button
            size="sm"
            color="primary"
            startContent={<FiPlus className="h-4 w-4" />}
            onClick={() => console.log('Add document clicked')}
          >
            Add Document
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 pb-0">
        <DocumentFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          totalDocuments={mockDocuments.length}
          filteredCount={filteredDocuments.length}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 pt-4 overflow-auto">
        <DocumentGrid
          documents={paginatedDocuments}
          selectedIds={selection.selectedIds}
          onSelectDocument={handleSelectDocument}
          onSelectAll={handleSelectAll}
          onDownload={handleDownload}
          onDelete={handleDelete}
          showSelection={showSelection}
          groupByType={viewMode === 'grid'}
        />
      </div>

      {/* Pagination */}
      <div className="p-6 pt-0">
        <DocumentPaginationComponent
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPageSelector={true}
        />
      </div>

      {/* Bulk Actions */}
      <DocumentBulkActions
        selectedDocuments={selectedDocuments}
        onBulkDownload={handleBulkDownload}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />

      {/* Delete Confirmation Modal */}
      <DocumentDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, documents: [], isBulk: false })}
        onConfirm={handleConfirmDelete}
        documents={deleteModal.documents}
        isBulkDelete={deleteModal.isBulk}
      />
    </div>
  );
}
