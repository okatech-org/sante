import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, CheckCircle, XCircle, Clock, Mail,
  Send, User, Stethoscope, AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AdmissionRequest {
  request_id: string;
  request_type: string;
  professional_id: string;
  professional_name: string;
  professional_email: string;
  professional_phone: string;
  professional_type: string;
  specialization: string;
  requested_role: string;
  department: string;
  job_position: string;
  message: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export default function ManageAdmissions() {
  const { currentEstablishment } = useMultiEstablishment();
  const [requests, setRequests] = useState<AdmissionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form invitation
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('doctor');
  const [inviteDepartment, setInviteDepartment] = useState('');
  const [invitePosition, setInvitePosition] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (currentEstablishment) {
      loadRequests();
    }
  }, [currentEstablishment]);

  const loadRequests = async () => {
    if (!currentEstablishment) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .rpc('get_establishment_admission_requests', {
        p_establishment_id: currentEstablishment.establishment_id
      });
    
    if (!error && data) {
      setRequests(data);
    }
    setIsLoading(false);
  };

  const handleApprove = async (requestId: string, professionalName: string) => {
    try {
      const { error } = await supabase.rpc('approve_admission_request', {
        p_request_id: requestId,
        p_matricule: null
      });

      if (error) throw error;

      toast.success('Demande approuvée !', {
        description: `${professionalName} a été ajouté à l'établissement`
      });
      
      loadRequests();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message
      });
    }
  };

  const handleReject = async (requestId: string, reason?: string) => {
    try {
      const { error } = await supabase.rpc('reject_admission_request', {
        p_request_id: requestId,
        p_rejection_reason: reason || 'Non spécifiée'
      });

      if (error) throw error;

      toast.success('Demande rejetée');
      loadRequests();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message
      });
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Veuillez entrer un email');
      return;
    }

    if (!currentEstablishment) {
      toast.error('Établissement non sélectionné');
      return;
    }

    setIsInviting(true);

    try {
      const { data, error } = await supabase.rpc('invite_professional_to_establishment', {
        p_professional_email: inviteEmail,
        p_establishment_id: currentEstablishment.establishment_id,
        p_requested_role: inviteRole,
        p_department: inviteDepartment || null,
        p_job_position: invitePosition || null,
        p_message: inviteMessage || null
      });

      if (error) throw error;

      toast.success('Invitation envoyée !', {
        description: `Une invitation a été envoyée à ${inviteEmail}`
      });

      setInviteEmail('');
      setInviteRole('doctor');
      setInviteDepartment('');
      setInvitePosition('');
      setInviteMessage('');
      
      loadRequests();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message
      });
    } finally {
      setIsInviting(false);
    }
  };

  const roleLabels: Record<string, string> = {
    doctor: 'Médecin',
    nurse: 'Infirmier(e)',
    pharmacist: 'Pharmacien(ne)',
    laborantin: 'Laborantin(e)',
    receptionist: 'Réceptionniste',
    admin: 'Administrateur',
    director: 'Directeur'
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'En attente', variant: 'default' as const, icon: Clock },
      approved: { label: 'Approuvée', variant: 'secondary' as const, icon: CheckCircle },
      rejected: { label: 'Rejetée', variant: 'destructive' as const, icon: XCircle }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const professionalRequests = pendingRequests.filter(r => r.request_type === 'professional_to_establishment');
  const establishmentInvitations = pendingRequests.filter(r => r.request_type === 'establishment_to_professional');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            Gestion des Admissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les demandes et invitations pour {currentEstablishment?.establishment_name}
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Inviter un professionnel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inviter un professionnel</DialogTitle>
              <DialogDescription>
                Envoyez une invitation à un professionnel de santé
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">Email du professionnel *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="invite-role">Rôle proposé *</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Médecin</SelectItem>
                    <SelectItem value="nurse">Infirmier(e)</SelectItem>
                    <SelectItem value="pharmacist">Pharmacien(ne)</SelectItem>
                    <SelectItem value="laborantin">Laborantin(e)</SelectItem>
                    <SelectItem value="receptionist">Réceptionniste</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="invite-dept">Département</Label>
                <Input
                  id="invite-dept"
                  placeholder="Ex: Médecine Générale"
                  value={inviteDepartment}
                  onChange={(e) => setInviteDepartment(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="invite-pos">Poste</Label>
                <Input
                  id="invite-pos"
                  placeholder="Ex: Médecin Généraliste"
                  value={invitePosition}
                  onChange={(e) => setInvitePosition(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="invite-msg">Message d'invitation</Label>
                <Textarea
                  id="invite-msg"
                  placeholder="Message personnalisé..."
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                />
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleInvite}
                disabled={isInviting}
              >
                {isInviting ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer l'invitation
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Demandes reçues</p>
              <p className="text-2xl font-bold">{professionalRequests.length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Invitations envoyées</p>
              <p className="text-2xl font-bold">{establishmentInvitations.length}</p>
            </div>
            <Send className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total en attente</p>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">Demandes reçues ({professionalRequests.length})</TabsTrigger>
          <TabsTrigger value="sent">Invitations envoyées ({establishmentInvitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {professionalRequests.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande en attente</h3>
                <p className="text-muted-foreground">
                  Les professionnels peuvent demander à rejoindre votre établissement
                </p>
              </div>
            </Card>
          ) : (
            professionalRequests.map((request) => (
              <Card key={request.request_id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-7 w-7 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{request.professional_name}</h3>
                        <Badge variant="outline">{request.professional_type}</Badge>
                        {request.specialization && (
                          <Badge variant="secondary">{request.specialization}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground mb-1">Rôle demandé</p>
                          <p className="font-medium">{roleLabels[request.requested_role]}</p>
                        </div>
                        {request.department && (
                          <div>
                            <p className="text-muted-foreground mb-1">Département souhaité</p>
                            <p className="font-medium">{request.department}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground mb-1">Email</p>
                          <p className="font-medium flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {request.professional_email}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Date demande</p>
                          <p className="font-medium">
                            {new Date(request.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Message:</p>
                          <p className="text-sm text-muted-foreground">{request.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleReject(request.request_id)}
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeter
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => handleApprove(request.request_id, request.professional_name)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approuver
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {establishmentInvitations.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune invitation en attente</h3>
                <p className="text-muted-foreground">
                  Invitez des professionnels à rejoindre votre établissement
                </p>
              </div>
            </Card>
          ) : (
            establishmentInvitations.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              const StatusIcon = statusBadge.icon;

              return (
                <Card key={request.request_id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-7 w-7 text-primary" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{request.professional_name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{roleLabels[request.requested_role]}</Badge>
                          <Badge variant={statusBadge.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Envoyée le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
