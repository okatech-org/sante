import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LogOut, Calendar, FileText, CreditCard, CheckCircle, AlertTriangle,
  XCircle, MapPin, Stethoscope, Phone, Clock, User, Printer,
  Search, Filter, AlertCircle, Building, Activity, DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DossierHospitalisation } from '@/types/hospitalisation.types';
import { toast } from 'sonner';

export function SortiesDuJour() {
  const [sortiesPrevues, setSortiesPrevues] = useState<DossierHospitalisation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('prevues');
  const [selectedDossier, setSelectedDossier] = useState<DossierHospitalisation | null>(null);

  useEffect(() => {
    loadSorties();
  }, []);

  const loadSorties = () => {
    // Simulation données
    const mockSorties: DossierHospitalisation[] = [
      {
        id: '1',
        numeroAdmission: 'HOS-20250128-015',
        patientId: 'pat1',
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
          id: 'med1',
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
          { type: 'decharge', nom: 'Décharge sortie', statut: 'fourni' },
          { type: 'identite', nom: 'CNI', statut: 'fourni' }
        ],
        statut: 'sortie_prevue',
        notes: ['Évolution favorable', 'RDV contrôle dans 1 semaine'],
        historique: []
      },
      {
        id: '2',
        numeroAdmission: 'HOS-20250129-018',
        patientId: 'pat2',
        patientInfo: {
          nom: 'NZENGUE',
          prenom: 'Marie',
          dateNaissance: '1985-07-15',
          sexe: 'F',
          telephone: '066123456',
          contactUrgence: {
            nom: 'NZENGUE Paul',
            telephone: '066234567',
            lien: 'Époux'
          }
        },
        origine: 'programmee',
        dateAdmission: '2025-01-29T14:00:00',
        dateSortiePrevue: new Date().toISOString(),
        chambreId: 'ch-302',
        service: 'Maternité',
        medecinTraitant: {
          id: 'med2',
          nom: 'Dr. MBOUMBA',
          specialite: 'Gynécologue'
        },
        motifAdmission: 'Accouchement normal',
        assurance: {
          type: 'CNAMGS',
          numeroAssure: 'GA789456123',
          plafondRestant: 2800000,
          priseEnCharge: 100,
          statut: 'verifiee'
        },
        frais: {
          estimationSejour: 400000,
          acompteVerse: 0,
          resteAPayer: 0,
          factures: []
        },
        documents: [
          { type: 'consentement', nom: 'Consentement', statut: 'fourni' },
          { type: 'decharge', nom: 'Décharge sortie', statut: 'en_attente' },
          { type: 'identite', nom: 'CNI', statut: 'fourni' },
          { type: 'autre', nom: 'Acte naissance bébé', statut: 'en_attente' }
        ],
        statut: 'sortie_prevue',
        notes: ['Maternité 100%', 'Déclaration naissance à faire'],
        historique: []
      },
      {
        id: '3',
        numeroAdmission: 'HOS-20250127-012',
        patientId: 'pat3',
        patientInfo: {
          nom: 'OBIANG',
          prenom: 'Jacques',
          dateNaissance: '1978-03-20',
          sexe: 'M',
          telephone: '077987654',
          contactUrgence: {
            nom: 'OBIANG Sophie',
            telephone: '077876543',
            lien: 'Épouse'
          }
        },
        origine: 'urgences',
        dateAdmission: '2025-01-27T06:00:00',
        dateSortiePrevue: new Date().toISOString(),
        chambreId: 'ch-203',
        service: 'Cardiologie',
        medecinTraitant: {
          id: 'med3',
          nom: 'Dr. NZENGUE',
          specialite: 'Cardiologue'
        },
        motifAdmission: 'Infarctus du myocarde',
        diagnostic: 'IDM antérieur étendu, stent posé',
        assurance: {
          type: 'CNAMGS',
          numeroAssure: 'GA654321987',
          plafondRestant: 1200000,
          priseEnCharge: 80,
          statut: 'verifiee'
        },
        frais: {
          estimationSejour: 1200000,
          acompteVerse: 240000,
          resteAPayer: 960000,
          factures: [
            {
              id: 'f1',
              date: '2025-01-27',
              montant: 240000,
              description: 'Acompte',
              payee: true
            },
            {
              id: 'f2',
              date: '2025-01-31',
              montant: 960000,
              description: 'Solde hospitalisation',
              payee: false
            }
          ]
        },
        documents: [
          { type: 'consentement', nom: 'Consentement', statut: 'fourni' },
          { type: 'decharge', nom: 'Décharge sortie', statut: 'en_attente' },
          { type: 'identite', nom: 'CNI', statut: 'fourni' },
          { type: 'autre', nom: 'Ordonnance sortie', statut: 'en_attente' }
        ],
        statut: 'sortie_prevue',
        notes: ['Sortie contre avis médical si refus paiement'],
        historique: []
      }
    ];

    setSortiesPrevues(mockSorties);
  };

  const filteredSorties = sortiesPrevues.filter(sortie => {
    if (searchQuery && !sortie.patientInfo.nom.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'prets' && (sortie.frais.resteAPayer > 0 || sortie.documents.some(d => d.statut === 'en_attente'))) {
      return false;
    }
    if (activeTab === 'incomplets' && sortie.frais.resteAPayer === 0 && !sortie.documents.some(d => d.statut === 'en_attente')) {
      return false;
    }
    return true;
  });

  const stats = {
    total: sortiesPrevues.length,
    prets: sortiesPrevues.filter(s => s.frais.resteAPayer === 0 && !s.documents.some(d => d.statut === 'en_attente')).length,
    factures: sortiesPrevues.filter(s => s.frais.resteAPayer > 0).length,
    documents: sortiesPrevues.filter(s => s.documents.some(d => d.statut === 'en_attente')).length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GA', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDureeSejour = (dateAdmission: string) => {
    const now = new Date();
    const admission = new Date(dateAdmission);
    const diffMs = now.getTime() - admission.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleValiderSortie = (dossier: DossierHospitalisation) => {
    if (dossier.frais.resteAPayer > 0) {
      toast.error('Facture non réglée. Impossible de valider la sortie.');
      return;
    }
    if (dossier.documents.some(d => d.statut === 'en_attente')) {
      toast.error('Documents manquants. Impossible de valider la sortie.');
      return;
    }
    toast.success(`Sortie de ${dossier.patientInfo.nom} ${dossier.patientInfo.prenom} validée`);
    // Ici, mise à jour du statut dans la base de données
  };

  const handleImprimerDocuments = (dossier: DossierHospitalisation) => {
    toast.info('Impression des documents de sortie...');
    // Logique d'impression
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="h-6 w-6 text-orange-600" />
            <h1 className="text-3xl font-bold tracking-tight">Sorties du Jour</h1>
          </div>
          <p className="text-muted-foreground">Préparation et validation des sorties d'hospitalisation</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            {stats.total} sorties prévues
          </Badge>
          <Badge variant="default" className="bg-green-600 px-3 py-1">
            {stats.prets} prêts
          </Badge>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total sorties</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.total}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-950/50">
                <LogOut className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prêts</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.prets}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-950/50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Factures en attente</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-400">{stats.factures}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/50">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5" />
          <CardContent className="relative p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents manquants</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{stats.documents}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-950/50">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <div className="flex gap-3">
        <Input
          placeholder="Rechercher un patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>

      {/* Liste des sorties avec tabs */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sorties Planifiées
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="prevues">
                Toutes ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="prets">
                Prêtes ({stats.prets})
              </TabsTrigger>
              <TabsTrigger value="incomplets">
                Incomplètes ({stats.total - stats.prets})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-4">
              <div className="space-y-3">
                {filteredSorties.map(sortie => {
                  const isPret = sortie.frais.resteAPayer === 0 && !sortie.documents.some(d => d.statut === 'en_attente');
                  const documentsManquants = sortie.documents.filter(d => d.statut === 'en_attente');
                  
                  return (
                    <Card key={sortie.id} className={cn(
                      "hover:shadow-md transition-all",
                      isPret && "border-l-4 border-l-green-500"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            {/* En-tête */}
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">
                                    {sortie.patientInfo.nom} {sortie.patientInfo.prenom}
                                  </h3>
                                  {isPret ? (
                                    <Badge className="bg-green-100 text-green-700">
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Prêt
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="bg-red-100 text-red-700">
                                      <AlertTriangle className="mr-1 h-3 w-3" />
                                      Incomplet
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {getDureeSejour(sortie.dateAdmission)} jours
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {sortie.numeroAdmission} • Sortie prévue aujourd'hui
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{sortie.service}</p>
                                {sortie.chambreId && (
                                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Chambre {sortie.chambreId}
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
                                  {sortie.medecinTraitant.nom}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Contact</p>
                                <p className="font-medium flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {sortie.patientInfo.telephone}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Assurance</p>
                                <p className="font-medium flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {sortie.assurance.type}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Reste à payer</p>
                                <p className={cn(
                                  "font-medium flex items-center gap-1",
                                  sortie.frais.resteAPayer === 0 ? "text-green-600" : "text-red-600"
                                )}>
                                  <DollarSign className="h-3 w-3" />
                                  {formatCurrency(sortie.frais.resteAPayer)}
                                </p>
                              </div>
                            </div>

                            {/* Documents manquants */}
                            {documentsManquants.length > 0 && (
                              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
                                      Documents manquants
                                    </p>
                                    <ul className="text-sm text-amber-700 dark:text-amber-400 mt-1 space-y-1">
                                      {documentsManquants.map((doc, idx) => (
                                        <li key={idx} className="flex items-center gap-1">
                                          <XCircle className="h-3 w-3" />
                                          {doc.nom}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Facture impayée */}
                            {sortie.frais.resteAPayer > 0 && (
                              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-red-600" />
                                  <p className="text-sm font-medium text-red-900 dark:text-red-300">
                                    Facture non réglée : {formatCurrency(sortie.frais.resteAPayer)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleImprimerDocuments(sortie)}
                              >
                                <Printer className="mr-2 h-3 w-3" />
                                Imprimer
                              </Button>
                              {sortie.frais.resteAPayer > 0 && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  <CreditCard className="mr-2 h-3 w-3" />
                                  Facturation
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                className={cn(
                                  isPret 
                                    ? "bg-green-600 hover:bg-green-700" 
                                    : "bg-gray-400 cursor-not-allowed"
                                )}
                                onClick={() => handleValiderSortie(sortie)}
                                disabled={!isPret}
                              >
                                <CheckCircle className="mr-2 h-3 w-3" />
                                Valider sortie
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredSorties.length === 0 && (
                  <div className="text-center py-12">
                    <LogOut className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune sortie trouvée</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
