
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCourseRegistrations, useAddCourseRegistration } from '@/hooks/useCourseRegistrations';
import { useCourses } from '@/hooks/useCourses';
import { useSessions } from '@/hooks/useSessions';
import { useSemesters } from '@/hooks/useSemesters';
import { CheckCircle, Plus, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const StudentCourseRegistration: React.FC = () => {
  const { user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');

  // Get current student data
  const { data: currentStudent } = useQuery({
    queryKey: ['current_student', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          department:departments(name, code)
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching student:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: registrations = [] } = useCourseRegistrations(currentStudent?.id);
  const { data: courses = [] } = useCourses();
  const { data: sessions = [] } = useSessions();
  const { data: semesters = [] } = useSemesters();
  const addRegistrationMutation = useAddCourseRegistration();

  // Filter courses by student's department and level
  const availableCourses = courses.filter(course => {
    if (!currentStudent) return false;
    
    // Filter by department
    const departmentMatch = course.department_id === currentStudent.department_id;
    
    // Filter by level (courses for current level or below)
    const studentLevel = parseInt(currentStudent.level);
    const courseLevel = parseInt(course.level);
    const levelMatch = courseLevel <= studentLevel;
    
    // Check if already registered
    const alreadyRegistered = registrations.some(reg => reg.course_id === course.id);
    
    return departmentMatch && levelMatch && !alreadyRegistered;
  });

  const handleRegisterCourse = async () => {
    if (!currentStudent || !selectedCourseId || !selectedSessionId || !selectedSemesterId) {
      toast({
        title: "Error",
        description: "Please select course, session, and semester.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addRegistrationMutation.mutateAsync({
        student_id: currentStudent.id,
        course_id: selectedCourseId,
        session_id: selectedSessionId,
        semester_id: selectedSemesterId,
        is_active: true,
      });

      setSelectedCourseId('');
      setSelectedSessionId('');
      setSelectedSemesterId('');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (!currentStudent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Profile Found</h3>
            <p className="text-gray-500">
              Please contact the administrator to set up your student profile.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalUnits = registrations.reduce((sum, reg) => sum + (reg.course?.units || 0), 0);

  return (
    <div className="space-y-6">
      {/* Registration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Registered Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Current semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              Credit units registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{currentStudent.department?.code || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {currentStudent.department?.name || 'No department'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Register for New Course</CardTitle>
          <CardDescription>
            Select a course, session, and semester to register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Course</label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.filter(course => course.id && course.id.trim() !== '').map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.units} units)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Session</label>
              <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.filter(session => session.id && session.id.trim() !== '').map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Semester</label>
              <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.filter(semester => semester.id && semester.id.trim() !== '').map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleRegisterCourse}
            disabled={!selectedCourseId || !selectedSessionId || !selectedSemesterId || addRegistrationMutation.isPending}
            className="w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {addRegistrationMutation.isPending ? 'Registering...' : 'Register Course'}
          </Button>
        </CardContent>
      </Card>

      {/* Registered Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Registered Courses</CardTitle>
          <CardDescription>
            Courses you are currently registered for
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No courses registered yet</p>
              <p className="text-sm text-gray-400">Register for courses using the form above</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.course?.code}
                    </TableCell>
                    <TableCell>{registration.course?.name}</TableCell>
                    <TableCell>{registration.course?.units}</TableCell>
                    <TableCell>{registration.course?.level}</TableCell>
                    <TableCell>{registration.session?.name}</TableCell>
                    <TableCell>{registration.semester?.name}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Registered
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCourseRegistration;
