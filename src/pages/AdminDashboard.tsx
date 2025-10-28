import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isSuperAdmin, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || (!isSuperAdmin && !isAdmin))) {
      navigate("/login/admin");
    }
  }, [user, isSuperAdmin, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!user || (!isSuperAdmin && !isAdmin)) {
    return null;
  }

  return (
    <SuperAdminLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* En-tête */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {isSuperAdmin ? "Administration Super Admin" : "Panneau d'Administration"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gérez les utilisateurs, les rôles et la sécurité de la plateforme
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">En attente d'implémentation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rôles Actifs</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Types de rôles disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes Sécurité</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Aucune alerte active</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        {isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Actions Super Admin</CardTitle>
              <CardDescription>
                Gérez les administrateurs et les rôles du système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-5 w-5" />
                  Gérer les utilisateurs
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="mr-2 h-5 w-5" />
                  Attribuer des rôles
                </Button>
                <Button variant="outline" className="justify-start">
                  <Lock className="mr-2 h-5 w-5" />
                  Gérer la sécurité
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Modération
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                ℹ️ Les fonctionnalités d'administration seront implémentées dans les prochaines étapes
              </p>
            </CardContent>
          </Card>
        )}

        {/* Informations de rôle */}
        <Card>
          <CardHeader>
            <CardTitle>Votre Profil Administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rôle:</strong> {isSuperAdmin ? "Super Administrateur" : "Administrateur"}</p>
              <p className="text-sm text-muted-foreground mt-4">
                {isSuperAdmin 
                  ? "Vous avez accès à toutes les fonctionnalités d'administration de la plateforme." 
                  : "Vous pouvez gérer certaines fonctionnalités selon vos permissions."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
