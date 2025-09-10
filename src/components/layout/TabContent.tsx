'use client';

import React from 'react';
import { ActiveTab } from './MainLayout';
import DocumentsPage from '../../app/documents/page';
import SuppliersPage from '../../app/suppliers/page';

interface TabContentProps {
  activeTab: ActiveTab;
  children?: React.ReactNode; // For AI Chat content
}

export function TabContent({ activeTab, children }: TabContentProps) {
  switch (activeTab) {
    case 'documents':
      return <DocumentsPage />;
    case 'suppliers':
      return <SuppliersPage />;
    case 'ai-chat':
    default:
      return <>{children}</>;
  }
}
