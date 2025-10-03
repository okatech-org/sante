import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Filter,
  Search,
  Shield,
  Building2,
  Stethoscope,
  Pill,
  TestTube,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";

interface PendingApproval {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  province: string | null;
  city: string | null;
  neighborhood: string | null;
  created_at: string;
  requested_role: string;
  specialty?: string;
  establishment_name?: string;
  license_number?: string;
  description?: string;
}

const roleLabels: Record<string, string> = {
  doctor: "Médecin",
  pharmacy: "Pharmacie",
  laboratory: "Laboratoire",
  hospital: "Hôpital",
  medical_staff: "Personnel Médical",
};

const roleIcons: Record<string, any> = {
  doctor: Stethoscope,
  pharmacy: Pill,
  laboratory: TestTube,
  hospital: Building2,
  medical_staff: User,
};

export default function AdminApprovals() {
  const { hasRole } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<PendingApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const isSuperAdmin = hasRole("super_admin");
  const isAdmin = hasRole("admin") || isSuperAdmin;

  useEffect(() => {
    if (isAdmin) {
      loadPendingApprovals();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterApprovals();
  }, [pendingApprovals, searchTerm, filterRole]);

  const loadPendingApprovals = async () => {
    try {
      setIsLoading(true);
      
      // Simuler des données en attente d'approbation
      // TODO: Remplacer par une vraie requête à la table pending_approvals
      const mockData: PendingApproval[] = [
        {
          id: "1",
          full_name: "Dr. KOMBILA Pierre",
          email: "kombila.pierre@sante.ga",
          phone: "+241 062 12 34 56",
          province: "Estuaire",
          city: "Libreville",
          neighborhood: "Montagne Sainte",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          requested_role: "doctor",
          specialty: "Cardiologie",
          license_number: "CNOM-GA-2024-001234",
          establishment_name: "Cabinet Cardiologie Montagne Sainte",
          description: "15 ans d'expérience en cardiologie interventionnelle"
        },
        {
          id: "2",
          full_name: "Pharmacie de la Grâce",
          email: "contact@pharmaciedelagrace.ga",
          phone: "+241 062 94 94 24",
          province: "Estuaire",
          city: "Libreville",
          neighborhood: "Angondjé",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          requested_role: "pharmacy",
          license_number: "PHAR-GA-2024-00567",
          establishment_name: "Pharmacie de la Grâce",
          description: "Pharmacie ouverte 24h/24, 7j/7 avec service de garde"
        },
        {
          id: "3",
          full_name: "BIOLAB Gabon",
          email: "info@biolab.ga",
          phone: "+241 011 45 67 89",
          province: "Estuaire",
          city: "Libreville",
          neighborhood: "Centre-ville",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          requested_role: "laboratory",
          license_number: "LAB-GA-2024-00123",
          establishment_name: "BIOLAB - Laboratoire d'analyses médicales",
          description: "Analyses biologiques et imagerie médicale de pointe"
        },
        {
          id: "4",
          full_name: "Dr. AFONSO Maria",
          email: "afonso.maria@sante.ga",
          phone: "+241 062 78 90 12",
          province: "Haut-Ogooué",
          city: "Franceville",
          neighborhood: "Quartier administratif",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          requested_role: "doctor",
          specialty: "Médecine générale",
          license_number: "CNOM-GA-2024-001567",
          establishment_name: "Cabinet Dr. AFONSO",
          description: "Médecine générale et pédiatrie"
        },
        {
          id: "5",
          full_name: "Polyclinique Saint-Joseph",
          email: "contact@polycliniquestjoseph.ga",
          phone: "+241 011 23 45 67",
          province: "Estuaire",
          city: "Libreville",
          neighborhood: "Oloumi",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          requested_role: "hospital",
          license_number: "HOSP-GA-2024-00234",
          establishment_name: "Polyclinique Saint-Joseph",
          description: "Établissement privé avec service d'urgences 24/7, chirurgie, maternité"
        }
      ];

      setPendingApprovals(mockData);
    } catch (error: any) {
      console.error('Error loading approvals:', error);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setIsLoading(false);
    }
  };

  const filterApprovals = () => {
    let filtered = pendingApprovals;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.full_name.toLowerCase().includes(term) ||
        a.email?.toLowerCase().includes(term) ||
        a.phone.includes(term) ||
        a.establishment_name?.toLowerCase().includes(term)
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter(a => a.requested_role === filterRole);
    }

    setFilteredApprovals(filtered);
  };

  const handleApprove = async (approval: PendingApproval) => {
    try {
      // TODO: Implémenter l'approbation réelle
      // 1. Ajouter le rôle dans user_roles
      // 2. Créer le profil professionnel (medecins, pharmacies, etc.)
      // 3. Marquer la demande comme approuvée
      // 4. Envoyer notification par email/SMS
      
      toast.success(`${approval.full_name} approuvé avec succès`);
      
      // Retirer de la liste
      setPendingApprovals(prev => prev.filter(p => p.id !== approval.id));
    } catch (error: any) {
      console.error('Error approving:', error);
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleReject = async () => {
    if (!selectedApproval) return;
    
    try {
      // TODO: Implémenter le rejet réel
      // 1. Marquer la demande comme rejetée avec raison
      // 2. Envoyer notification au demandeur avec la raison
      
      toast.success(`Demande de ${selectedApproval.full_name} rejetée`);
      
      // Retirer de la liste
      setPendingApprovals(prev => prev.filter(p => p.id !== selectedApproval.id));
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedApproval(null);
    } catch (error: any) {
      console.error('Error rejecting:', error);
      toast.error("Erreur lors du rejet");
    }
  };

  const openDetailsDialog = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setShowDetailsDialog(true);
  };

  const openRejectDialog = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setShowRejectDialog(true);
  };

  const stats = {
    total: pendingApprovals.length,
    doctors: pendingApprovals.filter(p => p.requested_role === 'doctor').length,
    pharmacies: pendingApprovals.filter(p => p.requested_role === 'pharmacy').length,
    laboratories: pendingApprovals.filter(p => p.requested_role === 'laboratory').length,
    hospitals: pendingApprovals.filter(p => p.requested_role === 'hospital').length,
  };

  if (!isAdmin) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="h-8 w-8 text-warning" />
              Approbations en attente
            </h1>
            <p className="text-muted-foreground mt-1">
              Validez les inscriptions des professionnels de santé
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {stats.total} en attente
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Stethoscope className="h-4 w-4" />
                Médecins
              </CardDescription>
              <CardTitle className="text-3xl">{stats.doctors}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Pill className="h-4 w-4" />
                Pharmacies
              </CardDescription>
              <CardTitle className="text-3xl">{stats.pharmacies}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <TestTube className="h-4 w-4" />
                Laboratoires
              </CardDescription>
              <CardTitle className="text-3xl">{stats.laboratories}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Hôpitaux
              </CardDescription>
              <CardTitle className="text-3xl">{stats.hospitals}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">
                  <Search className="h-4 w-4 inline mr-2" />
                  Rechercher
                </Label>
                <Input
                  id="search"
                  placeholder="Nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filtrer par type
                </Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger id="filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="doctor">Médecins</SelectItem>
                    <SelectItem value="pharmacy">Pharmacies</SelectItem>
                    <SelectItem value="laboratory">Laboratoires</SelectItem>
                    <SelectItem value="hospital">Hôpitaux</SelectItem>
                    <SelectItem value="medical_staff">Personnel médical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
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

        {/* Liste des demandes */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes en attente ({filteredApprovals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Chargement...</div>
              </div>
            ) : filteredApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-success mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande en attente</h3>
                <p className="text-muted-foreground">
                  Toutes les demandes ont été traitées
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Nom / Établissement</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Date demande</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovals.map((approval) => {
                      const RoleIcon = roleIcons[approval.requested_role];
                      const daysSince = Math.floor((Date.now() - new Date(approval.created_at).getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <TableRow key={approval.id}>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <RoleIcon className="h-3 w-3" />
                              {roleLabels[approval.requested_role]}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div>{approval.full_name}</div>
                              {approval.specialty && (
                                <div className="text-xs text-muted-foreground">
                                  {approval.specialty}
                                </div>
                              )}
                              {approval.establishment_name && approval.establishment_name !== approval.full_name && (
                                <div className="text-xs text-muted-foreground">
                                  {approval.establishment_name}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {approval.email && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  {approval.email}
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {approval.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {approval.city && approval.province ? (
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  {approval.city}
                                </div>
                                <div className="text-xs text-muted-foreground pl-4">
                                  {approval.province}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {new Date(approval.created_at).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Il y a {daysSince} jour{daysSince > 1 ? 's' : ''}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetailsDialog(approval)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApprove(approval)}
                                className="bg-success text-success-foreground hover:bg-success/90"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openRejectDialog(approval)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeter
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedApproval && roleIcons[selectedApproval.requested_role] && (
                <span className="p-2 rounded-lg bg-primary/10">
                  {(() => {
                    const Icon = roleIcons[selectedApproval.requested_role];
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                </span>
              )}
              Détails de la demande
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur le demandeur
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (
            <div className="space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Type de professionnel</Label>
                  <p className="font-medium">{roleLabels[selectedApproval.requested_role]}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Numéro de licence</Label>
                  <p className="font-medium">{selectedApproval.license_number || '-'}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Nom complet / Établissement</Label>
                <p className="font-medium text-lg">{selectedApproval.full_name}</p>
                {selectedApproval.establishment_name && selectedApproval.establishment_name !== selectedApproval.full_name && (
                  <p className="text-sm text-muted-foreground">{selectedApproval.establishment_name}</p>
                )}
              </div>

              {selectedApproval.specialty && (
                <div>
                  <Label className="text-xs text-muted-foreground">Spécialité</Label>
                  <p className="font-medium">{selectedApproval.specialty}</p>
                </div>
              )}

              {/* Contact */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Coordonnées</Label>
                <div className="space-y-2">
                  {selectedApproval.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedApproval.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApproval.phone}</span>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Adresse</Label>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    {selectedApproval.neighborhood && <p>{selectedApproval.neighborhood}</p>}
                    <p>{selectedApproval.city}, {selectedApproval.province}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedApproval.description && (
                <div>
                  <Label className="text-xs text-muted-foreground">Description / Présentation</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{selectedApproval.description}</p>
                </div>
              )}

              {/* Date */}
              <div>
                <Label className="text-xs text-muted-foreground">Date de la demande</Label>
                <p className="font-medium">
                  {new Date(selectedApproval.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDetailsDialog(false);
                if (selectedApproval) openRejectDialog(selectedApproval);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
            <Button
              onClick={() => {
                if (selectedApproval) handleApprove(selectedApproval);
                setShowDetailsDialog(false);
              }}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rejet */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeter la demande</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action enverra une notification au demandeur. Veuillez indiquer la raison du rejet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du rejet *</Label>
            <Textarea
              id="reason"
              placeholder="Ex: Documents incomplets, numéro de licence invalide, informations incohérentes..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setRejectReason("");
              setSelectedApproval(null);
            }}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmer le rejet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
