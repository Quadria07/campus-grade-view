
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
      
      <main className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">Access your academic information, results, and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 min-w-[320px] h-auto p-1 bg-white shadow-sm rounded-lg">
              <TabsTrigger 
                value="profile" 
                className="flex flex-col items-center text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all whitespace-nowrap"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex flex-col items-center text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all whitespace-nowrap"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
                <span>Results</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reportcard" 
                className="flex flex-col items-center text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all whitespace-nowrap"
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
                <span className="hidden sm:inline">Report Card</span>
                <span className="sm:hidden">Report</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex flex-col items-center text-xs sm:text-sm px-1 sm:px-2 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all whitespace-nowrap"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 mb-1" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
            <TabsContent value="profile" className="m-0 p-4 sm:p-6">
              <StudentProfile />
            </TabsContent>

            <TabsContent value="results" className="m-0 p-4 sm:p-6">
              <StudentResults />
            </TabsContent>

            <TabsContent value="reportcard" className="m-0 p-4 sm:p-6">
              <ReportCard />
            </TabsContent>

            <TabsContent value="settings" className="m-0 p-4 sm:p-6">
              <StudentProfileSettings />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
