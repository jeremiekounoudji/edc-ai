'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Document, DocumentType, DocumentFilters } from '../lib/types/documents';

interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  deleteDocuments: (documentIds: string[]) => Promise<void>;
}

export const useDocuments = (filters?: DocumentFilters): UseDocumentsReturn => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.typeFilter && filters.typeFilter !== 'all') {
        query = query.eq('type', filters.typeFilter);
      }

      if (filters?.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform the data to match our Document interface
      const transformedDocuments: Document[] = (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type as DocumentType,
        size: doc.size,
        uploadDate: new Date(doc.created_at),
        url: doc.url,
        description: doc.description
      }));

      // Apply client-side sorting if needed
      if (filters?.sortBy) {
        transformedDocuments.sort((a, b) => {
          let aValue: string | number | Date;
          let bValue: string | number | Date;

          switch (filters.sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'size':
              aValue = a.size;
              bValue = b.size;
              break;
            case 'uploadDate':
              aValue = a.uploadDate;
              bValue = b.uploadDate;
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

      setDocuments(transformedDocuments);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      // First get the document to get the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('url, user_id')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Verify user owns the document
      if (document.user_id !== user.id) {
        throw new Error('Unauthorized to delete this document');
      }

      // Extract file path from URL (remove the base URL part)
      const urlParts = document.url.split('/storage/v1/object/public/documents/');
      const filePath = urlParts.length > 1 ? urlParts[1] : null;
      
      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([filePath]);

        if (storageError) {
          console.warn('Storage deletion error:', storageError);
          // Continue with database deletion even if storage fails
        }
      }

      // Delete from database (this will be handled by the trigger, but we can also do it manually)
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  }, []);

  const deleteDocuments = useCallback(async (documentIds: string[]) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get documents to get file paths and verify ownership
      const { data: documents, error: fetchError } = await supabase
        .from('documents')
        .select('id, url, user_id')
        .in('id', documentIds);

      if (fetchError) {
        throw fetchError;
      }

      // Verify user owns all documents
      const unauthorizedDocs = documents?.filter(doc => doc.user_id !== user.id) || [];
      if (unauthorizedDocs.length > 0) {
        throw new Error('Unauthorized to delete some documents');
      }

      // Extract file paths and delete from storage
      const filePaths = documents
        ?.map(doc => {
          const urlParts = doc.url.split('/storage/v1/object/public/documents/');
          return urlParts.length > 1 ? urlParts[1] : null;
        })
        .filter(Boolean) || [];

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove(filePaths);

        if (storageError) {
          console.warn('Storage deletion error:', storageError);
          // Continue with database deletion even if storage fails
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .in('id', documentIds);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setDocuments(prev => prev.filter(doc => !documentIds.includes(doc.id)));
    } catch (err) {
      console.error('Error deleting documents:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    deleteDocument,
    deleteDocuments
  };
};