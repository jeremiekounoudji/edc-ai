import React from 'react';
import { Button } from '@heroui/react';
import { FiUser, FiSettings, FiLogOut, FiEdit3 } from 'react-icons/fi';

interface UserProfilePopoverProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onClose: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onEditProfileClick?: () => void;
}

export function UserProfilePopover({
  user,
  onClose,
  onSettingsClick,
  onLogoutClick,
  onEditProfileClick,
}: UserProfilePopoverProps) {
  const defaultUser = {
    name: 'Emilia Caitlin',
    email: 'hey@unspace.agency',
    avatar: undefined,
  };

  const currentUser = user || defaultUser;

  const handleMenuItemClick = (callback?: () => void) => {
    callback?.();
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-popover p-4 shadow-lg">
      {/* User Info */}
      <div className="flex items-center space-x-3 pb-4 border-b border-border">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <FiUser className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-popover-foreground truncate">
            {currentUser.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {currentUser.email}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-4 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          startContent={<FiSettings className="h-4 w-4" />}
          onClick={() => handleMenuItemClick(onSettingsClick)}
          className="w-full justify-start text-popover-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Settings
        </Button>

        <Button
          variant="ghost"
          size="sm"
          startContent={<FiEdit3 className="h-4 w-4" />}
          onClick={() => handleMenuItemClick(onEditProfileClick)}
          className="w-full justify-start text-popover-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Edit Profile
        </Button>

        <div className="border-t border-border pt-1 mt-2">
          <Button
            variant="ghost"
            size="sm"
            startContent={<FiLogOut className="h-4 w-4" />}
            onClick={() => handleMenuItemClick(onLogoutClick)}
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
