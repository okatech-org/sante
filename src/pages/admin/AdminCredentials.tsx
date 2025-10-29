import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Key, Lock, Mail, Users, Shield, UserCheck, 
  Building2, Stethoscope, User, Search, Copy,
  Download, Eye, EyeOff, AlertTriangle
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Types
interface UserCredential {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  type: "patient" | "professional" | "admin";
  establishment?: string;
  department?: string;
  lastLogin?: string;
  status: "active" | "inactive";
}

export default function AdminCredentials() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "patient" | "professional" | "admin">("all");
  
  // Base de données des identifiants
  const credentials: UserCredential[] = [
    // === COMPTES PATIENTS ===
    {
      id: "PAT-001",
      fullName: "Pierrette NOMSI",
      email: "pierrette.nomsi@gmail.com",
      password: "Nomsi@Patient2024",
      role: "patient",
      type: "patient",
      lastLogin: "2024-10-18 14:30",
      status: "active"
    },
    {
      id: "PAT-002",
      fullName: "Christian AVARO",
      email: "christian.avaro.perso@gmail.com",
      password: "Avaro@Patient2024",
      role: "patient",
      type: "patient",
      lastLogin: "2024-10-15 09:15",
      status: "active"
    },
    {
      id: "PAT-003",
      fullName: "Ingride TCHEN",
      email: "ingride.tchen@gmail.com",
      password: "Tchen@Patient2024",
      role: "patient",
      type: "patient",
      lastLogin: "2024-10-20 16:45",
      status: "active"
    },
    
    // === COMPTES PROFESSIONNELS SOGARA ===
    {
      id: "PRO-001",
      fullName: "Jean-Pierre Mbadinga",
      email: "admin@sogara.com",
      password: "Admin@SOGARA2024",
      role: "hospital",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Administration",
      lastLogin: "2024-10-20 08:00",
      status: "active"
    },
    {
      id: "PRO-002",
      fullName: "Dr. François Obiang",
      email: "directeur@sogara.com",
      password: "DirecteurSOGARA2024!",
      role: "hospital",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Direction Médicale",
      lastLogin: "2024-10-19 17:30",
      status: "active"
    },
    {
      id: "PRO-003",
      fullName: "Dr. Marie OKEMBA",
      email: "dr.okemba@sogara.com",
      password: "Okemba@2024Med",
      role: "doctor",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Médecine Générale",
      lastLogin: "2024-10-20 11:00",
      status: "active"
    },
    {
      id: "PRO-004",
      fullName: "Dr. Paul NGUEMA",
      email: "dr.nguema@sogara.com",
      password: "Nguema@Urgence24",
      role: "doctor",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Urgences",
      lastLogin: "2024-10-20 13:45",
      status: "active"
    },
    {
      id: "PRO-005",
      fullName: "Dr. Léa Mbina",
      email: "dr.mbina@sogara.com",
      password: "Mbina@Cardio2024",
      role: "doctor",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Cardiologie",
      status: "active"
    },
    {
      id: "PRO-006",
      fullName: "Dr. Thomas Mezui",
      email: "dr.mezui@sogara.com",
      password: "Mezui@Pediatrie24",
      role: "doctor",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Pédiatrie",
      status: "active"
    },
    {
      id: "PRO-007",
      fullName: "Sylvie Mba",
      email: "nurse.mba@sogara.com",
      password: "MbaSI@2024",
      role: "medical_staff",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Soins Intensifs",
      status: "active"
    },
    {
      id: "PRO-008",
      fullName: "Patricia Nze",
      email: "nurse.nze@sogara.com",
      password: "NzeUrg@2024",
      role: "medical_staff",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Urgences",
      status: "active"
    },
    {
      id: "PRO-009",
      fullName: "Claire Andeme",
      email: "nurse.andeme@sogara.com",
      password: "Andeme@Mat2024",
      role: "medical_staff",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Maternité",
      status: "active"
    },
    {
      id: "PRO-010",
      fullName: "André Moussavou",
      email: "lab.tech@sogara.com",
      password: "LabSOGARA@2024",
      role: "laboratory",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Laboratoire",
      status: "active"
    },
    {
      id: "PRO-011",
      fullName: "Dr. Lydie Kombila",
      email: "pharma@sogara.com",
      password: "PharmaSOGARA@24",
      role: "pharmacy",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Pharmacie",
      status: "active"
    },
    {
      id: "PRO-012",
      fullName: "Nadège Oyono",
      email: "accueil@sogara.com",
      password: "AccueilSOGARA@24",
      role: "medical_staff",
      type: "professional",
      establishment: "CMST SOGARA",
      department: "Accueil",
      status: "active"
    },
    
    // === COMPTES ADMINISTRATEURS ===
    {
      id: "ADM-001",
      fullName: "Super Admin",
      email: "admin@sante.ga",
      password: "SuperAdmin@2024!",
      role: "super_admin",
      type: "admin",
      lastLogin: "2024-10-20 07:00",
      status: "active"
    }
  ];

  // Filtrage
  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || cred.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Statistiques
  const stats = {
    total: credentials.length,
    patients: credentials.filter(c => c.type === "patient").length,
    professionals: credentials.filter(c => c.type === "professional").length,
    admins: credentials.filter(c => c.type === "admin").length,
    active: credentials.filter(c => c.status === "active").length
  };

  // Handlers
  const handleCopyPassword = (email: string, password: string) => {
    navigator.clipboard.writeText(password);
    toast.success("Mot de passe copié", {
      description: `Mot de passe de ${email} copié dans le presse-papier`
    });
  };

  const handleCopyCredentials = (cred: UserCredential) => {
    const text = `Email: ${cred.email}\nMot de passe: ${cred.password}`;
    navigator.clipboard.writeText(text);
    toast.success("Identifiants copiés", {
      description: `Identifiants de ${cred.fullName} copiés`
    });
  };

  const handleExportCSV = () => {
    const csv = [
      ["ID", "Nom", "Email", "Mot de passe", "Rôle", "Type", "Établissement", "Statut"].join(","),
      ...filteredCredentials.map(c => [
        c.id,
        c.fullName,
        c.email,
        c.password,
        c.role,
        c.type,
        c.establishment || "",
        c.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `identifiants_sante_ga_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success("Export réussi", {
      description: `${filteredCredentials.length} identifiants exportés`
    });
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; icon: any; label: string }> = {
      patient: { color: "bg-blue-500/20 text-blue-700 border-blue-500/30", icon: User, label: "Patient" },
      doctor: { color: "bg-green-500/20 text-green-700 border-green-500/30", icon: Stethoscope, label: "Médecin" },
      hospital: { color: "bg-purple-500/20 text-purple-700 border-purple-500/30", icon: Building2, label: "Admin Étab." },
      medical_staff: { color: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30", icon: UserCheck, label: "Personnel" },
      laboratory: { color: "bg-orange-500/20 text-orange-700 border-orange-500/30", icon: Users, label: "Laboratoire" },
      pharmacy: { color: "bg-pink-500/20 text-pink-700 border-pink-500/30", icon: Users, label: "Pharmacie" },
      super_admin: { color: "bg-red-500/20 text-red-700 border-red-500/30", icon: Shield, label: "Super Admin" }
    };

    const config = roleConfig[role] || { color: "bg-gray-500/20 text-gray-700", icon: Users, label: role };
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Identifiants</h1>
            <p className="text-muted-foreground">Base de données sécurisée des comptes SANTE.GA</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPasswords ? "Masquer" : "Afficher"} mots de passe
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* Alert Sécurité */}
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Information Sensible</AlertTitle>
          <AlertDescription>
            Ces identifiants sont strictement confidentiels. Ne les partagez qu'avec les personnes autorisées.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Comptes</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patients</p>
                  <p className="text-2xl font-bold">{stats.patients}</p>
                </div>
                <User className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Professionnels</p>
                  <p className="text-2xl font-bold">{stats.professionals}</p>
                </div>
                <Stethoscope className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">{stats.admins}</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
                  <TabsTrigger value="patient">Patients ({stats.patients})</TabsTrigger>
                  <TabsTrigger value="professional">Professionnels ({stats.professionals})</TabsTrigger>
                  <TabsTrigger value="admin">Admins ({stats.admins})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Email (Login)</TableHead>
                    <TableHead>Mot de passe</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell className="font-mono text-xs">{cred.id}</TableCell>
                      <TableCell className="font-medium">{cred.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <code className="text-sm bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                            {cred.email}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          {showPasswords ? (
                            <code className="text-sm bg-green-50 dark:bg-green-950 px-2 py-1 rounded font-mono">
                              {cred.password}
                            </code>
                          ) : (
                            <code className="text-sm bg-gray-50 dark:bg-gray-950 px-2 py-1 rounded">
                              ••••••••••••
                            </code>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(cred.role)}</TableCell>
                      <TableCell>
                        {cred.establishment ? (
                          <Badge variant="outline">{cred.establishment}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cred.lastLogin || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cred.status === "active" 
                            ? "bg-green-500/20 text-green-700 border-green-500/30"
                            : "bg-gray-500/20 text-gray-700 border-gray-500/30"
                          }
                        >
                          {cred.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyPassword(cred.email, cred.password)}
                            title="Copier le mot de passe"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyCredentials(cred)}
                            title="Copier les identifiants"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Informations Patient - Pierrette NOMSI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Focus Patient : Pierrette NOMSI
            </CardTitle>
            <CardDescription>Employée SOGARA - Compte patient uniquement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compte Patient</p>
                  <p className="text-sm">Email: pierrette.nomsi@gmail.com</p>
                  <p className="text-sm">Mot de passe: Nomsi@Patient2024</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Connexion: /login/patient
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profil Employé SOGARA</p>
                  <p className="text-sm">Poste: Chef QUALITÉ et CONFORMITÉ</p>
                  <p className="text-sm">Matricule: EMP-SOGARA-0006</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ℹ️ Employée SOGARA avec accès privilégié au CMST
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Historique Médical</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">✅ 3 consultations CMST SOGARA</Badge>
                  <Badge variant="outline">✅ 1 consultation médecin ville (Dr. OBIANG)</Badge>
                  <Badge variant="outline">✅ 1 radiologie thoracique</Badge>
                  <Badge variant="outline">✅ Bilan sanguin complet</Badge>
                  <Badge variant="outline">⚠️ Allergie: Pénicilline</Badge>
                  <Badge variant="outline">💊 Traitement: Amlodipine 5mg</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
