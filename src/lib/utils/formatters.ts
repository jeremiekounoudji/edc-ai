/**
 * Utility functions for formatting data in the Documents and Suppliers management system
 */

/**
 * Format file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.2 MB", "500 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date to a readable string
 * @param date - Date object or date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options: {
    includeTime?: boolean;
    format?: 'short' | 'medium' | 'long';
  } = {}
): string => {
  const { includeTime = false, format = 'medium' } = options;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  return dateObj.toLocaleDateString('en-US', formatOptions);
};

/**
 * Format relative time (e.g., "2 days ago", "1 week ago")
 * @param date - Date object or date string
 * @returns Relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format rating percentage to display string
 * @param rating - Rating percentage (0-100)
 * @returns Formatted rating string (e.g., "87% Recommended")
 */
export const formatRating = (rating: number): string => {
  if (rating < 0 || rating > 100) {
    return 'Invalid Rating';
  }

  return `${rating}% Recommended`;
};

/**
 * Get rating color based on percentage
 * @param rating - Rating percentage (0-100)
 * @returns Color class name for styling
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 90) return 'text-green-600';
  if (rating >= 80) return 'text-green-500';
  if (rating >= 70) return 'text-yellow-500';
  if (rating >= 60) return 'text-orange-500';
  return 'text-red-500';
};

/**
 * Get rating badge color for Hero UI components
 * @param rating - Rating percentage (0-100)
 * @returns Hero UI color variant
 */
export const getRatingBadgeColor = (rating: number): 'success' | 'warning' | 'danger' | 'default' => {
  if (rating >= 80) return 'success';
  if (rating >= 60) return 'warning';
  return 'danger';
};

/**
 * Format company name for display (truncate if too long)
 * @param name - Company name
 * @param maxLength - Maximum length before truncation
 * @returns Formatted company name
 */
export const formatCompanyName = (name: string, maxLength: number = 30): string => {
  if (name.length <= maxLength) {
    return name;
  }
  return name.substring(0, maxLength - 3) + '...';
};

/**
 * Format phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for international numbers
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if doesn't match expected patterns
  return phone;
};

/**
 * Generate initials from company name
 * @param companyName - Company name
 * @returns Company initials (e.g., "TC" for "TechCorp Solutions")
 */
export const getCompanyInitials = (companyName: string): string => {
  const words = companyName.trim().split(' ');
  
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return words
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};

/**
 * Format document type for display
 * @param type - Document type
 * @returns Formatted document type string
 */
export const formatDocumentType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension (e.g., "pdf", "docx")
 */
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  return filename.substring(lastDotIndex + 1).toLowerCase();
};

/**
 * Get file type icon based on extension
 * @param filename - File name
 * @returns Icon name for the file type
 */
export const getFileTypeIcon = (filename: string): string => {
  const extension = getFileExtension(filename);
  
  const iconMap: Record<string, string> = {
    pdf: 'FiFileText',
    doc: 'FiFileText',
    docx: 'FiFileText',
    xls: 'FiFileText',
    xlsx: 'FiFileText',
    ppt: 'FiFileText',
    pptx: 'FiFileText',
    txt: 'FiFileText',
    csv: 'FiFileText',
    zip: 'FiArchive',
    rar: 'FiArchive',
    '7z': 'FiArchive',
    jpg: 'FiImage',
    jpeg: 'FiImage',
    png: 'FiImage',
    gif: 'FiImage',
    svg: 'FiImage',
  };
  
  return iconMap[extension] || 'FiFile';
};
