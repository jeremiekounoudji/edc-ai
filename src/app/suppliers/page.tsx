'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@heroui/react';
import { FiPlus, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { Supplier, SupplierFilters, SupplierPagination, SupplierSelection } from '../../lib/types/suppliers';
import { useSuppliers } from '../../hooks/useSuppliers';
import { SupplierFilters as SupplierFiltersComponent } from '../../components/suppliers/SupplierFilters';
import { SupplierGrid } from '../../components/suppliers/SupplierGrid';
import { SupplierPagination as SupplierPaginationComponent } from '../../components/suppliers/SupplierPagination';
import { SupplierBulkActions } from '../../components/suppliers/SupplierBulkActions';
import { SupplierDeleteModal } from '../../components/suppliers/SupplierDeleteModal';
import { SupplierCreateModal } from '../../components/suppliers/SupplierCreateModal';
import { ContactPopover } from '../../components/suppliers/ContactPopover';
import { supplierToasts } from '../../lib/utils/toast';

export default function SuppliersPage() {
  // State management
  const [filters, setFilters] = useState<SupplierFilters>({
    searchQuery: '',
    ratingRange: { min: 0, max: 100 },
    sectorFilter: 'all',
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState<SupplierPagination>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20,
    totalItems: 0
  });

  const [selection, setSelection] = useState<SupplierSelection>({
    selectedIds: [],
    isAllSelected: false
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSelection, setShowSelection] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [contactPopover, setContactPopover] = useState<{
    isOpen: boolean;
    supplier: Supplier | null;
  }>({
    isOpen: false,
    supplier: null
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    suppliers: Supplier[];
    isBulk: boolean;
  }>({
    isOpen: false,
    suppliers: [],
    isBulk: false
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch suppliers from Supabase
  const { suppliers: allSuppliers, loading, error, refetch, deleteSupplier, deleteSuppliers, createSupplier } = useSuppliers(filters);

  // Use suppliers from hook (filtering and sorting is handled in the hook)
  const filteredSuppliers = allSuppliers;

  // Paginate suppliers
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, pagination.currentPage, pagination.itemsPerPage]);

  // Update pagination when filtered suppliers change
  React.useEffect(() => {
    const totalPages = Math.ceil(filteredSuppliers.length / pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalItems: filteredSuppliers.length,
      currentPage: Math.min(prev.currentPage, totalPages || 1)
    }));
  }, [filteredSuppliers.length, pagination.itemsPerPage]);

  // Event handlers
  const handleFiltersChange = (newFilters: SupplierFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      ratingRange: { min: 0, max: 100 },
      sectorFilter: 'all',
      sortBy: 'rating',
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

  const handleSelectSupplier = (supplierId: string, selected: boolean) => {
    setSelection(prev => ({
      selectedIds: selected 
        ? [...prev.selectedIds, supplierId]
        : prev.selectedIds.filter(id => id !== supplierId),
      isAllSelected: false
    }));
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelection({
        selectedIds: paginatedSuppliers.map(supplier => supplier.id),
        isAllSelected: true
      });
    } else {
      setSelection({
        selectedIds: [],
        isAllSelected: false
      });
    }
  };

  const handleContact = (supplier: Supplier, contactType: 'email' | 'phone' | 'whatsapp') => {
    setContactPopover({
      isOpen: true,
      supplier
    });
  };

  const handleDelete = (supplier: Supplier) => {
    setDeleteModal({
      isOpen: true,
      suppliers: [supplier],
      isBulk: false
    });
  };

  const handleBulkEmail = (suppliers: Supplier[]) => {
    // Mock bulk email functionality
    const emails = suppliers.map(s => s.contact.email).join(',');
    window.open(`mailto:${emails}`, '_blank');
  };

  const handleBulkCall = (suppliers: Supplier[]) => {
    // Mock bulk call functionality - could open a conference call or show contact list
    console.log('Bulk calling suppliers:', suppliers.map(s => s.companyName));
  };

  const handleBulkDelete = (suppliers: Supplier[]) => {
    setDeleteModal({
      isOpen: true,
      suppliers,
      isBulk: true
    });
  };

  const handleConfirmDelete = async () => {
    const suppliersToDelete = deleteModal.suppliers;
    const isBulkOperation = deleteModal.isBulk;
    
    try {
      if (isBulkOperation) {
        const supplierIds = suppliersToDelete.map(s => s.id);
        await deleteSuppliers(supplierIds);
      } else {
        await deleteSupplier(suppliersToDelete[0].id);
      }
      
      // Clear selection and close modal first
      setSelection({ selectedIds: [], isAllSelected: false });
      setDeleteModal({ isOpen: false, suppliers: [], isBulk: false });
      
      // Show success toast after modal closes
      setTimeout(() => {
        if (isBulkOperation) {
          supplierToasts.bulkDeleteSuccess(suppliersToDelete.length);
        } else {
          supplierToasts.deleteSuccess(suppliersToDelete[0].companyName);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error deleting suppliers:', error);
      
      // Close modal first, then show error
      setSelection({ selectedIds: [], isAllSelected: false });
      setDeleteModal({ isOpen: false, suppliers: [], isBulk: false });
      
      setTimeout(() => {
        if (isBulkOperation) {
          supplierToasts.bulkActionError('delete', suppliersToDelete.length);
        } else {
          supplierToasts.deleteError(suppliersToDelete[0].companyName);
        }
      }, 100);
    }
  };

  const handleClearSelection = () => {
    setSelection({ selectedIds: [], isAllSelected: false });
  };

  const handleCreateSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      await createSupplier(supplierData);
      supplierToasts.createSuccess(supplierData.companyName);
      setSelection({ selectedIds: [], isAllSelected: false }); // Clear selection
    } catch (error) {
      console.error('Error creating supplier:', error);
      supplierToasts.createError(supplierData.companyName);
      throw error; // Re-throw to let modal handle it
    }
  };

  const selectedSuppliers = allSuppliers.filter(supplier => 
    selection.selectedIds.includes(supplier.id)
  );

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-danger mb-4">Error loading suppliers: {error}</p>
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
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your supplier relationships and contacts
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

          {/* Add Supplier Button */}
          <Button
            size="sm"
            color="primary"
            startContent={<FiPlus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 pb-0">
          <SupplierFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalSuppliers={allSuppliers.length}
            filteredCount={filteredSuppliers.length}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 pt-4 overflow-auto">
        <SupplierGrid
          suppliers={paginatedSuppliers}
          selectedIds={selection.selectedIds}
          onSelectSupplier={handleSelectSupplier}
          onSelectAll={handleSelectAll}
          onContact={handleContact}
          onDelete={handleDelete}
          showSelection={showSelection}
          groupBySector={viewMode === 'grid'}
        />
      </div>

      {/* Pagination */}
      <div className="p-6 pt-0">
        <SupplierPaginationComponent
          pagination={pagination}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPageSelector={true}
        />
      </div>

      {/* Bulk Actions */}
      <SupplierBulkActions
        selectedSuppliers={selectedSuppliers}
        onBulkEmail={handleBulkEmail}
        onBulkCall={handleBulkCall}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />

      {/* Contact Popover */}
      {contactPopover.supplier && (
        <ContactPopover
          supplier={contactPopover.supplier}
          isOpen={contactPopover.isOpen}
          onOpenChange={(open) => setContactPopover({ isOpen: open, supplier: contactPopover.supplier })}
          trigger={<div />}
        />
      )}

      {/* Create Supplier Modal */}
      <SupplierCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSupplier={handleCreateSupplier}
      />

      {/* Delete Confirmation Modal */}
      <SupplierDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, suppliers: [], isBulk: false })}
        onConfirm={handleConfirmDelete}
        suppliers={deleteModal.suppliers}
        isBulkDelete={deleteModal.isBulk}
      />
    </div>
  );
}
