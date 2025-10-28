import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const OfflineAuthContext = createContext<AuthContextType | undefined>(undefined);

export function OfflineAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un utilisateur connecté pour le mode hors-ligne
    const mockUser: User = {
      id: '00339d76-81ca-4e18-aadd-25492917efc5',
      email: 'dr.professionnel@sante.ga',
      user_metadata: {
        full_name: 'Dr. Pierre KOMBILA'
      }
    };

    // Simuler un délai de chargement
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mode hors-ligne - simulation de connexion
    const mockUser: User = {
      id: '00339d76-81ca-4e18-aadd-25492917efc5',
      email: email,
      user_metadata: {
        full_name: 'Dr. Pierre KOMBILA'
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('offline_user', JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('offline_user');
  };

  const isAuthenticated = !!user;

  return (
    <OfflineAuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAuthenticated
    }}>
      {children}
    </OfflineAuthContext.Provider>
  );
}

export function useOfflineAuth() {
  const context = useContext(OfflineAuthContext);
  if (context === undefined) {
    throw new Error('useOfflineAuth must be used within an OfflineAuthProvider');
  }
  return context;
}
