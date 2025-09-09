import React, { useState, useMemo } from 'react';
import { Button, Card, CardBody, Checkbox, Input } from '@heroui/react';
import { FiPlus, FiMoreHorizontal, FiFolder, FiSearch } from 'react-icons/fi';
import { Project } from '../../lib/types/project';
import { formatRelativeTime, truncateText } from '../../lib/utils/common';
import { CreateProjectModal } from '../ui/CreateProjectModal';
import { EditProjectModal } from '../ui/EditProjectModal';
import { ProjectContextMenu } from '../ui/ProjectContextMenu';

interface RightSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  projects?: Project[];
  selectedProjects?: string[];
  onProjectSelect?: (projectId: string) => void;
  onProjectCreate?: (data: { title: string; description: string }) => void;
  onProjectUpdate?: (data: { id: string; title: string; description: string }) => void;
  onProjectDelete?: (projectId: string) => void;
  onProjectLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function RightSidebar({
  isCollapsed = false,
  onToggleCollapse,
  projects = [],
  selectedProjects = [],
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  onProjectLoadMore,
  isLoading = false,
  hasMore = true,
}: RightSidebarProps) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    project: Project;
    position: { x: number; y: number };
  } | null>(null);

  // Mock projects for demonstration
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Learning From 100 Years o...',
      description: 'For athletes, high altitude prod...',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      chatSessions: [],
    },
    {
      id: '2',
      title: 'Research officiants',
      description: 'Maxwell\'s equations—the foun...',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      chatSessions: [],
    },
    {
      id: '3',
      title: 'What does a senior lead de...',
      description: 'Physiological respiration involv...',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      chatSessions: [],
    },
    {
      id: '4',
      title: 'Write a sweet note to your...',
      description: 'In the eighteenth century the G...',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      chatSessions: [],
    },
    {
      id: '5',
      title: 'Meet with cake bakers',
      description: 'Physical space is often conceiv...',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      chatSessions: [],
    },
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;
  
  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return displayProjects;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return displayProjects.filter(project =>
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery)
    );
  }, [displayProjects, searchQuery]);
  
  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 15);

  const handleProjectClick = (projectId: string) => {
    onProjectSelect?.(projectId);
  };

  const handleProjectMenuClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setContextMenu({
      project,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleCreateProject = async (data: { title: string; description: string }) => {
    await onProjectCreate?.(data);
    setShowCreateModal(false);
  };

  const handleUpdateProject = async (data: { id: string; title: string; description: string }) => {
    await onProjectUpdate?.(data);
    setShowEditModal(false);
    setEditingProject(undefined);
  };

  const handleDeleteProject = async (projectId: string) => {
    await onProjectDelete?.(projectId);
    setShowEditModal(false);
    setEditingProject(undefined);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
    setContextMenu(null);
  };

  const handleDeleteProjectFromContext = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
    setContextMenu(null);
  };

  const handleLoadMore = () => {
    if (showAllProjects) {
      onProjectLoadMore?.();
    } else {
      setShowAllProjects(true);
    }
  };

  if (isCollapsed) {
    return (
      <aside className="flex h-full w-16 flex-col border-l border-border bg-background">
        {/* Collapsed Header */}
        <div className="flex h-16 items-center justify-center border-b border-border">
          <FiFolder className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Collapsed Project List */}
        <div className="flex-1 space-y-2 p-2">
          {visibleProjects.slice(0, 8).map((project) => (
            <div
              key={project.id}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {project.title.charAt(0)}
              </span>
            </div>
          ))}
        </div>

        {/* Collapsed Load More */}
        {hasMore && (
          <div className="p-2 border-t border-border">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onClick={handleLoadMore}
              className="h-10 w-10"
            >
              <FiPlus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Projects ({filteredProjects.length})
          </h2>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <FiMoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<FiSearch className="h-4 w-4 text-muted-foreground" />}
          variant="bordered"
          size="sm"
          className="w-full"
        />
      </div>

      {/* New Project Button */}
      <div className="p-4 border-b border-border">
        <Button
          variant="bordered"
          size="sm"
          startContent={<FiPlus className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
          className="w-full justify-start"
        >
          New Project
        </Button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {visibleProjects.map((project) => (
            <Card
              key={project.id}
              isPressable
              className={`cursor-pointer transition-colors ${
                selectedProjects.includes(project.id)
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => handleProjectClick(project.id)}
            >
              <CardBody className="p-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    isSelected={selectedProjects.includes(project.id)}
                    onChange={() => onProjectSelect?.(project.id)}
                    onClick={(e) => e.stopPropagation()}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {truncateText(project.description, 60)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(project.updatedAt)}
                    </p>
                  </div>
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleProjectMenuClick(e, project)}
                    className="h-6 w-6 min-w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiMoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* No Results Message */}
          {filteredProjects.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8">
              <FiFolder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search terms
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && filteredProjects.length > 0 && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadMore}
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />

      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProject(undefined);
        }}
        project={editingProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ProjectContextMenu
          project={contextMenu.project}
          isOpen={true}
          onClose={() => setContextMenu(null)}
          position={contextMenu.position}
          onEdit={handleEditProject}
          onDelete={handleDeleteProjectFromContext}
        />
      )}
    </aside>
  );
}
