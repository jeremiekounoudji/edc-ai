# Task List: Documents & Suppliers Management Implementation

## Relevant Files

- `src/app/documents/page.tsx` - Main documents page component that replaces chat area
- `src/app/suppliers/page.tsx` - Main suppliers page component that replaces chat area
- `src/components/documents/DocumentGrid.tsx` - Grid layout component for displaying documents
- `src/components/documents/DocumentCard.tsx` - Individual document card component
- `src/components/documents/DocumentFilters.tsx` - Search and filter controls for documents
- `src/components/suppliers/SupplierGrid.tsx` - Grid layout component for displaying suppliers
- `src/components/suppliers/SupplierCard.tsx` - Individual supplier card component
- `src/components/suppliers/SupplierFilters.tsx` - Search and filter controls for suppliers
- `src/components/suppliers/ContactPopover.tsx` - Contact options popover component
- `src/lib/mockData/documents.ts` - Mock document data and utilities ✅
- `src/lib/mockData/suppliers.ts` - Mock supplier data and utilities ✅
- `src/lib/types/documents.ts` - TypeScript interfaces for document types ✅
- `src/lib/types/suppliers.ts` - TypeScript interfaces for supplier types ✅
- `src/hooks/useDocuments.ts` - Custom hook for document state management
- `src/hooks/useSuppliers.ts` - Custom hook for supplier state management
- `src/components/layout/MainLayout.tsx` - Update to handle tab switching between chat/documents/suppliers
- `src/lib/utils/formatters.ts` - Utility functions for data formatting ✅
- `src/lib/utils/formatters.test.ts` - Unit tests for formatters ✅
- `src/lib/mockData/documents.test.ts` - Unit tests for documents mock data ✅
- `src/lib/mockData/suppliers.test.ts` - Unit tests for suppliers mock data ✅

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `DocumentCard.tsx` and `DocumentCard.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- Use Playwright MCP for UI testing to verify component rendering, interactions, and responsive behavior.

## Tasks

- [x] 1.0 Setup Data Models and Mock Data
  - [x] 1.1 Create TypeScript interfaces for Document and Supplier types in `src/lib/types/`
  - [x] 1.2 Generate mock document data with various file types (PDF, Word, Excel, PowerPoint) in `src/lib/mockData/documents.ts`
  - [x] 1.3 Generate mock supplier data with company info, ratings, and contact details in `src/lib/mockData/suppliers.ts`
  - [x] 1.4 Create utility functions for data formatting (file size formatting, date formatting, rating display)
  - [x] 1.5 ~~Test mock data structure and utility functions with unit tests~~ (Skipped per user request)
- [x] 2.0 Create Document Management Components
  - [x] 2.1 Build DocumentCard component with filename, size, download/delete buttons using Hero UI Card
  - [x] 2.2 Implement DocumentGrid component with responsive grid layout and type-based grouping
  - [x] 2.3 Create DocumentFilters component with search input and type filter dropdown
  - [x] 2.4 Add pagination component for documents (20 items per page)
  - [x] 2.5 Implement bulk selection functionality for multiple documents
  - [x] 2.6 Add confirmation dialogs for delete operations
  - [x] 2.7 Create main Documents page component that integrates all document components
  - [x] 2.8 ~~Test document components with Playwright MCP for UI interactions and responsive behavior~~ (Skipped per user request)
- [x] 3.0 Create Supplier Management Components
  - [x] 3.1 Build SupplierCard component with company info, avatar, rating, and contact button
  - [x] 3.2 Implement SupplierGrid component with responsive card layout
  - [x] 3.3 Create SupplierFilters component with search, rating range, and sector filters
  - [x] 3.4 Build ContactPopover component with WhatsApp, email, and call options
  - [x] 3.5 Add pagination component for suppliers (20 items per page)
  - [x] 3.6 Implement bulk selection functionality for multiple suppliers
  - [x] 3.7 Add confirmation dialogs for delete operations
  - [x] 3.8 Create main Suppliers page component that integrates all supplier components
  - [x] 3.9 ~~Test supplier components with Playwright MCP for UI interactions and contact popover functionality~~ (Skipped per user request)
- [x] 4.0 Implement Navigation and Layout Integration
  - [x] 4.1 Update MainLayout component to handle tab switching between chat/documents/suppliers
  - [x] 4.2 Modify LeftSidebar navigation to properly route to documents and suppliers pages
  - [x] 4.3 Implement state management for active tab and content switching
  - [x] 4.4 Create custom hooks (useDocuments, useSuppliers) for state management
  - [x] 4.5 Add proper TypeScript types for navigation state
  - [x] 4.6 ~~Test navigation flow with Playwright MCP to ensure smooth tab switching~~ (Skipped per user request)
- [x] 5.0 Add Animations and Polish
  - [x] 5.1 Implement Framer Motion scroll-triggered animations for card reveals
  - [x] 5.2 Add smooth transitions between tab switches
  - [x] 5.3 Create loading states with animated indicators
  - [x] 5.4 Implement hover effects and micro-interactions
  - [x] 5.5 Ensure responsive design works across mobile, tablet, and desktop
  - [x] 5.6 Add proper error handling and user feedback (toasts)
  - [x] 5.7 ~~Test animations and responsive behavior with Playwright MCP across different screen sizes~~ (Skipped per user request)
