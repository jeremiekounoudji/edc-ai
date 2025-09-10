'use client';

import { toast } from '@heroui/react';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },
};

// Specific toast messages for common actions
export const documentToasts = {
  downloadSuccess: (fileName: string) => {
    showToast.success(`Downloaded ${fileName}`, {
      description: 'File has been downloaded successfully',
    });
  },

  downloadError: (fileName: string) => {
    showToast.error(`Failed to download ${fileName}`, {
      description: 'Please try again or contact support if the issue persists',
    });
  },

  deleteSuccess: (fileName: string) => {
    showToast.success(`Deleted ${fileName}`, {
      description: 'Document has been removed from your collection',
    });
  },

  deleteError: (fileName: string) => {
    showToast.error(`Failed to delete ${fileName}`, {
      description: 'Please try again or contact support if the issue persists',
    });
  },

  bulkDownloadSuccess: (count: number) => {
    showToast.success(`Downloaded ${count} documents`, {
      description: 'All selected documents have been downloaded',
    });
  },

  bulkDeleteSuccess: (count: number) => {
    showToast.success(`Deleted ${count} documents`, {
      description: 'All selected documents have been removed',
    });
  },

  bulkActionError: (action: string, count: number) => {
    showToast.error(`Failed to ${action} ${count} documents`, {
      description: 'Some documents could not be processed. Please try again',
    });
  },
};

export const supplierToasts = {
  contactSuccess: (companyName: string, method: string) => {
    showToast.success(`Contacted ${companyName}`, {
      description: `Opened ${method} application to contact the supplier`,
    });
  },

  contactError: (companyName: string, method: string) => {
    showToast.error(`Failed to contact ${companyName}`, {
      description: `Could not open ${method} application. Please try again`,
    });
  },

  deleteSuccess: (companyName: string) => {
    showToast.success(`Deleted ${companyName}`, {
      description: 'Supplier has been removed from your contacts',
    });
  },

  deleteError: (companyName: string) => {
    showToast.error(`Failed to delete ${companyName}`, {
      description: 'Please try again or contact support if the issue persists',
    });
  },

  bulkEmailSuccess: (count: number) => {
    showToast.success(`Emailed ${count} suppliers`, {
      description: 'Email application opened for all selected suppliers',
    });
  },

  bulkCallSuccess: (count: number) => {
    showToast.success(`Called ${count} suppliers`, {
      description: 'Phone application opened for all selected suppliers',
    });
  },

  bulkDeleteSuccess: (count: number) => {
    showToast.success(`Deleted ${count} suppliers`, {
      description: 'All selected suppliers have been removed',
    });
  },

  bulkActionError: (action: string, count: number) => {
    showToast.error(`Failed to ${action} ${count} suppliers`, {
      description: 'Some suppliers could not be processed. Please try again',
    });
  },
};

export const filterToasts = {
  filtersCleared: () => {
    showToast.info('Filters cleared', {
      description: 'All filters have been reset to default values',
    });
  },

  searchNoResults: (query: string) => {
    showToast.warning('No results found', {
      description: `No documents found for "${query}". Try different keywords`,
    });
  },

  filterApplied: (filterType: string, value: string) => {
    showToast.info(`${filterType} filter applied`, {
      description: `Showing results for: ${value}`,
    });
  },
};

export const navigationToasts = {
  tabSwitched: (tabName: string) => {
    showToast.info(`Switched to ${tabName}`, {
      description: 'You are now viewing the selected section',
      duration: 2000,
    });
  },

  navigationError: () => {
    showToast.error('Navigation failed', {
      description: 'Could not switch to the selected section. Please try again',
    });
  },
};
