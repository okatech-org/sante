import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Plus,
  Eye,
  MapPin,
  Phone,
  Calendar,
  Shield,
  ChevronRight,
  UserPlus,
  FileText,
  AlertCircle
} from 'lucide-react';

interface Invitation {
  id: string;
  establishment: {
    name: string;
    type: string;
    city: string;
    logo_url?: string;
  };
  role: string;
  position?: string;
  department?: string;
  message?: string;
  status: string;
  expires_at: string;
  created_at: string;
}

interface Request {
  id: string;
  establishment: {
    name: string;
    type: string;
    city: string;
  };
  requested_role: string;
  requested_department?: string;
  motivation?: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  review_notes?: string;
}

interface EstablishmentWithStaff {
  id: string;
  name: string;
  type: string;
  city: string;
  logo_url?: string;
  roles: Array<{
    role: string;
    department?: string;
    position?: string;
    is_admin: boolean;
    start_date: string;
  }>;
}

export default function EstablishmentsManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { establishments, refreshEstablishments } = useMultiEstablishment();
  
  const [activeTab, setActiveTab] = useState('my-establishments');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [myEstablishments, setMyEstablishments] = useState<EstablishmentWithStaff[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le formulaire de demande
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestForm, setRequestForm] = useState({
    establishment_id: '',
    establishment_name: '',
    requested_role: 'doctor',
    motivation: '',
    license_number: ''
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadMyEstablishments(),
        loadInvitations(),
        loadRequests()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyEstablishments = async () => {
    // Transformer les données du contexte
    const formattedEstablishments: EstablishmentWithStaff[] = establishments.map(staff => ({
      id: staff.establishmentId,
      name: staff.establishment.name,
      type: staff.establishment.type,
      city: staff.establishment.city || '',
      logo_url: staff.establishment.logoUrl,
      roles: [{
        role: staff.role,
        department: staff.department?.name,
        position: staff.position || '',
        is_admin: staff.isEstablishmentAdmin,
        start_date: new Date().toISOString()
      }]
    }));
    
    // Regrouper par établissement si plusieurs rôles
    const grouped = formattedEstablishments.reduce((acc, est) => {
      const existing = acc.find(e => e.id === est.id);
      if (existing) {
        existing.roles.push(...est.roles);
      } else {
        acc.push(est);
      }
      return acc;
    }, [] as EstablishmentWithStaff[]);
    
    setMyEstablishments(grouped);
  };

  const loadInvitations = async () => {
    const { data, error } = await supabase
      .from('establishment_invitations')
      .select(`
        *,
        establishments (
          name,
          type,
          city,
          logo_url
        )
      `)
      .eq('invited_email', user?.email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInvitations(data.map(inv => ({
        id: inv.id,
        establishment: inv.establishments,
        role: inv.role,
        position: inv.position,
        department: inv.department_id,
        message: inv.message,
        status: inv.status,
        expires_at: inv.expires_at,
        created_at: inv.created_at
      })));
    }
  };

  const loadRequests = async () => {
    const { data: professional } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user?.id)
      .single();

    if (professional) {
      const { data, error } = await supabase
        .from('establishment_requests')
        .select(`
          *,
          establishments (
            name,
            type,
            city
          )
        `)
        .eq('professional_id', professional.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRequests(data.map(req => ({
          id: req.id,
          establishment: req.establishments,
          requested_role: req.requested_role,
          requested_department: req.requested_department_id,
          motivation: req.motivation,
          status: req.status,
          created_at: req.created_at,
          reviewed_at: req.reviewed_at,
          review_notes: req.review_notes
        })));
      }
    }
  };

  const acceptInvitation = async (invitationId: string, token: string) => {
    try {
      const { error } = await supabase.rpc('accept_establishment_invitation', {
        p_token: token,
        p_user_id: user?.id
      });

      if (error) throw error;

      toast.success('Invitation acceptée avec succès');
      await refreshEstablishments();
      await loadData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible d\'accepter l\'invitation');
    }
  };

  const rejectInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('establishment_invitations')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast.success('Invitation déclinée');
      await loadInvitations();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de décliner l\'invitation');
    }
  };

  const submitRequest = async () => {
    try {
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!professional) {
        toast.error('Profil professionnel non trouvé');
        return;
      }

      const { error } = await supabase
        .from('establishment_requests')
        .insert({
          professional_id: professional.id,
          establishment_id: requestForm.establishment_id,
          requested_role: requestForm.requested_role,
          motivation: requestForm.motivation,
          license_number: requestForm.license_number
        });

      if (error) throw error;

      toast.success('Demande envoyée avec succès');
      setShowRequestDialog(false);
      setRequestForm({
        establishment_id: '',
        establishment_name: '',
        requested_role: 'doctor',
        motivation: '',
        license_number: ''
      });
      await loadRequests();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible d\'envoyer la demande');
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'director': 'Directeur',
      'admin': 'Administrateur',
      'doctor': 'Médecin',
      'nurse': 'Infirmier(e)',
      'pharmacist': 'Pharmacien(ne)',
      'laborantin': 'Laborantin(e)',
      'receptionist': 'Réceptionniste'
    };
    return labels[role] || role;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'accepted':
      case 'approved':
        return <Badge variant="default">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestion des Établissements</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos affiliations, invitations et demandes
            </p>
          </div>
          
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Demande d'affiliation</DialogTitle>
                <DialogDescription>
                  Envoyez une demande pour rejoindre un établissement
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="establishment">Établissement</Label>
                  <Input
                    id="establishment"
                    placeholder="Nom de l'établissement"
                    value={requestForm.establishment_name}
                    onChange={(e) => setRequestForm({...requestForm, establishment_name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle souhaité</Label>
                  <select
                    id="role"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={requestForm.requested_role}
                    onChange={(e) => setRequestForm({...requestForm, requested_role: e.target.value})}
                  >
                    <option value="doctor">Médecin</option>
                    <option value="nurse">Infirmier(e)</option>
                    <option value="pharmacist">Pharmacien(ne)</option>
                    <option value="laborantin">Laborantin(e)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license">Numéro de licence</Label>
                  <Input
                    id="license"
                    placeholder="Votre numéro de licence professionnelle"
                    value={requestForm.license_number}
                    onChange={(e) => setRequestForm({...requestForm, license_number: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivation</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Expliquez pourquoi vous souhaitez rejoindre cet établissement..."
                    value={requestForm.motivation}
                    onChange={(e) => setRequestForm({...requestForm, motivation: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={submitRequest}>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la demande
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="my-establishments">
              Mes Établissements ({myEstablishments.length})
            </TabsTrigger>
            <TabsTrigger value="invitations">
              Invitations ({invitations.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Demandes ({requests.length})
            </TabsTrigger>
          </TabsList>

          {/* Mes Établissements */}
          <TabsContent value="my-establishments">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myEstablishments.map((establishment) => (
                <Card key={establishment.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {establishment.logo_url ? (
                        <img 
                          src={establishment.logo_url} 
                          alt={establishment.name}
                          className="w-12 h-12 rounded-lg object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{establishment.name}</h3>
                        <p className="text-xs text-muted-foreground">{establishment.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {establishment.city && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{establishment.city}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {establishment.roles.map((role, idx) => (
                        <Badge key={idx} variant={role.is_admin ? 'default' : 'secondary'}>
                          {getRoleLabel(role.role)}
                          {role.department && ` - ${role.department}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/professional/select-establishment')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                </Card>
              ))}
              
              {myEstablishments.length === 0 && (
                <Card className="col-span-full p-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucun établissement</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous n'êtes affilié à aucun établissement pour le moment
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Invitations */}
          <TabsContent value="invitations">
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{invitation.establishment.name}</h3>
                          {getStatusBadge(invitation.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          Vous êtes invité(e) en tant que <strong>{getRoleLabel(invitation.role)}</strong>
                          {invitation.position && ` - ${invitation.position}`}
                        </p>
                        
                        {invitation.message && (
                          <div className="p-3 rounded-lg bg-muted/50 mb-3">
                            <p className="text-sm">{invitation.message}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Expire le {new Date(invitation.expires_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Reçue le {new Date(invitation.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectInvitation(invitation.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Décliner
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => acceptInvitation(invitation.id, invitation.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accepter
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {invitations.length === 0 && (
                <Card className="p-12 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucune invitation</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous n'avez pas d'invitation en attente
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="requests">
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{request.establishment.name}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          Demande pour le rôle de <strong>{getRoleLabel(request.requested_role)}</strong>
                        </p>
                        
                        {request.motivation && (
                          <div className="p-3 rounded-lg bg-muted/50 mb-3">
                            <p className="text-sm">{request.motivation}</p>
                          </div>
                        )}
                        
                        {request.status === 'rejected' && request.review_notes && (
                          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Motif du refus</span>
                            </div>
                            <p className="text-sm">{request.review_notes}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Envoyée le {new Date(request.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          {request.reviewed_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Traitée le {new Date(request.reviewed_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <Button variant="ghost" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              
              {requests.length === 0 && (
                <Card className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vous n'avez pas de demande d'affiliation
                  </p>
                  <Button onClick={() => setShowRequestDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Faire une demande
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
