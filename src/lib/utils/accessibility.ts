/**
 * Accessibility utilities for improved user experience
 */

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  /**
   * Push current focus to stack and focus new element
   */
  static pushFocus(element: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      this.focusStack.push(currentFocus);
    }
    element.focus();
  }

  /**
   * Pop focus from stack and restore previous focus
   */
  static popFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  /**
   * Trap focus within a container
   */
  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
}

/**
 * ARIA utilities
 */
export const ARIA = {
  /**
   * Generate unique ID for ARIA attributes
   */
  generateId: (prefix: string = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Set ARIA attributes on element
   */
  setAttributes: (element: HTMLElement, attributes: Record<string, string>): void => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },

  /**
   * Announce message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
};

/**
 * Keyboard navigation utilities
 */
export const KeyboardNavigation = {
  /**
   * Handle arrow key navigation in a list
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onSelect: (index: number) => void
  ): number => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      onSelect(newIndex);
    }

    return newIndex;
  },

  /**
   * Handle escape key
   */
  handleEscape: (event: KeyboardEvent, onEscape: () => void): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onEscape();
    }
  },

  /**
   * Handle enter key
   */
  handleEnter: (event: KeyboardEvent, onEnter: () => void): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onEnter();
    }
  },
};

/**
 * Color contrast utilities
 */
export const ColorContrast = {
  /**
   * Calculate relative luminance
   */
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    // This is a simplified version - in practice you'd parse the color strings
    // and convert to RGB values
    return 4.5; // Placeholder value
  },

  /**
   * Check if contrast ratio meets WCAG standards
   */
  meetsWCAG: (contrastRatio: number, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const thresholds = { AA: 4.5, AAA: 7 };
    return contrastRatio >= thresholds[level];
  },
};

/**
 * Screen reader utilities
 */
export const ScreenReader = {
  /**
   * Hide element from screen readers
   */
  hide: (element: HTMLElement): void => {
    element.setAttribute('aria-hidden', 'true');
  },

  /**
   * Show element to screen readers
   */
  show: (element: HTMLElement): void => {
    element.removeAttribute('aria-hidden');
  },

  /**
   * Make element accessible to screen readers
   */
  makeAccessible: (element: HTMLElement, label: string): void => {
    element.setAttribute('aria-label', label);
    element.removeAttribute('aria-hidden');
  },
};

/**
 * Motion and animation utilities
 */
export const MotionPreferences = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Apply motion preferences to element
   */
  applyMotionPreferences: (element: HTMLElement): void => {
    if (MotionPreferences.prefersReducedMotion()) {
      element.style.animation = 'none';
      element.style.transition = 'none';
    }
  },
};

/**
 * Form accessibility utilities
 */
export const FormAccessibility = {
  /**
   * Associate label with form control
   */
  associateLabel: (labelId: string, controlId: string): void => {
    const label = document.getElementById(labelId);
    const control = document.getElementById(controlId);
    
    if (label && control) {
      control.setAttribute('aria-labelledby', labelId);
    }
  },

  /**
   * Set up error association
   */
  associateError: (controlId: string, errorId: string): void => {
    const control = document.getElementById(controlId);
    const error = document.getElementById(errorId);
    
    if (control && error) {
      control.setAttribute('aria-describedby', errorId);
      control.setAttribute('aria-invalid', 'true');
    }
  },

  /**
   * Clear error association
   */
  clearError: (controlId: string): void => {
    const control = document.getElementById(controlId);
    
    if (control) {
      control.removeAttribute('aria-describedby');
      control.removeAttribute('aria-invalid');
    }
  },
};
