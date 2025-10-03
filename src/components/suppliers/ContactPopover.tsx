'use client';

import React from 'react';
import { Button } from '@heroui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { FiMail, FiPhone, FiMessageCircle, FiCopy, FiExternalLink } from 'react-icons/fi';
import { Supplier, ContactOption } from '../../lib/types/suppliers';
import { formatPhoneNumber } from '../../lib/utils/formatters';
import { supplierToasts } from '../../lib/utils/toast';

interface ContactPopoverProps {
  supplier: Supplier;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export function ContactPopover({
  supplier,
  isOpen,
  onOpenChange,
  trigger
}: ContactPopoverProps) {
  const contactOptions: ContactOption[] = [
    {
      type: 'email',
      label: 'Email',
      value: supplier.contact.email,
      icon: 'FiMail'
    },
    {
      type: 'phone',
      label: 'Phone',
      value: supplier.contact.phone,
      icon: 'FiPhone'
    }
  ];

  // Add WhatsApp if available
  if (supplier.contact.whatsapp) {
    contactOptions.push({
      type: 'whatsapp',
      label: 'WhatsApp',
      value: supplier.contact.whatsapp,
      icon: 'FiMessageCircle'
    });
  }

  const handleContactAction = (option: ContactOption) => {
    try {
      switch (option.type) {
        case 'email':
          // Open email client
          window.open(`mailto:${option.value}`, '_blank');
          supplierToasts.contactSuccess(supplier.companyName, 'email');
          break;
        case 'phone':
          // Open phone dialer
          window.open(`tel:${option.value}`, '_blank');
          supplierToasts.contactSuccess(supplier.companyName, 'phone');
          break;
        case 'whatsapp':
          // Open WhatsApp
          const phoneNumber = option.value.replace(/\D/g, ''); // Remove non-digits
          window.open(`https://wa.me/${phoneNumber}`, '_blank');
          supplierToasts.contactSuccess(supplier.companyName, 'WhatsApp');
          break;
      }
    } catch (error) {
      supplierToasts.contactError(supplier.companyName, option.type);
    }
    onOpenChange(false);
  };

  const handleCopyToClipboard = (value: string, type: string) => {
    navigator.clipboard.writeText(value).then(() => {
      supplierToasts.contactSuccess(supplier.companyName, `${type} copied`);
    }).catch(err => {
      supplierToasts.contactError(supplier.companyName, 'copy to clipboard');
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FiMail':
        return <FiMail className="h-4 w-4" />;
      case 'FiPhone':
        return <FiPhone className="h-4 w-4" />;
      case 'FiMessageCircle':
        return <FiMessageCircle className="h-4 w-4" />;
      default:
        return <FiMail className="h-4 w-4" />;
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'primary';
      case 'phone':
        return 'success';
      case 'whatsapp':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Popover 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      placement="bottom-start"
      showArrow
      backdrop="transparent"
    >
      <PopoverTrigger>
        <div onClick={() => onOpenChange(true)}>
          {trigger}
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-foreground">
              Contact {supplier.companyName}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your preferred contact method
            </p>
          </div>

          {/* Contact Options */}
          <div className="space-y-3">
            {contactOptions.map((option) => (
              <div key={option.type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-full bg-${getButtonColor(option.type)}/10`}>
                    {getIcon(option.icon)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.type === 'phone' ? formatPhoneNumber(option.value) : option.value}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Copy Button */}
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onClick={() => handleCopyToClipboard(option.value, option.label)}
                    className="h-8 w-8"
                  >
                    <FiCopy className="h-3 w-3" />
                  </Button>
                  
                  {/* Action Button */}
                  <Button
                    size="sm"
                    color={getButtonColor(option.type)}
                    variant="solid"
                    startContent={<FiExternalLink className="h-3 w-3" />}
                    onClick={() => handleContactAction(option)}
                    className="h-8 px-3 text-xs"
                  >
                    {option.type === 'email' ? 'Email' : 
                     option.type === 'phone' ? 'Call' : 'WhatsApp'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          {supplier.website && (
            <div className="pt-3 border-t border-border">
              <Button
                size="sm"
                variant="light"
                color="default"
                startContent={<FiExternalLink className="h-3 w-3" />}
                onClick={() => window.open(supplier.website, '_blank')}
                className="w-full text-xs"
              >
                Visit Website
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
