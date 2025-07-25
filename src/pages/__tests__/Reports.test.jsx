import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, mockReportTypes, mockSavedReports, mockGeneratedReport } from '../../test/utils/test-utils';
import Reports from '../Reports';

// Mock the fetch function
global.fetch = vi.fn();

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the reports page with correct title', () => {
    renderWithProviders(<Reports />);
    
    expect(screen.getByText('Construction Reports')).toBeInTheDocument();
    expect(screen.getByText('Generate AI-powered summaries of construction activities and inspections.')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderWithProviders(<Reports />);
    
    expect(screen.getByText('Loading Reports')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we load the report types...')).toBeInTheDocument();
  });

  it('displays report types after successful fetch', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      expect(screen.getByText('Daily Report')).toBeInTheDocument();
      expect(screen.getByText('Weekly Report')).toBeInTheDocument();
      expect(screen.getByText('Monthly Report')).toBeInTheDocument();
      expect(screen.getByText('Custom Report')).toBeInTheDocument();
    });
  });

  it('shows error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Reports')).toBeInTheDocument();
      expect(screen.getByText('Failed to load report types')).toBeInTheDocument();
    });
  });

  it('allows selecting a report type', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const weeklyReport = screen.getByText('Weekly Report');
      fireEvent.click(weeklyReport);
      
      // Check if the report type is selected (has blue border)
      expect(weeklyReport.closest('div')).toHaveClass('border-blue-500', 'bg-blue-50');
    });
  });

  it('shows custom date inputs when custom report is selected', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const customReport = screen.getByText('Custom Report');
      fireEvent.click(customReport);
      
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    });
  });

  it('generates report when generate button is clicked', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          reportTypes: mockReportTypes,
          savedReports: mockSavedReports
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeneratedReport
      });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const weeklyReport = screen.getByText('Weekly Report');
      fireEvent.click(weeklyReport);
      
      const generateButton = screen.getByText('Generate AI Report');
      fireEvent.click(generateButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Generated Report')).toBeInTheDocument();
      expect(screen.getByText('AI Summary')).toBeInTheDocument();
    });
  });

  it('switches between generate and saved reports views', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const savedReportsButton = screen.getByText('Saved Reports (2)');
      fireEvent.click(savedReportsButton);
      
      expect(screen.getByText('Saved Reports')).toBeInTheDocument();
      expect(screen.getByText('daily')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  it('displays saved report when clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const savedReportsButton = screen.getByText('Saved Reports (2)');
      fireEvent.click(savedReportsButton);
      
      const dailyReport = screen.getByText('daily');
      fireEvent.click(dailyReport);
      
      expect(screen.getByText('Generated Report')).toBeInTheDocument();
      expect(screen.getByText('AI Summary')).toBeInTheDocument();
    });
  });

  it('shows back button when report is displayed', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const weeklyReport = screen.getByText('Weekly Report');
      fireEvent.click(weeklyReport);
      
      const generateButton = screen.getByText('Generate AI Report');
      fireEvent.click(generateButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('← Back')).toBeInTheDocument();
    });
  });

  it('hides generate form when in saved reports view', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reportTypes: mockReportTypes,
        savedReports: mockSavedReports
      })
    });

    renderWithProviders(<Reports />);
    
    await waitFor(() => {
      const savedReportsButton = screen.getByText('Saved Reports (2)');
      fireEvent.click(savedReportsButton);
      
      // Generate Report section should not be visible
      expect(screen.queryByText('Generate Report')).not.toBeInTheDocument();
      expect(screen.queryByText('Select Report Type')).not.toBeInTheDocument();
    });
  });
}); 