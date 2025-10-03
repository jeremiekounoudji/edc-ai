'use client';

import { addToast } from '@heroui/toast';

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
    try {
      addToast({
        type: 'success',
        title: options?.title || 'Success',
        description: options?.description || message,
        duration: options?.duration || 4000,
      });
    } catch (error) {
      console.log('Success:', message);
    }
  },

  error: (message: string, options?: ToastOptions) => {
    try {
      addToast({
        type: 'error',
        title: options?.title || 'Error',
        description: options?.description || message,
        duration: options?.duration || 6000,
      });
    } catch (error) {
      console.error('Error:', message);
    }
  },

  warning: (message: string, options?: ToastOptions) => {
    try {
      addToast({
        type: 'warning',
        title: options?.title || 'Warning',
        description: options?.description || message,
        duration: options?.duration || 5000,
      });
    } catch (error) {
      console.warn('Warning:', message);
    }
  },

  info: (message: string, options?: ToastOptions) => {
    try {
      addToast({
        type: 'info',
        title: options?.title || 'Info',
        description: options?.description || message,
        duration: options?.duration || 4000,
      });
    } catch (error) {
      console.info('Info:', message);
    }
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

  uploadSuccess: (count: number) => {
    showToast.success(`Uploaded ${count} ${count === 1 ? 'document' : 'documents'}`, {
      description: 'All files have been uploaded successfully',
    });
  },

  uploadError: (fileName: string) => {
    showToast.error(`Failed to upload ${fileName}`, {
      description: 'Please check your connection and try again',
    });
  },

  bulkActionSuccess: (action: string, count: number) => {
    showToast.success(`Successfully ${action}ed ${count} ${count === 1 ? 'document' : 'documents'}`, {
      description: `All selected documents have been ${action}ed`,
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

  createSuccess: (companyName: string) => {
    showToast.success(`Created ${companyName}`, {
      description: 'Supplier has been added to your network',
    });
  },

  createError: (companyName: string) => {
    showToast.error(`Failed to create ${companyName}`, {
      description: 'Please check your information and try again',
    });
  },

  updateSuccess: (companyName: string) => {
    showToast.success(`Updated ${companyName}`, {
      description: 'Supplier information has been updated',
    });
  },

  updateError: (companyName: string) => {
    showToast.error(`Failed to update ${companyName}`, {
      description: 'Please try again or contact support if the issue persists',
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
