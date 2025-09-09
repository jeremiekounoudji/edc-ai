import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from '@heroui/react';
import { FiPaperclip, FiMic, FiSquare, FiSend } from 'react-icons/fi';

interface InputBarProps {
  onSendMessage?: (message: string) => void;
  onAttachFile?: () => void;
  onVoiceMessage?: () => void;
  onBrowsePrompts?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function InputBar({
  onSendMessage,
  onAttachFile,
  onVoiceMessage,
  onBrowsePrompts,
  placeholder = "Summarize the latest...",
  maxLength = 3000,
  disabled = false,
}: InputBarProps) {
  const [message, setMessage] = useState('');
  const [showActionCards, setShowActionCards] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage?.(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === '/' && message === '') {
      e.preventDefault();
      setShowActionCards(true);
    }
  };

  const handleActionCardSelect = (prompt: string) => {
    setMessage(prompt);
    setShowActionCards(false);
    inputRef.current?.focus();
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > maxLength;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActionCards && !(event.target as Element).closest('.action-cards-container')) {
        setShowActionCards(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionCards]);

  return (
    <div className="relative">
      {/* Action Cards Popover */}
      {showActionCards && (
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-md action-cards-container">
          <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-medium text-popover-foreground mb-3">
              Choose an action:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Write copy', prompt: 'Write compelling copy for a product launch announcement' },
                { label: 'Image generation', prompt: 'Generate an image for a modern tech startup website' },
                { label: 'Create avatar', prompt: 'Create a professional avatar for a business profile' },
                { label: 'Write code', prompt: 'Write a React component for a user authentication form' },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActionCardSelect(action.prompt)}
                  className="justify-start text-left h-auto p-2"
                >
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Container */}
      <div className="flex items-end space-x-3">
        {/* Main Input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={message}
            onValueChange={setMessage}
            onKeyDown={handleKeyPress}
            variant="bordered"
            size="lg"
            disabled={disabled}
            className="w-full"
            classNames={{
              input: "pr-20",
            }}
          />
          
          {/* Character Count */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {characterCount}/{maxLength}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={onAttachFile}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground"
          >
            <FiPaperclip className="h-4 w-4" />
          </Button>

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={onVoiceMessage}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground"
          >
            <FiMic className="h-4 w-4" />
          </Button>

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={onBrowsePrompts}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground"
          >
            <FiSquare className="h-4 w-4" />
          </Button>

          <Button
            isIconOnly
            variant="solid"
            color="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={disabled || !message.trim() || isOverLimit}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <FiSend className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
