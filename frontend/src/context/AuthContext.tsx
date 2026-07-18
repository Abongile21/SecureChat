import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAzureConfigured } from '../config/msalConfig';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token, user]);

  const login = async () => {
    try {
      setIsLoading(true);

      if (!isAzureConfigured) {
        const demoUser: User = {
          id: 'local-demo-user',
          email: 'demo@securechat.local',
          name: 'Demo User',
          role: 'employee',
        };
        const demoToken = 'local-demo-token';

        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        setToken(demoToken);
        setUser(demoUser);
        return;
      }

      const demoUser: User = {
        id: 'azure-demo-user',
        email: 'azure-user@securechat.local',
        name: 'Azure Demo User',
        role: 'employee',
      };
      const demoToken = 'azure-demo-token';

      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      setToken(demoToken);
      setUser(demoUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user || !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
