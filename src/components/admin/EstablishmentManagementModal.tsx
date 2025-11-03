// Modal de gestion complète d'un établissement
// SANTE.GA - Plateforme E-Santé Gabon

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Building2,
  Users,
  LayoutDashboard,
  Settings,
  CreditCard,
  FileText,
  Phone,
  Bed,
  Activity,
  BarChart3,
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  Save,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Stethoscope,
  Heart,
  Brain,
  Pill,
  Briefcase
} from "lucide-react";
import { Star } from "lucide-react";
import { Establishment } from "@/types/establishment";
import { establishmentsService } from "@/services/establishments.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface EstablishmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishment: Establishment;
  onSave: (updatedEstablishment: Establishment) => void;
}

interface DashboardService {
  id: string;
  name: string;
  description: string;
  roles: string[];
  enabled: boolean;
  icon: any;
  url: string;
}

interface EstablishmentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

export const EstablishmentManagementModal = ({
  isOpen,
  onClose,
  establishment,
  onSave
}: EstablishmentManagementModalProps) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [editedEstablishment, setEditedEstablishment] = useState(establishment);
  
  // États pour les utilisateurs
  const [users, setUsers] = useState<EstablishmentUser[]>([
    {
      id: '1',
      name: 'Dr. Marie Obiang',
      email: 'marie.obiang@example.com',
      role: 'Médecin Chef',
      department: 'Direction',
      status: 'active',
      lastLogin: '2025-11-01 10:30',
      createdAt: '2023-05-15'
    },
    {
      id: '2',
      name: 'Jean Nzamba',
      email: 'jean.nzamba@example.com',
      role: 'Administrateur',
      department: 'Administration',
      status: 'active',
      lastLogin: '2025-11-01 09:15',
      createdAt: '2023-06-20'
    }
  ]);

  // États pour les dashboards et services
  const [dashboardServices, setDashboardServices] = useState<DashboardService[]>([
    {
      id: '1',
      name: 'Dashboard Médecin',
      description: 'Interface de gestion médicale',
      roles: ['Médecin', 'Médecin Chef'],
      enabled: true,
      icon: Stethoscope,
      url: '/dashboard/doctor'
    },
    {
      id: '2',
      name: 'Dashboard Infirmier',
      description: 'Suivi des soins infirmiers',
      roles: ['Infirmier', 'Infirmier Chef'],
      enabled: true,
      icon: Heart,
      url: '/dashboard/nurse'
    },
    {
      id: '3',
      name: 'Dashboard Pharmacie',
      description: 'Gestion des stocks médicaments',
      roles: ['Pharmacien'],
      enabled: true,
      icon: Pill,
      url: '/dashboard/pharmacy'
    },
    {
      id: '4',
      name: 'Dashboard Administration',
      description: 'Gestion administrative',
      roles: ['Administrateur', 'Direction'],
      enabled: true,
      icon: Building2,
      url: '/dashboard/admin'
    },
    {
      id: '5',
      name: 'Dashboard Laboratoire',
      description: 'Gestion des analyses',
      roles: ['Laborantin'],
      enabled: false,
      icon: Brain,
      url: '/dashboard/lab'
    }
  ]);

  // Favoris (persistance locale)
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_establishment_favorites');
      const ids = raw ? JSON.parse(raw) : [];
      setIsFavorite(Array.isArray(ids) ? ids.includes(establishment.id) : false);
    } catch {}
  }, [establishment.id]);

  const toggleFavorite = () => {
    try {
      const raw = localStorage.getItem('admin_establishment_favorites');
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const exists = ids.includes(establishment.id);
      const next = exists ? ids.filter(id => id !== establishment.id) : [...ids, establishment.id];
      localStorage.setItem('admin_establishment_favorites', JSON.stringify(next));
      setIsFavorite(!exists);
      toast.success(exists ? "Retiré des favoris" : "Ajouté aux favoris");
    } catch {}
  };

  // États pour les logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2025-11-01 11:45:23',
      user: 'Dr. Marie Obiang',
      action: 'Modification profil patient',
      details: 'Patient ID: PAT-2025-0145',
      ipAddress: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2025-11-01 10:30:15',
      user: 'Jean Nzamba',
      action: 'Connexion système',
      details: 'Connexion réussie',
      ipAddress: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2025-11-01 09:20:45',
      user: 'System',
      action: 'Tentative de connexion échouée',
      details: 'Compte: admin@test.com',
      ipAddress: '41.158.203.45',
      status: 'error'
    }
  ]);

  // États pour la facturation
  const [billingInfo, setBillingInfo] = useState({
    currentPlan: 'Premium',
    monthlyFee: 500000,
    nextBilling: '2025-12-01',
    paymentMethod: 'Virement bancaire',
    invoices: [
      { id: 'INV-2025-10', date: '2025-10-01', amount: 500000, status: 'paid' },
      { id: 'INV-2025-09', date: '2025-09-01', amount: 500000, status: 'paid' },
      { id: 'INV-2025-08', date: '2025-08-01', amount: 500000, status: 'paid' }
    ]
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler API
      onSave(editedEstablishment);
      toast.success("Établissement mis à jour avec succès");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDashboard = (dashboardId: string) => {
    setDashboardServices(prev => 
      prev.map(d => 
        d.id === dashboardId ? { ...d, enabled: !d.enabled } : d
      )
    );
  };

  const handleUserStatusChange = (userId: string, newStatus: EstablishmentUser['status']) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      )
    );
    toast.success(`Statut utilisateur mis à jour`);
  };

  const exportLogs = () => {
    // Logique d'export CSV
    toast.success("Logs exportés avec succès");
  };

  const calculateOccupancyTrend = () => {
    const current = establishment.metrics.occupancyRate;
    const previous = 68; // Valeur simulée du mois précédent
    return current - previous;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6" />
            Gestion de l'Établissement - {establishment.name}
            <button
              onClick={toggleFavorite}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`ml-2 p-1 rounded hover:bg-muted/60 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-muted-foreground'}`}
            >
              <Star className="h-5 w-5" />
            </button>
          </DialogTitle>
          <DialogDescription>
            Configuration complète et gestion des utilisateurs, dashboards, facturation et paramètres de l'établissement
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-11 w-full">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            {establishment.code === 'CLN-PG-001' && (
              <TabsTrigger value="patients" className="text-cyan-600">
                Patients
              </TabsTrigger>
            )}
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="capacity">Capacités</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            {/* Onglet Général / Vue d'ensemble */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nom de l'établissement</Label>
                      <Input
                        value={editedEstablishment.name}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Code</Label>
                      <Input value={editedEstablishment.code} disabled />
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <Select
                        value={editedEstablishment.category}
                        onValueChange={(value) => setEditedEstablishment({
                          ...editedEstablishment,
                          category: value as any
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gouvernemental">Gouvernemental</SelectItem>
                          <SelectItem value="universitaire">Universitaire</SelectItem>
                          <SelectItem value="regional">Régional</SelectItem>
                          <SelectItem value="prive">Privé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <Select
                        value={editedEstablishment.status}
                        onValueChange={(value) => setEditedEstablishment({
                          ...editedEstablishment,
                          status: value as any
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operationnel">Opérationnel</SelectItem>
                          <SelectItem value="partiel">Partiellement opérationnel</SelectItem>
                          <SelectItem value="maintenance">En maintenance</SelectItem>
                          <SelectItem value="ferme">Fermé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Aperçu rapide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Province</span>
                        <Badge>{establishment.location.province}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Ville</span>
                        <span className="font-medium">{establishment.location.city}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total lits</span>
                        <span className="font-medium">{establishment.metrics.totalBeds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Taux occupation</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{establishment.metrics.occupancyRate}%</span>
                          {calculateOccupancyTrend() > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Personnel total</span>
                        <span className="font-medium">{establishment.staff.total}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="h-3 w-3 text-cyan-600" />
                          Ayants droit
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-cyan-600 border-cyan-600">
                            1,250
                          </Badge>
                          <span className="text-xs text-muted-foreground">Employés SOGARA</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Direction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Directeur</Label>
                      <Input
                        value={editedEstablishment.director || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          director: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Contact directeur</Label>
                      <Input
                        value={editedEstablishment.directorContact || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          directorContact: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Utilisateurs */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Utilisateurs de l'établissement</span>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter utilisateur
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Rechercher..." className="pl-8" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.role}</Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Select
                              value={user.status}
                              onValueChange={(value) => handleUserStatusChange(user.id, value as any)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                    Actif
                                  </div>
                                </SelectItem>
                                <SelectItem value="inactive">
                                  <div className="flex items-center">
                                    <XCircle className="h-3 w-3 mr-1 text-gray-500" />
                                    Inactif
                                  </div>
                                </SelectItem>
                                <SelectItem value="suspended">
                                  <div className="flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                                    Suspendu
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {user.lastLogin || 'Jamais'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-3 w-3" />
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

            {/* NOUVEL ONGLET PATIENTS (CMST SOGARA uniquement) */}
            <TabsContent value="patients" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-6 w-6 text-cyan-600" />
                        Patients / Ayants Droit SOGARA
                      </CardTitle>
                      <CardDescription>
                        Employés SOGARA et leurs familles bénéficiaires de soins au CMST
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-cyan-600 border-cyan-600 text-lg px-4 py-1">
                      12 bénéficiaires
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                            <span className="text-3xl font-bold text-blue-700">8</span>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">Employés SOGARA</p>
                          <p className="text-xs text-blue-600 mt-1">Personnel actif</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Heart className="h-6 w-6 text-pink-600" />
                            <span className="text-3xl font-bold text-pink-700">4</span>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">Membres Familles</p>
                          <p className="text-xs text-pink-600 mt-1">Proches couverts</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <UserCheck className="h-6 w-6 text-green-600" />
                            <span className="text-3xl font-bold text-green-700">12</span>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">Total Ayants Droit</p>
                          <p className="text-xs text-green-600 mt-1">Bénéficiaires actifs</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Liste des Employés */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        Employés SOGARA (8)
                      </h3>
                      <Badge variant="outline" className="bg-blue-50">Personnel</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              CA
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Christian AVARO</p>
                              <p className="text-xs text-muted-foreground">Directeur Général</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              IT
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Ingride TCHEN</p>
                              <p className="text-xs text-muted-foreground">Directrice Financière</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              JN
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Jean NZENGUE</p>
                              <p className="text-xs text-muted-foreground">Chef Production</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              MM
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Marie MOUSSAVOU</p>
                              <p className="text-xs text-muted-foreground">Responsable HSE</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              PO
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Paul OBAME</p>
                              <p className="text-xs text-muted-foreground">Chef Maintenance</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              PN
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Pierrette NOMSI</p>
                              <p className="text-xs text-muted-foreground">Chef QUALITÉ</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              AM
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Alain MOUSSAVOU</p>
                              <p className="text-xs text-muted-foreground">Technicien Raffinerie</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/50 dark:bg-blue-950/10 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              SM
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Sylvie MENGUE</p>
                              <p className="text-xs text-muted-foreground">Assistante RH</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Liste des Familles */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-600" />
                        Membres Familles (4)
                      </h3>
                      <Badge variant="outline" className="bg-pink-50">Proches</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-pink-50/50 dark:bg-pink-950/10 border-pink-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                              MA
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Marie AVARO</p>
                              <p className="text-xs text-muted-foreground">Conjointe de Christian AVARO</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-pink-50/50 dark:bg-pink-950/10 border-pink-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                              SA
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Sophie AVARO</p>
                              <p className="text-xs text-muted-foreground">Enfant de Christian AVARO</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-pink-50/50 dark:bg-pink-950/10 border-pink-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                              CN
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Claire NZENGUE</p>
                              <p className="text-xs text-muted-foreground">Conjointe de Jean NZENGUE</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-pink-50/50 dark:bg-pink-950/10 border-pink-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                              JN
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Jean NOMSI</p>
                              <p className="text-xs text-muted-foreground">Conjoint de Pierrette NOMSI</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Informations de Couverture */}
                  <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20 border-cyan-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-cyan-900 dark:text-cyan-100 mb-2">
                            Statut de Couverture Médicale
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Tous les employés SOGARA et jusqu'à <strong>3 membres de famille</strong> par employé sont couverts par le CMST pour :
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">Visites médicales annuelles obligatoires</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">Consultations médecin du travail</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">Soins d'urgence à l'infirmerie</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">Campagnes de vaccination et dépistage</span>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                              <strong>Note :</strong> Chaque employé SOGARA peut désigner jusqu'à 3 proches (conjoint + 2 enfants) comme ayants droit bénéficiant également de la couverture médicale du CMST.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Dashboards et Services */}
            <TabsContent value="dashboards" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dashboards et Services disponibles</CardTitle>
                  <CardDescription>
                    Configurez les tableaux de bord accessibles selon les rôles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardServices.map((dashboard) => {
                      const Icon = dashboard.icon;
                      return (
                        <Card key={dashboard.id} className={!dashboard.enabled ? 'opacity-60' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${dashboard.enabled ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                  <Icon className={`h-5 w-5 ${dashboard.enabled ? 'text-primary' : 'text-gray-400'}`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{dashboard.name}</h4>
                                  <p className="text-sm text-gray-500 mt-1">{dashboard.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-500">Rôles:</span>
                                    {dashboard.roles.map((role, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                  <code className="text-xs text-gray-400 mt-1 block">{dashboard.url}</code>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={dashboard.enabled}
                                  onCheckedChange={() => handleToggleDashboard(dashboard.id)}
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Configuration */}
            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Paramètres généraux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Centre d'urgences 24/7</p>
                      <p className="text-sm text-gray-500">Activer le service d'urgences</p>
                    </div>
                    <Switch checked={establishment.isEmergencyCenter} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Centre de référence</p>
                      <p className="text-sm text-gray-500">Établissement de référence régional</p>
                    </div>
                    <Switch checked={establishment.isReferralCenter} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Hôpital universitaire</p>
                      <p className="text-sm text-gray-500">Formation des étudiants en médecine</p>
                    </div>
                    <Switch checked={establishment.isTeachingHospital} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Services disponibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">Pharmacie</p>
                        <p className="text-sm text-gray-500">Pharmacie sur site</p>
                      </div>
                    </div>
                    <Switch checked={establishment.hasPharmacy} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">Laboratoire</p>
                        <p className="text-sm text-gray-500">Laboratoire d'analyses</p>
                      </div>
                    </div>
                    <Switch checked={establishment.hasLaboratory} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Facturation */}
            <TabsContent value="billing" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Plan actuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{billingInfo.currentPlan}</p>
                    <Button variant="outline" size="sm" className="mt-2">Changer</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Mensualité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{billingInfo.monthlyFee.toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-500 mt-1">Prochaine: {billingInfo.nextBilling}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Méthode paiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium">{billingInfo.paymentMethod}</p>
                    <Button variant="outline" size="sm" className="mt-2">Modifier</Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Factures récentes</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Tout télécharger
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingInfo.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.amount.toLocaleString()} FCFA</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                              {invoice.status === 'paid' ? 'Payé' : 'En attente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Logs & Audit */}
            <TabsContent value="logs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Journaux d'audit</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualiser
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportLogs}>
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`mt-0.5 h-2 w-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' :
                          log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{log.user}</span>
                            <span className="text-xs text-gray-500">{log.timestamp}</span>
                            <Badge variant="outline" className="text-xs">{log.ipAddress}</Badge>
                          </div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Contact */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Téléphone principal</Label>
                      <Input
                        value={editedEstablishment.contact.phoneMain}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          contact: { ...editedEstablishment.contact, phoneMain: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Téléphone urgences</Label>
                      <Input
                        value={editedEstablishment.contact.phoneEmergency || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          contact: { ...editedEstablishment.contact, phoneEmergency: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editedEstablishment.contact.email || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          contact: { ...editedEstablishment.contact, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Site web</Label>
                      <Input
                        value={editedEstablishment.contact.website || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          contact: { ...editedEstablishment.contact, website: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Localisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Adresse complète</Label>
                    <Textarea
                      value={editedEstablishment.location.address}
                      onChange={(e) => setEditedEstablishment({
                        ...editedEstablishment,
                        location: { ...editedEstablishment.location, address: e.target.value }
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.location.coordinates?.latitude || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          location: {
                            ...editedEstablishment.location,
                            coordinates: {
                              ...editedEstablishment.location.coordinates,
                              latitude: parseFloat(e.target.value)
                            } as any
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.location.coordinates?.longitude || ''}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          location: {
                            ...editedEstablishment.location,
                            coordinates: {
                              ...editedEstablishment.location.coordinates,
                              longitude: parseFloat(e.target.value)
                            } as any
                          }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Capacités */}
            <TabsContent value="capacity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Capacité d'accueil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>Total de lits</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.metrics.totalBeds}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          metrics: { ...editedEstablishment.metrics, totalBeds: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Lits occupés</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.metrics.occupiedBeds}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          metrics: { ...editedEstablishment.metrics, occupiedBeds: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Taux d'occupation (%)</Label>
                      <div className="mt-2">
                        <Progress value={editedEstablishment.metrics.occupancyRate} className="h-8" />
                        <span className="text-sm font-medium">{editedEstablishment.metrics.occupancyRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Médecins</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.staff.doctors}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          staff: { ...editedEstablishment.staff, doctors: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Spécialistes</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.staff.specialists}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          staff: { ...editedEstablishment.staff, specialists: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Infirmiers</Label>
                      <Input
                        type="number"
                        value={editedEstablishment.staff.nurses}
                        onChange={(e) => setEditedEstablishment({
                          ...editedEstablishment,
                          staff: { ...editedEstablishment.staff, nurses: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Équipements */}
            <TabsContent value="equipment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Équipements médicaux</CardTitle>
                </CardHeader>
                <CardContent>
                  {establishment.equipment && establishment.equipment.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Équipement</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Quantité</TableHead>
                          <TableHead>Fonctionnel</TableHead>
                          <TableHead>Maintenance</TableHead>
                          <TableHead>Hors service</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {establishment.equipment.map((eq) => (
                          <TableRow key={eq.id}>
                            <TableCell className="font-medium">{eq.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{eq.category}</Badge>
                            </TableCell>
                            <TableCell>{eq.quantity}</TableCell>
                            <TableCell>
                              <span className="text-green-600 font-medium">{eq.functional}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-orange-600">{eq.maintenance}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-red-600">{eq.broken}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Aucun équipement enregistré</p>
                      <Button className="mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un équipement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Statistiques */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Consultations/mois</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{establishment.metrics.consultationsMonthly.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">+12% vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Urgences/mois</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{establishment.metrics.emergenciesMonthly.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-500">-5% vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">Satisfaction patients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{establishment.metrics.patientSatisfaction.toFixed(1)}/5</p>
                    <Progress value={establishment.metrics.patientSatisfaction * 20} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Indicateurs de performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Temps d'attente moyen</span>
                        <span className="text-sm font-medium">{establishment.metrics.averageWaitTime}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Durée moyenne de séjour</span>
                        <span className="text-sm font-medium">{establishment.metrics.averageStayDuration}</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Taux de réadmission (30j)</span>
                        <span className="text-sm font-medium">8.5%</span>
                      </div>
                      <Progress value={8.5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
