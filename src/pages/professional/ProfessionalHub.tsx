import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { MultiEstablishmentDashboard } from '@/components/layout/MultiEstablishmentDashboard';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';

export default function ProfessionalHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    establishments,
    currentEstablishment,
    currentRole,
    isLoading
  } = useMultiEstablishment();

  useEffect(() => {
    if (!user) {
      navigate('/login/professional');
      return;
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos établissements...</p>
        </div>
      </div>
    );
  }

  if (!establishments || establishments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Aucun établissement trouvé</h2>
          <p className="text-muted-foreground mb-6">
            Vous n'êtes affilié à aucun établissement pour le moment.
            Contactez votre administrateur pour obtenir l'accès.
          </p>
        </div>
      </div>
    );
  }

  // Si un rôle est sélectionné, afficher le layout avec menu
  if (currentEstablishment && currentRole) {
    return (
      <ProfessionalEstablishmentLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-2">
              {currentEstablishment.establishment?.name} - {currentRole}
            </p>
          </div>

          {/* Contenu du dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Statistiques seront ici */}
          </div>
        </div>
      </ProfessionalEstablishmentLayout>
    );
  }

  // Sinon, afficher la page de sélection avec la nouvelle interface
  return <MultiEstablishmentDashboard />;
}

