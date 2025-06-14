
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthUser {
  id: string;
  email: string;
  role: 'lecturer' | 'user' | 'super_admin';
  profile?: {
    name?: string;
    matricNumber?: string;
    department?: string;
    phone?: string;
    level?: string;
    firstName?: string;
    lastName?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, expectedRole?: 'lecturer' | 'user' | 'super_admin') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log('Checking for existing session...');
      
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('auth_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, expectedRole?: 'lecturer' | 'user' | 'super_admin') => {
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
      console.log('Login response data:', userData);
      
      // Check if role matches expected role (if provided)
      if (expectedRole && userData.role !== expectedRole) {
        throw new Error(`This login page is for ${expectedRole}s only`);
      }

      // Get additional profile data based on role
      let profile = {};
      
      if (userData.role === 'lecturer' || userData.role === 'super_admin') {
        const { data: lecturerProfile } = await supabase
          .from('lecturer_profiles')
          .select('*')
          .eq('user_id', userData.user_id)
          .single();
          
        if (lecturerProfile) {
          profile = {
            firstName: lecturerProfile.first_name,
            lastName: lecturerProfile.last_name,
            name: `${lecturerProfile.first_name} ${lecturerProfile.last_name}`,
            department: lecturerProfile.department,
            phone: lecturerProfile.phone
          };
        }
      } else if (userData.role === 'user') {
        const { data: studentProfile } = await supabase
          .from('students')
          .select('*')
          .eq('user_id', userData.user_id)
          .single();
          
        if (studentProfile) {
          profile = {
            firstName: studentProfile.first_name,
            lastName: studentProfile.last_name,
            name: `${studentProfile.first_name} ${studentProfile.last_name}`,
            matricNumber: studentProfile.matric_number,
            department: studentProfile.department_id,
            phone: studentProfile.phone,
            level: studentProfile.level
          };
        }
      }

      const authUser: AuthUser = {
        id: userData.user_id,
        email: email,
        role: userData.role as 'lecturer' | 'user' | 'super_admin',
        profile
      };

      setUser(authUser);
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back! Logged in as ${userData.role}.`,
      });
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
    localStorage.removeItem('auth_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
