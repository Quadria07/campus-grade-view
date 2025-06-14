
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  email: string;
  level: string;
  department_id?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  status: string;
  user_id?: string;
}

// Hook to get student profile by user_id
export const useStudentProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['student_profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          departments(name)
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as Student & { departments?: { name: string } };
    },
    enabled: !!userId
  });
};

// Hook to get all students
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          departments(name)
        `)
        .order('matric_number');

      if (error) throw error;
      return data as (Student & { departments?: { name: string } })[];
    }
  });
};
