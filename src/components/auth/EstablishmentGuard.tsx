import { Navigate } from 'react-router-dom';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Loader2 } from 'lucide-react';

interface EstablishmentGuardProps {
  children: React.ReactNode;
}

export function EstablishmentGuard({ children }: EstablishmentGuardProps) {
  const { workContext, loading } = useMultiEstablishment();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement de votre contexte...</p>
        </div>
      </div>
    );
  }

  // Si pas de contexte ou pas d'affiliations, rediriger vers sélection
  if (!workContext || workContext.allAffiliations.length === 0) {
    return <Navigate to="/professional/select-establishment" replace />;
  }

  // Si pas d'établissement sélectionné, rediriger vers sélection
  if (!workContext.currentEstablishment) {
    return <Navigate to="/professional/select-establishment" replace />;
  }

  return <>{children}</>;
}

