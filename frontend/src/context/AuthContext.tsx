import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMsalAuthentication } from '@msal/react';
import { InteractionType } from '@msal/browser';

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
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  const { login: msalLogin, logout: msalLogout } = useMsalAuthentication(
    InteractionType.Popup
  );

  const login = async () => {
    try {
      setIsLoading(true);
      // Azure AD login will be triggered
      await msalLogin();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await msalLogout();
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Restore session if token exists
    if (token) {
      // Fetch user profile
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
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
