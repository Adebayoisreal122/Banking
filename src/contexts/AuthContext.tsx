import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '.././services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = () => {
    console.log('👋 Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('🔍 Checking auth on mount:', { hasToken: !!token, hasUser: !!userData });
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('✅ User restored from localStorage:', parsedUser);
          setUser(parsedUser);
          
          // Optionally verify token is still valid
          try {
            await authAPI.getProfile();
            console.log('✅ Token verified as valid');
          } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
              console.log('❌ Token is invalid or expired - clearing auth');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('⚠️ No auth data found in localStorage');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log('🔄 Auth state changed:', { 
      user, 
      isAuthenticated: !!user, 
      loading 
    });
  }, [user, loading]);

  const signup = async (fullName: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting signup for:', email);
      
      const response = await authAPI.signup({
        email: email.toLowerCase().trim(),
        password,
        fullName: fullName.trim(),
        phone: phone?.trim()
      });

      console.log('✅ Signup response:', response);

      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        console.log('✅ User signed up and logged in:', response.user);
        return true;
      }
      
      console.log('⚠️ Signup succeeded but no token received');
      return false;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await authAPI.signin({
        email: email.toLowerCase().trim(),
        password
      });

      console.log('✅ Login response:', response);

      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        console.log('✅ User logged in:', response.user);
        return true;
      }
      
      console.log('⚠️ Login succeeded but no token received');
      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout
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