'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Supplier, SupplierFilters } from '../lib/types/suppliers';

interface UseSupplierReturn {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteSupplier: (supplierId: string) => Promise<void>;
  deleteSuppliers: (supplierIds: string[]) => Promise<void>;
  createSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (supplierId: string, updates: Partial<Supplier>) => Promise<void>;
}

export function useSuppliers(filters?: SupplierFilters): UseSupplierReturn {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.sectorFilter && filters.sectorFilter !== 'all') {
        query = query.eq('sector', filters.sectorFilter);
      }

      if (filters?.searchQuery) {
        query = query.or(`company_name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,sector.ilike.%${filters.searchQuery}%,domain.ilike.%${filters.searchQuery}%`);
      }

      if (filters?.ratingRange) {
        query = query
          .gte('rating', filters.ratingRange.min)
          .lte('rating', filters.ratingRange.max);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our Supplier interface
      const transformedSuppliers: Supplier[] = (data || []).map(supplier => ({
        id: supplier.id,
        companyName: supplier.company_name,
        description: supplier.description,
        sector: supplier.sector,
        domain: supplier.domain,
        rating: supplier.rating,
        avatar: supplier.avatar,
        contact: {
          email: supplier.contact_email,
          phone: supplier.contact_phone,
          whatsapp: supplier.contact_whatsapp
        },
        address: supplier.address ? {
          street: supplier.address.street,
          city: supplier.address.city,
          country: supplier.address.country,
          postalCode: supplier.address.postalCode
        } : undefined,
        website: supplier.website,
        establishedYear: supplier.established_year
      }));

      // Apply client-side sorting if needed
      if (filters?.sortBy) {
        transformedSuppliers.sort((a, b) => {
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
      }

      setSuppliers(transformedSuppliers);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const deleteSupplier = useCallback(async (supplierId: string) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId)
        .eq('user_id', user.id); // Ensure user can only delete their own suppliers

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
    } catch (err) {
      console.error('Error deleting supplier:', err);
      throw err;
    }
  }, []);

  const deleteSuppliers = useCallback(async (supplierIds: string[]) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .in('id', supplierIds)
        .eq('user_id', user.id); // Ensure user can only delete their own suppliers

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setSuppliers(prev => prev.filter(supplier => !supplierIds.includes(supplier.id)));
    } catch (err) {
      console.error('Error deleting suppliers:', err);
      throw err;
    }
  }, []);

  const createSupplier = useCallback(async (supplierData: Omit<Supplier, 'id'>) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Transform data for database
      const dbSupplier = {
        company_name: supplierData.companyName,
        description: supplierData.description,
        sector: supplierData.sector,
        domain: supplierData.domain,
        rating: supplierData.rating,
        avatar: supplierData.avatar,
        contact_email: supplierData.contact.email,
        contact_phone: supplierData.contact.phone,
        contact_whatsapp: supplierData.contact.whatsapp,
        address: supplierData.address,
        website: supplierData.website,
        established_year: supplierData.establishedYear,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('suppliers')
        .insert([dbSupplier])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform back and add to local state
      const newSupplier: Supplier = {
        id: data.id,
        companyName: data.company_name,
        description: data.description,
        sector: data.sector,
        domain: data.domain,
        rating: data.rating,
        avatar: data.avatar,
        contact: {
          email: data.contact_email,
          phone: data.contact_phone,
          whatsapp: data.contact_whatsapp
        },
        address: data.address,
        website: data.website,
        establishedYear: data.established_year
      };

      setSuppliers(prev => [newSupplier, ...prev]);
    } catch (err) {
      console.error('Error creating supplier:', err);
      throw err;
    }
  }, []);

  const updateSupplier = useCallback(async (supplierId: string, updates: Partial<Supplier>) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Transform updates for database
      const dbUpdates: any = {};
      if (updates.companyName) dbUpdates.company_name = updates.companyName;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.sector) dbUpdates.sector = updates.sector;
      if (updates.domain) dbUpdates.domain = updates.domain;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.avatar) dbUpdates.avatar = updates.avatar;
      if (updates.contact?.email) dbUpdates.contact_email = updates.contact.email;
      if (updates.contact?.phone) dbUpdates.contact_phone = updates.contact.phone;
      if (updates.contact?.whatsapp) dbUpdates.contact_whatsapp = updates.contact.whatsapp;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.website) dbUpdates.website = updates.website;
      if (updates.establishedYear) dbUpdates.established_year = updates.establishedYear;

      const { data, error } = await supabase
        .from('suppliers')
        .update(dbUpdates)
        .eq('id', supplierId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, ...updates }
          : supplier
      ));
    } catch (err) {
      console.error('Error updating supplier:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
    deleteSupplier,
    deleteSuppliers,
    createSupplier,
    updateSupplier
  };
}