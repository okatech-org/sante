import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Filter, Download, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AccueilHDJDossiersPage() {
  // Données mock pour les dossiers HDJ
  const dossiers = [
    {
      id: 'HDJ-20250131-001',
      patient: 'Marie Nzé',
      service: 'Cardiologie',
      medecin: 'Dr. Mbele',
      heure: '09:30',
      status: 'en cours',
      cnamgs: 'Vérifié',
      reste: '15,000 FCFA'
    },
    {
      id: 'HDJ-20250131-002',
      patient: 'Jean Dupont',
      service: 'Consultation générale',
      medecin: 'Dr. Oyono',
      heure: '09:00',
      status: 'terminé',
      cnamgs: 'Vérifié',
      reste: '5,000 FCFA'
    },
    {
      id: 'HDJ-20250131-003',
      patient: 'Pierre Mbele',
      service: 'Radiologie',
      medecin: 'Dr. Nze',
      heure: '10:00',
      status: 'en attente',
      cnamgs: 'Non vérifié',
      reste: '35,000 FCFA'
    },
    {
      id: 'HDJ-20250131-004',
      patient: 'Sophie Oyono',
      service: 'Pédiatrie',
      medecin: 'Dr. Obiang',
      heure: '10:30',
      status: 'en cours',
      cnamgs: 'Vérifié',
      reste: '0 FCFA'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'terminé':
        return <Badge className="bg-green-500 text-white">Terminé</Badge>;
      case 'en cours':
        return <Badge className="bg-blue-500 text-white">En cours</Badge>;
      case 'en attente':
        return <Badge className="bg-yellow-500 text-white">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCnamgsBadge = (status: string) => {
    if (status === 'Vérifié') {
      return <Badge variant="outline" className="border-green-500 text-green-600">CNAMGS ✓</Badge>;
    }
    return <Badge variant="outline" className="border-red-500 text-red-600">CNAMGS ✗</Badge>;
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dossiers HDJ</h1>
            <p className="text-muted-foreground">Gestion des dossiers d'accueil de l'Hôpital du Jour</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Nouveau dossier
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Dossiers du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground mt-1">
                85 terminés, 39 en cours
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Vérifications CNAMGS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">
                114 sur 124 vérifiés
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Montant total GAP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">845,000</div>
              <p className="text-xs text-muted-foreground mt-1">
                FCFA collectés aujourd'hui
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Temps traitement moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.5 min</div>
              <p className="text-xs text-muted-foreground mt-1">
                Par dossier d'accueil
              </p>
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
        <Card>
          <CardHeader>
            <CardTitle>Dossiers récents</CardTitle>
            <CardDescription>
              Derniers dossiers créés aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dossiers.map((dossier) => (
                <div key={dossier.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold">{dossier.id}</span>
                        {getStatusBadge(dossier.status)}
                        {getCnamgsBadge(dossier.cnamgs)}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">{dossier.patient}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{dossier.service}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{dossier.medecin}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{dossier.heure}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reste à charge: </span>
                        <span className="font-semibold">{dossier.reste}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
