'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ActiveTab } from '../components/layout/MainLayout';
import { NavigationContextType, NavigationState, NavigationEvent } from '../lib/types/navigation';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialTab?: ActiveTab;
}

export function NavigationProvider({ children, initialTab = 'projects' }: NavigationProviderProps) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeTab: initialTab,
    tabHistory: [initialTab],
  });

  const setActiveTab = (tab: ActiveTab) => {
    const previousTab = navigationState.activeTab;
    const newHistory = [...navigationState.tabHistory, tab];
    
    setNavigationState({
      activeTab: tab,
      previousTab,
      tabHistory: newHistory,
    });

    // Log navigation event
    const event: NavigationEvent = {
      type: 'TAB_CHANGE',
      from: previousTab,
      to: tab,
      timestamp: new Date(),
    };
    console.log('Navigation event:', event);
  };

  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const goBack = () => {
    if (navigationState.tabHistory.length > 1) {
      const newHistory = [...navigationState.tabHistory];
      newHistory.pop(); // Remove current tab
      const previousTab = newHistory[newHistory.length - 1];
      
      setNavigationState({
        activeTab: previousTab,
        previousTab: navigationState.activeTab,
        tabHistory: newHistory,
      });
    }
  };

  const canGoBack = () => {
    return navigationState.tabHistory.length > 1;
  };

  const value: NavigationContextType = {
    ...navigationState,
    setActiveTab,
    navigateToTab,
    goBack,
    canGoBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
