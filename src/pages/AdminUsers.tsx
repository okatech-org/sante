import { useState, useEffect } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/integrations/supabase/client"; // Commenté pour le mode hors-ligne
import { toast } from "sonner";
import { Users, Search, UserPlus, Download, Shield, User, Trash2, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  roles: string[];
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  patient: 'Patient',
  doctor: 'Médecin',
  hospital: 'Hôpital',
  pharmacy: 'Pharmacie',
  laboratory: 'Laboratoire',
  establishment_admin: 'Admin Établissement'
};

const roleColors: Record<string, string> = {
  super_admin: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-400/30',
  admin: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-400/30',
  patient: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-400/30',
  doctor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-400/30',
  hospital: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-400/30',
  pharmacy: 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-400/30',
  laboratory: 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-400/30',
  establishment_admin: 'bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-400/30'
};

export default function AdminUsers() {
  const { isSuperAdmin } = useOfflineAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [newRoleEmail, setNewRoleEmail] = useState("");
  const [newRoleType, setNewRoleType] = useState("");
  const [userToRemoveRole, setUserToRemoveRole] = useState<{ userId: string; role: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Données simulées pour le mode hors-ligne
      const mockUsers: UserProfile[] = [
        {
          id: 'user-1',
          full_name: 'Dr. Jean Nguema',
          email: 'jean.nguema@example.com',
          phone: '+241 01 23 45 67',
          created_at: '2024-01-15T10:30:00Z',
          roles: ['doctor', 'professional']
        },
        {
          id: 'user-2',
          full_name: 'Marie Okou',
          email: 'marie.okou@example.com',
          phone: '+241 01 23 45 68',
          created_at: '2024-01-20T14:15:00Z',
          roles: ['patient']
        },
        {
          id: 'user-3',
          full_name: 'Dr. Paul Mba',
          email: 'paul.mba@example.com',
          phone: '+241 01 23 45 69',
          created_at: '2024-01-25T09:45:00Z',
          roles: ['hospital', 'professional']
        },
        {
          id: 'user-4',
          full_name: 'Pharmacie Libreville',
          email: 'pharmacie.libreville@example.com',
          phone: '+241 01 23 45 70',
          created_at: '2024-02-01T16:20:00Z',
          roles: ['pharmacy', 'professional']
        },
        {
          id: 'user-5',
          full_name: 'Laboratoire Gabon',
          email: 'lab.gabon@example.com',
          phone: '+241 01 23 45 71',
          created_at: '2024-02-05T11:30:00Z',
          roles: ['laboratory', 'professional']
        }
      ];

      setUsers(mockUsers);
      toast.success("Utilisateurs chargés (mode démonstration)");
    } catch (error: any) {
      toast.error("Erreur lors du chargement des utilisateurs");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }

    setFilteredUsers(filtered);
  };

  const handleAddRole = async () => {
    if (!newRoleEmail || !newRoleType) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const user = users.find(u => u.email.toLowerCase() === newRoleEmail.toLowerCase());
      if (!user) {
        toast.error("Utilisateur non trouvé");
        return;
      }

      setUsers(prev => prev.map(u => {
        if (u.id !== user.id) return u;
        const updatedRoles = Array.from(new Set([...(u.roles || []), newRoleType]));
        return { ...u, roles: updatedRoles };
      }));

      toast.success("Rôle ajouté (mode démonstration)");
      setNewRoleEmail("");
      setNewRoleType("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout du rôle (offline)");
    }
  };

  const handleRemoveRole = async () => {
    if (!userToRemoveRole) return;

    try {
      const { userId, role } = userToRemoveRole;
      setUsers(prev => prev.map(u => {
        if (u.id !== userId) return u;
        return { ...u, roles: (u.roles || []).filter(r => r !== role) };
      }));

      toast.success("Rôle supprimé (mode démonstration)");
      setUserToRemoveRole(null);
    } catch (error: any) {
      toast.error("Erreur lors de la suppression du rôle (offline)");
    }
  };

  const exportUsers = () => {
    const csv = [
      ['Nom', 'Email', 'Téléphone', 'Rôles', 'Date création'],
      ...filteredUsers.map(u => [
        u.full_name,
        u.email,
        u.phone,
        u.roles.join(', '),
        new Date(u.created_at).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isSuperAdmin) {
    return (
      <SuperAdminLayoutSimple>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
              <p className="text-muted-foreground">Seuls les super admins peuvent accéder à cette page.</p>
            </CardContent>
          </Card>
        </div>
      </SuperAdminLayoutSimple>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.roles.includes('admin') || u.roles.includes('super_admin')).length,
    patients: users.filter(u => u.roles.includes('patient')).length,
    professionals: users.filter(u => u.roles.some(r => ['doctor', 'hospital', 'pharmacy', 'laboratory'].includes(r))).length
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gestion des Utilisateurs
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les utilisateurs et leurs rôles
            </p>
          </div>
          <Button onClick={exportUsers} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Admins', value: stats.admins, icon: Shield, color: 'from-purple-500 to-pink-500' },
            { label: 'Patients', value: stats.patients, icon: User, color: 'from-green-500 to-emerald-500' },
            { label: 'Professionnels', value: stats.professionals, icon: Users, color: 'from-orange-500 to-amber-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/70 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Role */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Attribuer un rôle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Email de l'utilisateur"
                value={newRoleEmail}
                onChange={(e) => setNewRoleEmail(e.target.value)}
                type="email"
              />
              <Select value={newRoleType} onValueChange={setNewRoleType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddRole} className="gap-2">
                <UserPlus className="w-4 h-4" />
                Ajouter le rôle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Liste des utilisateurs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : (
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôles</TableHead>
                      <TableHead>Date création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {user.email}
                        </TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className={`${roleColors[role] || ''} text-xs`}
                              >
                                {roleLabels[role] || role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.roles.length > 0 && (
                            <div className="flex justify-end gap-2">
                              {user.roles.map((role) => (
                                <Button
                                  key={role}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setUserToRemoveRole({ userId: user.id, role })}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
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

        {/* Remove Role Dialog */}
        <AlertDialog open={!!userToRemoveRole} onOpenChange={() => setUserToRemoveRole(null)}>
          <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveRole} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SuperAdminLayoutSimple>
  );
}
