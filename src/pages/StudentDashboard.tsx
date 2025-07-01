
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BarChart3, FileText } from 'lucide-react';
import StudentProfile from '../components/student/StudentProfile';
import StudentResults from '../components/student/StudentResults';
import StudentProfileSettings from '../components/student/StudentProfileSettings';
import ReportCard from '../components/student/ReportCard';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('change-dashboard-tab', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('change-dashboard-tab', handleTabChange as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Access your academic information, results, and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 sm:mb-8 h-auto p-1">
            <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm px-2 py-2 sm:py-3">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm px-2 py-2 sm:py-3">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Results</span>
              <span className="sm:hidden">Results</span>
            </TabsTrigger>
            <TabsTrigger value="reportcard" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm px-2 py-2 sm:py-3">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Report Card</span>
              <span className="sm:hidden">Report</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center text-xs sm:text-sm px-2 py-2 sm:py-3">
              <User className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
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
