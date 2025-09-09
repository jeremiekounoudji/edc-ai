import React, { useState } from 'react';
import { TopNavigation } from '../ui/TopNavigation';
import { LeftSidebar } from '../sidebar/LeftSidebar';
import { RightSidebar } from '../sidebar/RightSidebar';
import { FiMenu, FiX } from 'react-icons/fi';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  projects?: any[];
  onSearch?: (query: string) => void;
  onNavigate?: (section: string) => void;
  onProjectSelect?: (projectId: string) => void;
  onProjectCreate?: () => void;
  onProjectLoadMore?: () => void;
  onUpgradeClick?: () => void;
}

export function MainLayout({
  children,
  user,
  projects,
  onSearch,
  onNavigate,
  onProjectSelect,
  onProjectCreate,
  onProjectLoadMore,
  onUpgradeClick,
}: MainLayoutProps) {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!leftSidebarCollapsed);
  };

  const toggleRightSidebar = () => {
    setRightSidebarCollapsed(!rightSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          leftSidebarCollapsed ? 'w-16' : 'w-64'
        } ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}
      >
        <LeftSidebar
          isCollapsed={leftSidebarCollapsed}
          onToggleCollapse={toggleLeftSidebar}
          onSearch={onSearch}
          onNavigate={onNavigate}
          user={user}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navigation */}
        <TopNavigation
          user={user}
          onUpgradeClick={onUpgradeClick}
        />

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
          >
            <FiMenu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={toggleLeftSidebar}
            >
              <FiMenu className="h-4 w-4" />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={toggleRightSidebar}
            >
              <FiMenu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>

          {/* Right Sidebar */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              rightSidebarCollapsed ? 'w-16' : 'w-80'
            } hidden lg:block`}
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
        </main>
      </div>

      {/* Mobile Right Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed right-0 top-0 z-50 h-full w-80 bg-background border-l border-border lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Projects</h2>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiX className="h-5 w-5" />
            </Button>
          </div>
          <RightSidebar
            isCollapsed={false}
            projects={projects}
            onProjectSelect={onProjectSelect}
            onProjectCreate={onProjectCreate}
            onProjectLoadMore={onProjectLoadMore}
          />
        </div>
      )}
    </div>
  );
}
