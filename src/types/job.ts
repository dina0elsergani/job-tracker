
export interface JobApplication {
  id: string;
  company: string;
  title: string;
  location: string;
  dateApplied: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected';
  salary?: string;
  notes?: string;
  interviewDate?: string;
  contactPerson?: string;
  jobUrl?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type ViewMode = 'kanban' | 'list';
export type ThemeMode = 'light' | 'dark';
