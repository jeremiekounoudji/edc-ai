'use client';

import React, { useState } from 'react';
import { TopNavigation } from '../ui/TopNavigation';
import { LeftSidebar } from '../sidebar/LeftSidebar';
import { RightSidebar } from '../sidebar/RightSidebar';
import { TabContent } from './TabContent';
import { FiMenu, FiX } from 'react-icons/fi';
import { Button } from '@heroui/button';
import { Project } from '../../lib/types/project';
import { useNavigation } from '../../context/NavigationContext';
import { useRouter } from 'next/navigation';

export type ActiveTab = 'projects' | 'documents' | 'suppliers';
import { useAuthStore } from '@/store/useAuthStore';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  projects?: Project[];
  onSearch?: (query: string) => void;
  onNavigate?: (section: string) => void;
  onProjectSelect?: (projectId: string) => void;
  onProjectCreate?: () => void;
  onProjectLoadMore?: () => void;
  onUpgradeClick?: () => void;
  currentTitle?: string;
}

export function MainLayout({
  children,
  user: userProp,
  projects,
  onSearch,
  onNavigate,
  onProjectSelect,
  onProjectCreate,
  onProjectLoadMore,
  onUpgradeClick,
  currentTitle = "EDC-AI",
}: MainLayoutProps) {
  const { user , isAuthenticated, logout } = useAuthStore();
  const { activeTab, navigateToTab } = useNavigation();
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [mobileLeftMenuOpen, setMobileLeftMenuOpen] = useState(false);
  const [mobileRightMenuOpen, setMobileRightMenuOpen] = useState(false);
  const router = useRouter();
  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!leftSidebarCollapsed);
  };

  const toggleRightSidebar = () => {
    setRightSidebarCollapsed(!rightSidebarCollapsed);
  };

  const toggleMobileLeftMenu = () => {
    setMobileLeftMenuOpen(!mobileLeftMenuOpen);
  };

  const toggleMobileRightMenu = () => {
    setMobileRightMenuOpen(!mobileRightMenuOpen);
  };
  // if(!isAuthenticated) {
  //   router.push('/auth/login');
  // }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Left Sidebar */}
      <div
        className={`hidden lg:block transition-all duration-300 ease-in-out ${
          leftSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <LeftSidebar
          isCollapsed={leftSidebarCollapsed}
          onToggleCollapse={toggleLeftSidebar}
          onSearch={onSearch}
          onNavigate={onNavigate}
          user={userProp}
          activeTab={activeTab}
          onTabChange={navigateToTab}
        />
      </div>

      {/* Mobile Left Sidebar Overlay */}
      {mobileLeftMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileLeftMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-64 bg-background border-r border-border lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onClick={() => setMobileLeftMenuOpen(false)}
              >
                <FiX className="h-5 w-5" />
              </Button>
            </div>
            <LeftSidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onSearch={onSearch}
              onNavigate={onNavigate}
              user={userProp}
              activeTab={activeTab}
              onTabChange={navigateToTab}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 relative">
        {/* Top Navigation - Only spans chat area */}
        <div className="relative z-50">
          <TopNavigation
            user={userProp}
            onUpgradeClick={onUpgradeClick}
            currentTitle={currentTitle}
            // onBack={() => navigateToTab('projects')}
            
          />
        </div>

        {/* Mobile Menu Buttons */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-border bg-background">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={toggleMobileLeftMenu}
            className="text-muted-foreground hover:text-foreground"
          >
            <FiMenu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {activeTab === 'projects' && (
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onClick={toggleMobileRightMenu}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiMenu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <TabContent activeTab={activeTab}>
              {children}
            </TabContent>
          </div>

          {/* Desktop Right Sidebar - Only show on AI Chat tab */}
          {activeTab === 'projects' && (
            <div
              className={`hidden lg:block transition-all duration-300 ease-in-out ${
                rightSidebarCollapsed ? 'w-16' : 'w-80'
              }`}
            >
              <RightSidebar
                isCollapsed={rightSidebarCollapsed}
                onToggleCollapse={toggleRightSidebar}
                projects={projects}
                onProjectSelect={onProjectSelect}
                onProjectCreate={onProjectCreate}
                onProjectLoadMore={onProjectLoadMore}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Right Sidebar Overlay - Only show on AI Chat tab */}
      {activeTab === 'projects' && mobileRightMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileRightMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 h-full w-80 bg-background border-l border-border lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Projects</h2>
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onClick={() => setMobileRightMenuOpen(false)}
              >
                <FiX className="h-5 w-5" />
              </Button>
            </div>
            <RightSidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              projects={projects}
              onProjectSelect={onProjectSelect}
              onProjectCreate={onProjectCreate}
              onProjectLoadMore={onProjectLoadMore}
            />
          </div>
        </>
      )}
    </div>
  );
}
