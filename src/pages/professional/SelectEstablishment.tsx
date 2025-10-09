import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ChevronRight, MapPin, Users, Calendar, 
  Shield, Briefcase, Clock, Star, Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function SelectEstablishment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [userEstablishments, setUserEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    loadUserEstablishments();
  }, [user]);

  const loadUserEstablishments = async () => {
    if (!user?.id) return;

    try {
      // Charger le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // Charger les établissements de l'utilisateur via la fonction
      const { data: establishments, error } = await supabase
        .rpc('get_user_establishments', { _user_id: user.id });

      if (error) {
        console.error('Error loading establishments:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos établissements",
          variant: "destructive"
        });
        return;
      }

      if (establishments && establishments.length > 0) {
        setUserEstablishments(establishments);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const userEstablishmentsDemo = [
    {
      id: '1',
      name: 'CHU Owendo',
      type: 'Hôpital Public',
      city: 'Libreville',
      province: 'Estuaire',
      role: 'Chef Service Médecine',
      isAdmin: true,
      permissions: [
        'consultations',
        'prescriptions',
        'dmp_full',
        'staff_manage',
        'planning',
        'all_medical'
      ],
      schedule: {
        days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        hours: '8h - 16h',
        nextShift: '2025-02-03T08:00:00'
      },
      stats: {
        patients: 234,
        consultations: 45,
        team: 12
      },
      isPrimary: true,
      lastAccess: '2025-02-01T14:30:00'
    },
    {
      id: '2',
      name: 'Clinique Sainte-Marie',
      type: 'Clinique Privée',
      city: 'Libreville',
      province: 'Estuaire',
      role: 'Consultant Externe',
      isAdmin: false,
      permissions: [
        'consultations',
        'prescriptions',
        'dmp_read'
      ],
      schedule: {
        days: ['Mardi', 'Jeudi'],
        hours: '16h - 20h',
        nextShift: '2025-02-04T16:00:00'
      },
      stats: {
        patients: 67,
        consultations: 12,
        team: null
      },
      isPrimary: false,
      lastAccess: '2025-01-30T18:15:00'
    },
    {
      id: '3',
      name: 'Cabinet Médical Glass',
      type: 'Cabinet Privé',
      city: 'Libreville',
      province: 'Estuaire',
      role: 'Propriétaire',
      isAdmin: true,
      permissions: [
        'all'
      ],
      schedule: {
        days: ['Lundi', 'Mercredi', 'Vendredi', 'Samedi'],
        hours: '9h - 18h',
        nextShift: '2025-02-03T09:00:00'
      },
      stats: {
        patients: 156,
        consultations: 28,
        team: 4
      },
      isPrimary: false,
      lastAccess: '2025-01-28T10:45:00'
    }
  ];

  const formatLastAccess = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return 'Aujourd\'hui';
    if (diffHours < 48) return 'Hier';
    return `Il y a ${Math.floor(diffHours / 24)} jours`;
  };

  const handleContinue = () => {
    if (selectedEstablishment) {
      navigate('/dashboard/professional');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.full_name || 'Professionnel';
  const firstName = displayName.split(' ').slice(0, -1).join(' ') || displayName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-xl">
              {displayName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Sélectionnez l'établissement dans lequel vous souhaitez travailler
          </p>
        </div>

        {/* Info Multi-Établissements */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Briefcase className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Activité Multi-Établissements</h3>
                <p className="text-sm opacity-90">
                  Vous intervenez dans <strong>{userEstablishments.length} établissements</strong> différents. 
                  Chaque établissement a ses propres rôles, permissions et plannings. 
                  Vos données professionnelles restent synchronisées partout.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste Établissements */}
        <div className="grid gap-6">
          {userEstablishments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucun établissement</h3>
                <p className="text-muted-foreground mb-4">
                  Vous n'êtes actuellement lié à aucun établissement
                </p>
                <Button variant="outline" onClick={() => navigate('/dashboard/professional')}>
                  Retour au dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            userEstablishments.map((establishment, idx) => {
            const isSelected = selectedEstablishment === establishment.establishment_id;
            const isPrimary = idx === 0; // Premier établissement est principal
            
            return (
              <Card
                key={establishment.establishment_id}
                onClick={() => setSelectedEstablishment(establishment.establishment_id)}
                className={`
                  cursor-pointer transition-all hover:shadow-xl border-2
                  ${isSelected ? 'border-primary ring-4 ring-primary/20' : 'border-border'}
                  ${isPrimary ? 'ring-2 ring-yellow-400' : ''}
                `}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`
                        w-16 h-16 rounded-xl flex items-center justify-center text-primary-foreground shadow-md
                        ${isPrimary 
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                          : 'bg-gradient-to-br from-primary to-purple-600'
                        }
                      `}>
                        <Building2 className="h-8 w-8" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">
                            {establishment.establishment_name}
                          </h3>
                          {isPrimary && (
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30 gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              PRINCIPAL
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {establishment.establishment_name.includes('CHU') ? 'CHU' : establishment.establishment_name.includes('Clinique') ? 'Clinique Privée' : 'Établissement'}
                          </Badge>
                          <span className="text-xs">
                            Statut: {establishment.status}
                          </span>
                        </div>

                        {/* Rôle et Admin */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">
                              {establishment.role_in_establishment}
                            </span>
                          </div>
                          {establishment.is_admin && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-lg border border-destructive/20">
                              <Shield className="h-4 w-4 text-destructive" />
                              <span className="text-sm font-semibold text-destructive">
                                Administrateur
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Permissions */}
                        {establishment.permissions && establishment.permissions.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">
                              Vos permissions:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {establishment.permissions.slice(0, 5).map((perm: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                              {establishment.permissions.length > 5 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{establishment.permissions.length - 5} autres
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Check / Arrow */}
                    <div className="ml-4">
                      {isSelected ? (
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-6 w-6 text-primary-foreground" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                          <ChevronRight className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Pied de carte */}
                {isSelected && (
                  <div className="bg-primary/5 border-t px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-primary font-medium">
                        ✓ Établissement sélectionné
                      </p>
                      <Button onClick={handleContinue}>
                        Continuer
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <Card className="inline-flex">
            <CardContent className="flex items-center gap-2 px-6 py-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Besoin de rejoindre un nouvel établissement ? 
                <Button variant="link" className="ml-2 h-auto p-0 text-primary font-semibold">
                  Faire une demande
                </Button>
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
