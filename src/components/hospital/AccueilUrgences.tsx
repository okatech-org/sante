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
    <div className="space-y-8">
      {/* Alertes délais dépassés - Plus visible */}
      {alertesDelais.length > 0 && (
        <Alert variant="destructive" className="animate-pulse border-2 border-red-500 shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            <strong className="text-base font-bold">⚠️ Délais dépassés :</strong>
            <ul className="mt-2 space-y-1">
              {alertesDelais.map((alerte, index) => (
                <li key={index} className="text-sm font-medium">• {alerte}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques - Améliorées */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Patients actuels par niveau de gravité
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Zap className="h-10 w-10 text-red-600" />
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Niveau 1</p>
                <p className="text-4xl font-bold text-red-700 dark:text-red-500">{stats.niveau1}</p>
                <p className="text-xs text-red-600 dark:text-red-400">Urgence vitale</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-300 dark:border-orange-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <AlertTriangle className="h-10 w-10 text-orange-600" />
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Niveau 2</p>
                <p className="text-4xl font-bold text-orange-700 dark:text-orange-500">{stats.niveau2}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Très urgent</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-300 dark:border-yellow-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="h-10 w-10 text-yellow-700" />
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Niveau 3</p>
                <p className="text-4xl font-bold text-yellow-800 dark:text-yellow-500">{stats.niveau3}</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400">Urgent</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Users className="h-10 w-10 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">Total</p>
                <p className="text-4xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Patients présents</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow bg-orange-50/50 dark:bg-orange-950/10">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Clock className="h-10 w-10 text-orange-600" />
                <p className="text-sm font-semibold text-muted-foreground">En attente</p>
                <p className="text-4xl font-bold text-orange-600">{stats.enAttente}</p>
                <p className="text-xs text-muted-foreground">consultation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow bg-blue-50/50 dark:bg-blue-950/10">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center space-y-2">
                <Activity className="h-10 w-10 text-blue-600" />
                <p className="text-sm font-semibold text-muted-foreground">En consultation</p>
                <p className="text-4xl font-bold text-blue-600">{stats.enConsultation}</p>
                <p className="text-xs text-muted-foreground">Avec médecin</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions rapides - Améliorées */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setShowTriageForm(true)}
          size="lg"
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-lg py-6"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nouveau patient
        </Button>
        <Button variant="outline" size="lg" className="text-lg py-6">
          <Filter className="mr-2 h-5 w-5" />
          Filtres
        </Button>
      </div>

      {/* Dashboard principal */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Suivi des patients en temps réel
        </h2>
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
      </div>

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