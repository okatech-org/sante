import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar, Search, Users, Clock, AlertCircle, 
  CheckCircle, Printer, CreditCard, Shield, User,
  ChevronRight, FileText, Activity, Phone, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  RendezVous, 
  StatutRDV, 
  DossierAccueilHDJ,
  formatNumeroDossier,
  TARIFS_CONVENTIONNES 
} from '@/types/accueil.types';
import { PatientCheckInModal } from './PatientCheckInModal';
import { FileAttenteWidget } from './FileAttenteWidget';
import { useCNAMGSVerification } from '@/hooks/useCNAMGSVerification';

export function AccueilHDJ() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('tous');
  const [selectedStatut, setSelectedStatut] = useState<StatutRDV | 'tous'>('tous');
  const [rendezVousList, setRendezVousList] = useState<RendezVous[]>([]);
  const [selectedRDV, setSelectedRDV] = useState<RendezVous | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les rendez-vous du jour
  useEffect(() => {
    loadRendezVous();
  }, [selectedDate, selectedService, selectedStatut]);

  const loadRendezVous = async () => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      const mockRDV: RendezVous[] = [
        {
          id: 'rdv-001',
          patient: {
            id: 'pat-001',
            nom: 'NZÉ',
            prenom: 'Marie',
            dateNaissance: '1980-05-15',
            sexe: 'F',
            telephone: '074567890',
            numeroAssureCNAMGS: 'GAB123456789'
          },
          dateHeure: '2025-01-31T10:00:00',
          service: 'Cardiologie',
          medecin: {
            id: 'med-001',
            nom: 'OKEMBA',
            prenom: 'Marie',
            specialite: 'Cardiologie'
          },
          motif: 'Consultation de suivi',
          statut: 'confirme'
        },
        {
          id: 'rdv-002',
          patient: {
            id: 'pat-002',
            nom: 'MOUSSAVOU',
            prenom: 'Jean',
            dateNaissance: '1975-08-20',
            sexe: 'M',
            telephone: '077123456',
            numeroAssureCNAMGS: 'GAB987654321'
          },
          dateHeure: '2025-01-31T11:00:00',
          service: 'Médecine Générale',
          medecin: {
            id: 'med-002',
            nom: 'NGUEMA',
            prenom: 'Paul',
            specialite: 'Médecine Générale'
          },
          motif: 'Bilan de santé',
          statut: 'arrive'
        },
        {
          id: 'rdv-003',
          patient: {
            id: 'pat-003',
            nom: 'KOMBILA',
            prenom: 'Sophie',
            dateNaissance: '1990-03-12',
            sexe: 'F',
            telephone: '062345678',
            numeroAssureCNAMGS: 'GAB456789123'
          },
          dateHeure: '2025-01-31T14:00:00',
          service: 'Gynécologie',
          medecin: {
            id: 'med-003',
            nom: 'MBINA',
            prenom: 'Léa',
            specialite: 'Gynécologie'
          },
          motif: 'Suivi grossesse',
          statut: 'confirme'
        }
      ];

      // Filtrer selon les critères
      let filtered = mockRDV;
      
      if (selectedService !== 'tous') {
        filtered = filtered.filter(rdv => rdv.service === selectedService);
      }
      
      if (selectedStatut !== 'tous') {
        filtered = filtered.filter(rdv => rdv.statut === selectedStatut);
      }
      
      if (searchQuery) {
        filtered = filtered.filter(rdv => 
          rdv.patient.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rdv.patient.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rdv.patient.numeroAssureCNAMGS?.includes(searchQuery) ||
          rdv.patient.telephone.includes(searchQuery)
        );
      }

      setRendezVousList(filtered);
    } catch (error) {
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatutColor = (statut: StatutRDV) => {
    switch (statut) {
      case 'arrive':
        return 'bg-green-500';
      case 'en_consultation':
        return 'bg-blue-500';
      case 'confirme':
        const now = new Date();
        const rdvTime = new Date(selectedDate);
        const diffHours = (rdvTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (diffHours < 1) return 'bg-orange-500'; // Attendu dans l'heure
        return 'bg-gray-500';
      case 'termine':
        return 'bg-gray-400';
      case 'annule':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCheckIn = (rdv: RendezVous) => {
    setSelectedRDV(rdv);
    setShowCheckInModal(true);
  };

  const handleCheckInComplete = async (dossier: DossierAccueilHDJ) => {
    // Mettre à jour le statut du RDV
    const updatedList = rendezVousList.map(rdv => 
      rdv.id === dossier.rendezVous.id 
        ? { ...rdv, statut: 'arrive' as StatutRDV }
        : rdv
    );
    setRendezVousList(updatedList);
    setShowCheckInModal(false);
    
    toast.success(
      `Patient ${dossier.patient.nom} ${dossier.patient.prenom} enregistré`,
      {
        description: `Dossier ${dossier.numeroDossier} créé`
      }
    );
  };

  const services = ['tous', 'Médecine Générale', 'Cardiologie', 'Gynécologie', 'Pédiatrie', 'Radiologie'];

  // Statistiques
  const stats = {
    total: rendezVousList.length,
    arrives: rendezVousList.filter(r => r.statut === 'arrive').length,
    enAttente: rendezVousList.filter(r => r.statut === 'confirme').length,
    enConsultation: rendezVousList.filter(r => r.statut === 'en_consultation').length,
  };

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                Patients aujourd'hui
              </p>
              <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{stats.total}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">
                Total des RDV
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 gap-1">
                <Clock className="h-3 w-3" />
                Actif
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                Arrivés
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.arrives}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                Patients présents
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                En attente
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
                En attente
              </p>
              <h3 className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.enAttente}</h3>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-2">
                À enregistrer
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                Actif
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                En consultation
              </p>
              <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.enConsultation}</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                Avec médecin
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, téléphone ou N° CNAMGS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {services.map(service => (
                <option key={service} value={service}>
                  {service === 'tous' ? 'Tous les services' : service}
                </option>
              ))}
            </select>

            <select
              value={selectedStatut}
              onChange={(e) => setSelectedStatut(e.target.value as StatutRDV | 'tous')}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="tous">Tous les statuts</option>
              <option value="confirme">Confirmé</option>
              <option value="arrive">Arrivé</option>
              <option value="en_consultation">En consultation</option>
              <option value="termine">Terminé</option>
            </select>

            <Button variant="default">
              <Users className="mr-2 h-4 w-4" />
              Nouveau patient sans RDV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous du {format(selectedDate, 'd MMMM yyyy', { locale: fr })}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Chargement...</p>
            </div>
          ) : rendezVousList.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rendezVousList.map((rdv) => (
                <div
                  key={rdv.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-16 rounded-full ${getStatutColor(rdv.statut)}`} />
                    
                    <div className="text-center min-w-[60px]">
                      <div className="text-xl font-bold">
                        {format(new Date(rdv.dateHeure), 'HH:mm')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {rdv.service}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {rdv.patient.nom} {rdv.patient.prenom}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {rdv.patient.telephone}
                          {rdv.patient.numeroAssureCNAMGS && (
                            <>
                              <span>•</span>
                              <Shield className="h-3 w-3" />
                              {rdv.patient.numeroAssureCNAMGS}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">Dr. {rdv.medecin.nom}</p>
                      <p className="text-xs text-muted-foreground">{rdv.motif}</p>
                    </div>

                    <Badge variant={
                      rdv.statut === 'arrive' ? 'success' :
                      rdv.statut === 'en_consultation' ? 'default' :
                      rdv.statut === 'confirme' ? 'secondary' :
                      'outline'
                    }>
                      {rdv.statut === 'confirme' && 'Confirmé'}
                      {rdv.statut === 'arrive' && 'Arrivé'}
                      {rdv.statut === 'en_consultation' && 'En consultation'}
                      {rdv.statut === 'termine' && 'Terminé'}
                    </Badge>

                    {rdv.statut === 'confirme' && (
                      <Button 
                        size="sm"
                        onClick={() => handleCheckIn(rdv)}
                      >
                        Enregistrer arrivée
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}

                    {rdv.statut === 'arrive' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Widget Files d'attente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FileAttenteWidget serviceId="medecine-generale" serviceName="Médecine Générale" />
        <FileAttenteWidget serviceId="cardiologie" serviceName="Cardiologie" />
        <FileAttenteWidget serviceId="gynecologie" serviceName="Gynécologie" />
      </div>

      {/* Modal d'enregistrement */}
      {selectedRDV && (
        <PatientCheckInModal
          open={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          rendezVous={selectedRDV}
          onCheckInComplete={handleCheckInComplete}
        />
      )}
    </div>
  );
}