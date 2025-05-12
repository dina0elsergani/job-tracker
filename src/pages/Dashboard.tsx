
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobs } from '@/contexts/JobContext';
import { JobApplication } from '@/types/job';
import Header from '@/components/Layout/Header';
import KanbanBoard from '@/components/Dashboard/KanbanBoard';
import JobList from '@/components/Dashboard/JobList';
import JobForm from '@/components/Dashboard/JobForm';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';
import ResumeSection from '@/components/Resume/ResumeSection';
import { Plus, BarChart3, FileText, Upload, LayoutGrid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Dashboard = () => {
  const { jobs, viewMode, setViewMode, deleteJob } = useJobs();
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('applications');

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      deleteJob(id);
    }
  };

  const handleAddJob = () => {
    setEditingJob(undefined);
    setShowJobForm(true);
  };

  const handleCloseForm = () => {
    setShowJobForm(false);
    setEditingJob(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Job Application Tracker</h1>
              <p className="text-muted-foreground">
                Manage and track your job applications in one place
              </p>
            </div>
            
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Apps</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Resume</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="applications" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search companies, titles, locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg p-1">
                      <Button
                        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('kanban')}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleAddJob}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Application
                    </Button>
                  </div>
                </div>
                {filteredJobs.length !== jobs.length && (
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredJobs.length} of {jobs.length} applications
                  </p>
                )}
              </CardHeader>
            </Card>

            {/* Applications View */}
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {jobs.length === 0 ? 'No applications yet' : 'No matching applications'}
                      </h3>
                      <p className="text-muted-foreground">
                        {jobs.length === 0 
                          ? 'Start tracking your job applications by adding your first one.'
                          : 'Try adjusting your search or filter criteria.'
                        }
                      </p>
                    </div>
                    {jobs.length === 0 && (
                      <Button onClick={handleAddJob}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Application
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : viewMode === 'kanban' ? (
              <KanbanBoard
                jobs={filteredJobs}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
              />
            ) : (
              <JobList
                jobs={filteredJobs}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
              />
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Application Analytics</CardTitle>
                <CardDescription>
                  Insights and statistics about your job search progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard jobs={jobs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume">
            <ResumeSection />
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Job Search Insights</CardTitle>
                <CardDescription>
                  Personalized tips and recommendations for your job search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Weekly Goals</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Applications this week</span>
                          <span className="text-sm font-medium">3/5</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          2 more applications to reach your weekly goal
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Top Industries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Technology</span>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Finance</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Healthcare</span>
                            <span className="text-sm font-medium">15%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Focus on follow-ups
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            You have 2 applications from last week that could benefit from a follow-up email.
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            Interview preparation
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            You have an interview scheduled for next week. Start preparing common questions.
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                            Expand your network
                          </p>
                          <p className="text-xs text-orange-700 dark:text-orange-300">
                            Consider reaching out to professionals in your target companies on LinkedIn.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Job Form Modal */}
        <JobForm
          job={editingJob}
          isOpen={showJobForm}
          onClose={handleCloseForm}
        />
      </div>
    </div>
  );
};

export default Dashboard;
