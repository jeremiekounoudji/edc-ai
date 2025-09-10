'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@heroui/react';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import { Supplier, SupplierFilters, SupplierPagination, SupplierSelection } from '../../lib/types/suppliers';
import { mockSuppliers } from '../../lib/mockData/suppliers';
import { SupplierFilters as SupplierFiltersComponent } from '../../components/suppliers/SupplierFilters';
import { SupplierGrid } from '../../components/suppliers/SupplierGrid';
import { SupplierPagination as SupplierPaginationComponent } from '../../components/suppliers/SupplierPagination';
import { SupplierBulkActions } from '../../components/suppliers/SupplierBulkActions';
import { SupplierDeleteModal } from '../../components/suppliers/SupplierDeleteModal';
import { ContactPopover } from '../../components/suppliers/ContactPopover';

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

  // Filter and sort suppliers
  const filteredSuppliers = useMemo(() => {
    let filtered = [...mockSuppliers];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.companyName.toLowerCase().includes(query) ||
        supplier.description.toLowerCase().includes(query) ||
        supplier.sector.toLowerCase().includes(query) ||
        supplier.domain.toLowerCase().includes(query)
      );
    }

    // Apply sector filter
    if (filters.sectorFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.sector === filters.sectorFilter);
    }

    // Apply rating range filter
    filtered = filtered.filter(supplier => 
      supplier.rating >= filters.ratingRange.min && 
      supplier.rating <= filters.ratingRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'companyName':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'sector':
          aValue = a.sector.toLowerCase();
          bValue = b.sector.toLowerCase();
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

  const handleConfirmDelete = () => {
    // Mock delete functionality
    console.log('Deleting suppliers:', deleteModal.suppliers.map(s => s.companyName));
    // In a real app, this would remove suppliers from the data source
    
    // Clear selection and close modal
    setSelection({ selectedIds: [], isAllSelected: false });
    setDeleteModal({ isOpen: false, suppliers: [], isBulk: false });
  };

  const handleClearSelection = () => {
    setSelection({ selectedIds: [], isAllSelected: false });
  };

  const selectedSuppliers = mockSuppliers.filter(supplier => 
    selection.selectedIds.includes(supplier.id)
  );

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

          {/* Add Supplier Button */}
          <Button
            size="sm"
            color="primary"
            startContent={<FiPlus className="h-4 w-4" />}
            onClick={() => console.log('Add supplier clicked')}
          >
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 pb-0">
        <SupplierFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          totalSuppliers={mockSuppliers.length}
          filteredCount={filteredSuppliers.length}
        />
      </div>

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
