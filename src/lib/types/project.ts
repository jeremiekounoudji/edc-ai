export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  chatSessions?: string[]; // Array of chat session IDs
  isSelected?: boolean;
}

export interface ProjectState {
  projects: Project[];
  selectedProjects: string[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
}

export interface UpdateProjectData {
  id: string;
  title?: string;
  description?: string;
}
