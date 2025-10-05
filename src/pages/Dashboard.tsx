import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userRoles, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Rediriger selon le rôle de l'utilisateur
      if (userRoles.includes('super_admin') || userRoles.includes('admin')) {
        navigate('/dashboard/admin', { replace: true });
      } else if (userRoles.some(role => ['doctor', 'hospital', 'pharmacy', 'laboratory', 'medical_staff'].includes(role))) {
        navigate('/dashboard/professional', { replace: true });
      } else {
        // Par défaut, rediriger vers le dashboard patient
        navigate('/dashboard/patient', { replace: true });
      }
    }
  }, [userRoles, isLoading, navigate]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}
