import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, User, Activity, AlertTriangle, Zap, 
  ChevronRight, Thermometer, Heart, Droplets,
  MapPin, FileText, CreditCard, MoreVertical
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

  const colonnes: { statut: StatutUrgence; label: string; couleur: string }[] = [
    { statut: 'attente_triage', label: 'Attente triage', couleur: 'bg-orange-50 dark:bg-orange-950/30' },
    { statut: 'en_attente', label: 'En attente consultation', couleur: 'bg-yellow-50 dark:bg-yellow-950/30' },
    { statut: 'en_consultation', label: 'En consultation', couleur: 'bg-blue-50 dark:bg-blue-950/30' },
    { statut: 'en_examen', label: 'En examen', couleur: 'bg-purple-50 dark:bg-purple-950/30' },
    { statut: 'en_observation', label: 'En observation', couleur: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { statut: 'sortie', label: 'Sortie', couleur: 'bg-green-50 dark:bg-green-950/30' }
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
        "cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]",
        isDelaiDepasse(dossier) && "ring-2 ring-red-500 animate-pulse",
        dossier.niveauGravite === 1 && "border-2 border-red-500 shadow-red-200"
      )}
      onClick={() => setSelectedDossier(dossier)}
    >
      <CardContent className="p-5 space-y-3.5">
        {/* En-tête avec niveau et temps */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge className={cn("text-sm font-bold px-2.5 py-1", getNiveauColor(dossier.niveauGravite))}>
              {getNiveauIcon(dossier.niveauGravite)}
              <span className="ml-1.5">N{dossier.niveauGravite}</span>
            </Badge>
            {dossier.alertes.includes('URGENCE VITALE') && (
              <Badge variant="destructive" className="animate-pulse text-sm font-bold">
                VITAL
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'en_consultation')}>
                ✓ Passer en consultation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'en_examen')}>
                🔬 Envoyer en examen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'en_observation')}>
                👁️ Mettre en observation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'sortie')}>
                ← Sortie patient
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatut(dossier.id, 'hospitalisation')}>
                🏥 Hospitaliser
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Informations patient - Amélioration UX */}
        <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded">
              <User className="h-4 w-4 text-primary" />
            </div>
            <p className="font-bold text-base">
              {dossier.patientInfo.nom} {dossier.patientInfo.prenom?.[0]}.
            </p>
          </div>
          {dossier.patientInfo.age && (
            <p className="text-sm text-muted-foreground ml-8">
              {dossier.patientInfo.age} ans • {dossier.patientInfo.sexe === 'M' ? 'Homme' : 'Femme'}
            </p>
          )}
        </div>

        {/* Motif - Plus visible */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-sm font-medium line-clamp-2 text-gray-800 dark:text-gray-200">
            {dossier.motifConsultation}
          </p>
        </div>

        {/* Constantes vitales - Design amélioré */}
        {dossier.constantesVitales && (
          <div className="grid grid-cols-2 gap-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
            {dossier.constantesVitales.tensionArterielle && (
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">
                  {dossier.constantesVitales.tensionArterielle.systolique}/{dossier.constantesVitales.tensionArterielle.diastolique}
                </span>
              </div>
            )}
            {dossier.constantesVitales.frequenceCardiaque && (
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="font-semibold">{dossier.constantesVitales.frequenceCardiaque} bpm</span>
              </div>
            )}
            {dossier.constantesVitales.temperature && (
              <div className="flex items-center gap-2 text-sm">
                <Thermometer className="h-4 w-4 text-orange-600" />
                <span className="font-semibold">{dossier.constantesVitales.temperature}°C</span>
              </div>
            )}
            {dossier.constantesVitales.saturationO2 && (
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-cyan-600" />
                <span className="font-semibold">{dossier.constantesVitales.saturationO2}%</span>
              </div>
            )}
          </div>
        )}

        {/* Temps et box - Plus visible */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-dashed">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
            <Clock className="h-4 w-4" />
            <span className="font-bold">environ {getTempsAttente(dossier.heureArrivee)}</span>
          </div>
          {dossier.boxId && (
            <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
              <MapPin className="h-4 w-4 mr-1" />
              {dossier.boxId}
            </Badge>
          )}
        </div>

        {/* Médecin - Plus visible */}
        {dossier.medecin && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-950/20 p-2 rounded">
            👨‍⚕️ Dr. {dossier.medecin.nom}
          </div>
        )}

        {/* Badges statut - Plus grands */}
        <div className="flex gap-2 flex-wrap">
          {!dossier.enregistrementAdminComplet && (
            <Badge variant="outline" className="text-sm px-3 py-1">
              <FileText className="h-4 w-4 mr-1" />
              Admin
            </Badge>
          )}
          {dossier.droitsVerifies && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <CreditCard className="h-4 w-4 mr-1" />
              CNAMGS
            </Badge>
          )}
        </div>

        {/* Alerte délai dépassé - Plus visible */}
        {isDelaiDepasse(dossier) && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm font-bold border-2 border-red-500 animate-pulse">
            ⚠️ Délai dépassé ({NIVEAUX_GRAVITE[dossier.niveauGravite].delaiMaximal} min max)
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Vue Kanban - Améliorée */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {colonnes.map(colonne => {
          const dossiersColonne = dossiers.filter(d => d.statut === colonne.statut);
          
          return (
            <div key={colonne.statut} className="space-y-4">
              <div className={cn("rounded-xl p-4 shadow-md border-2", colonne.couleur)}>
                <h3 className="font-bold text-base flex items-center justify-between">
                  <span>{colonne.label}</span>
                  <Badge 
                    variant="secondary" 
                    className="ml-2 text-base font-bold px-3 py-1 bg-white dark:bg-gray-800 shadow"
                  >
                    {dossiersColonne.length}
                  </Badge>
                </h3>
              </div>
              
              <ScrollArea className="h-[700px] pr-2">
                <div className="space-y-4">
                  {dossiersColonne.length === 0 ? (
                    <Card className="bg-muted/30 border-dashed border-2">
                      <CardContent className="p-6">
                        <p className="text-sm text-center text-muted-foreground font-medium">
                          Aucun patient
                        </p>
                      </CardContent>
                    </Card>
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
          );
        })}
      </div>

      {/* Modal détails patient (à implémenter) */}
      {selectedDossier && (
        <Card className="fixed bottom-4 right-4 w-96 shadow-xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedDossier.numeroDossier}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDossier(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
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
