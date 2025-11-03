// ============================================
// COMPOSANT: PharmacyDashboard - Dashboard Pharmacien
// Date: 3 novembre 2025
// ============================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Package, 
  FileText, 
  DollarSign,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings
} from 'lucide-react';
import { usePharmacy } from '@/hooks/usePharmacy';
import { usePharmacyDashboardStats } from '@/hooks/usePharmacyStats';
import { usePharmacyEmployees } from '@/hooks/usePharmacyProfessionals';
import { useMyPharmacyProfile } from '@/hooks/usePharmacyProfessionals';
import { Link } from 'react-router-dom';
import { canManageEmployees, canAccessReports } from '@/lib/pharmacy-permissions';

interface PharmacyDashboardProps {
  pharmacyId: string;
  userId: string;
}

export function PharmacyDashboard({ pharmacyId, userId }: PharmacyDashboardProps) {
  const { data: pharmacy, isLoading: pharmacyLoading } = usePharmacy(pharmacyId);
  const { data: stats, isLoading: statsLoading } = usePharmacyDashboardStats(pharmacyId);
  const { data: employees } = usePharmacyEmployees(pharmacyId);
  const { data: profile } = useMyPharmacyProfile(userId);

  if (pharmacyLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pharmacy || !stats || !profile) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Erreur de chargement des données</AlertDescription>
      </Alert>
    );
  }

  const canManageTeam = canManageEmployees(profile.permissions);
  const canViewReports = canAccessReports(profile.permissions);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{pharmacy.nom_commercial}</h1>
            <Badge variant={pharmacy.statut_verification === 'verifie' ? 'default' : 'secondary'}>
              {pharmacy.statut_verification}
            </Badge>
            {pharmacy.ouvert_24_7 && <Badge variant="outline">24/7</Badge>}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {pharmacy.quartier}, {pharmacy.ville}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {pharmacy.telephone_principal}
            </span>
            {pharmacy.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {pharmacy.email}
              </span>
            )}
          </div>
        </div>
        <Link to={`/pharmacy/${pharmacyId}/settings`}>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </Link>
      </div>

      {/* Vue d'ensemble - Stats du jour */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.commandes}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.dispensations}</div>
            <p className="text-xs text-muted-foreground">Ordonnances traitées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stocks Bas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.stocks_bas}</div>
            <p className="text-xs text-muted-foreground">Articles à réapprovisionner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA du Jour</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.today.ca_jour_fcfa.toLocaleString()} F
            </div>
            <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertes */}
      {stats.alerts.total > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Alertes ({stats.alerts.total})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.alerts.items.map((alert, index) => (
              <Alert 
                key={index} 
                variant={alert.severity === 'critical' ? 'destructive' : 'default'}
              >
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs Contenu Principal */}
      <Tabs defaultValue="ordonnances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ordonnances">
            <FileText className="h-4 w-4 mr-2" />
            Ordonnances ({stats.ordonnances_en_attente.total})
          </TabsTrigger>
          {canManageTeam && (
            <TabsTrigger value="equipe">
              <Users className="h-4 w-4 mr-2" />
              Équipe ({employees?.length || 0})
            </TabsTrigger>
          )}
          {canViewReports && (
            <TabsTrigger value="performance">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab Ordonnances */}
        <TabsContent value="ordonnances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ordonnances en Attente</CardTitle>
              <CardDescription>
                {stats.ordonnances_en_attente.total} ordonnance(s) à traiter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.ordonnances_en_attente.total === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune ordonnance en attente
                </p>
              ) : (
                <div className="space-y-3">
                  {/* TODO: Mapper les vraies ordonnances */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">[ORD-2025-001234] • Mme ONDO Marie</p>
                      <p className="text-sm text-muted-foreground">
                        3 médicaments • Reçue il y a 15 min
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Voir</Button>
                      <Button size="sm">Préparer</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link to={`/pharmacy/${pharmacyId}/orders`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">
                    <Package className="h-5 w-5 inline mr-2" />
                    Gérer Stocks
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            <Link to={`/pharmacy/${pharmacyId}/billing`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">
                    <DollarSign className="h-5 w-5 inline mr-2" />
                    Facturation
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>

            {canViewReports && (
              <Link to={`/pharmacy/${pharmacyId}/reports`}>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">
                      <TrendingUp className="h-5 w-5 inline mr-2" />
                      Rapports
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            )}
          </div>
        </TabsContent>

        {/* Tab Équipe */}
        {canManageTeam && (
          <TabsContent value="equipe" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Équipe de la Pharmacie</CardTitle>
                  <CardDescription>
                    {employees?.length || 0} membre(s)
                  </CardDescription>
                </div>
                <Link to={`/pharmacy/${pharmacyId}/team/invite`}>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Inviter
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees?.map((employee) => (
                    <div 
                      key={employee.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {employee.nom_complet?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{employee.nom_complet}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {employee.type_professionnel === 'dr_pharmacie' 
                                ? 'Pharmacien' 
                                : 'Vendeur'}
                            </span>
                            {employee.est_pharmacien_titulaire && (
                              <Badge variant="outline" className="text-xs">Titulaire</Badge>
                            )}
                            {!employee.compte_actif && (
                              <Badge variant="destructive" className="text-xs">Inactif</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link to={`/pharmacy/${pharmacyId}/team/${employee.id}`}>
                        <Button variant="ghost" size="sm">Détails</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab Performance */}
        {canViewReports && (
          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">
                      {stats.performance.note_moyenne.toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / 5.0
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.performance.nombre_avis} avis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.performance.taux_disponibilite.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Produits en stock
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Délai Moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {pharmacy.delai_preparation_moyen_minutes} min
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Temps de préparation
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default PharmacyDashboard;

