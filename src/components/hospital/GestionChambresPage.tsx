import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bed, Building, CheckCircle, AlertCircle, Wrench, Clock, User,
  Search, Filter, BedDouble, Tv, Wifi, DollarSign, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Chambre } from '@/types/hospitalisation.types';
import { toast } from 'sonner';

export function GestionChambresPage() {
  const [selectedEtage, setSelectedEtage] = useState('tous');
  const [selectedService, setSelectedService] = useState('tous');
  const [selectedStatut, setSelectedStatut] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChambre, setSelectedChambre] = useState<Chambre | null>(null);

  // Données simulées des chambres (repris de GestionChambres.tsx)
  const chambres: Chambre[] = [
    {
      id: 'ch-101',
      numero: '101',
      etage: 1,
      service: 'Urgences',
      categorie: 'standard',
      nombreLits: 2,
      statut: 'occupee',
      equipements: ['Oxygène', 'Monitoring'],
      tarifJournalier: 50000,
      patient: {
        id: 'p1',
        nom: 'MOUSSAVOU Jean',
        prenom: '',
        dateAdmission: '2025-01-30',
        medecin: 'Dr. NGUEMA',
        assurance: true
      }
    },
    {
      id: 'ch-102',
      numero: '102',
      etage: 1,
      service: 'Médecine générale',
      categorie: 'standard',
      nombreLits: 2,
      statut: 'libre',
      equipements: ['Oxygène'],
      tarifJournalier: 50000
    },
    {
      id: 'ch-103',
      numero: '103',
      etage: 1,
      service: 'Médecine générale',
      categorie: 'standard',
      nombreLits: 1,
      statut: 'nettoyage',
      equipements: [],
      tarifJournalier: 45000,
      prochaineDisponibilite: '14h00'
    },
    {
      id: 'ch-201',
      numero: '201',
      etage: 2,
      service: 'Chirurgie',
      categorie: 'superieure',
      nombreLits: 1,
      statut: 'occupee',
      equipements: ['TV', 'WiFi', 'Climatisation'],
      tarifJournalier: 75000,
      patient: {
        id: 'p2',
        nom: 'BENGONE Pierre',
        prenom: '',
        dateAdmission: '2025-01-28',
        dateSortiePrevue: '2025-01-31',
        medecin: 'Dr. OKEMBA',
        assurance: true
      }
    },
    {
      id: 'ch-202',
      numero: '202',
      etage: 2,
      service: 'Chirurgie',
      categorie: 'superieure',
      nombreLits: 1,
      statut: 'libre',
      equipements: ['TV', 'WiFi', 'Climatisation'],
      tarifJournalier: 75000
    },
    {
      id: 'ch-203',
      numero: '203',
      etage: 2,
      service: 'Cardiologie',
      categorie: 'vip',
      nombreLits: 1,
      statut: 'reservee',
      equipements: ['TV', 'WiFi', 'Climatisation', 'Frigo', 'Salon'],
      tarifJournalier: 120000,
      prochaineDisponibilite: 'Demain 10h00'
    },
    {
      id: 'ch-301',
      numero: '301',
      etage: 3,
      service: 'Maternité',
      categorie: 'standard',
      nombreLits: 1,
      statut: 'occupee',
      equipements: ['Berceau', 'Monitoring fœtal'],
      tarifJournalier: 60000,
      patient: {
        id: 'p3',
        nom: 'OYONO Sylvie',
        prenom: '',
        dateAdmission: '2025-01-31',
        medecin: 'Dr. MBOUMBA',
        assurance: true
      }
    },
    {
      id: 'ch-302',
      numero: '302',
      etage: 3,
      service: 'Maternité',
      categorie: 'superieure',
      nombreLits: 1,
      statut: 'libre',
      equipements: ['Berceau', 'TV', 'WiFi', 'Climatisation'],
      tarifJournalier: 85000
    },
    {
      id: 'ch-303',
      numero: '303',
      etage: 3,
      service: 'Pédiatrie',
      categorie: 'standard',
      nombreLits: 2,
      statut: 'maintenance',
      equipements: ['Monitoring pédiatrique'],
      tarifJournalier: 55000
    },
    {
      id: 'ch-401',
      numero: '401',
      etage: 4,
      service: 'VIP',
      categorie: 'suite',
      nombreLits: 1,
      statut: 'libre',
      equipements: ['TV', 'WiFi', 'Climatisation', 'Frigo', 'Salon', 'Cuisine', 'Bureau'],
      tarifJournalier: 250000
    },
    {
      id: 'ch-402',
      numero: '402',
      etage: 4,
      service: 'VIP',
      categorie: 'suite',
      nombreLits: 1,
      statut: 'occupee',
      equipements: ['TV', 'WiFi', 'Climatisation', 'Frigo', 'Salon', 'Cuisine', 'Bureau'],
      tarifJournalier: 250000,
      patient: {
        id: 'p4',
        nom: 'VIP Patient',
        prenom: '',
        dateAdmission: '2025-01-25',
        medecin: 'Dr. NZENGUE',
        assurance: false
      }
    }
  ];

  const filteredChambres = chambres.filter(chambre => {
    if (selectedEtage !== 'tous' && chambre.etage !== parseInt(selectedEtage)) return false;
    if (selectedService !== 'tous' && chambre.service !== selectedService) return false;
    if (selectedStatut !== 'tous' && chambre.statut !== selectedStatut) return false;
    if (searchQuery && !chambre.numero.includes(searchQuery)) return false;
    return true;
  });

  const chambresByEtage = filteredChambres.reduce((acc, chambre) => {
    if (!acc[chambre.etage]) acc[chambre.etage] = [];
    acc[chambre.etage].push(chambre);
    return acc;
  }, {} as Record<number, Chambre[]>);

  const stats = {
    total: chambres.length,
    libres: chambres.filter(c => c.statut === 'libre').length,
    occupees: chambres.filter(c => c.statut === 'occupee').length,
    nettoyage: chambres.filter(c => c.statut === 'nettoyage').length,
    maintenance: chambres.filter(c => c.statut === 'maintenance').length,
    reservees: chambres.filter(c => c.statut === 'reservee').length
  };

  const getStatutColor = (statut: Chambre['statut']) => {
    switch (statut) {
      case 'libre':
        return 'bg-green-100 text-green-700 dark:bg-green-950/50';
      case 'occupee':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/50';
      case 'nettoyage':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50';
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950/50';
      case 'reservee':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/50';
      default:
        return '';
    }
  };

  const getStatutIcon = (statut: Chambre['statut']) => {
    switch (statut) {
      case 'libre':
        return <CheckCircle className="h-3 w-3" />;
      case 'occupee':
        return <User className="h-3 w-3" />;
      case 'nettoyage':
        return <AlertCircle className="h-3 w-3" />;
      case 'maintenance':
        return <Wrench className="h-3 w-3" />;
      case 'reservee':
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getCategorieColor = (categorie: Chambre['categorie']) => {
    switch (categorie) {
      case 'standard':
        return 'border-gray-300 dark:border-gray-600';
      case 'superieure':
        return 'border-blue-300 dark:border-blue-600';
      case 'vip':
        return 'border-purple-300 dark:border-purple-600';
      case 'suite':
        return 'border-yellow-300 dark:border-yellow-600';
      default:
        return '';
    }
  };

  const handleSelectChambre = (chambre: Chambre) => {
    setSelectedChambre(chambre);
    if (chambre.statut === 'libre') {
      toast.success(`Chambre ${chambre.numero} disponible pour attribution`);
    } else {
      toast.info(`Chambre ${chambre.numero} - ${chambre.statut}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-6 w-6 text-green-600" />
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Chambres</h1>
          </div>
          <p className="text-muted-foreground">Plan interactif et état d'occupation des chambres</p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.libres}</p>
            <p className="text-xs text-muted-foreground">Libres</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.occupees}</p>
            <p className="text-xs text-muted-foreground">Occupées</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.nettoyage}</p>
            <p className="text-xs text-muted-foreground">Nettoyage</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-700 dark:text-orange-400">{stats.maintenance}</p>
            <p className="text-xs text-muted-foreground">Maintenance</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.reservees}</p>
            <p className="text-xs text-muted-foreground">Réservées</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border-0 shadow-md">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-700 dark:text-gray-400">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <Input
          placeholder="Rechercher chambre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[200px]"
        />
        
        <Select value={selectedEtage} onValueChange={setSelectedEtage}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Étage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les étages</SelectItem>
            <SelectItem value="1">Étage 1</SelectItem>
            <SelectItem value="2">Étage 2</SelectItem>
            <SelectItem value="3">Étage 3</SelectItem>
            <SelectItem value="4">Étage 4</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les services</SelectItem>
            <SelectItem value="Urgences">Urgences</SelectItem>
            <SelectItem value="Médecine générale">Médecine générale</SelectItem>
            <SelectItem value="Chirurgie">Chirurgie</SelectItem>
            <SelectItem value="Cardiologie">Cardiologie</SelectItem>
            <SelectItem value="Maternité">Maternité</SelectItem>
            <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatut} onValueChange={setSelectedStatut}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous</SelectItem>
            <SelectItem value="libre">Libre</SelectItem>
            <SelectItem value="occupee">Occupée</SelectItem>
            <SelectItem value="nettoyage">Nettoyage</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="reservee">Réservée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <CheckCircle className="mr-1 h-3 w-3" />
          Libre
        </Badge>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <User className="mr-1 h-3 w-3" />
          Occupée
        </Badge>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
          <AlertCircle className="mr-1 h-3 w-3" />
          Nettoyage
        </Badge>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          <Wrench className="mr-1 h-3 w-3" />
          Maintenance
        </Badge>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Clock className="mr-1 h-3 w-3" />
          Réservée
        </Badge>
      </div>

      {/* Plan des chambres */}
      <ScrollArea className="h-[calc(100vh-32rem)]">
        <div className="space-y-6">
          {Object.entries(chambresByEtage).map(([etage, chambresEtage]) => (
            <div key={etage}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 sticky top-0 bg-background z-10 pb-2">
                <Building className="h-5 w-5" />
                Étage {etage}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {chambresEtage.map(chambre => (
                  <Card
                    key={chambre.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg border-2",
                      getCategorieColor(chambre.categorie),
                      chambre.statut === 'libre' && 'hover:border-green-500',
                      selectedChambre?.id === chambre.id && 'ring-2 ring-blue-500'
                    )}
                    onClick={() => handleSelectChambre(chambre)}
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-bold">
                            {chambre.numero}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {chambre.service}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={cn("text-xs", getStatutColor(chambre.statut))}
                        >
                          {getStatutIcon(chambre.statut)}
                          <span className="ml-1">
                            {chambre.statut === 'libre' && 'Libre'}
                            {chambre.statut === 'occupee' && 'Occupée'}
                            {chambre.statut === 'nettoyage' && 'Nettoyage'}
                            {chambre.statut === 'maintenance' && 'Maintenance'}
                            {chambre.statut === 'reservee' && 'Réservée'}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="capitalize">
                          {chambre.categorie}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-3 w-3" />
                          {chambre.nombreLits}
                        </span>
                      </div>

                      {chambre.patient && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-2 space-y-1">
                          <p className="text-xs font-medium truncate">
                            {chambre.patient.nom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Depuis {format(new Date(chambre.patient.dateAdmission), 'dd/MM', { locale: fr })}
                          </p>
                          {chambre.patient.dateSortiePrevue && (
                            <p className="text-xs text-orange-600">
                              Sortie: {format(new Date(chambre.patient.dateSortiePrevue), 'dd/MM', { locale: fr })}
                            </p>
                          )}
                        </div>
                      )}

                      {chambre.prochaineDisponibilite && (
                        <p className="text-xs text-muted-foreground">
                          <Clock className="inline h-3 w-3 mr-1" />
                          Dispo: {chambre.prochaineDisponibilite}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t">
                        <span className="text-xs text-muted-foreground">Tarif/jour</span>
                        <span className="text-xs font-semibold">
                          {new Intl.NumberFormat('fr-GA').format(chambre.tarifJournalier)} F
                        </span>
                      </div>

                      {chambre.equipements.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {chambre.equipements.includes('TV') && (
                            <Tv className="h-3 w-3 text-muted-foreground" />
                          )}
                          {chambre.equipements.includes('WiFi') && (
                            <Wifi className="h-3 w-3 text-muted-foreground" />
                          )}
                          {chambre.equipements.includes('Climatisation') && (
                            <div className="h-3 w-3 text-muted-foreground">❄️</div>
                          )}
                          {chambre.equipements.includes('Oxygène') && (
                            <div className="h-3 w-3 text-muted-foreground">O₂</div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
