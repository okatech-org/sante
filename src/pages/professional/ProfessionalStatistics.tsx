import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Calendar,
  FileText, Activity, Download
} from 'lucide-react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { ROLE_LABELS } from '@/config/menuDefinitions';

export default function ProfessionalStatistics() {
  const { currentRole, currentEstablishment } = useMultiEstablishment();

  const stats = {
    thisMonth: {
      consultations: 145,
      patients: 98,
      prescriptions: 132,
      revenue: 2450000
    },
    lastMonth: {
      consultations: 132,
      patients: 89,
      prescriptions: 120,
      revenue: 2180000
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return growth.toFixed(1);
  };

  const isGrowing = (current: number, previous: number) => current > previous;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Statistiques
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentEstablishment?.establishment_name} - {ROLE_LABELS[currentRole || 'doctor']}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant={isGrowing(stats.thisMonth.consultations, stats.lastMonth.consultations) ? 'default' : 'secondary'}>
              {isGrowing(stats.thisMonth.consultations, stats.lastMonth.consultations) ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {calculateGrowth(stats.thisMonth.consultations, stats.lastMonth.consultations)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Consultations</p>
            <p className="text-3xl font-bold">{stats.thisMonth.consultations}</p>
            <p className="text-xs text-muted-foreground mt-2">
              vs {stats.lastMonth.consultations} le mois dernier
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <Badge variant={isGrowing(stats.thisMonth.patients, stats.lastMonth.patients) ? 'default' : 'secondary'}>
              {isGrowing(stats.thisMonth.patients, stats.lastMonth.patients) ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {calculateGrowth(stats.thisMonth.patients, stats.lastMonth.patients)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Patients uniques</p>
            <p className="text-3xl font-bold">{stats.thisMonth.patients}</p>
            <p className="text-xs text-muted-foreground mt-2">
              vs {stats.lastMonth.patients} le mois dernier
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <Badge variant={isGrowing(stats.thisMonth.prescriptions, stats.lastMonth.prescriptions) ? 'default' : 'secondary'}>
              {isGrowing(stats.thisMonth.prescriptions, stats.lastMonth.prescriptions) ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {calculateGrowth(stats.thisMonth.prescriptions, stats.lastMonth.prescriptions)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Prescriptions</p>
            <p className="text-3xl font-bold">{stats.thisMonth.prescriptions}</p>
            <p className="text-xs text-muted-foreground mt-2">
              vs {stats.lastMonth.prescriptions} le mois dernier
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant={isGrowing(stats.thisMonth.revenue, stats.lastMonth.revenue) ? 'default' : 'secondary'}>
              {isGrowing(stats.thisMonth.revenue, stats.lastMonth.revenue) ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {calculateGrowth(stats.thisMonth.revenue, stats.lastMonth.revenue)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Revenus (XAF)</p>
            <p className="text-3xl font-bold">{stats.thisMonth.revenue.toLocaleString('fr-FR')}</p>
            <p className="text-xs text-muted-foreground mt-2">
              vs {stats.lastMonth.revenue.toLocaleString('fr-FR')} le mois dernier
            </p>
          </div>
        </Card>
      </div>

      {/* Graphiques (placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Évolution des consultations
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Graphique à venir</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Répartition par type de consultation
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Graphique à venir</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activité hebdomadaire
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Graphique à venir</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenus mensuels
          </h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Graphique à venir</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
