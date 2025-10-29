import { useState, useEffect } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle, Search, Shield, FileText, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface PendingApproval {
  id: string;
  type: 'professional' | 'establishment';
  name: string;
  email: string;
  phone: string;
  profession?: string;
  specialty?: string;
  establishmentType?: string;
  city: string;
  province: string;
  created_at: string;
  documents?: any;
}

const typeLabels: Record<string, string> = {
  professional: 'Professionnel de santé',
  establishment: 'Établissement'
};

const typeColors: Record<string, string> = {
  professional: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-400/30',
  establishment: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-400/30'
};

export default function AdminApprovals() {
  const { isSuperAdmin } = useOfflineAuth();
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<PendingApproval[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadApprovals();
  }, []);

  useEffect(() => {
    filterApprovals();
  }, [searchTerm, typeFilter, approvals]);

  const loadApprovals = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les professionnels non vérifiés
      const { data: professionals, error: profError } = await supabase
        .from('professional_profiles')
        .select(`
          id,
          user_id,
          profession_type,
          specialization,
          ordre_number,
          ordre_verified,
          created_at,
          profiles:user_id (
            full_name,
            email,
            phone,
            city,
            province
          )
        `)
        .eq('ordre_verified', false)
        .not('ordre_number', 'is', null);

      if (profError) throw profError;

      // Récupérer les établissements en validation
      const { data: establishments, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .eq('statut', 'en_validation');

      if (estError) throw estError;

      // Formatter les données
      const allApprovals: PendingApproval[] = [
        ...(professionals || []).map(prof => ({
          id: prof.id,
          type: 'professional' as const,
          name: prof.profiles?.full_name || 'N/A',
          email: prof.profiles?.email || 'N/A',
          phone: prof.profiles?.phone || 'N/A',
          profession: prof.profession_type,
          specialty: prof.specialization || undefined,
          city: prof.profiles?.city || 'N/A',
          province: prof.profiles?.province || 'N/A',
          created_at: prof.created_at,
          documents: { ordre_number: prof.ordre_number }
        })),
        ...(establishments || []).map(est => ({
          id: est.id,
          type: 'establishment' as const,
          name: est.raison_sociale,
          email: est.email || est.directeur_general_email || 'N/A',
          phone: est.telephone_standard || est.directeur_general_telephone || 'N/A',
          establishmentType: est.type_etablissement,
          city: est.ville,
          province: est.province,
          created_at: est.created_at,
          documents: {
            numero_autorisation: est.numero_autorisation,
            numero_rccm: est.numero_rccm
          }
        }))
      ];

      setApprovals(allApprovals);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des approbations");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApprovals = () => {
    let filtered = approvals;

    if (searchTerm) {
      filtered = filtered.filter(approval =>
        approval.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(approval => approval.type === typeFilter);
    }

    setFilteredApprovals(filtered);
  };

  const handleApprove = async (approval: PendingApproval) => {
    try {
      if (approval.type === 'professional') {
        // Mettre à jour le profil professionnel
        const { error: updateError } = await supabase
          .from('professional_profiles')
          .update({ ordre_verified: true })
          .eq('id', approval.id);

        if (updateError) throw updateError;

        // Récupérer le user_id pour assigner le rôle
        const { data: profData } = await supabase
          .from('professional_profiles')
          .select('user_id, profession_type')
          .eq('id', approval.id)
          .single();

        if (profData) {
          // Déterminer le rôle selon le type de profession
          let role = 'doctor';
          if (profData.profession_type === 'pharmacien') role = 'pharmacy';
          else if (profData.profession_type === 'infirmier') role = 'medical_staff';
          else if (profData.profession_type === 'laboratoire') role = 'laboratory';

          // Assigner le rôle
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: profData.user_id, role: role as any }]);

          if (roleError && !roleError.message.includes('duplicate')) {
            throw roleError;
          }
        }
      } else if (approval.type === 'establishment') {
        // Mettre à jour le statut de l'établissement
        const { error: updateError } = await supabase
          .from('establishments')
          .update({ statut: 'actif' })
          .eq('id', approval.id);

        if (updateError) throw updateError;
      }

      toast.success(`${typeLabels[approval.type]} approuvé(e) avec succès`);
      loadApprovals();
    } catch (error: any) {
      toast.error("Erreur lors de l'approbation: " + error.message);
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval || !rejectReason.trim()) {
      toast.error("Veuillez fournir une raison pour le rejet");
      return;
    }

    try {
      if (selectedApproval.type === 'professional') {
        // Mettre à jour la vérification CNOM avec le rejet
        const { data: profData } = await supabase
          .from('professional_profiles')
          .select('user_id')
          .eq('id', selectedApproval.id)
          .single();

        if (profData) {
          // Créer ou mettre à jour la vérification CNOM
          const { error: verifError } = await supabase
            .from('cnom_verifications')
            .upsert({
              professional_id: selectedApproval.id,
              numero_ordre: selectedApproval.documents?.ordre_number || '',
              verification_status: 'rejected',
              verification_notes: rejectReason,
              verified_at: new Date().toISOString()
            });

          if (verifError) throw verifError;
        }
      } else if (selectedApproval.type === 'establishment') {
        // Mettre à jour le statut de l'établissement à suspendu (car refuse n'existe pas)
        const { error: updateError } = await supabase
          .from('establishments')
          .update({ 
            statut: 'suspendu',
          })
          .eq('id', selectedApproval.id);

        if (updateError) throw updateError;
      }

      toast.success("Demande rejetée avec succès");
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedApproval(null);
      loadApprovals();
    } catch (error: any) {
      toast.error("Erreur lors du rejet: " + error.message);
      console.error(error);
    }
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
    total: approvals.length,
    professionals: approvals.filter(a => a.type === 'professional').length,
    establishments: approvals.filter(a => a.type === 'establishment').length
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestion des Approbations
          </h1>
          <p className="text-muted-foreground mt-1">
            Validez les demandes d'inscription des professionnels et établissements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'En attente', value: stats.total, icon: Clock, color: 'from-orange-500 to-amber-500' },
            { label: 'Professionnels', value: stats.professionals, icon: User, color: 'from-green-500 to-emerald-500' },
            { label: 'Établissements', value: stats.establishments, icon: FileText, color: 'from-blue-500 to-cyan-500' }
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
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="professional">Professionnels</SelectItem>
                  <SelectItem value="establishment">Établissements</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Approvals List */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Demandes en attente ({filteredApprovals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Chargement...</div>
            ) : filteredApprovals.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium">Aucune demande en attente</p>
                <p className="text-muted-foreground mt-1">Toutes les demandes ont été traitées</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{approval.name}</h3>
                          <Badge variant="outline" className={typeColors[approval.type]}>
                            {typeLabels[approval.type]}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {approval.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {approval.phone}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {approval.city}, {approval.province} • {new Date(approval.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApproval(approval);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(approval)}
                          className="text-green-500 hover:text-green-600 border-green-500/30 hover:bg-green-500/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approuver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApproval(approval);
                            setShowRejectDialog(true);
                          }}
                          className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la demande</DialogTitle>
              <DialogDescription>Informations complètes sur la demande</DialogDescription>
            </DialogHeader>
            {selectedApproval && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{selectedApproval.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline" className={typeColors[selectedApproval.type]}>
                      {typeLabels[selectedApproval.type]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedApproval.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{selectedApproval.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ville</p>
                    <p className="font-medium">{selectedApproval.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Province</p>
                    <p className="font-medium">{selectedApproval.province}</p>
                  </div>
                  {selectedApproval.profession && (
                    <div>
                      <p className="text-sm text-muted-foreground">Profession</p>
                      <p className="font-medium">{selectedApproval.profession}</p>
                    </div>
                  )}
                  {selectedApproval.specialty && (
                    <div>
                      <p className="text-sm text-muted-foreground">Spécialité</p>
                      <p className="font-medium">{selectedApproval.specialty}</p>
                    </div>
                  )}
                  {selectedApproval.establishmentType && (
                    <div>
                      <p className="text-sm text-muted-foreground">Type d'établissement</p>
                      <p className="font-medium">{selectedApproval.establishmentType}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-2">Documents</p>
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                      {selectedApproval.documents?.ordre_number && (
                        <p><span className="font-medium">N° d'ordre:</span> {selectedApproval.documents.ordre_number}</p>
                      )}
                      {selectedApproval.documents?.numero_autorisation && (
                        <p><span className="font-medium">N° autorisation:</span> {selectedApproval.documents.numero_autorisation}</p>
                      )}
                      {selectedApproval.documents?.numero_rccm && (
                        <p><span className="font-medium">N° RCCM:</span> {selectedApproval.documents.numero_rccm}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>Rejeter la demande</AlertDialogTitle>
              <AlertDialogDescription>
                Veuillez fournir une raison pour le rejet de cette demande.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea
              placeholder="Raison du rejet..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectReason("")}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
                Rejeter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SuperAdminLayoutSimple>
  );
}
