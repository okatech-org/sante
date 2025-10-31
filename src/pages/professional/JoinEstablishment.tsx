import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, Search, MapPin, Phone, Mail, 
  Send, CheckCircle, Clock, XCircle, ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Establishment {
  id: string;
  name: string;
  type: string;
  city: string;
  region: string;
  address: string;
  phone: string;
  email: string;
}

interface AdmissionRequest {
  request_id: string;
  establishment_name: string;
  establishment_type: string;
  establishment_city: string;
  requested_role: string;
  status: string;
  created_at: string;
  expires_at: string;
  rejection_reason: string | null;
}

export default function JoinEstablishment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [myRequests, setMyRequests] = useState<AdmissionRequest[]>([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form data
  const [requestedRole, setRequestedRole] = useState('doctor');
  const [department, setDepartment] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    // Charger les établissements disponibles
    const { data: estData, error: estError } = await supabase
      .from('establishments')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('name');
    
    if (!estError && estData) {
      setEstablishments(estData);
    }
    
    // Charger mes demandes
    const { data: reqData, error: reqError } = await supabase
      .rpc('get_my_admission_requests');
    
    if (!reqError && reqData) {
      setMyRequests(reqData);
    }
    
    setIsLoading(false);
  };

  const handleSubmitRequest = async () => {
    if (!selectedEstablishment) {
      toast.error('Veuillez sélectionner un établissement');
      return;
    }

    if (!requestedRole) {
      toast.error('Veuillez sélectionner un rôle');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.rpc('create_admission_request', {
        p_establishment_id: selectedEstablishment.id,
        p_requested_role: requestedRole,
        p_department: department || null,
        p_job_position: jobPosition || null,
        p_message: message || null
      });

      if (error) throw error;

      toast.success('Demande envoyée !', {
        description: `Votre demande a été envoyée à ${selectedEstablishment.name}`
      });

      setSelectedEstablishment(null);
      setRequestedRole('doctor');
      setDepartment('');
      setJobPosition('');
      setMessage('');
      
      loadData();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Impossible d\'envoyer la demande'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc('cancel_admission_request', {
        p_request_id: requestId
      });

      if (error) throw error;

      toast.success('Demande annulée');
      loadData();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message
      });
    }
  };

  const filteredEstablishments = establishments.filter(est =>
    est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'En attente', variant: 'default' as const, icon: Clock },
      approved: { label: 'Approuvée', variant: 'secondary' as const, icon: CheckCircle },
      rejected: { label: 'Rejetée', variant: 'destructive' as const, icon: XCircle },
      cancelled: { label: 'Annulée', variant: 'outline' as const, icon: XCircle }
    };
    return badges[status as keyof typeof badges] || badges.pending;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Rejoindre un Établissement
          </h1>
          <p className="text-muted-foreground mt-1">
            Demandez à rejoindre un établissement de santé
          </p>
        </div>
      </div>

      {/* Mes demandes en cours */}
      {myRequests.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mes demandes</h3>
          <div className="space-y-3">
            {myRequests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={request.request_id}
                  className="p-4 bg-muted/50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{request.establishment_name}</h4>
                      <Badge variant={statusBadge.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                      {request.request_type === 'establishment_to_professional' && (
                        <Badge variant="outline">Invitation reçue</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Poste: {roleLabels[request.requested_role]} {request.department && `- ${request.department}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Créée le {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {request.rejection_reason && (
                      <p className="text-sm text-red-600 mt-2">
                        Raison du rejet: {request.rejection_reason}
                      </p>
                    )}
                  </div>
                  
                  {request.status === 'pending' && request.request_type === 'professional_to_establishment' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancelRequest(request.request_id)}
                    >
                      Annuler
                    </Button>
                  )}
                  
                  {request.status === 'pending' && request.request_type === 'establishment_to_professional' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={async () => {
                          try {
                            const { error } = await supabase.rpc('approve_admission_request', {
                              p_request_id: request.request_id
                            });
                            if (error) throw error;
                            toast.success('Invitation acceptée !');
                            loadData();
                            setTimeout(() => navigate('/professional'), 1000);
                          } catch (error: any) {
                            toast.error('Erreur', { description: error.message });
                          }
                        }}
                      >
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelRequest(request.request_id)}
                      >
                        Refuser
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Formulaire de demande */}
      {selectedEstablishment && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Demande d'admission</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEstablishment(null)}
            >
              Annuler
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Établissement</Label>
              <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold">{selectedEstablishment.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedEstablishment.type} - {selectedEstablishment.city}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="role">Rôle souhaité *</Label>
              <Select value={requestedRole} onValueChange={setRequestedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Médecin</SelectItem>
                  <SelectItem value="nurse">Infirmier(e)</SelectItem>
                  <SelectItem value="pharmacist">Pharmacien(ne)</SelectItem>
                  <SelectItem value="laborantin">Laborantin(e)</SelectItem>
                  <SelectItem value="receptionist">Réceptionniste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department">Département souhaité</Label>
              <Input
                id="department"
                placeholder="Ex: Médecine Générale"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="position">Poste souhaité</Label>
              <Input
                id="position"
                placeholder="Ex: Médecin Généraliste"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="message">Message de motivation</Label>
              <Textarea
                id="message"
                placeholder="Présentez-vous et expliquez votre motivation..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleSubmitRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Envoi en cours...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Liste des établissements */}
      {!selectedEstablishment && (
        <>
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un établissement par nom, ville ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEstablishments.map((est) => {
              const hasPendingRequest = myRequests.some(
                r => r.establishment_id === est.id && r.status === 'pending'
              );

              return (
                <Card key={est.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{est.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{est.type}</Badge>
                        <Badge variant="secondary">
                          <MapPin className="h-3 w-3 mr-1" />
                          {est.city}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground mb-4">
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {est.address}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {est.phone}
                        </p>
                      </div>
                      
                      {hasPendingRequest ? (
                        <Badge variant="default" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Demande en attente
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSelectedEstablishment(est)}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Demander à rejoindre
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredEstablishments.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun établissement trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun établissement ne correspond à votre recherche
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
