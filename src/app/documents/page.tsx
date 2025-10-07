'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@heroui/react';
import { FiPlus, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { Document, DocumentFilters, DocumentPagination, DocumentSelection } from '../../lib/types/documents';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentFilters as DocumentFiltersComponent } from '../../components/documents/DocumentFilters';
import { DocumentGrid } from '../../components/documents/DocumentGrid';
import { DocumentPagination as DocumentPaginationComponent } from '../../components/documents/DocumentPagination';
import { DocumentBulkActions } from '../../components/documents/DocumentBulkActions';
import { DocumentDeleteModal } from '../../components/documents/DocumentDeleteModal';
import { DocumentUploadModal } from '../../components/documents/DocumentUploadModal';
import { documentToasts } from '../../lib/utils/toast';

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
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    documents: Document[];
    isBulk: boolean;
  }>({
    isOpen: false,
    documents: [],
    isBulk: false
  });

  // Fetch documents from Supabase
  const { documents: allDocuments, loading, error, refetch, deleteDocument, deleteDocuments } = useDocuments(filters);

  // Use documents from hook (filtering and sorting is handled in the hook)
  const filteredDocuments = allDocuments;

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

  const handleUploadComplete = () => {
    refetch(); // Refresh documents after upload
    setSelection({ selectedIds: [], isAllSelected: false }); // Clear selection
    documentToasts.bulkActionSuccess('upload', 1); // Show success message
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

  const handleConfirmDelete = async () => {
    const documentsToDelete = deleteModal.documents;
    const isBulkOperation = deleteModal.isBulk;
    
    try {
      if (isBulkOperation) {
        const documentIds = documentsToDelete.map(d => d.id);
        await deleteDocuments(documentIds);
      } else {
        await deleteDocument(documentsToDelete[0].id);
      }
      
      // Clear selection and close modal first
      setSelection({ selectedIds: [], isAllSelected: false });
      setDeleteModal({ isOpen: false, documents: [], isBulk: false });
      
      // Show success toast after modal closes
      setTimeout(() => {
        if (isBulkOperation) {
          documentToasts.bulkDeleteSuccess(documentsToDelete.length);
        } else {
          documentToasts.deleteSuccess(documentsToDelete[0].name);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error deleting documents:', error);
      
      // Close modal first, then show error
      setSelection({ selectedIds: [], isAllSelected: false });
      setDeleteModal({ isOpen: false, documents: [], isBulk: false });
      
      setTimeout(() => {
        if (isBulkOperation) {
          documentToasts.bulkActionError('delete', documentsToDelete.length);
        } else {
          documentToasts.deleteError(documentsToDelete[0].name);
        }
      }, 100);
    }
  };

  const handleClearSelection = () => {
    setSelection({ selectedIds: [], isAllSelected: false });
  };

  const selectedDocuments = allDocuments.filter(doc => 
    selection.selectedIds.includes(doc.id)
  );

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-danger mb-4">Error loading documents: {error}</p>
          <Button color="primary" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-start md:justify-between  p-6 border-b border-border">
        <div className='p-2'>
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

          {/* Filter Toggle Button */}
          <Button
            size="sm"
            variant={showFilters ? 'solid' : 'bordered'}
            color={showFilters ? 'primary' : 'default'}
            startContent={<FiFilter className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {/* Add Document Button */}
          <Button
            size="sm"
            color="primary"
            startContent={<FiPlus className="h-4 w-4" />}
            onClick={() => setShowUploadModal(true)}
          >
           
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 pb-0">
          <DocumentFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalDocuments={allDocuments.length}
            filteredCount={filteredDocuments.length}
          />
        </div>
      )}

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

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
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
