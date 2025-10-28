import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface OfflineUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    roles?: string[];
  };
}

interface OfflineAuthContextType {
  user: OfflineUser | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  signIn: (email: string, roles?: string[]) => Promise<void>;
  signOut: () => Promise<void>;
}

const OfflineAuthContext = createContext<OfflineAuthContextType | undefined>(undefined);

export function OfflineAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<OfflineUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('offline_auth_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
        return;
      } catch {}
    }

    const defaultUser: OfflineUser = {
      id: 'offline-super-admin',
      email: 'superadmin@sante.ga',
      user_metadata: { full_name: 'Super Admin', roles: ['super_admin'] },
    };
    setUser(defaultUser);
    localStorage.setItem('offline_auth_user', JSON.stringify(defaultUser));
  }, []);

  const roles = user?.user_metadata?.roles || [];
  const hasRole = (role: string) => roles.includes(role);
  const hasAnyRole = (r: string[]) => r.some(role => roles.includes(role));
  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = isSuperAdmin || hasRole('admin');

  const signIn = async (email: string, rolesOverride?: string[]) => {
    const signedIn: OfflineUser = {
      id: `offline-${Date.now()}`,
      email,
      user_metadata: {
        full_name: email.split('@')[0],
        roles: rolesOverride && rolesOverride.length > 0 ? rolesOverride : ['patient'],
      },
    };
    setUser(signedIn);
    localStorage.setItem('offline_auth_user', JSON.stringify(signedIn));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('offline_auth_user');
  };

  return (
    <OfflineAuthContext.Provider
      value={{ user, isSuperAdmin, isAdmin, hasRole, hasAnyRole, signIn, signOut }}
    >
      {children}
    </OfflineAuthContext.Provider>
  );
}

export function useOfflineAuth() {
  const context = useContext(OfflineAuthContext);
  if (!context) {
    throw new Error('useOfflineAuth must be used within an OfflineAuthProvider');
  }
  return context;
}


