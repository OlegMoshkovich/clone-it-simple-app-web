import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils/test-utils';
import LogCard from '../LogCard';

describe('LogCard', () => {
  const mockLog = {
    id: 1,
    title: 'Foundation Inspection',
    description: 'Completed foundation inspection for Building A',
    status: 'completed',
    date: '2024-01-15',
    inspector: 'John Smith',
    location: 'Building A',
    category: 'inspection',
    priority: 'high',
    tags: ['foundation', 'inspection'],
    notes: 'All foundation requirements met',
    attachments: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  it('renders log information correctly', () => {
    renderWithProviders(<LogCard log={mockLog} />);
    
    expect(screen.getByText('Foundation Inspection')).toBeInTheDocument();
    expect(screen.getByText('Completed foundation inspection for Building A')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Building A')).toBeInTheDocument();
  });

  it('displays correct status badge styling', () => {
    renderWithProviders(<LogCard log={mockLog} />);
    
    const statusBadge = screen.getByText('completed');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('shows attachment count when attachments exist', () => {
    const logWithAttachments = {
      ...mockLog,
      attachments: [
        { id: 1, filename: 'photo1.jpg', originalName: 'photo1.jpg' },
        { id: 2, filename: 'photo2.jpg', originalName: 'photo2.jpg' }
      ]
    };
    
    renderWithProviders(<LogCard log={logWithAttachments} />);
    expect(screen.getByText('2 attachment(s)')).toBeInTheDocument();
  });

  it('does not show attachment count when no attachments', () => {
    renderWithProviders(<LogCard log={mockLog} />);
    expect(screen.queryByText(/attachment/)).not.toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    renderWithProviders(<LogCard log={mockLog} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockLog.id);
  });

  it('formats date correctly', () => {
    renderWithProviders(<LogCard log={mockLog} />);
    
    // Should display formatted date (implementation may vary)
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const logWithMissingFields = {
      id: 1,
      title: 'Test Log',
      description: 'Test description',
      status: 'in-progress',
      date: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };
    
    renderWithProviders(<LogCard log={logWithMissingFields} />);
    
    expect(screen.getByText('Test Log')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('in-progress')).toBeInTheDocument();
  });
}); 