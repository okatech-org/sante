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
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Panneau Super Admin
            </h1>
            <p className="text-muted-foreground mt-1">Gestion complète du système SANTE.GA</p>
          </div>
        </div>

        {/* Comptes et données démo */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5" />
                Comptes démo
              </CardTitle>
              <CardDescription>
                Créer tous les comptes de démonstration du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateDemoAccounts} 
                disabled={creatingDemoAccounts}
                className="w-full"
              >
                <Users className="mr-2 h-4 w-4" />
                {creatingDemoAccounts ? "Création en cours..." : "Créer les comptes démo"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Données professionnelles
              </CardTitle>
              <CardDescription>
                Générer les données démo pour les professionnels de santé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCreateDemoProfessionalData} 
                disabled={creatingDemoProfessionalData}
                className="w-full"
                variant="secondary"
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                {creatingDemoProfessionalData ? "Création en cours..." : "Générer les données pro"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ajouter un admin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Attribuer un rôle administratif
            </CardTitle>
            <CardDescription>
              Donnez des permissions administratives à un utilisateur existant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de l'utilisateur</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="utilisateur@email.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select value={newAdminRole} onValueChange={(value) => setNewAdminRole(value as AppRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="moderator">Modérateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleAddAdmin} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Attribuer le rôle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tous les utilisateurs ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Chargement...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userProfile) => (
                      <TableRow key={userProfile.id}>
                        <TableCell className="font-medium">{userProfile.full_name}</TableCell>
                        <TableCell>{userProfile.email || '-'}</TableCell>
                        <TableCell>{userProfile.phone}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userProfile.roles.length > 0 ? (
                              userProfile.roles.map(role => (
                                <Badge 
                                  key={role} 
                                  className={roleColors[role] || ""}
                                  variant="secondary"
                                >
                                  {roleLabels[role] || role}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">Aucun rôle</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {userProfile.roles.filter(r => r !== 'super_admin').length > 0 && (
                            <div className="flex justify-end gap-2">
                              {userProfile.roles.filter(r => r !== 'super_admin').map(role => (
                                <Button
                                  key={role}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRole(userProfile.id, role)}
                                  title={`Retirer ${roleLabels[role]}`}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
