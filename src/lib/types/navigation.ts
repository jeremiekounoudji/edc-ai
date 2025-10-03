import { ActiveTab } from '../components/layout/MainLayout';

export interface NavigationState {
  activeTab: ActiveTab;
  previousTab?: ActiveTab;
  tabHistory: ActiveTab[];
}

export interface NavigationActions {
  setActiveTab: (tab: ActiveTab) => void;
  navigateToTab: (tab: ActiveTab) => void;
  goBack: () => void;
  canGoBack: () => boolean;
}

export interface NavigationContextType extends NavigationState, NavigationActions {}

export interface TabMetadata {
  id: ActiveTab;
  title: string;
  description: string;
  icon: string;
  path: string;
  isEnabled: boolean;
}

export const TAB_METADATA: Record<ActiveTab, TabMetadata> = {
  'ai-chat': {
    id: 'ai-chat',
    title: 'AI Chat',
    description: 'Chat with AI assistant for procurement support',
    icon: 'FiMessageSquare',
    path: '/chat',
    isEnabled: true,
  },
  'documents': {
    id: 'documents',
    title: 'Documents',
    description: 'Manage and organize your documents',
    icon: 'FiFileText',
    path: '/documents',
    isEnabled: true,
  },
  'suppliers': {
    id: 'suppliers',
    title: 'Suppliers',
    description: 'Manage supplier relationships and contacts',
    icon: 'FiUsers',
    path: '/suppliers',
    isEnabled: true,
  },
};

export interface NavigationEvent {
  type: 'TAB_CHANGE' | 'TAB_BACK' | 'TAB_FORWARD';
  from: ActiveTab;
  to: ActiveTab;
  timestamp: Date;
}

export interface NavigationAnalytics {
  tabVisits: Record<ActiveTab, number>;
  tabDuration: Record<ActiveTab, number>;
  lastVisited: Record<ActiveTab, Date>;
  totalSessions: number;
}
