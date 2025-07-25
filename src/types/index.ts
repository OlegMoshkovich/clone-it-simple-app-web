// ============================================================================
// LOG TYPES
// ============================================================================

export interface Log {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
  tags?: string[];
  date?: string;
  inspector?: string;
  location?: string;
  notes?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  tags: string;
  date: string;
  inspector: string;
  location: string;
  notes: string;
  aiSummary: string;
}

export interface CustomDates {
  startDate: string;
  endDate: string;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface ReportType {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
}

export interface SavedReport {
  id: string;
  name: string;
  reportType: string;
  duration: string;
  generatedAt: string;
  logCount: number;
  startDate?: string;
  endDate?: string;
}

export interface GeneratedReport {
  id: string;
  reportType: string;
  duration: string;
  generatedAt: string;
  logCount: number;
  summary: string;
  startDate?: string;
  endDate?: string;
  logs?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface CreateLogProps {
  logId?: string;
}

export interface LogDetailProps {
  logId: string;
}

export interface FileUploadProps {
  logId: string;
  onUploadSuccess?: () => void;
}

export interface EditLogPageProps {
  params: {
    id: string;
  };
}

export interface LogDetailPageProps {
  params: {
    id: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LogsApiResponse extends ApiResponse<Log[]> {}
export interface LogApiResponse extends ApiResponse<Log> {}
export interface ReportsApiResponse extends ApiResponse<{
  reportTypes: ReportType[];
  savedReports: SavedReport[];
}> {}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuProps {
  className?: string;
  children: React.ReactNode;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type StatusType = 'completed' | 'in-progress' | 'pending';
export type PriorityType = 'critical' | 'high' | 'medium' | 'low';
export type CategoryType = 
  | 'inspection'
  | 'installation'
  | 'maintenance'
  | 'safety'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'structural'
  | 'roofing'
  | 'security';

export type TabType = 'generate' | 'saved';

// ============================================================================
// CONSTANTS
// ============================================================================

export const CATEGORIES: CategoryType[] = [
  'inspection',
  'installation',
  'maintenance',
  'safety',
  'electrical',
  'plumbing',
  'hvac',
  'structural',
  'roofing',
  'security'
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
] as const;

export const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
] as const; 