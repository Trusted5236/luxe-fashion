import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { signup as signupAPI, getProfile, loginApi, googleAuth} from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: ()=> void,
  checkAuth: () => Promise<void>,
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log('===== INIT AUTH START =====');
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('luxe_user');
      
      console.log('Token exists:', !!token);
      console.log('Token value:', token?.substring(0, 20) + '...');
      console.log('Stored user exists:', !!storedUser);
      console.log('Stored user value:', storedUser);
      
      if (token) {
        await loadUserProfile();
      } else if (storedUser) {
        console.log('Loading user from localStorage...');
        try {
          const parsed = JSON.parse(storedUser);
          console.log('Parsed user:', parsed);
          setUser(parsed);
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      } else {
        console.log('No token or stored user found');
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      console.log('Calling loginApi...');
      const loginResponse = await loginApi({email, password});
      await loadUserProfile();
      window.dispatchEvent(new Event('auth-change'));
      
      console.log('Login successful');
      setIsLoading(false);
      return {success : true}
    } catch (error : any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const signupResponse = await signupAPI({name, email, password});
      console.log('Signup response:', signupResponse);
      
      console.log('Loading user profile...');
      await loadUserProfile();
      window.dispatchEvent(new Event('auth-change'));
      
      console.log('Signup successful');
      setIsLoading(false);
      return {success : true}
    } catch (error: any) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const  loginWithGoogle = ()=>{
    console.log('Initiating Google OAuth...');
    googleAuth();
  }

  

  const loadUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Loading profile with token:', !!token);

    if (token) {
      const profile = await getProfile();
      console.log('👤 Profile received:', profile);

      if (profile) {
        setUser(profile);
        localStorage.setItem('luxe_user', JSON.stringify(profile));
        console.log('✅ User successfully set');
      } else {
        throw new Error('Profile is null');
      }
    }
  } catch (error: any) {
    console.error('❌ Profile load error:', error.message);
    // Only clear if it's an auth error, not a network error
    if (error.message.includes('401') || error.message.includes('token')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('luxe_user');
      setUser(null);
    }
  }
};

  const logout = () => {
    console.log('===== LOGOUT =====');
    setUser(null);
    localStorage.removeItem('luxe_user');
    localStorage.removeItem("accessToken");
  };

  const checkAuth = async () => {
    console.log('Checking auth...');
    await loadUserProfile();
  };

  // Log whenever user changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}