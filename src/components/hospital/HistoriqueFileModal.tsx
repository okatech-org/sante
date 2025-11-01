import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  History, Clock, User, TrendingUp, Activity, Calendar,
  Loader2, CheckCircle, XCircle, ArrowRight, BarChart
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface HistoriqueEvent {
  id: string;
  timestamp: string;
  type: 'appel' | 'transfert' | 'entree' | 'sortie' | 'annulation';
  patient: string;
  details: string;
  operateur: string;
  dureeAttente?: number;
}

interface StatistiquesService {
  patientsTraites: number;
  tempsAttenteMoyen: number;
  tempsAttentMax: number;
  tempsAttentMin: number;
  transfertsEnvoyes: number;
  transfertsRecus: number;
  annulations: number;
}

interface HistoriqueFileModalProps {
  open: boolean;
  onClose: () => void;
  service: string;
}

export function HistoriqueFileModal({
  open,
  onClose,
  service
}: HistoriqueFileModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [historique, setHistorique] = useState<HistoriqueEvent[]>([]);
  const [stats, setStats] = useState<StatistiquesService | null>(null);
  const [activeTab, setActiveTab] = useState('aujourd_hui');

  // Chargement des données
  useEffect(() => {
    if (open) {
      loadHistorique();
    }
  }, [open, activeTab]);

  const loadHistorique = async () => {
    setIsLoading(true);
    
    try {
      // Simulation API GET /api/historique-file/:service
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Données mock réalistes
      const mockHistorique: HistoriqueEvent[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          type: 'appel',
          patient: 'Jean DUPONT',
          details: 'Patient appelé pour consultation',
          operateur: 'Nadège OYONO',
          dureeAttente: 25
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          type: 'entree',
          patient: 'Marie NZÉ',
          details: 'Patient enregistré dans la file',
          operateur: 'Système',
          dureeAttente: 0
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
          type: 'transfert',
          patient: 'Pierre MBELE',
          details: `Transféré depuis ${service} vers Cardiologie`,
          operateur: 'Nadège OYONO',
          dureeAttente: 35
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          type: 'appel',
          patient: 'Sophie OYONO',
          details: 'Patient appelé pour consultation',
          operateur: 'Nadège OYONO',
          dureeAttente: 18
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          type: 'sortie',
          patient: 'Paul OBIANG',
          details: 'Consultation terminée',
          operateur: 'Dr. NGUEMA',
          dureeAttente: 22
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          type: 'annulation',
          patient: 'Alice BENGONE',
          details: 'RDV annulé par le patient',
          operateur: 'Nadège OYONO',
          dureeAttente: 40
        }
      ];

      const mockStats: StatistiquesService = {
        patientsTraites: 45,
        tempsAttenteMoyen: 23,
        tempsAttentMax: 62,
        tempsAttentMin: 8,
        transfertsEnvoyes: 5,
        transfertsRecus: 3,
        annulations: 2
      };

      setHistorique(mockHistorique);
      setStats(mockStats);
      setIsLoading(false);

    } catch (err) {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'appel': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'transfert': return <ArrowRight className="h-4 w-4 text-blue-600" />;
      case 'entree': return <User className="h-4 w-4 text-purple-600" />;
      case 'sortie': return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'annulation': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'appel': return 'bg-green-50 border-green-200 dark:bg-green-950/20';
      case 'transfert': return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20';
      case 'entree': return 'bg-purple-50 border-purple-200 dark:bg-purple-950/20';
      case 'sortie': return 'bg-gray-50 border-gray-200 dark:bg-gray-950/20';
      case 'annulation': return 'bg-red-50 border-red-200 dark:bg-red-950/20';
      default: return '';
    }
  };

  const getEventLabel = (type: string) => {
    const labels: {[key: string]: string} = {
      'appel': 'Patient appelé',
      'transfert': 'Transfert',
      'entree': 'Entrée file',
      'sortie': 'Consultation terminée',
      'annulation': 'Annulation'
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-600" />
            Historique - {service}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Chargement de l'historique...</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="aujourd_hui">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="aujourd_hui" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {historique.map((event, index) => (
                    <Card key={event.id} className={cn("border", getEventColor(event.type))}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getEventLabel(event.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(event.timestamp), 'HH:mm', { locale: fr })}
                              </span>
                            </div>
                            <p className="font-semibold text-sm">{event.patient}</p>
                            <p className="text-sm text-muted-foreground">{event.details}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>Par : {event.operateur}</span>
                              {event.dureeAttente !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Attente : {event.dureeAttente} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="statistiques" className="space-y-4">
              {stats && (
                <>
                  {/* Statistiques principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                      <CardContent className="p-4 text-center">
                        <BarChart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">{stats.patientsTraites}</p>
                        <p className="text-xs text-muted-foreground">Patients traités</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">{stats.tempsAttenteMoyen} min</p>
                        <p className="text-xs text-muted-foreground">Temps moyen</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                      <CardContent className="p-4 text-center">
                        <ArrowRight className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-2xl font-bold">{stats.transfertsEnvoyes}</p>
                        <p className="text-xs text-muted-foreground">Transferts</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                      <CardContent className="p-4 text-center">
                        <XCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <p className="text-2xl font-bold">{stats.annulations}</p>
                        <p className="text-xs text-muted-foreground">Annulations</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Détails statistiques */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Temps d'attente
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Minimum</p>
                          <p className="text-lg font-bold text-green-600">{stats.tempsAttentMin} min</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Moyen</p>
                          <p className="text-lg font-bold text-blue-600">{stats.tempsAttenteMoyen} min</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Maximum</p>
                          <p className="text-lg font-bold text-red-600">{stats.tempsAttentMax} min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Flux de patients */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Flux de patients
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                          <span className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            Entrées dans la file
                          </span>
                          <span className="font-bold">{stats.patientsTraites + stats.annulations}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            Consultations terminées
                          </span>
                          <span className="font-bold">{stats.patientsTraites}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                          <span className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            Transferts sortants
                          </span>
                          <span className="font-bold">{stats.transfertsEnvoyes}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                          <span className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 rotate-180" />
                            Transferts entrants
                          </span>
                          <span className="font-bold">{stats.transfertsRecus}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded">
                          <span className="flex items-center gap-2">
                            <XCircle className="h-3 w-3" />
                            Annulations
                          </span>
                          <span className="font-bold">{stats.annulations}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
