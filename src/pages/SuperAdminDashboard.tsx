import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, GraduationCap, BookOpen, Shield, Plus, Download, Edit, Link } from 'lucide-react';
import { useStudents, useUpdateStudent } from '../hooks/useStudents';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AddUserDialog from '../components/admin/AddUserDialog';
import AddLecturerDialog from '../components/admin/AddLecturerDialog';
import StudentForm from '../components/lecturer/StudentForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAddStudent } from '../hooks/useStudents';
import { useSessions } from '../hooks/useSessions';
import { useCourses, useDepartments } from '../hooks/useCourses';
import DepartmentManagement from '../components/admin/DepartmentManagement';
import SessionManagement from '../components/admin/SessionManagement';
import CourseManagement from '../components/admin/CourseManagement';
import { toast } from '@/hooks/use-toast';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddLecturerDialogOpen, setIsAddLecturerDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [linkingStudentId, setLinkingStudentId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const { data: students } = useStudents();
  const { data: sessions } = useSessions();
  const { data: courses } = useCourses();
  const { data: departments } = useDepartments();
  const addStudentMutation = useAddStudent();
  const updateStudentMutation = useUpdateStudent();

  // Fetch lecturers data with better error handling
  const { data: lecturers, isLoading: lecturersLoading, error: lecturersError } = useQuery({
    queryKey: ['lecturers'],
    queryFn: async () => {
      console.log('Fetching lecturers...');
      const { data, error } = await supabase
        .from('lecturer_profiles')
        .select(`
          *,
          user:users!lecturer_profiles_user_id_fkey(email, is_active)
        `);
      
      if (error) {
        console.error('Error fetching lecturers:', error);
        throw error;
      }
      
      console.log('Lecturers data:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000
  });

  // Fetch all users data with better error handling  
  const { data: allUsers, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['all_users'],
    queryFn: async () => {
      console.log('Fetching all users...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('All users data:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000
  });

  // Get users that are not linked to any student (only role = 'user')
  const unlinkedUsers = React.useMemo(() => {
    if (!allUsers || !students) return [];
    
    const linkedUserIds = students
      .filter(student => student.user_id)
      .map(student => student.user_id);
    
    const filtered = allUsers.filter(user => 
      user.role === 'user' && !linkedUserIds.includes(user.id)
    );
    
    console.log('Unlinked users:', filtered);
    console.log('All users count:', allUsers.length);
    console.log('Students with user_id:', students?.filter(s => s.user_id).length);
    console.log('Linked user IDs:', linkedUserIds);
    
    return filtered;
  }, [allUsers, students]);

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

  const handleLinkStudent = async () => {
    if (!linkingStudentId || !selectedUserId) {
      toast({
        title: "Error",
        description: "Please select both student and user to link.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateStudentMutation.mutateAsync({
        id: linkingStudentId,
        user_id: selectedUserId,
      });
      setLinkingStudentId(null);
      setSelectedUserId('');
      toast({
        title: "Success",
        description: "Student has been linked to user account.",
      });
    } catch (error) {
      console.error('Failed to link student:', error);
    }
  };

  // Debug logging
  React.useEffect(() => {
    console.log('Dashboard state:', {
      usersLoading,
      lecturersLoading,
      usersError,
      lecturersError,
      allUsersCount: allUsers?.length,
      lecturersCount: lecturers?.length,
      studentsCount: students?.length,
      unlinkedUsersCount: unlinkedUsers?.length
    });
  }, [usersLoading, lecturersLoading, usersError, lecturersError, allUsers, lecturers, students, unlinkedUsers]);

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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usersLoading ? 'Loading...' : (allUsers?.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Active system users</p>
                  {usersError && (
                    <p className="text-xs text-red-500">Error loading users</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {lecturersLoading ? 'Loading...' : (lecturers?.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Registered lecturers</p>
                  {lecturersError && (
                    <p className="text-xs text-red-500">Error loading lecturers</p>
                  )}
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
                {usersLoading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : usersError ? (
                  <div className="text-center py-4 text-red-500">
                    Error loading users: {usersError.message}
                  </div>
                ) : (
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
                )}
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
                {lecturersLoading ? (
                  <div className="text-center py-4">Loading lecturers...</div>
                ) : lecturersError ? (
                  <div className="text-center py-4 text-red-500">
                    Error loading lecturers: {lecturersError.message}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lecturers?.map((lecturer) => (
                        <TableRow key={lecturer.id}>
                          <TableCell>{lecturer.first_name} {lecturer.last_name}</TableCell>
                          <TableCell>{lecturer.employee_id || 'N/A'}</TableCell>
                          <TableCell>{lecturer.department || 'N/A'}</TableCell>
                          <TableCell>{lecturer.user?.email || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={lecturer.user?.is_active ? "default" : "destructive"}>
                              {lecturer.user?.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
                      <TableHead>User Link</TableHead>
                      <TableHead>Actions</TableHead>
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
                        <TableCell>
                          {student.user_id ? (
                            <Badge variant="outline" className="bg-green-50">
                              <Link className="w-3 h-3 mr-1" />
                              Linked
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50">
                              Not Linked
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {!student.user_id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setLinkingStudentId(student.id)}
                            >
                              <Link className="w-4 h-4 mr-1" />
                              Link User
                            </Button>
                          )}
                        </TableCell>
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

      {/* Link Student to User Dialog */}
      <Dialog open={!!linkingStudentId} onOpenChange={() => setLinkingStudentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Student to User Account</DialogTitle>
            <DialogDescription>
              Select a user account to link with this student. Only showing users with 'user' role that are not already linked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {usersLoading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user account" />
                </SelectTrigger>
                <SelectContent>
                  {unlinkedUsers && unlinkedUsers.length > 0 ? (
                    unlinkedUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email} ({user.role})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No unlinked users available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            {unlinkedUsers && unlinkedUsers.length === 0 && !usersLoading && (
              <p className="text-sm text-gray-500">
                No unlinked users with 'user' role found. Create a new user first or ensure existing users have the correct role.
              </p>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setLinkingStudentId(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleLinkStudent} 
                disabled={!selectedUserId || !unlinkedUsers?.length}
              >
                Link Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminDashboard;
