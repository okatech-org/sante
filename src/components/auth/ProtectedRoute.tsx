import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database['public']['Enums']['app_role'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user, userRoles, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login/patient" replace />;
  }

  // Déterminer si l'utilisateur est un établissement (basé sur les rôles)
  const establishmentRoles: AppRole[] = [
    'establishment_admin',
    'hospital',
    'pharmacy',
    'laboratory',
  ];
  const isEstablishment = userRoles.some((role) => establishmentRoles.includes(role as AppRole));

  const getEstablishmentDemoPath = (): string => {
    if (userRoles.includes('establishment_admin')) return '/demo/hospital';
    if (userRoles.includes('pharmacy')) return '/demo/pharmacy';
    if (userRoles.includes('laboratory')) return '/demo/radiology-center';
    return '/demo/hospital';
  };

  // Redirect establishments to their demo dashboard
  if (isEstablishment && window.location.pathname.includes('/dashboard/patient')) {
    return <Navigate to={getEstablishmentDemoPath()} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      // Redirect based on user type
      if (isEstablishment) {
        return <Navigate to={getEstablishmentDemoPath()} replace />;
      }
      return <Navigate to="/dashboard/patient" replace />;
    }
  }

  return <>{children}</>;
};
