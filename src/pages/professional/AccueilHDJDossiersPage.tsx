import { useState, useEffect } from 'react';
import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Filter, Download, Eye, Edit, Loader2, CheckCircle, AlertTriangle, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DossierHDJ {
  id: string;
  patient: string;
  service: string;
  medecin: string;
  heure: string;
  status: 'en_attente' | 'en_cours' | 'termine' | 'annule';
  cnamgs: 'verifie' | 'non_verifie' | 'rejete';
  reste: number;
  dateCreation: string;
  motif: string;
  diagnostics?: string[];
  prescriptions?: string[];
}

export default function AccueilHDJDossiersPage() {
  const [dossiers, setDossiers] = useState<DossierHDJ[]>([]);
  const [filteredDossiers, setFilteredDossiers] = useState<DossierHDJ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [serviceFilter, setServiceFilter] = useState<string>('tous');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tous');

  // Données initiales
  const initialDossiers: DossierHDJ[] = [
    {
      id: 'HDJ-20250131-001',
      patient: 'Marie NZÉ',
      service: 'Cardiologie',
      medecin: 'Dr. MBELE',
      heure: '09:30',
      status: 'en_cours',
      cnamgs: 'verifie',
      reste: 15000,
      dateCreation: '2025-01-31T09:30:00',
      motif: 'Consultation cardiologique de contrôle',
      diagnostics: ['Hypertension artérielle', 'Suivi traitement'],
      prescriptions: ['Amlodipine 5mg', 'Contrôle tensionnel']
    },
    {
      id: 'HDJ-20250131-002',
      patient: 'Jean DUPONT',
      service: 'Consultation générale',
      medecin: 'Dr. OYONO',
      heure: '09:00',
      status: 'termine',
      cnamgs: 'verifie',
      reste: 5000,
      dateCreation: '2025-01-31T09:00:00',
      motif: 'Contrôle diabète',
      diagnostics: ['Diabète type 2 équilibré'],
      prescriptions: ['Metformine 850mg', 'Régime diabétique']
    },
    {
      id: 'HDJ-20250131-003',
      patient: 'Pierre MBELE',
      service: 'Radiologie',
      medecin: 'Dr. NZE',
      heure: '10:00',
      status: 'en_attente',
      cnamgs: 'non_verifie',
      reste: 35000,
      dateCreation: '2025-01-31T10:00:00',
      motif: 'Radio thorax - suspicion pneumonie'
    },
    {
      id: 'HDJ-20250131-004',
      patient: 'Sophie OYONO',
      service: 'Pédiatrie',
      medecin: 'Dr. OBIANG',
      heure: '10:30',
      status: 'en_cours',
      cnamgs: 'verifie',
      reste: 0,
      dateCreation: '2025-01-31T10:30:00',
      motif: 'Consultation pédiatrique - vaccination',
      diagnostics: ['Enfant en bonne santé'],
      prescriptions: ['Vaccination DTC', 'Prochain RDV dans 2 mois']
    },
    {
      id: 'HDJ-20250131-005',
      patient: 'Paul OBIANG',
      service: 'Gynécologie',
      medecin: 'Dr. MBOUMBA',
      heure: '11:00',
      status: 'annule',
      cnamgs: 'rejete',
      reste: 0,
      dateCreation: '2025-01-31T11:00:00',
      motif: 'Consultation gynécologique - annulée patient absent'
    }
  ];

  const services = ['Consultation générale', 'Cardiologie', 'Radiologie', 'Pédiatrie', 'Gynécologie'];
  const statuses = ['en_attente', 'en_cours', 'termine', 'annule'];

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
        dossier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.medecin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dossier.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== 'tous') {
      filtered = filtered.filter(dossier => dossier.status === activeTab);
    }

    if (serviceFilter !== 'tous') {
      filtered = filtered.filter(dossier => dossier.service === serviceFilter);
    }

    setFilteredDossiers(filtered);
  }, [dossiers, searchQuery, activeTab, serviceFilter]);

  // Gestionnaires
  const handleVoirDossier = async (dossier: DossierHDJ) => {
    const actionKey = `view_${dossier.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'viewing'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.info(`Affichage du dossier ${dossier.id}`);
      // TODO: Ouvrir modal détaillé du dossier
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

  const handleModifierDossier = async (dossier: DossierHDJ) => {
    const actionKey = `edit_${dossier.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'editing'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info(`Modification du dossier ${dossier.id}`);
      // TODO: Ouvrir modal d'édition
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

  const handleTelechargerDossier = async (dossier: DossierHDJ) => {
    const actionKey = `download_${dossier.id}`;
    setLoadingActions(prev => ({...prev, [actionKey]: 'downloading'}));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Dossier ${dossier.id} téléchargé`);
      // TODO: Générer et télécharger le PDF
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

  const handleExporterTous = () => {
    toast.info('Export global sera implémenté prochainement');
  };

  const handleNouveauDossier = () => {
    toast.info('Création nouveau dossier sera implémentée prochainement');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GA').format(amount) + ' FCFA';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'termine':
        return <Badge className="bg-green-500 text-white">Terminé</Badge>;
      case 'en_cours':
        return <Badge className="bg-blue-500 text-white">En cours</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-500 text-white">En attente</Badge>;
      case 'annule':
        return <Badge className="bg-gray-500 text-white">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCnamgsBadge = (status: string) => {
    switch(status) {
      case 'verifie':
        return <Badge variant="outline" className="border-green-500 text-green-600">CNAMGS ✓</Badge>;
      case 'rejete':
        return <Badge variant="outline" className="border-red-500 text-red-600">CNAMGS ✗</Badge>;
      case 'non_verifie':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: dossiers.length,
    termine: dossiers.filter(d => d.status === 'termine').length,
    enCours: dossiers.filter(d => d.status === 'en_cours').length,
    enAttente: dossiers.filter(d => d.status === 'en_attente').length,
    annule: dossiers.filter(d => d.status === 'annule').length,
    montantTotal: dossiers.reduce((sum, d) => sum + d.reste, 0),
    cnamgsVerifies: dossiers.filter(d => d.cnamgs === 'verifie').length
  };

  if (isLoading) {
    return (
      <ProfessionalEstablishmentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Chargement des dossiers...</p>
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

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dossiers HDJ</h1>
            <p className="text-muted-foreground">Gestion des dossiers d'accueil de l'Hôpital du Jour</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExporterTous}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={handleNouveauDossier}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau dossier
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dossiers total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CNAMGS vérifiés</p>
                  <p className="text-2xl font-bold">{Math.round((stats.cnamgsVerifies / stats.total) * 100)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reste à charge total</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.montantTotal)}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                  <p className="text-2xl font-bold">{stats.termine}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher un dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input 
                placeholder="Numéro, nom du patient, médecin..." 
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-1 border rounded"
              >
                <option value="tous">Tous les services</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setServiceFilter('tous');
                  setActiveTab('tous');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste avec tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Dossiers du jour</CardTitle>
            <CardDescription>
              {filteredDossiers.length} dossiers trouvés
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start rounded-none border-b">
                <TabsTrigger value="tous">Tous ({stats.total})</TabsTrigger>
                <TabsTrigger value="en_attente">En attente ({stats.enAttente})</TabsTrigger>
                <TabsTrigger value="en_cours">En cours ({stats.enCours})</TabsTrigger>
                <TabsTrigger value="termine">Terminés ({stats.termine})</TabsTrigger>
                <TabsTrigger value="annule">Annulés ({stats.annule})</TabsTrigger>
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
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-mono text-sm font-semibold text-blue-600">
                                {dossier.id}
                              </span>
                              {getStatusBadge(dossier.status)}
                              {getCnamgsBadge(dossier.cnamgs)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Patient:</span>
                                <span className="ml-2 font-medium">{dossier.patient}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Service:</span>
                                <span className="ml-2">{dossier.service}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Médecin:</span>
                                <span className="ml-2">{dossier.medecin}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Heure:</span>
                                <span className="ml-2">{dossier.heure}</span>
                              </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-2">
                              <p className="text-xs text-muted-foreground">Motif:</p>
                              <p className="text-sm">{dossier.motif}</p>
                            </div>

                            {dossier.reste > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Reste à charge:</span>
                                <Badge variant="outline" className="border-orange-500 text-orange-600">
                                  {formatCurrency(dossier.reste)}
                                </Badge>
                              </div>
                            )}

                            {dossier.diagnostics && dossier.diagnostics.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Diagnostics:</p>
                                <div className="flex flex-wrap gap-1">
                                  {dossier.diagnostics.map((diag, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {diag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

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