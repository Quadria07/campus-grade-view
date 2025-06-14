
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  role: 'lecturer' | 'student';
  is_active: boolean;
}

export interface LecturerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  employee_id?: string;
  department?: string;
  phone?: string;
}

// Hook to authenticate user
export const useAuthenticateUser = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.rpc('verify_user_password', {
        p_email: email,
        p_password: password
      });

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Invalid email or password');
      }

      return { user_id: data[0].user_id, role: data[0].role };
    }
  });
};

// Hook to get user details
export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as User;
    },
    enabled: !!userId
  });
};

// Hook to get lecturer profile
export const useLecturerProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['lecturer_profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('lecturer_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as LecturerProfile | null;
    },
    enabled: !!userId
  });
};

// Hook to create lecturer account
export const useCreateLecturerAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      firstName, 
      lastName, 
      employeeId, 
      department, 
      phone 
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      employeeId?: string;
      department?: string;
      phone?: string;
    }) => {
      // Create user
      const { data: userId, error: userError } = await supabase.rpc('create_user_with_password', {
        p_email: email,
        p_password: password,
        p_role: 'lecturer'
      });

      if (userError) throw userError;

      // Create lecturer profile
      const { error: profileError } = await supabase
        .from('lecturer_profiles')
        .insert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          employee_id: employeeId,
          department,
          phone
        });

      if (profileError) throw profileError;

      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer_profile'] });
    }
  });
};

// Hook to update user email
export const useUpdateUserEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, email }: { userId: string; email: string }) => {
      const { error } = await supabase
        .from('users')
        .update({ email })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    }
  });
};

// Hook to update password
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      const { data, error } = await supabase.rpc('update_user_password', {
        p_user_id: userId,
        p_new_password: newPassword
      });

      if (error) throw error;
      if (!data) throw new Error('Failed to update password');
    }
  });
};

// Hook to update lecturer profile
export const useUpdateLecturerProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      firstName, 
      lastName, 
      employeeId, 
      department, 
      phone 
    }: {
      userId: string;
      firstName: string;
      lastName: string;
      employeeId?: string;
      department?: string;
      phone?: string;
    }) => {
      const { error } = await supabase
        .from('lecturer_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          employee_id: employeeId,
          department,
          phone
        })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lecturer_profile', variables.userId] });
    }
  });
};
