import React, { useState } from 'react';
import { Input, Button } from '@heroui/react';
import { 
  FiSearch, 
  FiMessageSquare, 
  FiFolder, 
  FiFileText, 
  FiUsers, 
  FiClock, 
  FiSettings, 
  FiHelpCircle,
  FiPlus,
  FiSun,
  FiMoon,
  FiMonitor
} from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

interface LeftSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSearch?: (query: string) => void;
  onNavigate?: (section: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function LeftSidebar({ 
  isCollapsed = false, 
  onToggleCollapse,
  onSearch,
  onNavigate,
  user 
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentTheme, toggleTheme, getThemeIcon, getThemeLabel } = useTheme();

  const defaultUser = {
    name: 'Emilia Caitlin',
    email: 'hey@unspace.agency',
  };

  const currentUser = user || defaultUser;

  const navigationItems = [
    { id: 'ai-chat', label: 'AI Chat', icon: FiMessageSquare, isActive: true },
    { id: 'projects', label: 'Projects', icon: FiFolder },
    { id: 'templates', label: 'Templates', icon: FiFileText },
    { id: 'documents', label: 'Documents', icon: FiFileText, hasAdd: true },
    { id: 'community', label: 'Community', icon: FiUsers, hasNew: true },
    { id: 'history', label: 'History', icon: FiClock },
  ];

  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: FiSettings },
    { id: 'help', label: 'Help', icon: FiHelpCircle },
  ];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleNavigationClick = (itemId: string) => {
    onNavigate?.(itemId);
  };

  if (isCollapsed) {
    return (
      <aside className="flex h-full w-16 flex-col border-r border-border bg-background">
        {/* Collapsed Logo */}
        <div className="flex h-16 items-center justify-center border-b border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">S</span>
          </div>
        </div>

        {/* Collapsed Navigation */}
        <nav className="flex-1 space-y-2 p-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              isIconOnly
              variant={item.isActive ? 'solid' : 'ghost'}
              color={item.isActive ? 'primary' : 'default'}
              size="sm"
              onClick={() => handleNavigationClick(item.id)}
              className="h-10 w-10"
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </nav>

        {/* Collapsed Settings */}
        <div className="space-y-2 p-2 border-t border-border">
          {settingsItems.map((item) => (
            <Button
              key={item.id}
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={() => handleNavigationClick(item.id)}
              className="h-10 w-10"
            >
              <item.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Collapsed Theme Toggle */}
        <div className="p-2 border-t border-border">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10"
          >
            <span className="text-lg">{getThemeIcon()}</span>
          </Button>
        </div>

        {/* Collapsed User Profile */}
        <div className="p-2 border-t border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium text-muted-foreground">
              {currentUser.name.charAt(0)}
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-background">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onValueChange={handleSearchChange}
          startContent={<FiSearch className="h-4 w-4 text-muted-foreground" />}
          variant="bordered"
          size="sm"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">⌘K</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={item.isActive ? 'solid' : 'ghost'}
            color={item.isActive ? 'primary' : 'default'}
            size="sm"
            startContent={<item.icon className="h-4 w-4" />}
            onClick={() => handleNavigationClick(item.id)}
            className="w-full justify-start"
          >
            <span className="flex-1 text-left">{item.label}</span>
            {item.hasAdd && (
              <FiPlus className="h-3 w-3 text-muted-foreground" />
            )}
            {item.hasNew && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </Button>
        ))}

        {/* Settings & Help Section */}
        <div className="pt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Settings & Help
          </h3>
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                startContent={<item.icon className="h-4 w-4" />}
                onClick={() => handleNavigationClick(item.id)}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          startContent={<span className="text-lg">{getThemeIcon()}</span>}
          onClick={toggleTheme}
          className="w-full justify-start"
        >
          {getThemeLabel()}
        </Button>
      </div>

      {/* User Profile Preview */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-medium text-muted-foreground">
              {currentUser.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
