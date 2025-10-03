import { ChatMessage, ChatSession } from '../types/chat';
import { Project } from '../types/project';

/**
 * Utility functions for search functionality
 */

export interface SearchResult {
  type: 'message' | 'project' | 'session';
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  metadata?: {
    sessionId?: string;
    projectId?: string;
    timestamp?: Date;
  };
}

/**
 * Searches through chat messages
 */
export function searchMessages(
  messages: ChatMessage[],
  query: string,
  sessionId?: string
): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  messages.forEach((message) => {
    const content = message.content.toLowerCase();
    const title = `Message from ${message.role}`;
    
    if (content.includes(normalizedQuery)) {
      const relevanceScore = calculateRelevanceScore(content, normalizedQuery);
      
      results.push({
        type: 'message',
        id: message.id,
        title,
        content: message.content,
        relevanceScore,
        metadata: {
          sessionId,
          timestamp: message.timestamp,
        },
      });
    }
  });

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Searches through chat sessions
 */
export function searchSessions(
  sessions: ChatSession[],
  query: string
): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  sessions.forEach((session) => {
    const title = session.title.toLowerCase();
    const content = session.messages
      .map(m => m.content)
      .join(' ')
      .toLowerCase();
    
    if (title.includes(normalizedQuery) || content.includes(normalizedQuery)) {
      const relevanceScore = Math.max(
        calculateRelevanceScore(title, normalizedQuery),
        calculateRelevanceScore(content, normalizedQuery)
      );
      
      results.push({
        type: 'session',
        id: session.id,
        title: session.title,
        content: session.messages.map(m => m.content).join(' '),
        relevanceScore,
        metadata: {
          sessionId: session.id,
          timestamp: session.updatedAt,
        },
      });
    }
  });

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Searches through projects
 */
export function searchProjects(
  projects: Project[],
  query: string
): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  projects.forEach((project) => {
    const title = project.title.toLowerCase();
    const description = project.description.toLowerCase();
    
    if (title.includes(normalizedQuery) || description.includes(normalizedQuery)) {
      const relevanceScore = Math.max(
        calculateRelevanceScore(title, normalizedQuery),
        calculateRelevanceScore(description, normalizedQuery)
      );
      
      results.push({
        type: 'project',
        id: project.id,
        title: project.title,
        content: project.description,
        relevanceScore,
        metadata: {
          projectId: project.id,
          timestamp: project.updatedAt,
        },
      });
    }
  });

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Performs a comprehensive search across all content types
 */
export function performGlobalSearch(
  messages: ChatMessage[],
  sessions: ChatSession[],
  projects: Project[],
  query: string
): SearchResult[] {
  const messageResults = searchMessages(messages, query);
  const sessionResults = searchSessions(sessions, query);
  const projectResults = searchProjects(projects, query);

  return [...messageResults, ...sessionResults, ...projectResults]
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Calculates relevance score based on query match
 */
function calculateRelevanceScore(content: string, query: string): number {
  const words = query.split(' ');
  let score = 0;

  words.forEach((word) => {
    if (content.includes(word)) {
      score += 1;
      
      // Bonus for exact phrase match
      if (content.includes(query)) {
        score += 2;
      }
      
      // Bonus for word at beginning
      if (content.startsWith(word)) {
        score += 1;
      }
    }
  });

  return score;
}

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

/**
 * Debounces search input to prevent excessive API calls
 */
export function debounceSearch(
  callback: (query: string) => void,
  delay: number = 300
): (query: string) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (query: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(query), delay);
  };
}

/**
 * Filters search results by type
 */
export function filterSearchResults(
  results: SearchResult[],
  type: 'message' | 'project' | 'session' | 'all'
): SearchResult[] {
  if (type === 'all') return results;
  return results.filter(result => result.type === type);
}
