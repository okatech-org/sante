import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, Wrench, Activity, AlertTriangle,
  CheckCircle, Calendar, DollarSign, Zap
} from 'lucide-react';

export default function ProfessionalInfrastructure() {
  const [activeTab, setActiveTab] = useState('buildings');

  // Données fictives
  const buildings = [
    {
      id: 1,
      name: 'Bâtiment Principal',
      type: 'Médical',
      area: '5000 m²',
      floors: 4,
      status: 'operational',
      lastMaintenance: '2025-01-15',
      nextMaintenance: '2025-04-15'
    },
    {
      id: 2,
      name: 'Aile Chirurgicale',
      type: 'Chirurgie',
      area: '2500 m²',
      floors: 2,
      status: 'operational',
      lastMaintenance: '2025-01-10',
      nextMaintenance: '2025-04-10'
    },
    {
      id: 3,
      name: 'Centre Administratif',
      type: 'Administration',
      area: '1500 m²',
      floors: 3,
      status: 'maintenance',
      lastMaintenance: '2024-12-20',
      nextMaintenance: '2025-02-01'
    }
  ];

  const equipment = [
    {
      id: 1,
      name: 'IRM 3 Tesla',
      category: 'Imagerie',
      location: 'Radiologie',
      status: 'operational',
      maintenanceContract: 'Actif',
      lastCheck: '2025-01-20'
    },
    {
      id: 2,
      name: 'Scanner CT',
      category: 'Imagerie',
      location: 'Urgences',
      status: 'operational',
      maintenanceContract: 'Actif',
      lastCheck: '2025-01-18'
    },
    {
      id: 3,
      name: 'Échographe Doppler',
      category: 'Imagerie',
      location: 'Cardiologie',
      status: 'maintenance',
      maintenanceContract: 'Actif',
      lastCheck: '2025-01-25'
    },
    {
      id: 4,
      name: 'Respirateur artificiel (x10)',
      category: 'Réanimation',
      location: 'Soins Intensifs',
      status: 'operational',
      maintenanceContract: 'Actif',
      lastCheck: '2025-01-22'
    },
    {
      id: 5,
      name: 'Groupe électrogène principal',
      category: 'Énergie',
      location: 'Sous-sol',
      status: 'operational',
      maintenanceContract: 'Actif',
      lastCheck: '2025-01-15'
    }
  ];

  const utilities = [
    {
      id: 1,
      name: 'Électricité',
      consumption: '850 kWh/jour',
      cost: '125,000 XAF/mois',
      status: 'normal',
      backup: 'Groupe électrogène 500kVA'
    },
    {
      id: 2,
      name: 'Eau',
      consumption: '120 m³/jour',
      cost: '85,000 XAF/mois',
      status: 'normal',
      backup: 'Réservoir 500m³'
    },
    {
      id: 3,
      name: 'Climatisation',
      coverage: '95%',
      status: 'optimal',
      units: '45 unités',
      maintenance: 'Trimestrielle'
    },
    {
      id: 4,
      name: 'Oxygène médical',
      capacity: '5000L',
      consumption: '250L/jour',
      status: 'normal',
      backup: 'Bouteilles de secours'
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      operational: { label: 'Opérationnel', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600' },
      maintenance: { label: 'Maintenance', variant: 'default' as const, icon: Wrench, color: 'text-orange-600' },
      critical: { label: 'Critique', variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.operational;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Infrastructure
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des bâtiments et équipements
          </p>
        </div>
        <Button className="gap-2">
          <Wrench className="h-4 w-4" />
          Demande maintenance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Bâtiments</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground mt-1">9000 m² total</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Équipements</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-muted-foreground mt-1">42 actifs</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Maintenances</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
            </div>
            <Wrench className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Coûts mensuels</p>
              <p className="text-2xl font-bold">2.5M</p>
              <p className="text-xs text-muted-foreground mt-1">XAF</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buildings">Bâtiments</TabsTrigger>
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="utilities">Utilités</TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="space-y-4">
          {buildings.map((building) => {
            const statusBadge = getStatusBadge(building.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <Card key={building.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{building.name}</h3>
                      <Badge variant={statusBadge.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Type</p>
                        <p className="font-medium">{building.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Surface</p>
                        <p className="font-medium">{building.area}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Étages</p>
                        <p className="font-medium">{building.floors}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Prochaine maintenance</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(building.nextMaintenance).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Détails
                  </Button>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          {equipment.map((item) => {
            const statusBadge = getStatusBadge(item.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <Card key={item.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <Badge variant={statusBadge.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusBadge.label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Catégorie</p>
                        <p className="font-medium">{item.category}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Localisation</p>
                        <p className="font-medium">{item.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Contrat maintenance</p>
                        <p className="font-medium">{item.maintenanceContract}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Dernier contrôle</p>
                        <p className="font-medium">
                          {new Date(item.lastCheck).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Historique
                  </Button>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="utilities" className="space-y-4">
          {utilities.map((utility) => (
            <Card key={utility.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3">{utility.name}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {utility.consumption && (
                        <div>
                          <p className="text-muted-foreground mb-1">Consommation</p>
                          <p className="font-medium">{utility.consumption}</p>
                        </div>
                      )}
                      {utility.cost && (
                        <div>
                          <p className="text-muted-foreground mb-1">Coût</p>
                          <p className="font-medium">{utility.cost}</p>
                        </div>
                      )}
                      {utility.backup && (
                        <div>
                          <p className="text-muted-foreground mb-1">Secours</p>
                          <p className="font-medium">{utility.backup}</p>
                        </div>
                      )}
                      {utility.coverage && (
                        <div>
                          <p className="text-muted-foreground mb-1">Couverture</p>
                          <p className="font-medium">{utility.coverage}</p>
                        </div>
                      )}
                      {utility.units && (
                        <div>
                          <p className="text-muted-foreground mb-1">Unités</p>
                          <p className="font-medium">{utility.units}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Badge variant={utility.status === 'normal' ? 'secondary' : 'default'}>
                  {utility.status}
                </Badge>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
