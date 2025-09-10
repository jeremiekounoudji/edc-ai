'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { FiMessageCircle, FiMail, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';
import { formatRating, getRatingColor, getRatingBadgeColor, formatCompanyName, getCompanyInitials } from '../../lib/utils/formatters';
import { supplierToasts } from '../../lib/utils/toast';

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
  const handleSelect = (checked: boolean) => {
    onSelect?.(supplier.id, checked);
  };

  const handleContactClick = () => {
    // This will be handled by the ContactPopover component
    console.log('Contact button clicked for:', supplier.companyName);
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
        className={`w-full transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
      >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
            {supplier.avatar ? (
              <img 
                src={supplier.avatar} 
                alt={supplier.companyName}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              getCompanyInitials(supplier.companyName)
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-foreground">
              {formatCompanyName(supplier.companyName, 25)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="text-xs"
              >
                {supplier.sector}
              </Chip>
              <span className="text-xs text-muted-foreground">
                {supplier.domain}
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-end">
          <Chip
            size="sm"
            color={ratingBadgeColor}
            variant="flat"
            className="text-xs font-medium"
          >
            {formatRating(supplier.rating)}
          </Chip>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <div className="space-y-3">
          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {supplier.description}
          </p>

          {/* Company Details */}
          <div className="space-y-1">
            {supplier.establishedYear && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiGlobe className="h-3 w-3" />
                <span>Est. {supplier.establishedYear}</span>
              </div>
            )}
            
            {supplier.address && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiMapPin className="h-3 w-3" />
                <span className="truncate">
                  {supplier.address.city}, {supplier.address.country}
                </span>
              </div>
            )}
          </div>

          {/* Contact Actions */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  variant="light"
                  color="primary"
                  isIconOnly
                  onClick={() => onContact?.(supplier, 'email')}
                  className="h-8 w-8 transition-all duration-200 hover:bg-primary/10"
                >
                  <FiMail className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="sm"
                  variant="light"
                  color="success"
                  isIconOnly
                  onClick={() => onContact?.(supplier, 'phone')}
                  className="h-8 w-8 transition-all duration-200 hover:bg-success/10"
                >
                  <FiPhone className="h-4 w-4" />
                </Button>
              </motion.div>
              {supplier.contact.whatsapp && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="sm"
                    variant="light"
                    color="success"
                    isIconOnly
                    onClick={() => onContact?.(supplier, 'whatsapp')}
                    className="h-8 w-8 transition-all duration-200 hover:bg-success/10"
                  >
                    <FiMessageCircle className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                variant="light"
                color="danger"
                onClick={handleDelete}
                className="h-8 px-2 text-xs transition-all duration-200 hover:bg-danger/10"
              >
                Delete
              </Button>
            </motion.div>
          </div>
        </div>
      </CardBody>
    </Card>
    </motion.div>
  );
}
