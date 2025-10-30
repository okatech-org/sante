import { NavigateFunction } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export interface AppointmentRedirectOptions {
  user: User | null;
  userRoles: AppRole[];
  navigate: NavigateFunction;
  establishmentId?: string;
  returnUrl?: string;
}

export const handleAppointmentRedirect = ({
  user,
  userRoles,
  navigate,
  establishmentId,
  returnUrl
}: AppointmentRedirectOptions) => {
  const isPatient = userRoles.includes('patient' as AppRole);
  const isAuthenticated = !!user;

  if (isAuthenticated && isPatient) {
    if (establishmentId) {
      navigate(`/appointments/new?provider=${establishmentId}`);
    } else {
      navigate('/appointments');
    }
  } else {
    const redirectPath = returnUrl || (establishmentId 
      ? `/appointments/new?provider=${establishmentId}` 
      : '/appointments');
    
    localStorage.setItem('appointment_redirect', redirectPath);
    if (establishmentId) {
      localStorage.setItem('selected_provider_id', establishmentId);
    }
    
    navigate('/login/patient', { 
      state: { 
        from: redirectPath,
        message: 'Connectez-vous pour prendre rendez-vous' 
      } 
    });
  }
};

