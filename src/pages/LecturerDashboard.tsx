
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, FileText, Upload, Download, Settings } from 'lucide-react';
import StudentManagement from '../components/lecturer/StudentManagement';
import CourseManagement from '../components/lecturer/CourseManagement';
import ResultManagement from '../components/lecturer/ResultManagement';
import ProfileSettings from '../components/lecturer/ProfileSettings';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useResults } from '@/hooks/useResults';
import { useSessions } from '@/hooks/useSessions';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { useAuth } from '@/contexts/AuthContext';

const LecturerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  // Fetch real data
  const { data: students = [] } = useStudents();
  const { data: courses = [] } = useCourses();
  const { data: results = [] } = useResults();
  const { data: sessions = [] } = useSessions();
  const { data: activityLogs = [] } = useActivityLogs(user?.id, 5);

  // Calculate real statistics
  const activeStudents = students.filter(student => student.status === 'active');
  const activeCourses = courses.length;
  const totalResults = results.length;
  const activeSessions = sessions.filter(session => session.is_active);

  const stats = [
    { 
      title: 'Active Students', 
      value: activeStudents.length.toString(), 
      icon: Users, 
      change: `${students.length} total` 
    },
    { 
      title: 'Active Courses', 
      value: activeCourses.toString(), 
      icon: BookOpen, 
      change: `${courses.length} total` 
    },
    { 
      title: 'Results Uploaded', 
      value: totalResults.toString(), 
      icon: FileText, 
      change: `${results.filter(r => new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} this month` 
    },
    { 
      title: 'Active Sessions', 
      value: activeSessions.length.toString(), 
      icon: Upload, 
      change: `${sessions.length} total` 
    },
  ];

  // Function to handle quick actions
  const handleUploadResults = () => {
    setActiveTab('results');
  };

  const handleAddStudents = () => {
    setActiveTab('students');
  };

  const handleGenerateReports = () => {
    setActiveTab('results');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'add':
        return '✅';
      case 'update':
      case 'edit':
        return '✏️';
      case 'delete':
        return '🗑️';
      default:
        return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lecturer Dashboard</h1>
          <p className="text-gray-600">Manage students, courses, and academic results</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="animate-slide-in">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-600">{stat.change}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions for efficient management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={handleUploadResults}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Results</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={handleAddStudents}
                  >
                    <Users className="h-6 w-6" />
                    <span>Add Students</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={handleGenerateReports}
                  >
                    <Download className="h-6 w-6" />
                    <span>Generate Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No recent activity</p>
                      <p className="text-sm">Start managing students, courses, or results to see activity here</p>
                    </div>
                  ) : (
                    activityLogs.map((log, index) => (
                      <div key={log.id} className="flex items-center space-x-4">
                        <div className="text-lg">{getActivityIcon(log.action)}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {log.description || `${log.action} ${log.entity_type}`}
                          </p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(log.created_at)}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.action === 'create' || log.action === 'add' ? 'bg-green-100 text-green-800' :
                          log.action === 'update' || log.action === 'edit' ? 'bg-blue-100 text-blue-800' :
                          log.action === 'delete' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="results">
            <ResultManagement />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LecturerDashboard;
