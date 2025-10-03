import { StreamingResponse } from "../types/chat";
import { showToast } from "../utils/toast";

/**
 * AI Service for handling chat responses
 * This service now integrates with our Next.js API proxy route to n8n
 */

export interface AIServiceConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIService {
  private config: AIServiceConfig;
  private apiUrl: string;

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      model: "script-ai-v1.3",
      temperature: 0.7,
      maxTokens: 1000,
      ...config,
    };

    // Use our Next.js API proxy route instead of calling n8n directly
    this.apiUrl = "/api/proxy/n8n";
  }

  /**
   * Send a message through our proxy to the n8n webhook and get a normal response (not streaming)
   */
  async sendMessage(
    message: string,
    conversationId: string,
    userId: string
  ): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatMessage: message,
          userId: userId,
          conversationId: conversationId,
        }),
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          `AI service error: ${response.status} ${response.statusText}`;

        // Show user-friendly error message
        showToast.error(errorMessage);

        throw new Error(errorMessage);
      }

      // Parse the response as JSON and extract the message
      const data = await response.json();
      console.log("AI Service Response:", data);
      // Return the response content (adjust this based on your actual API response structure)
      return data.output;
    } catch (error) {
      console.error("Error sending message to AI service:", error);

      // Show a user-friendly error message
      if (error instanceof Error) {
        showToast.error(`Failed to connect to AI service: ${error.message}`);
      } else {
        showToast.error("Failed to connect to AI service. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Get available AI models
   */
  async getAvailableModels(): Promise<string[]> {
    return ["script-ai-v1.3", "script-ai-v1.2", "script-ai-v1.1"];
  }

  /**
   * Check if the AI service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch("/api/proxy/n8n", { method: "GET" });
      return response.ok;
    } catch (error) {
      console.error("Error checking AI service availability:", error);
      return false;
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{
    requestsToday: number;
    tokensUsed: number;
    remainingQuota: number;
  }> {
    // In a real implementation, this would call an analytics endpoint
    return {
      requestsToday: 0,
      tokensUsed: 0,
      remainingQuota: 1000,
    };
  }
}

// Default AI service instance
export const aiService = new AIService();

// Export for use in components
export default aiService;
