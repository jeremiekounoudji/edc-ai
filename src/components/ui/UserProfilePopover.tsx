import React from 'react';
import { Button } from '@heroui/button';
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
    <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-popover p-5 shadow-lg">
      {/* User Info */}
      <div className="flex items-center space-x-4 pb-5 border-b border-border">
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
          <h3 className="text-base font-semibold text-popover-foreground truncate">
            {currentUser.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {currentUser.email}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-5 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          startContent={<FiSettings className="h-4 w-4 flex-shrink-0" />}
          onClick={() => handleMenuItemClick(onSettingsClick)}
          className="w-full justify-start h-11 px-3 text-popover-foreground hover:bg-accent hover:text-accent-foreground !flex !items-center"
        >
          <span className="text-sm font-medium leading-none">Settings</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          startContent={<FiEdit3 className="h-4 w-4 flex-shrink-0" />}
          onClick={() => handleMenuItemClick(onEditProfileClick)}
          className="w-full justify-start h-11 px-3 text-popover-foreground hover:bg-accent hover:text-accent-foreground !flex !items-center"
        >
          <span className="text-sm font-medium leading-none">Edit Profile</span>
        </Button>

        <div className="border-t border-border pt-3 mt-3">
          <Button
            variant="ghost"
            size="sm"
            startContent={<FiLogOut className="h-4 w-4 flex-shrink-0" />}
            onClick={() => handleMenuItemClick(onLogoutClick)}
            className="w-full justify-start h-11 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive !flex !items-center"
          >
            <span className="text-sm font-medium leading-none">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
