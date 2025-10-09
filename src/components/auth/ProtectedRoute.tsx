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

  // Check if user is a healthcare establishment (CHU, clinic, hospital)
  const isEstablishment = user.email?.includes('hopital') || 
                          user.email?.includes('chu') || 
                          user.email?.includes('clinique') ||
                          user.email?.includes('.demo@sante.ga');

  // Redirect establishments to their demo dashboard
  if (isEstablishment && window.location.pathname.includes('/dashboard/patient')) {
    return <Navigate to="/demo/hospital" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      // Redirect based on user type
      if (isEstablishment) {
        return <Navigate to="/demo/hospital" replace />;
      }
      return <Navigate to="/dashboard/patient" replace />;
    }
  }

  return <>{children}</>;
};
