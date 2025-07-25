import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Calendar, Download, Sparkles, Clock, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const [reportTypes, setReportTypes] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'saved'
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    fetchReportTypes();
  }, []);

  const fetchReportTypes = async () => {
    try {
      setIsLoadingReports(true);
      const response = await fetch('http://localhost:3001/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch report types');
      }
      const data = await response.json();
      setReportTypes(data.reportTypes);
      setSavedReports(data.savedReports);
    } catch (err) {
      console.error('Error fetching report types:', err);
      setError('Failed to load report types');
    } finally {
      setIsLoadingReports(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const reportData = {
        duration: selectedReport.duration,
        reportType: selectedReport.id,
        ...(selectedReport.duration === 'custom' && {
          startDate: customDates.startDate,
          endDate: customDates.endDate
        })
      };

      const response = await fetch('http://localhost:3001/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const report = await response.json();
      setGeneratedReport(report);
      
      // Refresh the saved reports list to update the count
      await fetchReportTypes();
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const reportText = `
CONSTRUCTION SITE REPORT
${'='.repeat(50)}

Report Type: ${generatedReport.reportType}
Duration: ${generatedReport.duration}
Generated: ${new Date(generatedReport.generatedAt).toISOString().split('T')[0]}
Log Count: ${generatedReport.logCount}

${generatedReport.startDate && generatedReport.endDate ? 
  `Date Range: ${generatedReport.startDate} to ${generatedReport.endDate}` : ''}

SUMMARY
${'-'.repeat(20)}
${generatedReport.summary}

DETAILED LOGS
${'-'.repeat(20)}
${generatedReport.logs ? generatedReport.logs.map(log => `
${log.title}
Status: ${log.status}
Date: ${log.date ? log.date.split('T')[0] : log.date}
Inspector: ${log.inspector || 'Not specified'}
Location: ${log.location || 'Not specified'}
Description: ${log.description}
${log.notes ? `Notes: ${log.notes}` : ''}
${log.attachments && log.attachments.length > 0 ? 
  `Attachments: ${log.attachments.length} file(s)` : ''}
`).join('\n') : 'No logs available'}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `construction-report-${generatedReport.reportType}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // If it's already in YYYY-MM-DD format, return as is
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    // If it's a full date string, extract just the date part
    return new Date(dateString).toISOString().split('T')[0];
  };

  const handleLogClick = (logId) => {
    navigate(`/logs/${logId}`);
  };

  const handleSavedReportClick = (report) => {
    // Convert saved report format to match generated report format
    const convertedReport = {
      ...report,
      logs: report.logsData || []
    };
    setGeneratedReport(convertedReport);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      // Remove from saved reports
      setSavedReports(prev => prev.filter(report => report.id !== reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Failed to delete report. Please try again.');
    }
  };

  if (isLoadingReports) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Reports</h2>
          <p className="text-gray-600 mb-4">Please wait while we load the report types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Reports</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Full-page Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">Generating AI Report...</p>
            <p className="text-sm text-gray-500">Please wait while we analyze your construction logs</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Construction Reports</h1>
        <p className="text-gray-600">Generate AI-powered summaries of construction activities and inspections.</p>
      </div>

      {/* View Toggle */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setActiveTab('generate');
              setGeneratedReport(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'generate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Generate New Report
          </button>
          <button
            onClick={() => {
              setActiveTab('saved');
              setGeneratedReport(null);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Saved Reports ({savedReports.length})
          </button>
        </div>
      </div>

      <div className={`grid gap-8 ${activeTab === 'saved' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Report Generation Section - Only show when not in saved reports view */}
        {activeTab === 'generate' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generate Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Report Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportTypes && reportTypes.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport?.id === report.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {report.duration === 'day' && <Clock className="w-4 h-4 text-blue-600" />}
                        {report.duration === 'week' && <Calendar className="w-4 h-4 text-green-600" />}
                        {report.duration === 'month' && <TrendingUp className="w-4 h-4 text-purple-600" />}
                        {report.duration === 'custom' && <Sparkles className="w-4 h-4 text-orange-600" />}
                        <span className="font-medium">{report.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Date Range */}
              {selectedReport?.duration === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customDates.startDate}
                      onChange={(e) => setCustomDates(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customDates.endDate}
                      onChange={(e) => setCustomDates(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateReport}
                disabled={!selectedReport || loading || (selectedReport?.duration === 'custom' && (!customDates.startDate || !customDates.endDate))}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Generating Report...' : 'Generate AI Report'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Right Panel Content */}
        {generatedReport ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generated Report
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setGeneratedReport(null)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Report Type:</span>
                    <p className="text-gray-600">{generatedReport.reportType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p className="text-gray-600">{generatedReport.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium">Log Count:</span>
                    <p className="text-gray-600">{generatedReport.logCount}</p>
                  </div>
                  <div>
                    <span className="font-medium">Generated:</span>
                    <p className="text-gray-600">{new Date(generatedReport.generatedAt).toISOString().split('T')[0]}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{generatedReport.summary}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Included Logs</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {generatedReport.logs && generatedReport.logs.length > 0 ? (
                      generatedReport.logs.map((log) => (
                        <div key={log.id} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300" onClick={() => handleLogClick(log.id)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{log.title}</h4>
                              <ExternalLink className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.status === 'completed' ? 'bg-green-100 text-green-800' :
                              log.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.description.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{formatDate(log.date)}</span>
                            {log.inspector && <span>Inspector: {log.inspector}</span>}
                            {log.attachments && log.attachments.length > 0 && (
                              <span>{log.attachments.length} attachment(s)</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No logs found for this time period.</p>
                        <p className="text-sm mt-1">Try selecting a different date range or report type.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : activeTab === 'saved' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Saved Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedReports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved reports yet. Generate a report to see it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {savedReports && savedReports.map((report) => (
                    <div
                      key={report.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSavedReportClick(report)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{report.reportType}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReport(report.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.summary.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(report.createdAt)}</span>
                        <span>{report.logCount} logs</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a report type and generate a report to see the results here.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>


    </div>
  );
};

export default Reports; 