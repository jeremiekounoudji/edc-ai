import { Project, CreateProjectData, UpdateProjectData } from '../types/project';
import { generateId } from '../utils/common';

/**
 * Project Storage Service
 * Handles persistence of project data using localStorage
 */

const STORAGE_KEY = 'script-projects';
const MAX_PROJECTS_PER_PAGE = 15;

export class ProjectStorageService {
  private projects: Project[] = [];
  private initialized = false;

  /**
   * Initialize the storage service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.projects = JSON.parse(stored).map((project: Project) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Failed to load projects from storage:', error);
      this.projects = [];
    }

    this.initialized = true;
  }

  /**
   * Save projects to localStorage
   */
  private async save(): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects));
    } catch (error) {
      console.error('Failed to save projects to storage:', error);
      throw new Error('Failed to save projects');
    }
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectData): Promise<Project> {
    await this.initialize();

    const project: Project = {
      id: generateId(),
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      chatSessions: [],
    };

    this.projects.unshift(project); // Add to beginning
    await this.save();

    return project;
  }

  /**
   * Update an existing project
   */
  async updateProject(data: UpdateProjectData): Promise<Project> {
    await this.initialize();

    const projectIndex = this.projects.findIndex(p => p.id === data.id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const project = this.projects[projectIndex];
    const updatedProject: Project = {
      ...project,
      title: data.title ?? project.title,
      description: data.description ?? project.description,
      updatedAt: new Date(),
    };

    this.projects[projectIndex] = updatedProject;
    await this.save();

    return updatedProject;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    await this.initialize();

    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    this.projects.splice(projectIndex, 1);
    await this.save();
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    await this.initialize();
    return [...this.projects]; // Return a copy
  }

  /**
   * Get projects with pagination
   */
  async getProjects(page: number = 1, limit: number = MAX_PROJECTS_PER_PAGE): Promise<{
    projects: Project[];
    hasMore: boolean;
    total: number;
  }> {
    await this.initialize();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const projects = this.projects.slice(startIndex, endIndex);

    return {
      projects,
      hasMore: endIndex < this.projects.length,
      total: this.projects.length,
    };
  }

  /**
   * Get a project by ID
   */
  async getProjectById(projectId: string): Promise<Project | null> {
    await this.initialize();
    return this.projects.find(p => p.id === projectId) || null;
  }

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<Project[]> {
    await this.initialize();

    if (!query.trim()) {
      return this.projects;
    }

    const normalizedQuery = query.toLowerCase().trim();
    return this.projects.filter(project =>
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Add a chat session to a project
   */
  async addChatSessionToProject(projectId: string, sessionId: string): Promise<void> {
    await this.initialize();

    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (!project.chatSessions.includes(sessionId)) {
      project.chatSessions.push(sessionId);
      project.updatedAt = new Date();
      await this.save();
    }
  }

  /**
   * Remove a chat session from a project
   */
  async removeChatSessionFromProject(projectId: string, sessionId: string): Promise<void> {
    await this.initialize();

    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const sessionIndex = project.chatSessions.indexOf(sessionId);
    if (sessionIndex !== -1) {
      project.chatSessions.splice(sessionIndex, 1);
      project.updatedAt = new Date();
      await this.save();
    }
  }

  /**
   * Get projects by chat session
   */
  async getProjectsByChatSession(sessionId: string): Promise<Project[]> {
    await this.initialize();
    return this.projects.filter(project => project.chatSessions.includes(sessionId));
  }

  /**
   * Get project statistics
   */
  async getProjectStats(): Promise<{
    totalProjects: number;
    totalChatSessions: number;
    averageSessionsPerProject: number;
    mostRecentProject?: Project;
  }> {
    await this.initialize();

    const totalProjects = this.projects.length;
    const totalChatSessions = this.projects.reduce(
      (sum, project) => sum + project.chatSessions.length,
      0
    );
    const averageSessionsPerProject = totalProjects > 0 ? totalChatSessions / totalProjects : 0;
    const mostRecentProject = this.projects.length > 0 
      ? this.projects.reduce((latest, current) => 
          current.updatedAt > latest.updatedAt ? current : latest
        )
      : undefined;

    return {
      totalProjects,
      totalChatSessions,
      averageSessionsPerProject,
      mostRecentProject,
    };
  }

  /**
   * Clear all projects (for testing/reset)
   */
  async clearAllProjects(): Promise<void> {
    this.projects = [];
    await this.save();
  }

  /**
   * Export projects data
   */
  async exportProjects(): Promise<string> {
    await this.initialize();
    return JSON.stringify(this.projects, null, 2);
  }

  /**
   * Import projects data
   */
  async importProjects(data: string): Promise<void> {
    try {
      const importedProjects = JSON.parse(data);
      if (!Array.isArray(importedProjects)) {
        throw new Error('Invalid data format');
      }

      // Validate and transform imported projects
      const projects = importedProjects.map((project: Partial<Project>) => ({
        id: project.id || generateId(),
        title: project.title || 'Imported Project',
        description: project.description || '',
        createdAt: new Date(project.createdAt || Date.now()),
        updatedAt: new Date(project.updatedAt || Date.now()),
        chatSessions: Array.isArray(project.chatSessions) ? project.chatSessions : [],
      }));

      this.projects = projects;
      await this.save();
    } catch (error) {
      console.error('Failed to import projects:', error);
      throw new Error('Failed to import projects');
    }
  }
}

// Default project storage service instance
export const projectStorage = new ProjectStorageService();

// Export for use in components
export default projectStorage;
