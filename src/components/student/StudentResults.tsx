
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, Award, BookOpen } from 'lucide-react';

const StudentResults: React.FC = () => {
  const { user } = useAuth();

  // Get current student data
  const { data: currentStudent } = useQuery({
    queryKey: ['current_student', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('students')
        .select('*')
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

  // Get student results
  const { data: results = [] } = useQuery({
    queryKey: ['student_results', currentStudent?.id],
    queryFn: async () => {
      if (!currentStudent?.id) return [];
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          course:courses(code, name, units, level),
          semester:semesters(name, code),
          session:sessions(name)
        `)
        .eq('student_id', currentStudent.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
        throw error;
      }

      return data;
    },
    enabled: !!currentStudent?.id,
  });

  if (!currentStudent) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Profile Found</h3>
            <p className="text-gray-500">
              Please contact the administrator to set up your student profile with a matric number.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalCourses = results.length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;
  
  const gradeDistribution = results.reduce((acc, result) => {
    acc[result.grade] = (acc[result.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'AB': return 'bg-green-400';
      case 'B': return 'bg-blue-500';
      case 'BC': return 'bg-blue-400';
      case 'C': return 'bg-yellow-500';
      case 'CD': return 'bg-yellow-400';
      case 'D': return 'bg-orange-500';
      case 'E': return 'bg-red-400';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Results available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matric Number</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{currentStudent.matric_number}</div>
            <p className="text-xs text-muted-foreground">
              Student ID
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Your performance across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex items-center space-x-2">
                  <Badge variant="outline" className={`${getGradeColor(grade)} text-white`}>
                    {grade}
                  </Badge>
                  <span className="text-sm">{count} course{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Results</CardTitle>
          <CardDescription>
            Your course results for matric number: {currentStudent.matric_number}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No results available</p>
              <p className="text-sm text-gray-400">Your course results will appear here once they are uploaded</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.course?.code}
                    </TableCell>
                    <TableCell>{result.course?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {result.course?.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.course?.units}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getGradeColor(result.grade)} text-white`}>
                        {result.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.session?.name}</TableCell>
                    <TableCell>{result.semester?.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {result.remarks || 'No remarks'}
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

export default StudentResults;
