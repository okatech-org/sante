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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserPlus, Trash2, Users, Search, Filter, Download, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

type AppRole = Database['public']['Enums']['app_role'];

interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  birth_date: string | null;
  gender: string | null;
  province: string | null;
  city: string | null;
  created_at: string;
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

export default function AdminUsers() {
  const { user, hasRole } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AppRole>("admin");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [userToRemove, setUserToRemove] = useState<{ userId: string; role: AppRole } | null>(null);

  const isSuperAdmin = hasRole("super_admin");
  const isAdmin = hasRole("admin") || isSuperAdmin;

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, birth_date, gender, province, city, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

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

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.full_name.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone.includes(term)
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter(u => u.roles.includes(filterRole as AppRole));
    }

    setFilteredUsers(filtered);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminRole) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const targetUser = users.find(u => u.email === newAdminEmail);
      
      if (!targetUser) {
        toast.error("Utilisateur introuvable");
        return;
      }

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

  const handleRemoveRole = async () => {
    if (!userToRemove) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userToRemove.userId)
        .eq('role', userToRemove.role);

      if (error) throw error;

      toast.success("Rôle supprimé avec succès");
      setUserToRemove(null);
      loadUsers();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error("Erreur lors de la suppression du rôle");
    }
  };

  const exportUsers = () => {
    const csv = [
      ['Nom', 'Email', 'Téléphone', 'Province', 'Ville', 'Rôles', 'Date inscription'].join(','),
      ...filteredUsers.map(u => [
        u.full_name,
        u.email || '',
        u.phone,
        u.province || '',
        u.city || '',
        u.roles.map(r => roleLabels[r]).join(' | '),
        new Date(u.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs-sante-ga-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Export réussi");
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.roles.some(r => ['super_admin', 'admin', 'moderator'].includes(r))).length,
    patients: users.filter(u => u.roles.includes('patient')).length,
    professionals: users.filter(u => u.roles.some(r => ['doctor', 'medical_staff', 'pharmacy', 'laboratory', 'hospital'].includes(r))).length,
  };

  if (!isAdmin) {
    return (
      <SuperAdminLayout>
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-6 w-6" />
                {t('admin.accessDenied')}
              </CardTitle>
              <CardDescription>
                {t('admin.noPermission')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4 py-2 sm:py-4">
        {/* Header */}
        <Card className="border-2">
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{t('admin.users')}</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t('admin.usersSubtitle')}</p>
                </div>
              </div>
              <Button onClick={exportUsers} variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9">
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {t('common.export')} CSV
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs">{t('admin.totalUsers')}</CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs">{t('admin.administrators')}</CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.admins}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs">{t('admin.patients')}</CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.patients}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="p-2 sm:p-3 pb-1.5 sm:pb-2">
              <CardDescription className="text-[10px] sm:text-xs">{t('admin.professionals')}</CardDescription>
              <CardTitle className="text-lg sm:text-2xl lg:text-3xl">{stats.professionals}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b">
              <TabsList className="w-full grid grid-cols-2 h-auto bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  {t('admin.allUsers')}
                </TabsTrigger>
                <TabsTrigger 
                  value="manage" 
                  className="text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  {t('admin.manageRoles')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab All Users */}
            <TabsContent value="all" className="space-y-3 sm:space-y-4 mt-0 p-2 sm:p-3">
              {/* Filters */}
              <Card className="border shadow-sm">
                <CardContent className="p-3 sm:p-4 pt-4 sm:pt-6">
                  <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="search" className="text-xs sm:text-sm flex items-center">
                        <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                        Rechercher
                      </Label>
                      <Input
                        id="search"
                        placeholder="Nom, email ou téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                  
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="filter" className="text-xs sm:text-sm flex items-center">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                        Filtrer par rôle
                      </Label>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger id="filter" className="h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="all">Tous les rôles</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="moderator">Modérateur</SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="doctor">Médecin</SelectItem>
                          <SelectItem value="medical_staff">Corps médical</SelectItem>
                          <SelectItem value="pharmacy">Pharmacie</SelectItem>
                          <SelectItem value="laboratory">Laboratoire</SelectItem>
                          <SelectItem value="hospital">Hôpital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterRole("all");
                        }}
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Table */}
              <Card className="border shadow-sm">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    Résultats ({filteredUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12 sm:py-16">
                      <div className="text-sm sm:text-base text-muted-foreground">Chargement...</div>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3" />
                      <p className="text-sm sm:text-base text-muted-foreground">Aucun utilisateur trouvé</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Nom</TableHead>
                            <TableHead className="text-xs sm:text-sm">Contact</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden md:table-cell">Localisation</TableHead>
                            <TableHead className="text-xs sm:text-sm">Rôles</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Inscrit le</TableHead>
                            <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((userProfile) => (
                            <TableRow key={userProfile.id}>
                              <TableCell className="font-medium">
                                <div className="min-w-[120px]">
                                  <div className="text-sm sm:text-base">{userProfile.full_name}</div>
                                  {userProfile.gender && (
                                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                                      {userProfile.gender === 'M' ? 'Homme' : 'Femme'}
                                      {userProfile.birth_date && ` • ${new Date().getFullYear() - new Date(userProfile.birth_date).getFullYear()} ans`}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 min-w-[150px]">
                                  {userProfile.email && (
                                    <div className="flex items-center gap-1 text-[11px] sm:text-sm">
                                      <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                                      <span className="truncate">{userProfile.email}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-[11px] sm:text-sm">
                                    <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                                    {userProfile.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {userProfile.city && userProfile.province ? (
                                  <div className="text-xs sm:text-sm min-w-[100px]">
                                    <div>{userProfile.city}</div>
                                    <div className="text-[10px] sm:text-xs text-muted-foreground">{userProfile.province}</div>
                                  </div>
                                ) : (
                                  <span className="text-xs sm:text-sm text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 min-w-[100px]">
                                  {userProfile.roles.length > 0 ? (
                                    userProfile.roles.map(role => (
                                      <Badge 
                                        key={role} 
                                        className={`text-[10px] sm:text-xs ${roleColors[role] || ""}`}
                                        variant="secondary"
                                      >
                                        {roleLabels[role] || role}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-xs sm:text-sm text-muted-foreground">Aucun rôle</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                                {new Date(userProfile.created_at).toLocaleDateString('fr-FR')}
                              </TableCell>
                              <TableCell className="text-right">
                                {isSuperAdmin && userProfile.roles.filter(r => r !== 'super_admin').length > 0 && (
                                  <div className="flex justify-end gap-2">
                                    {userProfile.roles.filter(r => r !== 'super_admin').map(role => (
                                      <Button
                                        key={role}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setUserToRemove({ userId: userProfile.id, role })}
                                        title={`Retirer ${roleLabels[role]}`}
                                        className="h-8 w-8 p-0"
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Manage Roles */}
            <TabsContent value="manage" className="mt-0 p-3 sm:p-4">
              <Card className="border shadow-sm">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                    Attribuer un rôle administratif
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Donnez des permissions administratives à un utilisateur existant
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm">Email de l'utilisateur</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="utilisateur@email.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="h-9 sm:h-10 text-xs sm:text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="role" className="text-xs sm:text-sm">Rôle</Label>
                      <Select value={newAdminRole} onValueChange={(value) => setNewAdminRole(value as AppRole)}>
                        <SelectTrigger id="role" className="h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {isSuperAdmin && <SelectItem value="admin">Administrateur</SelectItem>}
                          <SelectItem value="moderator">Modérateur</SelectItem>
                          <SelectItem value="doctor">Médecin</SelectItem>
                          <SelectItem value="medical_staff">Corps médical</SelectItem>
                          <SelectItem value="pharmacy">Pharmacie</SelectItem>
                          <SelectItem value="laboratory">Laboratoire</SelectItem>
                          <SelectItem value="hospital">Hôpital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button onClick={handleAddAdmin} className="w-full h-9 sm:h-10 text-xs sm:text-sm">
                        <UserPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Attribuer le rôle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!userToRemove} onOpenChange={() => setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression du rôle</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer le rôle {userToRemove && roleLabels[userToRemove.role]} à cet utilisateur ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveRole} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer le rôle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SuperAdminLayout>
  );
}
