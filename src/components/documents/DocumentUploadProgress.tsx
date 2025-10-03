'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
  Card,
  CardBody
} from '@heroui/react';
import { FiCheck, FiX, FiUpload, FiCheckCircle } from 'react-icons/fi';
import { DocumentType } from '../../lib/types/documents';
import { supabase } from '../../lib/supabase';
import { documentToasts } from '../../lib/utils/toast';

interface SelectedFile {
  file: File;
  id: string;
  type: DocumentType;
}

interface FileUploadStatus {
  id: string;
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface DocumentUploadProgressProps {
  isOpen: boolean;
  files: SelectedFile[];
  onComplete: () => void;
}

export const DocumentUploadProgress: React.FC<DocumentUploadProgressProps> = ({
  isOpen,
  files,
  onComplete
}) => {
  const [uploadStatuses, setUploadStatuses] = useState<FileUploadStatus[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const uploadStartedRef = React.useRef(false);

  // Reset when component unmounts or modal closes
  useEffect(() => {
    return () => {
      uploadStartedRef.current = false;
    };
  }, []);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      uploadStartedRef.current = false;
      setUploadStatuses([]);
      setIsComplete(false);
      setOverallProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (files.length > 0 && !uploadStartedRef.current) {
      uploadStartedRef.current = true;
      
      // Initialize upload statuses
      const initialStatuses: FileUploadStatus[] = files.map(file => ({
        id: file.id,
        name: file.file.name,
        status: 'pending',
        progress: 0
      }));
      setUploadStatuses(initialStatuses);
      
      // Start uploading
      startUploads(files, initialStatuses);
    }
  }, [files]);

  const updateFileStatus = (fileId: string, updates: Partial<FileUploadStatus>) => {
    setUploadStatuses(prev => 
      prev.map(status => 
        status.id === fileId ? { ...status, ...updates } : status
      )
    );
  };

  const uploadFileToSupabase = async (selectedFile: SelectedFile): Promise<void> => {
    const { file, type } = selectedFile;
    
    updateFileStatus(selectedFile.id, { status: 'uploading', progress: 0 });

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Generate unique filename with user folder structure
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `${user.id}/${type}/${timestamp}_${randomString}.${fileExtension}`;

      // Simulate progress updates during upload
      const progressInterval = setInterval(() => {
        updateFileStatus(selectedFile.id, (prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            size: file.size.toString(),
            originalName: file.name,
            type: type
          }
        });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      updateFileStatus(selectedFile.id, { 
        status: 'success', 
        progress: 100 
      });

    } catch (error) {
      console.error('Upload error:', error);
      updateFileStatus(selectedFile.id, { 
        status: 'error', 
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  };

  const startUploads = async (filesToUpload: SelectedFile[], statuses: FileUploadStatus[]) => {
    const uploadPromises = filesToUpload.map(file => uploadFileToSupabase(file));
    
    try {
      await Promise.all(uploadPromises);
      
      // Check if all uploads were successful
      const finalStatuses = await new Promise<FileUploadStatus[]>(resolve => {
        setTimeout(() => {
          setUploadStatuses(current => {
            resolve(current);
            return current;
          });
        }, 500);
      });

      const successfulUploads = finalStatuses.filter(status => status.status === 'success');
      const failedUploads = finalStatuses.filter(status => status.status === 'error');
      
      setIsComplete(true);
      
      // Show appropriate toast messages
      if (successfulUploads.length > 0) {
        documentToasts.uploadSuccess(successfulUploads.length);
      }
      
      if (failedUploads.length > 0) {
        failedUploads.forEach(failed => {
          documentToasts.uploadError(failed.name);
        });
      }
    } catch (error) {
      console.error('Upload process error:', error);
    }
  };

  // Calculate overall progress
  useEffect(() => {
    if (uploadStatuses.length > 0) {
      const totalProgress = uploadStatuses.reduce((sum, status) => sum + status.progress, 0);
      const avgProgress = totalProgress / uploadStatuses.length;
      setOverallProgress(avgProgress);
    }
  }, [uploadStatuses]);

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />;
      case 'uploading':
        return <FiUpload className="h-5 w-5 text-primary animate-pulse" />;
      case 'success':
        return <FiCheck className="h-5 w-5 text-success" />;
      case 'error':
        return <FiX className="h-5 w-5 text-danger" />;
    }
  };

  const getStatusColor = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'uploading':
        return 'primary';
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
    }
  };

  const successCount = uploadStatuses.filter(s => s.status === 'success').length;
  const errorCount = uploadStatuses.filter(s => s.status === 'error').length;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} // Prevent closing during upload
      size="lg"
      isDismissable={false}
      hideCloseButton={!isComplete}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {isComplete ? (
            <div className="flex items-center gap-2">
              <FiCheckCircle className="h-6 w-6 text-success" />
              <h2 className="text-xl font-semibold">Upload Complete</h2>
            </div>
          ) : (
            <h2 className="text-xl font-semibold">Uploading Documents</h2>
          )}
        </ModalHeader>
        
        <ModalBody className="gap-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress 
              value={overallProgress} 
              color={isComplete ? 'success' : 'primary'}
              className="mb-2"
            />
            {isComplete && (
              <p className="text-sm text-muted-foreground">
                {successCount} of {uploadStatuses.length} files uploaded successfully
                {errorCount > 0 && `, ${errorCount} failed`}
              </p>
            )}
          </div>

          {/* Individual File Progress */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadStatuses.map((status) => (
              <Card key={status.id} className="shadow-sm">
                <CardBody className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{status.name}</p>
                      {status.status === 'uploading' && (
                        <Progress 
                          value={status.progress} 
                          color="primary" 
                          size="sm"
                          className="mt-1"
                        />
                      )}
                      {status.status === 'error' && status.error && (
                        <p className="text-sm text-danger mt-1">{status.error}</p>
                      )}
                      {status.status === 'success' && (
                        <p className="text-sm text-success mt-1">Uploaded successfully</p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </ModalBody>

        {isComplete && (
          <ModalFooter>
            <Button color="primary" onPress={onComplete}>
              Done
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};