'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  sub: string;
  given_name?: string;
  family_name?: string;
  birth_date?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const initialContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>(initialContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to check authentication status', err);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = () => {
    // Redirect to France Connect authentication
    window.location.href = '/api/auth/login';
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Failed to logout', err);
      setError('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);