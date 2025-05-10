
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/job';
import { Calendar, MapPin, DollarSign, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
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

const JobCard = ({ job, onEdit, onDelete, isDragging = false }: JobCardProps) => {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isDragging ? 'rotate-3 scale-105' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-1 truncate">
              {job.title}
            </h3>
            <p className="text-muted-foreground font-medium">
              {job.company}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(job)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(job.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Applied {new Date(job.dateApplied).toLocaleDateString()}</span>
          </div>
          
          {job.interviewDate && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Calendar className="h-4 w-4" />
              <span>Interview {new Date(job.interviewDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            <Badge className={statusColors[job.status]}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={priorityColors[job.priority]}>
              {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
            </Badge>
          </div>
          
          {job.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
