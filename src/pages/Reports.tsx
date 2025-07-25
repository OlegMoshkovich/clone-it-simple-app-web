"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart3, Calendar, Download, FileText, TrendingUp, Users, AlertTriangle, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { ReportType, SavedReport, GeneratedReport, CustomDates, TabType } from '../types';

const Reports: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [customDates, setCustomDates] = useState<CustomDates>({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports data');
        }
        const data = await response.json();
        setReportTypes(data.reportTypes || []);
        setSavedReports(data.savedReports || []);
      } catch (err) {
        console.error('Error fetching reports data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  const handleGenerateReport = async (reportType: ReportType) => {
    try {
      setGenerating(true);
      
      const payload: any = {
        reportType: reportType.id,
        duration: reportType.duration
      };

      // Add custom dates if they're provided
      if (customDates.startDate && customDates.endDate) {
        payload.startDate = customDates.startDate;
        payload.endDate = customDates.endDate;
      }

      const response = await fetch('http://localhost:3001/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const result = await response.json();
      setGeneratedReport(result);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveReport = async (report: GeneratedReport) => {
    const name = prompt('Enter a name for this report:');
    if (!name) return;

    try {
      const response = await fetch('http://localhost:3001/api/reports/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...report,
          name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save report');
      }

      // Refresh saved reports
      const reportsResponse = await fetch('http://localhost:3001/api/reports');
      if (reportsResponse.ok) {
        const data = await reportsResponse.json();
        setSavedReports(data.savedReports || []);
      }

      alert('Report saved successfully!');
    } catch (err) {
      console.error('Error saving report:', err);
      alert('Failed to save report. Please try again.');
    }
  };

  const handleDeleteSavedReport = async (reportId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this saved report?');
    if (!isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3001/api/reports/saved/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete saved report');
      }

      // Remove from state
      setSavedReports(prev => prev.filter(report => report.id !== reportId));
      alert('Report deleted successfully!');
    } catch (err) {
      console.error('Error deleting saved report:', err);
      alert('Failed to delete report. Please try again.');
    }
  };

  const getReportIcon = (iconName: string) => {
    switch (iconName) {
      case 'bar-chart':
        return <BarChart3 className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'alert-triangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'clock':
        return <Clock className="w-5 h-5" />;
      case 'check-circle':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Generate Reports
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved Reports
          </button>
        </div>

        {activeTab === 'generate' && (
          <div className="space-y-6">
            {/* Custom Date Range */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Date Range (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customDates.startDate}
                      onChange={(e) => setCustomDates(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customDates.endDate}
                      onChange={(e) => setCustomDates(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((reportType) => (
                <Card key={reportType.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getReportIcon(reportType.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{reportType.name}</CardTitle>
                        <p className="text-sm text-gray-600">{reportType.duration}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{reportType.description}</p>
                    <Button
                      onClick={() => handleGenerateReport(reportType)}
                      disabled={generating}
                      className="w-full"
                    >
                      {generating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <BarChart3 className="w-4 h-4 mr-2" />
                      )}
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Generated Report */}
            {generatedReport && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Generated Report</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSaveReport(generatedReport)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Save Report
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setGeneratedReport(null)}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Report Type</p>
                        <p className="text-lg font-semibold">{generatedReport.reportType}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-lg font-semibold">{generatedReport.duration}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Log Count</p>
                        <p className="text-lg font-semibold">{generatedReport.logCount}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{generatedReport.summary}</p>
                    </div>

                    {generatedReport.logs && generatedReport.logs.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Recent Logs</h4>
                        <div className="space-y-2">
                          {generatedReport.logs.slice(0, 5).map((log) => (
                            <div key={log.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{log.title}</p>
                                  <p className="text-sm text-gray-600">{log.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    log.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    log.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {log.status}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    log.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                    log.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                    log.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {log.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            {savedReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <p className="text-sm text-gray-600">{report.reportType}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSavedReport(report.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{report.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Log Count:</span>
                          <span className="font-medium">{report.logCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Generated:</span>
                          <span className="font-medium">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved reports</h3>
                <p className="text-gray-600">
                  Generate and save reports to see them here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 