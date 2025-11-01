import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, User, Activity, AlertTriangle, Zap, 
  ChevronRight, Thermometer, Heart, Droplets,
  MapPin, FileText, CreditCard, MoreVertical, X
} from 'lucide-react';
import { 
  DossierUrgence, 
  StatutUrgence,
  NIVEAUX_GRAVITE 
} from '@/types/accueil.types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UrgenceDashboardProps {
  dossiers: DossierUrgence[];
  onUpdateStatut: (dossierId: string, newStatut: StatutUrgence) => void;
}

export function UrgenceDashboard({ dossiers, onUpdateStatut }: UrgenceDashboardProps) {
  const [selectedDossier, setSelectedDossier] = useState<DossierUrgence | null>(null);

  const colonnes: { statut: StatutUrgence; label: string; shortLabel: string; couleur: string; badgeColor: string; count: number }[] = [
    { 
      statut: 'attente_triage', 
      label: 'Attente triage',
      shortLabel: 'Attente triage',
      couleur: 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800',
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
      count: dossiers.filter(d => d.statut === 'attente_triage').length
    },
    { 
      statut: 'en_attente', 
      label: 'En attente consultation',
      shortLabel: 'En attente consult.',
      couleur: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
      count: dossiers.filter(d => d.statut === 'en_attente').length
    },
    { 
      statut: 'en_consultation', 
      label: 'En consultation',
      shortLabel: 'En consultation',
      couleur: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      count: dossiers.filter(d => d.statut === 'en_consultation').length
    },
    { 
      statut: 'en_examen', 
      label: 'En examen',
      shortLabel: 'En examen',
      couleur: 'bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      count: dossiers.filter(d => d.statut === 'en_examen').length
    },
    { 
      statut: 'en_observation', 
      label: 'En observation',
      shortLabel: 'En observation',
      couleur: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      count: dossiers.filter(d => d.statut === 'en_observation').length
    },
    { 
      statut: 'sortie', 
      label: 'Sortie',
      shortLabel: 'Sortie',
      couleur: 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800',
      badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      count: dossiers.filter(d => d.statut === 'sortie').length
    }
  ];

  const getNiveauIcon = (niveau: number) => {
    if (niveau === 1) return <Zap className="h-4 w-4" />;
    if (niveau === 2) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getNiveauColor = (niveau: number) => {
    const colors = {
      1: 'bg-red-500 text-white',
      2: 'bg-orange-500 text-white',
      3: 'bg-yellow-500 text-white',
      4: 'bg-green-500 text-white',
      5: 'bg-blue-500 text-white'
    };
    return colors[niveau as keyof typeof colors] || 'bg-gray-500';
  };

  const getTempsAttente = (heureArrivee: string) => {
    return formatDistanceToNow(new Date(heureArrivee), { 
      addSuffix: false, 
      locale: fr 
    });
  };

  const isDelaiDepasse = (dossier: DossierUrgence) => {
    if (!dossier.delaiMaximal || dossier.statut !== 'en_attente') return false;
    const tempsEcoule = (Date.now() - new Date(dossier.heureArrivee).getTime()) / 60000;
    return tempsEcoule > dossier.delaiMaximal;
  };

  const PatientCard = ({ dossier }: { dossier: DossierUrgence }) => (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md border-0 shadow-sm bg-white dark:bg-gray-800 overflow-hidden",
        isDelaiDepasse(dossier) && "ring-2 ring-red-500 animate-pulse",
        dossier.niveauGravite === 1 && "border-2 border-red-500 shadow-red-100 bg-red-50 dark:bg-red-950/20"
      )}
      onClick={() => setSelectedDossier(dossier)}
    >
      <CardContent className="p-1.5 space-y-1 w-full min-w-0">
        {/* En-tête: Niveau + Nom + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <Badge className={cn("text-xs px-1 py-0.5 flex-shrink-0", getNiveauColor(dossier.niveauGravite))}>
              {getNiveauIcon(dossier.niveauGravite)}
              <span className="ml-0.5">N{dossier.niveauGravite}</span>
            </Badge>
            {dossier.alertes.includes('URGENCE VITALE') && (
              <Badge variant="destructive" className="animate-pulse text-xs px-1 py-0.5 flex-shrink-0">
                VITAL
              </Badge>
            )}
            <div className="min-w-0 flex-1 ml-1">
              <p 
                className="font-semibold text-xs truncate" 
                title={`${dossier.patientInfo.nom} ${dossier.patientInfo.prenom || ''}`}
              >
                {dossier.patientInfo.nom} {dossier.patientInfo.prenom?.[0]}.
              </p>
              {dossier.patientInfo.age && (
                <p className="text-xs text-muted-foreground truncate -mt-0.5">
                  {dossier.patientInfo.age}a • {dossier.patientInfo.sexe === 'M' ? 'H' : 'F'}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 flex-shrink-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'en_consultation')}>
                Passer en consultation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'en_examen')}>
                Envoyer en examen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'en_observation')}>
                Mettre en observation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'sortie')}>
                Sortie patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'hospitalisation')}>
                Hospitaliser
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Motif */}
        <p 
          className="text-xs text-muted-foreground line-clamp-1 break-words" 
          title={dossier.motifConsultation}
        >
          {dossier.motifConsultation}
        </p>

        {/* Constantes vitales compactes */}
        {dossier.constantesVitales && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-1.5 min-w-0">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs min-w-0">
              {dossier.constantesVitales.tensionArterielle && (
                <div className="flex items-center gap-1">
                  <Activity className="h-2 w-2 flex-shrink-0 text-muted-foreground/60" />
                  <span className="font-mono text-xs">
                    {dossier.constantesVitales.tensionArterielle.systolique}/{dossier.constantesVitales.tensionArterielle.diastolique}
                  </span>
                </div>
              )}
              {dossier.constantesVitales.frequenceCardiaque && (
                <div className="flex items-center gap-1">
                  <Heart className="h-2 w-2 flex-shrink-0 text-muted-foreground/60" />
                  <span className="font-mono text-xs">
                    {dossier.constantesVitales.frequenceCardiaque}
                  </span>
                </div>
              )}
              {dossier.constantesVitales.temperature && (
                <div className="flex items-center gap-1">
                  <Thermometer className="h-2 w-2 flex-shrink-0 text-muted-foreground/60" />
                  <span className="font-mono text-xs">
                    {dossier.constantesVitales.temperature}°C
                  </span>
                </div>
              )}
              {dossier.constantesVitales.saturationO2 && (
                <div className="flex items-center gap-1">
                  <Droplets className="h-2 w-2 flex-shrink-0 text-muted-foreground/60" />
                  <span className="font-mono text-xs">
                    {dossier.constantesVitales.saturationO2}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ligne info: Temps + Box */}
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div className="flex items-center gap-1">
            <Clock className="h-2 w-2 flex-shrink-0" />
            <span className="truncate">
              {getTempsAttente(dossier.heureArrivee)}
            </span>
          </div>
          {dossier.boxId && (
            <div className="flex items-center gap-1">
              <MapPin className="h-2 w-2 flex-shrink-0" />
              <span className="font-medium truncate" title={dossier.boxId}>
                {dossier.boxId}
              </span>
            </div>
          )}
        </div>

        {dossier.medecin && (
          <div className="text-xs text-muted-foreground truncate" title={`Dr. ${dossier.medecin.nom}`}>
            Dr. {dossier.medecin.nom}
          </div>
        )}

        {/* Badge Admin en bas */}
        {!dossier.enregistrementAdminComplet && (
          <Badge variant="outline" className="text-xs px-1 py-0.5 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 w-fit">
            <FileText className="h-2 w-2 mr-0.5" />
            <span>Admin</span>
          </Badge>
        )}

        {/* Alerte délai dépassé */}
        {isDelaiDepasse(dossier) && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-1 rounded text-xs font-medium flex items-center gap-1 min-w-0">
            <AlertTriangle className="h-2 w-2 flex-shrink-0" />
            <span className="truncate">Délai dépassé</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      {/* Vue Kanban avec scroll horizontal si nécessaire */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {colonnes.map(colonne => {
            const dossiersColonne = dossiers.filter(d => d.statut === colonne.statut);
            
            return (
              <div key={colonne.statut} className="flex flex-col h-[500px] w-[220px] flex-shrink-0">
                {/* Header de colonne */}
                <div className={cn(
                  "rounded-t-lg border p-2 mb-0 shadow-sm",
                  colonne.couleur
                )}>
                  <h3 className="font-semibold text-xs flex items-center justify-between gap-2">
                    <span className="text-gray-700 dark:text-gray-300 leading-tight" title={colonne.label}>
                      {colonne.shortLabel}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={cn("font-bold text-xs flex-shrink-0 px-1.5 py-0.5", colonne.badgeColor)}
                    >
                      {colonne.count}
                    </Badge>
                  </h3>
                </div>
              
              {/* Zone des cartes */}
              <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-b-lg border border-t-0 flex-1 p-1.5 overflow-hidden">
                <ScrollArea className="h-full pr-0.5">
                  <div className="space-y-1.5">
                    {dossiersColonne.length === 0 ? (
                      <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 mt-8">
                        <p className="text-sm text-muted-foreground">
                          Aucun patient
                        </p>
                      </div>
                    ) : (
                      dossiersColonne
                        .sort((a, b) => {
                          // Trier par niveau de gravité (1 en premier)
                          if (a.niveauGravite !== b.niveauGravite) {
                            return a.niveauGravite - b.niveauGravite;
                          }
                          // Puis par heure d'arrivée
                          return new Date(a.heureArrivee).getTime() - new Date(b.heureArrivee).getTime();
                        })
                        .map(dossier => (
                          <PatientCard key={dossier.id} dossier={dossier} />
                        ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Modal détails patient */}
      {selectedDossier && (
        <Card className="fixed bottom-4 right-4 w-96 shadow-2xl z-50 border-0 animate-in slide-in-from-bottom-5">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {selectedDossier.numeroDossier}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(selectedDossier.heureArrivee), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedDossier(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="font-semibold">
                  {selectedDossier.patientInfo.nom} {selectedDossier.patientInfo.prenom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDossier.patientInfo.age && `${selectedDossier.patientInfo.age} ans • `}
                  {selectedDossier.patientInfo.sexe === 'M' ? 'Homme' : 'Femme'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Motif de consultation</p>
                <p className="text-sm">{selectedDossier.motifConsultation}</p>
              </div>

              {selectedDossier.notes.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Notes</p>
                  <ul className="text-sm list-disc list-inside">
                    {selectedDossier.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <FileText className="mr-2 h-4 w-4" />
                  Compléter admin
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Changer statut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
