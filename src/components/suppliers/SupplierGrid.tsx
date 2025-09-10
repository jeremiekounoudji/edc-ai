'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Supplier, SupplierSelection } from '../../lib/types/suppliers';
import { SupplierCard } from './SupplierCard';

interface SupplierGridProps {
  suppliers: Supplier[];
  selectedIds: string[];
  onSelectSupplier: (supplierId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onContact: (supplier: Supplier, contactType: 'email' | 'phone' | 'whatsapp') => void;
  onDelete: (supplier: Supplier) => void;
  showSelection?: boolean;
  groupBySector?: boolean;
}

export function SupplierGrid({
  suppliers,
  selectedIds,
  onSelectSupplier,
  onSelectAll,
  onContact,
  onDelete,
  showSelection = false,
  groupBySector = false
}: SupplierGridProps) {
  // Group suppliers by sector if groupBySector is true
  const groupedSuppliers = React.useMemo(() => {
    if (!groupBySector) {
      return [{ sector: 'all', suppliers, count: suppliers.length }];
    }

    const groups: Array<{ sector: string; suppliers: Supplier[]; count: number }> = [];
    const sectorMap = new Map<string, Supplier[]>();

    suppliers.forEach(supplier => {
      const sector = supplier.sector;
      if (!sectorMap.has(sector)) {
        sectorMap.set(sector, []);
      }
      sectorMap.get(sector)!.push(supplier);
    });

    // Sort sectors alphabetically
    const sortedSectors = Array.from(sectorMap.keys()).sort();
    
    sortedSectors.forEach(sector => {
      const sectorSuppliers = sectorMap.get(sector)!;
      groups.push({
        sector,
        suppliers: sectorSuppliers,
        count: sectorSuppliers.length
      });
    });

    return groups;
  }, [suppliers, groupBySector]);

  const isAllSelected = selectedIds.length === suppliers.length && suppliers.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < suppliers.length;

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

  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl text-muted-foreground mb-4">🏢</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No suppliers found</h3>
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
                ? `${selectedIds.length} of ${suppliers.length} selected`
                : `Select all ${suppliers.length} suppliers`
              }
            </span>
          </div>
        </div>
      )}

      {/* Supplier Groups */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {groupedSuppliers.map((group) => (
          <motion.div key={group.sector} variants={itemVariants}>
            {/* Group Header */}
            {groupBySector && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {group.sector} ({group.count})
                </h2>
              </div>
            )}

            {/* Supplier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.suppliers.map((supplier) => (
                <motion.div key={supplier.id} variants={itemVariants}>
                  <SupplierCard
                    supplier={supplier}
                    isSelected={selectedIds.includes(supplier.id)}
                    onSelect={onSelectSupplier}
                    onContact={onContact}
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
