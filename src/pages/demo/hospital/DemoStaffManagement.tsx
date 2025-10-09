import { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, Edit, Trash2, UserPlus,
  CheckCircle, XCircle, AlertCircle, Eye, Shield, Building2, Calendar, Clock, 
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { HospitalDashboardLayout } from '@/components/layout/HospitalDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  role: string;
  isAdmin: boolean;
  status: string;
  schedule: any;
  startDate: string;
  permissions: string[];
  professionalId: string;
}

interface PendingRequest {
  id: string;
  name: string;
  email: string;
  profession: string;
  requestedRole: string;
  requestDate: string;
  requestMessage?: string;
  professionalId: string;
}

export default function DemoStaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [establishment, setEstablishment] = useState<any>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const { toast } = useToast();

  // Formulaire pour ajouter du personnel
  const [newStaffForm, setNewStaffForm] = useState({
    professionalEmail: '',
    newProfessionalName: '',
    newProfessionalEmail: '',
    professionType: '',
    specialty: '',
    roleInEstablishment: '',
    isAdmin: false,
    schedule: '',
    permissions: [] as string[]
  });

  // Obtenir les dates de la semaine actuelle
  const getWeekDates = (offset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + (offset * 7);
    const monday = new Date(today.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeekOffset);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Charger les données au montage
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Récupérer l'établissement CHU OWENDO
      const { data: establishmentData, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .ilike('raison_sociale', '%OWENDO%')
        .single();

      if (estError) throw estError;
      setEstablishment(establishmentData);

      if (!establishmentData) {
        toast({
          title: "Erreur",
          description: "Établissement non trouvé",
          variant: "destructive"
        });
        return;
      }

      // Récupérer le personnel de l'établissement
      const { data: staffData, error: staffError } = await supabase
        .from('establishment_staff')
        .select(`
          *,
          professionals (
            id,
            full_name,
            email,
            phone,
            professional_type,
            numero_ordre
          )
        `)
        .eq('establishment_id', establishmentData.id)
        .eq('status', 'active');

      if (staffError) throw staffError;

      const formattedStaff: StaffMember[] = (staffData || []).map((staff: any) => ({
        id: staff.id,
        name: staff.professionals?.full_name || 'N/A',
        email: staff.professionals?.email || '',
        phone: staff.professionals?.phone || '',
        profession: staff.professionals?.professional_type || '',
        role: staff.role_in_establishment,
        isAdmin: staff.is_admin,
        status: staff.status,
        schedule: staff.schedule,
        startDate: staff.start_date,
        permissions: staff.permissions || [],
        professionalId: staff.professional_id
      }));

      setStaffMembers(formattedStaff);

      // Récupérer les demandes en attente
      const { data: requestsData, error: requestsError } = await supabase
        .from('establishment_staff_requests')
        .select(`
          *,
          professionals (
            id,
            full_name,
            email,
            professional_type
          )
        `)
        .eq('establishment_id', establishmentData.id)
        .eq('status', 'pending');

      if (requestsError) throw requestsError;

      const formattedRequests: PendingRequest[] = (requestsData || []).map((req: any) => ({
        id: req.id,
        name: req.professionals?.full_name || 'N/A',
        email: req.professionals?.email || '',
        profession: req.professionals?.professional_type || '',
        requestedRole: req.requested_role,
        requestDate: req.created_at,
        requestMessage: req.request_message,
        professionalId: req.professional_id
      }));

      setPendingRequests(formattedRequests);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string, professionalId: string, requestedRole: string) => {
    try {
      setProcessingRequest(requestId);

      // Créer l'entrée dans establishment_staff
      const { error: insertError } = await supabase
        .from('establishment_staff')
        .insert({
          establishment_id: establishment.id,
          professional_id: professionalId,
          role_in_establishment: requestedRole,
          is_admin: false,
          status: 'active',
          permissions: ['consultations', 'dmp_read']
        });

      if (insertError) throw insertError;

      // Mettre à jour le statut de la demande
      const { data: { user } } = await supabase.auth.getUser();
      const { error: updateError } = await supabase
        .from('establishment_staff_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Demande approuvée",
        description: "Le professionnel a été ajouté au personnel"
      });

      // Rafraîchir les données
      fetchData();

    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver la demande",
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setProcessingRequest(requestId);

      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('establishment_staff_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          rejection_reason: 'Demande refusée par l\'administrateur'
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Demande refusée",
        description: "La demande a été rejetée"
      });

      fetchData();

    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de refuser la demande",
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre du personnel ?')) return;

    try {
      const { error } = await supabase
        .from('establishment_staff')
        .update({ status: 'inactive' })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Membre retiré",
        description: "Le membre a été retiré du personnel"
      });

      fetchData();

    } catch (error: any) {
      console.error('Error removing staff:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer le membre",
        variant: "destructive"
      });
    }
  };

  const permissionsList = {
    medical: [
      { id: 'consultations', label: 'Consultations', description: 'Effectuer des consultations' },
      { id: 'prescriptions', label: 'Prescriptions', description: 'Prescrire médicaments et examens' },
      { id: 'dmp_read', label: 'Lecture DMP', description: 'Consulter dossiers médicaux' },
      { id: 'dmp_write', label: 'Écriture DMP', description: 'Modifier dossiers médicaux' },
      { id: 'surgery', label: 'Chirurgie', description: 'Accès bloc opératoire' },
      { id: 'all_medical', label: 'Tout Médical', description: 'Accès complet médical' }
    ],
    administrative: [
      { id: 'admission', label: 'Admission', description: 'Enregistrer patients' },
      { id: 'billing', label: 'Facturation', description: 'Gérer factures' },
      { id: 'staff_manage', label: 'Gestion Staff', description: 'Ajouter/modifier personnel' },
      { id: 'planning', label: 'Planning', description: 'Gérer plannings' },
      { id: 'equipment', label: 'Équipements', description: 'Gérer matériel médical' }
    ],
    nursing: [
      { id: 'nursing', label: 'Soins Infirmiers', description: 'Prodiguer soins' },
      { id: 'medication', label: 'Médication', description: 'Administrer médicaments' },
      { id: 'patient_care', label: 'Suivi Patient', description: 'Surveillance patients' }
    ]
  };

  if (loading) {
    return (
      <HospitalDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </HospitalDashboardLayout>
    );
  }

  if (!establishment) {
    return (
      <HospitalDashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Établissement non trouvé</p>
        </div>
      </HospitalDashboardLayout>
    );
  }

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* En-tête établissement */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{establishment.raison_sociale}</h1>
                  <p className="text-sm text-muted-foreground">{establishment.ville}, {establishment.province}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                {establishment.statut === 'actif' ? 'Actif' : establishment.statut}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="staff" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="staff" className="gap-2">
              <Users className="h-4 w-4" />
              Personnel ({staffMembers.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Demandes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Planning
            </TabsTrigger>
          </TabsList>

          {/* Onglet Personnel */}
          <TabsContent value="staff" className="space-y-4">
            {/* Barre de recherche et actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un membre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setShowAddModal(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Ajouter Personnel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste du personnel */}
            {staffMembers.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Aucun membre du personnel. Cliquez sur "Ajouter Personnel" pour commencer.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {staffMembers
                  .filter(member => 
                    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.profession.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(member => (
                  <Card key={member.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>

                        {/* Informations */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold">{member.name}</h3>
                            {member.isAdmin && (
                              <Badge variant="destructive" className="text-xs">
                                ADMIN
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                              Actif
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-y-2 text-sm mb-3">
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Profession:</span> {member.profession}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Rôle:</span> {member.role}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Email:</span> {member.email}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Téléphone:</span> {member.phone || 'N/A'}
                            </p>
                          </div>

                          {/* Permissions */}
                          {member.permissions.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Permissions:</p>
                              <div className="flex flex-wrap gap-1">
                                {member.permissions.map((perm, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {perm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" title="Voir détails">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Modifier">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveStaff(member.id)}
                            title="Retirer"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Demandes */}
          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm">
                  <strong>ℹ️ Demandes d&apos;accès:</strong> Les professionnels peuvent demander à rejoindre 
                  votre établissement. Validez leur profil et assignez-leur un rôle.
                </p>
              </CardContent>
            </Card>

            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Aucune demande en attente
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold shrink-0">
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">{request.name}</h3>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Profession:</span> {request.profession}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Rôle souhaité:</span> {request.requestedRole}
                          </p>
                          {request.requestMessage && (
                            <p className="text-sm mt-2 text-muted-foreground italic">
                              &quot;{request.requestMessage}&quot;
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Demande reçue le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          className="gap-2 bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20"
                          onClick={() => handleApproveRequest(request.id, request.professionalId, request.requestedRole)}
                          disabled={processingRequest === request.id}
                        >
                          {processingRequest === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approuver
                        </Button>
                        <Button 
                          variant="outline" 
                          className="gap-2 bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20"
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={processingRequest === request.id}
                        >
                          {processingRequest === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Onglet Permissions */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(permissionsList).map(([category, perms]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3 capitalize">{category}</h4>
                    <div className="space-y-2">
                      {perms.map(perm => (
                        <div key={perm.id} className="flex items-start gap-3 p-2 hover:bg-muted rounded">
                          <div className="pt-1">
                            <Badge variant="secondary" className="text-xs">{perm.id}</Badge>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{perm.label}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Planning */}
          <TabsContent value="schedule" className="space-y-4">
            <Card className="bg-yellow-500/5 border-yellow-500/20">
              <CardContent className="pt-6">
                <p className="text-sm">
                  <strong>ℹ️ Planning:</strong> La fonctionnalité de planning sera disponible prochainement. 
                  Vous pourrez définir les horaires de travail de chaque membre du personnel.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Ajout Personnel */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un Membre du Personnel</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4">
                  <p className="text-sm">
                    <strong>ℹ️ Information:</strong> Cette fonctionnalité sera bientôt disponible pour rechercher 
                    et ajouter des professionnels existants à votre établissement.
                  </p>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </HospitalDashboardLayout>
  );
}
