
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: 'lecturer' | 'student';
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

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('demo_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'lecturer' | 'student') => {
    try {
      console.log('Demo login:', { email, role });
      
      // Create demo user based on role
      let demoUser: AuthUser;
      
      if (role === 'lecturer') {
        demoUser = {
          id: 'demo-lecturer-' + Date.now(),
          email,
          role: 'lecturer',
          profile: {
            name: 'Demo Lecturer',
            firstName: 'Demo',
            lastName: 'Lecturer',
            department: 'Computer Science',
            phone: '+234 800 123 4567'
          }
        };
      } else {
        demoUser = {
          id: 'demo-student-' + Date.now(),
          email,
          role: 'student',
          profile: {
            name: 'Demo Student',
            firstName: 'Demo',
            lastName: 'Student',
            matricNumber: email.split('@')[0] || 'STU001',
            department: 'Computer Science',
            phone: '+234 800 987 6543',
            level: '200'
          }
        };
      }

      setUser(demoUser);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
    } catch (error) {
      console.error('Demo login error:', error);
      throw new Error('Demo login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem('demo_user', JSON.stringify(updatedUser));
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
