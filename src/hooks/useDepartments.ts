
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      console.log('Fetching departments...');
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }

      console.log('Departments fetched:', data);
      return data as Department[];
    },
  });
};

export const useAddDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (departmentData: Omit<Department, 'id' | 'created_at'>) => {
      console.log('Adding department:', departmentData);
      const { data, error } = await supabase
        .from('departments')
        .insert([departmentData])
        .select()
        .single();

      if (error) {
        console.error('Error adding department:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Department Added",
        description: "Department has been successfully added to the system.",
      });
    },
    onError: (error) => {
      console.error('Failed to add department:', error);
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...departmentData }: Partial<Department> & { id: string }) => {
      console.log('Updating department:', id, departmentData);
      const { data, error } = await supabase
        .from('departments')
        .update(departmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating department:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Department Updated",
        description: "Department has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to update department:', error);
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      });
    },
  });
};
