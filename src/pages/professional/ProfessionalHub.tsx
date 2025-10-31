import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { 
  Users, Calendar, FileText, Activity, 
  TrendingUp, ClipboardList, Stethoscope, Building2 
} from 'lucide-react';
import { ROLE_LABELS } from '@/config/menuDefinitions';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre espace professionnel...</p>
        </div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || 'Professionnel';
  const activeRole = currentRole || 'doctor';

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              {currentEstablishment?.establishment_name || 'CMST SOGARA'}
            </p>
            <Badge variant="default">
              {ROLE_LABELS[activeRole] || activeRole}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Patients aujourd'hui
                </p>
                <h3 className="text-2xl font-bold mt-2">12</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  +2 depuis hier
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rendez-vous
                </p>
                <h3 className="text-2xl font-bold mt-2">8</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  3 confirmés
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Prescriptions
                </p>
                <h3 className="text-2xl font-bold mt-2">24</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Cette semaine
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taux d'occupation
                </p>
                <h3 className="text-2xl font-bold mt-2">87%</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Content based on role */}
        {activeRole === 'director' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activité de la Direction
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Décisions en attente</span>
                  <Badge variant="outline">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rapports à valider</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Réunions programmées</span>
                  <Badge variant="outline">2</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Administration
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Personnel actif</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Budget mensuel</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Inventaire</span>
                  <Badge variant="secondary">OK</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeRole === 'doctor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Mes consultations du jour
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Patient 1</p>
                      <p className="text-sm text-muted-foreground">9h00 - Consultation générale</p>
                    </div>
                    <Badge>En attente</Badge>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Patient 2</p>
                      <p className="text-sm text-muted-foreground">10h30 - Suivi</p>
                    </div>
                    <Badge variant="outline">Confirmé</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Dernières prescriptions
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ordonnances du jour</span>
                  <Badge variant="outline">4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">En attente de validation</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Renouvellements</span>
                  <Badge variant="outline">1</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <Calendar className="h-6 w-6 mb-2 text-primary" />
              <p className="text-sm font-medium">Nouveau RDV</p>
            </button>
            <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <FileText className="h-6 w-6 mb-2 text-primary" />
              <p className="text-sm font-medium">Prescription</p>
            </button>
            <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <Users className="h-6 w-6 mb-2 text-primary" />
              <p className="text-sm font-medium">Patients</p>
            </button>
            <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <Activity className="h-6 w-6 mb-2 text-primary" />
              <p className="text-sm font-medium">Statistiques</p>
            </button>
          </div>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}