
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { JobApplication, ViewMode } from '@/types/job';

interface JobContextType {
  jobs: JobApplication[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  addJob: (job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => JobApplication | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

const mockJobs: JobApplication[] = [
  {
    id: '1',
    company: 'TechCorp',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    dateApplied: '2024-06-15',
    status: 'interviewing',
    salary: '$120,000 - $140,000',
    notes: 'Great company culture, 3 rounds of interviews scheduled',
    interviewDate: '2024-06-25',
    contactPerson: 'Sarah Johnson',
    priority: 'high',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z',
  },
  {
    id: '2',
    company: 'StartupXYZ',
    title: 'Full Stack Engineer',
    location: 'New York, NY',
    dateApplied: '2024-06-10',
    status: 'applied',
    salary: '$100,000 - $130,000',
    notes: 'Interesting product, waiting for response',
    priority: 'medium',
    createdAt: '2024-06-10T09:00:00Z',
    updatedAt: '2024-06-10T09:00:00Z',
  },
  {
    id: '3',
    company: 'BigTech Inc',
    title: 'Software Engineer',
    location: 'Seattle, WA',
    dateApplied: '2024-06-05',
    status: 'offer',
    salary: '$150,000 - $180,000',
    notes: 'Received offer! Need to negotiate salary',
    priority: 'high',
    createdAt: '2024-06-05T11:00:00Z',
    updatedAt: '2024-06-18T16:00:00Z',
  },
  {
    id: '4',
    company: 'LocalCompany',
    title: 'React Developer',
    location: 'Austin, TX',
    dateApplied: '2024-05-30',
    status: 'rejected',
    salary: '$80,000 - $100,000',
    notes: 'Not a good fit for the role',
    priority: 'low',
    createdAt: '2024-05-30T13:00:00Z',
    updatedAt: '2024-06-08T10:00:00Z',
  },
];

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    const savedJobs = localStorage.getItem('job-applications');
    return savedJobs ? JSON.parse(savedJobs) : mockJobs;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  useEffect(() => {
    localStorage.setItem('job-applications', JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (jobData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: JobApplication = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, updates: Partial<JobApplication>) => {
    setJobs(prev => prev.map(job => 
      job.id === id 
        ? { ...job, ...updates, updatedAt: new Date().toISOString() }
        : job
    ));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      viewMode,
      setViewMode,
      addJob,
      updateJob,
      deleteJob,
      getJobById,
    }}>
      {children}
    </JobContext.Provider>
  );
};
