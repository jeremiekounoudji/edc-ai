import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  // If unauthorized, return empty array
  if (res.status === 401) {
    return [];
  }
  
  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  const data = await res.json();
  
  // Transform the data to ensure dates are properly handled
  if (Array.isArray(data)) {
    return data.map(project => ({
      ...project,
      createdAt: project.created_at || project.createdAt,
      updatedAt: project.updated_at || project.updatedAt,
    }));
  }
  
  return data;
};

export function useProjects() {
  const { data, error, mutate } = useSWR('/api/projects', fetcher);

  const createProject = async (title: string, description?: string) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const newProject = await res.json();
    mutate();
    return newProject;
  };

  // Ensure projects is always an array, even on error
  const projects = Array.isArray(data) ? data : [];

  return {
    projects,
    isLoading: !data && !error,
    isError: error,
    createProject,
  };
}
