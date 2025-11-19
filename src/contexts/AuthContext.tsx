import { supabase } from '@/src/services/supabase';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string | null;
  name?: string | null;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        if (!mounted) return;
        const session = data.session;
        if (session?.user) {
          const u = session.user;
          // Buscar nome da tabela profiles
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, avatar')
              .eq('userId', u.id)
              .single();
            
            const userName = profile?.name ?? u.user_metadata?.name ?? null;
            
            setUser({ 
              id: u.id, 
              email: u.email ?? null, 
              name: userName, 
              avatar: profile?.avatar ?? u.user_metadata?.avatar ?? null 
            });
          } catch {
            // Em caso de erro, usar user_metadata
            setUser({ 
              id: u.id, 
              email: u.email ?? null, 
              name: u.user_metadata?.name ?? null, 
              avatar: u.user_metadata?.avatar ?? null 
            });
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const u = session.user;
        // Buscar nome da tabela profiles
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, avatar')
            .eq('userId', u.id)
            .single();
          
          const userName = profile?.name ?? u.user_metadata?.name ?? null;
          
          setUser({ 
            id: u.id, 
            email: u.email ?? null, 
            name: userName, 
            avatar: profile?.avatar ?? u.user_metadata?.avatar ?? null 
          });
        } catch {
          // Em caso de erro, usar user_metadata
          setUser({ 
            id: u.id, 
            email: u.email ?? null, 
            name: u.user_metadata?.name ?? null, 
            avatar: u.user_metadata?.avatar ?? null 
          });
        }
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
      // Buscar nome da tabela profiles
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, avatar')
          .eq('userId', data.user.id)
          .single();
        
        const userName = profile?.name ?? data.user.user_metadata?.name ?? null;
        
        setUser({ 
          id: data.user.id, 
          email: data.user.email ?? null, 
          name: userName, 
          avatar: profile?.avatar ?? data.user.user_metadata?.avatar ?? null 
        });
      } catch {
        setUser({ 
          id: data.user.id, 
          email: data.user.email ?? null, 
          name: data.user.user_metadata?.name ?? null, 
          avatar: data.user.user_metadata?.avatar ?? null 
        });
      }
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
    isLoading,
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
