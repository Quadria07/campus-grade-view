
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, GraduationCap, BookOpen, Shield, Plus, Download, Edit } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AddUserDialog from '../components/admin/AddUserDialog';
import AddLecturerDialog from '../components/admin/AddLecturerDialog';
import StudentForm from '../components/lecturer/StudentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddStudent } from '../hooks/useStudents';
import { useSessions, useAddSession } from '../hooks/useSessions';
import { useSemesters, useAddSemester, useUpdateSemester, useDeleteSemester } from '../hooks/useSemesters';
import { useCourses, useAddCourse, useUpdateCourse, useDeleteCourse, useDepartments } from '../hooks/useCourses';
import DepartmentManagement from '../components/admin/DepartmentManagement';
import SessionManagement from '../components/admin/SessionManagement';
import CourseManagement from '../components/admin/CourseManagement';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddLecturerDialogOpen, setIsAddLecturerDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  
  const { data: students } = useStudents();
  const { data: sessions } = useSessions();
  const { data: semesters } = useSemesters();
  const { data: courses } = useCourses();
  const { data: departments } = useDepartments();
  const addStudentMutation = useAddStudent();

  // Fetch lecturers data
  const { data: lecturers } = useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lecturer_profiles')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Fetch all users data
  const { data: allUsers } = useQuery({
    queryKey: ['all_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const handleExportUsers = () => {
    if (!allUsers) return;
    const csvData = allUsers.map(user => `${user.email},${user.role},${user.is_active}`).join('\n');
    const blob = new Blob([`Email,Role,Active\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

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

  const handleExportLecturers = () => {
    if (!lecturers) return;
    const csvData = lecturers.map(lecturer => 
      `${lecturer.employee_id || 'N/A'},${lecturer.first_name},${lecturer.last_name},${lecturer.department || 'N/A'}`
    ).join('\n');
    const blob = new Blob([`Employee ID,First Name,Last Name,Department\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lecturers.csv';
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
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsers?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Active system users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lecturers?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Registered lecturers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Available courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{departments?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Academic departments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sessions?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Academic sessions</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Departments</CardTitle>
                  <CardDescription>Latest department registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments?.slice(0, 5).map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{dept.name}</span>
                          <p className="text-xs text-gray-500">{dept.code}</p>
                        </div>
                      </div>
                    ))}
                    {!departments?.length && (
                      <p className="text-sm text-gray-500">No departments found</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Current academic sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sessions?.filter(session => session.is_active).slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{session.name}</span>
                          <p className="text-xs text-gray-500">
                            {new Date(session.start_date).getFullYear()} - {new Date(session.end_date).getFullYear()}
                          </p>
                        </div>
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      </div>
                    ))}
                    {!sessions?.filter(session => session.is_active).length && (
                      <p className="text-sm text-gray-500">No active sessions</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Courses</CardTitle>
                  <CardDescription>Latest course additions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses?.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{course.name}</span>
                          <p className="text-xs text-gray-500">{course.code} - {course.units} units</p>
                        </div>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                    ))}
                    {!courses?.length && (
                      <p className="text-sm text-gray-500">No courses found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all system users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button onClick={() => setIsAddUserDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New User
                  </Button>
                  <Button variant="outline" onClick={handleExportUsers}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? "default" : "destructive"}>
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lecturers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lecturer Management</CardTitle>
                <CardDescription>Manage lecturer accounts and profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button onClick={() => setIsAddLecturerDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Lecturer
                  </Button>
                  <Button variant="outline" onClick={handleExportLecturers}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Lecturers
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturers?.map((lecturer) => (
                      <TableRow key={lecturer.id}>
                        <TableCell>{lecturer.first_name} {lecturer.last_name}</TableCell>
                        <TableCell>{lecturer.employee_id || 'N/A'}</TableCell>
                        <TableCell>{lecturer.department || 'N/A'}</TableCell>
                        <TableCell>{lecturer.phone || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

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
                    {students?.slice(0, 10).map((student) => (
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
                {students && students.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing 10 of {students.length} students
                  </p>
                )}
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

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Configure your super admin preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive system alerts and updates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Security Settings</h4>
                      <p className="text-sm text-gray-500">Manage security policies and access controls</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">System Maintenance</h4>
                      <p className="text-sm text-gray-500">Schedule maintenance windows and updates</p>
                    </div>
                    <Button variant="outline" size="sm">Schedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog Components */}
      <AddUserDialog 
        open={isAddUserDialogOpen} 
        onOpenChange={setIsAddUserDialogOpen} 
      />
      
      <AddLecturerDialog 
        open={isAddLecturerDialogOpen} 
        onOpenChange={setIsAddLecturerDialogOpen} 
      />

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
