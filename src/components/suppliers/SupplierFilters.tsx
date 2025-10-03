'use client';

import React from 'react';
import { Input, Select, SelectItem, Button, Slider } from '@heroui/react';
import { FiSearch, FiFilter, FiX, FiStar } from 'react-icons/fi';
import { SupplierFilters as SupplierFiltersType } from '../../lib/types/suppliers';
import { getSectors } from '../../lib/mockData/suppliers';

interface SupplierFiltersProps {
  filters: SupplierFiltersType;
  onFiltersChange: (filters: SupplierFiltersType) => void;
  onClearFilters: () => void;
  totalSuppliers: number;
  filteredCount: number;
}

export function SupplierFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalSuppliers,
  filteredCount
}: SupplierFiltersProps) {
  const sectors = getSectors();

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value
    });
  };

  const handleSectorFilterChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sectorFilter: value
    });
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as 'companyName' | 'rating' | 'sector'
    });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: value as 'asc' | 'desc'
    });
  };

  const handleRatingRangeChange = (value: number | number[]) => {
    const range = Array.isArray(value) ? value : [value, value];
    onFiltersChange({
      ...filters,
      ratingRange: {
        min: range[0],
        max: range[1]
      }
    });
  };

  const hasActiveFilters = 
    filters.searchQuery || 
    filters.sectorFilter !== 'all' || 
    filters.ratingRange.min > 0 || 
    filters.ratingRange.max < 100;

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      {/* Search and Sector Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search suppliers..."
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

        {/* Sector Filter */}
        <div className="w-full sm:w-48">
          <Select
            placeholder="All Sectors"
            selectedKeys={[filters.sectorFilter]}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleSectorFilterChange(selectedKey);
            }}
            variant="bordered"
            size="sm"
            startContent={<FiFilter className="h-4 w-4 text-muted-foreground" />}
            classNames={{
              trigger: "!border-2 !rounded-lg !min-h-[40px]"
            }}
          >
            <SelectItem key="all" value="all">
              All Sectors
            </SelectItem>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Rating Range and Sort Controls Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Rating Range */}
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FiStar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Rating Range: {filters.ratingRange.min}% - {filters.ratingRange.max}%
              </span>
            </div>
            <Slider
              size="sm"
              step={5}
              color="primary"
              showSteps={false}
              showOutline={true}
              disableThumbScale={true}
              formatOptions={{ style: 'percent' }}
              tooltipValueFormatOptions={{ style: 'percent' }}
              minValue={0}
              maxValue={100}
              value={[filters.ratingRange.min, filters.ratingRange.max]}
              onChange={handleRatingRangeChange}
              className="max-w-md"
              classNames={{
                track: "border-default-500/30",
                filler: "bg-primary",
                thumb: "bg-primary border-primary",
                label: "text-foreground",
                value: "text-foreground"
              }}
            />
          </div>
        </div>

        {/* Sort Controls */}
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
              <SelectItem key="companyName" value="companyName">
                Company
              </SelectItem>
              <SelectItem key="rating" value="rating">
                Rating
              </SelectItem>
              <SelectItem key="sector" value="sector">
                Sector
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
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <>
              Showing {filteredCount} of {totalSuppliers} suppliers
            </>
          ) : (
            <>
              {totalSuppliers} supplier{totalSuppliers !== 1 ? 's' : ''} total
            </>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            startContent={<FiX className="h-4 w-4" />}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
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
          
          {filters.sectorFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
              Sector: {filters.sectorFilter}
            </span>
          )}

          {(filters.ratingRange.min > 0 || filters.ratingRange.max < 100) && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">
              Rating: {filters.ratingRange.min}% - {filters.ratingRange.max}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}
