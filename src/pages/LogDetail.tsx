"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Edit, FileText, Calendar, Tag, User, Clock, Trash2, Plus, Sparkles } from 'lucide-react';
import FileUpload from '../components/FileUpload';

interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

interface Log {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'critical' | 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

interface LogDetailProps {
  logId: string;
}

const LogDetail: React.FC<LogDetailProps> = ({ logId }) => {
  const router = useRouter();
  const [log, setLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchLogDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/logs/${logId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch log details');
      }
      const data = await response.json();
      console.log('Log data received:', data);
      console.log('Attachments:', data.attachments);
      setLog(data);
    } catch (err) {
      console.error('Error fetching log details:', err);
      setError('Failed to load log details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogDetails();
  }, [logId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (attachment: Attachment) => {
    console.log('Downloading attachment:', attachment);
    const url = `http://localhost:3001/uploads/${encodeURIComponent(attachment.filename)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this attachment? This action cannot be undone.'
    );
    
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3001/api/attachments/${attachmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete attachment');
      }

      // Refresh log data to update attachments
      fetchLogDetails();
      console.log('Attachment deleted successfully');
    } catch (err) {
      console.error('Error deleting attachment:', err);
      alert('Failed to delete attachment. Please try again.');
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this construction log? This action cannot be undone.'
    );
    
    if (!isConfirmed) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`http://localhost:3001/api/logs/${logId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete log');
      }

      console.log('Log deleted successfully');
      router.push('/logs');
    } catch (err) {
      console.error('Error deleting log:', err);
      alert('Failed to delete log. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isImageFile = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  const getImageUrl = (attachment: Attachment) => {
    return `http://localhost:3001/uploads/${encodeURIComponent(attachment.filename)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading log details...</span>
        </div>
      </div>
    );
  }

  if (error || !log) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Log not found'}</div>
          <Button onClick={() => router.push('/logs')}>
            Back to Logs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/logs')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Logs
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{log.title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/logs/${logId}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Log Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Log Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{log.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Priority</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(log.priority)}`}>
                      {log.priority}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Attachments
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowUpload(!showUpload)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Files
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showUpload && (
                <div className="mb-6">
                  <FileUpload
                    logId={logId}
                    onUploadSuccess={fetchLogDetails}
                  />
                </div>
              )}

              {log.attachments && log.attachments.length > 0 ? (
                <div className="space-y-3">
                  {log.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {isImageFile(attachment.mimeType) ? (
                          <img
                            src={getImageUrl(attachment)}
                            alt={attachment.originalName}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{attachment.originalName}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFile(attachment)}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No attachments yet</p>
                  <p className="text-sm">Click "Add Files" to upload attachments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Created</span>
                <p className="text-sm text-gray-900">
                  {new Date(log.createdAt).toLocaleDateString()} at{' '}
                  {new Date(log.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <p className="text-sm text-gray-900">
                  {new Date(log.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(log.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogDetail; 