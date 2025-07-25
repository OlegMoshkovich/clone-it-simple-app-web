"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Save, Plus, Sparkles, Loader2 } from 'lucide-react';
import { FormData, CreateLogProps, CATEGORIES, PRIORITIES, STATUSES } from '../types';

const CreateLog: React.FC<CreateLogProps> = ({ logId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true' || !!logId;
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'pending',
    tags: '',
    date: new Date().toISOString().split('T')[0],
    inspector: '',
    location: '',
    notes: '',
    aiSummary: ''
  });

  useEffect(() => {
    if (isEditMode && logId) {
      const fetchLogData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:3001/api/logs/${logId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch log data');
          }
          const log = await response.json();
          
          // Format the date properly for the HTML date input (YYYY-MM-DD)
          const formatDateForInput = (dateString: string) => {
            if (!dateString) return new Date().toISOString().split('T')[0];
            
            try {
              // Handle both ISO date strings and YYYY-MM-DD format
              const date = new Date(dateString);
              // Check if the date is valid
              if (isNaN(date.getTime())) {
                console.warn('Invalid date string:', dateString);
                return new Date().toISOString().split('T')[0];
              }
              return date.toISOString().split('T')[0];
            } catch (error) {
              console.error('Error formatting date:', error);
              return new Date().toISOString().split('T')[0];
            }
          };
          
          setFormData({
            title: log.title || '',
            description: log.description || '',
            category: log.category || '',
            priority: log.priority || 'medium',
            status: log.status || 'pending',
            tags: Array.isArray(log.tags) ? log.tags.join(', ') : log.tags || '',
            date: formatDateForInput(log.date),
            inspector: log.inspector || '',
            location: log.location || '',
            notes: log.notes || '',
            aiSummary: log.aiSummary || ''
          });
        } catch (err) {
          console.error('Error fetching log data:', err);
          alert('Failed to load log data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchLogData();
    }
  }, [isEditMode, logId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title for the log.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const url = isEditMode && logId 
        ? `http://localhost:3001/api/logs/${logId}`
        : 'http://localhost:3001/api/logs';
      
      const method = isEditMode && logId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save log');
      }

      const result = await response.json();
      console.log('Log saved successfully:', result);
      
      // Redirect to the log detail page or logs list
      if (isEditMode && logId) {
        router.push(`/logs/${logId}`);
      } else {
        router.push('/logs');
      }
    } catch (err) {
      console.error('Error saving log:', err);
      alert('Failed to save log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateAISummary = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a description first.');
      return;
    }

    try {
      setAiLoading(true);
      
      const response = await fetch('http://localhost:3001/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        aiSummary: result.summary
      }));
    } catch (err) {
      console.error('Error generating AI summary:', err);
      alert('Failed to generate AI summary. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Construction Log' : 'Create New Construction Log'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter log title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the construction activity, findings, or observations"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status and Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {STATUSES.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PRIORITIES.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inspector" className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector
                  </label>
                  <input
                    type="text"
                    id="inspector"
                    name="inspector"
                    value={formData.inspector}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Inspector name"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Building, floor, room, etc."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional notes or observations"
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Summary
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateAISummary}
                  disabled={aiLoading || !formData.description.trim()}
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate Summary
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                id="aiSummary"
                name="aiSummary"
                value={formData.aiSummary}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AI-generated summary will appear here..."
                readOnly
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/logs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditMode ? 'Update Log' : 'Create Log'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLog; 