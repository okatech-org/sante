import { useEffect, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Trash2, Users, Database as DatabaseIcon, Stethoscope } from "lucide-react";
import { toast } from "sonner";

type AppRole = Database['public']['Enums']['app_role'];

interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  roles: AppRole[];
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrateur",
  moderator: "Modérateur",
  patient: "Patient",
  doctor: "Médecin",
  medical_staff: "Corps médical",
  pharmacy: "Pharmacie",
  laboratory: "Laboratoire",
  hospital: "Hôpital",
};

const roleColors: Record<string, string> = {
  super_admin: "bg-destructive text-destructive-foreground",
  admin: "bg-warning text-warning-foreground",
  moderator: "bg-accent text-accent-foreground",
  patient: "bg-secondary text-secondary-foreground",
  doctor: "bg-primary text-primary-foreground",
  medical_staff: "bg-success text-success-foreground",
  pharmacy: "bg-primary/80 text-primary-foreground",
  laboratory: "bg-secondary/80 text-secondary-foreground",
  hospital: "bg-accent/80 text-accent-foreground",
};

export default function AdminPanel() {
  const { user, hasRole } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AppRole>("admin");
  const [creatingDemoAccounts, setCreatingDemoAccounts] = useState(false);
  const [creatingDemoProfessionalData, setCreatingDemoProfessionalData] = useState(false);

  const isSuperAdmin = hasRole("super_admin");

  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Charger tous les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone');

      if (profilesError) throw profilesError;

      // Charger tous les rôles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combiner les données
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: roles?.filter(r => r.user_id === profile.id).map(r => r.role) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminRole) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      // Trouver l'utilisateur par email
      const targetUser = users.find(u => u.email === newAdminEmail);
      
      if (!targetUser) {
        toast.error("Utilisateur introuvable");
        return;
      }

      // Ajouter le rôle
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: targetUser.id,
          role: newAdminRole,
          created_by: user?.id
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("Cet utilisateur a déjà ce rôle");
        } else {
          throw error;
        }
        return;
      }

      toast.success(`Rôle ${roleLabels[newAdminRole]} attribué avec succès`);
      setNewAdminEmail("");
      setNewAdminRole("admin");
      loadUsers();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast.error("Erreur lors de l'ajout du rôle");
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    if (role === 'super_admin') {
      toast.error("Impossible de supprimer le rôle Super Admin");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast.success("Rôle supprimé avec succès");
      loadUsers();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error("Erreur lors de la suppression du rôle");
    }
  };

  const handleCreateDemoAccounts = async () => {
    setCreatingDemoAccounts(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-accounts', {
        body: {}
      });

      if (error) throw error;

      toast.success("Comptes démo créés avec succès!", {
        description: `${data.results.length} comptes traités`
      });
      
      loadUsers();
    } catch (error: any) {
      console.error('Error creating demo accounts:', error);
      toast.error("Erreur lors de la création des comptes démo");
    } finally {
      setCreatingDemoAccounts(false);
    }
  };

  const handleCreateDemoProfessionalData = async () => {
    setCreatingDemoProfessionalData(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-professional-data', {
        body: {}
      });

      if (error) throw error;

      toast.success("Données professionnelles démo créées!", {
        description: "Conventions, vérifications, téléconsultations et prescriptions ajoutées"
      });
    } catch (error: any) {
      console.error('Error creating demo professional data:', error);
      toast.error("Erreur lors de la création des données professionnelles");
    } finally {
      setCreatingDemoProfessionalData(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <SuperAdminLayout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-6 w-6" />
                Accès refusé
              </CardTitle>
              <CardDescription>
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Panneau Super Admin
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestion complète du système SANTE.GA
            </p>
          </div>
        </div>

        {/* Demo Accounts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <div className="p-1.5 bg-blue-500/10 rounded-lg">
                  <DatabaseIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Comptes démo
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Créer tous les comptes de démonstration du système
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={handleCreateDemoAccounts} 
                disabled={creatingDemoAccounts}
                className="w-full hover-scale"
                size="lg"
              >
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">
                  {creatingDemoAccounts ? "Création en cours..." : "Créer les comptes démo"}
                </span>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <div className="p-1.5 bg-green-500/10 rounded-lg">
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                Données professionnelles
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Générer les données démo pour les professionnels de santé
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={handleCreateDemoProfessionalData} 
                disabled={creatingDemoProfessionalData}
                className="w-full hover-scale"
                variant="secondary"
                size="lg"
              >
                <Stethoscope className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">
                  {creatingDemoProfessionalData ? "Création en cours..." : "Générer les données pro"}
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add Admin Role Section */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="p-1.5 bg-purple-500/10 rounded-lg">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              Attribuer un rôle administratif
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Donnez des permissions administratives à un utilisateur existant
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email de l'utilisateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="utilisateur@email.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs sm:text-sm">Rôle</Label>
                <Select value={newAdminRole} onValueChange={(value) => setNewAdminRole(value as AppRole)}>
                  <SelectTrigger id="role" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <Button onClick={handleAddAdmin} className="w-full hover-scale" size="lg">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="text-sm sm:text-base">Attribuer le rôle</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List Section */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <div className="p-1.5 bg-orange-500/10 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
                Tous les utilisateurs
              </CardTitle>
              <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                {users.length} utilisateur{users.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0 sm:px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Chargement des utilisateurs...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Nom</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">Email</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap hidden lg:table-cell">Téléphone</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm whitespace-nowrap">Rôles</TableHead>
                        <TableHead className="font-semibold text-xs sm:text-sm text-right whitespace-nowrap">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userProfile, index) => (
                        <TableRow 
                          key={userProfile.id} 
                          className="hover:bg-muted/30 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="flex flex-col">
                              <span className="font-semibold">{userProfile.full_name}</span>
                              <span className="text-xs text-muted-foreground md:hidden">
                                {userProfile.email || userProfile.phone}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            {userProfile.email || '-'}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {userProfile.phone}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {userProfile.roles.length > 0 ? (
                                userProfile.roles.map(role => (
                                  <Badge 
                                    key={role} 
                                    className={`${roleColors[role] || ""} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5`}
                                    variant="secondary"
                                  >
                                    {roleLabels[role] || role}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">Aucun rôle</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {userProfile.roles.filter(r => r !== 'super_admin').length > 0 && (
                              <div className="flex justify-end gap-1 sm:gap-2">
                                {userProfile.roles.filter(r => r !== 'super_admin').map(role => (
                                  <Button
                                    key={role}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveRole(userProfile.id, role)}
                                    title={`Retirer ${roleLabels[role]}`}
                                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:scale-110 transition-all"
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                                  </Button>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
