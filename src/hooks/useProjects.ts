import { useState, useCallback } from 'react';
import { ProjectState, Project, CreateProjectData, UpdateProjectData } from '../lib/types/project';
import { generateId } from '../lib/utils/common';

const initialState: ProjectState = {
  projects: [],
  selectedProjects: [],
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
};

export function useProjects() {
  const [state, setState] = useState<ProjectState>(initialState);

  // Create a new project
  const createProject = useCallback(async (data: CreateProjectData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newProject: Project = {
        id: generateId(),
        title: data.title,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatSessions: [],
      };

      setState(prev => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        isLoading: false,
      }));

      return newProject;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Update an existing project
  const updateProject = useCallback(async (data: UpdateProjectData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(project =>
          project.id === data.id
            ? {
                ...project,
                title: data.title ?? project.title,
                description: data.description ?? project.description,
                updatedAt: new Date(),
              }
            : project
        ),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update project',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (projectId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(project => project.id !== projectId),
        selectedProjects: prev.selectedProjects.filter(id => id !== projectId),
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete project',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Toggle project selection
  const toggleProjectSelection = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId],
    }));
  }, []);

  // Select multiple projects
  const selectProjects = useCallback((projectIds: string[]) => {
    setState(prev => ({
      ...prev,
      selectedProjects: projectIds,
    }));
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedProjects: [],
    }));
  }, []);

  // Load more projects (pagination)
  const loadMoreProjects = useCallback(async () => {
    if (!state.hasMore || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call for more projects
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load projects from storage service
      const projectStorage = await import('../lib/services/projectStorage');
      const { projects: loadedProjects, hasMore } = await projectStorage.default.getProjects(
        state.currentPage + 1,
        15
      );

      setState(prev => ({
        ...prev,
        projects: [...prev.projects, ...loadedProjects],
        currentPage: prev.currentPage + 1,
        hasMore,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load more projects',
        isLoading: false,
      }));
    }
  }, [state.hasMore, state.isLoading, state.currentPage]);

  // Add chat session to project
  const addChatSessionToProject = useCallback((projectId: string, sessionId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              chatSessions: [...project.chatSessions, sessionId],
              updatedAt: new Date(),
            }
          : project
      ),
    }));
  }, []);

  // Remove chat session from project
  const removeChatSessionFromProject = useCallback((projectId: string, sessionId: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              chatSessions: project.chatSessions.filter(id => id !== sessionId),
              updatedAt: new Date(),
            }
          : project
      ),
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    createProject,
    updateProject,
    deleteProject,
    toggleProjectSelection,
    selectProjects,
    clearSelection,
    loadMoreProjects,
    addChatSessionToProject,
    removeChatSessionFromProject,
    clearError,
  };
}
