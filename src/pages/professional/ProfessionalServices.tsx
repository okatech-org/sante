import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Users, Activity, TrendingUp, 
  Bed, Clock, AlertCircle, CheckCircle
} from 'lucide-react';

export default function ProfessionalServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Données fictives des services
  const services = [
    {
      id: 1,
      name: 'Médecine Générale',
      chief: 'Dr. Marie OKEMBA',
      beds: 20,
      occupied: 15,
      staff: 8,
      patients: 45,
      status: 'optimal',
      description: 'Consultations générales et suivi des patients'
    },
    {
      id: 2,
      name: 'Cardiologie',
      chief: 'Dr. Paul NGUEMA',
      beds: 15,
      occupied: 12,
      staff: 6,
      patients: 32,
      status: 'busy',
      description: 'Pathologies cardiovasculaires'
    },
    {
      id: 3,
      name: 'Pédiatrie',
      chief: 'Dr. Sophie MBOUMBA',
      beds: 25,
      occupied: 18,
      staff: 10,
      patients: 52,
      status: 'optimal',
      description: 'Soins pédiatriques et néonatologie'
    },
    {
      id: 4,
      name: 'Chirurgie',
      chief: 'Dr. André MOUSSAVOU',
      beds: 18,
      occupied: 10,
      staff: 12,
      patients: 28,
      status: 'available',
      description: 'Interventions chirurgicales programmées et urgences'
    },
    {
      id: 5,
      name: 'Urgences',
      chief: 'Dr. Jean NDONG',
      beds: 12,
      occupied: 11,
      staff: 15,
      patients: 68,
      status: 'critical',
      description: 'Service d\'urgences 24/7'
    },
    {
      id: 6,
      name: 'Maternité',
      chief: 'Dr. Sylvie MBA',
      beds: 20,
      occupied: 14,
      staff: 9,
      patients: 38,
      status: 'optimal',
      description: 'Gynécologie-obstétrique'
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      optimal: { label: 'Optimal', variant: 'secondary' as const, icon: CheckCircle, color: 'text-green-600' },
      available: { label: 'Disponible', variant: 'outline' as const, icon: CheckCircle, color: 'text-blue-600' },
      busy: { label: 'Chargé', variant: 'default' as const, icon: Activity, color: 'text-orange-600' },
      critical: { label: 'Saturé', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' }
    };
    return badges[status as keyof typeof badges] || badges.optimal;
  };

  const totalStats = {
    beds: services.reduce((sum, s) => sum + s.beds, 0),
    occupied: services.reduce((sum, s) => sum + s.occupied, 0),
    staff: services.reduce((sum, s) => sum + s.staff, 0),
    patients: services.reduce((sum, s) => sum + s.patients, 0)
  };

  const occupancyRate = Math.round((totalStats.occupied / totalStats.beds) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Services
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion des départements et services médicaux
          </p>
        </div>
        <Button className="gap-2">
          <Building2 className="h-4 w-4" />
          Nouveau service
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Lits</p>
              <p className="text-2xl font-bold">{totalStats.beds}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStats.occupied} occupés
              </p>
            </div>
            <Bed className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux occupation</p>
              <p className="text-2xl font-bold">{occupancyRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Capacité globale
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Personnel</p>
              <p className="text-2xl font-bold">{totalStats.staff}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Toutes équipes
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Patients actifs</p>
              <p className="text-2xl font-bold">{totalStats.patients}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tous services
              </p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Grid des services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => {
          const statusBadge = getStatusBadge(service.status);
          const StatusIcon = statusBadge.icon;
          const bedOccupancy = Math.round((service.occupied / service.beds) * 100);
          
          return (
            <Card 
              key={service.id} 
              className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                selectedService === service.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedService(service.id === selectedService ? null : service.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chef de service : {service.chief}
                  </p>
                </div>
                <Badge variant={statusBadge.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {statusBadge.label}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {service.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span>{service.occupied}/{service.beds} lits</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{service.staff} personnels</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{service.patients} patients</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{bedOccupancy}% occupation</span>
                </div>
              </div>

              {/* Barre de progression occupation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Occupation des lits</span>
                  <span>{service.occupied}/{service.beds}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      bedOccupancy >= 90 ? 'bg-red-500' :
                      bedOccupancy >= 70 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${bedOccupancy}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Détails service sélectionné */}
      {selectedService && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Détails - {services.find(s => s.id === selectedService)?.name}
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Voir planning
              </Button>
              <Button variant="outline" size="sm">
                Statistiques
              </Button>
              <Button size="sm">
                Gérer
              </Button>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            Options de gestion et statistiques détaillées du service sélectionné
          </p>
        </Card>
      )}
    </div>
  );
}
