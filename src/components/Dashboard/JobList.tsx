
import React from 'react';
import { JobApplication } from '@/types/job';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';

interface JobListProps {
  jobs: JobApplication[];
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
}

const statusColors = {
  applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  interviewing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const JobList = ({ jobs, onEditJob, onDeleteJob }: JobListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No job applications found. Add your first application to get started!
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{job.company}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{new Date(job.dateApplied).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={statusColors[job.status]}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityColors[job.priority]}>
                    {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{job.salary || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {job.jobUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(job.jobUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditJob(job)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteJob(job.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobList;
