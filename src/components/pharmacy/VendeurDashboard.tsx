// ============================================
// COMPOSANT: VendeurDashboard - Dashboard Vendeur
// Date: 3 novembre 2025
// Permissions limitées pour vendeurs pharmacie
// ============================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Package, 
  DollarSign,
  Info,
  User,
  Clock
} from 'lucide-react';
import { usePharmacy } from '@/hooks/usePharmacy';
import { useMyPharmacyProfile } from '@/hooks/usePharmacyProfessionals';
import { Link } from 'react-router-dom';

interface VendeurDashboardProps {
  pharmacyId: string;
  userId: string;
}

export function VendeurDashboard({ pharmacyId, userId }: VendeurDashboardProps) {
  const { data: pharmacy, isLoading: pharmacyLoading } = usePharmacy(pharmacyId);
  const { data: profile, isLoading: profileLoading } = useMyPharmacyProfile(userId);

  if (pharmacyLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!pharmacy || !profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Erreur de chargement des données</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{pharmacy.nom_commercial}</h1>
          <Badge variant="outline">Vendeur</Badge>
        </div>
        <p className="text-muted-foreground">
          Bonjour {profile.prenom} {profile.nom}
        </p>
      </div>

      {/* Info Supervision */}
      {profile.supervise_par && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Supervision:</strong> Les ordonnances critiques doivent être validées par{' '}
            {profile.supervise_par.nom_complet}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Personnelles */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Dispensations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.nombre_dispensations}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.note_moyenne.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {profile.nombre_evaluations} évaluations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière Connexion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {profile.derniere_connexion 
                ? new Date(profile.derniere_connexion).toLocaleDateString('fr-FR')
                : 'Jamais'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commandes à Préparer */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes à Préparer</CardTitle>
          <CardDescription>
            Ordonnances en attente de dispensation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* TODO: Mapper les vraies commandes assignées au vendeur */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">[ORD-2025-001234] • Mme ONDO Marie</p>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>• Amlodipine 5mg × 30 cp</p>
                  <p>• Hydrochlorothiazide 12.5mg × 30 cp</p>
                </div>
                <Badge variant="outline" className="mt-2 text-xs">
                  ✅ Stock disponible
                </Badge>
              </div>
              <Button size="sm">
                Commencer Préparation
              </Button>
            </div>

            {/* Message si vide */}
            {false && (
              <p className="text-center text-muted-foreground py-8">
                Aucune commande en attente
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions Rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link to={`/pharmacy/${pharmacyId}/pos`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">
                    <DollarSign className="h-5 w-5 inline mr-2" />
                    Vente Libre
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Point de vente
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to={`/pharmacy/${pharmacyId}/stock`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">
                    <Package className="h-5 w-5 inline mr-2" />
                    Consulter Stock
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Lecture seule
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to={`/pharmacy/${pharmacyId}/orders`}>
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-base">
                    <FileText className="h-5 w-5 inline mr-2" />
                    Mes Ordonnances
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Historique
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Informations Supervision */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-base">ℹ️ Permissions Limitées</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>En tant que vendeur, vous pouvez :</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Dispenser les ordonnances validées</li>
            <li>Effectuer des ventes libres</li>
            <li>Consulter le stock (lecture seule)</li>
            <li>Gérer la caisse</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Les opérations sensibles (validation ordonnances, gestion stock, administration) 
            nécessitent l'intervention d'un pharmacien diplômé.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default VendeurDashboard;

