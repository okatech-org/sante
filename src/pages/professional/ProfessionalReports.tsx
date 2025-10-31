import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, Calendar, BarChart3, Activity,
  Users, DollarSign, Stethoscope, TrendingUp, Plus
} from 'lucide-react';

export default function ProfessionalReports() {
  const reports = [
    {
      id: 1,
      title: 'Rapport d\'activité mensuel',
      description: 'Synthèse des consultations et prescriptions du mois',
      period: 'Janvier 2025',
      type: 'activity',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      title: 'Rapport financier',
      description: 'Revenus, remboursements CNAMGS/CNSS',
      period: 'Janvier 2025',
      type: 'financial',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      title: 'Rapport de fréquentation',
      description: 'Nombre de patients, nouveaux vs suivis',
      period: 'Janvier 2025',
      type: 'patients',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 4,
      title: 'Rapport médical',
      description: 'Pathologies traitées, prescriptions courantes',
      period: 'Janvier 2025',
      type: 'medical',
      icon: Stethoscope,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 5,
      title: 'Rapport de performance',
      description: 'Indicateurs de qualité et satisfaction',
      period: 'Janvier 2025',
      type: 'performance',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const quickStats = [
    { label: 'Consultations', value: '145', icon: Stethoscope },
    { label: 'Patients uniques', value: '98', icon: Users },
    { label: 'Prescriptions', value: '132', icon: FileText },
    { label: 'Revenus (XAF)', value: '2.45M', icon: DollarSign }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Rapports
          </h1>
          <p className="text-muted-foreground mt-1">
            Synthèses et analyses d'activité
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Période personnalisée
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Liste des rapports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          
          return (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-lg ${report.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-7 w-7 ${report.color}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.period}
                    </Badge>
                    
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Télécharger PDF
                    </Button>
                    
                    <Button size="sm" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Rapports personnalisés */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Créer un rapport personnalisé</h3>
        <p className="text-muted-foreground mb-4">
          Générez un rapport sur mesure en sélectionnant les critères souhaités
        </p>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau rapport
        </Button>
      </Card>
    </div>
  );
}
