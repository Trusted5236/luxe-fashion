import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { signup as signupAPI, getProfile, loginApi} from '@/services/api';
import { json } from 'stream/consumers';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  console.log(user)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      await loadUserProfile();
    } else {
      const storedUser = localStorage.getItem('luxe_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    
    setIsLoading(false);
  };

  initAuth();
}, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
   try {
    await loginApi({email, password})
    await loadUserProfile()
    setIsLoading(false)
    return {success : true}
   } catch (error : any) {
    setIsLoading(false)
    return { success: false, error: error.message };
   }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
       await signupAPI({name, email, password})
       await loadUserProfile()
       setIsLoading(false);
       return {success : true}
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const loadUserProfile = async () =>{
    try {
      const token = await localStorage.getItem('accessToken')

      if(token){
        const profile = await getProfile()
        setUser(profile)
        localStorage.setItem('luxe_user', JSON.stringify(profile))
      }
      
    } catch (error) {
      console.error('Failed to load profile:', error.message);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('luxe_user');
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxe_user');
    localStorage.removeItem("accessToken")
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout,
      isAuthenticated: !!user 
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
