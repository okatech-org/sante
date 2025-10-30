import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Users, 
  Briefcase,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function SelectEstablishment() {
  const navigate = useNavigate();
  const { 
    establishments, 
    currentEstablishment,
    selectEstablishment, 
    isLoading 
  } = useMultiEstablishment();

  // Si un seul établissement, redirection automatique
  useEffect(() => {
    if (!isLoading && establishments.length === 1) {
      navigate('/professional/dashboard');
    }
  }, [establishments, isLoading, navigate]);

  const handleSelect = async (staffRoleId: string) => {
    await selectEstablishment(staffRoleId);
    navigate('/professional/dashboard');
  };

  // Fonction pour obtenir la couleur du badge selon le rôle
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'director': return 'default';
      case 'admin': return 'secondary';
      case 'doctor': return 'outline';
      case 'nurse': return 'outline';
      default: return 'outline';
    }
  };

  // Fonction pour obtenir le label du rôle en français
  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'director': 'Directeur',
      'admin': 'Administrateur',
      'doctor': 'Médecin',
      'nurse': 'Infirmier(e)',
      'pharmacist': 'Pharmacien(ne)',
      'laborantin': 'Laborantin(e)',
      'receptionist': 'Réceptionniste'
    };
    return roleLabels[role] || role;
  };

  // Fonction pour obtenir l'icône selon le type d'établissement
  const getEstablishmentIcon = (type: string) => {
    switch (type) {
      case 'hospital': return Building2;
      case 'clinic': return Building2;
      case 'cmst': return Briefcase;
      case 'pharmacy': return Building2;
      case 'laboratory': return Building2;
      default: return Building2;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de vos établissements...</p>
        </div>
      </div>
    );
  }

  if (establishments.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Aucun établissement</h2>
          <p className="text-muted-foreground mb-6">
            Vous n'êtes affilié à aucun établissement actuellement.
          </p>
          <Button onClick={() => navigate('/professional/settings')}>
            Mettre à jour mon profil
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sélection d'établissement
          </h1>
          <p className="text-muted-foreground">
            Choisissez l'établissement dans lequel vous souhaitez travailler
          </p>
        </div>

        {/* Grille d'établissements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {establishments.map((staffRole) => {
            const Icon = getEstablishmentIcon(staffRole.establishment.type);
            const isCurrentlySelected = currentEstablishment?.id === staffRole.id;
            
            return (
              <Card 
                key={staffRole.id}
                className={`
                  relative overflow-hidden transition-all duration-300 hover:shadow-xl
                  ${isCurrentlySelected ? 'ring-2 ring-primary' : ''}
                  hover:scale-[1.02] cursor-pointer
                `}
                onClick={() => handleSelect(staffRole.id)}
              >
                {/* Badge de sélection actuelle */}
                {isCurrentlySelected && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs">
                      Actuel
                    </Badge>
                  </div>
                )}

                {/* Header avec logo/icône */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      {staffRole.establishment.logoUrl ? (
                        <img 
                          src={staffRole.establishment.logoUrl} 
                          alt={staffRole.establishment.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Icon className="h-7 w-7 text-primary" />
                      )}
                    </div>
                    
                    {/* Badge Admin */}
                    {staffRole.isEstablishmentAdmin && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>

                  {/* Nom de l'établissement */}
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {staffRole.establishment.name}
                  </h3>

                  {/* Type d'établissement */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {staffRole.establishment.subType || staffRole.establishment.type}
                  </p>

                  {/* Rôle et département */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRoleBadgeVariant(staffRole.role)}>
                        {getRoleLabel(staffRole.role)}
                      </Badge>
                      {staffRole.position && (
                        <Badge variant="outline" className="text-xs">
                          {staffRole.position}
                        </Badge>
                      )}
                    </div>

                    {staffRole.department && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{staffRole.department.name}</span>
                      </div>
                    )}

                    {staffRole.matricule && (
                      <div className="text-xs text-muted-foreground font-mono">
                        Mat: {staffRole.matricule}
                      </div>
                    )}
                  </div>

                  {/* Localisation */}
                  {staffRole.establishment.city && (
                    <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{staffRole.establishment.city}</span>
                    </div>
                  )}
                </div>

                {/* Footer avec action */}
                <div className="px-6 py-3 bg-muted/30 border-t border-border">
                  <Button 
                    className="w-full group"
                    variant={isCurrentlySelected ? "secondary" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(staffRole.id);
                    }}
                  >
                    <span>{isCurrentlySelected ? 'Établissement actuel' : 'Sélectionner'}</span>
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Indicateur de chef de département */}
                {staffRole.isDepartmentHead && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Actions en bas de page */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/professional/dashboard')}
            className="mr-4"
          >
            Annuler
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/professional/settings')}
          >
            Gérer mes affiliations
          </Button>
        </div>
      </div>
    </div>
  );
}