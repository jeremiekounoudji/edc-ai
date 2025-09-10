import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
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
  FiMonitor,
  FiTrendingUp,
  FiUserCheck,
  FiCheckCircle,
  FiShield
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
    { id: 'dashboards-reports', label: 'Dashboards & Reports', icon: FiTrendingUp },
    { id: 'documents-new', label: 'Documents', icon: FiMessageSquare, hasNew: true },
    { id: 'suppliers', label: 'Suppliers', icon: FiUsers },
    { id: 'approvals', label: 'Approvals', icon: FiCheckCircle },
  ];

  const settingsItems = [
    { id: 'settings-admin', label: 'Settings & Admin', icon: FiShield },
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
          classNames={{
            inputWrapper: "!border-2 !rounded-lg !min-h-[40px]"
          }}
          style={{
            borderColor: 'hsl(var(--foreground))'
          } as React.CSSProperties}
        />
        <p className="text-xs text-muted-foreground mt-1">⌘K</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={item.isActive ? 'solid' : 'ghost'}
            color={item.isActive ? 'primary' : 'default'}
            size="sm"
            startContent={<item.icon className="h-4 w-4 flex-shrink-0" />}
            onClick={() => handleNavigationClick(item.id)}
            className={`w-full justify-start h-10 px-3 !flex !items-center rounded-lg ${
              item.isActive 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <span className="flex-1 text-left text-sm font-medium leading-none">{item.label}</span>
            {item.hasAdd && (
              <FiPlus className="h-3 w-3 text-muted-foreground ml-2 flex-shrink-0" />
            )}
            {item.hasNew && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full ml-2 font-medium flex-shrink-0">
                NEW
              </span>
            )}
          </Button>
        ))}

        {/* Settings & Help Section */}
        <div className="pt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Settings & Help
          </h3>
          <div className="space-y-2">
            {settingsItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                startContent={<item.icon className="h-4 w-4 flex-shrink-0" />}
                onClick={() => handleNavigationClick(item.id)}
                className="w-full justify-start h-10 px-3 text-foreground hover:bg-accent hover:text-accent-foreground !flex !items-center rounded-lg"
              >
                <span className="text-sm font-medium leading-none">{item.label}</span>
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
          startContent={<span className="text-lg flex-shrink-0">{getThemeIcon()}</span>}
          onClick={toggleTheme}
          className="w-full justify-start h-10 px-3 text-foreground hover:bg-accent hover:text-accent-foreground !flex !items-center rounded-lg"
        >
          <span className="text-sm font-medium leading-none">{getThemeLabel()}</span>
        </Button>
      </div>

      {/* User Profile Preview */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-semibold text-muted-foreground">
              {currentUser.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
