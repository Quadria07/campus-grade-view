
import React, { useState } from 'react';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, User, BarChart3, FileText } from 'lucide-react';
import StudentProfile from '../components/student/StudentProfile';
import StudentResults from '../components/student/StudentResults';
import StudentProfileSettings from '../components/student/StudentProfileSettings';
import ReportCard from '../components/student/ReportCard';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Access your academic information, results, and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="reportcard" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Report Card
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <StudentProfile />
          </TabsContent>

          <TabsContent value="results">
            <StudentResults />
          </TabsContent>

          <TabsContent value="reportcard">
            <ReportCard />
          </TabsContent>

          <TabsContent value="settings">
            <StudentProfileSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
