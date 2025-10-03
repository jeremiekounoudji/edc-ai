'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { FiMessageCircle, FiMail, FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';
import { formatRating, getRatingColor, getRatingBadgeColor, formatCompanyName, getCompanyInitials } from '../../lib/utils/formatters';
import { supplierToasts } from '../../lib/utils/toast';
import { ContactPopover } from './ContactPopover';
import { SupplierDetailsModal } from './SupplierDetailsModal';

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSelect = (checked: boolean) => {
    onSelect?.(supplier.id, checked);
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
         className={`w-full transition-all duration-200 hover:shadow-lg bg-slate-50 border border-border dark:bg-black/80 min-h-[240px] ${
           isSelected ? 'ring-2 ring-primary' : ''
         }`}
       >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 pt-4">
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
                 variant="solid"
                 color="primary"
                 className="text-xs"
               >
                 {supplier.sector}
               </Chip>
             </div>
           </div>
        </div>

      </CardHeader>
      
       <CardBody className="pt-0 px-4 pb-4">
         <div className="space-y-3">
           {/* Domain */}
           <div className="text-xs text-muted-foreground">
             {supplier.domain}
           </div>

           {/* Description */}
           <p className="text-sm text-muted-foreground line-clamp-2">
             {supplier.description}
           </p>

           {/* View Details Button */}
           <motion.div
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
           >
             <button
               type="button"
               onClick={() => setIsDetailsModalOpen(true)}
               className="w-full text-xs font-medium transition-all duration-200 bg-warning text-warning-foreground hover:bg-warning/90 rounded-md px-3 py-2"
             >
               View Details
             </button>
           </motion.div>

           {/* Company Details */}
           <div className="space-y-2">
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

           {/* Card Footer */}
           <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
             {/* Score */}
             <div className="text-sm text-muted-foreground">
               <span className="font-semibold text-foreground">{supplier.rating}%</span>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-2">
               {/* Contact Button */}
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
                       variant="solid"
                       color="success"
                       className="px-3 py-1 text-xs transition-all duration-200"
                     >
                       Contact
                     </Button>
                   </motion.div>
                 }
               />

               {/* Delete Button */}
               <motion.div
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 <button
                   type="button"
                   onClick={handleDelete}
                   className="px-3 py-1 text-xs transition-all duration-200 bg-danger text-danger-foreground hover:bg-danger/90 rounded-md"
                 >
                   Delete
                 </button>
               </motion.div>
             </div>
           </div>
         </div>
       </CardBody>
    </Card>

    {/* Supplier Details Modal */}
    <SupplierDetailsModal
      supplier={supplier}
      isOpen={isDetailsModalOpen}
      onClose={() => setIsDetailsModalOpen(false)}
    />
    </motion.div>
  );
}
