import { ProfessionalEstablishmentLayout } from '@/components/layout/ProfessionalEstablishmentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Activity, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AccueilHDJFilesAttentePage() {
  // Données mock pour les files d'attente par service
  const queues = [
    {
      service: 'Consultation Générale',
      icon: Users,
      patients: 12,
      avgWait: '25 min',
      nextPatient: 'Jean Dupont',
      trend: 'up',
      color: 'blue'
    },
    {
      service: 'Cardiologie',
      icon: Activity,
      patients: 5,
      avgWait: '40 min',
      nextPatient: 'Marie Nzé',
      trend: 'stable',
      color: 'red'
    },
    {
      service: 'Radiologie',
      icon: Activity,
      patients: 8,
      avgWait: '15 min',
      nextPatient: 'Pierre Mbele',
      trend: 'down',
      color: 'purple'
    },
    {
      service: 'Laboratoire',
      icon: Activity,
      patients: 3,
      avgWait: '10 min',
      nextPatient: 'Sophie Oyono',
      trend: 'down',
      color: 'green'
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-red-500';
    if (trend === 'down') return 'text-green-500';
    return 'text-yellow-500';
  };

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Files d'attente</h1>
            <p className="text-muted-foreground">Suivi en temps réel des files d'attente par service</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="mr-2 h-3 w-3" />
              Temps moyen global: 22 min
            </Badge>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total patients en attente
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-12%</span> vs hier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Temps d'attente moyen
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22 min</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-5 min</span> vs moyenne
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Service le plus chargé
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Consultation</div>
              <p className="text-xs text-muted-foreground">
                12 patients en attente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Patients traités aujourd'hui
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8%</span> vs objectif
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Files d'attente par service */}
        <div className="grid gap-6 md:grid-cols-2">
          {queues.map((queue) => (
            <Card key={queue.service} className="overflow-hidden">
              <CardHeader className={`bg-${queue.color}-50 dark:bg-${queue.color}-950/20`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <queue.icon className={`h-5 w-5 text-${queue.color}-600`} />
                    <CardTitle>{queue.service}</CardTitle>
                  </div>
                  <Badge variant="outline" className="font-semibold">
                    {queue.patients} patients
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Temps d'attente moyen</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{queue.avgWait}</span>
                      <span className={`${getTrendColor(queue.trend)} font-bold`}>
                        {getTrendIcon(queue.trend)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prochain patient</span>
                    <span className="font-medium">{queue.nextPatient}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex gap-1">
                      {[...Array(Math.min(queue.patients, 10))].map((_, i) => (
                        <div 
                          key={i}
                          className={`h-8 w-2 bg-${queue.color}-500 rounded-full opacity-${100 - i * 10}`}
                        />
                      ))}
                      {queue.patients > 10 && (
                        <span className="text-xs text-muted-foreground ml-2 self-center">
                          +{queue.patients - 10}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Gérer les files d'attente et optimiser le flux de patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Appeler patient suivant
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Transférer patient
              </button>
              <button className="px-4 py-2 border rounded hover:bg-muted">
                Voir historique
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}
