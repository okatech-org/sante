import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Clock, Users, Activity, AlertCircle, 
  CheckCircle, Plus, Siren, User, Thermometer, Heart,
  Droplets, Wind, Zap, ChevronRight, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  DossierUrgence, 
  NiveauGravite, 
  StatutUrgence,
  NIVEAUX_GRAVITE,
  formatNumeroDossier 
} from '@/types/accueil.types';
import { TriageForm } from './TriageForm';
import { UrgenceDashboard } from './UrgenceDashboard';
import { toast } from 'sonner';

export function AccueilUrgences() {
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [dossiersUrgence, setDossiersUrgence] = useState<DossierUrgence[]>([]);
  const [selectedNiveauFilter, setSelectedNiveauFilter] = useState<NiveauGravite | 'tous'>('tous');
  const [selectedStatutFilter, setSelectedStatutFilter] = useState<StatutUrgence | 'tous'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertesDelais, setAlertesDelais] = useState<string[]>([]);

  // Charger les dossiers urgences
  useEffect(() => {
    loadDossiersUrgence();
    // Actualiser toutes les 10 secondes
    const interval = setInterval(() => {
      loadDossiersUrgence();
      checkDelaisDepasses();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadDossiersUrgence = async () => {
    try {
      // Simuler un appel API - Données mock
      const mockDossiers: DossierUrgence[] = [
        {
          id: 'urg-001',
          numeroDossier: 'URG-20250131-001',
          patientInfo: {
            nom: 'OBIANG',
            prenom: 'Paul',
            age: 45,
            sexe: 'M'
          },
          heureArrivee: new Date(Date.now() - 120 * 60000).toISOString(),
          motifConsultation: 'Douleur thoracique intense',
          niveauGravite: 2,
          constantesVitales: {
            tensionArterielle: { systolique: 160, diastolique: 95 },
            frequenceCardiaque: 110,
            temperature: 37.2,
            saturationO2: 95,
            douleur: 8
          },
          statut: 'en_consultation',
          boxId: 'box-2',
          medecin: {
            id: 'med-001',
            nom: 'NGUEMA',
            prenom: 'Paul'
          },
          enregistrementAdminComplet: false,
          notes: ['Suspicion syndrome coronarien aigu'],
          alertes: [],
          tempsAttente: 120,
          delaiMaximal: 10,
          createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
          transitions: []
        },
        {
          id: 'urg-002',
          numeroDossier: 'URG-20250131-002',
          patientInfo: {
            nom: 'MBA',
            prenom: 'Sylvie',
            age: 28,
            sexe: 'F'
          },
          heureArrivee: new Date(Date.now() - 45 * 60000).toISOString(),
          motifConsultation: 'Traumatisme cheville après chute',
          niveauGravite: 4,
          constantesVitales: {
            tensionArterielle: { systolique: 120, diastolique: 80 },
            frequenceCardiaque: 75,
            temperature: 36.8,
            saturationO2: 99,
            douleur: 6
          },
          statut: 'en_attente',
          enregistrementAdminComplet: true,
          notes: ['Œdème important', 'Radiographie demandée'],
          alertes: [],
          tempsAttente: 45,
          delaiMaximal: 120,
          createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
          transitions: []
        },
        {
          id: 'urg-003',
          numeroDossier: 'URG-20250131-003',
          patientInfo: {
            nom: 'NZENGUE',
            age: 65,
            sexe: 'M'
          },
          heureArrivee: new Date(Date.now() - 75 * 60000).toISOString(),
          motifConsultation: 'Détresse respiratoire sévère',
          niveauGravite: 1,
          constantesVitales: {
            tensionArterielle: { systolique: 90, diastolique: 60 },
            frequenceCardiaque: 130,
            temperature: 38.5,
            saturationO2: 85,
            frequenceRespiratoire: 32
          },
          statut: 'en_consultation',
          boxId: 'reanimation-1',
          medecin: {
            id: 'med-003',
            nom: 'OKEMBA',
            prenom: 'Marie'
          },
          enregistrementAdminComplet: false,
          notes: ['Réanimation en cours', 'Intubation réalisée'],
          alertes: ['URGENCE VITALE'],
          tempsAttente: 0,
          delaiMaximal: 0,
          createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
          transitions: []
        }
      ];

      setDossiersUrgence(mockDossiers);
    } catch (error) {
      console.error('Erreur chargement dossiers urgence:', error);
    }
  };

  const checkDelaisDepasses = () => {
    const alertes: string[] = [];
    dossiersUrgence.forEach(dossier => {
      if (dossier.statut === 'en_attente' && dossier.delaiMaximal) {
        const tempsAttente = Math.floor(
          (Date.now() - new Date(dossier.heureArrivee).getTime()) / 60000
        );
        if (tempsAttente > dossier.delaiMaximal) {
          alertes.push(`${dossier.patientInfo.nom} - Niveau ${dossier.niveauGravite} - Délai dépassé de ${tempsAttente - dossier.delaiMaximal} min`);
        }
      }
    });
    setAlertesDelais(alertes);
  };

  const handleUrgenceVitale = () => {
    setShowTriageForm(true);
  };

  const handleTriageComplete = (dossier: DossierUrgence) => {
    setDossiersUrgence(prev => [dossier, ...prev]);
    setShowTriageForm(false);
    
    if (dossier.niveauGravite === 1) {
      toast.error(`URGENCE VITALE - ${dossier.patientInfo.nom}`, {
        description: 'Équipe de réanimation alertée',
        duration: 10000
      });
    } else if (dossier.niveauGravite === 2) {
      toast.warning(`Très urgent - ${dossier.patientInfo.nom}`, {
        description: 'Médecin urgentiste notifié',
        duration: 5000
      });
    } else {
      toast.success(`Patient enregistré - ${dossier.numeroDossier}`, {
        description: `Niveau ${dossier.niveauGravite} - ${NIVEAUX_GRAVITE[dossier.niveauGravite].label}`
      });
    }
  };

  // Filtrer les dossiers
  let filteredDossiers = dossiersUrgence;
  
  if (selectedNiveauFilter !== 'tous') {
    filteredDossiers = filteredDossiers.filter(d => d.niveauGravite === selectedNiveauFilter);
  }
  
  if (selectedStatutFilter !== 'tous') {
    filteredDossiers = filteredDossiers.filter(d => d.statut === selectedStatutFilter);
  }
  
  if (searchQuery) {
    filteredDossiers = filteredDossiers.filter(d => 
      d.patientInfo.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.patientInfo.prenom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.numeroDossier.includes(searchQuery)
    );
  }

  // Statistiques
  const stats = {
    total: dossiersUrgence.length,
    niveau1: dossiersUrgence.filter(d => d.niveauGravite === 1).length,
    niveau2: dossiersUrgence.filter(d => d.niveauGravite === 2).length,
    niveau3: dossiersUrgence.filter(d => d.niveauGravite === 3).length,
    enAttente: dossiersUrgence.filter(d => d.statut === 'en_attente').length,
    enConsultation: dossiersUrgence.filter(d => d.statut === 'en_consultation').length,
  };

  return (
    <div className="space-y-6">
      {/* Header avec titre et bouton urgence vitale */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Siren className="h-6 w-6 text-red-600 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight">Accueil Service d'Urgences</h1>
          </div>
          <p className="text-muted-foreground">Service d'urgences - Triage et prise en charge</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/50 px-3 py-1">
            Mode URGENCES
          </Badge>
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white animate-pulse shadow-lg"
            onClick={handleUrgenceVitale}
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            URGENCE VITALE
          </Button>
        </div>
      </div>

      {/* Alertes délais dépassés */}
      {alertesDelais.length > 0 && (
        <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">⚠️ Délais dépassés - Action requise</div>
            <ul className="list-disc list-inside space-y-1">
              {alertesDelais.map((alerte, index) => (
                <li key={index} className="text-sm">{alerte}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Niveau 1 */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-red-100 dark:bg-red-950/50">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Niveau 1</p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-400">{stats.niveau1}</p>
              <p className="text-xs text-red-600 mt-1">Urgence vitale</p>
            </div>
          </CardContent>
        </Card>

        {/* Niveau 2 */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-orange-100 dark:bg-orange-950/50">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Niveau 2</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.niveau2}</p>
              <p className="text-xs text-orange-600 mt-1">Très urgent</p>
            </div>
          </CardContent>
        </Card>

        {/* Niveau 3 */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-yellow-100 dark:bg-yellow-950/50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Niveau 3</p>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.niveau3}</p>
              <p className="text-xs text-yellow-600 mt-1">Urgent</p>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-blue-100 dark:bg-blue-950/50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.total}</p>
              <p className="text-xs text-blue-600 mt-1">Patients actifs</p>
            </div>
          </CardContent>
        </Card>

        {/* En attente */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-cyan-100 dark:bg-cyan-950/50">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">En attente</p>
              <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">{stats.enAttente}</p>
              <p className="text-xs text-cyan-600 mt-1">À voir</p>
            </div>
          </CardContent>
        </Card>

        {/* En consultation */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-950/50">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">En consultation</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.enConsultation}</p>
              <p className="text-xs text-purple-600 mt-1">En cours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions et filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button 
          onClick={() => setShowTriageForm(true)}
          size="lg"
          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau patient
        </Button>
        <div className="flex gap-2 flex-1">
          <Input 
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dashboard Kanban */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-red-950/30 border-b border-red-100 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Tableau de bord des urgences</CardTitle>
                <p className="text-sm text-muted-foreground">Suivi temps réel des patients</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white dark:bg-gray-950">
                {filteredDossiers.length} patients
              </Badge>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Temps réel</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <UrgenceDashboard 
            dossiers={filteredDossiers}
            onUpdateStatut={(dossierId, newStatut) => {
              setDossiersUrgence(prev => prev.map(d => 
                d.id === dossierId 
                  ? { ...d, statut: newStatut, updatedAt: new Date().toISOString() }
                  : d
              ));
              toast.success('Statut mis à jour');
            }}
          />
        </CardContent>
      </Card>

      {/* Modal de triage */}
      {showTriageForm && (
        <TriageForm
          open={showTriageForm}
          onClose={() => setShowTriageForm(false)}
          onComplete={handleTriageComplete}
          urgenceVitale={false}
        />
      )}
    </div>
  );
}