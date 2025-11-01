import { useState, useEffect } from 'react';
import { MinistryDashboard, MinistryUserRole, MinistryUser } from '@/types/ministry';

interface MinistryAuth {
  user: MinistryUser | null;
  isAuthenticated: boolean;
  role: MinistryUserRole | null;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useMinistryAuth = (): MinistryAuth => {
  const [user, setUser] = useState<MinistryUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ministry_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUsers: MinistryUser[] = [
      {
        id: 'mu-001',
        nom_complet: 'Dr. Jean-Marie NZAMBA',
        email: 'ministre@sante.gouv.ga',
        role: MinistryUserRole.SUPER_ADMIN,
        direction: 'Cabinet',
        telephone: '+241 06 47 74 83',
        photo_url: null,
        dernier_acces: new Date().toISOString(),
        status: 'actif'
      },
      {
        id: 'mu-002',
        nom_complet: 'Dr. Nadine OBIANG',
        email: 'sg@sante.gouv.ga',
        role: MinistryUserRole.ADMIN_NATIONAL,
        direction: 'Secrétariat Général',
        telephone: '+241 06 12 34 56',
        photo_url: null,
        dernier_acces: new Date().toISOString(),
        status: 'actif'
      },
      {
        id: 'mu-003',
        nom_complet: 'Dr. Patrick ESSONO',
        email: 'dgs@sante.gouv.ga',
        role: MinistryUserRole.ADMIN_DIRECTION,
        direction: 'DGS',
        telephone: '+241 06 23 45 67',
        photo_url: null,
        dernier_acces: new Date().toISOString(),
        status: 'actif'
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email && password === 'admin2025');
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ministry_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ministry_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    if (user.role === MinistryUserRole.SUPER_ADMIN) return true;
    
    const permissions: Record<MinistryUserRole, string[]> = {
      [MinistryUserRole.SUPER_ADMIN]: ['*'],
      [MinistryUserRole.ADMIN_NATIONAL]: ['view_all', 'manage_programs', 'manage_authorizations', 'view_reports'],
      [MinistryUserRole.ADMIN_DIRECTION]: ['view_direction', 'manage_direction_programs', 'view_reports'],
      [MinistryUserRole.ADMIN_PROVINCIAL]: ['view_province', 'manage_province_alerts', 'view_province_stats'],
      [MinistryUserRole.VIEWER_PUBLIC]: ['view_public']
    };
    
    return permissions[user.role]?.includes(permission) || permissions[user.role]?.includes('*') || false;
  };

  return {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    hasPermission,
    login,
    logout
  };
};

export const useMinistryDashboard = () => {
  const [dashboard, setDashboard] = useState<MinistryDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    isLoading,
    error,
    refetch: fetchDashboard
  };
};

