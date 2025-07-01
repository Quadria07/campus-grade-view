
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const StudentResultsOverview: React.FC = () => {
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
        .maybeSingle();

      if (error) throw error;
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

  const calculateCGPA = () => {
    if (results.length === 0) return '0.00';
    
    const getGradePoint = (grade: string): number => {
      switch (grade) {
        case 'A': return 4.0;
        case 'AB': return 3.5;
        case 'B': return 3.0;
        case 'BC': return 2.5;
        case 'C': return 2.0;
        case 'CD': return 1.5;
        case 'D': return 1.0;
        case 'E': return 0.5;
        case 'F': return 0.0;
        default: return 0.0;
      }
    };

    const totalPoints = results.reduce((sum, result) => {
      const gradePoint = getGradePoint(result.grade);
      const units = result.course?.units || 0;
      return sum + (gradePoint * units);
    }, 0);

    const totalCredits = results.reduce((sum, result) => sum + (result.course?.units || 0), 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getPerformanceStatus = () => {
    const cgpa = parseFloat(calculateCGPA());
    if (cgpa >= 3.5) return { status: 'Excellent', color: 'text-green-600' };
    if (cgpa >= 3.0) return { status: 'Very Good', color: 'text-blue-600' };
    if (cgpa >= 2.5) return { status: 'Good', color: 'text-yellow-600' };
    if (cgpa >= 2.0) return { status: 'Fair', color: 'text-orange-600' };
    return { status: 'Needs Improvement', color: 'text-red-600' };
  };

  const performance = getPerformanceStatus();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calculateCGPA()}</div>
          <p className="text-xs text-muted-foreground">
            Based on {results.length} course{results.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${performance.color}`}>
            {performance.status}
          </div>
          <p className="text-xs text-muted-foreground">
            Current academic standing
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResultsOverview;
