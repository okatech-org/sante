import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bed, Users, Clock, Calendar, AlertCircle, Plus,
  Building, TrendingUp, DollarSign, UserCheck,
  FileText, Search, Filter, Home, ArrowRight,
  Activity, CheckCircle, XCircle, AlertTriangle,
  BedDouble, UserPlus, LogOut, ClipboardList,
  Phone, MapPin, CreditCard, Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type {
  DossierHospitalisation,
  Chambre,
  StatistiquesHospitalisation,
  TransfertInterne
} from '@/types/hospitalisation.types';
import { toast } from 'sonner';
import { AdmissionModal } from './AdmissionModal';
import { GestionChambres } from './GestionChambres';

export function AccueilHospitalisation() {
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

  const [admissionsRecentes, setAdmissionsRecentes] = useState<DossierHospitalisation[]>([]);
  const [sortiesPrevues, setSortiesPrevues] = useState<DossierHospitalisation[]>([]);
  const [transfertsEnAttente, setTransfertsEnAttente] = useState<TransfertInterne[]>([]);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showGestionChambres, setShowGestionChambres] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('tous');

  // Données simulées
  useEffect(() => {
    // Admissions récentes
    setAdmissionsRecentes([
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
          contactUrgence: {
            nom: 'MOUSSAVOU Marie',
            telephone: '077234567',
            lien: 'Épouse'
          }
        },
        origine: 'urgences',
        dateAdmission: new Date().toISOString(),
        service: 'Cardiologie',
        medecinTraitant: {
          id: 'med1',
          nom: 'Dr. NZENGUE',
          specialite: 'Cardiologue'
        },
        motifAdmission: 'Insuffisance cardiaque décompensée',
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
          { type: 'consentement', nom: 'Consentement soins', statut: 'fourni' },
          { type: 'identite', nom: 'Carte identité', statut: 'fourni' },
          { type: 'assurance', nom: 'Carte CNAMGS', statut: 'fourni' }
        ],
        statut: 'pre_admission',
        notes: ['Patient transféré des urgences', 'Chambre VIP demandée'],
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
          contactUrgence: {
            nom: 'OYONO Paul',
            telephone: '066890123',
            lien: 'Époux'
          }
        },
        origine: 'programmee',
        dateAdmission: new Date().toISOString(),
        dateSortiePrevue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
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
          { type: 'consentement', nom: 'Consentement intervention', statut: 'fourni' },
          { type: 'identite', nom: 'Carte identité', statut: 'fourni' },
          { type: 'assurance', nom: 'Carte CNAMGS Maternité', statut: 'fourni' }
        ],
        statut: 'admis',
        notes: ['Grossesse 100% prise en charge'],
        historique: []
      }
    ]);

    // Sorties prévues
    setSortiesPrevues([
      {
        id: '3',
        numeroAdmission: 'HOS-20250128-015',
        patientId: 'pat3',
        patientInfo: {
          nom: 'BENGONE',
          prenom: 'Pierre',
          dateNaissance: '1960-05-10',
          sexe: 'M',
          telephone: '074567890',
          contactUrgence: {
            nom: 'BENGONE Marie',
            telephone: '074678901',
            lien: 'Fille'
          }
        },
        origine: 'hdj',
        dateAdmission: '2025-01-28T08:00:00',
        dateSortiePrevue: new Date().toISOString(),
        chambreId: 'ch-201',
        service: 'Chirurgie',
        medecinTraitant: {
          id: 'med3',
          nom: 'Dr. OKEMBA',
          specialite: 'Chirurgien'
        },
        motifAdmission: 'Appendicectomie',
        diagnostic: 'Appendicite aiguë',
        assurance: {
          type: 'CNSS',
          numeroAssure: 'CNSS456789',
          plafondRestant: 1500000,
          priseEnCharge: 80,
          statut: 'verifiee'
        },
        frais: {
          estimationSejour: 600000,
          acompteVerse: 600000,
          resteAPayer: 0,
          factures: [
            {
              id: 'f1',
              date: '2025-01-28',
              montant: 600000,
              description: 'Séjour + intervention',
              payee: true
            }
          ]
        },
        documents: [
          { type: 'consentement', nom: 'Consentement', statut: 'fourni' },
          { type: 'decharge', nom: 'Décharge sortie', statut: 'en_attente' }
        ],
        statut: 'sortie_prevue',
        notes: ['Évolution favorable', 'RDV contrôle dans 1 semaine'],
        historique: []
      }
    ]);

    // Transferts en attente
    setTransfertsEnAttente([
      {
        id: 't1',
        patientId: 'pat4',
        patientNom: 'NDONG Michel',
        deService: 'Urgences',
        deChambre: 'URG-05',
        versService: 'Cardiologie',
        dateTransfert: new Date().toISOString(),
        motif: 'Prise en charge spécialisée requise',
        statut: 'approuve',
        demandePar: 'Dr. NGUEMA',
        approuvePar: 'Dr. NZENGUE'
      }
    ]);
  }, []);

  const handleNouvelleAdmission = (data: any) => {
    // Traitement de la nouvelle admission
    console.log('Nouvelle admission:', data);
    toast.success('Patient admis avec succès');
    setShowAdmissionModal(false);
  };

  const handleSortiePatient = (dossier: DossierHospitalisation) => {
    toast.success(`Sortie de ${dossier.patientInfo.nom} ${dossier.patientInfo.prenom} enregistrée`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header avec titre et actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bed className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold tracking-tight">Accueil Hospitalisation</h1>
          </div>
          <p className="text-muted-foreground">Gestion des admissions et chambres d'hospitalisation</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/50 px-3 py-1">
            <Activity className="mr-1 h-3 w-3" />
            {stats.tauxOccupation}% occupation
          </Badge>
          <Button 
            variant="outline"
            onClick={() => setShowGestionChambres(true)}
          >
            <Bed className="mr-2 h-4 w-4" />
            Gérer les chambres
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            onClick={() => setShowAdmissionModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle admission
          </Button>
        </div>
      </div>

      {/* Alertes */}
      {transfertsEnAttente.length > 0 && (
        <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-950/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">⚠️ Transferts en attente</div>
            {transfertsEnAttente.map(transfert => (
              <div key={transfert.id} className="text-sm">
                • {transfert.patientNom} : {transfert.deService} → {transfert.versService}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Chambres libres */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-green-100 dark:bg-green-950/50">
                <Bed className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Libres</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.chambresLibres}</p>
              <p className="text-xs text-green-600 mt-1">Disponibles</p>
            </div>
          </CardContent>
        </Card>

        {/* Chambres occupées */}
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 p-3 rounded-full bg-blue-100 dark:bg-blue-950/50">
                <BedDouble className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Occupées</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.chambresOccupees}</p>
              <p className="text-xs text-blue-600 mt-1">/{stats.chambresTotal}</p>
            </div>
          </CardContent>
        </Card>

        {/* Admissions du jour */}
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
                <LogOut className="h-6 w-6 text-orange-600" />
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

        {/* Revenus du jour */}
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

      {/* Actions et filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-1">
          <Input 
            placeholder="Rechercher un patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tableaux principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admissions récentes */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Admissions récentes</CardTitle>
                  <p className="text-sm text-muted-foreground">Patients en cours d'admission</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white dark:bg-gray-950">
                {admissionsRecentes.length} patients
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {admissionsRecentes.map(admission => (
                <div 
                  key={admission.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={admission.statut === 'admis' ? 'success' : 'secondary'} className="text-xs">
                          {admission.statut === 'admis' ? 'Admis' : 'Pré-admission'}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            admission.origine === 'urgences' && "border-red-300 bg-red-50 text-red-700 dark:bg-red-950/30",
                            admission.origine === 'programmee' && "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/30",
                            admission.origine === 'hdj' && "border-green-300 bg-green-50 text-green-700 dark:bg-green-950/30"
                          )}
                        >
                          {admission.origine === 'urgences' && '🚨 Urgences'}
                          {admission.origine === 'programmee' && '📅 Programmée'}
                          {admission.origine === 'hdj' && '🏥 HDJ'}
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm truncate">
                        {admission.patientInfo.nom} {admission.patientInfo.prenom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {admission.numeroAdmission} • {admission.service}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {admission.medecinTraitant.nom}
                        </span>
                        {admission.chambreId && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Chambre {admission.chambreId}
                          </span>
                        )}
                      </div>
                      {admission.assurance.statut === 'verifiee' && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            {admission.assurance.type} - {admission.assurance.priseEnCharge}%
                          </span>
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="shrink-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {admission.statut === 'pre_admission' && !admission.chambreId && (
                    <Button 
                      size="sm" 
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowGestionChambres(true)}
                    >
                      <Bed className="mr-2 h-3 w-3" />
                      Attribuer chambre
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sorties prévues */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <LogOut className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Sorties du jour</CardTitle>
                  <p className="text-sm text-muted-foreground">Patients en préparation de sortie</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white dark:bg-gray-950">
                {sortiesPrevues.length} sorties
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {sortiesPrevues.map(sortie => (
                <div 
                  key={sortie.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-950/50">
                          Sortie prévue
                        </Badge>
                        {sortie.frais.resteAPayer === 0 ? (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Facture réglée
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {formatCurrency(sortie.frais.resteAPayer)} à payer
                          </Badge>
                        )}
                      </div>
                      <p className="font-semibold text-sm truncate">
                        {sortie.patientInfo.nom} {sortie.patientInfo.prenom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sortie.numeroAdmission} • {sortie.service}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Admis le {format(new Date(sortie.dateAdmission), 'dd/MM', { locale: fr })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          Chambre {sortie.chambreId}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {sortie.documents.some(d => d.statut === 'en_attente') && (
                          <Badge variant="outline" className="text-xs border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/30">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Documents manquants
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      Documents
                    </Button>
                    {sortie.frais.resteAPayer > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                      >
                        <CreditCard className="mr-2 h-3 w-3" />
                        Facturation
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={() => handleSortiePatient(sortie)}
                    >
                      <LogOut className="mr-2 h-3 w-3" />
                      Valider sortie
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par service */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Répartition par service</CardTitle>
                <p className="text-sm text-muted-foreground">Occupation des lits par département</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stats.patientsParService).map(([service, count]) => (
              <div key={service} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{service}</p>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">patients</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAdmissionModal && (
        <AdmissionModal
          open={showAdmissionModal}
          onClose={() => setShowAdmissionModal(false)}
          onComplete={handleNouvelleAdmission}
        />
      )}

      {showGestionChambres && (
        <GestionChambres
          open={showGestionChambres}
          onClose={() => setShowGestionChambres(false)}
        />
      )}
    </div>
  );
}
