
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Download, User, TrendingUp } from 'lucide-react';
import StudentProfile from '../components/student/StudentProfile';
import StudentResults from '../components/student/StudentResults';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Current CGPA', value: '3.65', icon: TrendingUp, change: '+0.12' },
    { title: 'Completed Courses', value: '24', icon: BookOpen, change: '+3' },
    { title: 'Current Semester', value: '400L', icon: User, change: '' },
    { title: 'Total Credits', value: '156', icon: Download, change: '+12' },
  ];

  const recentResults = [
    { code: 'CSC401', title: 'Software Engineering', score: 78, grade: 'B+', semester: '2023/2024 First' },
    { code: 'CSC402', title: 'Database Systems', score: 85, grade: 'A', semester: '2023/2024 First' },
    { code: 'CSC403', title: 'Computer Networks', score: 72, grade: 'B', semester: '2023/2024 First' },
    { code: 'CSC404', title: 'Web Development', score: 88, grade: 'A', semester: '2023/2024 First' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your academic progress and results</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
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
                    {stat.change && (
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">{stat.change}</span> from last semester
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your latest course results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium">{result.code}</div>
                          <div className="text-sm text-gray-600">{result.title}</div>
                        </div>
                        <div className="text-sm text-gray-500">{result.semester}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{result.score}</div>
                        <div className={`text-sm font-medium ${
                          result.grade.startsWith('A') ? 'text-green-600' :
                          result.grade.startsWith('B') ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          Grade: {result.grade}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Transcript
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Academic Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress to Graduation</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Credits Completed:</span>
                      <span className="ml-2 font-medium">156/208</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining Credits:</span>
                      <span className="ml-2 font-medium">52</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <StudentResults />
          </TabsContent>

          <TabsContent value="profile">
            <StudentProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
