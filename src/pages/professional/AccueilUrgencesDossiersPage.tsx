import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Search, Filter, Clock, AlertTriangle, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AccueilUrgencesDossiersPage() {
  // Données mock pour les dossiers d'urgence
  const dossiersUrgence = [
    {
      id: 'URG-20250131-001',
      patient: 'Jean-Paul Mbele',
      age: '45 ans',
      motif: 'Douleur thoracique aiguë',
      niveau: 2,
      heureArrivee: '08:45',
      tempsAttente: '15 min',
      statut: 'En consultation',
      box: 'Box 3',
      medecin: 'Dr. Nze',
      constantesVitales: {
        ta: '150/95',
        fc: '110',
        temp: '37.2',
        spo2: '94%'
      }
    },
    {
      id: 'URG-20250131-002',
      patient: 'Marie Oyono',
      age: '28 ans',
      motif: 'Traumatisme crânien',
      niveau: 1,
      heureArrivee: '09:15',
      tempsAttente: '0 min',
      statut: 'En réanimation',
      box: 'Salle de réa',
      medecin: 'Dr. Obiang',
      constantesVitales: {
        ta: '90/60',
        fc: '130',
        temp: '36.5',
        spo2: '88%'
      }
    },
    {
      id: 'URG-20250131-003',
      patient: 'Pierre Dupont',
      age: '62 ans',
      motif: 'Fièvre et toux persistante',
      niveau: 3,
      heureArrivee: '09:30',
      tempsAttente: '45 min',
      statut: 'En attente',
      box: '-',
      medecin: '-',
      constantesVitales: {
        ta: '130/80',
        fc: '92',
        temp: '38.5',
        spo2: '96%'
      }
    },
    {
      id: 'URG-20250131-004',
      patient: 'Sophie Nze',
      age: '35 ans',
      motif: 'Douleur abdominale',
      niveau: 4,
      heureArrivee: '10:00',
      tempsAttente: '1h 30min',
      statut: 'En examen',
      box: 'Box 1',
      medecin: 'Dr. Mbele',
      constantesVitales: {
        ta: '120/75',
        fc: '85',
        temp: '37.0',
        spo2: '98%'
      }
    }
  ];

  const getNiveauBadge = (niveau: number) => {
    const config = {
      1: { color: 'bg-red-600', label: 'Niveau 1' },
      2: { color: 'bg-orange-600', label: 'Niveau 2' },
      3: { color: 'bg-yellow-600', label: 'Niveau 3' },
      4: { color: 'bg-green-600', label: 'Niveau 4' },
      5: { color: 'bg-blue-600', label: 'Niveau 5' }
    };
    return (
      <Badge className={`${config[niveau].color} text-white`}>
        {config[niveau].label}
      </Badge>
    );
  };

  const getStatutBadge = (statut: string) => {
    const config = {
      'En attente': 'bg-gray-500',
      'En consultation': 'bg-blue-500',
      'En examen': 'bg-purple-500',
      'En réanimation': 'bg-red-500',
      'En observation': 'bg-yellow-500'
    };
    return (
      <Badge className={`${config[statut] || 'bg-gray-500'} text-white`}>
        {statut}
      </Badge>
    );
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dossiers Urgences</h1>
            <p className="text-muted-foreground">Suivi des dossiers patients en urgence</p>
          </div>
          <div className="flex gap-2">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <AlertTriangle className="mr-2 h-5 w-5" />
              URGENCE VITALE
            </Button>
          </div>
        </div>

        {/* Statistiques en temps réel */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full" />
                Niveau 1
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">En réanimation</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 dark:bg-orange-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full" />
                Niveau 2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Très urgent</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded-full" />
                Niveau 3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Urgent</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                Niveau 4
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Peu urgent</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                Total actif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Patients présents</p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <Card>
          <CardHeader>
            <CardTitle>Rechercher un dossier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input 
                placeholder="Numéro de dossier, nom du patient..." 
                className="flex-1"
              />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des dossiers */}
        <div className="space-y-4">
          {dossiersUrgence.map((dossier) => (
            <Card key={dossier.id} className={`border-l-4 ${
              dossier.niveau === 1 ? 'border-l-red-600' :
              dossier.niveau === 2 ? 'border-l-orange-600' :
              dossier.niveau === 3 ? 'border-l-yellow-600' :
              dossier.niveau === 4 ? 'border-l-green-600' :
              'border-l-blue-600'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* En-tête du dossier */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-bold">{dossier.id}</span>
                      {getNiveauBadge(dossier.niveau)}
                      {getStatutBadge(dossier.statut)}
                      {dossier.box !== '-' && (
                        <Badge variant="outline">📍 {dossier.box}</Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Attente: {dossier.tempsAttente}</span>
                      </div>
                    </div>

                    {/* Informations patient */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{dossier.patient}</span>
                          <span className="text-muted-foreground">• {dossier.age}</span>
                        </div>
                        <div className="text-sm text-muted-foreground ml-6">
                          Motif: {dossier.motif}
                        </div>
                        {dossier.medecin !== '-' && (
                          <div className="text-sm text-muted-foreground ml-6">
                            Médecin: {dossier.medecin}
                          </div>
                        )}
                      </div>
                      
                      {/* Constantes vitales */}
                      <div className="flex items-center gap-4 text-sm">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-3">
                          <span>TA: <strong>{dossier.constantesVitales.ta}</strong></span>
                          <span>FC: <strong>{dossier.constantesVitales.fc}</strong></span>
                          <span>T°: <strong>{dossier.constantesVitales.temp}°C</strong></span>
                          <span>SpO₂: <strong>{dossier.constantesVitales.spo2}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                    {dossier.statut === 'En attente' && (
                      <Button size="sm" variant="default">
                        Appeler patient
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerte délais dépassés */}
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Alertes - Délais dépassés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-background">
                <span className="text-sm">Pierre Dupont (Niveau 3) - En attente depuis 45 min</span>
                <Badge className="bg-orange-600 text-white">Délai dépassé</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Les patients de niveau 3 doivent être pris en charge dans les 60 minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
