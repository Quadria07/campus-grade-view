
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  useAuthenticateUser, 
  useUser, 
  useLecturerProfile,
  User,
  LecturerProfile 
} from '@/hooks/useAuth';

interface AuthUser {
  id: string;
  email: string;
  role: 'lecturer' | 'student';
  profile?: {
    name?: string;
    matricNumber?: string;
    department?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role: 'lecturer' | 'student') => Promise<void>;
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
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);

  const authenticateUserMutation = useAuthenticateUser();
  const { data: userData } = useUser(authenticatedUserId || undefined);
  const { data: lecturerProfile } = useLecturerProfile(authenticatedUserId || undefined);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAuthenticatedUserId(parsedUser.id);
    }
    setLoading(false);
  }, []);

  // Update user data when database data changes
  useEffect(() => {
    if (userData && authenticatedUserId) {
      let profileData: any = {};
      
      if (userData.role === 'lecturer' && lecturerProfile) {
        profileData = {
          name: `${lecturerProfile.first_name} ${lecturerProfile.last_name}`,
          department: lecturerProfile.department,
          phone: lecturerProfile.phone
        };
      }

      const updatedUser: AuthUser = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        profile: profileData
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [userData, lecturerProfile, authenticatedUserId]);

  const login = async (email: string, password: string, role: 'lecturer' | 'student') => {
    try {
      console.log('Attempting login:', { email, role });
      
      const result = await authenticateUserMutation.mutateAsync({ email, password });
      
      if (result.role !== role) {
        throw new Error(`Invalid credentials for ${role} account`);
      }

      setAuthenticatedUserId(result.user_id);
      
      // Create initial user object - will be updated by useEffect when data loads
      const initialUser: AuthUser = {
        id: result.user_id,
        email,
        role: result.role,
        profile: {}
      };

      setUser(initialUser);
      localStorage.setItem('user', JSON.stringify(initialUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
    setAuthenticatedUserId(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
