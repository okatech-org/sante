import { Navigate } from 'react-router-dom';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Loader2 } from 'lucide-react';

interface EstablishmentGuardProps {
  children: React.ReactNode;
}

export function EstablishmentGuard({ children }: EstablishmentGuardProps) {
  const { workContext, loading, isLoading, establishments } = useMultiEstablishment();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement de votre contexte...</p>
        </div>
      </div>
    );
  }

  // Si pas d'établissements, rediriger vers sélection
  if (!workContext || establishments.length === 0) {
    return <Navigate to="/professional/select-establishment" replace />;
  }

  return <>{children}</>;
}

