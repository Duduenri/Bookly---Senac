import { supabase } from '@/src/services/supabase';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string | null;
  name?: string | null;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      if (!mounted) return;
      const session = data.session;
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, email: u.email ?? null, name: u.user_metadata?.name ?? null, avatar: u.user_metadata?.avatar ?? null });
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, email: u.email ?? null, name: u.user_metadata?.name ?? null, avatar: u.user_metadata?.avatar ?? null });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error);
      throw error;
    }
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? null, name: data.user.user_metadata?.name ?? null, avatar: data.user.user_metadata?.avatar ?? null });
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    if (error) {
      console.error('Register error:', error);
      throw error;
    }
    // user might be nil until email confirmation depending on Supabase settings
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email ?? null, name: data.user.user_metadata?.name ?? name ?? null, avatar: data.user.user_metadata?.avatar ?? null });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
