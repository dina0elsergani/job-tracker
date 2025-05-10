
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplication } from '@/types/job';
import { useJobs } from '@/contexts/JobContext';
import JobCard from './JobCard';
import { Badge } from '@/components/ui/badge';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
}

const columns = [
  { id: 'applied', title: 'Applied', color: 'border-blue-200 dark:border-blue-800' },
  { id: 'interviewing', title: 'Interviewing', color: 'border-orange-200 dark:border-orange-800' },
  { id: 'offer', title: 'Offer', color: 'border-green-200 dark:border-green-800' },
  { id: 'rejected', title: 'Rejected', color: 'border-red-200 dark:border-red-800' },
];

const KanbanBoard = ({ jobs, onEditJob, onDeleteJob }: KanbanBoardProps) => {
  const { updateJob } = useJobs();
  const [draggedJob, setDraggedJob] = useState<JobApplication | null>(null);

  const handleDragStart = (e: React.DragEvent, job: JobApplication) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: JobApplication['status']) => {
    e.preventDefault();
    if (draggedJob && draggedJob.status !== status) {
      updateJob(draggedJob.id, { status });
    }
    setDraggedJob(null);
  };

  const getJobsByStatus = (status: JobApplication['status']) => {
    return jobs.filter(job => job.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => {
        const columnJobs = getJobsByStatus(column.id as JobApplication['status']);
        return (
          <Card 
            key={column.id} 
            className={`${column.color} border-t-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as JobApplication['status'])}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                {column.title}
                <Badge variant="secondary" className="ml-2">
                  {columnJobs.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No applications</p>
                </div>
              ) : (
                columnJobs.map(job => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                    className="cursor-move"
                  >
                    <JobCard
                      job={job}
                      onEdit={onEditJob}
                      onDelete={onDeleteJob}
                      isDragging={draggedJob?.id === job.id}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
