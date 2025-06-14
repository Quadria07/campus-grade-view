
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
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
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'lecturer' | 'student') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'lecturer' | 'student') => {
    try {
      // Mock authentication - in real app, this would be Supabase auth
      console.log('Attempting login:', { email, role });
      
      // For demo purposes, create mock user
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        profile: {
          name: role === 'lecturer' ? 'Dr. John Smith' : 'Jane Doe',
          matricNumber: role === 'student' ? 'STU001' : undefined,
          department: 'Computer Science',
          phone: '+234 800 123 4567'
        }
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
