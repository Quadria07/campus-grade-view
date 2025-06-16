
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  description?: string;
  created_at: string;
}

export const useActivityLogs = (userId?: string, limit = 10) => {
  return useQuery({
    queryKey: ['activity_logs', userId, limit],
    queryFn: async () => {
      console.log('Fetching activity logs for user:', userId);
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }

      console.log('Activity logs fetched:', data);
      return data as ActivityLog[];
    },
    enabled: !!userId,
  });
};

export const useAddActivityLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logData: Omit<ActivityLog, 'id' | 'created_at'>) => {
      console.log('Adding activity log:', logData);
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([logData])
        .select()
        .single();

      if (error) {
        console.error('Error adding activity log:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
    },
    onError: (error) => {
      console.error('Failed to add activity log:', error);
    },
  });
};
