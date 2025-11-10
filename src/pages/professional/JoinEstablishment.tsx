import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Building2,
  Search,
  MapPin,
  Send,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Map as MapIcon,
  List
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EstablishmentsMap from '@/components/maps/EstablishmentsMap';

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: string;
  ville: string;
  province: string;
}

interface StaffRequest {
  id: string;
  establishment_id: string;
  status: string;
  requested_role: string;
  request_message: string;
  created_at: string;
  rejection_reason?: string;
  establishments?: {
    raison_sociale: string;
    ville: string;
  };
}

export default function JoinEstablishment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [myRequests, setMyRequests] = useState<StaffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [requestRole, setRequestRole] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Charger le professional_id de l'utilisateur et pré-charger les établissements
  useEffect(() => {
    loadProfessionalId();
    loadMyRequests();
    getUserLocation();
    loadNearbyEstablishments();
  }, [user]);

  const loadProfessionalId = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Erreur chargement professional_id:', error);
      toast.error('Impossible de charger votre profil professionnel');
      return;
    }

    setProfessionalId(data.id);
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Géolocalisation non disponible:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadNearbyEstablishments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('id, raison_sociale, type_etablissement, ville, province, latitude, longitude')
        .limit(50);

      if (error) {
        console.error('Erreur chargement établissements:', error);
        return;
      }

      let sortedData = data || [];

      // Trier par proximité si géolocalisation disponible
      if (userLocation && sortedData.length > 0) {
        sortedData = sortedData
          .map(est => ({
            ...est,
            distance: est.latitude && est.longitude
              ? calculateDistance(userLocation.lat, userLocation.lon, est.latitude, est.longitude)
              : Infinity
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 20);
      } else {
        sortedData = sortedData.slice(0, 20);
      }

      setEstablishments(sortedData);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyRequests = async () => {
    if (!user?.id) return;

    setIsLoadingRequests(true);
    try {
      // Charger le professional_id
      const { data: profData, error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profError || !profData) {
        setIsLoadingRequests(false);
        return;
      }

      // Charger les demandes
      const { data, error } = await supabase
        .from('establishment_staff_requests')
        .select(`
          id,
          establishment_id,
          status,
          requested_role,
          request_message,
          created_at,
          rejection_reason,
          establishments (
            raison_sociale,
            ville
          )
        `)
        .eq('professional_id', profData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement demandes:', error);
        toast.error('Impossible de charger vos demandes');
        return;
      }

      setMyRequests(data || []);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const searchEstablishments = async () => {
    if (!searchTerm.trim()) {
      loadNearbyEstablishments();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('id, raison_sociale, type_etablissement, ville, province, latitude, longitude')
        .or(`raison_sociale.ilike.%${searchTerm}%,ville.ilike.%${searchTerm}%,province.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) {
        console.error('Erreur recherche:', error);
        toast.error('Erreur lors de la recherche');
        return;
      }

      setEstablishments(data || []);
      
      if (!data || data.length === 0) {
        toast.info('Aucun établissement trouvé');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedEstablishment || !requestRole || !professionalId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('establishment_staff_requests')
        .insert({
          establishment_id: selectedEstablishment.id,
          professional_id: professionalId,
          requested_role: requestRole,
          request_message: requestMessage,
          status: 'pending'
        });

      if (error) {
        console.error('Erreur envoi demande:', error);
        toast.error('Impossible d\'envoyer la demande');
        return;
      }

      toast.success('Demande envoyée avec succès');
      setSelectedEstablishment(null);
      setRequestRole('');
      setRequestMessage('');
      loadMyRequests();
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> En attente</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" /> Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Refusée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'doctor': 'Médecin',
      'nurse': 'Infirmier(e)',
      'pharmacist': 'Pharmacien(ne)',
      'laborantin': 'Laborantin(e)',
      'receptionist': 'Réceptionniste',
      'consultant': 'Consultant',
      'admin': 'Administrateur'
    };
    return labels[role] || role;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/professional/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au dashboard
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Rejoindre un établissement</h1>
            <p className="text-muted-foreground">
              Recherchez et envoyez une demande d'affiliation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recherche d'établissements avec vue Liste/Carte */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher un établissement
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Nom, ville ou province</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="search"
                  placeholder="Ex: CHU Libreville, Pharmacie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchEstablishments()}
                />
                <Button onClick={searchEstablishments} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {userLocation && establishments.length > 0 && !searchTerm && (
                <p className="text-xs text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Établissements triés par proximité
                </p>
              )}
            </div>

            {/* Tabs Liste / Carte */}
            {establishments.length > 0 && (
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Liste
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapIcon className="h-4 w-4" />
                    Carte
                  </TabsTrigger>
                </TabsList>

                {/* Vue Liste */}
                <TabsContent value="list" className="space-y-2 max-h-96 overflow-y-auto mt-4">
                  {establishments.map((est) => (
                    <Card
                      key={est.id}
                      className="p-4 hover:border-primary cursor-pointer transition-colors"
                      onClick={() => setSelectedEstablishment(est)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{est.raison_sociale}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{est.ville}, {est.province}</span>
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {est.type_etablissement}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          Sélectionner
                        </Button>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Vue Carte */}
                <TabsContent value="map" className="mt-4">
                  <EstablishmentsMap
                    establishments={establishments}
                    onEstablishmentClick={(est) => setSelectedEstablishment(est)}
                    selectedEstablishmentId={selectedEstablishment?.id}
                    height="400px"
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </Card>

        {/* Mes demandes en cours */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Mes demandes
          </h2>

          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myRequests.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {myRequests.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {request.establishments?.raison_sociale}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {request.establishments?.ville}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Rôle demandé:</strong> {getRoleLabel(request.requested_role)}
                    </p>
                    {request.request_message && (
                      <p className="text-muted-foreground text-xs">
                        {request.request_message}
                      </p>
                    )}
                    {request.rejection_reason && (
                      <p className="text-red-600 text-xs mt-2">
                        <strong>Raison du refus:</strong> {request.rejection_reason}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune demande en cours</p>
            </div>
          )}
        </Card>
      </div>

      {/* Dialog de demande */}
      <Dialog open={!!selectedEstablishment} onOpenChange={(open) => !open && setSelectedEstablishment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demande d'affiliation</DialogTitle>
            <DialogDescription>
              {selectedEstablishment?.raison_sociale}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Rôle demandé *</Label>
              <Select value={requestRole} onValueChange={setRequestRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Médecin</SelectItem>
                  <SelectItem value="nurse">Infirmier(e)</SelectItem>
                  <SelectItem value="pharmacist">Pharmacien(ne)</SelectItem>
                  <SelectItem value="laborantin">Laborantin(e)</SelectItem>
                  <SelectItem value="receptionist">Réceptionniste</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Présentez brièvement votre demande..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEstablishment(null)}>
              Annuler
            </Button>
            <Button onClick={handleSendRequest} disabled={isLoading || !requestRole}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
