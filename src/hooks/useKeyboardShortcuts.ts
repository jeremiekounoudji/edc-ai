import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    shortcuts.forEach(({ key, ctrlKey, metaKey, shiftKey, altKey, callback }) => {
      const isCtrlMatch = ctrlKey === undefined ? true : event.ctrlKey === ctrlKey;
      const isMetaMatch = metaKey === undefined ? true : event.metaKey === metaKey;
      const isShiftMatch = shiftKey === undefined ? true : event.shiftKey === shiftKey;
      const isAltMatch = altKey === undefined ? true : event.altKey === altKey;
      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();

      if (isCtrlMatch && isMetaMatch && isShiftMatch && isAltMatch && isKeyMatch) {
        event.preventDefault();
        callback();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Specific hook for chat interface shortcuts
export function useChatKeyboardShortcuts({
  onNewChat,
  onFocusSearch,
  onShowActionCards,
}: {
  onNewChat: () => void;
  onFocusSearch: () => void;
  onShowActionCards: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrlKey: true,
      callback: onNewChat,
      description: 'Create new chat',
    },
    {
      key: 'k',
      metaKey: true,
      callback: onFocusSearch,
      description: 'Focus search',
    },
    {
      key: '/',
      callback: onShowActionCards,
      description: 'Show action cards',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

// Hook for input field shortcuts
export function useInputShortcuts({
  onSendMessage,
  onAttachFile,
  onVoiceMessage,
  onBrowsePrompts,
}: {
  onSendMessage: () => void;
  onAttachFile: () => void;
  onVoiceMessage: () => void;
  onBrowsePrompts: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Enter',
      callback: onSendMessage,
      description: 'Send message',
    },
    {
      key: 'Enter',
      shiftKey: true,
      callback: () => {}, // Allow new line with Shift+Enter
      description: 'New line',
    },
    {
      key: 'a',
      ctrlKey: true,
      callback: onAttachFile,
      description: 'Attach file',
    },
    {
      key: 'v',
      ctrlKey: true,
      callback: onVoiceMessage,
      description: 'Voice message',
    },
    {
      key: 'p',
      ctrlKey: true,
      callback: onBrowsePrompts,
      description: 'Browse prompts',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

// Hook for navigation shortcuts
export function useNavigationShortcuts({
  onGoToProjects,
  onGoToTemplates,
  onGoToDocuments,
  onGoToCommunity,
  onGoToHistory,
  onGoToSettings,
  onGoToHelp,
}: {
  onGoToProjects: () => void;
  onGoToTemplates: () => void;
  onGoToDocuments: () => void;
  onGoToCommunity: () => void;
  onGoToHistory: () => void;
  onGoToSettings: () => void;
  onGoToHelp: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      ctrlKey: true,
      callback: onGoToProjects,
      description: 'Go to Projects',
    },
    {
      key: '2',
      ctrlKey: true,
      callback: onGoToTemplates,
      description: 'Go to Templates',
    },
    {
      key: '3',
      ctrlKey: true,
      callback: onGoToDocuments,
      description: 'Go to Documents',
    },
    {
      key: '4',
      ctrlKey: true,
      callback: onGoToCommunity,
      description: 'Go to Community',
    },
    {
      key: '5',
      ctrlKey: true,
      callback: onGoToHistory,
      description: 'Go to History',
    },
    {
      key: ',',
      ctrlKey: true,
      callback: onGoToSettings,
      description: 'Go to Settings',
    },
    {
      key: '?',
      callback: onGoToHelp,
      description: 'Show Help',
    },
  ];

  useKeyboardShortcuts(shortcuts);
}

// Utility function to get platform-specific modifier key
export function getModifierKey(): 'ctrl' | 'meta' {
  return navigator.platform.toLowerCase().includes('mac') ? 'meta' : 'ctrl';
}

// Utility function to format keyboard shortcut for display
export function formatKeyboardShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.metaKey) parts.push('⌘');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.altKey) parts.push('Alt');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
}
