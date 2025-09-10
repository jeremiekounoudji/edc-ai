export interface Supplier {
  id: string;
  companyName: string;
  description: string;
  sector: string;
  domain: string;
  rating: number; // percentage (0-100)
  avatar?: string;
  contact: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  website?: string;
  establishedYear?: number;
}

export interface SupplierFilters {
  searchQuery: string;
  ratingRange: {
    min: number;
    max: number;
  };
  sectorFilter: string | 'all';
  sortBy: 'companyName' | 'rating' | 'sector';
  sortOrder: 'asc' | 'desc';
}

export interface SupplierPagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SupplierSelection {
  selectedIds: string[];
  isAllSelected: boolean;
}

export interface ContactOption {
  type: 'email' | 'phone' | 'whatsapp';
  label: string;
  value: string;
  icon: string;
}
