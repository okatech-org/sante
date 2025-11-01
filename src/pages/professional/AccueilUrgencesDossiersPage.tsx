import { useState, useEffect } from 'react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, Search, Filter, Download, Eye, Edit, Loader2, CheckCircle, 
  AlertTriangle, Plus, Calendar, Siren, Clock, User, Activity, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface DossierUrgence {
  id: string;
  numeroDossier: string;
  patient: {
    nom: string;
    prenom: string;
    age: number;
    sexe: 'M' | 'F';
    telephone?: string;
  };
  heureArrivee: string;
  motifConsultation: string;
  niveauGravite: 1 | 2 | 3 | 4 | 5;
  statut: 'attente_triage' | 'en_consultation' | 'en_examen' | 'en_observation' | 'sortie' | 'hospitalisation';
  constantesVitales?: {
    tensionArterielle?: { systolique: number; diastolique: number };
    frequenceCardiaque?: number;
    temperature?: number;
    saturationO2?: number;
    douleur?: number;
  };
  medecin?: {
    id: string;
    nom: string;
  };
  boxId?: string;
  diagnostic?: string;
  traitement?: string;
  notes: string[];
  alertes: string[];
  enregistrementAdminComplet: boolean;
  updatedAt: string;
}

export default function AccueilUrgencesDossiersPage() {
  const [dossiers, setDossiers] = useState<DossierUrgence[]>([]);
  const [filteredDossiers, setFilteredDossiers] = useState<DossierUrgence[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [niveauFilter, setNiveauFilter] = useState<string>('tous');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tous');

  // Données simulées
  const initialDossiers: DossierUrgence[] = [
    {
      id: '1',
      numeroDossier: 'URG-20250131-001',
      patient: { nom: 'NZENGUE', prenom: 'Marie', age: 65, sexe: 'F', telephone: '077123456' },
      heureArrivee: '2025-01-31T06:30:00',
      motifConsultation: 'Détresse respiratoire sévère',
      niveauGravite: 1,
      statut: 'en_consultation',
      constantesVitales: {
        tensionArterielle: { systolique: 90, diastolique: 60 },
        frequenceCardiaque: 130,
        temperature: 38.5,
        saturationO2: 85,
        douleur: 8
      },
      medecin: { id: 'med1', nom: 'Dr. OKEMBA' },
      boxId: 'reanimation-1',
      diagnostic: 'Pneumonie sévère avec détresse respiratoire',
      traitement: 'Oxygénothérapie, antibiotiques IV',
      notes: ['Patiente dyspnéique', 'Antécédent BPCO'],
      alertes: ['URGENCE VITALE'],
      enregistrementAdminComplet: false,
      updatedAt: '2025-01-31T08:15:00'
    },
    {
      id: '2',
      numeroDossier: 'URG-20250131-002',
      patient: { nom: 'OBIANG', prenom: 'Pierre', age: 45, sexe: 'M', telephone: '066234567' },
      heureArrivee: '2025-01-31T07:00:00',
      motifConsultation: 'Douleur thoracique intense',
      niveauGravite: 2,
      statut: 'en_examen',
      constantesVitales: {
        tensionArterielle: { systolique: 160, diastolique: 95 },
        frequenceCardiaque: 110,
        temperature: 37.2,
        saturationO2: 95,
        douleur: 9
      },
      medecin: { id: 'med2', nom: 'Dr. NGUEMA' },
      boxId: 'box-2',
      diagnostic: 'Suspicion syndrome coronarien aigu',
      traitement: 'ECG, troponines, aspirine',
      notes: ['Douleur constrictive', 'Facteurs de risque CV'],
      alertes: [],
      enregistrementAdminComplet: false,
      updatedAt: '2025-01-31T08:30:00'
    },
    {
      id: '3',
      numeroDossier: 'URG-20250131-003',
      patient: { nom: 'MOUSSAVOU', prenom: 'Jean', age: 28, sexe: 'M', telephone: '074345678' },
      heureArrivee: '2025-01-31T08:00:00',
      motifConsultation: 'Entorse cheville droite',
      niveauGravite: 4,
      statut: 'en_observation',
      constantesVitales: {
        tensionArterielle: { systolique: 125, diastolique: 80 },
        frequenceCardiaque: 75,
        temperature: 36.8,
        douleur: 4
      },
      medecin: { id: 'med3', nom: 'Dr. MBOUMBA' },
      boxId: 'box-5',
      diagnostic: 'Entorse légère cheville droite',
      traitement: 'Antalgiques, attelle, repos',
      notes: ['Trauma sport', 'Radiographie normale'],
      alertes: [],
      enregistrementAdminComplet: true,
      updatedAt: '2025-01-31T08:45:00'
    }
  ];

  // Chargement initial
  useEffect(() => {
    const loadDossiers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDossiers(initialDossiers);
        setFilteredDossiers(initialDossiers);
        setIsLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des dossiers');
        setIsLoading(false);
      }
    };

    loadDossiers();
  }, []);

  // Filtrage
  useEffect(() => {
    let filtered = dossiers;

    if (searchQuery.trim()) {
      filtered = filtered.filter(dossier => 
        dossier.numeroDossier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.patient.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.patient.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.motifConsultation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.medecin?.nom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== 'tous') {
      filtered = filtered.filter(dossier => dossier.statut === activeTab);
    }

    if (niveauFilter !== 'tous') {
      filtered = filtered.filter(dossier => dossier.niveauGravite.toString() === niveauFilter);
    }

    setFilteredDossiers(filtered);
  }, [dossiers, searchQuery, activeTab, niveauFilter]);

  // Gestionnaires
  const handleVoirDossier = async (dossier: DossierUrgence) => {
    const actionKey = `view_${dossier.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'viewing'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.info(`Affichage du dossier ${dossier.numeroDossier}`);
    } catch (err) {
      toast.error('Erreur lors de l\'affichage');
    } finally {
      setLoadingActions(prev => {
        const newState = {...prev};
        delete newState[actionKey];
        return newState;
      });
    }
  };

  const handleModifierDossier = async (dossier: DossierUrgence) => {
    const actionKey = `edit_${dossier.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'editing'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info(`Modification du dossier ${dossier.numeroDossier}`);
    } catch (err) {
      toast.error('Erreur lors de la modification');
    } finally {
      setLoadingActions(prev => {
        const newState = {...prev};
        delete newState[actionKey];
        return newState;
      });
    }
  };

  const handleTelechargerDossier = async (dossier: DossierUrgence) => {
    const actionKey = `download_${dossier.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'downloading'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Dossier ${dossier.numeroDossier} téléchargé`);
    } catch (err) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setLoadingActions(prev => {
        const newState = {...prev};
        delete newState[actionKey];
        return newState;
      });
    }
  };

  const getNiveauColor = (niveau: number) => {
    switch(niveau) {
      case 1: return 'bg-red-100 text-red-700 border-red-300';
      case 2: return 'bg-orange-100 text-orange-700 border-orange-300';
      case 3: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 4: return 'bg-green-100 text-green-700 border-green-300';
      case 5: return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return '';
    }
  };

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'en_consultation': return 'bg-blue-100 text-blue-700';
      case 'en_examen': return 'bg-purple-100 text-purple-700';
      case 'en_observation': return 'bg-orange-100 text-orange-700';
      case 'sortie': return 'bg-green-100 text-green-700';
      case 'hospitalisation': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTempsEcoule = (heureArrivee: string) => {
    const now = new Date();
    const arrivee = new Date(heureArrivee);
    const diffMs = now.getTime() - arrivee.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes}min`;
  };

  const stats = {
    total: dossiers.length,
    niveau1: dossiers.filter(d => d.niveauGravite === 1).length,
    niveau2: dossiers.filter(d => d.niveauGravite === 2).length,
    niveau3: dossiers.filter(d => d.niveauGravite === 3).length,
    enConsultation: dossiers.filter(d => d.statut === 'en_consultation').length,
    enExamen: dossiers.filter(d => d.statut === 'en_examen').length,
    sortis: dossiers.filter(d => d.statut === 'sortie').length
  };

  if (isLoading) {
    return (
      <ProfessionalEstablishmentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Chargement des dossiers urgences...</p>
          </div>
        </div>
      </ProfessionalEstablishmentLayout>
    );
  }

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Siren className="h-6 w-6 text-red-600" />
              <h1 className="text-3xl font-bold tracking-tight">Dossiers Urgences</h1>
            </div>
            <p className="text-muted-foreground">Suivi des dossiers patients du service d'urgences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('Export sera implémenté')}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20" />
            <CardContent className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Niveau 1-2 (Critique)</p>
                  <p className="text-3xl font-bold text-red-600">{stats.niveau1 + stats.niveau2}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20" />
            <CardContent className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En consultation</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.enConsultation}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20" />
            <CardContent className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En examen</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.enExamen}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" />
            <CardContent className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sortis</p>
                  <p className="text-3xl font-bold text-green-600">{stats.sortis}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 flex-wrap">
              <Input 
                placeholder="Rechercher dossier, patient, médecin..." 
                className="flex-1 min-w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={niveauFilter}
                onChange={(e) => setNiveauFilter(e.target.value)}
                className="px-3 py-1 border rounded"
              >
                <option value="tous">Tous niveaux</option>
                <option value="1">Niveau 1 (Vital)</option>
                <option value="2">Niveau 2 (Très urgent)</option>
                <option value="3">Niveau 3 (Urgent)</option>
                <option value="4">Niveau 4 (Peu urgent)</option>
                <option value="5">Niveau 5 (Non urgent)</option>
              </select>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setNiveauFilter('tous');
                  setActiveTab('tous');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des dossiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dossiers Urgences
            </CardTitle>
            <CardDescription>
              {filteredDossiers.length} dossiers affichés
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start rounded-none border-b">
                <TabsTrigger value="tous">Tous ({dossiers.length})</TabsTrigger>
                <TabsTrigger value="en_consultation">En consultation ({stats.enConsultation})</TabsTrigger>
                <TabsTrigger value="en_examen">En examen ({stats.enExamen})</TabsTrigger>
                <TabsTrigger value="sortie">Sortis ({stats.sortis})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="p-4">
                {filteredDossiers.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun dossier trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDossiers.map((dossier) => (
                      <div key={dossier.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* En-tête */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm font-semibold text-red-600">
                                {dossier.numeroDossier}
                              </span>
                              <Badge className={getNiveauColor(dossier.niveauGravite)}>
                                Niveau {dossier.niveauGravite}
                              </Badge>
                              <Badge variant="secondary" className={getStatutColor(dossier.statut)}>
                                {dossier.statut.replace('_', ' ')}
                              </Badge>
                              {dossier.alertes.includes('URGENCE VITALE') && (
                                <Badge variant="destructive" className="animate-pulse">
                                  🚨 VITAL
                                </Badge>
                              )}
                              {!dossier.enregistrementAdminComplet && (
                                <Badge variant="outline" className="border-amber-500 text-amber-600">
                                  Admin incomplet
                                </Badge>
                              )}
                            </div>

                            {/* Patient */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Patient:</span>
                                <p className="font-medium">{dossier.patient.nom} {dossier.patient.prenom}</p>
                                <p className="text-xs text-muted-foreground">
                                  {dossier.patient.age} ans • {dossier.patient.sexe === 'M' ? 'Homme' : 'Femme'}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Arrivée:</span>
                                <p className="font-medium">
                                  {new Date(dossier.heureArrivee).toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getTempsEcoule(dossier.heureArrivee)}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Médecin:</span>
                                <p className="font-medium">{dossier.medecin?.nom || 'Non assigné'}</p>
                                {dossier.boxId && (
                                  <p className="text-xs text-muted-foreground">{dossier.boxId}</p>
                                )}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Contact:</span>
                                <p className="font-medium">{dossier.patient.telephone || 'N/A'}</p>
                              </div>
                            </div>

                            {/* Motif */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-2">
                              <p className="text-xs text-muted-foreground">Motif:</p>
                              <p className="text-sm">{dossier.motifConsultation}</p>
                            </div>

                            {/* Diagnostic et traitement */}
                            {(dossier.diagnostic || dossier.traitement) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {dossier.diagnostic && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Diagnostic:</p>
                                    <p className="text-sm">{dossier.diagnostic}</p>
                                  </div>
                                )}
                                {dossier.traitement && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Traitement:</p>
                                    <p className="text-sm">{dossier.traitement}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Constantes vitales */}
                            {dossier.constantesVitales && (
                              <div className="bg-blue-50 dark:bg-blue-950/20 rounded p-2">
                                <p className="text-xs text-muted-foreground mb-1">Constantes:</p>
                                <div className="flex gap-4 text-xs">
                                  {dossier.constantesVitales.tensionArterielle && (
                                    <span>
                                      TA: {dossier.constantesVitales.tensionArterielle.systolique}/{dossier.constantesVitales.tensionArterielle.diastolique}
                                    </span>
                                  )}
                                  {dossier.constantesVitales.frequenceCardiaque && (
                                    <span>FC: {dossier.constantesVitales.frequenceCardiaque} bpm</span>
                                  )}
                                  {dossier.constantesVitales.temperature && (
                                    <span>T°: {dossier.constantesVitales.temperature}°C</span>
                                  )}
                                  {dossier.constantesVitales.saturationO2 && (
                                    <span>SpO₂: {dossier.constantesVitales.saturationO2}%</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVoirDossier(dossier)}
                              disabled={loadingActions[`view_${dossier.id}`] === 'viewing'}
                            >
                              {loadingActions[`view_${dossier.id}`] === 'viewing' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleModifierDossier(dossier)}
                              disabled={loadingActions[`edit_${dossier.id}`] === 'editing'}
                            >
                              {loadingActions[`edit_${dossier.id}`] === 'editing' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Edit className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleTelechargerDossier(dossier)}
                              disabled={loadingActions[`download_${dossier.id}`] === 'downloading'}
                            >
                              {loadingActions[`download_${dossier.id}`] === 'downloading' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}