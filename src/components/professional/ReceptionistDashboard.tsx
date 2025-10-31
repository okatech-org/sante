import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, Calendar, Phone, Clock,
  Mail, MapPin, CheckCircle, AlertCircle, Edit,
  Building2, Briefcase, ArrowUpRight, Plus,
  Siren, Activity, ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function ReceptionistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentEstablishment } = useMultiEstablishment();
  const [professionalData, setProfessionalData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfessionalData();
    }
  }, [user]);

  const loadProfessionalData = async () => {
    if (!user) return;

    const { data: profData } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profData) {
      setProfessionalData(profData);
    }
  };

  const fullName = user?.user_metadata?.full_name || professionalData?.full_name || 'Réceptionniste';
  
  const profile = {
    email: user?.email || professionalData?.email || '',
    phone: professionalData?.phone || '+241 07 XX XX XX',
    numeroOrdre: professionalData?.license_number || 'REC-002',
    verified: professionalData?.is_verified || true,
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header avec profil réceptionniste */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 via-background to-cyan-50 dark:from-cyan-900/20 dark:via-slate-900 dark:to-cyan-900/20">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-cyan-500 text-white">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{fullName}</h1>
                  {profile.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    Réception et Accueil
                  </Badge>
                  <Badge variant="secondary">
                    Matricule: {profile.numeroOrdre}
                  </Badge>
                  <Badge variant="default" className="bg-cyan-500">
                    Réceptionniste
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                  {currentEstablishment && (
                    <>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {currentEstablishment.establishment_name}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {currentEstablishment.department || 'Administration'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier profil
            </Button>
          </div>
        </div>
      </Card>

      {/* Actions rapides pour naviguer vers les deux modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Accueil Hôpital */}
        <Card 
          className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => navigate('/professional/accueil-hdj')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50" />
          <div className="relative p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Accueil Hôpital du Jour</h3>
            <p className="text-muted-foreground mb-6">
              Gestion des rendez-vous programmés et vérification des droits CNAMGS
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fonctionnalités</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Enregistrement RDV
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Vérification CNAMGS
                  </li>
                  <li className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Files d'attente
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground">Actions rapides</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    Calcul reste à charge
                  </li>
                  <li className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    Dossiers HDJ
                  </li>
                  <li className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    Impression fiches
                  </li>
                </ul>
              </div>
            </div>
            
            <Button className="w-full mt-6">
              Accéder à l'Accueil HDJ
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Card Accueil Urgences */}
        <Card 
          className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          onClick={() => navigate('/professional/accueil-urgences')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50" />
          <div className="relative p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Siren className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Accueil Service d'Urgences</h3>
            <p className="text-muted-foreground mb-6">
              Triage rapide et gestion des urgences médicales avec niveaux de gravité
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fonctionnalités</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    Triage 5 niveaux
                  </li>
                  <li className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    Urgence vitale
                  </li>
                  <li className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    Constantes vitales
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground">Dashboard</p>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-orange-500" />
                    Kanban 6 colonnes
                  </li>
                  <li className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-orange-500" />
                    Alertes délais
                  </li>
                  <li className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-orange-500" />
                    Tri par gravité
                  </li>
                </ul>
              </div>
            </div>
            
            <Button variant="destructive" className="w-full mt-6">
              Accéder aux Urgences
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Instructions rapides */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Guide Rapide - Réceptionniste</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Mode HDJ</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Pour les patients avec rendez-vous programmés. Vérification CNAMGS, calcul reste à charge, génération dossiers HDJ.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Siren className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold">Mode Urgences</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Pour les urgences médicales. Triage rapide selon gravité, constantes vitales, suivi temps réel.
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-300">Rappel important</p>
                <p className="text-amber-700 dark:text-amber-400 mt-1">
                  En cas d'urgence vitale (niveau 1), utilisez immédiatement le bouton URGENCE VITALE dans le mode Urgences pour alerter l'équipe médicale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}