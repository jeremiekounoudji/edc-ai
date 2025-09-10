export type DocumentType = 'invoice' | 'receipt' | 'specification' | 'purchase_order' | 'contract';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number; // in bytes
  uploadDate: Date;
  url: string; // download URL
  description?: string;
}

export interface DocumentFilters {
  searchQuery: string;
  typeFilter: DocumentType | 'all';
  sortBy: 'name' | 'size' | 'uploadDate';
  sortOrder: 'asc' | 'desc';
}

export interface DocumentGroup {
  type: DocumentType;
  documents: Document[];
  count: number;
}

export interface DocumentPagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface DocumentSelection {
  selectedIds: string[];
  isAllSelected: boolean;
}
