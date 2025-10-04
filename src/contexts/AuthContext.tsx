import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRoles: AppRole[];
  isLoading: boolean;
  loading: boolean;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetching with setTimeout
        if (session?.user) {
          setTimeout(async () => {
            try {
              const roles = await authService.getUserRoles(session.user.id);
              setUserRoles(roles);
            } catch (error) {
              console.error('Error fetching user roles:', error);
              setUserRoles([]);
            }
          }, 0);
        } else {
          setUserRoles([]);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const roles = await authService.getUserRoles(session.user.id);
            setUserRoles(roles);
          } catch (error) {
            console.error('Error fetching user roles:', error);
            setUserRoles([]);
          }
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRole = (role: AppRole) => userRoles.includes(role);
  const hasAnyRole = (roles: AppRole[]) => roles.some(role => userRoles.includes(role));

  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = hasRole('admin') || isSuperAdmin;

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setUserRoles([]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userRoles, 
      isLoading,
      loading: isLoading,
      hasRole, 
      hasAnyRole,
      isSuperAdmin,
      isAdmin,
      signUp,
      signIn,
      signOut 
    }}>
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
