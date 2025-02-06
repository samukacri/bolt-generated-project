import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email?: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Verificar sessão atual ao carregar o componente
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || undefined,
          full_name: data.session.user.user_metadata?.full_name
        });
      }
    };

    checkSession();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || undefined,
          full_name: session.user.user_metadata?.full_name
        });
      } else {
        setUser(null);
      }
    });

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
