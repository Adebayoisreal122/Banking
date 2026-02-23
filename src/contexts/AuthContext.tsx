import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '.././services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  createdAt?: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void; // ← new
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // ── NEW: update user in state + localStorage ──
  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          try {
            await authAPI.getProfile();
          } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      const response = await authAPI.signup({
        email: email.toLowerCase().trim(),
        password,
        fullName: fullName.trim(),
        phone: phone?.trim(),
      });

      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.signin({
        email: email.toLowerCase().trim(),
        password,
      });

      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}