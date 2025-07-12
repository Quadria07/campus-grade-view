import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StudentResultsOverview from './StudentResultsOverview';

const StudentResults: React.FC = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Get current student data
  const { data: currentStudent, isLoading: studentLoading } = useQuery({
    queryKey: ['current_student', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          department:departments!students_department_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Get student results
  const { data: allResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['student_results', currentStudent?.id],
    queryFn: async () => {
      if (!currentStudent?.id) return [];
      
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          course:courses(code, name, units),
          semester:semesters(name),
          session:sessions(name)
        `)
        .eq('student_id', currentStudent.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentStudent?.id,
  });

  // Get unique sessions and semesters
  const sessions = [...new Set(allResults.map(result => result.session?.name).filter(Boolean))];
  const semesters = [...new Set(allResults.map(result => result.semester?.name).filter(Boolean))];

  // Filter results based on selected session and semester
  const filteredResults = allResults.filter(result => 
    (!selectedSession || result.session?.name === selectedSession) && 
    (!selectedSemester || result.semester?.name === selectedSemester)
  );

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-green-600 bg-green-50';
    if (grade === 'AB' || grade === 'B') return 'text-blue-600 bg-blue-50';
    if (grade === 'BC' || grade === 'C') return 'text-yellow-600 bg-yellow-50';
    if (grade === 'CD' || grade === 'D') return 'text-orange-600 bg-orange-50';
    if (grade === 'E') return 'text-red-400 bg-red-50';
    return 'text-red-600 bg-red-50';
  };

  if (studentLoading || resultsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Results</h3>
          <p className="text-gray-500">Please wait while we fetch your academic records...</p>
        </div>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Profile Found</h3>
        <p className="text-gray-500">Please contact the administrator to set up your student profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Academic Results</h2>
        <p className="text-gray-600">View your academic performance and grades</p>
      </div>

      <StudentResultsOverview />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Detailed Results
          </CardTitle>
          <CardDescription>
            View your course results filtered by session and semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          {(sessions.length > 0 || semesters.length > 0) && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sessions</SelectItem>
                  {sessions.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Semesters</SelectItem>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester} Semester</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Results Table */}
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Semester</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.course?.code}</TableCell>
                      <TableCell>{result.course?.name}</TableCell>
                      <TableCell className="text-center font-bold">{result.score}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{result.course?.units}</TableCell>
                      <TableCell>{result.session?.name}</TableCell>
                      <TableCell>{result.semester?.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {allResults.length === 0 
                ? "No results available for your matric number."
                : "No results found for the selected filters."
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResults;
