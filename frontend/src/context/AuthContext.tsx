import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import apiClient from '../services/apiClient';

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
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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
  const demoLoginStarted = useRef(false);

  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token, user]);

  const applySession = (session: { token: string; user: User }) => {
    localStorage.setItem('token', session.token);
    localStorage.setItem('user', JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email, password });
      applySession(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/register', { name, email, password });
      applySession(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!import.meta.env.DEV || token || user || demoLoginStarted.current) return;
    demoLoginStarted.current = true;

    const authenticateDemoUser = async () => {
      const demoEmail = 'demo@securechat.local';
      const demoPassword = 'SecureChatDemo123!';
      try {
        await login(demoEmail, demoPassword);
      } catch {
        try {
          await register('SecureChat Demo', demoEmail, demoPassword);
        } catch (error) {
          console.error('Automatic demo login failed:', error);
        }
      }
    };

    void authenticateDemoUser();
  }, [register, login, token, user]);

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
    register,
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
