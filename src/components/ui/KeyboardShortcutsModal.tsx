import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { FiKeyboard, FiX } from 'react-icons/fi';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { key: '⌘K', description: 'Focus search bar' },
      { key: 'Ctrl+1', description: 'Go to Projects' },
      { key: 'Ctrl+2', description: 'Go to Templates' },
      { key: 'Ctrl+3', description: 'Go to Documents' },
      { key: 'Ctrl+4', description: 'Go to Community' },
      { key: 'Ctrl+5', description: 'Go to History' },
      { key: 'Ctrl+,', description: 'Go to Settings' },
      { key: '?', description: 'Show Help' },
    ],
  },
  {
    category: 'Chat',
    items: [
      { key: 'Ctrl+N', description: 'Create new chat or project' },
      { key: '/', description: 'Show action cards popover' },
      { key: 'Enter', description: 'Send message' },
      { key: 'Shift+Enter', description: 'New line in message' },
      { key: 'Ctrl+A', description: 'Attach file' },
      { key: 'Ctrl+V', description: 'Voice message' },
      { key: 'Ctrl+P', description: 'Browse prompts' },
    ],
  },
  {
    category: 'Project Management',
    items: [
      { key: 'Ctrl+Shift+N', description: 'Create new project' },
      { key: 'Delete', description: 'Delete selected project' },
      { key: 'F2', description: 'Rename project' },
      { key: 'Ctrl+D', description: 'Duplicate project' },
    ],
  },
  {
    category: 'General',
    items: [
      { key: 'Ctrl+/', description: 'Show keyboard shortcuts' },
      { key: 'Ctrl+Shift+D', description: 'Toggle dark mode' },
      { key: 'Esc', description: 'Close modal or cancel action' },
      { key: 'Ctrl+Z', description: 'Undo last action' },
    ],
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <FiKeyboard className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Speed up your workflow with these keyboard shortcuts
          </p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">
                        {shortcut.description}
                      </span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use <kbd className="px-1 py-0.5 text-xs bg-background rounded">⌘</kbd> on Mac, <kbd className="px-1 py-0.5 text-xs bg-background rounded">Ctrl</kbd> on Windows/Linux</li>
              <li>• Shortcuts work globally when the app is focused</li>
              <li>• Some shortcuts may be disabled during certain actions</li>
              <li>• Press <kbd className="px-1 py-0.5 text-xs bg-background rounded">Ctrl+/</kbd> anytime to see this help</li>
            </ul>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
