import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Shield, UserCog, Users, Pill, FlaskConical, UserCircle, ArrowLeft } from 'lucide-react';
import { ROLE_LABELS } from '@/config/menuDefinitions';

export default function SelectRole() {
  const navigate = useNavigate();
  const { establishmentId } = useParams();
  const { 
    establishments, 
    selectEstablishment,
    isLoading 
  } = useMultiEstablishment();

  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [establishmentName, setEstablishmentName] = useState('');

  useEffect(() => {
    if (!establishmentId) {
      navigate('/professional/select-establishment');
      return;
    }

    // Trouver l'établissement sélectionné
    const establishment = establishments.find(e => e.establishment_id === establishmentId);
    
    if (!establishment) {
      navigate('/professional/select-establishment');
      return;
    }

    setEstablishmentName(establishment.establishment_name);

    // Pour l'instant, on simule plusieurs rôles possibles
    // TODO: Récupérer les vrais rôles depuis la DB via establishment_staff
    // où on peut avoir plusieurs entrées pour le même professional_id et establishment_id
    // mais avec des role_in_establishment différents
    
    // Simulation: un professionnel peut être à la fois admin et doctor
    const roles = [establishment.role_in_establishment];
    
    // Si un seul rôle, sélectionner automatiquement
    if (roles.length === 1) {
      handleSelectRole(roles[0]);
      return;
    }

    setAvailableRoles(roles);
  }, [establishmentId, establishments, navigate]);

  const handleSelectRole = async (role: string) => {
    if (!establishmentId) return;

    // Sélectionner l'établissement avec le rôle
    await selectEstablishment(establishmentId);
    
    // Rediriger vers le dashboard
    navigate('/dashboard/professional');
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'director':
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      case 'nurse':
        return Users;
      case 'pharmacist':
        return Pill;
      case 'laborantin':
        return FlaskConical;
      case 'receptionist':
        return UserCircle;
      default:
        return UserCog;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'director':
        return 'default';
      case 'admin':
        return 'secondary';
      case 'doctor':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Sélectionnez votre rôle
          </h1>
          <p className="text-muted-foreground">
            {establishmentName}
          </p>
          <p className="text-sm text-muted-foreground">
            Vous exercez plusieurs fonctions dans cet établissement
          </p>
        </div>

        {/* Grille de rôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRoles.map((role) => {
            const Icon = getRoleIcon(role);
            
            return (
              <Card 
                key={role}
                className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
                onClick={() => handleSelectRole(role)}
              >
                <div className="space-y-4">
                  {/* Icône */}
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Titre et badge */}
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">
                      {ROLE_LABELS[role] || role}
                    </h3>
                    <Badge variant={getRoleBadgeVariant(role)}>
                      {role.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Bouton */}
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(role);
                    }}
                  >
                    Continuer
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/professional/select-establishment')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux établissements
          </Button>
        </div>
      </div>
    </div>
  );
}
