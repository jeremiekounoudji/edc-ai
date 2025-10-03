import React, { useState, useMemo } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Input } from '@heroui/input';
import { FiPlus, FiMoreHorizontal, FiFolder, FiSearch } from 'react-icons/fi';
import { Project } from '../../lib/types/project';
import { formatRelativeTime, truncateText } from '../../lib/utils/common';
import { CreateProjectModal } from '../ui/CreateProjectModal';
import { EditProjectModal } from '../ui/EditProjectModal';
import { ProjectContextMenu } from '../ui/ProjectContextMenu';
import { useProjects } from '@/hooks/useProject';

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
  // projects = [],
  selectedProjects = [],
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  onProjectLoadMore,
  // isLoading = false,
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

  // Default projects for demonstration
  const { projects, isLoading, createProject, isError } = useProjects();

  
  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    // Ensure projects is always an array
    const safeProjects = Array.isArray(projects) ? projects : [];
    
    if (!searchQuery.trim()) {
      return safeProjects;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return safeProjects.filter((project: Project) =>
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery)
    );
  }, [projects, searchQuery]);
  

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
    await createProject(data.title, data.description);
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
      <aside className="flex h-screen w-16 flex-col border-l border-border bg-background">
        {/* Collapsed Header */}
        <div className="flex h-16 items-center justify-center border-b border-border">
          <FiFolder className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Collapsed Project List */}
        <div className="flex-1 space-y-2 p-2">
          {filteredProjects.map((project: Project) => (
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
              className="h-10 w-10 !flex !items-center !justify-center"
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
            className="text-muted-foreground hover:text-foreground !flex !items-center !justify-center"
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
          classNames={{
            inputWrapper: "!border-2 !rounded-lg !min-h-[40px]"
          }}
          style={{
            borderColor: 'hsl(var(--foreground))'
          } as React.CSSProperties}
        />
      </div>

      {/* New Project Button */}
      <div className="p-2">
        <Button
          color="warning"
          variant="solid"
          size="md"
          startContent={<FiPlus className="h-4 w-4 flex-shrink-0" />}
          onClick={() => setShowCreateModal(true)}
          className="w-full justify-center !flex !items-center rounded-lg"
        >
          <span className="leading-none">New Project</span>
        </Button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-2 p-4">
          {filteredProjects.map((project: Project) => (
            <Card
              key={project.id}
              isPressable
              className={`cursor-pointer transition-all duration-200 rounded-xl border-2 hover:bg-accent/50 border-transparent hover:border-border hover:shadow-sm`}
              onClick={() => handleProjectClick(project.id)}
            >
              <CardBody className="p-3 h-24 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                      {truncateText(project.description, 60)}
                    </p>
                  </div>
                  <Button
                  
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectMenuClick(e, project);
                    }}
                    className="h-6 w-6 min-w-6 opacity-0 group-hover:opacity-100 transition-opacity !flex !items-center !justify-center flex-shrink-0 rounded-lg bg-transparent border-0 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <FiMoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-auto">
                  {formatRelativeTime(project.updatedAt)}
                </p>
              </CardBody>
            </Card>
          ))}

          {/* No Results Message */}
          {filteredProjects.length === 0 && searchQuery.trim() && !isError && (
            <div className="text-center py-8">
              <FiFolder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search terms
              </p>
            </div>
          )}

          {/* Error Message */}
          {isError && (
            <div className="text-center py-8">
              <FiFolder className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600">Failed to load projects</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please check your authentication or try refreshing the page
              </p>
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && !searchQuery.trim() && !isLoading && !isError && (
            <div className="text-center py-8">
              <FiFolder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first project to get started
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
                className="w-full !flex !items-center !justify-center rounded-xl hover:bg-accent/50 transition-all duration-200"
              >
                <span className="leading-none">{isLoading ? 'Loading...' : 'Load More'}</span>
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
