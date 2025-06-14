
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  matric_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  level: string;
  status: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  department_id?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
  department?: { name: string; code: string };
  session?: { name: string };
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Session {
  id: string;
  name: string;
  is_active: boolean;
}

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      console.log('Fetching students...');
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          department:departments(name, code),
          session:sessions(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      console.log('Students fetched:', data);
      return data as Student[];
    },
  });
};

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
    },
  });
};

export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('is_active', { ascending: false });

      if (error) throw error;
      return data as Session[];
    },
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
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

      console.log('Student added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Added",
        description: "Student has been successfully added to the system.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to add student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add student. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: string }) => {
      console.log('Updating student:', id, updates);
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating student:', error);
        throw error;
      }

      console.log('Student updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Updated",
        description: "Student details have been successfully updated.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to update student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update student. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting student:', id);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }

      console.log('Student deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student Deleted",
        description: "Student has been successfully removed from the system.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete student:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    },
  });
};
