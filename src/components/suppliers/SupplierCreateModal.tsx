'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Slider
} from '@heroui/react';
import { FiPlus, FiX } from 'react-icons/fi';
import { Supplier } from '../../lib/types/suppliers';

interface SupplierCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
}

const sectors = [
  'Technology',
  'Healthcare',
  'Construction',
  'Manufacturing',
  'Finance',
  'Retail',
  'Transportation',
  'Energy',
  'Agriculture',
  'Education',
  'Other'
];

export const SupplierCreateModal: React.FC<SupplierCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateSupplier
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    sector: 'Technology',
    domain: '',
    rating: 50,
    contact: {
      email: '',
      phone: '',
      whatsapp: ''
    },
    address: {
      street: '',
      city: '',
      country: '',
      postalCode: ''
    },
    website: '',
    establishedYear: new Date().getFullYear()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    }

    if (!formData.contact.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contact.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (formData.establishedYear < 1800 || formData.establishedYear > new Date().getFullYear()) {
      newErrors.establishedYear = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const supplierData: Omit<Supplier, 'id'> = {
        companyName: formData.companyName.trim(),
        description: formData.description.trim(),
        sector: formData.sector,
        domain: formData.domain.trim(),
        rating: formData.rating,
        contact: {
          email: formData.contact.email.trim(),
          phone: formData.contact.phone.trim(),
          whatsapp: formData.contact.whatsapp.trim() || undefined
        },
        address: formData.address.street.trim() ? {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          country: formData.address.country.trim(),
          postalCode: formData.address.postalCode.trim()
        } : undefined,
        website: formData.website.trim() || undefined,
        establishedYear: formData.establishedYear
      };

      await onCreateSupplier(supplierData);
      handleClose();
    } catch (error) {
      console.error('Error creating supplier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        companyName: '',
        description: '',
        sector: 'Technology',
        domain: '',
        rating: 50,
        contact: {
          email: '',
          phone: '',
          whatsapp: ''
        },
        address: {
          street: '',
          city: '',
          country: '',
          postalCode: ''
        },
        website: '',
        establishedYear: new Date().getFullYear()
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Add New Supplier</h2>
          <p className="text-sm text-muted-foreground">
            Create a new supplier profile for your network
          </p>
        </ModalHeader>
        
        <ModalBody className="gap-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <Input
              label="Company Name"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              isInvalid={!!errors.companyName}
              errorMessage={errors.companyName}
              isRequired
            />

            <Textarea
              label="Description"
              placeholder="Describe the company's services and expertise"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              isInvalid={!!errors.description}
              errorMessage={errors.description}
              isRequired
              minRows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Sector"
                selectedKeys={[formData.sector]}
                onSelectionChange={(keys) => {
                  const sector = Array.from(keys)[0] as string;
                  setFormData(prev => ({ ...prev, sector }));
                }}
              >
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Domain"
                placeholder="company.com"
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                isInvalid={!!errors.domain}
                errorMessage={errors.domain}
                isRequired
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Rating: {formData.rating}%
              </label>
              <Slider
                value={formData.rating}
                onChange={(value) => setFormData(prev => ({ ...prev, rating: value as number }))}
                minValue={0}
                maxValue={100}
                step={5}
                className="max-w-md"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="contact@company.com"
                value={formData.contact.email}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  contact: { ...prev.contact, email: e.target.value }
                }))}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                isRequired
              />

              <Input
                label="Phone"
                placeholder="+1-555-0123"
                value={formData.contact.phone}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  contact: { ...prev.contact, phone: e.target.value }
                }))}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
                isRequired
              />
            </div>

            <Input
              label="WhatsApp (Optional)"
              placeholder="+1-555-0123"
              value={formData.contact.whatsapp}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact: { ...prev.contact, whatsapp: e.target.value }
              }))}
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website (Optional)"
                placeholder="https://company.com"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />

              <Input
                label="Established Year"
                type="number"
                placeholder="2020"
                value={formData.establishedYear.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  establishedYear: parseInt(e.target.value) || new Date().getFullYear()
                }))}
                isInvalid={!!errors.establishedYear}
                errorMessage={errors.establishedYear}
              />
            </div>

            {/* Address (Optional) */}
            <div className="space-y-3">
              <h4 className="text-md font-medium">Address (Optional)</h4>
              
              <Input
                label="Street"
                placeholder="123 Business Street"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, street: e.target.value }
                }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  placeholder="New York"
                  value={formData.address.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, city: e.target.value }
                  }))}
                />

                <Input
                  label="Country"
                  placeholder="USA"
                  value={formData.address.country}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, country: e.target.value }
                  }))}
                />

                <Input
                  label="Postal Code"
                  placeholder="10001"
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, postalCode: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            startContent={!isLoading && <FiPlus className="h-4 w-4" />}
          >
            {isLoading ? 'Creating...' : 'Create Supplier'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};