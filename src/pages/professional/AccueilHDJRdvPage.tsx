import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Filter, Search, Plus, Edit, UserCheck, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ModifierRDVModal } from '@/components/hospital/ModifierRDVModal';

interface Appointment {
  id: number;
  patient: string;
  time: string;
  service: string;
  status: 'confirmé' | 'arrivé' | 'en attente' | 'en cours' | 'terminé';
  phone: string;
  numeroCNAMGS?: string;
  motif?: string;
}

export default function AccueilHDJRdvPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [serviceFilter, setServiceFilter] = useState<string>('tous');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<{[key: number]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Données initiales
  const initialAppointments: Appointment[] = [
    { 
      id: 1, 
      patient: 'Jean DUPONT', 
      time: '09:00', 
      service: 'Consultation générale', 
      status: 'confirmé', 
      phone: '077123456',
      numeroCNAMGS: 'GA123456789',
      motif: 'Contrôle diabète'
    },
    { 
      id: 2, 
      patient: 'Marie NZÉ', 
      time: '09:30', 
      service: 'Cardiologie', 
      status: 'arrivé', 
      phone: '077234567',
      numeroCNAMGS: 'GA987654321',
      motif: 'Consultation cardiologique'
    },
    { 
      id: 3, 
      patient: 'Pierre MBELE', 
      time: '10:00', 
      service: 'Radiologie', 
      status: 'en attente', 
      phone: '077345678',
      numeroCNAMGS: 'GA456789123',
      motif: 'Radio thorax'
    },
    { 
      id: 4, 
      patient: 'Sophie OYONO', 
      time: '10:30', 
      service: 'Pédiatrie', 
      status: 'confirmé', 
      phone: '077456789',
      motif: 'Consultation pédiatrique'
    },
    { 
      id: 5, 
      patient: 'Paul OBIANG', 
      time: '11:00', 
      service: 'Gynécologie', 
      status: 'confirmé', 
      phone: '077567890',
      numeroCNAMGS: 'GA321654987',
      motif: 'Consultation gynécologique'
    }
  ];

  const services = ['Consultation générale', 'Cardiologie', 'Radiologie', 'Pédiatrie', 'Gynécologie', 'Laboratoire'];
  const statuses = ['confirmé', 'arrivé', 'en attente', 'en cours', 'terminé'];

  // Chargement initial des données
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simule un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAppointments(initialAppointments);
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des rendez-vous');
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Debounce pour la recherche (optimisation performance)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtrage des rendez-vous avec useMemo (optimisation)
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filtre par recherche (debounced)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.patient.toLowerCase().includes(query) ||
        apt.phone.includes(debouncedSearchQuery) ||
        apt.service.toLowerCase().includes(query) ||
        apt.numeroCNAMGS?.includes(debouncedSearchQuery)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'tous') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filtre par service
    if (serviceFilter !== 'tous') {
      filtered = filtered.filter(apt => apt.service === serviceFilter);
    }

    return filtered;
  }, [appointments, debouncedSearchQuery, statusFilter, serviceFilter]);

  // Gestionnaires d'événements avec useCallback (optimisation)
  const handleNouveauRDV = useCallback(() => {
    toast.info('Fonctionnalité "Nouveau RDV" sera implémentée prochainement');
    // TODO: Ouvrir modal de création de RDV
  }, []);

  const handleRechercher = useCallback(() => {
    if (!searchQuery.trim()) {
      toast.error('Veuillez saisir un terme de recherche');
      return;
    }
    
    toast.success(`${filteredAppointments.length} résultat(s) trouvé(s)`);
  }, [searchQuery, filteredAppointments.length]);

  const handleModifier = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModifierModal(true);
  }, []);

  const handleUpdateAppointment = useCallback((updatedAppointment: Appointment) => {
    // Mettre à jour le rendez-vous dans la liste
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );

    setSuccess(`Rendez-vous de ${updatedAppointment.patient} modifié avec succès`);
    setTimeout(() => setSuccess(null), 3000);
    
    // Fermer le modal
    setShowModifierModal(false);
    setSelectedAppointment(null);
  }, []);

  const handleEnregistrerArrivee = useCallback(async (appointment: Appointment) => {
    if (appointment.status === 'arrivé') {
      toast.info('Patient déjà enregistré comme arrivé');
      return;
    }

    const actionKey = `checkin_${appointment.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'checkin'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointment.id 
            ? {...apt, status: 'arrivé'} 
            : apt
        )
      );

      setSuccess(`${appointment.patient} enregistré comme arrivé`);
      toast.success(`${appointment.patient} enregistré comme arrivé`);
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'arrivée');
      toast.error('Erreur lors de l\'enregistrement de l\'arrivée');
    } finally {
      setLoadingActions(prev => {
        const newState = {...prev};
        delete newState[actionKey];
        return newState;
      });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(null), []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('tous');
    setServiceFilter('tous');
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'arrivé': return 'bg-green-500';
      case 'confirmé': return 'bg-blue-500';
      case 'en attente': return 'bg-yellow-500';
      case 'en cours': return 'bg-purple-500';
      case 'terminé': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: {[key: string]: string} = {
      'confirmé': 'Confirmé',
      'arrivé': 'Arrivé',
      'en attente': 'En attente',
      'en cours': 'En cours',
      'terminé': 'Terminé'
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <ProfessionalEstablishmentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Chargement des rendez-vous...</p>
          </div>
        </div>
      </ProfessionalEstablishmentLayout>
    );
  }

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Messages d'état */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="ghost" size="sm" onClick={clearError}>
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {success}
              <Button variant="ghost" size="sm" onClick={clearSuccess}>
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rendez-vous du jour</h1>
            <p className="text-muted-foreground">Gestion des rendez-vous de l'Hôpital du Jour</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleNouveauRDV}
              aria-label="Créer un nouveau rendez-vous"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau RDV
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher un rendez-vous</CardTitle>
            <CardDescription>
              {filteredAppointments.length} rendez-vous trouvés sur {appointments.length} au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Rechercher par nom, téléphone, service ou numéro CNAMGS..." 
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Rechercher un rendez-vous"
                    type="search"
                    autoComplete="off"
                  />
                </div>
                <Button 
                  onClick={handleRechercher}
                  aria-label="Lancer la recherche"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
              
              {/* Filtres rapides */}
              <div className="flex gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                  aria-label="Filtrer par statut"
                >
                  <option value="tous">Tous les statuts</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
                
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                  aria-label="Filtrer par service"
                >
                  <option value="tous">Tous les services</option>
                  {services.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetFilters}
                  aria-label="Réinitialiser tous les filtres"
                >
                  <Filter className="mr-2 h-3 w-3" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous programmés</CardTitle>
            <CardDescription>
              {filteredAppointments.length} rendez-vous affichés sur {appointments.length} au total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'tous' || serviceFilter !== 'tous' 
                    ? 'Aucun rendez-vous ne correspond aux critères de recherche'
                    : 'Aucun rendez-vous programmé pour aujourd\'hui'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="font-semibold text-sm">{apt.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{apt.patient}</span>
                          <Badge className={`${getStatusColor(apt.status)} text-white text-xs`}>
                            {getStatusLabel(apt.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {apt.service} • Tel: {apt.phone}
                          {apt.numeroCNAMGS && ` • CNAMGS: ${apt.numeroCNAMGS}`}
                        </div>
                        {apt.motif && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Motif: {apt.motif}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleModifier(apt)}
                        disabled={loadingActions[`modify_${apt.id}`] === 'modify'}
                        aria-label={`Modifier le rendez-vous de ${apt.patient}`}
                      >
                        {loadingActions[`modify_${apt.id}`] === 'modify' ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : (
                          <Edit className="mr-2 h-3 w-3" />
                        )}
                        Modifier
                      </Button>
                      <Button 
                        size="sm" 
                        variant={apt.status === 'arrivé' ? 'secondary' : 'default'}
                        onClick={() => handleEnregistrerArrivee(apt)}
                        disabled={loadingActions[`checkin_${apt.id}`] === 'checkin' || apt.status === 'arrivé'}
                        aria-label={`Enregistrer l'arrivée de ${apt.patient}`}
                      >
                        {loadingActions[`checkin_${apt.id}`] === 'checkin' ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : (
                          <UserCheck className="mr-2 h-3 w-3" />
                        )}
                        {apt.status === 'arrivé' ? 'Déjà arrivé' : 'Enregistrer arrivée'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de modification */}
        {selectedAppointment && (
          <ModifierRDVModal
            open={showModifierModal}
            onClose={() => {
              setShowModifierModal(false);
              setSelectedAppointment(null);
            }}
            appointment={selectedAppointment}
            onUpdate={handleUpdateAppointment}
          />
        )}
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
