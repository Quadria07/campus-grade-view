
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  role: 'student' | 'lecturer';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (for demo purposes)
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      
      // Use the custom verification function
      const { data, error } = await supabase.rpc('verify_user_password', {
        p_email: email,
        p_password: password
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid email or password');
      }

      const userData = data[0];
      const user: User = {
        id: userData.user_id,
        email: email,
        role: userData.role as 'student' | 'lecturer'
      };

      setUser(user);
      localStorage.setItem('demo_user', JSON.stringify(user));
      
      toast({
        title: "Login Successful",
        description: `Welcome back! Logged in as ${userData.role}.`,
      });

      return user;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const signup = async (email: string, password: string, role: 'student' | 'lecturer', additionalData?: any) => {
    try {
      console.log('Attempting signup with:', email, role);
      
      // Create user account
      const { data: userId, error } = await supabase.rpc('create_user_with_password', {
        p_email: email,
        p_password: password,
        p_role: role
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      // Create profile based on role
      if (role === 'lecturer' && additionalData) {
        const { error: profileError } = await supabase
          .from('lecturer_profiles')
          .insert({
            user_id: userId,
            first_name: additionalData.firstName,
            last_name: additionalData.lastName,
            employee_id: additionalData.employeeId,
            department: additionalData.department,
            phone: additionalData.phone
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      } else if (role === 'student' && additionalData) {
        const { error: profileError } = await supabase
          .from('students')
          .insert({
            user_id: userId,
            first_name: additionalData.firstName,
            last_name: additionalData.lastName,
            matric_number: additionalData.matricNumber,
            email: email,
            level: additionalData.level,
            department_id: additionalData.departmentId,
            phone: additionalData.phone
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }

      toast({
        title: "Account Created",
        description: "Your account has been successfully created. You can now log in.",
      });

      return userId;
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    signup
  };
};
