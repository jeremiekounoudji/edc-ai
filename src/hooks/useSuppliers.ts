'use client';

import React, { useState, useMemo } from 'react';
import { Supplier, SupplierFilters, SupplierPagination, SupplierSelection } from '../lib/types/suppliers';
import { mockSuppliers } from '../lib/mockData/suppliers';

export function useSuppliers() {
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

  const handleClearSelection = () => {
    setSelection({ selectedIds: [], isAllSelected: false });
  };

  const selectedSuppliers = mockSuppliers.filter(supplier => 
    selection.selectedIds.includes(supplier.id)
  );

  return {
    // State
    filters,
    pagination,
    selection,
    filteredSuppliers,
    paginatedSuppliers,
    selectedSuppliers,
    
    // Actions
    handleFiltersChange,
    handleClearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleSelectSupplier,
    handleSelectAll,
    handleClearSelection,
  };
}
