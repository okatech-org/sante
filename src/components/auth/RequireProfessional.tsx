import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequireProfessionalProps {
  children: ReactNode;
}

const PRO_ROLES = [
  "doctor",
  "medical_staff",
  "pharmacy",
  "laboratory",
  "hospital",
  "establishment_admin",
] as const;

export function RequireProfessional({ children }: RequireProfessionalProps) {
  const { user, isLoading, hasAnyRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login/professional?reason=auth&next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!hasAnyRole(PRO_ROLES as unknown as any)) {
    return <Navigate to={`/login/professional?reason=role&next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

export default RequireProfessional;


