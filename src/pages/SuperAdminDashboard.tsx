import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Plus, Download, UserPlus } from 'lucide-react';
import { useStudents, useAddStudent } from '../hooks/useStudents';
import { useResults } from '../hooks/useResults';
import StudentForm from '../components/lecturer/StudentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSessions } from '../hooks/useSessions';
import { useCourses, useDepartments } from '../hooks/useCourses';
import DepartmentManagement from '../components/admin/DepartmentManagement';
import SessionManagement from '../components/admin/SessionManagement';
import CourseManagement from '../components/admin/CourseManagement';
import AddLecturerDialog from '../components/admin/AddLecturerDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isAddLecturerDialogOpen, setIsAddLecturerDialogOpen] = useState(false);
  
  const { data: students } = useStudents();
  const { data: sessions } = useSessions();
  const { data: courses } = useCourses();
  const { data: departments } = useDepartments();
  const { data: results } = useResults();
  const addStudentMutation = useAddStudent();

  // Fetch lecturers with improved query
  const { data: lecturers, isLoading: lecturersLoading } = useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      console.log('Fetching lecturers...');
      
      // First get all lecturer profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('lecturer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching lecturer profiles:', profilesError);
        throw profilesError;
      }

      // Then get user data for each lecturer
      const lecturersWithUsers = await Promise.all(
        profiles.map(async (profile) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email, is_active, created_at')
            .eq('id', profile.user_id)
            .single();

          if (userError) {
            console.error('Error fetching user data for lecturer:', userError);
            return {
              ...profile,
              user: null
            };
          }

          return {
            ...profile,
            user: userData
          };
        })
      );

      console.log('Fetched lecturers:', lecturersWithUsers);
      return lecturersWithUsers;
    }
  });

  const handleExportStudents = () => {
    if (!students) return;
    const csvData = students.map(student => 
      `${student.matric_number},${student.first_name},${student.last_name},${student.email},${student.level}`
    ).join('\n');
    const blob = new Blob([`Matric Number,First Name,Last Name,Email,Level\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  const handleExportResults = () => {
    if (!results) return;
    const csvData = results.map(result => 
      `${result.student?.matric_number || 'N/A'},${result.student?.first_name || ''} ${result.student?.last_name || ''},${result.course?.code || 'N/A'},${result.course?.name || 'N/A'},${result.score},${result.grade},${result.semester?.name || 'N/A'},${result.session?.name || 'N/A'}`
    ).join('\n');
    const blob = new Blob([`Matric Number,Student Name,Course Code,Course Name,Score,Grade,Semester,Session\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
  };

  const handleAddStudent = async (studentData: any) => {
    try {
      await addStudentMutation.mutateAsync(studentData);
      setIsAddStudentDialogOpen(false);
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-2">
                Welcome back, {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
            </div>
            <Badge variant="destructive" className="flex items-center w-fit">
              <Shield className="w-4 h-4 mr-1" />
              Super Admin
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 min-w-[600px] h-auto p-1 bg-white shadow-sm rounded-lg">
              <TabsTrigger value="students" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Students</TabsTrigger>
              <TabsTrigger value="lecturers" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Lecturers</TabsTrigger>
              <TabsTrigger value="results" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Results</TabsTrigger>
              <TabsTrigger value="departments" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Departments</TabsTrigger>
              <TabsTrigger value="sessions" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Sessions</TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm px-1 sm:px-2 py-2 whitespace-nowrap">Courses</TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-lg shadow-sm min-h-[500px]">
            <TabsContent value="students" className="m-0 p-4 sm:p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Student Management</CardTitle>
                  <CardDescription className="text-sm">Manage student accounts and academic records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <Button onClick={() => setIsAddStudentDialogOpen(true)} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Student
                    </Button>
                    <Button variant="outline" onClick={handleExportStudents} className="w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" />
                      Export Students
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Matric Number</TableHead>
                          <TableHead className="text-xs sm:text-sm">Name</TableHead>
                          <TableHead className="text-xs sm:text-sm">Email</TableHead>
                          <TableHead className="text-xs sm:text-sm">Level</TableHead>
                          <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students?.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="text-xs sm:text-sm">{student.matric_number}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{student.first_name} {student.last_name}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{student.email}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{student.level}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="text-xs">{student.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lecturers" className="m-0 p-4 sm:p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lecturer Management</CardTitle>
                  <CardDescription>Manage lecturer accounts and profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Button onClick={() => setIsAddLecturerDialogOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add New Lecturer
                    </Button>
                    <div className="text-sm text-gray-600">
                      {lecturersLoading ? 'Loading...' : `Total Lecturers: ${lecturers?.length || 0}`}
                    </div>
                  </div>
                  
                  {lecturersLoading ? (
                    <div className="text-center py-4">Loading lecturers...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lecturers && lecturers.length > 0 ? (
                          lecturers.map((lecturer) => (
                            <TableRow key={lecturer.id}>
                              <TableCell>{lecturer.employee_id || 'N/A'}</TableCell>
                              <TableCell>{lecturer.first_name} {lecturer.last_name}</TableCell>
                              <TableCell>{lecturer.user?.email || 'N/A'}</TableCell>
                              <TableCell>{lecturer.department || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant={lecturer.user?.is_active ? "default" : "secondary"}>
                                  {lecturer.user?.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {lecturer.user?.created_at 
                                  ? new Date(lecturer.user.created_at).toLocaleDateString()
                                  : 'N/A'
                                }
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No lecturers found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="m-0 p-4 sm:p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Results</CardTitle>
                  <CardDescription>View all student academic results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      Total Results: {results?.length || 0}
                    </div>
                    <Button variant="outline" onClick={handleExportResults}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Matric Number</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Session</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results?.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            {result.student?.first_name} {result.student?.last_name}
                          </TableCell>
                          <TableCell>{result.student?.matric_number}</TableCell>
                          <TableCell>
                            {result.course?.code} - {result.course?.name}
                          </TableCell>
                          <TableCell>{result.score}</TableCell>
                          <TableCell>
                            <Badge variant={result.grade === 'F' ? 'destructive' : 'default'}>
                              {result.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.semester?.name}</TableCell>
                          <TableCell>{result.session?.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments" className="m-0 p-4 sm:p-6 space-y-6">
              <DepartmentManagement />
            </TabsContent>

            <TabsContent value="sessions" className="m-0 p-4 sm:p-6 space-y-6">
              <SessionManagement />
            </TabsContent>

            <TabsContent value="courses" className="m-0 p-4 sm:p-6 space-y-6">
              <CourseManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student details below
            </DialogDescription>
          </DialogHeader>
          <StudentForm
            onSubmit={handleAddStudent}
            onCancel={() => setIsAddStudentDialogOpen(false)}
            isLoading={addStudentMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AddLecturerDialog 
        open={isAddLecturerDialogOpen}
        onOpenChange={setIsAddLecturerDialogOpen}
      />
    </div>
  );
};

export default SuperAdminDashboard;
