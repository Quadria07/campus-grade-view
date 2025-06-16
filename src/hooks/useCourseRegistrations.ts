
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CourseRegistration {
  id: string;
  student_id: string;
  course_id: string;
  session_id: string;
  semester_id: string;
  registration_date: string;
  is_active: boolean;
  course?: {
    id: string;
    name: string;
    code: string;
    units: number;
    level: string;
  };
  session?: {
    id: string;
    name: string;
  };
  semester?: {
    id: string;
    name: string;
    code: string;
  };
}

export const useCourseRegistrations = (studentId?: string) => {
  return useQuery({
    queryKey: ['course_registrations', studentId],
    queryFn: async () => {
      console.log('Fetching course registrations for student:', studentId);
      let query = supabase
        .from('course_registrations')
        .select(`
          *,
          course:courses(id, name, code, units, level),
          session:sessions(id, name),
          semester:semesters(id, name, code)
        `);

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query.eq('is_active', true);

      if (error) {
        console.error('Error fetching course registrations:', error);
        throw error;
      }

      console.log('Course registrations fetched:', data);
      return data as CourseRegistration[];
    },
    enabled: !!studentId,
  });
};

export const useAddCourseRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registrationData: Omit<CourseRegistration, 'id' | 'registration_date' | 'course' | 'session' | 'semester'>) => {
      console.log('Adding course registration:', registrationData);
      const { data, error } = await supabase
        .from('course_registrations')
        .insert([registrationData])
        .select()
        .single();

      if (error) {
        console.error('Error adding course registration:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course_registrations'] });
      toast({
        title: "Course Registered",
        description: "Course has been successfully registered.",
      });
    },
    onError: (error) => {
      console.error('Failed to register course:', error);
      toast({
        title: "Error",
        description: "Failed to register course. Please try again.",
        variant: "destructive",
      });
    },
  });
};
