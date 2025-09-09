import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { FiZap, FiUser } from 'react-icons/fi';
import { UserProfilePopover } from './UserProfilePopover';

interface TopNavigationProps {
  onUpgradeClick?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function TopNavigation({ onUpgradeClick, user }: TopNavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">S</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Script</h1>
        </div>

        {/* Center - Current Section Title */}
        <div className="flex-1 text-center">
          <h2 className="text-lg font-medium text-foreground">AI Chat</h2>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Upgrade Button */}
          <Button
            color="default"
            variant="bordered"
            size="sm"
            startContent={<FiZap className="h-4 w-4" />}
            onClick={onUpgradeClick}
            className="bg-black text-white hover:bg-gray-800 border-black"
          >
            Upgrade
          </Button>

          {/* Help Icon */}
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="text-lg">?</span>
          </Button>

          {/* Gift Icon */}
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="text-lg">🎁</span>
          </Button>

          {/* User Profile */}
          <div className="relative">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <FiUser className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>

            {isProfileOpen && (
              <UserProfilePopover
                user={user}
                onClose={() => setIsProfileOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
