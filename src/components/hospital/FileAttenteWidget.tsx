import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Activity, TrendingUp } from 'lucide-react';
import { FileAttente } from '@/types/accueil.types';

interface FileAttenteWidgetProps {
  serviceId: string;
  serviceName: string;
}

export function FileAttenteWidget({ serviceId, serviceName }: FileAttenteWidgetProps) {
  const [fileAttente, setFileAttente] = useState<FileAttente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFileAttente();
    // Actualiser toutes les 30 secondes
    const interval = setInterval(loadFileAttente, 30000);
    return () => clearInterval(interval);
  }, [serviceId]);

  const loadFileAttente = async () => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données mock
      const mockFile: FileAttente = {
        serviceId,
        serviceName,
        patients: [
          {
            id: 'pat-' + Math.random(),
            nom: 'NZENGUE',
            prenom: 'Jean',
            heureArrivee: new Date(Date.now() - 45 * 60000).toISOString(), // Il y a 45 min
            position: 1,
            tempsAttenteEstime: 10,
            priorite: 'normal'
          },
          {
            id: 'pat-' + Math.random(),
            nom: 'MOUSSAVOU',
            prenom: 'Marie',
            heureArrivee: new Date(Date.now() - 30 * 60000).toISOString(), // Il y a 30 min
            position: 2,
            tempsAttenteEstime: 25,
            priorite: 'normal'
          },
          {
            id: 'pat-' + Math.random(),
            nom: 'OBAME',
            prenom: 'Pierre',
            heureArrivee: new Date(Date.now() - 15 * 60000).toISOString(), // Il y a 15 min
            position: 3,
            tempsAttenteEstime: 40,
            priorite: 'urgent'
          }
        ].slice(0, Math.floor(Math.random() * 4)), // 0 à 3 patients
        tempsAttenteMoyen: 25,
        medecinActif: true
      };

      setFileAttente(mockFile);
    } catch (error) {
      console.error('Erreur chargement file attente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTempsAttente = (heureArrivee: string) => {
    const diff = Date.now() - new Date(heureArrivee).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;
    const heures = Math.floor(minutes / 60);
    return `${heures}h${String(minutes % 60).padStart(2, '0')}`;
  };

  const getPrioriteColor = (priorite?: string) => {
    switch (priorite) {
      case 'urgent': return 'destructive';
      case 'prioritaire': return 'warning';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fileAttente) return null;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {serviceName}
          </CardTitle>
          <Badge variant={fileAttente.medecinActif ? 'success' : 'secondary'}>
            {fileAttente.medecinActif ? 'Actif' : 'Absent'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold">{fileAttente.patients.length}</p>
              <p className="text-xs text-muted-foreground">En attente</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-2xl font-bold">{fileAttente.tempsAttenteMoyen}</p>
              <p className="text-xs text-muted-foreground">Min. moy.</p>
            </div>
          </div>

          {/* Liste des patients */}
          {fileAttente.patients.length > 0 ? (
            <div className="space-y-2">
              {fileAttente.patients.map((patient, index) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {patient.position}
                    </div>
                    <div>
                      <p className="font-medium">
                        {patient.nom} {patient.prenom?.[0]}.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Attente: {getTempsAttente(patient.heureArrivee)}
                      </p>
                    </div>
                  </div>
                  {patient.priorite !== 'normal' && (
                    <Badge 
                      variant={getPrioriteColor(patient.priorite)} 
                      className="text-xs"
                    >
                      {patient.priorite}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">Aucun patient en attente</p>
            </div>
          )}

          {/* Temps d'attente estimé pour nouveau patient */}
          {fileAttente.patients.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Nouveau patient : ~{fileAttente.tempsAttenteMoyen * (fileAttente.patients.length + 1)} min
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
