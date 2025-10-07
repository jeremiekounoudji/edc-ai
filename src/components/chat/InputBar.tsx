import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { FiPaperclip, FiMic, FiCommand, FiSend } from 'react-icons/fi';

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
  placeholder = "Type a message or ask about procurement, compliance, analytics…",
  maxLength = 3000,
  disabled = false,
}: InputBarProps) {
  const [message, setMessage] = useState('');
  const [showActionCards, setShowActionCards] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    console.log('Send button clicked', { message, disabled, trimmed: message.trim() });
    if (message.trim() && !disabled) {
      console.log('Calling onSendMessage with message:', message.trim());
      onSendMessage?.(message.trim());
      setMessage('');
    } else {
      console.log('Message not sent - conditions not met', { 
        hasMessage: !!message.trim(), 
        disabled 
      });
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
    textareaRef.current?.focus();
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > maxLength;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

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
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-sm sm:max-w-md action-cards-container">
          <div className="bg-popover border border-border rounded-lg p-3 sm:p-4 shadow-lg">
            <h3 className="text-xs sm:text-sm font-medium text-popover-foreground mb-2 sm:mb-3">
              Choose an action:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
              {[
                { label: 'Start a Procurement', prompt: 'Start a Procurement' },
                { label: 'Ask Advice', prompt: 'Get expert consultation' },
                { label: 'Inspect a Project', prompt: 'Analyze project details' },
                { label: 'Generate Report', prompt: 'Create comprehensive reports' },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleActionCardSelect(action.prompt)}
                  className="justify-start text-left h-auto p-2 text-xs sm:text-sm !flex !items-center"
                >
                  <span className="truncate leading-none">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Input Container - 2-Line Layout */}
      <div className="bg-background border border-border rounded-2xl p-3 shadow-lg space-y-1">
        {/* First Line - Text Input + Character Count + Send Button */}
        <div className="flex items-end space-x-1">
          {/* Text Input - Full Width */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={disabled}
              rows={1}
            className="w-full resize-none bg-transparent border-0 outline-none text-sm sm:text-base text-left placeholder:text-muted-foreground disabled:opacity-50 py-2 focus:outline-none focus:ring-0 focus:border-0"
            style={{
              minHeight: '40px',
              maxHeight: '50px',
              height: 'auto',
              width: '100%',
              display: 'block',
              outline: 'none',
              border: 'none',
              boxShadow: 'none'
            }}
            />
          </div>

          {/* Character Count + Send Button */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {characterCount}/{maxLength}
            </span> */}
            <Button
              isIconOnly
              variant="solid"
              color="primary"
              size="sm"
              onClick={handleSendMessage}
              disabled={disabled || !message.trim() || isOverLimit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 !flex !items-center !justify-center rounded-lg"
            >
              <FiSend className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Second Line - Action Buttons (Left Aligned) */}
        <div className="flex items-center space-x-2">
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={onAttachFile}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg !flex !items-center !justify-center"
          >
            <FiPaperclip className="h-4 w-4" />
          </Button>

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={onVoiceMessage}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg !flex !items-center !justify-center"
          >
            <FiMic className="h-4 w-4" />
          </Button>

          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            onClick={onBrowsePrompts}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg !flex !items-center !justify-center"
          >
            <FiCommand className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}