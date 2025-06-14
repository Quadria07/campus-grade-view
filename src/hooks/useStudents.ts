
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  session_id?: string;
  semester_id?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Session {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Semester {
  id: string;
  name: string;
  code: string;
  created_at: string;
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

// Hook to get all departments
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Department[];
    }
  });
};

// Hook to get all sessions
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as Session[];
    }
  });
};

// Hook to get all semesters
export const useSemesters = () => {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Semester[];
    }
  });
};

// Hook to add a new student
export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: Omit<Student, 'id'>) => {
      console.log('Adding student:', studentData);
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) {
        console.error('Error adding student:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Added",
        description: "Student has been successfully added.",
      });
    },
    onError: (error) => {
      console.error('Failed to add student:', error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook to update a student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: Partial<Student> & { id: string }) => {
      console.log('Updating student:', studentData);
      const { id, ...updateData } = studentData;
      
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating student:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Updated",
        description: "Student information has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to update student:', error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook to delete a student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      console.log('Deleting student:', studentId);
      
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }

      return studentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Deleted",
        description: "Student has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Failed to delete student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    },
  });
};
