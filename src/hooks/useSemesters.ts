
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Semester {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export const useSemesters = () => {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      console.log('Fetching semesters...');
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching semesters:', error);
        throw error;
      }

      console.log('Semesters fetched:', data);
      return data as Semester[];
    },
  });
};

export const useAddSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (semesterData: Omit<Semester, 'id' | 'created_at'>) => {
      console.log('Adding semester:', semesterData);
      const { data, error } = await supabase
        .from('semesters')
        .insert([semesterData])
        .select()
        .single();

      if (error) {
        console.error('Error adding semester:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast({
        title: "Semester Added",
        description: "Semester has been successfully added to the system.",
      });
    },
    onError: (error) => {
      console.error('Failed to add semester:', error);
      toast({
        title: "Error",
        description: "Failed to add semester. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...semesterData }: Partial<Semester> & { id: string }) => {
      console.log('Updating semester:', id, semesterData);
      const { data, error } = await supabase
        .from('semesters')
        .update(semesterData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating semester:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast({
        title: "Semester Updated",
        description: "Semester has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to update semester:', error);
      toast({
        title: "Error",
        description: "Failed to update semester. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSemester = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting semester:', id);
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting semester:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast({
        title: "Semester Deleted",
        description: "Semester has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Failed to delete semester:', error);
      toast({
        title: "Error",
        description: "Failed to delete semester. Please try again.",
        variant: "destructive",
      });
    },
  });
};
