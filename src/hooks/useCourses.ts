
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  name: string;
  code: string;
  department_id: string | null;
  semester_id: string | null;
  level: string;
  units: number;
  created_at: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  semester?: {
    id: string;
    name: string;
    code: string;
  };
}

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching courses...');
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          department:departments(id, name, code),
          semester:semesters(id, name, code)
        `)
        .order('code');

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      console.log('Courses fetched:', data);
      return data as Course[];
    },
  });
};

export const useAddCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData: Omit<Course, 'id' | 'created_at' | 'department'>) => {
      console.log('Adding course:', courseData);
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (error) {
        console.error('Error adding course:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Added",
        description: "Course has been successfully added to the system.",
      });
    },
    onError: (error) => {
      console.error('Failed to add course:', error);
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...courseData }: Partial<Course> & { id: string }) => {
      console.log('Updating course:', id, courseData);
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating course:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Updated",
        description: "Course has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to update course:', error);
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting course:', id);
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting course:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Deleted",
        description: "Course has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Failed to delete course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
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

      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }

      return data;
    },
  });
};

export const useSemesters = () => {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching semesters:', error);
        throw error;
      }

      return data;
    },
  });
};
