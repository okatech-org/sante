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
import { toast } from 'sonner';

export default function SelectEstablishment() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [userEstablishments, setUserEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserEstablishments();
  }, [authUser]);

  const loadUserEstablishments = async () => {
    if (!authUser?.id) return;

    try {
      // Charger le profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUserName(profile.full_name);
      }

      // Charger le profil professionnel
      const { data: professionalProfile } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .single();

      if (!professionalProfile) {
        toast.error('Profil professionnel non trouvé');
        navigate('/dashboard/professional');
        return;
      }

      // Charger les établissements
      const { data: staffData, error } = await supabase
        .from('establishment_staff')
        .select(`
          *,
          establishments (
            id,
            raison_sociale,
            type_etablissement,
            ville,
            province,
            secteur
          )
        `)
        .eq('professional_id', professionalProfile.id)
        .eq('status', 'active')
        .order('is_admin', { ascending: false });

      if (error) throw error;

      const formattedEstablishments = staffData?.map((staff: any, index: number) => ({
        id: staff.establishment_id,
        name: staff.establishments.raison_sociale,
        type: getEstablishmentTypeLabel(staff.establishments.type_etablissement),
        city: staff.establishments.ville,
        province: staff.establishments.province,
        role: staff.role_in_establishment,
        isAdmin: staff.is_admin,
        permissions: staff.permissions || [],
        schedule: staff.schedule || { days: [], hours: '' },
        stats: {
          patients: 0,
          consultations: 0,
          team: staff.is_admin ? 5 : null
        },
        isPrimary: index === 0,
        lastAccess: staff.updated_at
      })) || [];

      setUserEstablishments(formattedEstablishments);
    } catch (error) {
      console.error('Erreur lors du chargement des établissements:', error);
      toast.error('Erreur lors du chargement des établissements');
    } finally {
      setLoading(false);
    }
  };

  const getEstablishmentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'chu': 'CHU',
      'chr': 'CHR',
      'clinique': 'Clinique Privée',
      'centre_medical': 'Centre Médical',
      'polyclinique': 'Polyclinique',
      'hopital_departemental': 'Hôpital Départemental',
      'hopital_confessionnel': 'Hôpital Confessionnel'
    };
    return labels[type] || type;
  };

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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (userEstablishments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Aucun établissement</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'êtes actuellement lié à aucun établissement de santé.
            </p>
            <Button onClick={() => navigate('/dashboard/professional')}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = userName || authUser?.email || 'Professionnel';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-xl">
              {initials}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Bonjour, {displayName.split(' ')[0]} 👋
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
          {userEstablishments.map((establishment) => {
            const isSelected = selectedEstablishment === establishment.id;
            
            return (
              <Card
                key={establishment.id}
                onClick={() => setSelectedEstablishment(establishment.id)}
                className={`
                  cursor-pointer transition-all hover:shadow-xl border-2
                  ${isSelected ? 'border-primary ring-4 ring-primary/20' : 'border-border'}
                  ${establishment.isPrimary ? 'ring-2 ring-yellow-400' : ''}
                `}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`
                        w-16 h-16 rounded-xl flex items-center justify-center text-primary-foreground shadow-md
                        ${establishment.isPrimary 
                          ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                          : 'bg-gradient-to-br from-primary to-purple-600'
                        }
                      `}>
                        <Building2 className="h-8 w-8" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">
                            {establishment.name}
                          </h3>
                          {establishment.isPrimary && (
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30 gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              PRINCIPAL
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {establishment.city}, {establishment.province}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {establishment.type}
                          </Badge>
                          <span className="text-xs">
                            Dernière connexion: {formatLastAccess(establishment.lastAccess)}
                          </span>
                        </div>

                        {/* Rôle et Admin */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">
                              {establishment.role}
                            </span>
                          </div>
                          {establishment.isAdmin && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-lg border border-destructive/20">
                              <Shield className="h-4 w-4 text-destructive" />
                              <span className="text-sm font-semibold text-destructive">
                                Administrateur
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Planning */}
                        {establishment.schedule.days?.length > 0 && (
                          <div className="bg-muted rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-semibold">
                                Planning
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {establishment.schedule.days.map((day: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-background">
                                  {day}
                                </Badge>
                              ))}
                            </div>
                            {establishment.schedule.hours && (
                              <p className="text-sm text-muted-foreground">
                                <Clock className="inline h-3 w-3 mr-1" />
                                {establishment.schedule.hours}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Statistiques */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-primary/5 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {establishment.stats.patients}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">Patients</div>
                          </div>
                          <div className="text-center p-3 bg-green-500/10 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">
                              {establishment.stats.consultations}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">Consultations</div>
                          </div>
                          {establishment.stats.team && (
                            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                              <div className="text-2xl font-bold text-purple-700">
                                {establishment.stats.team}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Équipe</div>
                            </div>
                          )}
                        </div>

                        {/* Permissions */}
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
          })}
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