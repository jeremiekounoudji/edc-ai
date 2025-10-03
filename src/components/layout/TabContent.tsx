'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActiveTab } from './MainLayout';
import DocumentsPage from '../../app/documents/page';
import SuppliersPage from '../../app/suppliers/page';

interface TabContentProps {
  activeTab: ActiveTab;
  children?: React.ReactNode; // For AI Chat content
}

const tabVariants = {
  enter: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export function TabContent({ activeTab, children }: TabContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'documents':
        return <DocumentsPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'ai-chat':
      default:
        return <>{children}</>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={tabVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="h-full w-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
