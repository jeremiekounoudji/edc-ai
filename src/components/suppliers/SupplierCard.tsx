'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { FiMessageCircle, FiMail, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';
import { formatRating, getRatingColor, getRatingBadgeColor, formatCompanyName, getCompanyInitials } from '../../lib/utils/formatters';
import { supplierToasts } from '../../lib/utils/toast';
import { ContactPopover } from './ContactPopover';

interface SupplierCardProps {
  supplier: Supplier;
  isSelected?: boolean;
  onSelect?: (supplierId: string, selected: boolean) => void;
  onContact?: (supplier: Supplier, contactType: 'email' | 'phone' | 'whatsapp') => void;
  onDelete?: (supplier: Supplier) => void;
  showSelection?: boolean;
}

export function SupplierCard({
  supplier,
  isSelected = false,
  onSelect,
  onContact,
  onDelete,
  showSelection = false
}: SupplierCardProps) {
  const [isContactPopoverOpen, setIsContactPopoverOpen] = useState(false);

  const handleSelect = (checked: boolean) => {
    onSelect?.(supplier.id, checked);
  };

  const handleContactClick = () => {
    setIsContactPopoverOpen(true);
  };

  const handleDelete = () => {
    try {
      onDelete?.(supplier);
      supplierToasts.deleteSuccess(supplier.companyName);
    } catch (error) {
      supplierToasts.deleteError(supplier.companyName);
    }
  };

  const getRatingColorClass = getRatingColor(supplier.rating);
  const ratingBadgeColor = getRatingBadgeColor(supplier.rating);

  return (
    <motion.div
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Card 
        className={`w-full h-80 transition-all duration-200 hover:shadow-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <CardBody className="p-6 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {showSelection && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleSelect(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              )}
              
              {/* Company Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xl">
                {supplier.avatar ? (
                  <img 
                    src={supplier.avatar} 
                    alt={supplier.companyName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  getCompanyInitials(supplier.companyName)
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-foreground">
                  {formatCompanyName(supplier.companyName, 20)}
                </h3>
                <span className="text-sm text-muted-foreground">
                  @{supplier.domain.toLowerCase().replace(/[^a-z0-9]/g, '')}
                </span>
              </div>
            </div>

            {/* Contact Button with Popover */}
            <ContactPopover
              supplier={supplier}
              isOpen={isContactPopoverOpen}
              onOpenChange={setIsContactPopoverOpen}
              trigger={
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="px-4 py-2 rounded-full font-medium transition-all duration-200"
                    onClick={handleContactClick}
                  >
                    Contact
                  </Button>
                </motion.div>
              }
            />
          </div>

          {/* Bio Section */}
          <div className="mb-4 flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {supplier.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="text-xs"
              >
                {supplier.sector}
              </Chip>
              <span className="text-xs text-muted-foreground">
                {supplier.establishedYear && `Est. ${supplier.establishedYear}`}
              </span>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{supplier.rating}%</span> Recommended
              </div>
              {supplier.address && (
                <div className="text-sm text-muted-foreground">
                  <FiMapPin className="h-3 w-3 inline mr-1" />
                  {supplier.address.city}
                </div>
              )}
            </div>

            {/* Delete Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                variant="light"
                color="danger"
                onClick={handleDelete}
                className="text-xs transition-all duration-200 hover:bg-danger/10"
              >
                Delete
              </Button>
            </motion.div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
