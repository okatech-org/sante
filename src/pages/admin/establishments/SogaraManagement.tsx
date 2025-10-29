import { useState, useEffect } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, Users, UserCheck, Shield, Activity, Settings,
  DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Mail, Phone, MapPin, Globe, Calendar, Plus, Edit, Trash2,
  Eye, EyeOff, Key, Lock, UserPlus, UserMinus, ChevronRight,
  Database, Server, Wifi, WifiOff, Power, PowerOff, RefreshCw,
  FileText, Download, Upload, BarChart3, PieChart, LineChart
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SogaraUser {
  id: string;
  email: string;
  password: string; // Mot de passe visible pour l'admin
  full_name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'lab_tech' | 'pharmacist';
  department: string;
  matricule?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export default function SogaraManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<SogaraUser[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SogaraUser | null>(null);
  
  // Nouvelles données utilisateur
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    role: "doctor" as SogaraUser['role'],
    department: "",
    matricule: "",
    password: ""
  });

  // Charger les utilisateurs SOGARA
  useEffect(() => {
    const sogaraUsers: SogaraUser[] = [
      {
        id: "sogara-admin-1",
        email: "admin@sogara.com",
        password: "Admin@SOGARA2024",
        full_name: "Jean-Pierre Mbadinga",
        role: "admin",
        department: "Administration",
        matricule: "ADM-001",
        is_active: true,
        last_login: "2024-01-20 14:30",
        created_at: "2023-01-15"
      },
      {
        id: "sogara-admin-2",
        email: "directeur@sogara.com",
        password: "DirecteurSOGARA2024!",
        full_name: "Dr. François Obiang",
        role: "admin",
        department: "Direction Médicale",
        matricule: "DIR-001",
        is_active: true,
        last_login: "2024-01-20 09:00",
        created_at: "2023-01-10"
      },
      {
        id: "sogara-doc-1",
        email: "dr.okemba@sogara.com",
        password: "Okemba@2024Med",
        full_name: "Dr. Marie Okemba",
        role: "doctor",
        department: "Médecine Générale",
        matricule: "MED-012",
        is_active: true,
        last_login: "2024-01-20 08:15",
        created_at: "2023-03-20"
      },
      {
        id: "sogara-doc-2",
        email: "dr.nguema@sogara.com",
        password: "Nguema@Urgence24",
        full_name: "Dr. Paul Nguema",
        role: "doctor",
        department: "Urgences",
        matricule: "MED-015",
        is_active: true,
        last_login: "2024-01-19 23:45",
        created_at: "2023-02-10"
      },
      {
        id: "sogara-doc-3",
        email: "dr.mbina@sogara.com",
        password: "Mbina@Cardio2024",
        full_name: "Dr. Léa Mbina",
        role: "doctor",
        department: "Cardiologie",
        matricule: "MED-018",
        is_active: true,
        last_login: "2024-01-20 10:30",
        created_at: "2023-06-15"
      },
      {
        id: "sogara-doc-4",
        email: "dr.mezui@sogara.com",
        password: "Mezui@Pediatrie24",
        full_name: "Dr. Thomas Mezui",
        role: "doctor",
        department: "Pédiatrie",
        matricule: "MED-022",
        is_active: true,
        last_login: "2024-01-19 15:20",
        created_at: "2023-07-01"
      },
      {
        id: "sogara-nurse-1",
        email: "nurse.mba@sogara.com",
        password: "MbaSI@2024",
        full_name: "Sylvie Mba",
        role: "nurse",
        department: "Soins Intensifs",
        matricule: "INF-025",
        is_active: true,
        last_login: "2024-01-20 06:00",
        created_at: "2023-04-05"
      },
      {
        id: "sogara-nurse-2",
        email: "nurse.nze@sogara.com",
        password: "NzeUrg@2024",
        full_name: "Patricia Nze",
        role: "nurse",
        department: "Urgences",
        matricule: "INF-028",
        is_active: true,
        last_login: "2024-01-20 07:00",
        created_at: "2023-05-10"
      },
      {
        id: "sogara-nurse-3",
        email: "nurse.andeme@sogara.com",
        password: "Andeme@Mat2024",
        full_name: "Claire Andeme",
        role: "nurse",
        department: "Maternité",
        matricule: "INF-030",
        is_active: true,
        last_login: "2024-01-19 22:00",
        created_at: "2023-06-20"
      },
      {
        id: "sogara-lab-1",
        email: "lab.tech@sogara.com",
        password: "LabSOGARA@2024",
        full_name: "André Moussavou",
        role: "lab_tech",
        department: "Laboratoire",
        matricule: "LAB-008",
        is_active: true,
        last_login: "2024-01-20 07:30",
        created_at: "2023-05-12"
      },
      {
        id: "sogara-pharma-1",
        email: "pharma@sogara.com",
        password: "PharmaSOGARA@24",
        full_name: "Dr. Lydie Kombila",
        role: "pharmacist",
        department: "Pharmacie",
        matricule: "PHAR-004",
        is_active: true,
        last_login: "2024-01-20 08:00",
        created_at: "2023-04-15"
      },
      {
        id: "sogara-recept-1",
        email: "accueil@sogara.com",
        password: "AccueilSOGARA@24",
        full_name: "Nadège Oyono",
        role: "receptionist",
        department: "Accueil",
        matricule: "REC-002",
        is_active: true,
        last_login: "2024-01-20 13:00",
        created_at: "2023-03-01"
      }
    ];
    setUsers(sogaraUsers);
  }, []);

  const handleAddUser = () => {
    if (!newUser.email || !newUser.full_name || !newUser.password) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const user: SogaraUser = {
      id: `sogara-${Date.now()}`,
      email: newUser.email,
      password: newUser.password,
      full_name: newUser.full_name,
      role: newUser.role,
      department: newUser.department,
      matricule: newUser.matricule,
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    toast.success(`Utilisateur ${user.full_name} ajouté avec succès`);
    setShowAddUser(false);
    setNewUser({
      email: "",
      full_name: "",
      role: "doctor",
      department: "",
      matricule: "",
      password: ""
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, is_active: !user.is_active }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`Utilisateur ${user?.full_name} ${user?.is_active ? 'désactivé' : 'activé'}`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast.error("Impossible de supprimer un administrateur");
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    toast.success("Utilisateur supprimé");
  };

  const getRoleBadge = (role: SogaraUser['role']) => {
    const roleConfig = {
      admin: { label: "Administrateur", className: "bg-purple-500/20 text-purple-700 border-purple-500/30" },
      doctor: { label: "Médecin", className: "bg-blue-500/20 text-blue-700 border-blue-500/30" },
      nurse: { label: "Infirmier(e)", className: "bg-green-500/20 text-green-700 border-green-500/30" },
      receptionist: { label: "Réceptionniste", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" },
      lab_tech: { label: "Technicien Labo", className: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30" },
      pharmacist: { label: "Pharmacien", className: "bg-orange-500/20 text-orange-700 border-orange-500/30" }
    };
    const config = roleConfig[role];
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  // Statistiques SOGARA
  const stats = {
    total_employees: 1250,
    active_users: users.filter(u => u.is_active).length,
    total_users: users.length,
    consultations_month: 342,
    urgences_month: 87,
    lab_tests_month: 523,
    revenue_month: "15.2M FCFA",
    cnamgs_claims: 234,
    pending_claims: 12
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/admin/establishments")}
            >
              ← Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                Gestion CMST SOGARA
              </h1>
              <p className="text-muted-foreground">
                Administration Super Admin de l'établissement SOGARA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1.5">
              <Activity className="w-3 h-3 mr-2 text-green-500" />
              Établissement actif
            </Badge>
            <Button 
              variant="outline"
              onClick={() => navigate("/sogara")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir page publique
            </Button>
            <Button 
              onClick={() => navigate("/establishments/sogara/admin")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Accès Admin SOGARA
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="accounts">Comptes & Accès</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="logs">Logs & Audit</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Employés SOGARA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_employees}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +420 ayants droit
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consultations/mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.consultations_month}</div>
                  <Badge className="mt-1 bg-green-500/20 text-green-700 border-green-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Revenus/mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.revenue_month}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    CNAMGS: 8.5M
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Utilisateurs actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.active_users}/{stats.total_users}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Comptes système
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Informations établissement */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'établissement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Adresse</p>
                        <p className="text-sm text-muted-foreground">
                          Route de la Sogara, Port-Gentil
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Téléphones</p>
                        <p className="text-sm text-muted-foreground">
                          011 55 26 21 / 22 / 23
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          service.rgc@sogara.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Services</p>
                        <p className="text-sm text-muted-foreground">
                          Urgences 24/7, Consultations, Maternité, Chirurgie, 
                          Laboratoire, Radiologie, Médecine du travail
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Conventionnement</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                            CNAMGS
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
                            CNSS
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comptes & Identifiants */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Comptes & Identifiants - CMST SOGARA
                </CardTitle>
                <CardDescription>
                  Liste complète des comptes utilisateurs avec identifiants de connexion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">Nom Complet</TableHead>
                        <TableHead className="font-bold">Email (Login)</TableHead>
                        <TableHead className="font-bold">Mot de passe</TableHead>
                        <TableHead className="font-bold">Rôle</TableHead>
                        <TableHead className="font-bold">Département</TableHead>
                        <TableHead className="font-bold">Matricule</TableHead>
                        <TableHead className="font-bold">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <code className="text-sm bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                                {user.email}
                              </code>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4 text-muted-foreground" />
                              <code className="text-sm bg-green-50 dark:bg-green-950 px-2 py-1 rounded font-mono">
                                {user.password}
                              </code>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="text-sm">{user.department}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {user.matricule || "-"}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={user.is_active 
                                ? "bg-green-500/20 text-green-700 border-green-500/30" 
                                : "bg-red-500/20 text-red-700 border-red-500/30"
                              }
                            >
                              {user.is_active ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Statistiques des comptes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl font-bold">
                          {users.filter(u => u.role === 'admin').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Administrateurs</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold">
                          {users.filter(u => u.role === 'doctor').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Médecins</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold">
                          {users.filter(u => u.role === 'nurse').length}
                        </div>
                        <p className="text-xs text-muted-foreground">Infirmiers</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Total comptes</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Informations importantes */}
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-semibold text-yellow-900 dark:text-yellow-400">
                        Informations sensibles - Super Admin uniquement
                      </p>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        Les mots de passe affichés sont des identifiants réels pour la structure CMST SOGARA. 
                        Ces informations doivent rester confidentielles et ne doivent être partagées qu'avec 
                        les personnes autorisées de l'établissement.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                          <Download className="w-4 h-4 mr-2" />
                          Exporter les identifiants
                        </Button>
                        <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-300">
                          <FileText className="w-4 h-4 mr-2" />
                          Générer PDF sécurisé
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Utilisateurs SOGARA</CardTitle>
                    <CardDescription>
                      Gestion des comptes utilisateurs de l'établissement
                    </CardDescription>
                  </div>
                  <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Ajouter un utilisateur
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nouvel utilisateur SOGARA</DialogTitle>
                        <DialogDescription>
                          Créer un compte pour un membre du personnel
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Email *</Label>
                          <Input 
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="utilisateur@sogara.com"
                          />
                        </div>
                        <div>
                          <Label>Nom complet *</Label>
                          <Input 
                            value={newUser.full_name}
                            onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                            placeholder="Dr. Jean Dupont"
                          />
                        </div>
                        <div>
                          <Label>Rôle *</Label>
                          <Select 
                            value={newUser.role} 
                            onValueChange={(value: SogaraUser['role']) => setNewUser({...newUser, role: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrateur</SelectItem>
                              <SelectItem value="doctor">Médecin</SelectItem>
                              <SelectItem value="nurse">Infirmier(e)</SelectItem>
                              <SelectItem value="receptionist">Réceptionniste</SelectItem>
                              <SelectItem value="lab_tech">Technicien Labo</SelectItem>
                              <SelectItem value="pharmacist">Pharmacien</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Département</Label>
                          <Input 
                            value={newUser.department}
                            onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                            placeholder="Médecine Générale"
                          />
                        </div>
                        <div>
                          <Label>Matricule</Label>
                          <Input 
                            value={newUser.matricule}
                            onChange={(e) => setNewUser({...newUser, matricule: e.target.value})}
                            placeholder="MED-001"
                          />
                        </div>
                        <div>
                          <Label>Mot de passe *</Label>
                          <Input 
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddUser(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddUser}>
                          Créer l'utilisateur
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {user.matricule || "-"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={user.is_active 
                              ? "bg-green-500/20 text-green-700 border-green-500/30" 
                              : "bg-red-500/20 text-red-700 border-red-500/30"
                            }
                          >
                            {user.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.last_login || "Jamais"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.role === 'admin'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration système</CardTitle>
                <CardDescription>
                  Paramètres techniques de l'établissement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode maintenance</Label>
                      <p className="text-sm text-muted-foreground">
                        Désactiver temporairement l'accès aux utilisateurs
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API externe</Label>
                      <p className="text-sm text-muted-foreground">
                        Autoriser les connexions API tierces
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications email</Label>
                      <p className="text-sm text-muted-foreground">
                        Envoyer des notifications par email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facturation */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Facturation & Paiements</CardTitle>
                <CardDescription>
                  Gestion financière de l'établissement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Revenus totaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">182.4M FCFA</div>
                      <p className="text-xs text-muted-foreground">Année 2024</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Remboursements CNAMGS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">102M FCFA</div>
                      <p className="text-xs text-muted-foreground">56% du total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">En attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12.5M FCFA</div>
                      <Badge className="mt-1 bg-orange-500/20 text-orange-700 border-orange-500/30">
                        234 dossiers
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs & Audit */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs d'activité</CardTitle>
                <CardDescription>
                  Historique des actions sur l'établissement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Connexion admin", user: "Jean-Pierre Mbadinga", time: "Il y a 2h", type: "info" },
                    { action: "Ajout utilisateur", user: "Super Admin", time: "Il y a 4h", type: "success" },
                    { action: "Modification config", user: "Super Admin", time: "Il y a 1j", type: "warning" },
                    { action: "Export données", user: "Jean-Pierre Mbadinga", time: "Il y a 2j", type: "info" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.type === 'success' ? 'bg-green-500' :
                          log.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayoutSimple>
  );
}
