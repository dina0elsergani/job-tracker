
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobApplication } from '@/types/job';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, FileText, Calendar, Award } from 'lucide-react';

interface AnalyticsDashboardProps {
  jobs: JobApplication[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const AnalyticsDashboard = ({ jobs }: AnalyticsDashboardProps) => {
  // Calculate statistics
  const totalApplications = jobs.length;
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const conversionRate = totalApplications > 0 
    ? Math.round(((statusCounts.offer || 0) / totalApplications) * 100)
    : 0;

  const interviewRate = totalApplications > 0
    ? Math.round(((statusCounts.interviewing || 0) / totalApplications) * 100)
    : 0;

  // Prepare data for charts
  const statusData = [
    { name: 'Applied', value: statusCounts.applied || 0, color: '#3b82f6' },
    { name: 'Interviewing', value: statusCounts.interviewing || 0, color: '#f59e0b' },
    { name: 'Offer', value: statusCounts.offer || 0, color: '#10b981' },
    { name: 'Rejected', value: statusCounts.rejected || 0, color: '#ef4444' },
  ];

  // Applications by month
  const monthlyData = jobs.reduce((acc, job) => {
    const month = new Date(job.dateApplied).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData)
    .map(([month, count]) => ({ month, applications: count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Priority distribution
  const priorityData = jobs.reduce((acc, job) => {
    acc[job.priority] = (acc[job.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = [
    { name: 'High', value: priorityData.high || 0, color: '#ef4444' },
    { name: 'Medium', value: priorityData.medium || 0, color: '#f59e0b' },
    { name: 'Low', value: priorityData.low || 0, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {jobs.length > 0 ? 'Keep applying!' : 'Start your job search'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewRate}%</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.interviewing || 0} interviews scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.offer || 0} offers received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.offer || statusCounts.interviewing ? '+12%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              From last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Distribution of your applications by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications per Month */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Timeline</CardTitle>
            <CardDescription>Number of applications submitted per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {monthlyChartData.length > 0 ? (
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>How you prioritize your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Rate Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Response Analysis</CardTitle>
            <CardDescription>Your application success funnel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Applications Sent</span>
                <span className="text-sm">{totalApplications}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interviews</span>
                <span className="text-sm">{statusCounts.interviewing || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${interviewRate}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offers</span>
                <span className="text-sm">{statusCounts.offer || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${conversionRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
