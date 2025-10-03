# Document Upload Feature Setup

This document outlines the implementation of the document upload feature for ECD-AI.

## Features Implemented

### 1. Document Upload Modal (`DocumentUploadModal.tsx`)
- **Document Type Selection**: Users can select from 5 document types:
  - Invoice
  - Receipt
  - Specification
  - Purchase Order
  - Contract
- **File Selection**: Supports multiple file selection via:
  - Drag and drop interface
  - File browser button
- **File Validation**: 
  - Allowed formats: PDF, DOCX, DOC, JPEG, PNG, GIF, WEBP
  - Maximum file size: 10MB per file
- **File Preview**: Shows selected files with name, size, and delete option
- **Responsive Design**: Works on desktop and mobile devices

### 2. Upload Progress Modal (`DocumentUploadProgress.tsx`)
- **Real-time Progress**: Shows individual file upload progress
- **Overall Progress**: Displays total upload completion percentage
- **Error Handling**: Shows specific error messages for failed uploads
- **Success Confirmation**: Displays success message when all uploads complete
- **Non-dismissible**: Cannot be closed during upload process

### 3. Supabase Integration (`useDocuments.ts`)
- **Real-time Data**: Fetches documents from Supabase database
- **Filtering & Sorting**: Supports client-side and server-side filtering
- **CRUD Operations**: Create, read, update, delete documents
- **User Authentication**: Ensures users only see their own documents
- **Error Handling**: Comprehensive error handling with user feedback

### 4. Database Schema & Triggers
- **Documents Table**: Stores document metadata
- **Storage Bucket**: Secure file storage with RLS policies
- **Automatic Triggers**: Creates database records when files are uploaded
- **User Isolation**: Each user has their own folder structure

## File Structure

```
src/
├── components/documents/
│   ├── DocumentUploadModal.tsx      # Main upload interface
│   ├── DocumentUploadProgress.tsx   # Upload progress tracking
│   └── ...existing components
├── hooks/
│   └── useDocuments.ts              # Supabase integration hook
├── lib/
│   ├── types/documents.ts           # TypeScript interfaces
│   └── utils/toast.ts               # Toast notifications
└── app/documents/
    └── page.tsx                     # Updated documents page
```

## Setup Instructions

### 1. Database Setup
Execute the SQL in `database-setup.sql` in your Supabase SQL Editor:

```bash
# Copy the contents of database-setup.sql and run in Supabase SQL Editor
```

This will create:
- `documents` table with proper schema
- `documents` storage bucket
- Row Level Security (RLS) policies
- Automatic triggers for file upload/delete
- Proper indexes for performance

### 2. Environment Variables
Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. User Authentication
The feature requires users to be authenticated. Ensure your auth system is working before testing uploads.

## Usage Flow

1. **User clicks "Add Document"** → Opens upload modal
2. **Select document type** → Choose from dropdown
3. **Select files** → Drag & drop or browse files
4. **Review selection** → See all selected files with details
5. **Upload** → Click upload button to start process
6. **Progress tracking** → Watch real-time upload progress
7. **Completion** → Success message and automatic refresh

## File Organization

Files are stored in Supabase Storage with this structure:
```
documents/
└── {user_id}/
    ├── invoice/
    │   └── timestamp_random.pdf
    ├── receipt/
    │   └── timestamp_random.jpg
    └── contract/
        └── timestamp_random.docx
```

## Security Features

- **User Isolation**: Users can only access their own files
- **File Type Validation**: Only allowed file types can be uploaded
- **Size Limits**: 10MB maximum per file
- **Authentication Required**: Must be logged in to upload/access files
- **RLS Policies**: Database-level security for all operations

## Error Handling

- **Network Errors**: Retry mechanism and user feedback
- **File Validation**: Clear error messages for invalid files
- **Authentication**: Proper handling of auth failures
- **Storage Limits**: Graceful handling of storage quota issues

## Performance Optimizations

- **Lazy Loading**: Components loaded only when needed
- **Progress Simulation**: Smooth progress bars for better UX
- **Batch Operations**: Efficient bulk upload/delete operations
- **Caching**: SWR-like caching for document lists

## Testing

To test the feature:

1. Ensure you're logged in
2. Navigate to `/documents`
3. Click "Add Document"
4. Select a document type
5. Upload test files (PDF, images, DOCX)
6. Verify files appear in the documents list
7. Test delete functionality

## Troubleshooting

### Common Issues:

1. **Files not appearing**: Check database triggers are created
2. **Upload fails**: Verify storage bucket exists and has correct policies
3. **Permission errors**: Ensure RLS policies are properly configured
4. **Large files**: Check file size limits in both client and Supabase

### Debug Steps:

1. Check browser console for errors
2. Verify Supabase logs in dashboard
3. Test storage bucket access directly
4. Confirm user authentication status

## Future Enhancements

- **File versioning**: Track document versions
- **Bulk operations**: Multi-select for bulk actions
- **File preview**: In-app document preview
- **OCR integration**: Extract text from images/PDFs
- **Collaboration**: Share documents between users
- **Advanced search**: Full-text search within documents