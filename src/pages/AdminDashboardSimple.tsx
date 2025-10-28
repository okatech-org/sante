import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardSimple() {
  const navigate = useNavigate();

  return (
    <SuperAdminLayoutSimple>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* En-tête */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              Administration SANTE.GA
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gérez les utilisateurs, les rôles et la sécurité de la plateforme
          </p>
        </div>

        {/* Mode démonstration */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Mode Démonstration</CardTitle>
            <CardDescription className="text-blue-700">
              Vous êtes connecté en mode hors-ligne avec les privilèges d'administration.
              Toutes les fonctionnalités sont simulées pour la démonstration.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professionnels</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">
                +12.5% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Établissements</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +5.2% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                -2 par rapport à hier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Gestion des Utilisateurs</span>
              </CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/users")}>
                Accéder
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Approbations</span>
              </CardTitle>
              <CardDescription>
                Validez les demandes d'inscription des professionnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/approvals")}>
                Accéder
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Lock className="h-5 w-5 text-red-600" />
                <span>Sécurité</span>
              </CardTitle>
              <CardDescription>
                Surveillez les activités et la sécurité de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Accéder
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informations de debug */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Debug - Mode Offline</CardTitle>
            <CardDescription className="text-yellow-700">
              Cette page fonctionne en mode hors-ligne sans vérification de rôles.
              Si vous voyez cette page, le bouton Admin fonctionne correctement.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SuperAdminLayoutSimple>
  );
}
