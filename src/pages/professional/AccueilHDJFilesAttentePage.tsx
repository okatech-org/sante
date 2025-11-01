import { useState, useEffect } from 'react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Activity, TrendingUp, Bell, ArrowRight, History, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AppelPatientModal } from '@/components/hospital/AppelPatientModal';
import { TransfertPatientModal } from '@/components/hospital/TransfertPatientModal';
import { HistoriqueFileModal } from '@/components/hospital/HistoriqueFileModal';

interface QueueItem {
  service: string;
  icon: any;
  patients: number;
  avgWait: string;
  nextPatient: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  patientQueue: Array<{
    id: string;
    name: string;
    arrivalTime: string;
    waitTime: number;
    status: 'waiting' | 'called' | 'in_service';
  }>;
}

export default function AccueilHDJFilesAttentePage() {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // États des modals
  const [showAppelModal, setShowAppelModal] = useState(false);
  const [showTransfertModal, setShowTransfertModal] = useState(false);
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Données initiales
  const initialQueues: QueueItem[] = [
    {
      service: 'Consultation Générale',
      icon: Users,
      patients: 12,
      avgWait: '25 min',
      nextPatient: 'Jean DUPONT',
      trend: 'up',
      color: 'blue',
      patientQueue: [
        { id: '1', name: 'Jean DUPONT', arrivalTime: '08:30', waitTime: 45, status: 'waiting' },
        { id: '2', name: 'Marie NZÉ', arrivalTime: '08:45', waitTime: 30, status: 'waiting' },
        { id: '3', name: 'Paul OBIANG', arrivalTime: '09:00', waitTime: 15, status: 'waiting' }
      ]
    },
    {
      service: 'Cardiologie',
      icon: Activity,
      patients: 5,
      avgWait: '40 min',
      nextPatient: 'Pierre MBELE',
      trend: 'stable',
      color: 'red',
      patientQueue: [
        { id: '5', name: 'Pierre MBELE', arrivalTime: '08:15', waitTime: 60, status: 'waiting' },
        { id: '6', name: 'Alice BENGONE', arrivalTime: '08:30', waitTime: 45, status: 'waiting' }
      ]
    },
    {
      service: 'Radiologie',
      icon: Activity,
      patients: 8,
      avgWait: '15 min',
      nextPatient: 'Lucie MOUSSAVOU',
      trend: 'down',
      color: 'purple',
      patientQueue: [
        { id: '8', name: 'Lucie MOUSSAVOU', arrivalTime: '09:00', waitTime: 15, status: 'waiting' },
        { id: '9', name: 'David ENGONE', arrivalTime: '09:05', waitTime: 10, status: 'waiting' }
      ]
    },
    {
      service: 'Laboratoire',
      icon: Activity,
      patients: 3,
      avgWait: '10 min',
      nextPatient: 'Thomas ELLA',
      trend: 'down',
      color: 'green',
      patientQueue: [
        { id: '11', name: 'Thomas ELLA', arrivalTime: '09:05', waitTime: 10, status: 'waiting' }
      ]
    }
  ];

  // Chargement initial des données
  useEffect(() => {
    const loadQueues = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQueues(initialQueues);
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des files d\'attente');
        setIsLoading(false);
      }
    };

    loadQueues();
  }, []);

  // Auto-refresh toutes les minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setQueues(prev => prev.map(queue => ({
        ...queue,
        patientQueue: queue.patientQueue.map(patient => ({
          ...patient,
          waitTime: patient.status === 'waiting' ? patient.waitTime + 1 : patient.waitTime
        }))
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Gestionnaires d'événements
  const handleAppelerPatientSuivant = (service: string) => {
    const currentQueue = queues.find(q => q.service === service);
    if (!currentQueue || currentQueue.patientQueue.length === 0) {
      toast.error('Aucun patient en attente dans cette file');
      return;
    }

    const nextPatient = currentQueue.patientQueue[0];
    setSelectedService(service);
    setSelectedPatient(nextPatient);
    setShowAppelModal(true);
  };

  const handleConfirmAppel = () => {
    // Mise à jour de la file après confirmation
    setQueues(prev => prev.map(queue => {
      if (queue.service === selectedService && queue.patientQueue.length > 0) {
        const updatedQueue = [...queue.patientQueue];
        updatedQueue.shift(); // Retire le patient appelé
        return {
          ...queue,
          patientQueue: updatedQueue,
          nextPatient: updatedQueue[0]?.name || 'Aucun patient',
          patients: Math.max(0, queue.patients - 1)
        };
      }
      return queue;
    }));

    setSuccess(`${selectedPatient?.name} appelé pour ${selectedService}`);
    setTimeout(() => setSuccess(null), 3000);
    
    // Reset sélection
    setSelectedService('');
    setSelectedPatient(null);
  };

  const handleTransfererPatient = (service: string) => {
    const currentQueue = queues.find(q => q.service === service);
    if (!currentQueue || currentQueue.patientQueue.length === 0) {
      toast.error('Aucun patient à transférer dans cette file');
      return;
    }

    // Ouvrir modal avec le premier patient de la file
    const nextPatient = currentQueue.patientQueue[0];
    setSelectedService(service);
    setSelectedPatient(nextPatient);
    setShowTransfertModal(true);
  };

  const handleConfirmTransfert = (serviceDestination: string, motif: string) => {
    // Retirer le patient de la file actuelle
    setQueues(prev => prev.map(queue => {
      if (queue.service === selectedService) {
        const updatedQueue = [...queue.patientQueue];
        updatedQueue.shift();
        return {
          ...queue,
          patientQueue: updatedQueue,
          nextPatient: updatedQueue[0]?.name || 'Aucun patient',
          patients: Math.max(0, queue.patients - 1)
        };
      }
      // Ajouter au service de destination
      if (queue.service === serviceDestination && selectedPatient) {
        return {
          ...queue,
          patientQueue: [...queue.patientQueue, { ...selectedPatient, waitTime: 0 }],
          patients: queue.patients + 1
        };
      }
      return queue;
    }));

    setSuccess(`Patient transféré de ${selectedService} vers ${serviceDestination}`);
    setTimeout(() => setSuccess(null), 3000);

    // Reset
    setSelectedService('');
    setSelectedPatient(null);
    setShowTransfertModal(false);
  };

  const handleVoirHistorique = (service: string) => {
    setSelectedService(service);
    setShowHistoriqueModal(true);
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-red-500';
    if (trend === 'down') return 'text-green-500';
    return 'text-yellow-500';
  };

  const getTotalPatients = () => queues.reduce((sum, queue) => sum + queue.patients, 0);
  const getAvgWaitTime = () => {
    if (queues.length === 0) return 0;
    const totalMinutes = queues.reduce((sum, queue) => {
      const minutes = parseInt(queue.avgWait.split(' ')[0]) || 0;
      return sum + minutes;
    }, 0);
    return Math.round(totalMinutes / queues.length);
  };

  if (isLoading) {
    return (
      <ProfessionalEstablishmentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Chargement des files d'attente...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Files d'attente</h1>
            <p className="text-muted-foreground">Suivi en temps réel des files d'attente par service</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="mr-2 h-3 w-3" />
              Temps moyen: {getAvgWaitTime()} min
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className={`mr-2 h-3 w-3 ${autoRefresh ? 'animate-pulse text-green-600' : ''}`} />
              {autoRefresh ? 'Temps réel ON' : 'Temps réel OFF'}
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total patients en attente
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalPatients()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">En temps réel</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Temps d'attente moyen
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAvgWaitTime()} min</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">Calculé automatiquement</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Service le plus chargé
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queues.length > 0 ? queues.reduce((max, queue) => queue.patients > max.patients ? queue : max, queues[0])?.service.split(' ')[0] : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {queues.length > 0 ? Math.max(...queues.map(q => q.patients)) : 0} patients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patients traités aujourd'hui
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8%</span> vs objectif
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Files d'attente par service */}
        <div className="grid gap-6 md:grid-cols-2">
          {queues.map((queue) => (
            <Card key={queue.service} className="overflow-hidden">
              <CardHeader className={`bg-${queue.color}-50 dark:bg-${queue.color}-950/20`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <queue.icon className={`h-5 w-5 text-${queue.color}-600`} />
                    <CardTitle>{queue.service}</CardTitle>
                  </div>
                  <Badge variant="outline" className="font-semibold">
                    {queue.patients} patients
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Temps d'attente moyen</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{queue.avgWait}</span>
                      <span className={`${getTrendColor(queue.trend)} font-bold`}>
                        {getTrendIcon(queue.trend)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prochain patient</span>
                    <span className="font-medium">{queue.nextPatient}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex gap-1">
                      {[...Array(Math.min(queue.patients, 10))].map((_, i) => (
                        <div 
                          key={i}
                          className={`h-8 w-2 bg-${queue.color}-500 rounded-full opacity-${100 - i * 10}`}
                        />
                      ))}
                      {queue.patients > 10 && (
                        <span className="text-xs text-muted-foreground ml-2 self-center">
                          +{queue.patients - 10}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions par service */}
                  <div className="grid grid-cols-3 gap-1 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleAppelerPatientSuivant(queue.service)}
                      disabled={loadingActions[`call_${queue.service}`] === 'calling' || queue.patients === 0}
                      className="text-xs"
                    >
                      {loadingActions[`call_${queue.service}`] === 'calling' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Bell className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTransfererPatient(queue.service)}
                      className="text-xs"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleVoirHistorique(queue.service)}
                      className="text-xs"
                    >
                      <History className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions globales */}
        <Card>
          <CardHeader>
            <CardTitle>Actions globales</CardTitle>
            <CardDescription>
              Gestion avancée des files d'attente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="default"
                className="flex-1"
                disabled={getTotalPatients() === 0}
                onClick={() => toast.info('Système d\'appel automatique sera implémenté')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Appel automatique
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => toast.info('Réorganisation intelligente sera implémentée')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Optimiser flux
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => toast.info('Historique complet sera affiché')}
              >
                <History className="mr-2 h-4 w-4" />
                Historique global
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <AppelPatientModal
          open={showAppelModal}
          onClose={() => {
            setShowAppelModal(false);
            setSelectedService('');
            setSelectedPatient(null);
          }}
          service={selectedService}
          patient={selectedPatient}
          onConfirm={handleConfirmAppel}
        />

        <TransfertPatientModal
          open={showTransfertModal}
          onClose={() => {
            setShowTransfertModal(false);
            setSelectedService('');
            setSelectedPatient(null);
          }}
          serviceOrigine={selectedService}
          patient={selectedPatient}
          onTransfertComplete={handleConfirmTransfert}
        />

        <HistoriqueFileModal
          open={showHistoriqueModal}
          onClose={() => {
            setShowHistoriqueModal(false);
            setSelectedService('');
          }}
          service={selectedService}
        />
      </div>
    </ProfessionalEstablishmentLayout>
  );
}