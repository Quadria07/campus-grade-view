import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface StudentResult {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  score: number;
  grade: string;
  gradePoint: number;
  semester: string;
  session: string;
  remark: string;
}

// Grade point mapping based on the new calculate_grade function
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

export const useStudentResults = (studentId?: string) => {
  return useQuery({
    queryKey: ['student-results', studentId],
    queryFn: async () => {
      console.log('Fetching student results for student:', studentId);
      
      if (!studentId) {
        // For demo purposes, use the demo student
        const { data: demoStudent, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('matric_number', 'STU001')
          .single();

        if (studentError) {
          console.error('Error fetching demo student:', studentError);
          throw studentError;
        }

        studentId = demoStudent.id;
      }

      const { data, error } = await supabase
        .from('results')
        .select(`
          id,
          score,
          grade,
          remarks,
          course:courses(name, code, units),
          semester:semesters(name, code),
          session:sessions(name)
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student results:', error);
        throw error;
      }

      console.log('Student results fetched:', data);

      // Transform the data to match the component interface
      const transformedResults: StudentResult[] = data.map((result: any) => ({
        id: result.id,
        courseCode: result.course?.code || '',
        courseTitle: result.course?.name || '',
        creditUnits: result.course?.units || 0,
        score: result.score,
        grade: result.grade,
        gradePoint: getGradePoint(result.grade),
        semester: result.semester?.name || '',
        session: result.session?.name || '',
        remark: result.remarks || 'Pass'
      }));

      return transformedResults;
    },
    enabled: true, // Always enabled for demo purposes
  });
};

export const useStudentProfile = (studentId?: string) => {
  return useQuery({
    queryKey: ['student-profile', studentId],
    queryFn: async () => {
      console.log('Fetching student profile for student:', studentId);
      
      // For demo purposes, fetch the demo student
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          first_name,
          last_name,
          matric_number,
          email,
          level,
          department:departments(name, code)
        `)
        .eq('matric_number', 'STU001')
        .single();

      if (error) {
        console.error('Error fetching student profile:', error);
        throw error;
      }

      console.log('Student profile fetched:', data);
      return data;
    },
  });
};
