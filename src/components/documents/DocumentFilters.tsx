'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { DocumentFilters as DocumentFiltersType, DocumentType } from '../../lib/types/documents';
import { getDocumentTypes, getDocumentTypeLabels } from '../../lib/mockData/documents';

interface DocumentFiltersProps {
  filters: DocumentFiltersType;
  onFiltersChange: (filters: DocumentFiltersType) => void;
  onClearFilters: () => void;
  totalDocuments: number;
  filteredCount: number;
}

export function DocumentFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalDocuments,
  filteredCount
}: DocumentFiltersProps) {
  const documentTypes = getDocumentTypes();
  const typeLabels = getDocumentTypeLabels();

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value
    });
  };

  const handleTypeFilterChange = (value: string) => {
    onFiltersChange({
      ...filters,
      typeFilter: value as DocumentType | 'all'
    });
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as 'name' | 'size' | 'uploadDate'
    });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: value as 'asc' | 'desc'
    });
  };

  const hasActiveFilters = filters.searchQuery || filters.typeFilter !== 'all';

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      {/* Search and Type Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search documents..."
            value={filters.searchQuery}
            onValueChange={handleSearchChange}
            startContent={<FiSearch className="h-4 w-4 text-muted-foreground" />}
            variant="bordered"
            size="sm"
            className="w-full"
            classNames={{
              inputWrapper: "!border-2 !rounded-lg !min-h-[40px]"
            }}
          />
        </div>

        {/* Type Filter */}
        <div className="w-full sm:w-48">
          <Select
            placeholder="All Types"
            selectedKeys={[filters.typeFilter]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleTypeFilterChange(selectedKey);
            }}
            variant="bordered"
            size="sm"
            startContent={<FiFilter className="h-4 w-4 text-muted-foreground" />}
            classNames={{
              trigger: "!border-2 !rounded-lg !min-h-[40px]"
            }}
          >
            <SelectItem key="all" value="all">
              All Types
            </SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {typeLabels[type]}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Sort Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Sort by:
          </span>
          <Select
            placeholder="Sort by"
            selectedKeys={[filters.sortBy]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleSortByChange(selectedKey);
            }}
            variant="bordered"
            size="sm"
            className="w-32"
            classNames={{
              trigger: "!border-2 !rounded-lg !min-h-[36px]"
            }}
          >
            <SelectItem key="name" value="name">
              Name
            </SelectItem>
            <SelectItem key="size" value="size">
              Size
            </SelectItem>
            <SelectItem key="uploadDate" value="uploadDate">
              Date
            </SelectItem>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Order:
          </span>
          <Select
            placeholder="Order"
            selectedKeys={[filters.sortOrder]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleSortOrderChange(selectedKey);
            }}
            variant="bordered"
            size="sm"
            className="w-24"
            classNames={{
              trigger: "!border-2 !rounded-lg !min-h-[36px]"
            }}
          >
            <SelectItem key="asc" value="asc">
              A-Z
            </SelectItem>
            <SelectItem key="desc" value="desc">
              Z-A
            </SelectItem>
          </Select>
        </div>

        {/* Results Count and Clear Filters */}
        <div className="flex items-center justify-between flex-1">
          <div className="text-sm text-muted-foreground">
            {hasActiveFilters ? (
              <>
                Showing {filteredCount} of {totalDocuments} documents
              </>
            ) : (
              <>
                {totalDocuments} document{totalDocuments !== 1 ? 's' : ''} total
              </>
            )}
          </div>

          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<FiX className="h-4 w-4" />}
                onClick={onClearFilters}
                className="ml-4 transition-all duration-200 hover:bg-danger/10"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground">Active filters:</span>
          
          {filters.searchQuery && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
              Search: "{filters.searchQuery}"
            </span>
          )}
          
          {filters.typeFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
              Type: {typeLabels[filters.typeFilter]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
