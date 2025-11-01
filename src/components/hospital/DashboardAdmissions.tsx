import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bed, Users, TrendingUp, Clock, UserPlus, Building, Calendar,
  AlertCircle, CheckCircle, MapPin, Stethoscope, Phone, CreditCard,
  ArrowRight, Filter, Search, Activity, DollarSign, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DossierHospitalisation, StatistiquesHospitalisation } from '@/types/hospitalisation.types';
import { toast } from 'sonner';

export function DashboardAdmissions() {
  const [stats, setStats] = useState<StatistiquesHospitalisation>({
    chambresTotal: 150,
    chambresOccupees: 98,
    chambresLibres: 42,
    chambresNettoyage: 7,
    chambresMaintenance: 3,
    tauxOccupation: 65.3,
    admissionsJour: 12,
    sortiesPrevues: 8,
    dureeSejourMoyenne: 4.5,
    patientsParService: {
      'Médecine générale': 25,
      'Chirurgie': 18,
      'Maternité': 15,
      'Pédiatrie': 12,
      'Cardiologie': 10,
      'Urgences': 18
    },
    revenus: {
      jour: 2450000,
      mois: 73500000
    }
  });

  const [admissionsEnCours, setAdmissionsEnCours] = useState<DossierHospitalisation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tous');

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = () => {
    // Simulation données
    const mockAdmissions: DossierHospitalisation[] = [
      {
        id: '1',
        numeroAdmission: 'HOS-20250131-001',
        patientId: 'pat1',
        patientInfo: {
          nom: 'MOUSSAVOU',
          prenom: 'Jean',
          dateNaissance: '1975-03-15',
          sexe: 'M',
          telephone: '077123456',
          numeroAssure: 'GA123456789',
          contactUrgence: {
            nom: 'MOUSSAVOU Marie',
            telephone: '077234567',
            lien: 'Épouse'
          }
        },
        origine: 'urgences',
        dateAdmission: new Date().toISOString(),
        chambreId: 'ch-203',
        service: 'Cardiologie',
        medecinTraitant: {
          id: 'med1',
          nom: 'Dr. NZENGUE',
          specialite: 'Cardiologue'
        },
        motifAdmission: 'Insuffisance cardiaque décompensée',
        diagnostic: 'IC décompensée sur cardiomyopathie dilatée',
        assurance: {
          type: 'CNAMGS',
          numeroAssure: 'GA123456789',
          plafondRestant: 2500000,
          priseEnCharge: 80,
          statut: 'verifiee'
        },
        frais: {
          estimationSejour: 450000,
          acompteVerse: 90000,
          resteAPayer: 360000,
          factures: []
        },
        documents: [
          { type: 'consentement', nom: 'Consentement', statut: 'fourni' },
          { type: 'identite', nom: 'CNI', statut: 'fourni' },
          { type: 'assurance', nom: 'Carte CNAMGS', statut: 'fourni' }
        ],
        statut: 'admis',
        notes: [],
        historique: []
      },
      {
        id: '2',
        numeroAdmission: 'HOS-20250131-002',
        patientId: 'pat2',
        patientInfo: {
          nom: 'OYONO',
          prenom: 'Sylvie',
          dateNaissance: '1990-08-22',
          sexe: 'F',
          telephone: '066789012',
          numeroAssure: 'GA987654321',
          contactUrgence: {
            nom: 'OYONO Paul',
            telephone: '066890123',
            lien: 'Époux'
          }
        },
        origine: 'programmee',
        dateAdmission: new Date().toISOString(),
        dateSortiePrevue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        chambreId: 'ch-301',
        service: 'Maternité',
        medecinTraitant: {
          id: 'med2',
          nom: 'Dr. MBOUMBA',
          specialite: 'Gynécologue'
        },
        motifAdmission: 'Césarienne programmée',
        assurance: {
          type: 'CNAMGS',
          numeroAssure: 'GA987654321',
          plafondRestant: 3000000,
          priseEnCharge: 100,
          statut: 'verifiee'
        },
        frais: {
          estimationSejour: 800000,
          acompteVerse: 0,
          resteAPayer: 0,
          factures: []
        },
        documents: [
          { type: 'consentement', nom: 'Consentement', statut: 'fourni' },
          { type: 'identite', nom: 'CNI', statut: 'fourni' },
          { type: 'assurance', nom: 'Carte Maternité', statut: 'fourni' }
        ],
        statut: 'en_cours',
        notes: ['Grossesse 100% prise en charge'],
        historique: []
      },
      {
        id: '3',
        numeroAdmission: 'HOS-20250130-025',
        patientId: 'pat3',
        patientInfo: {
          nom: 'NDONG',
          prenom: 'Michel',
          dateNaissance: '1982-11-05',
          sexe: 'M',
          telephone: '062345678',
          contactUrgence: {
            nom: 'NDONG Claire',
            telephone: '062456789',
            lien: 'Sœur'
          }
        },
        origine: 'hdj',
        dateAdmission: '2025-01-30T10:00:00',
        chambreId: 'ch-201',
        service: 'Chirurgie',
        medecinTraitant: {
          id: 'med3',
          nom: 'Dr. OKEMBA',
          specialite: 'Chirurgien'
        },
        motifAdmission: 'Cholécystectomie',
        diagnostic: 'Lithiase vésiculaire compliquée',
        assurance: {
          type: 'CNSS',
          numeroAssure: 'CNSS123456',
          plafondRestant: 1800000,
          priseEnCharge: 80,
          statut: 'verifiee'
        },
        frais: {
          estimationSejour: 550000,
          acompteVerse: 110000,
          resteAPayer: 440000,
          factures: [
            {
              id: 'f1',
              date: '2025-01-30',
              montant: 110000,
              description: 'Acompte admission',
              payee: true
            }
          ]
        },
        documents: [
          { type: 'consentement', nom: 'Consentement opération', statut: 'fourni' },
          { type: 'identite', nom: 'CNI', statut: 'fourni' },
          { type: 'assurance', nom: 'Carte CNSS', statut: 'fourni' }
        ],
        statut: 'en_cours',
        notes: [],
        historique: []
      }
    ];

    setAdmissionsEnCours(mockAdmissions);
  };

  const filteredAdmissions = admissionsEnCours.filter(admission => {
    if (searchQuery && !admission.patientInfo.nom.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'pre_admission' && admission.statut !== 'pre_admission') return false;
    if (activeTab === 'admis' && admission.statut !== 'admis') return false;
    if (activeTab === 'en_cours' && admission.statut !== 'en_cours') return false;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'pre_admission':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50';
      case 'admis':
        return 'bg-green-100 text-green-700 dark:bg-green-950/50';
      case 'en_cours':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/50';
      case 'sortie_prevue':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/50';
      default:
        return '';
    }
  };

  const getDureeHospitalisation = (dateAdmission: string) => {
    const now = new Date();
    const admission = new Date(dateAdmission);
    const diffMs = now.getTime() - admission.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}j ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Admissions</h1>
          </div>
          <p className="text-muted-foreground">Suivi temps réel des hospitalisations en cours</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            {admissionsEnCours.length} patients hospitalisés
          </Badge>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Taux occupation */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-blue-100 dark:bg-blue-950/50">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Taux occupation</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.tauxOccupation}%</p>
              <p className="text-xs text-blue-600 mt-1">Optimal</p>
            </div>
          </CardContent>
        </Card>

        {/* Chambres occupées */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-green-100 dark:bg-green-950/50">
                <Bed className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Occupées</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.chambresOccupees}</p>
              <p className="text-xs text-green-600 mt-1">/{stats.chambresTotal}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admissions jour */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-950/50">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Admissions</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.admissionsJour}</p>
              <p className="text-xs text-purple-600 mt-1">Aujourd'hui</p>
            </div>
          </CardContent>
        </Card>

        {/* Sorties prévues */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-orange-100 dark:bg-orange-950/50">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Sorties</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.sortiesPrevues}</p>
              <p className="text-xs text-orange-600 mt-1">Prévues</p>
            </div>
          </CardContent>
        </Card>

        {/* Durée moyenne */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-cyan-100 dark:bg-cyan-950/50">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Durée moy.</p>
              <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">{stats.dureeSejourMoyenne}</p>
              <p className="text-xs text-cyan-600 mt-1">jours</p>
            </div>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Revenus</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {formatCurrency(stats.revenus.jour).split(' ')[0]}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Aujourd'hui</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Rechercher un patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>

      {/* Liste des admissions avec tabs */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patients Hospitalisés
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="tous">Tous ({admissionsEnCours.length})</TabsTrigger>
              <TabsTrigger value="pre_admission">
                Pré-admission ({admissionsEnCours.filter(a => a.statut === 'pre_admission').length})
              </TabsTrigger>
              <TabsTrigger value="admis">
                Admis ({admissionsEnCours.filter(a => a.statut === 'admis').length})
              </TabsTrigger>
              <TabsTrigger value="en_cours">
                En cours ({admissionsEnCours.filter(a => a.statut === 'en_cours').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-4">
              <div className="space-y-3">
                {filteredAdmissions.map(admission => (
                  <Card key={admission.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          {/* En-tête */}
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {admission.patientInfo.nom} {admission.patientInfo.prenom}
                                </h3>
                                <Badge className={cn("text-xs", getStatutColor(admission.statut))}>
                                  {admission.statut === 'pre_admission' && 'Pré-admission'}
                                  {admission.statut === 'admis' && 'Admis'}
                                  {admission.statut === 'en_cours' && 'En cours'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {admission.origine === 'urgences' && '🚨 Urgences'}
                                  {admission.origine === 'hdj' && '🏥 HDJ'}
                                  {admission.origine === 'programmee' && '📅 Programmée'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {admission.numeroAdmission} • Durée : {getDureeHospitalisation(admission.dateAdmission)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{admission.service}</p>
                              {admission.chambreId && (
                                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                  <MapPin className="h-3 w-3" />
                                  Chambre {admission.chambreId}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Infos détaillées */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Médecin</p>
                              <p className="font-medium flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                {admission.medecinTraitant.nom}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Contact</p>
                              <p className="font-medium flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {admission.patientInfo.telephone}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Assurance</p>
                              <p className="font-medium flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {admission.assurance.type} {admission.assurance.priseEnCharge}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Reste à payer</p>
                              <p className={cn(
                                "font-medium flex items-center gap-1",
                                admission.frais.resteAPayer === 0 ? "text-green-600" : "text-orange-600"
                              )}>
                                <CreditCard className="h-3 w-3" />
                                {formatCurrency(admission.frais.resteAPayer)}
                              </p>
                            </div>
                          </div>

                          {/* Motif */}
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Motif d'admission</p>
                            <p className="text-sm">{admission.motifAdmission}</p>
                            {admission.diagnostic && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Diagnostic : {admission.diagnostic}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredAdmissions.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune admission trouvée</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Répartition par service */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Répartition par Service
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.patientsParService).map(([service, count]) => (
              <div key={service} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-center hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                <p className="text-xs text-muted-foreground mb-1 truncate" title={service}>{service}</p>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">patients</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
