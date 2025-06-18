
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Plus, Download } from 'lucide-react';
import { useStudents, useAddStudent } from '../hooks/useStudents';
import { useResults } from '../hooks/useResults';
import StudentForm from '../components/lecturer/StudentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSessions } from '../hooks/useSessions';
import { useCourses, useDepartments } from '../hooks/useCourses';
import DepartmentManagement from '../components/admin/DepartmentManagement';
import SessionManagement from '../components/admin/SessionManagement';
import CourseManagement from '../components/admin/CourseManagement';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  
  const { data: students } = useStudents();
  const { data: sessions } = useSessions();
  const { data: courses } = useCourses();
  const { data: departments } = useDepartments();
  const { data: results } = useResults();
  const addStudentMutation = useAddStudent();

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
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
            </div>
            <Badge variant="destructive" className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Super Admin
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage student accounts and academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button onClick={() => setIsAddStudentDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Student
                  </Button>
                  <Button variant="outline" onClick={handleExportStudents}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Students
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matric Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.matric_number}</TableCell>
                        <TableCell>{student.first_name} {student.last_name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>
                          <Badge variant="default">{student.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
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

          <TabsContent value="departments" className="space-y-6">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <SessionManagement />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CourseManagement />
          </TabsContent>
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
    </div>
  );
};

export default SuperAdminDashboard;
