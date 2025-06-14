
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Result {
  id: string;
  student_id: string;
  course_id: string;
  semester_id: string;
  session_id: string;
  score: number;
  grade: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    matric_number: string;
  };
  course?: {
    id: string;
    name: string;
    code: string;
  };
  semester?: {
    id: string;
    name: string;
    code: string;
  };
  session?: {
    id: string;
    name: string;
  };
}

// Type for creating new results - exclude auto-generated fields
export type CreateResultData = {
  student_id: string;
  course_id: string;
  semester_id: string;
  session_id: string;
  score: number;
  remarks?: string;
};

export const useResults = () => {
  return useQuery({
    queryKey: ['results'],
    queryFn: async () => {
      console.log('Fetching results...');
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          student:students(id, first_name, last_name, matric_number),
          course:courses(id, name, code),
          semester:semesters(id, name, code),
          session:sessions(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
        throw error;
      }

      console.log('Results fetched:', data);
      return data as Result[];
    },
  });
};

export const useAddResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resultData: CreateResultData) => {
      console.log('Adding result:', resultData);
      const { data, error } = await supabase
        .from('results')
        .insert([{ ...resultData, grade: 'F' }]) // Temporary grade, will be overwritten by trigger
        .select()
        .single();

      if (error) {
        console.error('Error adding result:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast({
        title: "Result Added",
        description: "Student result has been successfully added.",
      });
    },
    onError: (error) => {
      console.error('Failed to add result:', error);
      toast({
        title: "Error",
        description: "Failed to add result. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...resultData }: Partial<CreateResultData> & { id: string }) => {
      console.log('Updating result:', id, resultData);
      const { data, error } = await supabase
        .from('results')
        .update(resultData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating result:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast({
        title: "Result Updated",
        description: "Result has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to update result:', error);
      toast({
        title: "Error",
        description: "Failed to update result. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting result:', id);
      const { error } = await supabase
        .from('results')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting result:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast({
        title: "Result Deleted",
        description: "Result has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Failed to delete result:', error);
      toast({
        title: "Error",
        description: "Failed to delete result. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useBulkAddResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (results: CreateResultData[]) => {
      console.log('Adding bulk results:', results);
      // Add temporary grade field for each result - will be overwritten by trigger
      const resultsWithGrade = results.map(result => ({ ...result, grade: 'F' }));
      
      const { data, error } = await supabase
        .from('results')
        .insert(resultsWithGrade)
        .select();

      if (error) {
        console.error('Error adding bulk results:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      toast({
        title: "Results Added",
        description: `${data?.length} results have been successfully added.`,
      });
    },
    onError: (error) => {
      console.error('Failed to add bulk results:', error);
      toast({
        title: "Error",
        description: "Failed to add bulk results. Please try again.",
        variant: "destructive",
      });
    },
  });
};
