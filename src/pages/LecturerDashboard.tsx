
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Upload, Download } from 'lucide-react';
import StudentManagement from '../components/lecturer/StudentManagement';
import CourseManagement from '../components/lecturer/CourseManagement';
import ResultManagement from '../components/lecturer/ResultManagement';
import ProfileSettings from '../components/lecturer/ProfileSettings';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useResults } from '@/hooks/useResults';
import { useSessions } from '@/hooks/useSessions';

const LecturerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Listen for tab change events
  React.useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('change-dashboard-tab', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('change-dashboard-tab', handleTabChange as EventListener);
    };
  }, []);

  // Fetch real data
  const { data: students = [] } = useStudents();
  const { data: courses = [] } = useCourses();
  const { data: results = [] } = useResults();
  const { data: sessions = [] } = useSessions();

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
      icon: Upload, 
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Lecturer Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage students, courses, and academic results</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-[400px] h-auto p-1 bg-white shadow-sm rounded-lg">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="students" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Students</TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Courses</TabsTrigger>
              <TabsTrigger value="results" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Results</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Profile</TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
            <TabsContent value="overview" className="m-0 p-4 sm:p-6 space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="animate-slide-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
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
                  <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                  <CardDescription className="text-sm">Frequently used actions for efficient management</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button 
                      className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-2 text-sm"
                      onClick={handleUploadResults}
                    >
                      <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span>Upload Results</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-2 text-sm"
                      onClick={handleAddStudents}
                    >
                      <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span>Add Students</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-2 text-sm"
                      onClick={handleGenerateReports}
                    >
                      <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span>Generate Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="m-0 p-4 sm:p-6">
              <StudentManagement />
            </TabsContent>

            <TabsContent value="courses" className="m-0 p-4 sm:p-6">
              <CourseManagement />
            </TabsContent>

            <TabsContent value="results" className="m-0 p-4 sm:p-6">
              <ResultManagement />
            </TabsContent>

            <TabsContent value="profile" className="m-0 p-4 sm:p-6">
              <ProfileSettings />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default LecturerDashboard;
