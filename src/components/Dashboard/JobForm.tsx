
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { JobApplication } from '@/types/job';
import { useJobs } from '@/contexts/JobContext';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface JobFormProps {
  job?: JobApplication;
  isOpen: boolean;
  onClose: () => void;
}

const JobForm = ({ job, isOpen, onClose }: JobFormProps) => {
  const { addJob, updateJob } = useJobs();
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    dateApplied: '',
    status: 'applied' as JobApplication['status'],
    salary: '',
    notes: '',
    interviewDate: '',
    contactPerson: '',
    jobUrl: '',
    priority: 'medium' as JobApplication['priority'],
  });

  const [dateApplied, setDateApplied] = useState<Date>();
  const [interviewDate, setInterviewDate] = useState<Date>();

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        title: job.title,
        location: job.location,
        dateApplied: job.dateApplied,
        status: job.status,
        salary: job.salary || '',
        notes: job.notes || '',
        interviewDate: job.interviewDate || '',
        contactPerson: job.contactPerson || '',
        jobUrl: job.jobUrl || '',
        priority: job.priority,
      });
      if (job.dateApplied) {
        setDateApplied(new Date(job.dateApplied));
      }
      if (job.interviewDate) {
        setInterviewDate(new Date(job.interviewDate));
      }
    } else {
      // Reset form for new job
      setFormData({
        company: '',
        title: '',
        location: '',
        dateApplied: '',
        status: 'applied',
        salary: '',
        notes: '',
        interviewDate: '',
        contactPerson: '',
        jobUrl: '',
        priority: 'medium',
      });
      setDateApplied(undefined);
      setInterviewDate(undefined);
    }
  }, [job, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.title || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const jobData = {
      ...formData,
      dateApplied: dateApplied ? dateApplied.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      interviewDate: interviewDate ? interviewDate.toISOString().split('T')[0] : undefined,
    };

    if (job) {
      updateJob(job.id, jobData);
      toast({
        title: "Success",
        description: "Job application updated successfully",
      });
    } else {
      addJob(jobData);
      toast({
        title: "Success",
        description: "Job application added successfully",
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {job ? 'Edit Job Application' : 'Add New Job Application'}
          </DialogTitle>
          <DialogDescription>
            {job ? 'Update the details of your job application.' : 'Add a new job application to track your progress.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="Job title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, State/Country"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g., $80,000 - $100,000"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date Applied</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateApplied && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateApplied ? format(dateApplied, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateApplied}
                    onSelect={setDateApplied}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Interview Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !interviewDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {interviewDate ? format(interviewDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={interviewDate}
                    onSelect={setInterviewDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: JobApplication['status']) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: JobApplication['priority']) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              placeholder="Recruiter or hiring manager name"
              value={formData.contactPerson}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              placeholder="https://..."
              value={formData.jobUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, jobUrl: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this application..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {job ? 'Update' : 'Add'} Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
