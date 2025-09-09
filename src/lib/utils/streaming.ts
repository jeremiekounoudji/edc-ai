import { StreamingResponse } from '../types/chat';

/**
 * Utility functions for handling streaming text responses
 */

export class StreamingTextHandler {
  private onUpdate: (content: string) => void;
  private onComplete: () => void;
  private onError: (error: string) => void;

  constructor(
    onUpdate: (content: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.onError = onError;
  }

  /**
   * Simulates streaming text by gradually revealing characters
   */
  async streamText(text: string, speed: number = 30): Promise<void> {
    try {
      let currentText = '';
      
      for (let i = 0; i <= text.length; i++) {
        currentText = text.slice(0, i);
        this.onUpdate(currentText);
        
        if (i < text.length) {
          await this.delay(speed);
        }
      }
      
      this.onComplete();
    } catch (error) {
      this.onError(error instanceof Error ? error.message : 'Streaming error occurred');
    }
  }

  /**
   * Handles streaming response from AI service
   */
  async handleStreamingResponse(response: ReadableStream<Uint8Array>): Promise<void> {
    try {
      const reader = response.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              this.onComplete();
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                this.onUpdate(parsed.content);
              }
            } catch (e) {
              // Ignore malformed JSON
            }
          }
        }
      }
      
      this.onComplete();
    } catch (error) {
      this.onError(error instanceof Error ? error.message : 'Streaming error occurred');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Creates a streaming text handler instance
 */
export function createStreamingHandler(
  onUpdate: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): StreamingTextHandler {
  return new StreamingTextHandler(onUpdate, onComplete, onError);
}

/**
 * Formats streaming response for display
 */
export function formatStreamingContent(content: string): string {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

/**
 * Debounces streaming updates to prevent excessive re-renders
 */
export function debounceStreamingUpdate(
  callback: (content: string) => void,
  delay: number = 50
): (content: string) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (content: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(content), delay);
  };
}
