'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types/project';
import { ProjectWidget } from './ProjectWidget';

interface ProjectManagerProps {
  selectedProject: Project | null;
  onProjectDeselect?: () => void;
}

export function ProjectManager({ selectedProject, onProjectDeselect }: ProjectManagerProps) {
  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Select a Project
          </h2>
          <p className="text-muted-foreground">
            Choose a project from the sidebar to view its conversations and start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <ProjectWidget 
        project={selectedProject} 
        onClose={onProjectDeselect}
      />
    </div>
  );
}