"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Upload, X, FileText, Image, File } from 'lucide-react';

interface FileUploadProps {
  logId: string;
  onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ logId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      for (const file of files) {
        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`http://localhost:3001/api/logs/${logId}/attachments`, {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Upload error:', errorData);
          throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log('File uploaded successfully:', result);
      }

      // Refresh the log data to show new attachments
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="text-sm text-gray-600 mb-2">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={uploading}
          />
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, GIF, PDF, DOC, XLS, TXT up to 10MB
        </p>
      </div>
      
      {uploading && (
        <div className="text-center text-sm text-gray-600">
          Uploading files...
        </div>
      )}
    </div>
  );
};

export default FileUpload; 