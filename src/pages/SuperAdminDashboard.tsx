import { useState } from "react";
import { 
  Users, Building2, Hospital, Pill, FlaskConical, 
  Activity, Shield, Settings, Clock, UserPlus, 
  CheckCircle, XCircle, Eye, Edit, Trash2, Search, 
  Download, Bell, BarChart3
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Données mockées pour la démo
const mockStats = {
  totalUsers: 15234,
  activeUsers: 12567,
  pendingApprovals: 43,
  totalHospitals: 88,
  totalPharmacies: 52,
  totalLaboratories: 35,
  totalDoctors: 2159,
  totalPatients: 12890,
};

const mockPendingApprovals = [
  { id: 1, name: "Dr. KOMBILA Pierre", type: "doctor", specialty: "Cardiologie", date: "2025-01-03", status: "pending" },
  { id: 2, name: "Pharmacie Moderne", type: "pharmacy", location: "Libreville", date: "2025-01-02", status: "pending" },
  { id: 3, name: "BIOLAB Plus", type: "laboratory", location: "Port-Gentil", date: "2025-01-01", status: "pending" }
];

const mockRecentUsers = [
  { id: 1, name: "MBOUMBA Jean", role: "patient", email: "jean.m@email.com", status: "active", joinDate: "2025-01-03" },
  { id: 2, name: "Dr. NGOMA Lise", role: "doctor", email: "ngoma.l@medical.ga", status: "active", joinDate: "2025-01-02" },
  { id: 3, name: "Cabinet Montagne Sainte", role: "hospital", email: "contact@montagne.ga", status: "active", joinDate: "2025-01-01" }
];

const mockLogs = [
  { id: 1, action: "Création utilisateur", user: "admin@sante.ga", details: "Nouveau patient: MBOUMBA Jean", time: "2025-01-03 14:32:15" },
  { id: 2, action: "Modification rôle", user: "admin@sante.ga", details: "Dr. NGOMA: patient → doctor", time: "2025-01-03 14:28:03" },
  { id: 3, action: "Approbation établissement", user: "admin@sante.ga", details: "Pharmacie Moderne approuvée", time: "2025-01-03 14:15:42" }
];

export default function SuperAdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/superadmin" replace />;
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Administration SANTE.GA</h1>
            <p className="text-muted-foreground mt-1">Gestion Complète de l'Écosystème</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-background"></span>
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Tableau de Bord
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-2 relative">
              <Clock className="h-4 w-4" />
              Approbations
              {mockStats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{mockStats.pendingApprovals}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="establishments" className="gap-2">
              <Building2 className="h-4 w-4" />
              Établissements
            </TabsTrigger>
            <TabsTrigger value="professionals" className="gap-2">
              <Activity className="h-4 w-4" />
              Professionnels
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <Shield className="h-4 w-4" />
              Logs & Audit
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <DashboardView stats={mockStats} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <UsersView users={mockRecentUsers} />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6 mt-6">
            <ApprovalsView approvals={mockPendingApprovals} />
          </TabsContent>

          <TabsContent value="establishments" className="space-y-6 mt-6">
            <EstablishmentsView stats={mockStats} />
          </TabsContent>

          <TabsContent value="professionals" className="space-y-6 mt-6">
            <ProfessionalsView stats={mockStats} />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6 mt-6">
            <AuditView logs={mockLogs} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <SettingsView />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Dashboard View Component
function DashboardView({ stats }: { stats: typeof mockStats }) {
  const statCards = [
    { label: 'Utilisateurs Total', value: stats.totalUsers.toLocaleString(), change: '+12.5%', icon: Users, variant: 'default' },
    { label: 'Utilisateurs Actifs', value: stats.activeUsers.toLocaleString(), change: '+8.2%', icon: Activity, variant: 'success' },
    { label: 'En Attente', value: stats.pendingApprovals, icon: Clock, variant: 'warning' },
    { label: 'Hôpitaux', value: stats.totalHospitals, change: '+2', icon: Hospital, variant: 'default' },
    { label: 'Pharmacies', value: stats.totalPharmacies, change: '+3', icon: Pill, variant: 'default' },
    { label: 'Laboratoires', value: stats.totalLaboratories, change: '+1', icon: FlaskConical, variant: 'default' },
    { label: 'Médecins Inscrits', value: stats.totalDoctors.toLocaleString(), change: '+15', icon: Activity, variant: 'default' },
    { label: 'Patients Actifs', value: stats.totalPatients.toLocaleString(), change: '+234', icon: Users, variant: 'default' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    {stat.change && (
                      <p className="text-sm text-success mt-2">↑ {stat.change}</p>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <UserPlus className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Créer un Utilisateur</p>
                <p className="text-sm text-muted-foreground">Ajouter un nouveau compte système</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Hospital className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Enregistrer Établissement</p>
                <p className="text-sm text-muted-foreground">Hôpital, clinique ou centre médical</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Download className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Exporter Données</p>
                <p className="text-sm text-muted-foreground">Rapports et statistiques système</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Dr. NGOMA approuvé</p>
                <p className="text-xs text-muted-foreground">Il y a 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <UserPlus className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">15 nouveaux patients inscrits</p>
                <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <Hospital className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Clinique Welcome mise à jour</p>
                <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Users View Component
function UsersView({ users }: { users: typeof mockRecentUsers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const roleLabels: Record<string, string> = {
    patient: 'Patient',
    doctor: 'Médecin',
    hospital: 'Établissement',
    pharmacy: 'Pharmacie',
    laboratory: 'Laboratoire',
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Nouvel Utilisateur
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{roleLabels[user.role]}</Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.joinDate}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Approvals View Component
function ApprovalsView({ approvals }: { approvals: typeof mockPendingApprovals }) {
  const typeInfo: Record<string, { label: string; icon: any }> = {
    doctor: { label: 'Médecin', icon: Activity },
    pharmacy: { label: 'Pharmacie', icon: Pill },
    laboratory: { label: 'Laboratoire', icon: FlaskConical },
    hospital: { label: 'Hôpital', icon: Hospital }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Demandes en Attente</h2>
        <p className="text-muted-foreground mt-1">{approvals.length} demandes nécessitent votre approbation</p>
      </div>

      <div className="grid gap-4">
        {approvals.map((approval) => {
          const type = typeInfo[approval.type];
          const Icon = type.icon;
          
          return (
            <Card key={approval.id} className="card-interactive">
              <CardContent className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{approval.name}</h3>
                        <Badge>{type.label}</Badge>
                      </div>
                      <div className="space-y-1">
                        {approval.specialty && (
                          <p className="text-sm text-muted-foreground">Spécialité : <span className="font-medium text-foreground">{approval.specialty}</span></p>
                        )}
                        {approval.location && (
                          <p className="text-sm text-muted-foreground">Localisation : <span className="font-medium text-foreground">{approval.location}</span></p>
                        )}
                        <p className="text-sm text-muted-foreground">Demande reçue le {approval.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Examiner
                    </Button>
                    <Button size="sm" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approuver
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <XCircle className="w-4 h-4" />
                      Refuser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Establishments View Component
function EstablishmentsView({ stats }: { stats: typeof mockStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hôpitaux & Cliniques
              <Hospital className="w-6 h-6 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{stats.totalHospitals}</p>
            <p className="text-sm text-muted-foreground mb-4">Établissements actifs</p>
            <Button variant="outline" className="w-full">Gérer les Hôpitaux</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pharmacies
              <Pill className="w-6 h-6 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{stats.totalPharmacies}</p>
            <p className="text-sm text-muted-foreground mb-4">Officines enregistrées</p>
            <Button variant="outline" className="w-full">Gérer les Pharmacies</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Laboratoires
              <FlaskConical className="w-6 h-6 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{stats.totalLaboratories}</p>
            <p className="text-sm text-muted-foreground mb-4">Centres d'analyses</p>
            <Button variant="outline" className="w-full">Gérer les Laboratoires</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carte de Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Carte interactive des établissements (à intégrer)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Professionals View Component
function ProfessionalsView({ stats }: { stats: typeof mockStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Médecins Inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">{stats.totalDoctors.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mb-4">Inscrits au CNOM-Gabon</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cardiologie</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gynécologie</span>
                <span className="font-medium">98</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pédiatrie</span>
                <span className="font-medium">76</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personnel Paramédical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">8,450+</p>
            <p className="text-sm text-muted-foreground mb-4">Infirmiers et personnel soignant</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Infirmiers Diplômés</span>
                <span className="font-medium">5,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sages-Femmes</span>
                <span className="font-medium">1,876</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Techniciens Supérieurs</span>
                <span className="font-medium">1,340</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Audit View Component
function AuditView({ logs }: { logs: typeof mockLogs }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs d'Activité Système</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span className="font-medium">{log.action}</span>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{log.details}</p>
              <p className="text-xs text-muted-foreground mt-1">Par: {log.user}</p>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-4">Voir Tous les Logs</Button>
      </CardContent>
    </Card>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Mode Maintenance</p>
              <p className="text-sm text-muted-foreground">Mettre la plateforme en maintenance</p>
            </div>
            <Button variant="outline" size="sm">Activer</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Notifications Email</p>
              <p className="text-sm text-muted-foreground">Activer les notifications automatiques</p>
            </div>
            <Button variant="outline" size="sm">Configurer</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Inscriptions Automatiques</p>
              <p className="text-sm text-muted-foreground">Approuver automatiquement les patients</p>
            </div>
            <Button variant="outline" size="sm">Gérer</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sauvegardes & Sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Créer une Sauvegarde Maintenant</Button>
          <p className="text-sm text-muted-foreground mt-3">Dernière sauvegarde : 2025-01-03 à 02:00</p>
        </CardContent>
      </Card>
    </div>
  );
}
